# Flow de Paiement Corrigé - Pitch To Me

## Problème Résolu

Le problème était que l'utilisateur n'était pas créé automatiquement après un paiement réussi, et la table `payments` n'était pas remplie correctement.

## Solution Implémentée

### 1. **Route de Vérification de Paiement** (`/api/verify-payment`)

Cette nouvelle route vérifie le statut d'une session Stripe et crée l'utilisateur si nécessaire :

```typescript
// Vérification de la session Stripe
const session = await stripe.checkout.sessions.retrieve(sessionId);

// Création de l'utilisateur dans auth.users ET users
const { data: authData } = await supabase.auth.admin.createUser({
  email: session.metadata?.userEmail,
  password: 'temp_password_' + Math.random().toString(36).substring(7),
  email_confirm: true,
  user_metadata: { /* ... */ }
});

// Création dans la table users
await supabase.from('users').insert({
  id: authData.user.id,
  email: session.metadata?.userEmail,
  first_name: session.metadata?.userFirstName,
  // ...
});

// Enregistrement du paiement
await supabase.from('payments').insert({
  user_id: authData.user.id,
  amount: (session.amount_total || 0) / 100,
  currency: session.metadata?.currency?.toUpperCase(),
  status: 'completed',
  plan: session.metadata?.plan,
});
```

### 2. **Page de Succès Modifiée** (`/success`)

La page de succès vérifie maintenant automatiquement le paiement :

```typescript
useEffect(() => {
  const sessionIdParam = searchParams.get('session_id');
  if (sessionIdParam) {
    // Vérifier le paiement et créer l'utilisateur
    const verifyPayment = async () => {
      const response = await fetch('/api/verify-payment', {
        method: 'POST',
        body: JSON.stringify({ sessionId: sessionIdParam }),
      });
      
      if (response.ok) {
        // Rediriger vers l'onboarding après 3 secondes
        setTimeout(() => {
          window.location.href = '/onboarding';
        }, 3000);
      } else {
        // Rediriger vers la page d'annulation
        setTimeout(() => {
          window.location.href = '/cancel';
        }, 3000);
      }
    };
    
    verifyPayment();
  }
}, [searchParams]);
```

### 3. **Webhook Corrigé** (`/api/webhook`)

Le webhook fonctionne maintenant en mode développement et production :

```typescript
// Gestion de la signature webhook
if (!process.env.STRIPE_WEBHOOK_SECRET) {
  // Mode développement : ignorer la signature
  event = JSON.parse(body) as Stripe.Event;
} else {
  // Mode production : vérifier la signature
  event = stripe.webhooks.constructEvent(body, signature!, process.env.STRIPE_WEBHOOK_SECRET);
}

// Création de l'utilisateur dans les deux tables
const { data: authData } = await supabase.auth.admin.createUser({ /* ... */ });

// Table users
await supabase.from('users').insert({
  id: authData.user.id,
  email: session.metadata?.userEmail,
  // ...
});

// Table payments
await supabase.from('payments').insert({
  user_id: authData.user.id,
  // ...
});
```

## Flow Complet Corrigé

### 1. **Inscription → Paiement**
```
SignupForm → SignupContext → PaymentPage → Stripe Checkout
```

### 2. **Paiement Réussi → Vérification**
```
Stripe Success → /success → /api/verify-payment → Création Utilisateur
```

### 3. **Vérification → Onboarding**
```
Vérification OK → Redirection → /onboarding → Configuration
```

### 4. **Onboarding → Dashboard**
```
Configuration OK → /dashboard → Accès à l'application
```

## Tables de Base de Données

### Table `users`
```sql
CREATE TABLE public.users (
  id uuid NOT NULL DEFAULT extensions.uuid_generate_v4(),
  email character varying NOT NULL,
  first_name character varying,
  last_name character varying,
  phone character varying,
  country character varying,
  created_at timestamp with time zone DEFAULT CURRENT_TIMESTAMP,
  CONSTRAINT users_pkey PRIMARY KEY (id),
  CONSTRAINT users_email_key UNIQUE (email)
);
```

### Table `payments`
```sql
CREATE TABLE public.payments (
  id uuid NOT NULL DEFAULT extensions.uuid_generate_v4(),
  user_id uuid NOT NULL,
  amount numeric(10, 2) NOT NULL,
  currency character varying(3) NOT NULL,
  status character varying(50) NOT NULL,
  plan character varying(50) NOT NULL,
  created_at timestamp with time zone DEFAULT CURRENT_TIMESTAMP,
  CONSTRAINT payments_pkey PRIMARY KEY (id),
  CONSTRAINT payments_user_id_fkey FOREIGN KEY (user_id) REFERENCES users (id),
  CONSTRAINT payments_currency_check CHECK (currency IN ('USD','EUR','XOF')),
  CONSTRAINT payments_plan_check CHECK (plan IN ('standard','premium')),
  CONSTRAINT payments_status_check CHECK (status IN ('pending','completed','failed'))
);
```

## Tests

### Script de Test Automatisé
```bash
node scripts/test-payment-flow.js
```

Ce script teste :
1. ✅ Création de session Stripe
2. ✅ Simulation de webhook
3. ✅ Vérification de paiement
4. ✅ Création d'utilisateur
5. ✅ Enregistrement de paiement

### Test Manuel
1. Remplir le formulaire d'inscription
2. Procéder au paiement avec une carte de test
3. Vérifier la redirection vers `/success`
4. Attendre la redirection automatique vers `/onboarding`
5. Compléter l'onboarding
6. Accéder au dashboard

## Cartes de Test Stripe

- **Succès :** `4242 4242 4242 4242`
- **Échec :** `4000 0000 0000 0002`
- **3D Secure :** `4000 0025 0000 3155`

## Variables d'Environnement

```env
# Stripe
STRIPE_SECRET_KEY=sk_test_...
NEXT_PUBLIC_STRIPE_PUBLISHABLE_KEY=pk_test_...
STRIPE_WEBHOOK_SECRET=whsec_... # Optionnel en développement

# Supabase
SUPABASE_URL=your_supabase_url
SUPABASE_ANON_KEY=your_anon_key
SUPABASE_SERVICE_ROLE_KEY=your_service_role_key

# Application
NEXT_PUBLIC_BASE_URL=http://localhost:3000
```

## Monitoring

### Logs à Surveiller
- `🔍 Vérification de la session Stripe:`
- `✅ Session trouvée:`
- `👤 Création de l'utilisateur...`
- `✅ Utilisateur créé:`
- `💰 Enregistrement du paiement...`
- `✅ Paiement enregistré avec succès`

### Erreurs Possibles
- `❌ Session non trouvée`
- `❌ Paiement non complété`
- `❌ Erreur lors de la création de l'utilisateur`
- `❌ Erreur lors de l'enregistrement du paiement`

## Déploiement

### Prérequis
1. ✅ Compte Stripe configuré
2. ✅ Base de données Supabase avec tables `users` et `payments`
3. ✅ Variables d'environnement définies
4. ✅ Webhook Stripe configuré (optionnel en développement)

### Vérification Post-Déploiement
1. ✅ Test du flow complet
2. ✅ Vérification des logs
3. ✅ Validation des données en base
4. ✅ Test des redirections

## Résolution des Problèmes

### Problème : Utilisateur non créé
**Solution :** Vérifier les logs de `/api/verify-payment` et s'assurer que `SUPABASE_SERVICE_ROLE_KEY` est correct.

### Problème : Paiement non enregistré
**Solution :** Vérifier que la table `payments` existe et que les contraintes sont respectées.

### Problème : Redirection incorrecte
**Solution :** Vérifier les logs de la page `/success` et s'assurer que `session_id` est présent dans l'URL.

### Problème : Webhook non reçu
**Solution :** En développement, le webhook est optionnel. La vérification se fait via `/api/verify-payment`.
