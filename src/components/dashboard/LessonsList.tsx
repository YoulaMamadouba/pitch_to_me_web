'use client';

import { motion } from 'framer-motion';
import { ArrowLeft, Play, Clock, Users, Star, BookOpen } from 'lucide-react';
import { ModuleFolder } from './ModuleFolder';
import { Lesson } from './LessonCard';
import LessonCard from './LessonCard';

export interface LessonsListProps {
  module: ModuleFolder;
  lessons: Lesson[];
  onBackToModules: () => void;
  onLessonClick: (lesson: Lesson) => void;
  selectedLesson?: Lesson;
}

export default function LessonsList({ 
  module, 
  lessons, 
  onBackToModules, 
  onLessonClick, 
  selectedLesson 
}: LessonsListProps) {
  const completedLessons = lessons.filter(lesson => lesson.isCompleted).length;
  const totalDuration = lessons.reduce((total, lesson) => total + lesson.duration, 0);

  return (
    <motion.div
      initial={{ opacity: 0, x: 20 }}
      animate={{ opacity: 1, x: 0 }}
      exit={{ opacity: 0, x: -20 }}
      className="space-y-6"
    >
      {/* Header avec navigation retour */}
      <div className="flex items-center justify-between">
        <div className="flex items-center space-x-4">
          <button
            onClick={onBackToModules}
            className="flex items-center space-x-2 text-gray-400 hover:text-yellow-400 transition-colors"
          >
            <ArrowLeft className="w-5 h-5" />
            <span>Retour aux modules</span>
          </button>
        </div>
        
        <div className="flex items-center space-x-4 text-sm text-gray-400">
          <div className="flex items-center space-x-1">
            <BookOpen className="w-4 h-4" />
            <span>{completedLessons}/{lessons.length} leçons terminées</span>
          </div>
          <div className="flex items-center space-x-1">
            <Clock className="w-4 h-4" />
            <span>{Math.round(totalDuration / 60)}h {totalDuration % 60}min</span>
          </div>
        </div>
      </div>

      {/* Informations du module */}
      <div className="bg-gray-800/50 backdrop-blur-sm rounded-xl border border-gray-700/50 p-6">
        <div className="flex items-start space-x-4">
          <div className={`w-16 h-16 rounded-xl bg-gradient-to-r ${module.color} flex items-center justify-center`}>
            <BookOpen className="w-8 h-8 text-white" />
          </div>
          
          <div className="flex-1">
            <h1 className="text-2xl font-bold text-white mb-2">{module.title}</h1>
            <p className="text-gray-400 mb-4">{module.description}</p>
            
            <div className="flex items-center space-x-6 text-sm text-gray-400">
              <div className="flex items-center space-x-1">
                <Play className="w-4 h-4" />
                <span>{lessons.length} leçons</span>
              </div>
              <div className="flex items-center space-x-1">
                <Clock className="w-4 h-4" />
                <span>{Math.round(module.totalDuration / 60)}h {module.totalDuration % 60}min</span>
              </div>
              <div className="flex items-center space-x-1">
                <Users className="w-4 h-4" />
                <span>{module.studentsCount} étudiants</span>
              </div>
              <div className="flex items-center space-x-1">
                <Star className="w-4 h-4 text-yellow-400 fill-yellow-400" />
                <span className="text-yellow-400">{module.rating}</span>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Progression globale */}
      <div className="bg-gray-800/50 backdrop-blur-sm rounded-xl border border-gray-700/50 p-6">
        <div className="flex items-center justify-between mb-3">
          <h3 className="text-lg font-semibold text-white">Progression du module</h3>
          <span className="text-sm text-gray-400">{Math.round((completedLessons / lessons.length) * 100)}%</span>
        </div>
        <div className="w-full bg-gray-700 rounded-full h-3">
          <div 
            className="h-3 rounded-full bg-gradient-to-r from-yellow-400 to-yellow-500" 
            style={{ width: `${(completedLessons / lessons.length) * 100}%` }}
          ></div>
        </div>
        <p className="text-sm text-gray-400 mt-2">
          {completedLessons} sur {lessons.length} leçons terminées
        </p>
      </div>

      {/* Liste des leçons */}
      <div className="space-y-4">
        <h3 className="text-xl font-semibold text-white">Leçons du module</h3>
        
        <div className="space-y-3">
          {lessons.map((lesson, index) => (
            <LessonCard
              key={lesson.id}
              lesson={lesson}
              onClick={onLessonClick}
              isActive={selectedLesson?.id === lesson.id}
            />
          ))}
        </div>
      </div>
    </motion.div>
  );
}
