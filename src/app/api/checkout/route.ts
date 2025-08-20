import { NextRequest, NextResponse } from 'next/server';
import Stripe from 'stripe';

const stripe = new Stripe(process.env.STRIPE_SECRET_KEY!, {
  apiVersion: '2023-10-16',
});

export async function POST(request: NextRequest) {
  try {
    const { amount, currency, plan, userData } = await request.json();

    // Validation des paramètres
    if (!amount || !currency || !plan || !userData) {
      return NextResponse.json(
        { error: 'Paramètres manquants: amount, currency, plan, userData' },
        { status: 400 }
      );
    }

    // Validation des données utilisateur
    if (!userData.email || !userData.firstName || !userData.lastName) {
      return NextResponse.json(
        { error: 'Données utilisateur incomplètes' },
        { status: 400 }
      );
    }

    // Validation de la devise
    const validCurrencies = ['USD', 'EUR', 'XOF'];
    if (!validCurrencies.includes(currency)) {
      return NextResponse.json(
        { error: 'Devise non supportée' },
        { status: 400 }
      );
    }

    // Validation du plan
    const validPlans = ['standard', 'premium'];
    if (!validPlans.includes(plan)) {
      return NextResponse.json(
        { error: 'Plan non supporté' },
        { status: 400 }
      );
    }

    // Création de la session Stripe
    const session = await stripe.checkout.sessions.create({
      payment_method_types: ['card'],
      line_items: [
        {
          price_data: {
            currency: currency.toLowerCase(),
            product_data: {
              name: `Formation ${plan === 'premium' ? 'Premium VR' : 'Standard'}`,
              description: plan === 'premium' 
                ? '12 modules + environnements VR + coaching IA' 
                : '6 modules + coaching de base',
            },
            unit_amount: amount, // Montant en centimes
          },
          quantity: 1,
        },
      ],
      mode: 'payment',
      success_url: `${request.nextUrl.origin}/onboarding?payment=success&session_id={CHECKOUT_SESSION_ID}`,
      cancel_url: `${request.nextUrl.origin}/cancel`,
      metadata: {
        userEmail: userData.email,
        userFirstName: userData.firstName,
        userLastName: userData.lastName,
        userPhone: userData.phone || '',
        userCountry: userData.country || '',
        currency,
        plan,
      },
    });

    return NextResponse.json({ sessionId: session.id, url: session.url });
  } catch (error) {
    console.error('Erreur lors de la création de la session Stripe:', error);
    return NextResponse.json(
      { error: 'Erreur interne du serveur' },
      { status: 500 }
    );
  }
}
