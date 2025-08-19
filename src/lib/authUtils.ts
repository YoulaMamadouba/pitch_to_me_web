import { getSupabase } from './supabase';

export const getCurrentUser = async () => {
  try {
    const supabase = getSupabase();
    if (!supabase) return null;

    const { data: { user }, error } = await supabase.auth.getUser();
    
    if (error || !user) {
      console.error('Erreur lors de la récupération de l\'utilisateur:', error);
      return null;
    }

    return user;
  } catch (error) {
    console.error('Erreur lors de la récupération de l\'utilisateur:', error);
    return null;
  }
};

export const getCurrentUserId = async (): Promise<string | null> => {
  const user = await getCurrentUser();
  return user?.id || null;
};

// Fonction pour vérifier si l'utilisateur est connecté
export const isAuthenticated = async (): Promise<boolean> => {
  const user = await getCurrentUser();
  return !!user;
};

// Fonction pour rediriger vers la connexion si non authentifié
export const requireAuth = async (): Promise<string | null> => {
  const userId = await getCurrentUserId();
  
  if (!userId) {
    // Rediriger vers la page de connexion
    if (typeof window !== 'undefined') {
      window.location.href = '/login';
    }
    return null;
  }
  
  return userId;
};
