import { Metadata } from 'next';
import HRDashboardClient from './HRDashboardClient';

export const metadata: Metadata = {
  title: 'Tableau de bord RH | Pitch To Me',
  description: 'Tableau de bord RH pour le suivi des performances et de la formation des employés',
};

// Ce composant est rendu côté serveur par défaut
export default function HRDashboardPage() {
  return <HRDashboardClient />;
}
