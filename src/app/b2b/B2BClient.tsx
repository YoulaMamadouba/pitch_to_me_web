'use client';

import dynamic from 'next/dynamic';
import { type ComponentType } from 'react';

const B2BContent = dynamic<{}>(
  () => import('./B2BContent').then((mod) => mod as unknown as ComponentType<{}>),
  { 
    ssr: false,
    loading: () => (
      <div className="flex items-center justify-center min-h-screen bg-gray-900">
        <div className="text-white text-lg">Chargement de l'espace B2B...</div>
      </div>
    )
  }
);

export default function B2BClient() {
  return <B2BContent />;
}
