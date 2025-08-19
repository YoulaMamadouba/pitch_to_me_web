#!/usr/bin/env node

/**
 * Script de test pour l'intégration Stripe dans le flow d'inscription
 * Usage: node scripts/test-stripe-signup.js
 */

const fetch = require('node-fetch');

const BASE_URL = process.env.NEXT_PUBLIC_BASE_URL || 'http://localhost:3000';

// Données de test pour l'inscription
const testUserData = {
  email: `test-${Date.now()}@example.com`,
  firstName: 'John',
  lastName: 'Doe',
  phone: '+33123456789',
  country: 'France',
  password: 'TestPassword123!'
};

// Données de test pour le paiement
const testPaymentData = {
  amount: 29900, // $299.00 en centimes
  currency: 'USD',
  plan: 'premium',
  userData: testUserData
};

async function testCheckoutAPI() {
  console.log('🧪 Test de l\'API Checkout...');
  
  try {
    const response = await fetch(`${BASE_URL}/api/checkout`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(testPaymentData),
    });

    const data = await response.json();

    if (!response.ok) {
      console.error('❌ Erreur API Checkout:', data.error);
      return null;
    }

    console.log('✅ Session Stripe créée avec succès');
    console.log('📋 URL de checkout:', data.url);
    console.log('🆔 Session ID:', data.sessionId);
    
    return data;
  } catch (error) {
    console.error('❌ Erreur lors du test de l\'API Checkout:', error);
    return null;
  }
}

async function testWebhookSimulation() {
  console.log('\n🧪 Simulation du webhook Stripe...');
  
  // Simulation d'un événement checkout.session.completed
  const webhookEvent = {
    id: 'evt_test_' + Date.now(),
    object: 'event',
    api_version: '2023-10-16',
    created: Math.floor(Date.now() / 1000),
    data: {
      object: {
        id: 'cs_test_' + Date.now(),
        object: 'checkout.session',
        amount_total: testPaymentData.amount,
        currency: testPaymentData.currency,
        metadata: {
          userEmail: testUserData.email,
          userFirstName: testUserData.firstName,
          userLastName: testUserData.lastName,
          userPhone: testUserData.phone,
          userCountry: testUserData.country,
          plan: testPaymentData.plan,
        },
        payment_status: 'paid',
        status: 'complete',
      }
    },
    livemode: false,
    pending_webhooks: 1,
    request: {
      id: 'req_test_' + Date.now(),
      idempotency_key: null,
    },
    type: 'checkout.session.completed'
  };

  try {
    const response = await fetch(`${BASE_URL}/api/webhook`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'stripe-signature': 'test_signature', // En mode test, on ignore la signature
      },
      body: JSON.stringify(webhookEvent),
    });

    if (response.ok) {
      console.log('✅ Webhook traité avec succès');
    } else {
      const error = await response.text();
      console.error('❌ Erreur webhook:', error);
    }
  } catch (error) {
    console.error('❌ Erreur lors du test du webhook:', error);
  }
}

async function testFlowComplet() {
  console.log('🚀 Test du flow d\'inscription complet avec Stripe\n');
  
  // Test 1: API Checkout
  const checkoutResult = await testCheckoutAPI();
  
  if (!checkoutResult) {
    console.log('❌ Test échoué: Impossible de créer la session Stripe');
    return;
  }
  
  // Test 2: Simulation webhook
  await testWebhookSimulation();
  
  console.log('\n✅ Tests terminés !');
  console.log('\n📝 Prochaines étapes:');
  console.log('1. Ouvrir l\'URL de checkout dans un navigateur');
  console.log('2. Utiliser une carte de test Stripe');
  console.log('3. Vérifier la création de l\'utilisateur dans Supabase');
  console.log('4. Confirmer l\'enregistrement du paiement');
}

// Fonction utilitaire pour vérifier les variables d'environnement
function checkEnvironment() {
  console.log('🔍 Vérification de l\'environnement...');
  
  const requiredVars = [
    'STRIPE_SECRET_KEY',
    'NEXT_PUBLIC_STRIPE_PUBLISHABLE_KEY',
    'SUPABASE_URL',
    'SUPABASE_SERVICE_ROLE_KEY'
  ];
  
  const missing = requiredVars.filter(varName => !process.env[varName]);
  
  if (missing.length > 0) {
    console.error('❌ Variables d\'environnement manquantes:', missing);
    console.log('💡 Assurez-vous que votre fichier .env.local est configuré');
    return false;
  }
  
  console.log('✅ Variables d\'environnement OK');
  return true;
}

// Fonction principale
async function main() {
  console.log('🎯 Test de l\'intégration Stripe - Flow d\'inscription\n');
  
  // Vérifier l'environnement
  if (!checkEnvironment()) {
    process.exit(1);
  }
  
  // Lancer les tests
  await testFlowComplet();
}

// Gestion des erreurs
process.on('unhandledRejection', (error) => {
  console.error('❌ Erreur non gérée:', error);
  process.exit(1);
});

// Lancer le script
if (require.main === module) {
  main().catch(console.error);
}

module.exports = {
  testCheckoutAPI,
  testWebhookSimulation,
  testFlowComplet,
  checkEnvironment
};
