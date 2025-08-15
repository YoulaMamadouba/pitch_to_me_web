import { createClient } from '@supabase/supabase-js';

const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL!;
const supabaseKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!;
const supabase = createClient(supabaseUrl, supabaseKey);

export interface HRUser {
  id: string;
  name: string;
  email: string;
  role: string;
  company_id: string;
  company?: {
    id: string;
    name: string;
    domain: string;
    logo?: string;
    employee_count: number;
  };
}

export interface Employee {
  id: string;
  name: string;
  email: string;
  position: string;
  phone: string;
  offerType: string;
  company_id: string;
  status: 'active' | 'inactive';
  created_at: string;
}

export class HRService {
  // Générer un mot de passe temporaire sécurisé
  static generateTemporaryPassword(): string {
    const chars = 'abcdefghijklmnopqrstuvwxyzABCDEFGHIJKLMNOPQRSTUVWXYZ0123456789';
    const specialChars = '!@#$%^&*';
    
    let password = '';
    
    // Au moins 8 caractères, 1 majuscule, 1 minuscule, 1 chiffre, 1 caractère spécial
    password += chars[Math.floor(Math.random() * 26)]; // minuscule
    password += chars[26 + Math.floor(Math.random() * 26)]; // majuscule
    password += chars[52 + Math.floor(Math.random() * 10)]; // chiffre
    password += specialChars[Math.floor(Math.random() * specialChars.length)]; // spécial
    
    // Remplir le reste avec des caractères aléatoires
    for (let i = 4; i < 12; i++) {
      password += chars[Math.floor(Math.random() * chars.length)];
    }
    
    // Mélanger le mot de passe
    return password.split('').sort(() => Math.random() - 0.5).join('');
  }

  // Récupérer les informations du RH connecté
  static async getCurrentHR(): Promise<HRUser | null> {
    try {
      const { data: { user } } = await supabase.auth.getUser();
      
      if (!user) {
        console.log('❌ Aucun utilisateur connecté');
        return null;
      }

      console.log('📧 Récupération des informations du RH:', user.id);

      // Utiliser l'API route pour éviter les problèmes CORS
      const response = await fetch('/api/get-hr-data', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ userId: user.id }),
      });

      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(errorData.error || 'Erreur lors de la récupération du RH');
      }

      const result = await response.json();
      console.log('✅ RH récupéré via API:', result.hrUser);
      return result.hrUser;
    } catch (error) {
      console.error('Erreur dans getCurrentHR:', error);
      return null;
    }
  }

  // Récupérer tous les employés de l'entreprise du RH
  static async getEmployees(companyId: string): Promise<Employee[]> {
    try {
      const { data: { user } } = await supabase.auth.getUser();
      
      if (!user) {
        console.log('❌ Aucun utilisateur connecté');
        return [];
      }

      // Utiliser l'API route pour éviter les problèmes CORS
      const response = await fetch('/api/get-hr-data', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ 
          userId: user.id,
          companyId: companyId 
        }),
      });

      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(errorData.error || 'Erreur lors de la récupération des employés');
      }

      const result = await response.json();
      console.log('✅ Employés récupérés via API:', result.employees?.length || 0);
      return result.employees || [];
    } catch (error) {
      console.error('Erreur dans getEmployees:', error);
      return [];
    }
  }

  // Créer un nouvel employé
  static async createEmployee(employeeData: {
    name: string;
    email: string;
    position: string;
    phone: string;
    offerType: string;
    companyId: string;
    password: string;
  }): Promise<{ success: boolean; employee?: Employee; error?: string }> {
    try {
      console.log('📧 Données envoyées à l\'API:', employeeData);
      
      const response = await fetch('/api/create-employee', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(employeeData),
      });

      console.log('📧 Réponse de l\'API:', response.status, response.statusText);

      if (!response.ok) {
        const errorData = await response.json();
        console.error('❌ Erreur API:', errorData);
        throw new Error(errorData.error || 'Erreur lors de la création de l\'employé');
      }

      const result = await response.json();
      console.log('✅ Résultat API:', result);
      return { success: true, employee: result.employee };
    } catch (error) {
      console.error('Erreur dans createEmployee:', error);
      return { success: false, error: error instanceof Error ? error.message : 'Erreur lors de la création de l\'employé' };
    }
  }

  // Envoyer un email de bienvenue à l'employé
  static async sendEmployeeWelcomeEmail(employeeData: {
    name: string;
    email: string;
    password: string;
    companyName: string;
  }): Promise<{ success: boolean; error?: string }> {
    try {
      const response = await fetch('/api/send-employee-welcome-email', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(employeeData),
      });

      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(errorData.error || 'Erreur lors de l\'envoi de l\'email');
      }

      return { success: true };
    } catch (error) {
      console.error('Erreur dans sendEmployeeWelcomeEmail:', error);
      return { success: false, error: error instanceof Error ? error.message : 'Erreur inconnue' };
    }
  }

  // Déconnexion
  static async signOut(): Promise<void> {
    try {
      const { error } = await supabase.auth.signOut();
      if (error) {
        console.error('Erreur lors de la déconnexion:', error);
      }
    } catch (error) {
      console.error('Erreur dans signOut:', error);
    }
  }
}
