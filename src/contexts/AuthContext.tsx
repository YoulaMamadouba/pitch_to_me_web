'use client';

import { createContext, useContext, useEffect, useState } from 'react';
import { User, Session } from '@supabase/supabase-js';
import { getSupabase } from '@/lib/supabase';
import { useRouter } from 'next/navigation';

interface AuthContextType {
  user: User | null;
  session: Session | null;
  loading: boolean;
  signIn: (email: string, password: string) => Promise<{ error: any }>;
  signUp: (email: string, password: string, name: string, role: string) => Promise<{ error: any }>;
  signOut: () => Promise<void>;
  updateUser: (updates: any) => Promise<{ error: any }>;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export function AuthProvider({ children }: { children: React.ReactNode }) {
  const [user, setUser] = useState<User | null>(null);
  const [session, setSession] = useState<Session | null>(null);
  const [loading, setLoading] = useState(true);
  const router = useRouter();

  useEffect(() => {
    // Récupérer la session initiale
    const getSession = async () => {
      const supabase = getSupabase();
      if (!supabase) return setLoading(false);
      const { data: { session } } = await supabase.auth.getSession();
      setSession(session);
      setUser(session?.user ?? null);
      setLoading(false);
    };

    getSession();

    // Écouter les changements d'authentification
    const supabaseForListener = getSupabase();
    if (!supabaseForListener) return;
    const { data: { subscription } } = supabaseForListener.auth.onAuthStateChange(
      async (event, session) => {
        setSession(session);
        setUser(session?.user ?? null);
        setLoading(false);

        // Redirection basée sur le rôle après connexion
        if (event === 'SIGNED_IN' && session?.user) {
          // Vérifier si on est sur la page d'inscription
          const isOnSignupPage = window.location.pathname === '/signup';
          
          // Si on est sur la page d'inscription, ne pas rediriger automatiquement
          if (isOnSignupPage) {
            return;
          }
          
          try {
            const metadataRole = (session.user.user_metadata as any)?.role as string | undefined;
            if (metadataRole) {
              switch (metadataRole) {
                case 'coach':
                  router.push('/coach-dashboard');
                  break;
                case 'rh':
                  router.push('/hr-dashboard');
                  break;
                case 'employee':
                  router.push('/b2b');
                  break;
                case 'individual':
                  router.push('/dashboard');
                  break;
                default:
                  router.push('/dashboard');
              }
              return;
            }

            const supabase = getSupabase();
            if (!supabase) return;
            const { data: userData } = await supabase
              .from('users')
              .select('role')
              .eq('id', session.user.id)
              .single();

            if (userData) {
              switch (userData.role) {
                case 'coach':
                  router.push('/coach-dashboard');
                  break;
                case 'rh':
                  router.push('/hr-dashboard');
                  break;
                case 'employee':
                  router.push('/b2b');
                  break;
                case 'individual':
                  router.push('/dashboard');
                  break;
                default:
                  router.push('/dashboard');
              }
            }
          } catch (error) {
            console.error('Erreur lors de la récupération du rôle:', error);
            router.push('/dashboard');
          }
        }
      }
    );

    return () => subscription.unsubscribe();
  }, [router]);

  const signIn = async (email: string, password: string) => {
    const supabase = getSupabase();
    if (!supabase) return { error: { message: 'Supabase non configuré' } } as any;
    const { error } = await supabase.auth.signInWithPassword({
      email: email.trim(),
      password: password.trim(),
    });
    return { error };
  };

  const signUp = async (email: string, password: string, name: string, role: string) => {
    const supabase = getSupabase();
    if (!supabase) return { error: { message: 'Supabase non configuré' } } as any;
    const { data, error } = await supabase.auth.signUp({
      email,
      password,
      options: {
        data: {
          name,
          role,
        },
      },
    });

    if (!error && data.user) {
      // Créer l'utilisateur dans la table users
      const { error: insertError } = await supabase
        .from('users')
        .insert([
          {
            id: data.user.id,
            name,
            email,
            role,
            level: 0,
            xp: 0,
          },
        ]);

      if (insertError) {
        console.error('Erreur lors de la création de l\'utilisateur:', insertError);
        return { error: insertError };
      }

      // Créer un étudiant si c'est un individual
      if (role === 'individual') {
        const { error: studentError } = await supabase
          .from('students')
          .insert([
            {
              user_id: data.user.id,
              progress: {},
              vr_sessions: 0,
            },
          ]);

        if (studentError) {
          console.error('Erreur lors de la création de l\'étudiant:', studentError);
        }
      }
    }

    return { error };
  };

  const signOut = async () => {
    const supabase = getSupabase();
    if (supabase) await supabase.auth.signOut();
    router.push('/login');
  };

  const updateUser = async (updates: any) => {
    const supabase = getSupabase();
    if (!supabase) return { error: { message: 'Supabase non configuré' } } as any;
    const { error } = await supabase.auth.updateUser(updates);
    return { error };
  };

  const value = {
    user,
    session,
    loading,
    signIn,
    signUp,
    signOut,
    updateUser,
  };

  return (
    <AuthContext.Provider value={value}>
      {children}
    </AuthContext.Provider>
  );
}

export function useAuth() {
  const context = useContext(AuthContext);
  if (context === undefined) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
}
