'use client';

import { useState } from 'react';
import { motion } from 'framer-motion';
import { Share2, User, Check, Star, AlertTriangle, Zap, Smile, Frown, Meh, RefreshCw } from 'lucide-react';

// Sample user image URL - replace with your actual user image URL or dynamic import
const userImageUrl = 'https://images.unsplash.com/photo-1472099645785-5658abf4ff4e?w=300&h=300&fit=crop&crop=face';

interface EmotionAnalysis {
  name: string;
  level: number;
  color: string;
  emoji: string;
}

interface EmotionRecognitionViewProps {
  onBack?: () => void;
}

export default function EmotionRecognitionView({ onBack }: EmotionRecognitionViewProps) {
  const [isAnalyzing, setIsAnalyzing] = useState(false);
  const [analysisResult, setAnalysisResult] = useState<EmotionAnalysis | null>(null);

  const emotions = [
    { name: 'Confident', level: 87, color: 'green-400', emoji: '😊' },
    { name: 'Neutral', level: 8, color: 'gray-400', emoji: '😐' },
    { name: 'Nervous', level: 5, color: 'yellow-400', emoji: '😰' }
  ];

  const timelineData = [
    { time: '0:30', emotion: 'Nervous', color: 'red-400', emoji: '😰' },
    { time: '1:15', emotion: 'Neutral', color: 'yellow-400', emoji: '😐' },
    { time: '2:00', emotion: 'Confident', color: 'green-400', emoji: '😊' },
    { time: '2:45', emotion: 'Confident', color: 'green-400', emoji: '😄' }
  ];

  const insights = [
    {
      type: 'success',
      title: 'Strong Recovery',
      description: 'You showed excellent emotional control, transitioning from nervous to confident within 90 seconds',
      icon: Check
    },
    {
      type: 'tip',
      title: 'Peak Performance',
      description: 'Your confidence peaked at 2:45, coinciding with your key message delivery',
      icon: Star
    }
  ];

  const startAnalysis = () => {
    setIsAnalyzing(true);
    // Simulate analysis
    setTimeout(() => {
      setIsAnalyzing(false);
    }, 3000);
  };

  return (
    <motion.div 
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.5, delay: 0.1 }}
      className="bg-gray-800/80 backdrop-blur-sm rounded-xl shadow-lg p-6 border border-gray-700 hover:shadow-xl transition-all"
    >
      {/* Header with actions inline */}
      <div className="flex items-center justify-between gap-3 mb-6">
        {/* Left: Back */}
        <div className="flex items-center min-w-0">
          {onBack && (
            <button 
              onClick={onBack}
              className="flex items-center text-gray-300 hover:text-white transition-colors text-sm mr-3 whitespace-nowrap"
            >
              <svg className="w-4 h-4 mr-1" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 19l-7-7 7-7" />
              </svg>
              <span>Retour</span>
            </button>
          )}
        </div>
        {/* Center: Title + CTA on same line */}
        <div className="flex-1 flex items-center justify-center gap-3 min-w-0">
          <h1 className="text-base sm:text-lg font-semibold text-white whitespace-nowrap">Analyse des Émotions</h1>
          <div className="flex items-center gap-2">
            <button 
              className="bg-gradient-to-r from-purple-500 to-purple-600 text-white text-xs sm:text-sm font-medium py-2 px-3 sm:px-4 rounded-lg hover:opacity-90 transition-opacity flex items-center justify-center space-x-2"
              onClick={startAnalysis}
              disabled={isAnalyzing}
            >
              {isAnalyzing ? (
                <>
                  <div className="w-3 h-3 border-2 border-white/30 border-t-white rounded-full animate-spin"></div>
                  <span>Analyse...</span>
                </>
              ) : (
                <>
                  <Zap className="w-3.5 h-3.5" />
                  <span>Démarrer</span>
                </>
              )}
            </button>
            <button 
              className="bg-white/5 text-white text-xs sm:text-sm font-medium py-2 px-3 sm:px-4 rounded-lg border border-white/10 hover:bg-white/10 transition-colors flex items-center justify-center space-x-2"
              onClick={() => window.location.reload()}
            >
              <RefreshCw className="w-3.5 h-3.5" />
              <span>Recommencer</span>
            </button>
          </div>
        </div>
        {/* Right: Share */}
        <button className="text-white hover:text-gray-300 transition-colors">
          <Share2 className="w-4 h-4" />
        </button>
      </div>

      {/* Main Content */}
      <div className="pb-6">
        <div className="grid grid-cols-2 gap-4 mb-4">
          {/* Real-time Analysis Card */}
          <motion.div 
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.3 }}
            className="bg-gradient-to-r from-purple-600 to-indigo-600 rounded-xl p-4 shadow-md border border-purple-400/20 col-span-2"
          >
            <div className="flex items-center justify-between">
              <div>
                <h2 className="text-base font-semibold text-white">Suivi en Temps Réel</h2>
                <p className="text-purple-100 text-xs">Analyse des expressions faciales par IA</p>
              </div>
              <div className={`w-10 h-10 bg-white/20 rounded-full flex items-center justify-center ${isAnalyzing ? 'animate-pulse' : ''}`}>
                <User className="w-4 h-4 text-white" />
              </div>
            </div>
          </motion.div>
        </div>

        {/* Face Detection - Enlarged */}
        <motion.div 
          initial={{ opacity: 0, y: 10 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.3, delay: 0.1 }}
          className="relative bg-gray-900 rounded-xl overflow-hidden mb-4 border border-gray-700"
        >
          <div className="bg-gray-700/50 flex items-center justify-center p-6 h-[420px] sm:h-[520px]">
            {isAnalyzing ? (
              <div className="text-center p-4">
                <div className="w-12 h-12 border-4 border-purple-500 border-t-transparent rounded-full animate-spin mx-auto mb-3"></div>
                <p className="text-purple-300 text-sm">Analyse en cours...</p>
              </div>
            ) : (
              <div className="relative w-full h-full flex items-center justify-center">
                <img 
                  src={userImageUrl} 
                  alt="Face detection" 
                  className="h-72 w-72 sm:h-80 sm:w-80 rounded-full object-cover border-2 border-yellow-400 shadow-lg"
                />
                <div className="absolute inset-0 flex items-center justify-center">
                  <div className="w-56 h-72 sm:w-64 sm:h-80 border-2 border-yellow-400 rounded-lg relative face-scan">
                    <div className="absolute top-8 left-10 w-1.5 h-1.5 bg-green-400 rounded-full"></div>
                    <div className="absolute top-8 right-10 w-1.5 h-1.5 bg-green-400 rounded-full"></div>
                    <div className="absolute top-24 left-1/2 transform -translate-x-1/2 w-1.5 h-1.5 bg-blue-400 rounded-full"></div>
                    <div className="absolute bottom-12 left-1/2 transform -translate-x-1/2 w-10 h-1.5 bg-yellow-400 rounded-full"></div>
                  </div>
                </div>
                <div className="absolute top-3 right-3 bg-black/70 text-white px-2 py-1 rounded-md text-xs font-medium flex items-center">
                  <div className="w-1.5 h-1.5 bg-green-400 rounded-full mr-1.5"></div>
                  Confident
                  <span className="ml-1.5 text-green-400 text-xs">87%</span>
                </div>
              </div>
            )}
          </div>
        </motion.div>

        {/* Current Emotions - Side by Side */}
        <motion.div 
          initial={{ opacity: 0, y: 10 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.3, delay: 0.2 }}
          className="mb-4"
        >
          <h3 className="text-base font-semibold text-white mb-3">État Émotionnel</h3>
          <div className="grid grid-cols-3 gap-3">
            {emotions.map((emotion, index) => {
              let Icon = Smile;
              if (emotion.name === 'Nervous') Icon = Frown;
              if (emotion.name === 'Neutral') Icon = Meh;
              
              return (
                <div key={index} className="bg-white/5 rounded-lg p-3 border border-white/5">
                  <div className="flex items-center justify-between mb-2">
                    <div className="flex items-center space-x-2">
                      <div className={`p-1.5 rounded-lg ${emotion.color === 'green-400' ? 'bg-green-400/10' : emotion.color === 'yellow-400' ? 'bg-yellow-400/10' : 'bg-gray-400/10'}`}>
                        <Icon className={`w-3.5 h-3.5 ${emotion.color === 'green-400' ? 'text-green-400' : emotion.color === 'yellow-400' ? 'text-yellow-400' : 'text-gray-400'}`} />
                      </div>
                      <span className="text-xs text-white">{emotion.name}</span>
                    </div>
                  </div>
                  <div className="text-center mb-1">
                    <span className={`text-sm font-bold ${emotion.color === 'green-400' ? 'text-green-400' : emotion.color === 'yellow-400' ? 'text-yellow-400' : 'text-gray-400'}`}>
                      {emotion.level}%
                    </span>
                  </div>
                  <div className="w-full bg-gray-700/30 rounded-full h-1.5">
                    <div 
                      className={`h-1.5 rounded-full ${emotion.color === 'green-400' ? 'bg-green-400' : emotion.color === 'yellow-400' ? 'bg-yellow-400' : 'bg-gray-400'}`}
                      style={{ width: `${emotion.level}%` }}
                    ></div>
                  </div>
                </div>
              );
            })}
          </div>
        </motion.div>

        {/* Emotion Timeline - Wider */}
        <motion.div 
          initial={{ opacity: 0, y: 10 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.3, delay: 0.3 }}
          className="mb-4"
        >
          <h3 className="text-base font-semibold text-white mb-3">Chronologie</h3>
          <div className="bg-white/5 rounded-lg p-4 border border-white/5">
            <div className="relative h-20 mb-2">
              <div className="absolute top-1/2 left-0 right-0 h-0.5 bg-gray-700"></div>
              
              {timelineData.map((item, index) => (
                <div 
                  key={index}
                  className="timeline-point absolute top-1/2 transform -translate-y-1/2"
                  style={{ left: `${(index / (timelineData.length - 1)) * 100}%` }}
                >
                  <div className={`w-3 h-3 ${item.color === 'green-400' ? 'bg-green-400' : item.color === 'red-400' ? 'bg-red-400' : 'bg-yellow-400'} rounded-full border border-white`}></div>
                  <div className="absolute -top-6 left-1/2 transform -translate-x-1/2 text-[10px] text-gray-300 whitespace-nowrap">{item.time}</div>
                  <div className="absolute -top-12 left-1/2 transform -translate-x-1/2 text-xl">{item.emoji}</div>
                </div>
              ))}
            </div>
            <p className="text-center text-gray-400 text-xs mt-2">Progression pendant la présentation</p>
          </div>
        </motion.div>

        {/* AI Insights - Side by Side */}
        <motion.div 
          initial={{ opacity: 0, y: 10 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.3, delay: 0.4 }}
          className="mb-6"
        >
          <h3 className="text-base font-semibold text-white mb-3">Conseils IA</h3>
          <div className="grid grid-cols-2 gap-3">
            {insights.map((insight, index) => {
              const Icon = insight.icon;
              const isSuccess = insight.type === 'success';
              const colorClass = isSuccess ? 'green' : 'blue';
              
              return (
                <div 
                  key={index}
                  className={`${isSuccess ? 'bg-green-900/20 border-green-800/50' : 'bg-blue-900/20 border-blue-800/50'} border rounded-lg p-3`}
                >
                  <div className="flex items-start space-x-2">
                    <div className={`w-5 h-5 ${isSuccess ? 'bg-green-600/80' : 'bg-blue-600/80'} rounded-full flex-shrink-0 flex items-center justify-center mt-0.5`}>
                      <Icon className="w-2.5 h-2.5 text-white" />
                    </div>
                    <div>
                      <h4 className={`${isSuccess ? 'text-green-400' : 'text-blue-400'} font-medium text-xs mb-0.5`}>
                        {insight.title}
                      </h4>
                      <p className="text-white/80 text-[11px] leading-tight">{insight.description}</p>
                    </div>
                  </div>
                </div>
              );
            })}
          </div>
        </motion.div>
      </div>

              {/* Bottom actions removed - moved to header */}
    </motion.div>
  );
}
