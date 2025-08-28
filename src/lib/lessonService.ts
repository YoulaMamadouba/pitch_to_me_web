import { getSupabase } from './supabase';

export interface Lesson {
  id: string;
  module_id: string;
  title: string;
  description?: string;
  content_type: 'video' | 'pdf' | 'text' | 'quiz' | 'exercise';
  content_url?: string;
  content_text?: string;
  duration_minutes: number;
  order_index: number;
  is_locked: boolean;
  created_at: string;
  updated_at: string;
}

export interface CreateLessonData {
  module_id: string;
  title: string;
  description?: string;
  content_type: 'video' | 'pdf' | 'text' | 'quiz' | 'exercise';
  content_url?: string;
  content_text?: string;
  duration_minutes?: number;
  order_index?: number;
  is_locked?: boolean;
}

export interface StudentProgress {
  id: string;
  student_id: string;
  lesson_id: string;
  module_id: string;
  status: 'not_started' | 'in_progress' | 'completed' | 'failed';
  progress_percentage: number;
  time_spent_seconds: number;
  completed_at?: string;
  created_at: string;
  updated_at: string;
}

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
      console.error('Erreur lors de la récupération des leçons:', error);
      throw error;
    }

    return data || [];
  } catch (error) {
    console.error('Erreur dans getLessonsByModule:', error);
    throw error;
  }
}

export async function getLessonById(id: string): Promise<Lesson | null> {
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

    return data;
  } catch (error) {
    console.error('Erreur dans getLessonById:', error);
    throw error;
  }
}

export async function createLesson(lessonData: CreateLessonData): Promise<Lesson> {
  try {
    const supabase = getSupabase();
    
    if (!supabase) {
      throw new Error('Supabase client non initialisé');
    }

    // Si order_index n'est pas fourni, calculer le prochain ordre
    if (!lessonData.order_index) {
      const { data: existingLessons } = await supabase
        .from('lessons')
        .select('order_index')
        .eq('module_id', lessonData.module_id)
        .order('order_index', { ascending: false })
        .limit(1);

      lessonData.order_index = existingLessons && existingLessons.length > 0 
        ? existingLessons[0].order_index + 1 
        : 1;
    }

    const { data, error } = await supabase
      .from('lessons')
      .insert([lessonData])
      .select()
      .single();

    if (error) {
      console.error('Erreur lors de la création de la leçon:', error);
      throw error;
    }

    return data;
  } catch (error) {
    console.error('Erreur dans createLesson:', error);
    throw error;
  }
}

export async function updateLesson(id: string, updates: Partial<CreateLessonData>): Promise<Lesson> {
  try {
    const supabase = getSupabase();
    
    if (!supabase) {
      throw new Error('Supabase client non initialisé');
    }

    const { data, error } = await supabase
      .from('lessons')
      .update(updates)
      .eq('id', id)
      .select()
      .single();

    if (error) {
      console.error('Erreur lors de la mise à jour de la leçon:', error);
      throw error;
    }

    return data;
  } catch (error) {
    console.error('Erreur dans updateLesson:', error);
    throw error;
  }
}

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

export async function reorderLessons(moduleId: string, lessonIds: string[]): Promise<void> {
  try {
    const supabase = getSupabase();
    
    if (!supabase) {
      throw new Error('Supabase client non initialisé');
    }

    // Mettre à jour l'ordre de chaque leçon
    for (let i = 0; i < lessonIds.length; i++) {
      const { error } = await supabase
        .from('lessons')
        .update({ order_index: i + 1 })
        .eq('id', lessonIds[i])
        .eq('module_id', moduleId);

      if (error) {
        console.error('Erreur lors de la réorganisation des leçons:', error);
        throw error;
      }
    }
  } catch (error) {
    console.error('Erreur dans reorderLessons:', error);
    throw error;
  }
}

// Fonctions pour la progression des étudiants
export async function getStudentProgress(studentId: string, moduleId?: string): Promise<StudentProgress[]> {
  try {
    const supabase = getSupabase();
    
    if (!supabase) {
      throw new Error('Supabase client non initialisé');
    }

    let query = supabase
      .from('student_progress')
      .select('*')
      .eq('student_id', studentId);

    if (moduleId) {
      query = query.eq('module_id', moduleId);
    }

    const { data, error } = await query.order('created_at', { ascending: false });

    if (error) {
      console.error('Erreur lors de la récupération de la progression:', error);
      throw error;
    }

    return data || [];
  } catch (error) {
    console.error('Erreur dans getStudentProgress:', error);
    throw error;
  }
}

export async function updateStudentProgress(
  studentId: string, 
  lessonId: string, 
  moduleId: string, 
  progress: Partial<StudentProgress>
): Promise<StudentProgress> {
  try {
    const supabase = getSupabase();
    
    if (!supabase) {
      throw new Error('Supabase client non initialisé');
    }

    // Vérifier si une progression existe déjà
    const { data: existingProgress } = await supabase
      .from('student_progress')
      .select('*')
      .eq('student_id', studentId)
      .eq('lesson_id', lessonId)
      .single();

    if (existingProgress) {
      // Mettre à jour la progression existante
      const { data, error } = await supabase
        .from('student_progress')
        .update(progress)
        .eq('id', existingProgress.id)
        .select()
        .single();

      if (error) {
        console.error('Erreur lors de la mise à jour de la progression:', error);
        throw error;
      }

      return data;
    } else {
      // Créer une nouvelle progression
      const { data, error } = await supabase
        .from('student_progress')
        .insert([{
          student_id: studentId,
          lesson_id: lessonId,
          module_id: moduleId,
          ...progress
        }])
        .select()
        .single();

      if (error) {
        console.error('Erreur lors de la création de la progression:', error);
        throw error;
      }

      return data;
    }
  } catch (error) {
    console.error('Erreur dans updateStudentProgress:', error);
    throw error;
  }
}

export async function getModuleProgress(studentId: string, moduleId: string): Promise<{
  totalLessons: number;
  completedLessons: number;
  inProgressLessons: number;
  progressPercentage: number;
}> {
  try {
    const supabase = getSupabase();
    
    if (!supabase) {
      throw new Error('Supabase client non initialisé');
    }

    // Récupérer toutes les leçons du module
    const { data: lessons, error: lessonsError } = await supabase
      .from('lessons')
      .select('id')
      .eq('module_id', moduleId);

    if (lessonsError) {
      console.error('Erreur lors de la récupération des leçons:', lessonsError);
      throw lessonsError;
    }

    const totalLessons = lessons?.length || 0;

    if (totalLessons === 0) {
      return {
        totalLessons: 0,
        completedLessons: 0,
        inProgressLessons: 0,
        progressPercentage: 0
      };
    }

    // Récupérer la progression de l'étudiant
    const { data: progress, error: progressError } = await supabase
      .from('student_progress')
      .select('status')
      .eq('student_id', studentId)
      .eq('module_id', moduleId);

    if (progressError) {
      console.error('Erreur lors de la récupération de la progression:', progressError);
      throw progressError;
    }

    const completedLessons = progress?.filter(p => p.status === 'completed').length || 0;
    const inProgressLessons = progress?.filter(p => p.status === 'in_progress').length || 0;
    const progressPercentage = Math.round((completedLessons / totalLessons) * 100);

    return {
      totalLessons,
      completedLessons,
      inProgressLessons,
      progressPercentage
    };
  } catch (error) {
    console.error('Erreur dans getModuleProgress:', error);
    throw error;
  }
}
