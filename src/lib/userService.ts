import { createClient } from '@supabase/supabase-js';

const supabase = createClient(
  process.env.NEXT_PUBLIC_SUPABASE_URL!,
  process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!
);

export interface User {
  id: string;
  name: string;
  email: string;
  role: string;
  level: number;
  xp: number;
  company_id?: string;
  created_at: string;
  // Champs supplémentaires pour le profil
  phone?: string;
  bio?: string;
  avatar_url?: string;
  position?: string;
  company?: string;
}

export class UserService {
  static async getCurrentUser(): Promise<User | null> {
    try {
      const { data: { user } } = await supabase.auth.getUser();
      
      if (!user) {
        return null;
      }

      const { data, error } = await supabase
        .from('users')
        .select('*')
        .eq('id', user.id)
        .single();

      if (error) {
        console.error('Erreur lors de la récupération de l\'utilisateur:', error);
        return null;
      }

      return data;
    } catch (error) {
      console.error('Erreur:', error);
      return null;
    }
  }

  static async updateUserProfile(userId: string, updates: Partial<User>): Promise<boolean> {
    try {
      const { error } = await supabase
        .from('users')
        .update(updates)
        .eq('id', userId);

      if (error) {
        console.error('Erreur lors de la mise à jour du profil:', error);
        return false;
      }

      return true;
    } catch (error) {
      console.error('Erreur:', error);
      return false;
    }
  }

  static async updateUserPassword(currentPassword: string, newPassword: string): Promise<boolean> {
    try {
      const { error } = await supabase.auth.updateUser({
        password: newPassword
      });

      if (error) {
        console.error('Erreur lors du changement de mot de passe:', error);
        return false;
      }

      return true;
    } catch (error) {
      console.error('Erreur:', error);
      return false;
    }
  }

  static async uploadAvatar(userId: string, file: File): Promise<string | null> {
    try {
      const fileExt = file.name.split('.').pop();
      const fileName = `${userId}-${Date.now()}.${fileExt}`;
      const filePath = `avatars/${fileName}`;

      const { error: uploadError } = await supabase.storage
        .from('avatars')
        .upload(filePath, file);

      if (uploadError) {
        console.error('Erreur lors de l\'upload de l\'avatar:', uploadError);
        return null;
      }

      const { data: { publicUrl } } = supabase.storage
        .from('avatars')
        .getPublicUrl(filePath);

      // Mettre à jour l'URL de l'avatar dans la base de données
      await this.updateUserProfile(userId, { avatar_url: publicUrl });

      return publicUrl;
    } catch (error) {
      console.error('Erreur:', error);
      return null;
    }
  }

  static getUserInitials(name: string): string {
    if (!name) return '??';
    const names = name.split(' ');
    if (names.length >= 2) {
      return `${names[0][0]}${names[1][0]}`.toUpperCase();
    }
    return name.substring(0, 2).toUpperCase();
  }
}
