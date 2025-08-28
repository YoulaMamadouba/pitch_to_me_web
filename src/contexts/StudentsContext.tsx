'use client';

import { createContext, useContext, useState, useEffect, ReactNode } from 'react';
import { StudentData, getAllStudents, getStudentById as getStudentByIdService } from '@/lib/studentService';

interface StudentsContextType {
  students: StudentData[];
  loading: boolean;
  error: string | null;
  refreshStudents: () => Promise<void>;
  getStudentById: (id: string) => StudentData | undefined;
}

const StudentsContext = createContext<StudentsContextType | undefined>(undefined);

export function StudentsProvider({ children }: { children: ReactNode }) {
  const [students, setStudents] = useState<StudentData[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const fetchStudents = async () => {
    try {
      setLoading(true);
      setError(null);
      const studentsData = await getAllStudents();
      setStudents(studentsData);
    } catch (err) {
      console.error('Erreur lors de la récupération des étudiants:', err);
      setError(err instanceof Error ? err.message : 'Erreur lors de la récupération des étudiants');
    } finally {
      setLoading(false);
    }
  };

  const refreshStudents = async () => {
    await fetchStudents();
  };

  const getStudentById = (id: string) => {
    return students.find(student => student.id === id);
  };

  useEffect(() => {
    fetchStudents();
  }, []);

  return (
    <StudentsContext.Provider value={{
      students,
      loading,
      error,
      refreshStudents,
      getStudentById
    }}>
      {children}
    </StudentsContext.Provider>
  );
}

export function useStudents() {
  const context = useContext(StudentsContext);
  if (context === undefined) {
    throw new Error('useStudents must be used within a StudentsProvider');
  }
  return context;
}
