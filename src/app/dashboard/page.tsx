'use client';

import { useState, useEffect } from 'react';
import Link from 'next/link';
import { motion } from 'framer-motion';
import dynamic from 'next/dynamic';
import { 
  Home, 
  BookOpen, 
  Users as UsersIcon,
  User,
  Settings,
  Bell,
  Menu,
  X,
  ChevronDown,
  ChevronRight,
  ChevronLeft,
  Play,
  Check,
  Lock,
  BarChart3,
  Trophy,
  Target,
  Calendar,
  ArrowRight,
  TrendingUp,
  MessageSquare,
  Bot,
  Sparkles,
  Users,
  Heart,
  Share2,
  MessageCircle,
  Headset,
  Zap,
  Wifi,
  Eye,
  Mic,
  Video,
  Smile
} from 'lucide-react';
import LearnerProfile from '@/components/LearnerProfile';
import Community from '@/components/Community';
import VRCalibration from '@/components/VRCalibration';

// Import dynamique des composants pour le chargement à la demande
const ModuleView = dynamic(() => import('@/components/dashboard/ModuleView'), {
  loading: () => <div className="flex items-center justify-center h-64"><div className="animate-spin rounded-full h-8 w-8 border-b-2 border-yellow-400"></div></div>
});

const VRSceneView = dynamic(() => import('@/components/dashboard/VRSceneView'), {
  loading: () => <div className="flex items-center justify-center h-64"><div className="animate-spin rounded-full h-8 w-8 border-b-2 border-yellow-400"></div></div>
});

const VRSessionView = dynamic(() => import('@/components/dashboard/VRSessionView'), {
  loading: () => <div className="flex items-center justify-center h-64"><div className="animate-spin rounded-full h-8 w-8 border-b-2 border-yellow-400"></div></div>
});

const VoiceAnalysisView = dynamic(() => import('@/components/dashboard/VoiceAnalysisView'), {
  loading: () => <div className="flex items-center justify-center h-64"><div className="animate-spin rounded-full h-8 w-8 border-b-2 border-yellow-400"></div></div>
});

const RecordingStudioView = dynamic(() => import('@/components/dashboard/RecordingStudioView'), {
  loading: () => <div className="flex items-center justify-center h-64"><div className="animate-spin rounded-full h-8 w-8 border-b-2 border-yellow-400"></div></div>
});

const EmotionRecognitionView = dynamic(() => import('@/components/dashboard/EmotionRecognitionView'), {
  loading: () => <div className="flex items-center justify-center h-64"><div className="animate-spin rounded-full h-8 w-8 border-b-2 border-yellow-400"></div></div>
});


interface NavigationItem {
  id: string;
  label: string;
  icon: React.ComponentType<{ className?: string }>;
  className?: string;
  active?: boolean;
  onClick?: () => void;
};

type ViewType = 
  | 'dashboard' 
  | 'profile' 
  | 'community' 
  | 'vrcalibration'
  | 'module'
  | 'vr-scene'
  | 'vr-session'
  | 'voice-analysis'
  | 'recording-studio'
  | 'emotion-recognition';

type Module = {
  id: number;
  title: string;
  subtitle: string;
  progress: number;
  locked: boolean;
  current: boolean;
};

type Activity = {
  type: string;
  title: string;
  time: string;
  icon: React.ComponentType<{ className?: string }>;
};

interface ProgressRingProps {
  progress: number;
  size?: number;
  stroke?: number;
}

const ProgressRing = ({ progress, size = 60, stroke = 6 }: ProgressRingProps) => {
  const radius = (size - stroke) / 2;
  const circumference = radius * 2 * Math.PI;
  const offset = circumference - (progress / 100) * circumference;

  return (
    <div className="relative inline-flex items-center justify-center">
      <svg className="progress-ring w-16 h-16" viewBox="0 0 80 80">
        <circle 
          cx="40" 
          cy="40" 
          r="36" 
          stroke="#374151" 
          strokeWidth="8" 
          fill="transparent"
        />
        <circle 
          className="progress-ring-circle" 
          cx="40" 
          cy="40" 
          r="36" 
          stroke="#F4C056" 
          strokeWidth="8" 
          fill="transparent"
          strokeDasharray={circumference}
          strokeDashoffset={offset}
          strokeLinecap="round"
        />
      </svg>
      <div className="absolute inset-0 flex items-center justify-center">
        <span className="text-white font-bold text-sm">{progress}%</span>
      </div>
    </div>
  );
};

export default function DashboardPage() {
  const [mounted, setMounted] = useState(false);
  const [isScrolled, setIsScrolled] = useState(false);

  useEffect(() => {
    setMounted(true);
    
    const handleScroll = () => {
      setIsScrolled(window.scrollY > 10);
    };
    
    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);
  const [isSidebarOpen, setIsSidebarOpen] = useState(true);
  const [activeModule, setActiveModule] = useState<number>(5); // Module 6 est actif (index 5)
  const [activeView, setActiveView] = useState<ViewType>('dashboard');
  const [selectedModuleId, setSelectedModuleId] = useState<string>('6');
  const [selectedVRScene, setSelectedVRScene] = useState<string>('');


  const navigation: NavigationItem[] = [
    { 
      id: 'dashboard', 
      label: 'Tableau de bord', 
      icon: Home, 
      active: activeView === 'dashboard',
      onClick: () => setActiveView('dashboard')
    },
    { 
      id: 'community', 
      label: 'Communauté', 
      icon: UsersIcon, 
      active: activeView === 'community',
      onClick: () => setActiveView('community')
    },
    { 
      id: 'profile', 
      label: 'Mon Profil', 
      icon: User, 
      active: activeView === 'profile',
      onClick: () => setActiveView('profile')
    },
    { 
      id: 'vr-scene', 
      label: 'S\'entraîner en VR', 
      icon: Headset, 
      active: activeView === 'vr-scene',
      className: 'mt-4 pt-4 border-t border-gray-700',
      onClick: () => setActiveView('vr-scene')
    },
    { 
      id: 'voice-analysis', 
      label: 'Analyse Vocale', 
      icon: Mic, 
      active: activeView === 'voice-analysis',
      onClick: () => setActiveView('voice-analysis')
    },
    { 
      id: 'recording-studio', 
      label: 'Recording Studio', 
      icon: Video, 
      active: activeView === 'recording-studio',
      onClick: () => setActiveView('recording-studio')
    },
    { 
      id: 'emotion-recognition', 
      label: 'Analyse des Émotions', 
      icon: Smile, 
      active: activeView === 'emotion-recognition',
      onClick: () => setActiveView('emotion-recognition')
    },
    { 
      id: 'vrcalibration', 
      label: 'VR Calibration', 
      icon: Eye, 
      active: activeView === 'vrcalibration',
      onClick: () => setActiveView('vrcalibration')
    },
  ];

  const modules: Module[] = [
    { id: 1, title: 'Module 1', subtitle: 'Fondamentaux', progress: 100, locked: false, current: false },
    { id: 2, title: 'Module 2', subtitle: 'Contrôle Vocal', progress: 100, locked: false, current: false },
    { id: 3, title: 'Module 3', subtitle: 'Structure du Pitch', progress: 100, locked: false, current: false },
    { id: 4, title: 'Module 4', subtitle: 'Storytelling', progress: 100, locked: false, current: false },
    { id: 5, title: 'Module 5', subtitle: 'Gestion du Stress', progress: 100, locked: false, current: false },
    { id: 6, title: 'Module 6', subtitle: 'Langage Corporel', progress: 60, locked: false, current: true },
    { id: 7, title: 'Module 7', subtitle: 'Techniques Avancées', progress: 0, locked: true, current: false },
    { id: 8, title: 'Module 8', subtitle: 'Questions Difficiles', progress: 0, locked: true, current: false },
  ];

  const recentActivities: Activity[] = [
    { type: 'module', title: 'Module 3 terminé', time: 'Il y a 2h', icon: Trophy },
    { type: 'practice', title: 'Session VR complétée', time: 'Il y a 4h', icon: Play },
    { type: 'achievement', title: 'Badge "Orateur Confiant"', time: 'Il y a 1j', icon: Target }
  ];

  const progressData = {
    overall: 65,
    modules: [
      { name: 'Fondamentaux', progress: 80, color: 'from-green-400 to-green-500' },
      { name: 'Techniques Avancées', progress: 45, color: 'from-blue-400 to-blue-500' },
      { name: 'VR Training', progress: 30, color: 'from-purple-400 to-purple-500' },
      { name: 'Présentation', progress: 90, color: 'from-yellow-400 to-yellow-500' }
    ]
  };

  const currentModule = modules.find(m => m.current) || modules[5];
  const overallProgress = Math.round(modules.reduce((acc, curr) => acc + curr.progress, 0) / modules.length);

  return (
    <div className="flex h-screen bg-gradient-to-br from-gray-900 via-blue-900 to-gray-900">
      {/* Sidebar */}
      <div className={`${isSidebarOpen ? 'w-64' : 'w-20'} bg-gray-900 text-white transition-all duration-300 ease-in-out flex flex-col`}>
        <div className="p-4 flex items-center justify-between border-b border-gray-800">
          {isSidebarOpen ? (
            <h1 className="text-xl font-bold text-yellow-400">Pitch to Me</h1>
          ) : (
            <div className="w-8 h-8 rounded-full bg-yellow-400 flex items-center justify-center">
              <span className="text-gray-900 font-bold">P</span>
            </div>
          )}
          <button 
            onClick={() => setIsSidebarOpen(!isSidebarOpen)}
            className="text-gray-400 hover:text-white"
          >
            {isSidebarOpen ? <X size={20} /> : <Menu size={20} />}
          </button>
        </div>

        {/* Profile */}
        <div className="p-4 flex items-center space-x-3 border-b border-gray-800">
          <div className="relative">
            <img 
              src="https://images.unsplash.com/photo-1472099645785-5658abf4ff4e?w=80&h=80&fit=crop&crop=face" 
              alt="Profile" 
              className="w-14 h-14 rounded-full border-2 border-yellow-400 object-cover"
            />
            <div className="absolute -bottom-1 -right-1 w-5 h-5 bg-green-400 rounded-full border-2 border-white"></div>
          </div>
          {isSidebarOpen && (
            <div>
              <div className="font-medium text-white">Alex Dupont</div>
              <div className="text-xs text-gray-400">Niveau 3</div>
            </div>
          )}
        </div>

        {/* Navigation */}
        <nav className="flex-1 overflow-y-auto py-4">
          <ul>
            {navigation.map((item) => (
              <li key={item.id}>
                <button 
                  onClick={(e) => {
                    e.preventDefault();
                    if (item.onClick) item.onClick();
                  }}
                  className={`w-full text-left flex items-center px-4 py-3 text-sm font-medium ${item.active ? 'bg-gray-800 text-yellow-400' : 'text-gray-300 hover:bg-gray-800 hover:text-white'}`}
                >
                  <item.icon className="w-5 h-5 mr-3" />
                  {isSidebarOpen && item.label}
                </button>
              </li>
            ))}
          </ul>
        </nav>

        {/* Footer */}
        {isSidebarOpen && (
          <div className="p-4 border-t border-gray-800 text-xs text-gray-400 mt-auto">
            <p>© 2024 Pitch to Me</p>
            <p className="mt-1">Tous droits réservés</p>
          </div>
        )}
      </div>

      {/* Main Content */}
      <div className="flex-1 flex flex-col overflow-hidden bg-transparent">
        {/* Top Navigation */}
        <header className="bg-gray-900 border-b border-gray-800 sticky top-0 z-10 py-2">
          <div className="flex items-center justify-between px-4 h-14">
            <div className="flex items-center">
              <motion.h1 
                initial={{ opacity: 0, x: -20 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ duration: 0.5 }}
                className="text-xl font-bold text-white"
              >
                {activeView === 'dashboard' && 'Tableau de Bord'}
                {activeView === 'profile' && 'Mon Profil'}
                {activeView === 'community' && 'Communauté'}
                {activeView === 'vr-scene' && 'S\'entraîner en VR'}
                {activeView === 'vr-session' && 'Session VR'}
                {activeView === 'voice-analysis' && 'Analyse Vocale'}
                {activeView === 'recording-studio' && 'Recording Studio'}
                {activeView === 'emotion-recognition' && 'Analyse des Émotions'}
                {activeView === 'vrcalibration' && 'VR Calibration'}
                {activeView === 'module' && `Module ${selectedModuleId}`}
              </motion.h1>
            </div>
            <div className="flex items-center space-x-6">
              <button className="p-1.5 rounded-full text-gray-500 hover:text-gray-700 hover:bg-gray-100 transition-colors relative">
                <Bell size={20} />
                <span className="absolute top-0 right-0 w-2 h-2 bg-red-500 rounded-full"></span>
              </button>
              <div className="flex items-center space-x-3">
                <div className="relative">
                  <img 
                    src="https://images.unsplash.com/photo-1472099645785-5658abf4ff4e?w=80&h=80&fit=crop&crop=face" 
                    alt="Profile" 
                    className="w-8 h-8 rounded-full border-2 border-yellow-400 object-cover"
                  />
                  <div className="absolute -bottom-1 -right-1 w-2.5 h-2.5 bg-green-400 rounded-full border-2 border-white"></div>
                </div>
                <span className="hidden md:inline text-sm font-medium text-white">Alex Dupont</span>
                <ChevronDown className="w-4 h-4 text-gray-300" />
              </div>
            </div>
          </div>
        </header>

        {/* Main Content Area */}
        <main className="flex-1 overflow-y-auto p-4 md:p-6">
          {activeView === 'profile' ? (
            <LearnerProfile onBack={() => setActiveView('dashboard')} />
          ) : activeView === 'community' ? (
            <Community />
          ) : activeView === 'vrcalibration' ? (
            <VRCalibration />
          ) : activeView === 'module' ? (
            <ModuleView 
              moduleId={selectedModuleId} 
              onBack={() => setActiveView('dashboard')} 
            />
          ) : activeView === 'vr-scene' ? (
            <VRSceneView 
              onSceneSelect={(sceneId) => {
                setSelectedVRScene(sceneId);
                setActiveView('vr-session');
              }}
              onBack={() => setActiveView('dashboard')} 
            />
          ) : activeView === 'vr-session' ? (
            <VRSessionView 
              onExit={() => setActiveView('vr-scene')}
              onBack={() => setActiveView('vr-scene')} 
            />
          ) : activeView === 'voice-analysis' ? (
            <VoiceAnalysisView 
              onBack={() => setActiveView('dashboard')} 
            />
          ) : activeView === 'recording-studio' ? (
            <RecordingStudioView 
              onBack={() => setActiveView('dashboard')} 
            />
          ) : activeView === 'emotion-recognition' ? (
            <EmotionRecognitionView 
              onBack={() => setActiveView('dashboard')} 
            />
          ) : (
            <>
          <motion.div 
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5, delay: 0.1 }}
            className="bg-gray-800/80 backdrop-blur-sm rounded-xl shadow-lg p-6 mb-6 border border-gray-700 hover:shadow-xl transition-all"
          >
            <h2 className="text-xl font-semibold text-white mb-2">Bon retour, Alex !</h2>
            <p className="text-gray-300 mb-6">Continuez votre apprentissage l o vous vous tes arrt.</p>
            
            {/* Progress Overview */}
            <div className="bg-gradient-to-r from-gray-800 to-gray-700 rounded-xl p-6 text-white mb-6 shadow-lg hover:shadow-xl transition-shadow border border-gray-700">
              <div className="flex flex-col md:flex-row md:items-center md:justify-between">
                <div className="mb-4 md:mb-0">
                  <h3 className="text-lg font-semibold mb-1">Progression Globale</h3>
                  <div className="text-gray-300 text-sm">{modules.filter(m => !m.locked).length} sur {modules.length} modules complts</div>
                </div>
                <div className="flex items-center">
                  <ProgressRing progress={overallProgress} size={80} stroke={6} />
                  <div className="ml-6">
                    <div className="text-3xl font-bold">{overallProgress}%</div>
                    <div className="w-32 bg-gray-700/50 rounded-full h-2 mt-2 overflow-hidden">
                      <div 
                        className="bg-gradient-to-r from-yellow-400 to-yellow-500 h-2 rounded-full" 
                        style={{ width: `${overallProgress}%` }}
                      ></div>
                    </div>
                  </div>
                </div>
              </div>
            </div>

            {/* Current Module Card */}
            <div className="mb-6">
              <button 
                onClick={() => {
                  setSelectedModuleId('6');
                  setActiveView('module');
                }}
                className="block w-full text-left"
              >
                <div className="bg-gradient-to-r from-yellow-500 to-yellow-600 rounded-xl p-6 shadow-lg hover:shadow-xl transition-all transform hover:-translate-y-0.5 border border-yellow-400/30">
                  <div className="flex flex-col">
                    <div className="flex-1">
                      <h3 className="text-xl font-bold text-gray-900 mb-1">Continuer l'apprentissage</h3>
                      <h4 className="text-gray-900 font-semibold">{currentModule.title}: {currentModule.subtitle}</h4>
                      <p className="text-gray-800 text-sm mt-1">Maitrisez la communication non verbale</p>
                    </div>
                    <div className="mt-4 flex justify-between items-center">
                      <span className="text-xs bg-black/10 text-gray-900 px-2 py-1 rounded-full">En cours</span>
                      <div className="bg-black/10 hover:bg-black/20 text-gray-900 font-medium px-4 py-2 rounded-lg transition-colors">
                        Continuer
                      </div>
                    </div>
                  </div>
                </div>
              </button>
            </div>
            
            {/* Module Progress */}
            <div className="mt-6">
              <div className="flex justify-between items-center mb-4">
                <h3 className="text-lg font-semibold text-white">Progression du module</h3>
                <span className="text-sm text-gray-300">{currentModule.progress}% complété</span>
              </div>
              <div className="w-full bg-gray-700/50 rounded-full h-2.5 overflow-hidden">
                <div 
                  className="bg-gradient-to-r from-yellow-400 to-yellow-500 h-full rounded-full" 
                  style={{ width: `${currentModule.progress}%` }}
                />
              </div>
              
              <div className="mt-6 flex justify-end">
                <button 
                  className="bg-gradient-to-r from-yellow-500 to-yellow-600 hover:from-yellow-400 hover:to-yellow-500 text-white font-medium px-6 py-2.5 rounded-lg transition-all hover:shadow-lg transform hover:-translate-y-0.5 active:translate-y-0 flex items-center"
                >
                  <Play className="w-4 h-4 mr-2" />
                  Continuer le Module
                </button>
              </div>
            </div>

            {/* Modules Grid */}
            <div>
              <h3 className="text-lg font-semibold text-white mb-4">Tous les Modules</h3>
              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
                {modules.map((module) => (
                  <motion.div 
                    whileHover={{ scale: 1.05 }}
                    whileTap={{ scale: 0.95 }}
                    key={module.id}
                    className={`p-3 rounded-lg border transition-all ${
                      module.current 
                        ? 'border-yellow-600 bg-yellow-800/30' 
                        : module.locked 
                          ? 'border-gray-600 bg-gray-800/30 opacity-50' 
                          : 'border-green-600 bg-green-800/30'
                    } ${!module.locked ? 'transform hover:-translate-y-1' : ''}`}
                  >
                    <div className="flex items-start justify-between">
                      <div>
                        <div 
                          className={`w-8 h-8 rounded-lg flex items-center justify-center mb-2 ${
                            module.locked 
                              ? 'bg-gray-600 text-gray-400' 
                              : module.current 
                                ? 'bg-yellow-400 text-black'
                                : 'bg-green-400 text-black'
                          }`}
                        >
                          {module.locked ? (
                            <Lock className="w-5 h-5" />
                          ) : module.current ? (
                            <Play className="w-5 h-5" />
                          ) : (
                            <Check className="w-5 h-5" />
                          )}
                        </div>
                        <h4 className="font-medium text-white text-sm">{module.title}</h4>
                        <p className="text-xs text-gray-300">{module.subtitle}</p>
                      </div>
                      {!module.locked && (
                        <div className="text-xs font-medium text-gray-500">
                          {module.progress}%
                        </div>
                      )}
                    </div>
                    {!module.locked && (
                      <div className="mt-2 w-full bg-gray-700 rounded-full h-1">
                        <div 
                          className={`h-1 rounded-full ${
                            module.current 
                              ? 'bg-yellow-400' 
                              : 'bg-green-400'
                          }`} 
                          style={{ width: `${module.progress}%` }}
                        ></div>
                      </div>
                    )}
                  </motion.div>
                ))}
              </div>
            </div>
          </motion.div>

          {/* Stats & Activities */}
          <motion.div 
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5, delay: 0.2 }}
            className="grid grid-cols-1 lg:grid-cols-3 gap-6"
          >
            {/* Stats Card */}
            <div className="bg-gray-800/80 backdrop-blur-sm rounded-xl shadow-sm p-6 border border-gray-700">
              <h3 className="font-semibold text-white mb-4">Statistiques</h3>
              <div className="space-y-4">
                {progressData.modules.map((item, index) => (
                  <div key={index}>
                    <div className="flex justify-between text-sm mb-1">
                      <span className="text-gray-300">{item.name}</span>
                      <span className="font-medium">{item.progress}%</span>
                    </div>
                    <div className="w-full bg-gray-200 rounded-full h-2">
                      <div 
                        className={`h-2 rounded-full bg-gradient-to-r ${item.color}`}
                        style={{ width: `${item.progress}%` }}
                      ></div>
                    </div>
                  </div>
                ))}
              </div>
            </div>

            {/* Recent Activities */}
            <div className="lg:col-span-2 bg-gray-800/80 backdrop-blur-sm rounded-xl shadow-sm p-6 border border-gray-700">
              <h3 className="font-semibold text-white mb-4">Activités Récentes</h3>
              <div className="space-y-4">
                {recentActivities.map((activity, index) => (
                  <div key={index} className="flex items-start space-x-3">
                    <div className={`p-2 rounded-lg ${
                      activity.type === 'module' 
                        ? 'bg-blue-100 text-blue-600' 
                        : activity.type === 'practice'
                          ? 'bg-purple-100 text-purple-600'
                          : 'bg-yellow-100 text-yellow-600'
                    }`}>
                      <activity.icon className="w-5 h-5" />
                    </div>
                    <div className="flex-1">
                      <p className="text-sm font-medium text-white">{activity.title}</p>
                      <p className="text-xs text-gray-500">{activity.time}</p>
                    </div>
                    <button className="text-gray-400 hover:text-gray-600">
                      <ChevronRight className="w-4 h-4" />
                    </button>
                  </div>
                ))}
                <button 
                  className="w-full mt-4 text-sm font-medium text-yellow-400 hover:text-yellow-300 flex items-center justify-center transition-all hover:scale-105 active:scale-95"
                >
                  Voir toutes les activités <ArrowRight className="w-4 h-4 ml-1" />
                </button>
              </div>
            </div>
              </motion.div>
            </>
          )}
        </main>
      </div>
    </div>
  );
}
