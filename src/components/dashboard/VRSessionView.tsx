'use client';
import { useState, useEffect } from 'react';
import { Headset, Star, Mic, Volume2, Settings, AlertCircle, Check, Pause, RotateCcw } from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';

// Types
type AICoachFeedback = {
  id: number;
  type: 'positive' | 'warning';
  title: string;
  message: string;
};

type PerformanceMetric = {
  name: string;
  value: number;
  color: string;
  icon: React.ReactNode;
};

interface VRSessionViewProps {
  onExit: () => void;
  onBack?: () => void;
}

export default function VRSessionView({ onExit, onBack }: VRSessionViewProps) {
  const [sessionState, setSessionState] = useState<'preparing' | 'active' | 'paused' | 'completed'>('preparing');
  const [currentTime, setCurrentTime] = useState(0);
  const [totalTime] = useState(300); // 5 minutes
  const [isRecording, setIsRecording] = useState(true);
  const [currentScene] = useState('TEDx Stage');
  const [aiFeedbacks] = useState<AICoachFeedback[]>([
    {
      id: 1,
      type: 'positive',
      title: 'Great opening!',
      message: 'Your hook captured the audience\'s attention effectively.'
    },
    {
      id: 2,
      type: 'warning',
      title: 'Slow down slightly',
      message: 'Your pace is 15% faster than optimal for this audience.'
    }
  ]);

  const performanceMetrics: PerformanceMetric[] = [
    { name: 'Audience Engagement', value: 94, color: 'bg-green-400', icon: '👥' },
    { name: 'Eye Contact', value: 78, color: 'bg-yellow-400', icon: '👁️' },
    { name: 'Gesture Usage', value: 86, color: 'bg-blue-400', icon: '👐' }
  ];

  const voiceMetrics = [
    { name: 'Clarity', value: 85, color: 'text-green-400' },
    { name: 'Pace', value: 72, color: 'text-yellow-400' },
    { name: 'Volume', value: 91, color: 'text-blue-400' }
  ];

  useEffect(() => {
    let interval: NodeJS.Timeout;
    if (sessionState === 'active') {
      interval = setInterval(() => {
        setCurrentTime(prev => prev + 1);
      }, 1000);
    }
    return () => clearInterval(interval);
  }, [sessionState]);

  const formatTime = (seconds: number) => {
    const mins = Math.floor(seconds / 60);
    const secs = seconds % 60;
    return `${mins.toString().padStart(2, '0')}:${secs.toString().padStart(2, '0')}`;
  };

  const handleEndSession = () => {
    setSessionState('completed');
    // Rediriger vers l'analyse vocale après quelques secondes
    setTimeout(() => {
      onExit();
    }, 1000);
  };

  return (
    <motion.div 
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.5, delay: 0.1 }}
      className="bg-gray-800/80 backdrop-blur-sm rounded-xl shadow-lg p-6 border border-gray-700 hover:shadow-xl transition-all"
    >
      {/* Fixed Header */}
      <div className="bg-red-900 bg-opacity-70 backdrop-blur-md border-b border-gray-800 mb-6">
        <div className="px-6 py-3">
          <div className="flex items-center justify-between">
            <div className="flex items-center space-x-2">
              <div className="w-3 h-3 bg-red-500 rounded-full animate-pulse"></div>
              <span className="text-white text-sm font-medium">VR ACTIVE</span>
            </div>
            <div className="text-white text-sm">{currentScene}</div>
            <button 
              onClick={onExit}
              className="bg-red-600 hover:bg-red-700 text-white px-3 py-1 rounded text-sm transition-colors"
            >
              Exit VR
            </button>
          </div>
          {/* Session Controls (moved from footer) */}
          <div className="mt-3 flex justify-center space-x-6">
            <button className="flex flex-col items-center text-gray-200 hover:text-white transition-colors">
              <div className="bg-gray-700/70 p-3 rounded-full mb-1 border border-gray-600">
                <Pause className="w-5 h-5" />
              </div>
              <span className="text-xs">Pause</span>
            </button>

            <button 
              onClick={() => setIsRecording(!isRecording)}
              className="flex flex-col items-center text-gray-200 hover:text-white transition-colors"
            >
              <div className={`p-3 rounded-full mb-1 border ${isRecording ? 'bg-red-600 border-red-500' : 'bg-gray-700/70 border-gray-600'}`}>
                <div className="w-5 h-5 relative">
                  {isRecording ? (
                    <div className="absolute inset-0 bg-white rounded-sm"></div>
                  ) : (
                    <div className="w-0 h-0 border-t-5 border-b-5 border-l-8 border-t-transparent border-b-transparent border-l-white ml-1.5 mt-1"></div>
                  )}
                </div>
              </div>
              <span className="text-xs">{isRecording ? 'Stop' : 'Record'}</span>
            </button>

            <button className="flex flex-col items-center text-gray-200 hover:text-white transition-colors">
              <div className="bg-gray-700/70 p-3 rounded-full mb-1 border border-gray-600">
                <RotateCcw className="w-5 h-5" />
              </div>
              <span className="text-xs">Reset</span>
            </button>

            <button className="flex flex-col items-center text-gray-200 hover:text-white transition-colors">
              <div className="bg-gray-700/70 p-3 rounded-full mb-1 border border-gray-600">
                <Settings className="w-5 h-5" />
              </div>
              <span className="text-xs">Settings</span>
            </button>
          </div>
        </div>
      </div>

      {/* Main Content */}
      <div className="pb-6">
        {/* VR Environment Preview */}
        <div className="relative h-64 bg-gradient-to-b from-red-900 to-black overflow-hidden rounded-xl mb-6">
          <img 
            src="https://images.unsplash.com/photo-1540575467063-178a50c2df87?w=1200&h=300&fit=crop" 
            alt={currentScene} 
            className="w-full h-full object-cover opacity-60"
          />
          <div className="absolute inset-0 bg-gradient-to-t from-black via-transparent to-transparent"></div>
          
          {/* VR Overlay Elements */}
          <div className="absolute top-4 left-4 bg-black bg-opacity-70 rounded-lg p-2">
            <div className="text-white text-xs">Audience: 487 people</div>
            <div className="text-red-400 text-xs">Attention: 94%</div>
          </div>
          
          <div className="absolute top-4 right-4 bg-black bg-opacity-70 rounded-lg p-2">
            <div className="text-white text-xs">Time: {formatTime(currentTime)}</div>
            <div className="text-green-400 text-xs">Confidence: High</div>
          </div>

          {/* Center VR Icon */}
          <div className="absolute inset-0 flex items-center justify-center">
            <div className="w-20 h-20 bg-red-600 bg-opacity-30 rounded-full flex items-center justify-center shadow-lg shadow-red-500/30 animate-pulse">
              <svg className="w-10 h-10 text-white" fill="currentColor" viewBox="0 0 20 20">
                <path d="M10 12a2 2 0 100-4 2 2 0 000 4z"/>
                <path fillRule="evenodd" d="M.458 10C1.732 5.943 5.522 3 10 3s8.268 2.943 9.542 7c-1.274 4.057-5.064 7-9.542 7S1.732 14.057.458 10zM14 10a4 4 0 11-8 0 4 4 0 018 0z" clipRule="evenodd"/>
              </svg>
            </div>
          </div>
        </div>

        {/* Voice Analysis */}
        <div className="px-6 py-6">
          <div className="bg-gray-900 bg-opacity-50 rounded-xl p-5 mb-6 border border-gray-800">
            <div className="flex items-center justify-between mb-4">
              <h3 className="text-white font-semibold text-lg">Voice Analysis</h3>
              <div className="flex items-center space-x-1">
                {[0, 0.1, 0.2, 0.3, 0.4].map((delay) => (
                  <motion.div 
                    key={delay}
                    className="w-1.5 h-4 bg-green-400 rounded"
                    animate={{ 
                      height: [4, 16, 4],
                      y: [8, 0, 8]
                    }}
                    transition={{ 
                      duration: 1.5, 
                      repeat: Infinity,
                      delay: delay,
                      ease: "easeInOut"
                    }}
                  />
                ))}
              </div>
            </div>
            
            <div className="grid grid-cols-3 gap-4">
              {voiceMetrics.map((metric, index) => (
                <div key={index} className="text-center">
                  <div className={`text-2xl font-bold ${metric.color}`}>{metric.value}%</div>
                  <div className="text-xs text-gray-400 mt-1">{metric.name}</div>
                </div>
              ))}
            </div>
          </div>
        </div>

        {/* Real-time AI Feedback */}
        <div className="px-6 mb-6">
          <h3 className="text-white font-semibold text-lg mb-4">AI Coach Feedback</h3>
          <div className="space-y-3">
            <AnimatePresence>
              {aiFeedbacks.map((feedback) => (
                <motion.div
                  key={feedback.id}
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  exit={{ opacity: 0, y: -20 }}
                  className={`${feedback.type === 'positive' 
                    ? 'bg-green-900/30 border-l-4 border-green-400' 
                    : 'bg-yellow-900/30 border-l-4 border-yellow-400'
                  } p-4 rounded-r-lg`}
                >
                  <div className="flex items-start space-x-2">
                    {feedback.type === 'positive' ? (
                      <Check className="w-5 h-5 text-green-400 mt-0.5 flex-shrink-0" />
                    ) : (
                      <AlertCircle className="w-5 h-5 text-yellow-400 mt-0.5 flex-shrink-0" />
                    )}
                    <div>
                      <h4 className={`font-medium ${feedback.type === 'positive' ? 'text-green-300' : 'text-yellow-300'}`}>
                        {feedback.title}
                      </h4>
                      <p className="text-gray-300 text-sm mt-1">{feedback.message}</p>
                    </div>
                  </div>
                </motion.div>
              ))}
            </AnimatePresence>
          </div>
        </div>

        {/* Performance Metrics */}
        <div className="px-6 mb-6">
          <div className="bg-gray-900 bg-opacity-50 rounded-xl p-5 border border-gray-800">
            <h3 className="text-white font-semibold text-lg mb-4">Live Performance</h3>
            <div className="space-y-4">
              {performanceMetrics.map((metric, index) => (
                <div key={index} className="flex items-center justify-between">
                  <div className="flex items-center space-x-2">
                    <span className="text-xl">{metric.icon}</span>
                    <span className="text-gray-300 text-sm">{metric.name}</span>
                  </div>
                  <div className="flex items-center space-x-3">
                    <div className="w-24 bg-gray-700 rounded-full h-2">
                      <div 
                        className={`h-2 rounded-full ${metric.color}`}
                        style={{ width: `${metric.value}%` }}
                      ></div>
                    </div>
                    <span className="text-sm font-medium w-10 text-right">{metric.value}%</span>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>

        
      </div>
    </motion.div>
  );
}
