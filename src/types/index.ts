// Types de base
export type LessonStatus = 'completed' | 'in-progress' | 'locked' | 'unlocked';
export type LessonType = 'video' | 'reading' | 'quiz' | 'exercise';

export interface BaseLesson {
  id: string;
  title: string;
  description: string;
  duration: number; // en minutes
  type: LessonType;
  status: LessonStatus;
  order: number;
  videoUrl?: string;
  content?: string;
  questions?: Array<{
    id: string;
    question: string;
    options: string[];
    correctAnswer: number;
  }>;
  thumbnailUrl?: string;
  rating?: number;
}

export interface BaseModule {
  id: string;
  title: string;
  description: string;
  videoUrl: string;
  theme: string;
  domain: string;
  offerType?: string;
  activityDomain?: string;
  difficulty: 'easy' | 'intermediate' | 'advanced';
  duration: number; // en minutes
  tags: string[];
  rating: number;
  studentsCount: number;
  createdAt: string;
  status?: LessonStatus;
  progress?: number;
  lessons?: BaseLesson[];
}

// Types pour le tableau de bord étudiant
export interface StudentModule extends BaseModule {
  progress: number;
  totalLessons: number;
  completedLessons: number;
  lessons: BaseLesson[];
}

// Types pour le tableau de bord coach
export interface CoachModule extends BaseModule {
  lessons: BaseLesson[];
  progress: number;
  status: 'locked' | 'unlocked' | 'in-progress' | 'completed';
}

// Types pour les domaines
export interface Domain {
  id: string;
  name: string;
  description: string;
  icon: React.ComponentType<{ className?: string }>;
  moduleCount: number;
  color: string;
}

// Types pour les props des composants
export interface ModuleFolderCardProps {
  id: string;
  title: string;
  description: string;
  lessonCount: number;
  duration: number;
  progress: number;
  isLocked: boolean;
  onClick: () => void;
}

export interface LessonListProps {
  module: CoachModule;
  onBack: () => void;
  onLessonSelect: (lesson: BaseLesson) => void;
}

export interface ModulesListProps {
  domain: Domain;
  modules: CoachModule[];
  onBack: () => void;
  onCreateModule: () => void;
  onEditModule: (module: CoachModule) => void;
  onDeleteModule: (moduleId: string) => void;
  onViewModule: (module: CoachModule) => void;
}
