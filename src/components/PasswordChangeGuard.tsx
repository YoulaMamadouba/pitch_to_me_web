'use client';

import { usePasswordChangeCheck } from '@/hooks/usePasswordChangeCheck';
import ForcePasswordChangeModal from './ui/ForcePasswordChangeModal';

interface PasswordChangeGuardProps {
  children: React.ReactNode;
}

export default function PasswordChangeGuard({ children }: PasswordChangeGuardProps) {
  const { showPasswordModal, isChecking, handlePasswordChanged } = usePasswordChangeCheck();

  // Si on est en train de vérifier, on peut afficher un loader ou rien
  if (isChecking) {
    return <>{children}</>;
  }

  return (
    <>
      {children}
      
      {/* Modal de changement de mot de passe obligatoire */}
      <ForcePasswordChangeModal
        isOpen={showPasswordModal}
        onPasswordChanged={handlePasswordChanged}
      />
    </>
  );
}
