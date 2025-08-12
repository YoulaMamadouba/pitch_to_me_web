import { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { 
  ArrowLeft,
  Info,
  Check,
  Settings,
  Volume2,
  Maximize2,
  Minimize2,
  Wifi,
  Battery,
  Zap,
  ZapOff,
  Headphones,
  WifiOff
} from 'lucide-react';

type CalibrationStep = {
  id: number;
  title: string;
  description: string;
  status: 'complete' | 'active' | 'pending';
  progress?: number;
};

export default function VRCalibration() {
  const [currentStep, setCurrentStep] = useState<number>(1);
  const [height, setHeight] = useState<number>(173); // Default height in cm
  const [isConnected, setIsConnected] = useState<boolean>(true);
  const [batteryLevel, setBatteryLevel] = useState<number>(85);
  const [isScanning, setIsScanning] = useState<boolean>(true);

  const steps: CalibrationStep[] = [
    {
      id: 1,
      title: 'Room Scale Setup',
      description: 'Define your play area boundaries',
      status: 'complete',
      progress: 100
    },
    {
      id: 2,
      title: 'Height Calibration',
      description: 'Adjust your standing height',
      status: 'active',
      progress: 60
    },
    {
      id: 3,
      title: 'Controller Tracking',
      description: 'Test hand controller accuracy',
      status: 'pending',
      progress: 0
    },
    {
      id: 4,
      title: 'Audio Test',
      description: 'Verify spatial audio settings',
      status: 'pending',
      progress: 0
    }
  ];

  const handleHeightAdjust = (direction: 'up' | 'down') => {
    setHeight(prev => {
      const newHeight = direction === 'up' ? prev + 1 : prev - 1;
      return Math.max(120, Math.min(220, newHeight)); // Limit between 120cm and 220cm
    });
  };

  const toggleConnection = () => {
    setIsConnected(!isConnected);
  };

  useEffect(() => {
    // Simulate battery drain when connected
    if (isConnected) {
      const interval = setInterval(() => {
        setBatteryLevel(prev => {
          if (prev <= 5) return 5;
          return prev - 0.1;
        });
      }, 10000);
      return () => clearInterval(interval);
    }
  }, [isConnected]);

  const cmToFeetInches = (cm: number): string => {
    const inches = cm / 2.54;
    const feet = Math.floor(inches / 12);
    const remainingInches = Math.round(inches % 12);
    return `${feet}'${remainingInches}"`;
  };

  return (
    <motion.div 
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.5, delay: 0.1 }}
      className="bg-gray-800/80 backdrop-blur-sm rounded-xl shadow-lg p-6 border border-gray-700 hover:shadow-xl transition-all"
    >
      {/* Header */}
      <div className="mb-6">
        <div className="flex items-center justify-between mb-6">
          <div className="flex items-center space-x-4">
            <button className="p-2 rounded-full hover:bg-gray-700/50 transition-colors">
              <ArrowLeft className="w-5 h-5 text-white" />
            </button>
            <h1 className="text-xl font-bold text-white">VR Calibration</h1>
          </div>
          <button className="p-2 rounded-full hover:bg-gray-700/50 transition-colors">
            <Info className="w-5 h-5 text-white" />
          </button>
        </div>
        
        {/* Connection Status */}
        <div className="bg-gray-700/50 rounded-xl p-4 border border-gray-600 mb-6">
          <div className="flex items-center justify-between mb-3">
            <h3 className="font-semibold text-white">Device Status</h3>
            <div className={`px-3 py-1 rounded-full text-xs font-medium ${isConnected ? 'bg-green-900 text-green-300' : 'bg-red-900 text-red-300'}`}>
              {isConnected ? 'Connected' : 'Disconnected'}
            </div>
          </div>
          
          <div className="flex items-center space-x-4">
            <div className={`p-3 rounded-lg ${isConnected ? 'bg-cyan-500' : 'bg-gray-700'}`}>
              <Settings className={`w-6 h-6 ${isConnected ? 'text-white' : 'text-gray-400'}`} />
            </div>
            <div className="flex-1">
              <h4 className="font-medium text-white">Oculus Quest 2</h4>
              <div className="flex items-center space-x-4 text-sm text-gray-400">
                <span className="flex items-center">
                  <Wifi className={`w-4 h-4 mr-1 ${isConnected ? 'text-green-400' : 'text-red-400'}`} />
                  {isConnected ? 'Connected' : 'Offline'}
                </span>
                <span className="flex items-center">
                  {batteryLevel > 20 ? (
                    <Zap className="w-4 h-4 mr-1 text-yellow-400" />
                  ) : (
                    <ZapOff className="w-4 h-4 mr-1 text-red-400" />
                  )}
                  {batteryLevel}%
                </span>
              </div>
            </div>
            <button 
              onClick={toggleConnection}
              className="px-3 py-1.5 text-sm rounded-md bg-gray-600 hover:bg-gray-500 transition-colors text-white"
            >
              {isConnected ? 'Disconnect' : 'Connect'}
            </button>
          </div>
        </div>
      </div>

      {/* VR Headset Visual */}
      <div className="px-6 mb-6">
        <div className="relative mx-auto w-40 h-40 bg-gradient-to-br from-cyan-500 to-blue-600 rounded-2xl flex items-center justify-center shadow-lg shadow-cyan-500/20 mb-6">
          <div className="absolute inset-0 rounded-2xl border-2 border-cyan-400 opacity-70" style={{
            animation: 'pulse 2s cubic-bezier(0.4, 0, 0.6, 1) infinite'
          }}></div>
          <div className="w-16 h-16 bg-black bg-opacity-30 rounded-full flex items-center justify-center">
            <div className="w-10 h-10 rounded-full bg-white flex items-center justify-center">
              <div className="w-3 h-3 bg-cyan-500 rounded-full"></div>
            </div>
          </div>
        </div>
      </div>

      {/* Calibration Steps */}
      <div className="px-6 mb-6 flex-1">
        <h3 className="text-lg font-semibold mb-4">Calibration Steps</h3>
        <div className="space-y-3">
          {steps.map((step) => (
            <div 
              key={step.id}
              className={`p-4 rounded-xl border transition-all duration-300 ${
                step.status === 'complete' 
                  ? 'bg-green-900/30 border-green-600' 
                  : step.status === 'active'
                  ? 'bg-cyan-900/30 border-cyan-600'
                  : 'bg-gray-800/50 border-gray-700 opacity-70'
              }`}
            >
              <div className="flex items-center space-x-4">
                <div className={`w-8 h-8 rounded-full flex-shrink-0 flex items-center justify-center ${
                  step.status === 'complete' 
                    ? 'bg-green-600' 
                    : step.status === 'active'
                    ? 'bg-cyan-600'
                    : 'bg-gray-700'
                }`}>
                  {step.status === 'complete' ? (
                    <Check className="w-4 h-4 text-white" />
                  ) : (
                    <span className="text-white font-medium text-sm">{step.id}</span>
                  )}
                </div>
                <div className="flex-1 min-w-0">
                  <h4 className={`font-medium ${
                    step.status === 'complete' ? 'text-green-300' : 
                    step.status === 'active' ? 'text-cyan-300' : 'text-gray-400'
                  }`}>
                    {step.title}
                  </h4>
                  <p className="text-sm text-gray-400 truncate">{step.description}</p>
                  {step.progress && step.progress > 0 && (
                    <div className="mt-2 w-full bg-gray-700 rounded-full h-1.5">
                      <div 
                        className="bg-cyan-400 h-1.5 rounded-full transition-all duration-500"
                        style={{ width: `${step.progress}%` }}
                      ></div>
                    </div>
                  )}
                </div>
                {step.status === 'active' && step.progress && (
                  <span className="text-cyan-400 text-sm font-medium whitespace-nowrap">
                    {step.progress}%
                  </span>
                )}
                {step.status === 'complete' && (
                  <span className="text-green-400 text-sm font-medium">Complete</span>
                )}
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* Current Calibration */}
      {steps[1]?.status === 'active' && (
        <div className="px-6 mb-6">
          <div className="bg-gray-800/50 rounded-xl p-5 border border-gray-700">
            <h3 className="font-semibold mb-4">Height Calibration</h3>
            <div className="flex flex-col items-center mb-6">
              <div className="relative w-24 h-48 bg-gray-900 rounded-lg overflow-hidden mb-4">
                <div 
                  className="absolute bottom-0 w-full bg-gradient-to-t from-cyan-500 to-cyan-400 transition-all duration-500"
                  style={{ height: `${((height - 120) / 100) * 100}%` }}
                ></div>
                <div className="absolute inset-0 flex items-center justify-center">
                  <div className="w-12 h-12 rounded-full bg-cyan-900/50 border-2 border-cyan-400/50 flex items-center justify-center">
                    <div className="w-2 h-2 bg-cyan-400 rounded-full"></div>
                  </div>
                </div>
                {isScanning && (
                  <div className="absolute top-0 left-0 w-full h-0.5 bg-yellow-400 animate-scan"></div>
                )}
              </div>
              <p className="text-center text-lg font-medium">
                {cmToFeetInches(height)} • {height}cm
              </p>
            </div>
            
            <div className="grid grid-cols-2 gap-3">
              <button 
                onClick={() => handleHeightAdjust('down')}
                className="bg-gray-700 hover:bg-gray-600 text-white py-3 rounded-lg font-medium transition-colors flex items-center justify-center space-x-2"
              >
                <Minimize2 className="w-4 h-4" />
                <span>Decrease</span>
              </button>
              <button 
                onClick={() => handleHeightAdjust('up')}
                className="bg-cyan-600 hover:bg-cyan-500 text-white py-3 rounded-lg font-medium transition-colors flex items-center justify-center space-x-2"
              >
                <Maximize2 className="w-4 h-4" />
                <span>Increase</span>
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Pro Tip */}
      <div className="px-6 mb-6">
        <div className="bg-yellow-900/30 border border-yellow-600/50 rounded-xl p-4">
          <div className="flex items-start space-x-3">
            <div className="p-1 bg-yellow-500/20 rounded-full">
              <Info className="w-4 h-4 text-yellow-400" />
            </div>
            <div>
              <h4 className="text-yellow-400 font-medium text-sm mb-1">Pro Tip</h4>
              <p className="text-yellow-100 text-sm">
                Stand naturally with your arms at your sides for the most accurate calibration.
              </p>
            </div>
          </div>
        </div>
      </div>

      {/* Action Buttons */}
      <div className="p-6 pt-0">
        <div className="grid grid-cols-2 gap-3">
          <button className="bg-gray-700 hover:bg-gray-600 text-white font-medium py-3 rounded-xl transition-colors">
            Skip Step
          </button>
          <button className="bg-gradient-to-r from-cyan-500 to-cyan-600 hover:from-cyan-600 hover:to-cyan-700 text-white font-semibold py-3 rounded-xl transition-all transform hover:scale-[1.02]">
            Continue
          </button>
        </div>
      </div>

      {/* Global Animation Styles */}
      <style jsx global>{`
        @keyframes pulse {
          0%, 100% { box-shadow: 0 0 0 0 rgba(34, 211, 238, 0.7); }
          70% { box-shadow: 0 0 0 10px rgba(34, 211, 238, 0); }
        }
        .animate-scan {
          animation: scan 2s linear infinite;
        }
        @keyframes scan {
          0% { transform: translateY(-100%); }
          100% { transform: translateY(200px); }
        }
      `}</style>
    </motion.div>
  );
}
