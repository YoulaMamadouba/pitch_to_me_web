// Utilitaire pour gérer les URLs API de manière dynamique
export function getApiUrl(path: string): string {
  // En développement, utiliser l'URL relative
  if (process.env.NODE_ENV === 'development') {
    return path;
  }
  
  // En production, utiliser l'URL complète si nécessaire
  // ou garder l'URL relative pour la plupart des cas
  return path;
}

// Fonction pour faire des appels API avec gestion d'erreur
export async function apiCall(
  path: string, 
  options: RequestInit = {}
): Promise<{ success: boolean; data?: any; error?: string }> {
  try {
    const url = getApiUrl(path);
    const response = await fetch(url, {
      headers: {
        'Content-Type': 'application/json',
        ...options.headers,
      },
      ...options,
    });

    const result = await response.json();

    if (!response.ok) {
      return {
        success: false,
        error: result.error || `Erreur ${response.status}: ${response.statusText}`
      };
    }

    return {
      success: true,
      data: result
    };
  } catch (error) {
    console.error('Erreur API:', error);
    return {
      success: false,
      error: 'Erreur de connexion au serveur'
    };
  }
}

