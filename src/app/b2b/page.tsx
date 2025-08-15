import { Metadata } from 'next';
import B2BClient from './B2BClient';

export const metadata: Metadata = {
  title: 'Espace B2B | Pitch To Me',
  description: 'Espace de formation B2B pour les employés d\'entreprise',
};

export default function B2BPage() {
  return <B2BClient />;
}
