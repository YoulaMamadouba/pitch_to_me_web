import { getSupabase } from './supabase';
import { AuthService } from './authService';

export interface CreateCompanyData {
  name: string;
  domain: string;
  logo?: string;
  employeeCount: number;
  rhName: string;
  rhEmail: string;
  rhPhone: string;
  modules: string[];
}

export interface CompanyWithRH {
  company: any;
  rhUser: any;
}

export class CompanyService {
  private static supabase = getSupabase();

  static async createCompany(companyData: CreateCompanyData, coachId: string): Promise<{ company: any; rhUser: any; error: any }> {
    if (!this.supabase) {
      throw new Error('Supabase non configuré');
    }

    try {
      // 1. Vérifier si l'email existe déjà
      const { data: existingUsers, error: checkError } = await this.supabase
        .from('users')
        .select('id, email, role')
        .eq('email', companyData.rhEmail);

      if (checkError) {
        console.error('Erreur lors de la vérification de l\'email:', checkError);
      }

      if (existingUsers && existingUsers.length > 0) {
        return {
          company: null,
          rhUser: null,
          error: {
            code: 'EMAIL_EXISTS',
            message: `L'email ${companyData.rhEmail} est déjà utilisé par un autre utilisateur. Veuillez utiliser un email différent.`
          }
        };
      }

      // 2. Créer un mot de passe temporaire pour le RH
      const tempPassword = this.generateTempPassword();
      
      // 3. Créer l'utilisateur RH via l'API route
      console.log('🔧 Appel API create-rh-user avec:', {
        email: companyData.rhEmail,
        name: companyData.rhName,
        passwordLength: tempPassword.length
      });

      const response = await fetch('/api/create-rh-user', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          email: companyData.rhEmail,
          password: tempPassword,
          name: companyData.rhName,
        }),
      });

      console.log('🔧 Réponse API create-rh-user:', {
        status: response.status,
        statusText: response.statusText,
        ok: response.ok
      });

      if (!response.ok) {
        const errorData = await response.json();
        console.error('❌ Erreur lors de la création de l\'utilisateur RH:', errorData);
        throw new Error(`Erreur lors de la création de l'utilisateur RH: ${errorData.error || 'Erreur inconnue'}`);
      }

      const { user: userData } = await response.json();

      // 4. Créer l'entreprise dans la table companies
      const { data: companyDataResult, error: companyError } = await this.supabase
        .from('companies')
        .insert([
          {
            name: companyData.name,
            domain: companyData.domain,
            logo: companyData.logo || null,
            employee_count: companyData.employeeCount,
            rh_user_id: userData.id,
            created_by: coachId,
            status: 'active',
          },
        ])
        .select()
        .single();

      if (companyError) {
        // Supprimer l'utilisateur si la création d'entreprise échoue
        await this.supabase.from('users').delete().eq('id', userData.id);
        throw companyError;
      }

      // 6. Mettre à jour l'utilisateur RH avec le company_id
      const { error: updateError } = await this.supabase
        .from('users')
        .update({ company_id: companyDataResult.id })
        .eq('id', userData.id);

      if (updateError) {
        console.error('Erreur lors de la mise à jour du company_id:', updateError);
      }

      // 7. Envoyer l'email au RH
      await this.sendRHWelcomeEmail({
        rhName: companyData.rhName,
        rhEmail: companyData.rhEmail,
        companyName: companyData.name,
        password: tempPassword,
      });

      return {
        company: companyDataResult,
        rhUser: userData,
        error: null
      };

    } catch (error) {
      console.error('Erreur lors de la création de l\'entreprise:', error);
      return { company: null, rhUser: null, error };
    }
  }

  private static generateTempPassword(): string {
    // Générer un mot de passe plus sécurisé
    const chars = 'ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789!@#$%^&*';
    let password = '';
    
    // Au moins une majuscule, une minuscule, un chiffre et un caractère spécial
    password += chars.charAt(Math.floor(Math.random() * 26)); // Majuscule
    password += chars.charAt(26 + Math.floor(Math.random() * 26)); // Minuscule
    password += chars.charAt(52 + Math.floor(Math.random() * 10)); // Chiffre
    password += chars.charAt(62 + Math.floor(Math.random() * 8)); // Caractère spécial
    
    // Ajouter 4 caractères aléatoires
    for (let i = 0; i < 4; i++) {
      password += chars.charAt(Math.floor(Math.random() * chars.length));
    }
    
    // Mélanger les caractères
    return password.split('').sort(() => Math.random() - 0.5).join('');
  }

  private static async sendRHWelcomeEmail(data: {
    rhName: string;
    rhEmail: string;
    companyName: string;
    password: string;
  }) {
    try {
      console.log('📧 Envoi de l\'email de bienvenue au RH:', data);
      console.log('📧 Appel de l\'API route /api/send-rh-welcome-email');
      
      const response = await fetch('/api/send-rh-welcome-email', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(data),
      });

      console.log('📧 Réponse de l\'API:', response.status, response.statusText);

      if (!response.ok) {
        const errorText = await response.text();
        console.error('📧 Erreur API:', errorText);
        throw new Error('Erreur lors de l\'envoi de l\'email');
      }

      const result = await response.json();
      console.log('📧 Résultat de l\'API:', result);
      console.log('Email envoyé avec succès au RH');
    } catch (error) {
      console.error('Erreur lors de l\'envoi de l\'email:', error);
      // Ne pas faire échouer la création d'entreprise si l'email échoue
    }
  }

  static async getCompaniesByCoach(coachId: string) {
    if (!this.supabase) {
      throw new Error('Supabase non configuré');
    }

    try {
      console.log('🔍 Récupération des entreprises pour le coach:', coachId);
      
      // Récupérer les entreprises avec une jointure simple
      const { data: companies, error: companiesError } = await this.supabase
        .from('companies')
        .select(`
          *,
          rh_user:users!companies_rh_user_id_fkey (
            id,
            name,
            email
          )
        `)
        .eq('created_by', coachId)
        .order('created_at', { ascending: false });

      if (companiesError) {
        console.error('Erreur lors de la récupération des entreprises:', companiesError);
        throw companiesError;
      }

      console.log('✅ Entreprises récupérées:', companies);
      return companies || [];
    } catch (error) {
      console.error('Erreur lors de la récupération des entreprises:', error);
      throw error;
    }
  }
}
