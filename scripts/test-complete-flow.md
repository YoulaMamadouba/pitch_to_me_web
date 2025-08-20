# Test du Flow Complet d'Inscription

## Étapes du Flow

### 1. **Inscription** (`/signup`)
- ✅ Remplir le formulaire d'inscription
- ✅ Validation des champs
- ✅ Envoi de l'OTP par email

### 2. **Vérification OTP** (`/signup`)
- ✅ Saisir le code OTP reçu par email
- ✅ Vérification du code
- ✅ Passage à l'étape de paiement

### 3. **Paiement Stripe** (`/signup`)
- ✅ Affichage de la page de paiement
- ✅ Redirection vers Stripe Checkout
- ✅ Paiement avec carte de test
- ✅ Retour vers la page de succès

### 4. **Page de Succès** (`/success`)
- ✅ Affichage du message de succès
- ✅ Vérification automatique du paiement via `/api/verify-payment`
- ✅ Création de l'utilisateur dans la base de données
- ✅ Redirection automatique vers `/onboarding` après 3 secondes

### 5. **Onboarding** (`/onboarding`)
- ✅ Affichage de la page d'onboarding
- ✅ Vérification que l'utilisateur est connecté
- ✅ Affichage des informations de bienvenue
- ✅ Bouton "Continuer la configuration" avec état de chargement

### 6. **Dashboard Learner** (`/dashboard`)
- ✅ Redirection vers le dashboard après clic sur "Continuer"
- ✅ Vérification de l'authentification
- ✅ Chargement des données utilisateur
- ✅ Affichage des informations de connexion
- ✅ Notification de bienvenue
- ✅ Interface complète du dashboard

## Cartes de Test Stripe

- **Succès :** `4242 4242 4242 4242`
- **Échec :** `4000 0000 0000 0002`
- **3D Secure :** `4000 0025 0000 3155`

## Points de Vérification

### Dans les Logs Console
1. `🔧 OnboardingPage monté avec onComplete: true`
2. `🔧 Utilisateur connecté: true`
3. `🔧 handleContinue appelé !`
4. `🔧 Vérification des données utilisateur...`
5. `✅ Utilisateur connecté et données récupérées:`
6. `🔧 Redirection vers le dashboard learner`
7. `🔧 Chargement des données utilisateur...`
8. `✅ Données utilisateur chargées:`

### Dans la Base de Données
1. **Table `auth.users`** : Utilisateur créé avec email confirmé
2. **Table `users`** : Profil utilisateur avec rôle 'individual'
3. **Table `payments`** : Enregistrement du paiement
4. **Table `students`** : Profil étudiant créé

### Dans l'Interface
1. **Sidebar** : Nom, email, rôle "Apprenant", statut "Connecté"
2. **Header** : Nom et email affichés
3. **Menu utilisateur** : Informations complètes
4. **Dashboard** : Message de bienvenue personnalisé
5. **Notification** : Message de bienvenue en haut à droite

## Résolution des Problèmes

### Problème : Utilisateur non connecté après onboarding
**Solution :** Vérifier que `handleOnboardingComplete` appelle bien `signIn` et `nextStep`

### Problème : Données utilisateur non chargées
**Solution :** Vérifier que `UserService.getCurrentUser()` fonctionne et que l'utilisateur existe en base

### Problème : Redirection incorrecte
**Solution :** Vérifier que `router.push('/dashboard')` est utilisé au lieu de `window.location.href`

### Problème : Page de succès ne redirige pas
**Solution :** Vérifier que `/api/verify-payment` fonctionne et crée l'utilisateur

## Test Manuel

1. Aller sur `/signup`
2. Remplir le formulaire avec des données valides
3. Vérifier l'OTP reçu par email
4. Procéder au paiement avec `4242 4242 4242 4242`
5. Attendre la redirection vers `/success`
6. Attendre la redirection automatique vers `/onboarding`
7. Cliquer sur "Continuer la configuration"
8. Vérifier l'arrivée sur `/dashboard` avec toutes les informations

## Variables d'Environnement Requises

```env
# Stripe
STRIPE_SECRET_KEY=sk_test_...
NEXT_PUBLIC_STRIPE_PUBLISHABLE_KEY=pk_test_...
STRIPE_WEBHOOK_SECRET=whsec_...

# Supabase
SUPABASE_URL=your_supabase_url
SUPABASE_ANON_KEY=your_anon_key
SUPABASE_SERVICE_ROLE_KEY=your_service_role_key

# Email (pour OTP)
RESEND_API_KEY=your_resend_api_key
```

