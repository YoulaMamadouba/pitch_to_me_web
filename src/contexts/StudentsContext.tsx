'use client';

import { createContext, useContext, useState, ReactNode } from 'react';
import { Student } from '@/components/dashboard-coach/StudentCard';

interface StudentsContextType {
  students: Student[];
  getStudentById: (id: string) => Student | undefined;
}

const StudentsContext = createContext<StudentsContextType | undefined>(undefined);

// Données de démonstration
const initialStudents: Student[] = [
  {
    id: '1',
    name: 'Alexandre Martin',
    photo: 'https://i.pravatar.cc/150?u=alex1',
    age: 28,
    city: 'Paris',
    modules: ['Confiance en soi pour les entretiens', 'Présentation de projet efficace', 'Développement personnel'],
    progress: 85,
    rating: 4.8,
    joinedAt: '2024-01-15',
    lastActivity: '2024-01-25'
  },
  {
    id: '2',
    name: 'Sarah Johnson',
    photo: 'https://i.pravatar.cc/150?u=sarah1',
    age: 32,
    city: 'Lyon',
    modules: ['Techniques de vente avancées', 'Communication digitale'],
    progress: 67,
    rating: 4.6,
    joinedAt: '2024-01-20',
    lastActivity: '2024-01-24'
  },
  {
    id: '3',
    name: 'David Chen',
    photo: 'https://i.pravatar.cc/150?u=david1',
    age: 25,
    city: 'Marseille',
    modules: ['Management d\'équipe', 'Présentation financière'],
    progress: 92,
    rating: 4.9,
    joinedAt: '2024-01-10',
    lastActivity: '2024-01-26'
  },
  {
    id: '4',
    name: 'Emma Dubois',
    photo: 'https://i.pravatar.cc/150?u=emma1',
    age: 29,
    city: 'Bordeaux',
    modules: ['Négociation commerciale', 'Stratégies marketing'],
    progress: 73,
    rating: 4.7,
    joinedAt: '2024-01-18',
    lastActivity: '2024-01-23'
  },
  {
    id: '5',
    name: 'Thomas Leroy',
    photo: 'https://i.pravatar.cc/150?u=thomas1',
    age: 35,
    city: 'Nantes',
    modules: ['Développement personnel', 'Confiance en soi pour les entretiens'],
    progress: 45,
    rating: 4.5,
    joinedAt: '2024-01-22',
    lastActivity: '2024-01-25'
  },
  {
    id: '6',
    name: 'Julie Moreau',
    photo: 'https://i.pravatar.cc/150?u=julie1',
    age: 27,
    city: 'Toulouse',
    modules: ['Communication digitale', 'Présentation de projet efficace'],
    progress: 78,
    rating: 4.8,
    joinedAt: '2024-01-12',
    lastActivity: '2024-01-26'
  }
];

export function StudentsProvider({ children }: { children: ReactNode }) {
  const [students] = useState<Student[]>(initialStudents);

  const getStudentById = (id: string) => {
    return students.find(student => student.id === id);
  };

  return (
    <StudentsContext.Provider value={{
      students,
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
