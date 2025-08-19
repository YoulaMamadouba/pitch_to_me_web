#!/usr/bin/env node

/**
 * Script de test pour le flow de paiement complet
 * Usage: node scripts/test-payment-flow.js
 */

import dotenv from 'dotenv';
import fetch from 'node-fetch';

dotenv.config({ path: '.env.local' });

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

async function testVerifyPayment(sessionId) {
  console.log('\n🧪 Test de la vérification du paiement...');
  
  try {
    const response = await fetch(`${BASE_URL}/api/verify-payment`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({ sessionId }),
    });

    const data = await response.json();

    if (response.ok) {
      console.log('✅ Vérification du paiement réussie:', data);
      return data;
    } else {
      console.error('❌ Erreur lors de la vérification:', data.error);
      return null;
    }
  } catch (error) {
    console.error('❌ Erreur lors du test de vérification:', error);
    return null;
  }
}

async function testWebhookSimulation(sessionId) {
  console.log('\n🧪 Simulation du webhook Stripe...');
  
  // Simulation d'un événement checkout.session.completed
  const webhookEvent = {
    id: 'evt_test_' + Date.now(),
    object: 'event',
    api_version: '2023-10-16',
    created: Math.floor(Date.now() / 1000),
    data: {
      object: {
        id: sessionId,
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
        'stripe-signature': 'test_signature',
      },
      body: JSON.stringify(webhookEvent),
    });

    if (response.ok) {
      console.log('✅ Webhook traité avec succès');
      return true;
    } else {
      const error = await response.text();
      console.error('❌ Erreur webhook:', error);
      return false;
    }
  } catch (error) {
    console.error('❌ Erreur lors du test du webhook:', error);
    return false;
  }
}

async function testFlowComplet() {
  console.log('🚀 Test du flow de paiement complet\n');
  
  // Test 1: API Checkout
  const checkoutResult = await testCheckoutAPI();
  
  if (!checkoutResult) {
    console.log('❌ Test échoué: Impossible de créer la session Stripe');
    return;
  }
  
  // Test 2: Simulation webhook (optionnel)
  const webhookSuccess = await testWebhookSimulation(checkoutResult.sessionId);
  
  // Test 3: Vérification du paiement
  const verifyResult = await testVerifyPayment(checkoutResult.sessionId);
  
  if (verifyResult) {
    console.log('\n✅ Flow de paiement testé avec succès !');
    console.log('\n📝 Résumé:');
    console.log('- Session Stripe créée:', checkoutResult.sessionId);
    console.log('- Webhook simulé:', webhookSuccess ? 'Succès' : 'Échec');
    console.log('- Utilisateur créé:', verifyResult.userCreated ? 'Oui' : 'Non');
    console.log('- Paiement enregistré: Oui');
    console.log('\n🔗 URL de checkout pour test manuel:', checkoutResult.url);
  } else {
    console.log('\n❌ Test échoué lors de la vérification du paiement');
  }
}

// Fonction utilitaire pour vérifier les variables d'environnement
function checkEnvironment() {
  console.log('🔍 Vérification de l\'environnement...');
  
  const requiredVars = [
    'STRIPE_SECRET_KEY',
    'NEXT_PUBLIC_STRIPE_PUBLISHABLE_KEY',
    'NEXT_PUBLIC_SUPABASE_URL',
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
  console.log('🎯 Test du flow de paiement complet\n');
  
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
main().catch(console.error);
