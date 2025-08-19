#!/usr/bin/env node

/**
 * Script de test pour l'intégration Stripe
 * Usage: node scripts/test-stripe.js
 */

const Stripe = require('stripe');

// Configuration
const stripe = new Stripe(process.env.STRIPE_SECRET_KEY, {
  apiVersion: '2023-10-16',
});

async function testStripeIntegration() {
  console.log('🧪 Test de l\'intégration Stripe...\n');

  try {
    // 1. Test de connexion à Stripe
    console.log('1. Test de connexion à Stripe...');
    const account = await stripe.accounts.retrieve();
    console.log('✅ Connexion réussie - Account ID:', account.id);
    console.log('   Mode:', account.charges_enabled ? 'Production' : 'Test');
    console.log('   Devises supportées:', account.default_currency?.toUpperCase());
    console.log('');

    // 2. Test de création d'une session de test
    console.log('2. Test de création d\'une session de paiement...');
    const session = await stripe.checkout.sessions.create({
      payment_method_types: ['card'],
      line_items: [
        {
          price_data: {
            currency: 'usd',
            product_data: {
              name: 'Test Formation Premium VR',
              description: 'Test de paiement',
            },
            unit_amount: 29900, // $299.00
          },
          quantity: 1,
        },
      ],
      mode: 'payment',
      success_url: 'http://localhost:3000/success?session_id={CHECKOUT_SESSION_ID}',
      cancel_url: 'http://localhost:3000/cancel',
      metadata: {
        userId: 'test-user-id',
        plan: 'premium',
        currency: 'USD',
      },
    });
    console.log('✅ Session créée avec succès');
    console.log('   Session ID:', session.id);
    console.log('   URL:', session.url);
    console.log('');

    // 3. Test de récupération de la session
    console.log('3. Test de récupération de la session...');
    const retrievedSession = await stripe.checkout.sessions.retrieve(session.id);
    console.log('✅ Session récupérée');
    console.log('   Status:', retrievedSession.status);
    console.log('   Amount Total:', retrievedSession.amount_total);
    console.log('   Currency:', retrievedSession.currency?.toUpperCase());
    console.log('');

    // 4. Test des webhooks (simulation)
    console.log('4. Test des webhooks...');
    console.log('⚠️  Pour tester les webhooks, vous devez :');
    console.log('   - Configurer un endpoint webhook dans le dashboard Stripe');
    console.log('   - Utiliser ngrok ou un domaine public pour l\'URL');
    console.log('   - Tester avec les cartes de test Stripe');
    console.log('');

    // 5. Cartes de test recommandées
    console.log('5. Cartes de test recommandées :');
    console.log('   ✅ Succès: 4242 4242 4242 4242');
    console.log('   ❌ Échec: 4000 0000 0000 0002');
    console.log('   ⏰ Expiration: 4000 0000 0000 0069');
    console.log('   💳 Insuffisant: 4000 0000 0000 9995');
    console.log('');

    // 6. Vérification des variables d'environnement
    console.log('6. Vérification des variables d\'environnement...');
    const requiredVars = [
      'STRIPE_SECRET_KEY',
      'NEXT_PUBLIC_STRIPE_PUBLISHABLE_KEY',
      'STRIPE_WEBHOOK_SECRET',
      'SUPABASE_URL',
      'SUPABASE_SERVICE_ROLE_KEY'
    ];

    const missingVars = requiredVars.filter(varName => !process.env[varName]);
    
    if (missingVars.length === 0) {
      console.log('✅ Toutes les variables d\'environnement sont configurées');
    } else {
      console.log('❌ Variables manquantes :');
      missingVars.forEach(varName => console.log(`   - ${varName}`));
    }
    console.log('');

    console.log('🎉 Tests terminés avec succès !');
    console.log('');
    console.log('📝 Prochaines étapes :');
    console.log('   1. Configurez votre webhook dans le dashboard Stripe');
    console.log('   2. Testez le flux complet avec une carte de test');
    console.log('   3. Vérifiez les enregistrements dans votre base de données');
    console.log('   4. Déployez en production avec les clés de production');

  } catch (error) {
    console.error('❌ Erreur lors des tests :', error.message);
    
    if (error.type === 'StripeAuthenticationError') {
      console.log('');
      console.log('💡 Solution : Vérifiez votre STRIPE_SECRET_KEY');
    } else if (error.type === 'StripeInvalidRequestError') {
      console.log('');
      console.log('💡 Solution : Vérifiez les paramètres de la requête');
    }
    
    process.exit(1);
  }
}

// Exécution du script
if (require.main === module) {
  testStripeIntegration();
}

module.exports = { testStripeIntegration };
