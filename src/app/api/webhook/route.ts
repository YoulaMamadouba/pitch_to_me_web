import { NextRequest, NextResponse } from 'next/server';
import Stripe from 'stripe';
import { createClient } from '@supabase/supabase-js';

const stripe = new Stripe(process.env.STRIPE_SECRET_KEY!, {
  apiVersion: '2023-10-16',
});

// Vérification des variables d'environnement
if (!process.env.NEXT_PUBLIC_SUPABASE_URL || !process.env.SUPABASE_SERVICE_ROLE_KEY) {
  console.error('❌ Variables d\'environnement Supabase manquantes');
  console.error('NEXT_PUBLIC_SUPABASE_URL:', process.env.NEXT_PUBLIC_SUPABASE_URL ? '✅' : '❌');
  console.error('SUPABASE_SERVICE_ROLE_KEY:', process.env.SUPABASE_SERVICE_ROLE_KEY ? '✅' : '❌');
}

const supabase = createClient(
  process.env.NEXT_PUBLIC_SUPABASE_URL || '',
  process.env.SUPABASE_SERVICE_ROLE_KEY || ''
);

export async function POST(request: NextRequest) {
  const body = await request.text();
  const signature = request.headers.get('stripe-signature');

  let event: Stripe.Event;

  try {
    // En mode développement/test, on peut ignorer la signature si STRIPE_WEBHOOK_SECRET n'est pas configuré
    if (!process.env.STRIPE_WEBHOOK_SECRET) {
      console.log('⚠️ Mode développement: signature webhook ignorée');
      event = JSON.parse(body) as Stripe.Event;
    } else {
      event = stripe.webhooks.constructEvent(
        body,
        signature!,
        process.env.STRIPE_WEBHOOK_SECRET
      );
    }
  } catch (err) {
    console.error('Erreur de signature webhook:', err);
    return NextResponse.json(
      { error: 'Signature webhook invalide' },
      { status: 400 }
    );
  }

  try {
    switch (event.type) {
      case 'checkout.session.completed':
        const session = event.data.object as Stripe.Checkout.Session;
        
        try {
          // Créer l'utilisateur dans Supabase avec les données du formulaire d'inscription
          const { data: authData, error: authError } = await supabase.auth.admin.createUser({
            email: session.metadata?.userEmail,
            password: 'temp_password_' + Math.random().toString(36).substring(7), // Mot de passe temporaire
            email_confirm: true,
            user_metadata: {
              firstName: session.metadata?.userFirstName,
              lastName: session.metadata?.userLastName,
              phone: session.metadata?.userPhone,
              country: session.metadata?.userCountry,
            }
          });

          if (authError) {
            console.error('Erreur lors de la création de l\'utilisateur:', authError);
            return NextResponse.json(
              { error: 'Erreur lors de la création de l\'utilisateur' },
              { status: 500 }
            );
          }

          const userId = authData.user.id;

          // Créer l'utilisateur dans la table users également
          const { error: userInsertError } = await supabase
            .from('users')
            .insert({
              id: userId,
              email: session.metadata?.userEmail,
              name: `${session.metadata?.userFirstName} ${session.metadata?.userLastName}`,
              role: 'coach', // Rôle par défaut pour les nouveaux utilisateurs
              created_at: new Date().toISOString(),
            });

          if (userInsertError) {
            console.error('Erreur lors de l\'insertion dans la table users:', userInsertError);
            // On continue quand même car l'utilisateur existe dans auth.users
          }

          // Insérer le paiement réussi dans Supabase
          const { error: insertError } = await supabase
            .from('payments')
            .insert({
              user_id: userId,
              amount: (session.amount_total || 0) / 100, // Convertir de centimes
              currency: session.metadata?.currency?.toUpperCase(),
              status: 'completed',
              plan: session.metadata?.plan,
            });

          if (insertError) {
            console.error('Erreur lors de l\'insertion du paiement:', insertError);
            return NextResponse.json(
              { error: 'Erreur lors de l\'enregistrement du paiement' },
              { status: 500 }
            );
          }

          console.log('Utilisateur et paiement créés avec succès:', { userId, sessionId: session.id });
        } catch (error) {
          console.error('Erreur lors du traitement du paiement:', error);
          return NextResponse.json(
            { error: 'Erreur lors du traitement du paiement' },
            { status: 500 }
          );
        }
        break;

      case 'checkout.session.expired':
        const expiredSession = event.data.object as Stripe.Checkout.Session;
        
        // Insérer le paiement expiré dans Supabase
        const { error: expiredError } = await supabase
          .from('payments')
          .insert({
            user_id: expiredSession.metadata?.userId,
            amount: (expiredSession.amount_total || 0) / 100,
            currency: expiredSession.metadata?.currency?.toUpperCase(),
            status: 'failed',
            plan: expiredSession.metadata?.plan,
          });

        if (expiredError) {
          console.error('Erreur lors de l\'insertion du paiement expiré:', expiredError);
        }
        break;

      case 'payment_intent.payment_failed':
        const paymentIntent = event.data.object as Stripe.PaymentIntent;
        
        // Insérer le paiement échoué dans Supabase
        const { error: failedError } = await supabase
          .from('payments')
          .insert({
            user_id: paymentIntent.metadata?.userId,
            amount: (paymentIntent.amount || 0) / 100,
            currency: paymentIntent.currency?.toUpperCase(),
            status: 'failed',
            plan: paymentIntent.metadata?.plan,
          });

        if (failedError) {
          console.error('Erreur lors de l\'insertion du paiement échoué:', failedError);
        }
        break;

      default:
        console.log(`Événement non géré: ${event.type}`);
    }

    return NextResponse.json({ received: true });
  } catch (error) {
    console.error('Erreur lors du traitement du webhook:', error);
    return NextResponse.json(
      { error: 'Erreur interne du serveur' },
      { status: 500 }
    );
  }
}
