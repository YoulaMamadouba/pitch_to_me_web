'use client';

import { createContext, useContext, useState, useEffect, ReactNode } from 'react';
import { 
  Lesson, 
  CreateLessonData,
  UpdateLessonData,
  getAllLessons,
  getLessonsByModule,
  createLesson,
  updateLesson,
  deleteLesson,
  getLessonById,
  getModuleStats
} from '@/lib/lessonService';

interface LessonsContextType {
  lessons: Lesson[];
  loading: boolean;
  error: string | null;
  refreshLessons: () => Promise<void>;
  getLessonsForModule: (moduleId: string) => Promise<Lesson[]>;
  createLesson: (lessonData: CreateLessonData) => Promise<Lesson>;
  updateLesson: (id: string, updates: UpdateLessonData) => Promise<Lesson>;
  deleteLesson: (id: string) => Promise<void>;
  getLessonById: (id: string) => Promise<Lesson>;
  getModuleStats: (moduleId: string) => Promise<{
    lessonCount: number;
    totalDuration: number;
  }>;
}

const LessonsContext = createContext<LessonsContextType | undefined>(undefined);

export function LessonsProvider({ children }: { children: ReactNode }) {
  const [lessons, setLessons] = useState<Lesson[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const fetchLessons = async () => {
    try {
      setLoading(true);
      setError(null);
      const data = await getAllLessons();
      setLessons(data);
    } catch (err) {
      console.error('Erreur lors du chargement des leçons:', err);
      setError(err instanceof Error ? err.message : 'Erreur lors du chargement des leçons');
    } finally {
      setLoading(false);
    }
  };

  const refreshLessons = async () => {
    await fetchLessons();
  };

  const getLessonsForModule = async (moduleId: string): Promise<Lesson[]> => {
    try {
      return await getLessonsByModule(moduleId);
    } catch (err) {
      console.error('Erreur lors de la récupération des leçons du module:', err);
      throw err;
    }
  };

  const createLessonHandler = async (lessonData: CreateLessonData): Promise<Lesson> => {
    try {
      const newLesson = await createLesson(lessonData);
      setLessons(prev => [...prev, newLesson]);
      return newLesson;
    } catch (err) {
      console.error('Erreur lors de la création de la leçon:', err);
      throw err;
    }
  };

  const updateLessonHandler = async (id: string, updates: UpdateLessonData): Promise<Lesson> => {
    try {
      const updatedLesson = await updateLesson(id, updates);
      setLessons(prev => prev.map(lesson => 
        lesson.id === id ? updatedLesson : lesson
      ));
      return updatedLesson;
    } catch (err) {
      console.error('Erreur lors de la mise à jour de la leçon:', err);
      throw err;
    }
  };

  const deleteLessonHandler = async (id: string): Promise<void> => {
    try {
      await deleteLesson(id);
      setLessons(prev => prev.filter(lesson => lesson.id !== id));
    } catch (err) {
      console.error('Erreur lors de la suppression de la leçon:', err);
      throw err;
    }
  };

  const getLessonByIdHandler = async (id: string): Promise<Lesson> => {
    try {
      return await getLessonById(id);
    } catch (err) {
      console.error('Erreur lors de la récupération de la leçon:', err);
      throw err;
    }
  };

  const getModuleStatsHandler = async (moduleId: string): Promise<{
    lessonCount: number;
    totalDuration: number;
  }> => {
    try {
      return await getModuleStats(moduleId);
    } catch (err) {
      console.error('Erreur lors de la récupération des statistiques du module:', err);
      throw err;
    }
  };

  useEffect(() => {
    fetchLessons();
  }, []);

  const value: LessonsContextType = {
    lessons,
    loading,
    error,
    refreshLessons,
    getLessonsForModule,
    createLesson: createLessonHandler,
    updateLesson: updateLessonHandler,
    deleteLesson: deleteLessonHandler,
    getLessonById: getLessonByIdHandler,
    getModuleStats: getModuleStatsHandler
  };

  return (
    <LessonsContext.Provider value={value}>
      {children}
    </LessonsContext.Provider>
  );
}

export function useLessons() {
  const context = useContext(LessonsContext);
  if (context === undefined) {
    throw new Error('useLessons must be used within a LessonsProvider');
  }
  return context;
}
