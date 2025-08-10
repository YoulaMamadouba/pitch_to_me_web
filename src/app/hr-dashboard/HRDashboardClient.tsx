'use client';

import dynamic from 'next/dynamic';
import { type ComponentType } from 'react';

const HRDashboardContent = dynamic<{}>(
  () => import('./HRDashboardContent').then((mod) => mod as unknown as ComponentType<{}>),
  { 
    ssr: false,
    loading: () => (
      <div className="flex items-center justify-center min-h-screen bg-gray-900">
        <div className="text-white text-lg">Chargement du tableau de bord RH...</div>
      </div>
    )
  }
);

export default function HRDashboardClient() {
  return <HRDashboardContent />;
}
