This is a [Next.js](https://nextjs.org) project bootstrapped with [`create-next-app`](https://nextjs.org/docs/app/api-reference/cli/create-next-app).

## Getting Started

First, run the development server:

```bash
npm run dev
# or
yarn dev
# or
pnpm dev
# or
bun dev
```

Open [http://localhost:3000](http://localhost:3000) with your browser to see the result.

# Pitch to Me Web — Documentation rapide

- __Stack__: Next.js 15 (TS), React, Framer Motion, lucide-react
- __i18n__: Contexte maison FR/EN avec persistance `localStorage`

## Installation
```bash
npm install
```

## Scripts utiles
- `npm run dev` dev server
- `npm run build` build production
- `npm run start` serveur en prod

## Fichiers clés
- `src/app/providers.tsx`: providers client (incl. `LanguageProvider`)
- `src/contexts/LanguageContext.tsx`: `useLanguageContext()` → `{ t, language, changeLanguage, isLoading }`
- `src/hooks/useLanguage.ts`: source de vérité de la langue (`'fr' | 'en'`) + persistance
- `src/hooks/useSimpleTranslations.ts`: dictionnaires `fr/en` + fonction `t()`
- `src/components/B2CSection.tsx`: exemple d’utilisation des traductions

## Utiliser les traductions
```tsx
import { useLanguageContext } from '@/contexts/LanguageContext';

const { t, language, changeLanguage } = useLanguageContext();

// Exemple
<h1>{t('hero.title.line1')}</h1>
<button onClick={() => changeLanguage(language === 'fr' ? 'en' : 'fr')}>
  {language === 'fr' ? 'EN' : 'FR'}
</button>
```

## Ajouter une clé de traduction
1) Ajouter la clé dans `frTranslations` et `enTranslations` (fichier `useSimpleTranslations.ts`).
2) Utiliser `t('chemin.de.la.cle')` dans le composant.
3) Pour interpoler: `{year}` côté dictionnaire et `t('key', { year: 2025 })` côté composant.

You can start editing the page by modifying `app/page.tsx`. The page auto-updates as you edit the file.

This project uses [`next/font`](https://nextjs.org/docs/app/building-your-application/optimizing/fonts) to automatically optimize and load [Geist](https://vercel.com/font), a new font family for Vercel.

## Learn More

To learn more about Next.js, take a look at the following resources:

- [Next.js Documentation](https://nextjs.org/docs) - learn about Next.js features and API.
- [Learn Next.js](https://nextjs.org/learn) - an interactive Next.js tutorial.

You can check out [the Next.js GitHub repository](https://github.com/vercel/next.js) - your feedback and contributions are welcome!

## Deploy on Vercel

The easiest way to deploy your Next.js app is to use the [Vercel Platform](https://vercel.com/new?utm_medium=default-template&filter=next.js&utm_source=create-next-app&utm_campaign=create-next-app-readme) from the creators of Next.js.

Check out our [Next.js deployment documentation](https://nextjs.org/docs/app/building-your-application/deploying) for more details.
