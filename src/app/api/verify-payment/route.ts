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
  try {
    // Vérification des variables d'environnement
    if (!process.env.NEXT_PUBLIC_SUPABASE_URL || !process.env.SUPABASE_SERVICE_ROLE_KEY) {
      console.error('❌ Variables d\'environnement Supabase manquantes');
      console.error('NEXT_PUBLIC_SUPABASE_URL:', process.env.NEXT_PUBLIC_SUPABASE_URL ? '✅' : '❌');
      console.error('SUPABASE_SERVICE_ROLE_KEY:', process.env.SUPABASE_SERVICE_ROLE_KEY ? '✅' : '❌');
      return NextResponse.json(
        { error: 'Configuration Supabase manquante' },
        { status: 500 }
      );
    }

    const { sessionId } = await request.json();

    if (!sessionId) {
      return NextResponse.json(
        { error: 'Session ID requis' },
        { status: 400 }
      );
    }

    console.log('🔍 Vérification de la session Stripe:', sessionId);

    // Récupérer la session Stripe
    const session = await stripe.checkout.sessions.retrieve(sessionId);

    if (!session) {
      return NextResponse.json(
        { error: 'Session non trouvée' },
        { status: 404 }
      );
    }

    console.log('📋 Session trouvée:', {
      id: session.id,
      status: session.status,
      payment_status: session.payment_status,
      amount_total: session.amount_total,
      metadata: session.metadata
    });

    // Vérifier si le paiement est réussi
    if (session.payment_status !== 'paid' || session.status !== 'complete') {
      return NextResponse.json(
        { 
          error: 'Paiement non complété',
          status: session.status,
          payment_status: session.payment_status
        },
        { status: 400 }
      );
    }

    // Vérifier si l'utilisateur existe déjà dans auth.users
    console.log('🔍 Vérification de l\'utilisateur dans auth.users...');
    const { data: authUsers, error: authCheckError } = await supabase.auth.admin.listUsers();
    
    let existingAuthUser = null;
    if (!authCheckError && authUsers.users) {
      existingAuthUser = authUsers.users.find(user => user.email === session.metadata?.userEmail);
    }

    // Vérifier si l'utilisateur existe déjà dans la table users
    const { data: existingUser, error: userCheckError } = await supabase
      .from('users')
      .select('id, email')
      .eq('email', session.metadata?.userEmail)
      .single();
    
    const userExistsInTable = !userCheckError && existingUser;

    let userId: string;
    
    if (existingAuthUser) {
      // L'utilisateur existe dans auth.users
      userId = existingAuthUser.id;
      console.log('✅ Utilisateur trouvé dans auth.users:', userId);
      
      if (userExistsInTable) {
        // L'utilisateur existe dans les deux tables
        console.log('✅ Utilisateur existe déjà dans les deux tables');
        
        // Vérifier si le paiement est déjà enregistré
        const { data: existingPayment } = await supabase
          .from('payments')
          .select('*')
          .eq('user_id', userId)
          .eq('status', 'completed')
          .single();

        if (existingPayment) {
          console.log('✅ Paiement déjà enregistré');
          return NextResponse.json({ 
            success: true, 
            message: 'Paiement déjà traité',
            userExists: true
          });
        }
      } else {
        // L'utilisateur existe dans auth.users mais pas dans la table users
        console.log('📝 Insertion dans la table users...');
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
          console.error('❌ Erreur lors de l\'insertion dans la table users:', userInsertError);
          return NextResponse.json(
            { error: 'Erreur lors de l\'insertion dans la table users' },
            { status: 500 }
          );
        }
        
        console.log('✅ Utilisateur inséré dans la table users');
      }
    } else {
      // L'utilisateur n'existe pas dans auth.users, le créer
      console.log('👤 Création de l\'utilisateur dans auth.users...');
      
      const { data: authData, error: authError } = await supabase.auth.admin.createUser({
        email: session.metadata?.userEmail,
        password: 'temp_password_' + Math.random().toString(36).substring(7),
        email_confirm: true,
        user_metadata: {
          firstName: session.metadata?.userFirstName,
          lastName: session.metadata?.userLastName,
          phone: session.metadata?.userPhone,
          country: session.metadata?.userCountry,
        }
      });

      if (authError) {
        console.error('❌ Erreur lors de la création de l\'utilisateur dans auth.users:', authError);
        return NextResponse.json(
          { error: 'Erreur lors de la création de l\'utilisateur' },
          { status: 500 }
        );
      }

      userId = authData.user.id;
      console.log('✅ Utilisateur créé dans auth.users:', userId);
      
      // Insérer l'utilisateur dans la table users
      console.log('📝 Insertion dans la table users...');
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
        console.error('❌ Erreur lors de l\'insertion dans la table users:', userInsertError);
        return NextResponse.json(
          { error: 'Erreur lors de l\'insertion dans la table users' },
          { status: 500 }
        );
      }
      
      console.log('✅ Utilisateur inséré dans la table users');
    }

    // Enregistrer le paiement
    console.log('💰 Enregistrement du paiement...');
    
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
      console.error('❌ Erreur lors de l\'insertion du paiement:', insertError);
      return NextResponse.json(
        { error: 'Erreur lors de l\'enregistrement du paiement' },
        { status: 500 }
      );
    }

    console.log('✅ Paiement enregistré avec succès');

    return NextResponse.json({ 
      success: true, 
      message: 'Paiement vérifié et utilisateur créé',
      userId,
      sessionId: session.id,
      userCreated: !existingAuthUser // Indique si l'utilisateur a été créé dans auth.users
    });

  } catch (error) {
    console.error('❌ Erreur lors de la vérification du paiement:', error);
    return NextResponse.json(
      { error: 'Erreur interne du serveur' },
      { status: 500 }
    );
  }
}
