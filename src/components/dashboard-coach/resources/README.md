# Système de Gestion des Ressources - Architecture Modulaire

## Vue d'ensemble

Le système de gestion des ressources a été refactorisé en composants modulaires pour améliorer la maintenabilité et la lisibilité du code.

## Structure des fichiers

```
resources/
├── components/
│   ├── ResourceCard.tsx      # Carte de ressource (vue liste et grille)
│   ├── ResourceIcon.tsx      # Icônes pour les types de ressources
│   ├── ResourceHeader.tsx    # En-tête avec navigation et actions
│   ├── ResourceViewer.tsx    # Modal de visualisation des ressources
│   ├── FileUploader.tsx      # Modal d'upload de fichiers avec drag & drop
│   ├── NewFolderModal.tsx    # Modal de création de dossier
│   ├── PdfViewer.tsx         # Lecteur de PDF intégré
│   └── VideoPlayer.tsx       # Lecteur vidéo (YouTube, Vimeo, local)
├── types.ts                  # Types TypeScript
├── ResourcesViewNew.tsx      # Composant principal refactorisé
├── ResourcesView.tsx         # Ancien composant (à remplacer)
└── index.ts                  # Exports
```

## Composants principaux

### ResourcesViewNew
Composant principal qui orchestre tous les autres composants. Gère l'état global et la logique métier.

### ResourceCard
Affiche une ressource individuelle en mode liste ou grille avec actions contextuelles.

### ResourceHeader
En-tête avec barre de recherche, navigation des dossiers et boutons d'action.

### ResourceViewer
Modal pour visualiser les ressources (PDF, vidéos, images, liens).

### FileUploader
Modal d'upload avec drag & drop, progression et gestion des erreurs.

## Fonctionnalités

### ✅ Implémentées
- [x] Navigation hiérarchique des dossiers
- [x] Upload de fichiers avec drag & drop
- [x] Visualisation des PDFs intégrée
- [x] Lecteur vidéo (YouTube, Vimeo, local)
- [x] Création de dossiers
- [x] Recherche de ressources
- [x] Vues liste et grille
- [x] Actions contextuelles (modifier, supprimer, partager)

### 🔄 À améliorer
- [ ] Intégration avec une API backend
- [ ] Gestion des permissions
- [ ] Synchronisation en temps réel
- [ ] Prévisualisation des images
- [ ] Édition des métadonnées

## Utilisation

```tsx
import { ResourcesViewNew } from '@/components/dashboard-coach/resources';

// Dans votre composant
<ResourcesViewNew />
```

## Migration

Pour migrer de l'ancien système :

1. Remplacez `ResourcesView` par `ResourcesViewNew`
2. Mettez à jour les imports
3. Testez les fonctionnalités

## Types

```typescript
interface Resource {
  id: string;
  name: string;
  type: ResourceType;
  size?: string;
  lastModified: Date;
  url: string;
  folderId?: string;
  thumbnail?: string;
  description?: string;
}

type ResourceType = 'document' | 'video' | 'image' | 'link' | 'folder' | 'pdf' | 'audio' | 'archive' | 'code' | 'youtube';
```

## Améliorations apportées

1. **Modularité** : Chaque composant a une responsabilité unique
2. **Réutilisabilité** : Les composants peuvent être utilisés indépendamment
3. **Maintenabilité** : Code plus facile à déboguer et modifier
4. **Performance** : Optimisations avec useCallback et memo
5. **UX** : Meilleure gestion des états de chargement et erreurs
