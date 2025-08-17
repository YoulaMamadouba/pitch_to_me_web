'use client';

import { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { ArrowLeft, Search, Filter, Grid, List, Plus } from 'lucide-react';
import { ModuleFolder } from './ModuleFolder';
import ModuleFolderComponent from './ModuleFolder';
import { Lesson } from './LessonCard';
import LessonsList from './LessonsList';
import SimpleModuleForm from './SimpleModuleForm';

// Données de test pour les modules
const mockModules: ModuleFolder[] = [
  {
    id: 'commercial',
    title: 'Techniques Commerciales',
    description: 'Maîtrisez l\'art de la vente et de la négociation commerciale',
    lessonCount: 10,
    totalDuration: 150,
    studentsCount: 67,
    rating: 4.9,
    difficulty: 'intermediate',
    isLocked: false,
    isCompleted: false,
    progress: 40,
    color: 'from-green-500 to-emerald-600',
    tags: ['Vente', 'Négociation', 'Commercial'],
    createdAt: '2024-01-10'
  },
  {
    id: '1',
    title: 'Introduction au Pitch',
    description: 'Apprenez les bases fondamentales pour créer un pitch percutant',
    lessonCount: 8,
    totalDuration: 120,
    studentsCount: 45,
    rating: 4.8,
    difficulty: 'easy',
    isLocked: false,
    isCompleted: false,
    progress: 25,
    color: 'from-blue-500 to-purple-600',
    tags: ['Pitch', 'Introduction', 'Bases'],
    createdAt: '2024-01-15'
  },
  {
    id: '2',
    title: 'Structure et Narration',
    description: 'Maîtrisez l\'art de structurer votre histoire et de captiver votre audience',
    lessonCount: 12,
    totalDuration: 180,
    studentsCount: 38,
    rating: 4.9,
    difficulty: 'intermediate',
    isLocked: false,
    isCompleted: false,
    progress: 0,
    color: 'from-green-500 to-teal-600',
    tags: ['Structure', 'Narration', 'Storytelling'],
    createdAt: '2024-01-20'
  },
  {
    id: '3',
    title: 'Techniques Avancées',
    description: 'Découvrez les techniques avancées pour un pitch exceptionnel',
    lessonCount: 15,
    totalDuration: 240,
    studentsCount: 22,
    rating: 4.7,
    difficulty: 'advanced',
    isLocked: true,
    isCompleted: false,
    progress: 0,
    color: 'from-red-500 to-pink-600',
    tags: ['Avancé', 'Techniques', 'Expert'],
    createdAt: '2024-01-25'
  },
  {
    id: '4',
    title: 'Présentation et Confiance',
    description: 'Développez votre présence scénique et votre confiance en vous',
    lessonCount: 10,
    totalDuration: 150,
    studentsCount: 52,
    rating: 4.6,
    difficulty: 'intermediate',
    isLocked: false,
    isCompleted: true,
    progress: 100,
    color: 'from-yellow-500 to-orange-600',
    tags: ['Présentation', 'Confiance', 'Scénique'],
    createdAt: '2024-01-30'
  }
];

// Données de test pour les leçons
const mockLessons: Record<string, Lesson[]> = {
  'commercial': [
    {
      id: 'commercial-1',
      title: 'Fondamentaux de la vente',
      description: 'Comprendre les bases de la vente et du cycle commercial',
      type: 'video',
      duration: 20,
      isCompleted: true,
      isLocked: false,
      isWatched: true,
      videoUrl: 'https://example.com/video-commercial-1',
      tags: ['Vente', 'Bases'],
      createdAt: '2024-01-10',
      order: 1
    },
    {
      id: 'commercial-2',
      title: 'Prospection et qualification',
      description: 'Techniques pour identifier et qualifier les prospects',
      type: 'video',
      duration: 25,
      isCompleted: true,
      isLocked: false,
      isWatched: true,
      videoUrl: 'https://example.com/video-commercial-2',
      tags: ['Prospection', 'Qualification'],
      createdAt: '2024-01-10',
      order: 2
    },
    {
      id: 'commercial-3',
      title: 'Présentation commerciale',
      description: 'Structurer et présenter une offre commerciale percutante',
      type: 'video',
      duration: 30,
      isCompleted: false,
      isLocked: false,
      isWatched: false,
      videoUrl: 'https://example.com/video-commercial-3',
      tags: ['Présentation', 'Offre'],
      createdAt: '2024-01-10',
      order: 3
    },
    {
      id: 'commercial-4',
      title: 'Négociation avancée',
      description: 'Maîtriser les techniques de négociation commerciale',
      type: 'video',
      duration: 35,
      isCompleted: false,
      isLocked: false,
      isWatched: false,
      videoUrl: 'https://example.com/video-commercial-4',
      tags: ['Négociation', 'Techniques'],
      createdAt: '2024-01-10',
      order: 4
    },
    {
      id: 'commercial-5',
      title: 'Gestion des objections',
      description: 'Répondre efficacement aux objections des prospects',
      type: 'video',
      duration: 28,
      isCompleted: false,
      isLocked: false,
      isWatched: false,
      videoUrl: 'https://example.com/video-commercial-5',
      tags: ['Objections', 'Réponses'],
      createdAt: '2024-01-10',
      order: 5
    }
  ],
  '1': [
    {
      id: '1-1',
      title: 'Qu\'est-ce qu\'un pitch efficace ?',
      description: 'Définition et caractéristiques d\'un pitch qui fonctionne',
      type: 'video',
      duration: 15,
      isCompleted: true,
      isLocked: false,
      isWatched: true,
      videoUrl: 'https://example.com/video1',
      tags: ['Définition', 'Efficacité'],
      createdAt: '2024-01-15',
      order: 1
    },
    {
      id: '1-2',
      title: 'Identifier votre audience',
      description: 'Comprendre votre public pour adapter votre message',
      type: 'video',
      duration: 20,
      isCompleted: true,
      isLocked: false,
      isWatched: true,
      videoUrl: 'https://example.com/video2',
      tags: ['Audience', 'Cible'],
      createdAt: '2024-01-15',
      order: 2
    },
    {
      id: '1-3',
      title: 'Exercice pratique : Analyse d\'audience',
      description: 'Mettez en pratique la théorie avec un exercice concret',
      type: 'exercise',
      duration: 30,
      isCompleted: false,
      isLocked: false,
      isWatched: false,
      tags: ['Exercice', 'Pratique'],
      createdAt: '2024-01-15',
      order: 3
    },
    {
      id: '1-4',
      title: 'Quiz : Les bases du pitch',
      description: 'Testez vos connaissances sur les fondamentaux',
      type: 'quiz',
      duration: 10,
      isCompleted: false,
      isLocked: false,
      isWatched: false,
      tags: ['Quiz', 'Évaluation'],
      createdAt: '2024-01-15',
      order: 4
    }
  ],
  '2': [
    {
      id: '2-1',
      title: 'La structure en 3 actes',
      description: 'Apprenez la structure narrative classique',
      type: 'video',
      duration: 25,
      isCompleted: false,
      isLocked: false,
      isWatched: false,
      videoUrl: 'https://example.com/video5',
      tags: ['Structure', '3 actes'],
      createdAt: '2024-01-20',
      order: 1
    },
    {
      id: '2-2',
      title: 'Le hook d\'ouverture',
      description: 'Captiver votre audience dès les premières secondes',
      type: 'video',
      duration: 18,
      isCompleted: false,
      isLocked: false,
      isWatched: false,
      videoUrl: 'https://example.com/video6',
      tags: ['Hook', 'Ouverture'],
      createdAt: '2024-01-20',
      order: 2
    }
  ]
};

interface ModulesListProps {
  domainName: string;
  onBackToDomains: () => void;
}

export default function ModulesList({ domainName, onBackToDomains }: ModulesListProps) {
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedModule, setSelectedModule] = useState<ModuleFolder | null>(null);
  const [selectedLesson, setSelectedLesson] = useState<Lesson | undefined>(undefined);
  const [viewMode, setViewMode] = useState<'grid' | 'list'>('grid');
  const [showAddModuleForm, setShowAddModuleForm] = useState(false);
  const [modules, setModules] = useState<ModuleFolder[]>(mockModules);

  const filteredModules = modules.filter(module =>
    module.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
    module.description.toLowerCase().includes(searchTerm.toLowerCase())
  );

  const handleModuleClick = (module: ModuleFolder) => {
    setSelectedModule(module);
    setSelectedLesson(undefined);
  };

  const handleBackToModules = () => {
    setSelectedModule(null);
    setSelectedLesson(undefined);
  };

  const handleLessonClick = (lesson: Lesson) => {
    setSelectedLesson(lesson);
    // Ici vous pouvez ajouter la logique pour ouvrir la leçon
    console.log('Leçon sélectionnée:', lesson);
  };

  const handleAddModule = (moduleData: any) => {
    const moduleToAdd: ModuleFolder = {
      id: Date.now().toString(),
      title: moduleData.title,
      description: moduleData.description,
      lessonCount: 0,
      totalDuration: 0,
      studentsCount: 0,
      rating: 0,
      difficulty: moduleData.difficulty,
      isLocked: false,
      isCompleted: false,
      progress: 0,
      color: moduleData.color,
      tags: [],
      createdAt: new Date().toISOString().split('T')[0]
    };
    
    setModules([moduleToAdd, ...modules]);
  };

  // Si un module est sélectionné, afficher la liste des leçons
  if (selectedModule) {
    const lessons = mockLessons[selectedModule.id] || [];
    return (
      <LessonsList
        module={selectedModule}
        lessons={lessons}
        onBackToModules={handleBackToModules}
        onLessonClick={handleLessonClick}
        selectedLesson={selectedLesson}
      />
    );
  }

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      className="space-y-6"
    >
      {/* Header */}
      <div className="flex items-center justify-between">
        <div className="flex items-center space-x-4">
          <button
            onClick={onBackToDomains}
            className="flex items-center space-x-2 text-gray-400 hover:text-yellow-400 transition-colors"
          >
            <ArrowLeft className="w-5 h-5" />
            <span>Retour aux domaines</span>
          </button>
          <div className="h-6 w-px bg-gray-600"></div>
          <h1 className="text-2xl font-bold text-white">Modules - {domainName}</h1>
        </div>
        
        <div className="flex items-center space-x-4">
          <div className="flex items-center space-x-2 bg-gray-800/50 rounded-lg p-2">
            <button
              onClick={() => setViewMode('grid')}
              className={`p-2 rounded transition-colors ${
                viewMode === 'grid' ? 'bg-yellow-500 text-black' : 'text-gray-400 hover:text-white'
              }`}
            >
              <Grid className="w-4 h-4" />
            </button>
            <button
              onClick={() => setViewMode('list')}
              className={`p-2 rounded transition-colors ${
                viewMode === 'list' ? 'bg-yellow-500 text-black' : 'text-gray-400 hover:text-white'
              }`}
            >
              <List className="w-4 h-4" />
            </button>
            </div>
          </div>
        </div>
        
      {/* Barre de recherche et filtres */}
      <div className="flex items-center space-x-4">
        <div className="flex-1 relative">
          <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-4 h-4" />
          <input
            type="text"
            placeholder="Rechercher un module..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="w-full pl-10 pr-4 py-3 bg-gray-800/50 border border-gray-700/50 rounded-lg text-white placeholder-gray-400 focus:outline-none focus:border-yellow-400/50"
          />
        </div>
        <button className="flex items-center space-x-2 px-4 py-3 bg-gray-800/50 border border-gray-700/50 rounded-lg text-gray-400 hover:text-white hover:border-yellow-400/50 transition-colors">
          <Filter className="w-4 h-4" />
          <span>Filtres</span>
        </button>
      </div>

      {/* Statistiques */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
        <div className="bg-gray-800/50 backdrop-blur-sm rounded-xl border border-gray-700/50 p-4">
          <div className="text-2xl font-bold text-yellow-400">{modules.length}</div>
          <div className="text-sm text-gray-400">Modules disponibles</div>
          </div>
        <div className="bg-gray-800/50 backdrop-blur-sm rounded-xl border border-gray-700/50 p-4">
          <div className="text-2xl font-bold text-green-400">
            {modules.filter(m => m.isCompleted).length}
          </div>
          <div className="text-sm text-gray-400">Modules terminés</div>
            </div>
        <div className="bg-gray-800/50 backdrop-blur-sm rounded-xl border border-gray-700/50 p-4">
          <div className="text-2xl font-bold text-blue-400">
            {modules.reduce((total, m) => total + m.lessonCount, 0)}
          </div>
          <div className="text-sm text-gray-400">Leçons totales</div>
            </div>
        <div className="bg-gray-800/50 backdrop-blur-sm rounded-xl border border-gray-700/50 p-4">
          <div className="text-2xl font-bold text-purple-400">
            {Math.round(modules.reduce((total, m) => total + m.totalDuration, 0) / 60)}h
          </div>
          <div className="text-sm text-gray-400">Durée totale</div>
        </div>
      </div>

      {/* Liste des modules */}
      <div className="space-y-4">
        <div className="flex items-center justify-between">
          <h2 className="text-xl font-semibold text-white">
            Modules ({filteredModules.length})
          </h2>
          <button
            onClick={() => setShowAddModuleForm(true)}
            className="bg-gradient-to-r from-yellow-400 to-yellow-500 text-black font-semibold px-4 py-2 rounded-lg hover:shadow-lg transition-all flex items-center space-x-2"
          >
            <Plus className="w-4 h-4" />
            <span>Ajouter un module</span>
          </button>
        </div>

                {/* Formulaire d'ajout de module */}
        <SimpleModuleForm
          isOpen={showAddModuleForm}
          onClose={() => setShowAddModuleForm(false)}
          onSubmit={handleAddModule}
          moduleType="b2b"
        />
        
        <AnimatePresence>
          <motion.div 
            key={viewMode}
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className={
              viewMode === 'grid' 
                ? 'grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6'
                : 'space-y-4'
            }
          >
            {filteredModules.map((module) => (
              <ModuleFolderComponent
                key={module.id}
                module={module}
                onClick={handleModuleClick}
              />
            ))}
          </motion.div>
        </AnimatePresence>

        {filteredModules.length === 0 && (
          <div className="text-center py-12">
            <div className="text-gray-400 text-lg">Aucun module trouvé</div>
            <div className="text-gray-500 text-sm mt-2">
              Essayez de modifier vos critères de recherche
            </div>
          </div>
      )}
    </div>
    </motion.div>
  );
}
