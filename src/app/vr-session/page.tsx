'use client';
import { useState, useEffect } from 'react';
import Link from 'next/link';
import { ArrowLeft, Play, Square, RotateCcw, Mic, Volume2, Settings } from 'lucide-react';
import { motion } from 'framer-motion';

export default function VRSessionPage() {
  const [isActive, setIsActive] = useState(true);
  const [sessionTime, setSessionTime] = useState(0);
  const [isRecording, setIsRecording] = useState(false);
  const [currentScene, setCurrentScene] = useState('TEDx Stage');

  useEffect(() => {
    let interval: NodeJS.Timeout;
    if (isActive) {
      interval = setInterval(() => {
        setSessionTime(prev => prev + 1);
      }, 1000);
    }
    return () => clearInterval(interval);
  }, [isActive]);

  const formatTime = (seconds: number) => {
    const mins = Math.floor(seconds / 60);
    const secs = seconds % 60;
    return `${mins.toString().padStart(2, '0')}:${secs.toString().padStart(2, '0')}`;
  };

  const handleEndSession = () => {
    setIsActive(false);
    // Rediriger vers l'analyse vocale après quelques secondes
    setTimeout(() => {
      window.location.href = '/voice-analysis';
    }, 2000);
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-900 via-blue-900 to-gray-900">
      {/* Fixed Header */}
      <div className="fixed top-0 left-0 right-0 z-50 flex justify-between items-center p-4 bg-black bg-opacity-20 backdrop-blur-sm border-b border-gray-700">
        <Link href="/vr-scenes" className="text-white hover:text-yellow-400 transition-colors">
          <ArrowLeft className="w-6 h-6" />
        </Link>
        <div className="text-lg font-bold text-white">VR Session Active</div>
        <div className="flex items-center space-x-2">
          <div className="w-3 h-3 bg-green-400 rounded-full animate-pulse"></div>
          <span className="text-green-400 text-sm font-medium">LIVE</span>
        </div>
      </div>

      {/* VR Environment */}
      <div className="relative h-screen pt-16">
        {/* Background - Simulating VR environment */}
        <div className="absolute inset-0 bg-gradient-to-br from-purple-900 via-blue-900 to-indigo-900">
          {/* Animated circles for VR effect */}
          <div className="absolute top-20 left-20 w-32 h-32 bg-white bg-opacity-10 rounded-full animate-pulse"></div>
          <div className="absolute top-40 right-40 w-48 h-48 bg-white bg-opacity-5 rounded-full animate-pulse" style={{ animationDelay: '1s' }}></div>
          <div className="absolute bottom-40 left-1/3 w-24 h-24 bg-white bg-opacity-15 rounded-full animate-pulse" style={{ animationDelay: '2s' }}></div>
        </div>

        {/* VR Stage */}
        <div className="absolute inset-0 flex items-center justify-center">
          <div className="text-center">
            <motion.div
              initial={{ scale: 0.8, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              transition={{ duration: 1 }}
              className="bg-black bg-opacity-50 backdrop-blur-sm rounded-2xl p-8 border border-purple-500 shadow-2xl shadow-purple-500/50"
            >
              <h1 className="text-3xl font-bold text-white mb-4">{currentScene}</h1>
              <p className="text-gray-300 mb-6">Vous êtes maintenant sur scène. Commencez votre présentation !</p>
              
              {/* Audience Simulation */}
              <div className="grid grid-cols-8 gap-2 mb-8">
                {Array.from({ length: 64 }).map((_, i) => (
                  <div
                    key={i}
                    className="w-4 h-4 bg-white bg-opacity-20 rounded-full animate-pulse"
                    style={{ animationDelay: `${i * 0.1}s` }}
                  ></div>
                ))}
              </div>

              {/* Session Timer */}
              <div className="text-4xl font-bold text-white mb-6 font-mono">
                {formatTime(sessionTime)}
              </div>

              {/* Controls */}
              <div className="flex justify-center space-x-4">
                <button
                  onClick={() => setIsRecording(!isRecording)}
                  className={`p-4 rounded-full ${
                    isRecording 
                      ? 'bg-red-500 hover:bg-red-600' 
                      : 'bg-green-500 hover:bg-green-600'
                  } text-white transition-all duration-300`}
                >
                  {isRecording ? <Square className="w-6 h-6" /> : <Play className="w-6 h-6" />}
                </button>
                
                <button className="p-4 bg-blue-500 hover:bg-blue-600 rounded-full text-white transition-all duration-300">
                  <Mic className="w-6 h-6" />
                </button>
                
                <button className="p-4 bg-gray-500 hover:bg-gray-600 rounded-full text-white transition-all duration-300">
                  <Volume2 className="w-6 h-6" />
                </button>
              </div>
            </motion.div>
          </div>
        </div>

        {/* Overlay Controls */}
        <div className="absolute top-20 right-4 space-y-2">
          <button className="p-3 bg-black bg-opacity-50 rounded-full text-white hover:bg-opacity-70 transition-all">
            <Settings className="w-5 h-5" />
          </button>
        </div>

        {/* Session Info */}
        <div className="absolute bottom-4 left-4 right-4">
          <div className="bg-black bg-opacity-50 backdrop-blur-sm rounded-xl p-4 border border-gray-600">
            <div className="flex justify-between items-center">
              <div>
                <h3 className="text-white font-semibold">Session en cours</h3>
                <p className="text-gray-300 text-sm">{currentScene}</p>
              </div>
              <button
                onClick={handleEndSession}
                className="bg-red-500 hover:bg-red-600 text-white px-4 py-2 rounded-lg transition-all duration-300"
              >
                Terminer la session
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
