import { getSupabase } from './supabase';

export interface ActivityDomain {
  id: string;
  name: string;
  description: string;
  type: 'b2b' | 'b2c';
  color: string;
  icon_name: string;
  created_at: string;
  updated_at: string;
  moduleCount?: number;
  totalLessons?: number;
  totalDuration?: number;
  studentsCount?: number;
}

export interface CreateActivityDomainData {
  name: string;
  description: string;
  type: 'b2b' | 'b2c';
  color: string;
  icon_name: string;
}

export async function getAllActivityDomains(): Promise<ActivityDomain[]> {
  try {
    const supabase = getSupabase();
    
    if (!supabase) {
      throw new Error('Supabase client non initialisé');
    }

    const { data, error } = await supabase
      .from('activity_domains')
      .select('*')
      .order('name');

    if (error) {
      console.error('Erreur lors de la récupération des domaines d\'activité:', error);
      throw error;
    }

    return (data as unknown as ActivityDomain[]) || [];
  } catch (error) {
    console.error('Erreur dans getAllActivityDomains:', error);
    throw error;
  }
}

export async function getActivityDomainsByType(type: 'b2b' | 'b2c'): Promise<ActivityDomain[]> {
  try {
    const supabase = getSupabase();
    
    if (!supabase) {
      throw new Error('Supabase client non initialisé');
    }

    const { data, error } = await supabase
      .from('activity_domains')
      .select('*')
      .eq('type', type)
      .order('name');

    if (error) {
      console.error('Erreur lors de la récupération des domaines d\'activité:', error);
      throw error;
    }

    return (data as unknown as ActivityDomain[]) || [];
  } catch (error) {
    console.error('Erreur dans getActivityDomainsByType:', error);
    throw error;
  }
}

export async function getActivityDomainById(id: string): Promise<ActivityDomain | null> {
  try {
    const supabase = getSupabase();
    
    if (!supabase) {
      throw new Error('Supabase client non initialisé');
    }

    const { data, error } = await supabase
      .from('activity_domains')
      .select('*')
      .eq('id', id)
      .single();

    if (error) {
      console.error('Erreur lors de la récupération du domaine d\'activité:', error);
      throw error;
    }

    return data as unknown as ActivityDomain;
  } catch (error) {
    console.error('Erreur dans getActivityDomainById:', error);
    throw error;
  }
}

export async function createActivityDomain(domainData: CreateActivityDomainData): Promise<ActivityDomain> {
  try {
    const supabase = getSupabase();
    
    if (!supabase) {
      throw new Error('Supabase client non initialisé');
    }

    const { data, error } = await supabase
      .from('activity_domains')
      .insert([domainData as any])
      .select()
      .single();

    if (error) {
      console.error('Erreur lors de la création du domaine d\'activité:', error);
      throw error;
    }

    return data as unknown as ActivityDomain;
  } catch (error) {
    console.error('Erreur dans createActivityDomain:', error);
    throw error;
  }
}

export async function updateActivityDomain(id: string, updates: Partial<CreateActivityDomainData>): Promise<ActivityDomain> {
  try {
    const supabase = getSupabase();
    
    if (!supabase) {
      throw new Error('Supabase client non initialisé');
    }

    const { data, error } = await supabase
      .from('activity_domains')
      .update(updates)
      .eq('id', id)
      .select()
      .single();

    if (error) {
      console.error('Erreur lors de la mise à jour du domaine d\'activité:', error);
      throw error;
    }

    return data as unknown as ActivityDomain;
  } catch (error) {
    console.error('Erreur dans updateActivityDomain:', error);
    throw error;
  }
}

export async function deleteActivityDomain(id: string): Promise<void> {
  try {
    const supabase = getSupabase();
    
    if (!supabase) {
      throw new Error('Supabase client non initialisé');
    }

    const { error } = await supabase
      .from('activity_domains')
      .delete()
      .eq('id', id);

    if (error) {
      console.error('Erreur lors de la suppression du domaine d\'activité:', error);
      throw error;
    }
  } catch (error) {
    console.error('Erreur dans deleteActivityDomain:', error);
    throw error;
  }
}

export async function getActivityDomainStats(domainId: string): Promise<{
  moduleCount: number;
  totalLessons: number;
  totalDuration: number;
  studentsCount: number;
}> {
  try {
    const supabase = getSupabase();
    
    if (!supabase) {
      throw new Error('Supabase client non initialisé');
    }

    // Compter les modules
    const { count: moduleCount, error: moduleError } = await supabase
      .from('modules')
      .select('*', { count: 'exact', head: true })
      .eq('activity_domain_id', domainId);

    if (moduleError) {
      console.error('Erreur lors du comptage des modules:', moduleError);
      throw moduleError;
    }

    // D'abord récupérer les IDs des modules
    const { data: moduleIds, error: moduleIdsError } = await supabase
      .from('modules')
      .select('id')
      .eq('activity_domain_id', domainId);

    if (moduleIdsError) {
      console.error('Erreur lors de la récupération des modules:', moduleIdsError);
      throw moduleIdsError;
    }

    const moduleIdList = moduleIds?.map(m => m.id) || [];

    // Compter les leçons et durée totale
    const { data: lessons, error: lessonsError } = await supabase
      .from('lessons')
      .select('duration_minutes')
      .in('module_id', moduleIdList);

    if (lessonsError) {
      console.error('Erreur lors de la récupération des leçons:', lessonsError);
      throw lessonsError;
    }

    const totalLessons = lessons?.length || 0;
    const totalDuration = lessons?.reduce((sum, lesson) => sum + ((lesson as any).duration_minutes || 0), 0) || 0;

    // Compter les étudiants (inscriptions aux domaines pour B2C, employés des entreprises pour B2B)
    const { count: studentsCount, error: studentsError } = await supabase
      .from('student_domain_enrollments')
      .select('*', { count: 'exact', head: true })
      .eq('activity_domain_id', domainId)
      .eq('status', 'active');

    if (studentsError) {
      console.error('Erreur lors du comptage des étudiants:', studentsError);
      throw studentsError;
    }

    return {
      moduleCount: moduleCount || 0,
      totalLessons,
      totalDuration,
      studentsCount: studentsCount || 0
    };
  } catch (error) {
    console.error('Erreur dans getActivityDomainStats:', error);
    throw error;
  }
}
