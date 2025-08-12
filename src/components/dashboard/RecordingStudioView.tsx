'use client';

import { useState, useRef, useEffect } from 'react';
import { Settings, Mic, Video, Square, Pause, RefreshCw, Search, Maximize2 } from 'lucide-react';

interface RecordingStudioViewProps {
  onBack?: () => void;
}

export default function RecordingStudioView({ onBack }: RecordingStudioViewProps) {
  const [isRecording, setIsRecording] = useState(false);
  const [isPaused, setIsPaused] = useState(false);
  const [activeCamera, setActiveCamera] = useState('main');
  const [activeAngle, setActiveAngle] = useState('front');
  const [recordingTime, setRecordingTime] = useState(0);
  const timerRef = useRef<NodeJS.Timeout | null>(null);

  // Format time as MM:SS
  const formatTime = (seconds: number) => {
    const mins = Math.floor(seconds / 60).toString().padStart(2, '0');
    const secs = (seconds % 60).toString().padStart(2, '0');
    return `${mins}:${secs}`;
  };

  // Toggle recording
  const toggleRecording = () => {
    if (isRecording) {
      // Stop recording
      setIsRecording(false);
      setIsPaused(false);
      if (timerRef.current) {
        clearInterval(timerRef.current);
        timerRef.current = null;
      }
      setRecordingTime(0);
    } else {
      // Start recording
      setIsRecording(true);
      timerRef.current = setInterval(() => {
        setRecordingTime(prev => prev + 1);
      }, 1000);
    }
  };

  // Toggle pause
  const togglePause = () => {
    if (!isRecording) return;
    
    setIsPaused(!isPaused);
    if (isPaused) {
      // Resume
      timerRef.current = setInterval(() => {
        setRecordingTime(prev => prev + 1);
      }, 1000);
    } else {
      // Pause
      if (timerRef.current) {
        clearInterval(timerRef.current);
        timerRef.current = null;
      }
    }
  };

  // Clean up interval on unmount
  useEffect(() => {
    return () => {
      if (timerRef.current) {
        clearInterval(timerRef.current);
      }
    };
  }, []);

  // Camera angles data
  const cameraAngles = [
    { id: 'front', label: 'Front View', icon: 'M4 4v5h.582m15.356 2A8.001 8.001 0 004.582 9m0 0H9m11 11v-5h-.581m0 0a8.003 8.003 0 01-15.357-2m15.357 2H15' },
    { id: 'side', label: 'Side View', icon: 'M4 4v5h.582m15.356 2A8.001 8.001 0 004.582 9m0 0H9m11 11v-5h-.581m0 0a8.003 8.003 0 01-15.357-2m15.357 2H15' },
    { id: 'wide', label: 'Wide Shot', icon: 'M4 4v5h.582m15.356 2A8.001 8.001 0 004.582 9m0 0H9m11 11v-5h-.581m0 0a8.003 8.003 0 01-15.357-2m15.357 2H15' },
  ];

  // Audio levels for visualization
  const audioLevels = [20, 40, 60, 80, 70, 90, 60, 40];
  const maxLevel = Math.max(...audioLevels);

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
          <h1 className="text-xl font-bold text-white">Recording Studio</h1>
        </div>
        <button className="text-gray-300 hover:text-white transition-colors">
          <Settings className="w-6 h-6" />
        </button>
      </div>

      {/* Main Content */}
      <div className="pb-24">
        {/* Recording Status */}
        {isRecording && (
          <div className="bg-red-900/30 border border-red-600 rounded-xl p-4 mb-6 animate-pulse">
            <div className="flex items-center justify-between">
              <div className="flex items-center space-x-3">
                <div className="w-3 h-3 bg-red-500 rounded-full"></div>
                <span className="font-semibold text-white">ENREGISTREMENT</span>
              </div>
              <div className="font-mono text-xl text-white">{formatTime(recordingTime)}</div>
            </div>
            <div className="mt-3">
              <div className="text-sm mb-2 text-white">Session: Entraînement Pitch</div>
              <div className="flex items-center space-x-3 text-xs">
                <span className="text-gray-300">Qualité:</span>
                <span className="text-green-400 font-medium">4K • 60fps</span>
                <span className="text-gray-500">•</span>
                <span className="text-blue-400 font-medium">Audio Spatial</span>
              </div>
            </div>
          </div>
        )}

        {/* Camera Preview - Original width, reduced height */}
        <div className="relative bg-black rounded-xl overflow-hidden mb-6" style={{ height: '300px' }}>
          {/* Camera Feed from HTML design */}
          <div className="absolute inset-0">
            <img 
              src="https://images.unsplash.com/photo-1560472354-b33ff0c44a43?w=600&h=400&fit=crop" 
              alt="Aperçu de la caméra" 
              className="w-full h-full object-cover"
              onError={(e) => {
                // Fallback si l'image ne charge pas
                const target = e.target as HTMLImageElement;
                target.src = 'data:image/svg+xml;base64,PHN2ZyB4bWxucz0iaHR0cDovL3d3dy53My5vcmcvMjAwMC9zdmciIHdpZHRoPSIxMDAlIiBoZWlnaHQ9IjEwMCUiIHZpZXdCb3g9IjAgMCAxMDAgMTAwIiBwcmVzZXJ2ZUFzcGVjdFJhdGlvPSJub25lIj48cmVjdCB3aWR0aD0iMTAwJSIgaGVpZ2h0PSIxMDAlIiBmaWxsPSIjMWEzMWQyIi8+PHRleHQgeD0iNTAlIiB5PSI1JSIgZm9udC1mYW1pbHk9IkFyaWFsIiBmb250LXNpemU9IjE0IiB0ZXh0LWFuY2hvcj0ibWlkZGxlIiBmaWxsPSJ3aGl0ZSI+QXBwYXJlaWwgZGUgbGEgY2Ftw6lyYTwvdGV4dD48dGV4dCB4PSI1MCUiIHk9Ijk1JSIgZm9udC1mYW1pbHk9IkFyaWFsIiBmb250LXNpemU9IjE0IiB0ZXh0LWFuY2hvcj0ibWlkZGxlIiBmaWxsPSJ3aGl0ZSI+UGl0Y2ggdG8gTWUgLSBTdHVkaW88L3RleHQ+PC9zdmc+'
              }}
            />
          </div>
          
          {/* Camera Overlay */}
          <div className="absolute inset-0 pointer-events-none">
            {/* Grid Overlay */}
            <div className="absolute inset-0 grid grid-cols-3 grid-rows-3 opacity-20">
              {[...Array(9)].map((_, i) => (
                <div key={i} className="border border-white"></div>
              ))}
            </div>
            
            {/* Focus Point */}
            <div className="absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2">
              <div className="w-16 h-16 border-2 border-yellow-400 rounded-full flex items-center justify-center">
                <div className="w-1.5 h-1.5 bg-yellow-400 rounded-full"></div>
              </div>
            </div>
          </div>
          
          {/* Camera Controls */}
          <div className="absolute bottom-4 left-4 right-4 flex justify-between items-center pointer-events-auto">
            <button className="bg-black/50 text-white p-2 rounded-full hover:bg-black/70 transition-colors">
              <Search className="w-5 h-5" />
            </button>
            <div className="bg-black/50 text-white px-3 py-1 rounded-full text-sm">
              Caméra principale
            </div>
            <button className="bg-black/50 text-white p-2 rounded-full hover:bg-black/70 transition-colors">
              <Maximize2 className="w-5 h-5" />
            </button>
          </div>
        </div>

        {/* Camera Angles */}
        <div className="mb-6">
          <h2 className="text-lg font-semibold mb-3 text-white">Angles de caméra</h2>
          <div className="grid grid-cols-3 gap-3">
            {cameraAngles.map((angle) => (
              <button
                key={angle.id}
                onClick={() => setActiveAngle(angle.id)}
                className={`p-3 rounded-lg border-2 transition-all ${
                  activeAngle === angle.id
                    ? 'border-yellow-400 bg-yellow-400/10'
                    : 'border-gray-700 hover:border-gray-600 bg-gray-800/50'
                }`}
              >
                <div className="bg-gray-700/50 rounded h-16 mb-2 flex items-center justify-center">
                  <svg
                    className={`w-6 h-6 ${
                      activeAngle === angle.id ? 'text-yellow-400' : 'text-gray-400'
                    }`}
                    fill="none"
                    stroke="currentColor"
                    viewBox="0 0 24 24"
                  >
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      strokeWidth={2}
                      d={angle.icon}
                    />
                  </svg>
                </div>
                <p
                  className={`text-xs text-center ${
                    activeAngle === angle.id ? 'text-yellow-400' : 'text-gray-400'
                  }`}
                >
                  {angle.label}
                </p>
              </button>
            ))}
          </div>
        </div>

        {/* Audio Levels - Reduced margin bottom */}
        <div className="bg-gray-800/50 rounded-xl p-4 border border-gray-700 mb-4">
          <div className="flex justify-between items-center mb-3">
            <h2 className="text-lg font-semibold text-white">Niveaux audio</h2>
            <div className="text-green-400 font-mono">-12 dB</div>
          </div>
          
          {/* Audio Waveform */}
          <div className="flex items-end h-8 mb-4 space-x-1">
            {audioLevels.map((level, index) => {
              const height = (level / maxLevel) * 100;
              const isMiddle = index === Math.floor(audioLevels.length / 2);
              return (
                <div
                  key={index}
                  className={`w-1.5 rounded-t ${
                    isMiddle ? 'bg-yellow-400' : 'bg-green-400'
                  }`}
                  style={{ height: `${height}%` }}
                ></div>
              );
            })}
          </div>
          
          <div className="flex items-center space-x-4">
            <button className="text-gray-300 hover:text-white transition-colors">
              <Mic className="w-5 h-5" />
            </button>
            <div className="flex-1 bg-gray-700 rounded-full h-2">
              <div 
                className="bg-green-400 h-2 rounded-full" 
                style={{ width: '75%' }}
              ></div>
            </div>
            <span className="text-sm text-gray-300 w-10">75%</span>
          </div>
        </div>
      </div>

      {/* Fixed Bottom Controls - More compact */}
      <div className="fixed bottom-0 left-0 right-0 bg-gray-900/95 backdrop-blur-md border-t border-gray-800 py-3 px-4">
        <div className="max-w-4xl mx-auto">
          <div className="flex items-center justify-center space-x-6 mb-3">
            {/* Stop Button - Smaller */}
            <button 
              onClick={toggleRecording}
              className={`p-3 rounded-full ${
                isRecording 
                  ? 'bg-red-600 hover:bg-red-700' 
                  : 'bg-red-600 hover:bg-red-700'
              } text-white transition-colors`}
            >
              {isRecording ? (
                <Square className="w-5 h-5" />
              ) : (
                <div className="w-5 h-5 rounded-sm bg-white"></div>
              )}
            </button>

            {/* Pause/Resume Button - Smaller */}
            <button 
              onClick={togglePause}
              disabled={!isRecording}
              className={`p-4 rounded-full ${
                isRecording && isPaused 
                  ? 'bg-yellow-500 hover:bg-yellow-600' 
                  : isRecording 
                    ? 'bg-yellow-500 hover:bg-yellow-600' 
                    : 'bg-gray-700 cursor-not-allowed'
              } text-white transition-colors`}
            >
              {isPaused ? (
                <Video className="w-5 h-5" />
              ) : (
                <Pause className="w-5 h-5" />
              )}
            </button>

            {/* Switch Camera Button - Smaller */}
            <button 
              onClick={() => setActiveCamera(prev => prev === 'main' ? 'front' : 'main')}
              className="p-3 rounded-full bg-gray-700 hover:bg-gray-600 text-white transition-colors"
            >
              <RefreshCw className="w-5 h-5" />
            </button>
          </div>

          <div className="grid grid-cols-2 gap-2 max-w-xs mx-auto">
            <button className="py-1.5 px-3 text-xs bg-gray-700 hover:bg-gray-600 text-white font-medium rounded-lg border border-gray-600 transition-colors">
              Enregistrer le brouillon
            </button>
            <button className="py-1.5 px-3 text-xs bg-gradient-to-r from-yellow-400 to-yellow-500 hover:from-yellow-500 hover:to-yellow-600 text-gray-900 font-semibold rounded-lg transition-colors">
              Terminer & Analyser
            </button>
          </div>
        </div>
      </div>

      {/* Add padding to prevent content from being hidden behind fixed controls */}
      <div className="pb-40"></div>
    </div>
  );
}
