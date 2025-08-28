import { getSupabase } from './supabase';

export interface Lesson {
  id: string;
  module_id: string;
  title: string;
  description?: string;
  order_number: number;
  video_url?: string;
  duration?: number;
  created_at: string;
  order_index: number;
}

export interface CreateLessonData {
  module_id: string;
  title: string;
  description?: string;
  order_number: number;
  video_url?: string;
  duration?: number;
  order_index?: number;
}

export interface UpdateLessonData {
  title?: string;
  description?: string;
  order_number?: number;
  video_url?: string;
  duration?: number;
  order_index?: number;
}

// Récupérer toutes les leçons
export async function getAllLessons(): Promise<Lesson[]> {
  try {
    const supabase = getSupabase();
    if (!supabase) {
      throw new Error('Supabase client non initialisé');
    }

    const { data, error } = await supabase
      .from('lessons')
      .select('*')
      .order('order_index', { ascending: true });

    if (error) {
      console.error('Erreur lors de la récupération des leçons:', error);
      throw error;
    }

    return (data as unknown as Lesson[]) || [];
  } catch (error) {
    console.error('Erreur dans getAllLessons:', error);
    throw error;
  }
}

// Récupérer les leçons d'un module
export async function getLessonsByModule(moduleId: string): Promise<Lesson[]> {
  try {
    const supabase = getSupabase();
    if (!supabase) {
      throw new Error('Supabase client non initialisé');
    }

    const { data, error } = await supabase
      .from('lessons')
      .select('*')
      .eq('module_id', moduleId)
      .order('order_index', { ascending: true });

    if (error) {
      console.error('Erreur lors de la récupération des leçons du module:', error);
      throw error;
    }

    return (data as unknown as Lesson[]) || [];
  } catch (error) {
    console.error('Erreur dans getLessonsByModule:', error);
    throw error;
  }
}

// Créer une nouvelle leçon
export async function createLesson(lessonData: CreateLessonData): Promise<Lesson> {
  try {
    const supabase = getSupabase();
    if (!supabase) {
      throw new Error('Supabase client non initialisé');
    }

    // Si order_index n'est pas fourni, utiliser order_number
    const dataToInsert = {
      ...lessonData,
      order_index: lessonData.order_index || lessonData.order_number
    };

    const { data, error } = await supabase
      .from('lessons')
      .insert([dataToInsert])
      .select()
      .single();

    if (error) {
      console.error('Erreur lors de la création de la leçon:', error);
      throw error;
    }

    return data as unknown as Lesson;
  } catch (error) {
    console.error('Erreur dans createLesson:', error);
    throw error;
  }
}

// Mettre à jour une leçon
export async function updateLesson(id: string, updates: UpdateLessonData): Promise<Lesson> {
  try {
    const supabase = getSupabase();
    if (!supabase) {
      throw new Error('Supabase client non initialisé');
    }

    const { data, error } = await supabase
      .from('lessons')
      .update(updates as Record<string, unknown>)
      .eq('id', id)
      .select()
      .single();

    if (error) {
      console.error('Erreur lors de la mise à jour de la leçon:', error);
      throw error;
    }

    return data as unknown as Lesson;
  } catch (error) {
    console.error('Erreur dans updateLesson:', error);
    throw error;
  }
}

// Supprimer une leçon
export async function deleteLesson(id: string): Promise<void> {
  try {
    const supabase = getSupabase();
    if (!supabase) {
      throw new Error('Supabase client non initialisé');
    }

    const { error } = await supabase
      .from('lessons')
      .delete()
      .eq('id', id);

    if (error) {
      console.error('Erreur lors de la suppression de la leçon:', error);
      throw error;
    }
  } catch (error) {
    console.error('Erreur dans deleteLesson:', error);
    throw error;
  }
}

// Récupérer une leçon par ID
export async function getLessonById(id: string): Promise<Lesson> {
  try {
    const supabase = getSupabase();
    if (!supabase) {
      throw new Error('Supabase client non initialisé');
    }

    const { data, error } = await supabase
      .from('lessons')
      .select('*')
      .eq('id', id)
      .single();

    if (error) {
      console.error('Erreur lors de la récupération de la leçon:', error);
      throw error;
    }

    return data as unknown as Lesson;
  } catch (error) {
    console.error('Erreur dans getLessonById:', error);
    throw error;
  }
}

// Récupérer les statistiques d'un module (nombre de leçons, durée totale)
export async function getModuleStats(moduleId: string): Promise<{
  lessonCount: number;
  totalDuration: number;
}> {
  try {
    const supabase = getSupabase();
    if (!supabase) {
      throw new Error('Supabase client non initialisé');
    }

    const { data, error } = await supabase
      .from('lessons')
      .select('duration')
      .eq('module_id', moduleId);

    if (error) {
      console.error('Erreur lors de la récupération des statistiques du module:', error);
      throw error;
    }

    const lessonCount = data?.length || 0;
    const totalDuration = data?.reduce((sum, lesson) => sum + ((lesson as any).duration || 0), 0) || 0;

    return {
      lessonCount,
      totalDuration
    };
  } catch (error) {
    console.error('Erreur dans getModuleStats:', error);
    throw error;
  }
}
