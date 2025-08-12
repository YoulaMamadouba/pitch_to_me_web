'use client';

import { motion } from 'framer-motion';
import { Play, Lock, Check, Star } from 'lucide-react';

// Types
type Lesson = {
  id: number;
  title: string;
  description: string;
  duration: string;
  rating: number;
  status: 'completed' | 'in-progress' | 'locked';
  progress?: number;
  type?: 'lesson' | 'quiz';
};

type Module = {
  id: string;
  title: string;
  description: string;
  duration: string;
  rating: number;
  progress: number;
  totalLessons: number;
  completedLessons: number;
  lessons: Lesson[];
};

interface ModuleViewProps {
  moduleId: string;
  onBack?: () => void;
}

// Mock data - à remplacer par un appel API dans une application réelle
const getModuleData = (id: string): Module => {
  // Simuler un chargement de données basé sur l'ID
  return {
    id,
    title: 'Body Language Mastery',
    description: 'Master non-verbal communication and presence',
    duration: '45 min',
    rating: 4.8,
    progress: 75,
    totalLessons: 4,
    completedLessons: 3,
    lessons: [
      {
        id: 1,
        title: 'Introduction to Body Language',
        description: 'Understanding non-verbal cues',
        duration: '8 min',
        rating: 4.9,
        status: 'completed',
        type: 'lesson'
      },
      {
        id: 2,
        title: 'Posture & Presence',
        description: 'Command attention with your stance',
        duration: '12 min',
        rating: 4.7,
        status: 'in-progress',
        progress: 60,
        type: 'lesson'
      },
      {
        id: 3,
        title: 'Hand Gestures & Movement',
        description: 'Enhance your message with gestures',
        duration: '15 min',
        rating: 4.8,
        status: 'locked',
        type: 'lesson'
      },
      {
        id: 4,
        title: 'Final Assessment',
        description: 'Test your body language skills',
        duration: '10 min',
        rating: 4.9,
        status: 'locked',
        type: 'quiz'
      }
    ]
  };
};

export default function ModuleView({ moduleId, onBack }: ModuleViewProps) {
  const moduleData = getModuleData(moduleId);
  const remainingLessons = moduleData.totalLessons - moduleData.completedLessons;

  return (
    <motion.div 
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.5, delay: 0.1 }}
      className="bg-gray-800/80 backdrop-blur-sm rounded-xl shadow-lg p-6 border border-gray-700 hover:shadow-xl transition-all"
    >
      {/* Header */}
      <div className="flex items-center justify-between mb-6">
        <div className="flex items-center">
          {onBack && (
            <button 
              onClick={onBack}
              className="flex items-center text-gray-300 hover:text-white transition-colors text-sm mr-4"
            >
              <svg className="w-4 h-4 mr-1" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 19l-7-7 7-7" />
              </svg>
              <span>Retour</span>
            </button>
          )}
          <h1 className="text-xl font-bold bg-clip-text text-transparent bg-gradient-to-r from-yellow-300 to-amber-400">
            Module {moduleId}
          </h1>
        </div>
        <button className="text-gray-300 hover:text-yellow-400 transition-colors p-1">
          <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4.318 6.318a4.5 4.5 0 000 6.364L12 20.364l7.682-7.682a4.5 4.5 0 00-6.364-6.364L12 7.636l-1.318-1.318a4.5 4.5 0 00-6.364 0z" />
          </svg>
        </button>
      </div>

      {/* Module Hero and Progress Side by Side */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-8">
        {/* Module Hero - Compact */}
        <motion.div 
          initial={{ y: 20, opacity: 0 }}
          animate={{ y: 0, opacity: 1 }}
          transition={{ duration: 0.5 }}
          className="relative bg-gradient-to-r from-yellow-400 to-amber-500 rounded-2xl p-5 overflow-hidden shadow-lg h-full"
        >
          <div className="absolute top-3 right-3 bg-black/20 rounded-full p-1.5">
            <Play className="w-4 h-4 text-white" />
          </div>
          
          <h1 className="text-2xl font-bold text-gray-900 mb-1">{moduleData.title}</h1>
          <p className="text-gray-800 text-sm mb-4">{moduleData.description}</p>
          
          <div className="flex items-center space-x-4">
            <div className="flex items-center space-x-1">
              <svg className="w-4 h-4 text-gray-900" fill="currentColor" viewBox="0 0 20 20">
                <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm1-12a1 1 0 10-2 0v4a1 1 0 00.293.707l2.828 2.829a1 1 0 101.415-1.415L11 9.586V6z" clipRule="evenodd"/>
              </svg>
              <span className="text-gray-900 text-sm font-medium">{moduleData.duration}</span>
            </div>
            <div className="flex items-center space-x-1">
              <Star className="w-4 h-4 text-gray-900 fill-current" />
              <span className="text-gray-900 text-sm font-medium">{moduleData.rating}/5</span>
            </div>
          </div>
          
          <div className="absolute -bottom-8 -right-8 w-32 h-32 bg-yellow-300 rounded-full opacity-20"></div>
          <div className="absolute -top-6 -left-6 w-24 h-24 bg-amber-400 rounded-full opacity-20"></div>
        </motion.div>

        {/* Progress Overview - Compact */}
        <motion.div 
          initial={{ y: 20, opacity: 0 }}
          animate={{ y: 0, opacity: 1 }}
          transition={{ duration: 0.5, delay: 0.1 }}
          className="bg-gray-700/50 backdrop-blur-sm rounded-xl p-5 border border-gray-600 h-full"
        >
          <div className="flex items-center justify-between mb-3">
            <h2 className="text-base font-semibold">Votre Progrès</h2>
            <span className="text-yellow-400 font-medium text-sm">{moduleData.completedLessons}/{moduleData.totalLessons} leçons</span>
          </div>
          
          <div className="w-full bg-gray-700 rounded-full h-2.5 mb-2 overflow-hidden">
            <motion.div 
              className="h-full bg-gradient-to-r from-yellow-400 to-amber-500 rounded-full"
              initial={{ width: 0 }}
              animate={{ width: `${moduleData.progress}%` }}
              transition={{ duration: 1, ease: "easeOut" }}
            />
          </div>
          
          <div className="flex justify-between text-xs">
            <span className="text-gray-300">{moduleData.progress}% Terminé</span>
            <span className="text-gray-400">{remainingLessons} {remainingLessons > 1 ? 'leçons' : 'leçon'} restante{remainingLessons > 1 ? 's' : ''}</span>
          </div>
        </motion.div>
      </div>

      {/* Lessons List */}
      <motion.div 
        initial={{ y: 20, opacity: 0 }}
        animate={{ y: 0, opacity: 1 }}
        transition={{ duration: 0.5, delay: 0.2 }}
        className="space-y-4"
      >
        <h2 className="text-xl font-semibold mb-4">Lessons</h2>
        
        {moduleData.lessons.map((lesson, index) => (
          <motion.div
            key={lesson.id}
            whileHover={{ x: 5 }}
            className={`relative rounded-xl p-5 transition-all ${
              lesson.status === 'completed' 
                ? 'bg-green-900/20 border border-green-800/50' 
                : lesson.status === 'in-progress'
                ? 'bg-yellow-900/20 border border-yellow-800/50'
                : 'bg-gray-800/30 border border-gray-700/50 opacity-70'
            }`}
          >
            <div className="flex items-start space-x-4">
              {/* Lesson Icon */}
              <div className={`flex-shrink-0 w-12 h-12 rounded-xl flex items-center justify-center ${
                lesson.status === 'completed' 
                  ? 'bg-green-600/20 text-green-400' 
                  : lesson.status === 'in-progress'
                  ? 'bg-yellow-600/20 text-yellow-400'
                  : 'bg-gray-700/50 text-gray-500'
              }`}>
                {lesson.status === 'completed' ? (
                  <Check className="w-6 h-6" />
                ) : lesson.status === 'in-progress' ? (
                  <Play className="w-5 h-5 ml-0.5" />
                ) : (
                  <Lock className="w-5 h-5" />
                )}
              </div>
              
              {/* Lesson Info */}
              <div className="flex-1 min-w-0">
                <h3 className={`font-medium ${
                  lesson.status === 'locked' ? 'text-gray-400' : 'text-white'
                }`}>
                  {lesson.id}. {lesson.title}
                </h3>
                <p className={`text-sm ${
                  lesson.status === 'locked' ? 'text-gray-500' : 'text-gray-300'
                }`}>
                  {lesson.description}
                </p>
                
                <div className="flex items-center mt-2 space-x-4">
                  <span className={`text-xs ${
                    lesson.status === 'completed' 
                      ? 'text-green-400' 
                      : lesson.status === 'in-progress'
                      ? 'text-yellow-400'
                      : 'text-gray-500'
                  }`}>
                    {lesson.status === 'completed' 
                      ? 'Completed' 
                      : lesson.status === 'in-progress' 
                      ? 'In Progress' 
                      : 'Locked'}
                  </span>
                  
                  <span className="text-xs text-gray-400 flex items-center">
                    <svg className="w-3 h-3 mr-1" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z" />
                    </svg>
                    {lesson.duration}
                  </span>
                  
                  {lesson.status !== 'locked' && (
                    <span className="text-xs text-yellow-400 flex items-center">
                      <Star className="w-3 h-3 mr-1 fill-current" />
                      {lesson.rating}
                    </span>
                  )}
                  
                  {lesson.status === 'in-progress' && lesson.progress && (
                    <div className="flex-1 max-w-[100px] ml-auto">
                      <div className="w-full bg-gray-700 rounded-full h-1.5">
                        <div 
                          className="bg-yellow-400 h-1.5 rounded-full" 
                          style={{ width: `${lesson.progress}%` }}
                        />
                      </div>
                    </div>
                  )}
                </div>
              </div>
              
              {/* Action Button */}
              {lesson.status === 'in-progress' && (
                <button className="px-4 py-2 bg-gradient-to-r from-yellow-400 to-amber-500 text-black rounded-lg text-sm font-medium whitespace-nowrap ml-4">
                  Continue
                </button>
              )}
            </div>
            
            {lesson.type === 'quiz' && (
              <div className="absolute top-3 right-3 bg-amber-900/30 text-amber-400 text-xs px-2 py-1 rounded-full border border-amber-800/50">
                Quiz
              </div>
            )}
          </motion.div>
        ))}
      </motion.div>
      
      {/* Sticky Bottom CTA - Compact */}
      <motion.div 
        initial={{ y: 100, opacity: 0 }}
        animate={{ y: 0, opacity: 1 }}
        transition={{ duration: 0.3, delay: 0.2 }}
        className="sticky bottom-0 bg-gray-900/90 backdrop-blur-md border-t border-gray-700/50 py-2 mt-6"
      >
        <div className="max-w-4xl mx-auto px-4 flex justify-between items-center">
          <div className="flex items-center space-x-2">
            <span className="text-xs text-gray-400">Progression: {moduleData.progress}%</span>
            <div className="w-16 bg-gray-700 rounded-full h-1.5 overflow-hidden">
              <div 
                className="h-full bg-gradient-to-r from-yellow-400 to-amber-500 rounded-full" 
                style={{ width: `${moduleData.progress}%` }}
              ></div>
            </div>
          </div>
          
          <div className="flex space-x-2">
            <button className="text-xs bg-gray-700/50 hover:bg-gray-600/50 text-white font-medium py-2 px-3 rounded-lg border border-gray-600/50 transition-colors flex items-center">
              <svg className="w-3.5 h-3.5 mr-1.5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M14.752 11.168l-3.197-2.132A1 1 0 0010 9.87v4.263a1 1 0 001.555.832l3.197-2.132a1 1 0 000-1.664z" />
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
              </svg>
              Reprendre
            </button>
            <button className="text-xs bg-gradient-to-r from-yellow-400 to-amber-500 hover:from-yellow-300 hover:to-amber-400 text-gray-900 font-medium py-2 px-3 rounded-lg shadow-md hover:shadow-yellow-500/20 transition-all flex items-center">
              <Play className="w-3.5 h-3.5 mr-1.5" />
              Continuer
            </button>
          </div>
        </div>
      </motion.div>
      
      {/* Add padding to account for sticky bottom CTA */}
      <div className="pb-4"></div>
    </motion.div>
  );
}
