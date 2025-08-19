# Intégration Stripe dans le Flow d'Inscription - Pitch To Me

## Vue d'ensemble

Cette documentation décrit l'intégration de Stripe Checkout dans le flow d'inscription complet de l'application Pitch To Me.

## Flow d'Inscription

Le flow d'inscription suit cette séquence :
1. **Formulaire d'inscription** (`/signup`) - Collecte des données utilisateur
2. **Vérification OTP** - Validation de l'email
3. **Paiement Stripe** (`/payment`) - Intégration Stripe Checkout
4. **Onboarding** - Configuration du profil
5. **Dashboard** - Accès à l'application

## Architecture

### 1. Contexte Signup (`SignupContext`)

Le contexte gère l'état global du flow d'inscription :
- `formData` : Données du formulaire d'inscription
- `currentStep` : Étape actuelle du flow
- `nextStep()` : Passage à l'étape suivante

### 2. Page de Paiement (`/payment`)

**Fonctionnalités :**
- Utilise les données du `SignupContext`
- Affiche les options de paiement (carte, PayPal, Mobile Money)
- Gère la sélection de devise (USD, EUR, XOF)
- Intègre Stripe Checkout

**Intégration avec le flow :**
```typescript
const { formData, nextStep } = useSignup();

// Envoi des données d'inscription à Stripe
const response = await fetch('/api/checkout', {
  method: 'POST',
  body: JSON.stringify({
    amount,
    currency: selectedCurrency,
    plan: 'premium',
    userData: formData, // Données complètes d'inscription
  }),
});
```

### 3. Route API Checkout (`/api/checkout`)

**Fonctionnalités :**
- Crée une session Stripe Checkout
- Valide les données d'inscription
- Stocke les métadonnées utilisateur dans la session Stripe

**Métadonnées Stripe :**
```typescript
metadata: {
  userEmail: userData.email,
  userFirstName: userData.firstName,
  userLastName: userData.lastName,
  userPhone: userData.phone || '',
  userCountry: userData.country || '',
  currency,
  plan,
}
```

### 4. Webhook Stripe (`/api/webhook`)

**Fonctionnalités :**
- Reçoit les événements Stripe
- Crée l'utilisateur dans Supabase après paiement réussi
- Enregistre le paiement dans la table `payments`

**Processus de création d'utilisateur :**
```typescript
case 'checkout.session.completed':
  // 1. Créer l'utilisateur dans Supabase Auth
  const { data: authData } = await supabase.auth.admin.createUser({
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

  // 2. Enregistrer le paiement
  await supabase.from('payments').insert({
    user_id: authData.user.id,
    amount: (session.amount_total || 0) / 100,
    currency: session.metadata?.currency?.toUpperCase(),
    status: 'completed',
    plan: session.metadata?.plan,
  });
```

## Configuration

### Variables d'environnement

```env
# Stripe
STRIPE_SECRET_KEY=sk_test_...
NEXT_PUBLIC_STRIPE_PUBLISHABLE_KEY=pk_test_...
STRIPE_WEBHOOK_SECRET=whsec_...

# Supabase
SUPABASE_URL=your_supabase_url
SUPABASE_ANON_KEY=your_anon_key
SUPABASE_SERVICE_ROLE_KEY=your_service_role_key

# Application
NEXT_PUBLIC_BASE_URL=http://localhost:3000
```

### Structure de la base de données

```sql
-- Table payments
CREATE TABLE public.payments (
  id uuid NOT NULL DEFAULT extensions.uuid_generate_v4(),
  user_id uuid NOT NULL,
  amount numeric(10, 2) NOT NULL,
  currency character varying(3) NOT NULL,
  status character varying(50) NOT NULL,
  plan character varying(50) NOT NULL,
  created_at timestamp with time zone NULL DEFAULT CURRENT_TIMESTAMP,
  CONSTRAINT payments_pkey PRIMARY KEY (id),
  CONSTRAINT payments_user_id_fkey FOREIGN KEY (user_id) REFERENCES auth.users (id),
  CONSTRAINT payments_currency_check CHECK (currency IN ('USD','EUR','XOF')),
  CONSTRAINT payments_plan_check CHECK (plan IN ('standard','premium')),
  CONSTRAINT payments_status_check CHECK (status IN ('pending','completed','failed'))
);
```

## Flux de données

### 1. Inscription → Paiement
```
SignupForm → SignupContext → PaymentWrapper → PaymentPage
     ↓
formData (email, firstName, lastName, phone, country)
     ↓
Stripe Checkout Session avec métadonnées
```

### 2. Paiement → Webhook
```
Stripe Checkout → Webhook → Supabase Auth + Payments
     ↓
Création automatique de l'utilisateur
     ↓
Enregistrement du paiement
```

### 3. Succès → Onboarding
```
Success Page → Redirection automatique → Onboarding
     ↓
Configuration du profil utilisateur
     ↓
Accès au dashboard
```

## Gestion des erreurs

### Paiement échoué
- Redirection vers `/cancel`
- Bouton "Réessayer l'inscription" → `/signup`
- Support client disponible

### Webhook échoué
- Logs d'erreur détaillés
- Retry automatique par Stripe
- Monitoring des échecs

### Données manquantes
- Validation côté client et serveur
- Redirection vers `/signup` si données incomplètes

## Sécurité

### Validation des données
- Vérification des métadonnées Stripe
- Validation des montants et devises
- Contrôle d'accès aux routes API

### Webhook Stripe
- Signature webhook vérifiée
- Clé secrète webhook configurée
- Gestion des événements non reconnus

### Données utilisateur
- Chiffrement des données sensibles
- Mot de passe temporaire généré
- Confirmation email automatique

## Tests

### Test du flow complet
1. Remplir le formulaire d'inscription
2. Vérifier l'OTP
3. Procéder au paiement avec une carte de test
4. Vérifier la création de l'utilisateur
5. Confirmer l'enregistrement du paiement

### Cartes de test Stripe
- **Succès :** `4242 4242 4242 4242`
- **Échec :** `4000 0000 0000 0002`
- **3D Secure :** `4000 0025 0000 3155`

## Monitoring

### Logs à surveiller
- Création de sessions Stripe
- Événements webhook reçus
- Création d'utilisateurs Supabase
- Erreurs de paiement

### Métriques importantes
- Taux de conversion (inscription → paiement)
- Taux de succès des paiements
- Temps de traitement des webhooks
- Erreurs de création d'utilisateurs

## Déploiement

### Prérequis
1. Compte Stripe configuré
2. Base de données Supabase créée
3. Variables d'environnement définies
4. Webhook Stripe configuré

### Configuration webhook
```
URL: https://your-domain.com/api/webhook
Événements: checkout.session.completed, checkout.session.expired
```

### Vérification
1. Test du flow complet en mode test
2. Vérification des webhooks
3. Test des redirections
4. Validation des données en base
