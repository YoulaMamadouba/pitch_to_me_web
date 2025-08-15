import { getSupabase } from './supabase';

export interface CreateUserData {
  email: string;
  password: string;
  firstName: string;
  lastName: string;
  phone: string;
  country: string;
  role?: 'individual' | 'coach' | 'rh' | 'employee' | 'admin';
}

export interface UserProfile {
  id: string;
  name: string;
  email: string;
  role: string;
  level: number;
  xp: number;
  company_id?: string;
  created_at: string;
}

export class AuthService {
  private static supabase = getSupabase();

  static async createUser(userData: CreateUserData) {
    if (!this.supabase) {
      throw new Error('Supabase non configuré');
    }

    try {
      // 1. Créer l'utilisateur dans Supabase Auth
      const { data: authData, error: authError } = await this.supabase.auth.signUp({
        email: userData.email,
        password: userData.password,
        options: {
          data: {
            name: `${userData.firstName} ${userData.lastName}`,
            role: userData.role || 'individual',
            first_name: userData.firstName,
            last_name: userData.lastName,
            phone: userData.phone,
            country: userData.country,
          },
        },
      });

      if (authError) {
        throw authError;
      }

      if (!authData.user) {
        throw new Error('Erreur lors de la création de l\'utilisateur');
      }

      // 2. Créer l'utilisateur dans la table users
      const { error: userError } = await this.supabase
        .from('users')
        .insert([
          {
            id: authData.user.id,
            name: `${userData.firstName} ${userData.lastName}`,
            email: userData.email,
            role: userData.role || 'individual',
            level: 0,
            xp: 0,
          },
        ]);

      if (userError) {
        // Si l'insertion échoue, supprimer l'utilisateur Auth créé
        await this.supabase.auth.admin.deleteUser(authData.user.id);
        throw userError;
      }

      // 3. Créer un profil étudiant si c'est un individual
      if (userData.role === 'individual' || !userData.role) {
        const { error: studentError } = await this.supabase
          .from('students')
          .insert([
            {
              user_id: authData.user.id,
              progress: {},
              vr_sessions: 0,
            },
          ]);

        if (studentError) {
          console.error('Erreur lors de la création du profil étudiant:', studentError);
          // Ne pas faire échouer l'inscription pour cette erreur
        }
      }

      return { user: authData.user, error: null };
    } catch (error) {
      console.error('Erreur lors de la création de l\'utilisateur:', error);
      return { user: null, error };
    }
  }

  static async createUserWithoutSignIn(userData: CreateUserData) {
    if (!this.supabase) {
      throw new Error('Supabase non configuré');
    }

    try {
      // 1. Se déconnecter d'abord pour s'assurer qu'aucun utilisateur n'est connecté
      await this.supabase.auth.signOut();

      // 2. Créer l'utilisateur dans Supabase Auth (sans connexion automatique)
      const { data: authData, error: authError } = await this.supabase.auth.signUp({
        email: userData.email,
        password: userData.password,
        options: {
          data: {
            name: `${userData.firstName} ${userData.lastName}`,
            role: userData.role || 'individual',
            first_name: userData.firstName,
            last_name: userData.lastName,
            phone: userData.phone,
            country: userData.country,
          },
        },
      });

      if (authError) {
        throw authError;
      }

      if (!authData.user) {
        throw new Error('Erreur lors de la création de l\'utilisateur');
      }

      // 3. Créer l'utilisateur dans la table users
      const { error: userError } = await this.supabase
        .from('users')
        .insert([
          {
            id: authData.user.id,
            name: `${userData.firstName} ${userData.lastName}`,
            email: userData.email,
            role: userData.role || 'individual',
            level: 0,
            xp: 0,
          },
        ]);

      if (userError) {
        // Si l'insertion échoue, supprimer l'utilisateur Auth créé
        await this.supabase.auth.admin.deleteUser(authData.user.id);
        throw userError;
      }

      // 4. Créer un profil étudiant si c'est un individual
      if (userData.role === 'individual' || !userData.role) {
        const { error: studentError } = await this.supabase
          .from('students')
          .insert([
            {
              user_id: authData.user.id,
              progress: {},
              vr_sessions: 0,
            },
          ]);

        if (studentError) {
          console.error('Erreur lors de la création du profil étudiant:', studentError);
          // Ne pas faire échouer l'inscription pour cette erreur
        }
      }

      // 5. Se déconnecter immédiatement après la création
      await this.supabase.auth.signOut();

      return { user: authData.user, error: null };
    } catch (error) {
      console.error('Erreur lors de la création de l\'utilisateur:', error);
      // S'assurer de se déconnecter même en cas d'erreur
      await this.supabase.auth.signOut();
      return { user: null, error };
    }
  }

  static async signIn(email: string, password: string) {
    if (!this.supabase) {
      throw new Error('Supabase non configuré');
    }

    const { data, error } = await this.supabase.auth.signInWithPassword({
      email: email.trim(),
      password: password.trim(),
    });

    return { data, error };
  }

  static async signOut() {
    if (!this.supabase) {
      throw new Error('Supabase non configuré');
    }

    const { error } = await this.supabase.auth.signOut();
    return { error };
  }

  static async getCurrentUser() {
    if (!this.supabase) {
      throw new Error('Supabase non configuré');
    }

    const { data: { user }, error } = await this.supabase.auth.getUser();
    return { user, error };
  }

  static async getUserProfile(userId: string): Promise<{ profile: UserProfile | null; error: any }> {
    if (!this.supabase) {
      throw new Error('Supabase non configuré');
    }

    const { data, error } = await this.supabase
      .from('users')
      .select('*')
      .eq('id', userId)
      .single();

    return { profile: data, error };
  }

  static async updateUserProfile(userId: string, updates: Partial<UserProfile>) {
    if (!this.supabase) {
      throw new Error('Supabase non configuré');
    }

    const { data, error } = await this.supabase
      .from('users')
      .update(updates)
      .eq('id', userId)
      .select()
      .single();

    return { profile: data, error };
  }

  static async checkEmailExists(email: string): Promise<boolean> {
    if (!this.supabase) {
      throw new Error('Supabase non configuré');
    }

    const { data, error } = await this.supabase
      .from('users')
      .select('email')
      .eq('email', email)
      .single();

    if (error && error.code !== 'PGRST116') {
      // PGRST116 = no rows returned
      throw error;
    }

    return !!data;
  }
}
