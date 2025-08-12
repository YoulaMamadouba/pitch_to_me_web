'use client';
import { useState, useEffect } from 'react';
import { Share2, Clock, BookOpen, Volume2, Mic } from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';

interface Recommendation {
  id: number;
  category: string;
  title: string;
  description: string;
  icon: React.ElementType;
  color: string;
  textColor: string;
  borderColor: string;
  bgColor: string;
}

interface VoiceMetric {
  name: string;
  value: number;
  change: string;
  color: string;
  iconName: string;
}

interface VoiceAnalysisViewProps {
  onBack?: () => void;
}

export default function VoiceAnalysisView({ onBack }: VoiceAnalysisViewProps) {
  const [isRecording, setIsRecording] = useState(false);
  const [sessionTime, setSessionTime] = useState(0);
  
  // Simulate recording time
  useEffect(() => {
    let interval: NodeJS.Timeout | undefined;
    if (isRecording) {
      interval = setInterval(() => {
        setSessionTime(prev => prev + 1);
      }, 1000);
    }
    return () => {
      if (interval) clearInterval(interval);
    };
  }, [isRecording]);

  const formatTime = (seconds: number) => {
    const mins = Math.floor(seconds / 60);
    const secs = seconds % 60;
    return `${mins.toString().padStart(2, '0')}:${secs.toString().padStart(2, '0')}`;
  };

  const analysisData = {
    clarity: 92,
    pace: 78,
    volume: 88,
    confidence: 85,
    overall: 85
  };

  const recommendations: Recommendation[] = [
    {
      id: 1,
      category: 'Rythme',
      title: 'Ralentissez légèrement',
      description: 'Votre débit est 15% plus rapide que l\'optimal. Essayez de faire des pauses entre les points clés.',
      icon: Volume2,
      color: 'bg-yellow-600',
      textColor: 'text-yellow-400',
      borderColor: 'border-yellow-600',
      bgColor: 'bg-yellow-900/30'
    },
    {
      id: 2,
      category: 'Clarté',
      title: 'Excellente clarté !',
      description: 'Votre articulation s\'est considérablement améliorée. Continuez ainsi !',
      icon: Mic,
      color: 'bg-green-600',
      textColor: 'text-green-400',
      borderColor: 'border-green-600',
      bgColor: 'bg-green-900/30'
    }
  ];

  const voiceMetrics: VoiceMetric[] = [
    { 
      name: 'Clarté', 
      value: 92, 
      change: '+8%', 
      color: 'bg-green-400',
      iconName: 'mic'
    },
    { 
      name: 'Rythme', 
      value: 78, 
      change: '-3%', 
      color: 'bg-yellow-400',
      iconName: 'volume'
    },
    { 
      name: 'Volume', 
      value: 88, 
      change: '+5%', 
      color: 'bg-blue-400',
      iconName: 'wave'
    },
    { 
      name: 'Confiance', 
      value: 85, 
      change: '+12%', 
      color: 'bg-purple-400',
      iconName: 'star'
    }
  ];

  const waveformBars: number[] = [20, 60, 40, 80, 30, 70, 50, 90, 35, 65];

  return (
    <div className="w-full">
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
          <h1 className="text-lg font-bold text-white">Analyse Vocale</h1>
        </div>
        
        <div className="flex items-center space-x-3">
          <button 
            className="text-white hover:text-yellow-400 transition-colors p-1"
            onClick={() => setIsRecording(!isRecording)}
          >
            {isRecording ? (
              <div className="flex items-center space-x-1">
                <div className="w-2 h-2 bg-red-500 rounded-full animate-pulse"></div>
                <span className="text-xs">Enregistrement</span>
              </div>
            ) : (
              <Mic className="w-5 h-5" />
            )}
          </button>
          <button className="text-white hover:text-yellow-400 transition-colors p-1">
            <Share2 className="w-5 h-5" />
          </button>
        </div>
      </div>

      {/* Main Content */}
      <div className="pb-16">
        {/* Top Section - Two Columns */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 mb-6">
          {/* Recording Info */}
          <div className="bg-white/5 rounded-xl p-4 border border-white/10 hover:border-yellow-400/30 transition-colors">
            <div className="flex items-center justify-between mb-3">
              <h2 className="text-white font-semibold text-lg">Dernier enregistrement</h2>
              <span className="text-cyan-400 text-sm">Il y a 2 min</span>
            </div>
            <div className="flex items-center space-x-4">
              <div className="flex items-center space-x-2">
                <Clock className="w-4 h-4 text-yellow-400" />
                <span className="text-sm text-white">{formatTime(sessionTime)}</span>
              </div>
              <div className="flex items-center space-x-2">
                <BookOpen className="w-4 h-4 text-yellow-400" />
                <span className="text-sm text-white">Module 6</span>
              </div>
            </div>
          </div>

          {/* Overall Score */}
          <div className="bg-gradient-to-r from-yellow-400 to-yellow-500 rounded-xl p-4 text-center hover:shadow-lg hover:shadow-yellow-400/20 transition-all">
            <div className="flex items-center justify-between">
              <div className="relative w-16 h-16">
                <svg className="w-full h-full" viewBox="0 0 100 100">
                  <circle cx="50" cy="50" r="40" fill="none" stroke="rgba(0,0,0,0.2)" strokeWidth="8" />
                  <circle 
                    cx="50" 
                    cy="50" 
                    r="40" 
                    fill="none" 
                    stroke="#000000" 
                    strokeWidth="8" 
                    strokeDasharray="251.2" 
                    strokeDashoffset="37.68"
                    transform="rotate(-90 50 50)" 
                  />
                </svg>
                <div className="absolute inset-0 flex items-center justify-center">
                  <span className="text-black font-bold text-xl">{analysisData.overall}</span>
                </div>
              </div>
              <div className="text-left flex-1 pl-4">
                <h3 className="text-black font-bold text-lg mb-1">Performance excellente !</h3>
                <p className="text-gray-900 text-sm">Votre voix montre une amélioration significative</p>
              </div>
            </div>
          </div>
        </div>

        {/* Voice Metrics Section */}
        <div className="mb-6">
          <h3 className="text-white font-semibold text-lg mb-4">Métriques vocales</h3>
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-3">
            {voiceMetrics.map((metric, index) => (
              <motion.div 
                key={metric.name}
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.1 * index }}
                className="bg-white/5 rounded-xl p-4 border border-white/10 hover:border-yellow-400/30 transition-colors"
              >
                <div className="flex items-center justify-between mb-2">
                  <div className={`w-8 h-8 ${metric.color} rounded-lg flex items-center justify-center`}>
                    {metric.iconName === 'mic' && <Mic className="w-4 h-4 text-white" />}
                    {metric.iconName === 'volume' && <Volume2 className="w-4 h-4 text-white" />}
                    {metric.iconName === 'wave' && (
                      <svg className="w-4 h-4 text-white" fill="currentColor" viewBox="0 0 20 20">
                        <path d="M18 3a1 1 0 00-1.196-.98l-10 2A1 1 0 006 5v9.114A4.369 4.369 0 015 14c-1.657 0-3 .895-3 2s1.343 2 3 2 3-.895 3-2V7.82l8-1.6v5.894A4.37 4.37 0 0115 12c-1.657 0-3 .895-3 2s1.343 2 3 2 3-.895 3-2V3z" />
                      </svg>
                    )}
                    {metric.iconName === 'star' && (
                      <svg className="w-4 h-4 text-white" fill="currentColor" viewBox="0 0 20 20">
                        <path d="M9.049 2.927c.3-.921 1.603-.921 1.902 0l1.07 3.292a1 1 0 00.95.69h3.462c.969 0 1.371 1.24.588 1.81l-2.8 2.034a1 1 0 00-.364 1.118l1.07 3.292c.3.921-.755 1.688-1.54 1.118l-2.8-2.034a1 1 0 00-1.175 0l-2.8 2.034c-.784.57-1.838-.197-1.539-1.118l1.07-3.292a1 1 0 00-.364-1.118L2.98 8.72c-.783-.57-.38-1.81.588-1.81h3.461a1 1 0 00.951-.69l1.07-3.292z" />
                      </svg>
                    )}
                  </div>
                  <span className={`text-xs font-bold ${metric.change.startsWith('+') ? 'text-green-400' : 'text-yellow-400'}`}>
                    {metric.change}
                  </span>
                </div>
                <div className="text-xl font-bold text-white mb-1">{metric.value}%</div>
                <div className="text-sm text-white/70 mb-2">{metric.name}</div>
                <div className="w-full bg-gray-700/50 rounded-full h-1.5 overflow-hidden">
                  <div 
                    className="h-full rounded-full transition-all duration-500" 
                    style={{ 
                      width: `${metric.value}%`,
                      backgroundColor: metric.color.replace('bg-', '').split('-')[0] === 'blue' ? '#60a5fa' : 
                                    metric.color.replace('bg-', '').split('-')[0] === 'green' ? '#4ade80' :
                                    metric.color.replace('bg-', '').split('-')[0] === 'yellow' ? '#facc15' : '#a78bfa'
                    }}
                  />
                </div>
              </motion.div>
            ))}
          </div>
        </div>

        {/* Voice Waveform and AI Recommendations Section */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          {/* Voice Waveform Section */}
          <div className="bg-white/5 rounded-xl p-4 border border-white/10 hover:border-yellow-400/30 transition-colors">
            <h3 className="text-white font-semibold text-lg mb-4">Modèle vocal</h3>
            <div className="flex items-end justify-center space-x-1 h-32 mb-2">
              {waveformBars.map((height, index) => (
                <motion.div
                  key={index}
                  className="w-1.5 bg-gradient-to-t from-cyan-400 to-cyan-600 rounded-t"
                  initial={{ height: '20%' }}
                  animate={{ height: `${height}%` }}
                  transition={{
                    duration: 0.5,
                    repeat: Infinity,
                    repeatType: 'reverse',
                    delay: index * 0.05
                  }}
                />
              ))}
            </div>
            <p className="text-center text-sm text-white/70 mt-2">Énergie constante tout au long de la présentation</p>
          </div>

          {/* AI Recommendations Section */}
          <div className="space-y-3">
            <h3 className="text-white font-semibold text-lg mb-4">Recommandations de l'IA</h3>
            <AnimatePresence>
              {recommendations.map((rec, index) => (
                <motion.div
                  key={rec.id}
                  initial={{ opacity: 0, x: 20 }}
                  animate={{ opacity: 1, x: 0 }}
                  transition={{ delay: 0.1 * index }}
                  className={`${rec.bgColor} ${rec.borderColor} border rounded-xl p-3 hover:shadow-lg hover:shadow-yellow-400/10 transition-all`}
                >
                  <div className="flex items-start space-x-3">
                    <div className={`${rec.color} w-6 h-6 rounded-full flex-shrink-0 flex items-center justify-center`}>
                      <span className="text-black font-bold text-xs">{index + 1}</span>
                    </div>
                    <div>
                      <h4 className="text-white font-medium text-sm">{rec.title}</h4>
                      <p className="text-xs text-white/80">{rec.description}</p>
                    </div>
                  </div>
                </motion.div>
              ))}
            </AnimatePresence>
          </div>
        </div>
      </div>
    </div>
  );
}
