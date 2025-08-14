import { createClient } from '@supabase/supabase-js';

let supabaseInstance: ReturnType<typeof createClient> | null = null;

export function getSupabase() {
  if (supabaseInstance) return supabaseInstance;

  const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL;
  const supabaseAnonKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY;

  // En SSR, évite de crasher pendant l'import si les vars ne sont pas encore injectées
  if ((!supabaseUrl || !supabaseAnonKey) && typeof window === 'undefined') {
    return null as unknown as ReturnType<typeof createClient>;
  }

  if (!supabaseUrl || !supabaseAnonKey) {
    throw new Error("Variables d'environnement Supabase manquantes. Vérifiez NEXT_PUBLIC_SUPABASE_URL et NEXT_PUBLIC_SUPABASE_ANON_KEY dans votre fichier .env.local");
  }

  supabaseInstance = createClient(supabaseUrl, supabaseAnonKey);
  return supabaseInstance;
}

// Types TypeScript pour les tables de la base de données
export interface User {
  id: string;
  name: string;
  email: string;
  role: 'coach' | 'admin' | 'rh' | 'employee' | 'individual';
  level: number;
  xp: number;
  company_id?: string;
  created_at: string;
}

export interface Company {
  id: string;
  name: string;
  domain: string;
  logo?: string;
  employee_count: number;
  rh_user_id: string;
  created_by: string;
  status: 'active' | 'inactive';
  created_at: string;
}

export interface Coach {
  id: string;
  user_id: string;
  expertise: string;
  sessions_conducted: number;
}

export interface Student {
  id: string;
  user_id: string;
  progress?: any;
  vr_sessions: number;
}

export interface Module {
  id: string;
  title: string;
  description: string;
  video_url?: string;
  theme?: string;
  domain_metier?: string;
  type_offre?: string;
  niveau_difficulte?: 'debutant' | 'intermediaire' | 'avance';
  duree_estimee: number;
  mots_cles?: string;
  locked: boolean;
  video_id?: string;
  created_by: string;
  created_at: string;
}

export interface Lesson {
  id: string;
  module_id: string;
  title: string;
  description?: string;
  order_number: number;
  video_url?: string;
  duration?: number;
  created_at: string;
}

export interface Session {
  id: string;
  coach_id: string;
  student_id: string;
  module_id: string;
  type: 'vr' | 'recording' | 'live';
  status: 'active' | 'completed';
  start_time: string;
  end_time?: string;
  video_id?: string;
}

export interface Payment {
  id: string;
  user_id: string;
  amount: number;
  currency: 'USD' | 'EUR' | 'XOF';
  status: 'pending' | 'completed' | 'failed';
  plan: 'standard' | 'premium';
  created_at: string;
}

export interface Video {
  id: string;
  title: string;
  description: string;
  file: string;
  duration: number;
  created_by: string;
  session_id?: string;
  module_id?: string;
  status: 'draft' | 'published' | 'archived';
  upload_date: string;
}
