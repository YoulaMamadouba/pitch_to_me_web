# Section Settings - Dashboard Coach

## Vue d'ensemble

La section Settings du dashboard coach permet aux coaches de gérer leur profil, leurs paramètres de sécurité et leurs préférences. Elle est organisée de manière modulaire avec des composants réutilisables.

## Structure des fichiers

```
settings/
├── components/
│   ├── ProfileForm.tsx          # Formulaire de gestion du profil
│   ├── PasswordChangeForm.tsx   # Formulaire de changement de mot de passe
│   └── SettingsTabs.tsx         # Navigation par onglets
├── types.ts                     # Types TypeScript
├── SettingsView.tsx             # Composant principal
├── index.ts                     # Exports
└── README.md                    # Documentation
```

## Composants

### SettingsView.tsx
Composant principal qui orchestre tous les sous-composants. Gère l'état global et la navigation entre les onglets.

**Fonctionnalités :**
- Navigation par onglets (Profil, Sécurité, Notifications, Préférences)
- Gestion de l'état du profil coach
- Simulation des appels API pour les mises à jour

### ProfileForm.tsx
Formulaire complet pour la gestion du profil coach.

**Fonctionnalités :**
- Affichage et modification des informations personnelles
- Upload d'avatar avec prévisualisation
- Validation des champs
- Mode édition/sauvegarde
- Champs : prénom, nom, téléphone, bio, spécialisation, expérience, localisation, réseaux sociaux

### PasswordChangeForm.tsx
Formulaire sécurisé pour le changement de mot de passe.

**Fonctionnalités :**
- Validation du mot de passe actuel
- Indicateur de force du nouveau mot de passe
- Validation des règles de sécurité
- Affichage/masquage des mots de passe
- Conseils de sécurité

### SettingsTabs.tsx
Navigation par onglets avec animations.

**Fonctionnalités :**
- Navigation fluide entre les sections
- Indicateurs visuels d'état actif
- Animations avec Framer Motion

## Types TypeScript

### CoachProfile
Interface complète pour les données du profil coach :
```typescript
interface CoachProfile {
  id: string;
  firstName: string;
  lastName: string;
  email: string;
  phone?: string;
  avatar?: string;
  bio?: string;
  specialization?: string;
  experience?: number;
  location?: string;
  website?: string;
  linkedin?: string;
  twitter?: string;
  createdAt: Date;
  updatedAt: Date;
}
```

### PasswordChangeData
Interface pour le changement de mot de passe :
```typescript
interface PasswordChangeData {
  currentPassword: string;
  newPassword: string;
  confirmPassword: string;
}
```

## Utilisation

### Import du composant principal
```typescript
import SettingsView from '@/components/dashboard-coach/settings/SettingsView';

// Utilisation simple
<SettingsView />

// Avec onglet spécifique
<SettingsView activeTab="security" />
```

### Import des composants individuels
```typescript
import { ProfileForm, PasswordChangeForm, SettingsTabs } from '@/components/dashboard-coach/settings';
```

## Fonctionnalités implémentées

### ✅ Terminé
- [x] Interface de profil complète avec upload d'avatar
- [x] Formulaire de changement de mot de passe sécurisé
- [x] Navigation par onglets avec animations
- [x] Validation des formulaires
- [x] Indicateur de force du mot de passe
- [x] Gestion des états de chargement
- [x] Design responsive
- [x] Animations avec Framer Motion

### 🔄 En cours / À améliorer
- [ ] Intégration avec l'API backend réelle
- [ ] Gestion des erreurs avancée
- [ ] Notifications de succès/erreur
- [ ] Section Notifications
- [ ] Section Préférences
- [ ] Tests unitaires
- [ ] Validation côté serveur

## Intégration avec le dashboard

La section Settings est intégrée dans le dashboard coach via :
1. **Navigation** : Ajout de l'item "Settings" dans la navigation principale
2. **Routage** : Gestion du cas `activeTab === 'settings'` dans `getCurrentView()`
3. **Import** : Import du composant `SettingsView` dans la page principale

## Personnalisation

### Thème
Le design utilise les couleurs du thème principal :
- Couleur primaire : `yellow-500`
- Arrière-plans : `gray-800`, `gray-700`
- Texte : `white`, `gray-400`

### Animations
Toutes les animations utilisent Framer Motion pour une expérience fluide :
- Transitions entre onglets
- Apparition des formulaires
- Interactions des boutons

## Sécurité

### Validation des mots de passe
- Minimum 8 caractères
- Au moins une minuscule, une majuscule et un chiffre
- Indicateur de force en temps réel
- Conseils de sécurité

### Upload d'avatar
- Validation du type de fichier (images uniquement)
- Limite de taille (5MB max)
- Prévisualisation avant upload

## Performance

- Chargement dynamique des composants
- Optimisation des re-renders avec `useCallback`
- Gestion efficace de l'état local
- Animations optimisées avec Framer Motion

