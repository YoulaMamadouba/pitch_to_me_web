import { useState, useEffect } from 'react';
import { useAuth } from '@/contexts/AuthContext';
import { apiCall } from '@/lib/apiUtils';
import { getSupabase } from '@/lib/supabase';

export function usePasswordChangeCheck() {
  const { user } = useAuth();
  const [showPasswordModal, setShowPasswordModal] = useState(false);
  const [isChecking, setIsChecking] = useState(true);

  useEffect(() => {
    const checkPasswordChange = async () => {
      if (!user) {
        setIsChecking(false);
        return;
      }

      console.log('🔧 Vérification du changement de mot de passe pour:', user.email);

      try {
        // Récupérer le token d'authentification
        const supabase = getSupabase();
        const { data: { session }, error: sessionError } = await supabase.auth.getSession();
        
        if (sessionError || !session?.access_token) {
          console.error('❌ Erreur lors de la récupération de la session:', sessionError);
          setIsChecking(false);
          return;
        }

        // Vérifier si l'utilisateur doit changer son mot de passe
        const result = await apiCall('/api/check-password-change', {
          method: 'GET',
          headers: {
            'Authorization': `Bearer ${session.access_token}`
          }
        });

        console.log('🔧 Résultat de la vérification:', result);

        if (result.success && result.data?.needsPasswordChange) {
          console.log('🔧 Utilisateur doit changer son mot de passe - Affichage de la modal');
          setShowPasswordModal(true);
        } else {
          console.log('🔧 Utilisateur n\'a pas besoin de changer son mot de passe');
        }
      } catch (error) {
        console.error('❌ Erreur lors de la vérification du mot de passe:', error);
      } finally {
        setIsChecking(false);
      }
    };

    checkPasswordChange();
  }, [user]);

  const handlePasswordChanged = () => {
    setShowPasswordModal(false);
    // Ne pas recharger la page, juste fermer la modal
    // L'utilisateur sera automatiquement reconnecté par le composant modal
  };

  return {
    showPasswordModal,
    setShowPasswordModal,
    isChecking,
    handlePasswordChanged
  };
}
