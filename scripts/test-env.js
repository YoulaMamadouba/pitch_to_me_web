#!/usr/bin/env node

/**
 * Script de test pour vérifier les variables d'environnement
 * Usage: node scripts/test-env.js
 */

import dotenv from 'dotenv';
import { createClient } from '@supabase/supabase-js';
import Stripe from 'stripe';

dotenv.config({ path: '.env.local' });

console.log('🔍 Vérification des variables d\'environnement...\n');

const requiredVars = [
  'STRIPE_SECRET_KEY',
  'NEXT_PUBLIC_STRIPE_PUBLISHABLE_KEY',
  'NEXT_PUBLIC_SUPABASE_URL',
  'NEXT_PUBLIC_SUPABASE_ANON_KEY',
  'SUPABASE_SERVICE_ROLE_KEY'
];

let allGood = true;

requiredVars.forEach(varName => {
  const value = process.env[varName];
  if (value) {
    console.log(`✅ ${varName}: ${value.substring(0, 20)}...`);
  } else {
    console.log(`❌ ${varName}: MANQUANT`);
    allGood = false;
  }
});

console.log('\n' + (allGood ? '✅ Toutes les variables sont configurées' : '❌ Variables manquantes détectées'));

if (!allGood) {
  console.log('\n💡 Assurez-vous que votre fichier .env.local contient toutes les variables requises');
  process.exit(1);
}

console.log('\n🚀 Test de connexion Supabase...');

// Test de connexion Supabase
try {
  const supabase = createClient(
    process.env.NEXT_PUBLIC_SUPABASE_URL,
    process.env.SUPABASE_SERVICE_ROLE_KEY
  );
  
  console.log('✅ Client Supabase créé avec succès');
  
  // Test simple de connexion
  const { data, error } = await supabase.from('users').select('count').limit(1);
  
  if (error) {
    console.log('⚠️ Erreur de connexion Supabase:', error.message);
  } else {
    console.log('✅ Connexion à Supabase réussie');
  }
  
} catch (error) {
  console.log('❌ Erreur lors de la création du client Supabase:', error.message);
}

console.log('\n🎯 Test de connexion Stripe...');

// Test de connexion Stripe
try {
  const stripe = new Stripe(process.env.STRIPE_SECRET_KEY, {
    apiVersion: '2023-10-16',
  });
  
  console.log('✅ Client Stripe créé avec succès');
  
  // Test simple de connexion
  const account = await stripe.accounts.retrieve();
  console.log('✅ Connexion à Stripe réussie');
  
} catch (error) {
  console.log('❌ Erreur lors de la connexion Stripe:', error.message);
}

console.log('\n✨ Test terminé !');
