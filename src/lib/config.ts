// Configuration centralisée pour l'application
export const config = {
  // URL de base de l'application
  baseUrl: process.env.NEXT_PUBLIC_APP_URL || 
    (process.env.NODE_ENV === 'development' ? 'http://localhost:3001' : ''),
  
  // URLs des pages
  urls: {
    login: '/login',
    signup: '/signup',
    dashboard: '/dashboard',
    hrDashboard: '/hr-dashboard',
    b2b: '/b2b',
    coachDashboard: '/coach-dashboard',
  },
  
  // Configuration API
  api: {
    baseUrl: '/api',
    endpoints: {
      sendOtpEmail: '/send-otp-email',
      createRhUser: '/create-rh-user',
      createEmployee: '/create-employee',
      sendRhWelcomeEmail: '/send-rh-welcome-email',
      sendEmployeeWelcomeEmail: '/send-employee-welcome-email',
      getHrData: '/get-hr-data',
    }
  },
  
  // Configuration email
  email: {
    from: process.env.SMTP_USER || 'noreply@pitchtome.com',
    templates: {
      otp: 'Code de vérification - Pitch To Me',
      rhWelcome: 'Bienvenue sur Pitch To Me - Accès RH',
      employeeWelcome: 'Bienvenue sur Pitch To Me - Accès Employé',
    }
  }
};

// Fonction pour construire une URL complète
export function buildUrl(path: string): string {
  if (path.startsWith('http')) {
    return path;
  }
  
  if (path.startsWith('/')) {
    return `${config.baseUrl}${path}`;
  }
  
  return `${config.baseUrl}/${path}`;
}

// Fonction pour construire une URL API
export function buildApiUrl(endpoint: string): string {
  return `${config.api.baseUrl}${endpoint}`;
}

