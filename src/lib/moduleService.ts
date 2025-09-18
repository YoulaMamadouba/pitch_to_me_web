import { getSupabase } from './supabase';

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
  type: 'b2b' | 'b2c';
  activity_domain_id?: string;
  lessonCount?: number;
  studentsCount?: number;
  averageRating?: number;
}

export interface CreateModuleData {
  title: string;
  description: string;
  video_url?: string;
  theme?: string;
  domain_metier?: string;
  type_offre?: string;
  niveau_difficulte?: 'debutant' | 'intermediaire' | 'avance';
  duree_estimee: number;
  mots_cles?: string;
  locked?: boolean;
  video_id?: string;
  type: 'b2b' | 'b2c';
  activity_domain_id?: string;
}

export async function getAllModules(): Promise<Module[]> {
  try {
    const supabase = getSupabase();
    
    if (!supabase) {
      throw new Error('Supabase client non initialisé');
    }

    const { data, error } = await supabase
      .from('modules')
      .select(`
        *,
        activity_domains!inner(
          id,
          name,
          type
        )
      `)
      .order('created_at', { ascending: false });

    if (error) {
      console.error('Erreur lors de la récupération des modules:', error);
      throw error;
    }

    return (data as unknown as Module[]) || [];
  } catch (error) {
    console.error('Erreur dans getAllModules:', error);
    throw error;
  }
}

export async function getModulesByType(type: 'b2b' | 'b2c'): Promise<Module[]> {
  try {
    const supabase = getSupabase();
    
    if (!supabase) {
      throw new Error('Supabase client non initialisé');
    }

    const { data, error } = await supabase
      .from('modules')
      .select(`
        *,
        activity_domains!inner(
          id,
          name,
          type
        )
      `)
      .eq('type', type)
      .order('created_at', { ascending: false });

    if (error) {
      console.error('Erreur lors de la récupération des modules:', error);
      throw error;
    }

    return (data as unknown as Module[]) || [];
  } catch (error) {
    console.error('Erreur dans getModulesByType:', error);
    throw error;
  }
}

export async function getModulesByActivityDomain(activityDomainId: string): Promise<Module[]> {
  try {
    const supabase = getSupabase();
    
    if (!supabase) {
      throw new Error('Supabase client non initialisé');
    }

    const { data, error } = await supabase
      .from('modules')
      .select(`
        *,
        activity_domains!inner(
          id,
          name,
          type
        )
      `)
      .eq('activity_domain_id', activityDomainId)
      .order('created_at', { ascending: false });

    if (error) {
      console.error('Erreur lors de la récupération des modules:', error);
      throw error;
    }

    return (data as unknown as Module[]) || [];
  } catch (error) {
    console.error('Erreur dans getModulesByActivityDomain:', error);
    throw error;
  }
}

export async function getModuleById(id: string): Promise<Module | null> {
  try {
    const supabase = getSupabase();
    
    if (!supabase) {
      throw new Error('Supabase client non initialisé');
    }

    const { data, error } = await supabase
      .from('modules')
      .select(`
        *,
        activity_domains!inner(
          id,
          name,
          type
        )
      `)
      .eq('id', id)
      .single();

    if (error) {
      console.error('Erreur lors de la récupération du module:', error);
      throw error;
    }

    return data as unknown as Module;
  } catch (error) {
    console.error('Erreur dans getModuleById:', error);
    throw error;
  }
}

export async function createModule(moduleData: CreateModuleData): Promise<Module> {
  try {
    console.log('=== DÉBUT createModule SERVICE ===');
    const supabase = getSupabase();
    
    if (!supabase) {
      throw new Error('Supabase client non initialisé');
    }

    console.log('Données du module à créer:', moduleData);

    // Récupérer l'utilisateur actuel
    console.log('Récupération de l\'utilisateur...');
    let user;
    let userError;
    
    try {
      const userResult = await supabase.auth.getUser();
      user = userResult.data.user;
      userError = userResult.error;
      console.log('Utilisateur récupéré:', user);
      console.log('Erreur utilisateur:', userError);
    } catch (authError) {
      console.error('Erreur lors de la récupération de l\'utilisateur:', authError);
      throw new Error(`Erreur d'authentification: ${authError instanceof Error ? authError.message : 'Erreur inconnue'}`);
    }
    
    if (userError || !user) {
      throw new Error('Utilisateur non authentifié');
    }

    // Ajouter l'ID de l'utilisateur créateur
    const moduleDataWithCreator = {
      ...moduleData,
      created_by: user.id
    };

    // Nettoyer les données pour éviter les erreurs UUID
    const cleanedData = {
      ...moduleDataWithCreator,
      // Supprimer video_id si ce n'est pas un UUID valide
      video_id: moduleDataWithCreator.video_id && 
                moduleDataWithCreator.video_id !== "1" && 
                moduleDataWithCreator.video_id !== "" ? 
                moduleDataWithCreator.video_id : null,
      // S'assurer que les champs optionnels sont corrects
      domain_metier: moduleDataWithCreator.domain_metier || null,
      type_offre: moduleDataWithCreator.type_offre || null,
      theme: moduleDataWithCreator.theme || null,
      mots_cles: moduleDataWithCreator.mots_cles || null
    };

    console.log('Données complètes du module:', cleanedData);
    console.log('Préparation de la requête Supabase...');

    const { data, error } = await supabase
      .from('modules')
      .insert([cleanedData])
      .select(`
        *,
        activity_domains!inner(
          id,
          name,
          type
        )
      `)
      .single();

    console.log('Réponse Supabase - data:', data);
    console.log('Réponse Supabase - error:', error);

    if (error) {
      console.error('Erreur lors de la création du module:', error);
      console.error('Détails de l\'erreur:', {
        message: error.message,
        details: error.details,
        hint: error.hint,
        code: error.code
      });
      console.error('Erreur complète JSON:', JSON.stringify(error, null, 2));
      throw error;
    }

    console.log('Module créé avec succès:', data);
    console.log('=== FIN createModule SERVICE ===');
    return data as unknown as Module;
  } catch (error) {
    console.error('=== ERREUR dans createModule SERVICE ===');
    console.error('Erreur complète:', error);
    console.error('Type d\'erreur:', typeof error);
    console.error('Message d\'erreur:', error instanceof Error ? error.message : 'Erreur inconnue');
    console.error('Stack trace:', error instanceof Error ? error.stack : 'Pas de stack trace');
    throw error;
  }
}

export async function updateModule(id: string, updates: Partial<CreateModuleData>): Promise<Module> {
  try {
    const supabase = getSupabase();
    
    if (!supabase) {
      throw new Error('Supabase client non initialisé');
    }

    const { data, error } = await supabase
      .from('modules')
      .update(updates)
      .eq('id', id)
      .select(`
        *,
        activity_domains!inner(
          id,
          name,
          type
        )
      `)
      .single();

    if (error) {
      console.error('Erreur lors de la mise à jour du module:', error);
      throw error;
    }

    return data as unknown as Module;
  } catch (error) {
    console.error('Erreur dans updateModule:', error);
    throw error;
  }
}

export async function deleteModule(id: string): Promise<void> {
  try {
    const supabase = getSupabase();
    
    if (!supabase) {
      throw new Error('Supabase client non initialisé');
    }

    const { error } = await supabase
      .from('modules')
      .delete()
      .eq('id', id);

    if (error) {
      console.error('Erreur lors de la suppression du module:', error);
      throw error;
    }
  } catch (error) {
    console.error('Erreur dans deleteModule:', error);
    throw error;
  }
}

export async function getModuleStats(moduleId: string): Promise<{
  lessonCount: number;
  studentsCount: number;
  averageRating: number;
}> {
  try {
    const supabase = getSupabase();
    
    if (!supabase) {
      throw new Error('Supabase client non initialisé');
    }

    // Compter les leçons
    const { count: lessonCount, error: lessonError } = await supabase
      .from('lessons')
      .select('*', { count: 'exact', head: true })
      .eq('module_id', moduleId);

    if (lessonError) {
      console.error('Erreur lors du comptage des leçons:', lessonError);
      throw lessonError;
    }

    // Compter les étudiants (progression)
    const { count: studentsCount, error: studentsError } = await supabase
      .from('student_progress')
      .select('*', { count: 'exact', head: true })
      .eq('module_id', moduleId);

    if (studentsError) {
      console.error('Erreur lors du comptage des étudiants:', studentsError);
      throw studentsError;
    }

    // Note moyenne (à implémenter plus tard avec un système de notation)
    const averageRating = 0;

    return {
      lessonCount: lessonCount || 0,
      studentsCount: studentsCount || 0,
      averageRating
    };
  } catch (error) {
    console.error('Erreur dans getModuleStats:', error);
    throw error;
  }
}

export async function getModulesForStudent(studentId: string, studentType: 'b2b' | 'b2c'): Promise<Module[]> {
  try {
    const supabase = getSupabase();
    
    if (!supabase) {
      throw new Error('Supabase client non initialisé');
    }

    if (studentType === 'b2c') {
      // Pour les étudiants individuels, récupérer les modules du domaine d'activité choisi
      const { data: enrollments, error: enrollmentError } = await supabase
        .from('student_domain_enrollments')
        .select('activity_domain_id')
        .eq('student_id', studentId)
        .eq('status', 'active');

      if (enrollmentError) {
        console.error('Erreur lors de la récupération des inscriptions:', enrollmentError);
        throw enrollmentError;
      }

      if (!enrollments || enrollments.length === 0) {
        return [];
      }

      const domainIds = enrollments.map(e => e.activity_domain_id);

      const { data, error } = await supabase
        .from('modules')
        .select(`
          *,
          activity_domains!inner(
            id,
            name,
            type
          )
        `)
        .in('activity_domain_id', domainIds)
        .eq('type', 'b2c')
        .order('created_at', { ascending: false });

      if (error) {
        console.error('Erreur lors de la récupération des modules:', error);
        throw error;
      }

      return (data as unknown as Module[]) || [];
    } else {
      // Pour les employés B2B, récupérer les modules de l'entreprise
      const { data: user, error: userError } = await supabase
        .from('users')
        .select('company_id')
        .eq('id', studentId)
        .single();

      if (userError) {
        console.error('Erreur lors de la récupération de l\'utilisateur:', userError);
        throw userError;
      }

      if (!user.company_id) {
        return [];
      }

      const { data: company, error: companyError } = await supabase
        .from('companies')
        .select('activity_domain_id')
        .eq('id', user.company_id)
        .single();

      if (companyError) {
        console.error('Erreur lors de la récupération de l\'entreprise:', companyError);
        throw companyError;
      }

      if (!company.activity_domain_id) {
        return [];
      }

      const { data, error } = await supabase
        .from('modules')
        .select(`
          *,
          activity_domains!inner(
            id,
            name,
            type
          )
        `)
        .eq('activity_domain_id', company.activity_domain_id)
        .eq('type', 'b2b')
        .order('created_at', { ascending: false });

      if (error) {
        console.error('Erreur lors de la récupération des modules:', error);
        throw error;
      }

      return (data as unknown as Module[]) || [];
    }
  } catch (error) {
    console.error('Erreur dans getModulesForStudent:', error);
    throw error;
  }
}
