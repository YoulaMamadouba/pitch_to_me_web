'use client';

import { useParams } from 'next/navigation';
import { useState } from 'react';
import { motion } from 'framer-motion';
import Link from 'next/link';
import { ArrowLeft, Play, Lock, Check, Star } from 'lucide-react';

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

export default function ModuleDetailPage() {
  const params = useParams();
  const moduleId = Array.isArray(params.id) ? params.id[0] : params.id || '';
  const moduleData = getModuleData(moduleId);
  const [showVideo, setShowVideo] = useState(false);
  const videoId = 'dQw4w9WgXcQ'; // placeholder
  
  const remainingLessons = moduleData.totalLessons - moduleData.completedLessons;

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-900 via-blue-900 to-gray-900 text-white flex flex-col">
      {/* Header Fixe */}
      <header className="bg-black/50 backdrop-blur-md border-b border-gray-800 p-3 fixed top-0 left-0 right-0 z-50">
        <div className="max-w-6xl mx-auto flex items-center justify-between gap-4">
          {/* Left: Back */}
          <Link 
            href="/dashboard" 
            className="flex items-center text-gray-300 hover:text-white transition-colors text-sm whitespace-nowrap"
          >
            <ArrowLeft className="w-4 h-4 mr-1" />
            <span>Retour</span>
          </Link>

          {/* Center: Title + Compact Progress */}
          <div className="flex-1 flex flex-col items-center min-w-0">
            <h1 className="text-lg font-bold bg-clip-text text-transparent bg-gradient-to-r from-yellow-300 to-amber-400 truncate">
              Module {moduleId}
            </h1>
            <div className="mt-1 flex items-center gap-3 text-xs text-gray-300">
              <span className="whitespace-nowrap text-yellow-300 font-medium">
                {moduleData.completedLessons}/{moduleData.totalLessons} leçons
              </span>
              <div className="w-28 bg-gray-700 rounded-full h-1.5 overflow-hidden">
                <div 
                  className="h-full bg-gradient-to-r from-yellow-400 to-amber-500 rounded-full" 
                  style={{ width: `${moduleData.progress}%` }}
                />
              </div>
              <span className="whitespace-nowrap">{moduleData.progress}%</span>
            </div>
          </div>

          {/* Right: Continue + Heart */}
          <div className="flex items-center gap-2">
            <button
              onClick={() => setShowVideo(true)}
              className="hidden sm:flex text-xs bg-gradient-to-r from-yellow-400 to-amber-500 hover:from-yellow-300 hover:to-amber-400 text-gray-900 font-medium py-2 px-3 rounded-lg shadow-md hover:shadow-yellow-500/20 transition-all items-center"
            >
              <Play className="w-3.5 h-3.5 mr-1.5" />
              Continuer
            </button>
            <button className="text-gray-300 hover:text-yellow-400 transition-colors p-1">
              <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4.318 6.318a4.5 4.5 0 000 6.364L12 20.364l7.682-7.682a4.5 4.5 0 00-6.364-6.364L12 7.636l-1.318-1.318a4.5 4.5 0 00-6.364 0z" />
              </svg>
            </button>
          </div>
        </div>
      </header>

      <main className="max-w-6xl mx-auto px-4 py-20 pt-20">
        {/* Video Full Row */}
        <div className="grid grid-cols-1 items-start gap-6 mb-8">
          {/* Video Card - Large */}
          <motion.div 
            initial={{ y: 20, opacity: 0 }}
            animate={{ y: 0, opacity: 1 }}
            transition={{ duration: 0.5 }}
            className="relative rounded-2xl overflow-hidden shadow-xl h-[230px] sm:h-[320px] md:h-[380px] bg-gray-900/60 border border-gray-700 w-full md:col-span-2"
          >
            <button
              onClick={() => setShowVideo(true)}
              className="group relative w-full h-full grid place-items-center"
              aria-label="Lire la vidéo"
            >
              <div className="absolute inset-0 bg-gradient-to-br from-yellow-500/20 via-amber-500/10 to-transparent" />
              <div className="absolute inset-0 bg-[radial-gradient(circle_at_30%_20%,rgba(250,204,21,0.25),transparent_40%),radial-gradient(circle_at_70%_60%,rgba(245,158,11,0.18),transparent_45%)]" />
              <div className="relative z-10 flex flex-col items-center">
                <div className="rounded-full bg-white/10 border border-white/20 p-5 sm:p-6 group-hover:bg-white/20 transition-colors">
                  <Play className="w-8 h-8 sm:w-10 sm:h-10 text-yellow-400" />
                </div>
                <p className="mt-3 text-sm text-gray-300">{moduleData.title}</p>
              </div>
            </button>
            <div className="absolute top-3 left-3 flex items-center gap-2 z-10">
              <span className="text-xs bg-black/50 border border-white/10 text-white px-2 py-0.5 rounded-full">
                {moduleData.duration}
              </span>
              <span className="text-xs bg-black/50 border border-white/10 text-yellow-300 px-2 py-0.5 rounded-full flex items-center gap-1">
                <Star className="w-3 h-3 fill-current" /> {moduleData.rating}
              </span>
            </div>
          </motion.div>

          {/* Progress card removed - contents moved to header */}
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
      </main>
      
      {/* Video Modal */}
      {showVideo && (
        <div
          role="dialog"
          aria-modal="true"
          className="fixed inset-0 z-[60] flex items-center justify-center bg-black/70 p-4"
          onClick={() => setShowVideo(false)}
        >
          <div
            className="relative w-full max-w-3xl aspect-video bg-black rounded-xl overflow-hidden shadow-2xl"
            onClick={(e) => e.stopPropagation()}
          >
            <iframe
              className="absolute inset-0 w-full h-full"
              src={`https://www.youtube.com/embed/${videoId}?autoplay=1&rel=0`}
              title="YouTube video player"
              allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture; web-share"
              allowFullScreen
            />
            <button
              onClick={() => setShowVideo(false)}
              className="absolute top-2 right-2 text-white/80 hover:text-white bg-black/40 rounded-md px-2 py-1 text-xs border border-white/20"
              aria-label="Fermer la vidéo"
            >
              Fermer
            </button>
          </div>
        </div>
      )}

      {/* Fixed Bottom CTA - Compact */}
      <motion.div 
        initial={{ y: 100, opacity: 0 }}
        animate={{ y: 0, opacity: 1 }}
        transition={{ duration: 0.3, delay: 0.2 }}
        className="fixed bottom-0 left-0 right-0 bg-gray-900/90 backdrop-blur-md border-t border-gray-700/50 py-2 z-40"
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
            <button className="text-xs bg-gradient-to-r from-yellow-400 to-amber-500 hover:from-yellow-300 hover:to-amber-400 text-gray-900 font-medium py-2 px-3 rounded-lg shadow-md hover:shadow-yellow-500/20 transition-all flex items-center"
              onClick={() => setShowVideo(true)}
            >
              <Play className="w-3.5 h-3.5 mr-1.5" />
              Continuer
            </button>
          </div>
        </div>
      </motion.div>
      
      {/* Add padding to account for fixed bottom CTA */}
      <div className="pb-16"></div>
    </div>
  );
}
