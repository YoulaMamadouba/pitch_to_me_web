'use client';

import { useState, useEffect, useRef } from 'react';
import { useAuth } from '@/contexts/AuthContext';
import Image from 'next/image';
import Link from 'next/link';
import { motion, AnimatePresence } from 'framer-motion';
import { 
  Home, 
  Users, 
  User,
  Settings,
  Bell,
  Menu,
  X,
  ChevronDown,
  ChevronRight,
  MessageSquare,
  BarChart2,
  Calendar,
  FileText,
  Video,
  Award,
  HelpCircle,
  LogOut,
  Play,
  Check,
  Star,
  Clock,
  Activity,
  Target,
  Zap,
  BarChart3,
  FileBarChart2,
  FileSearch,
  MessageSquarePlus,
  Plus
} from 'lucide-react';
import SidebarModulesMenu from '@/components/dashboard/SidebarModulesMenu';
import SidebarB2BMenu from '@/components/dashboard-coach/SidebarB2BMenu';
import SidebarB2CMenu from '@/components/dashboard-coach/SidebarB2CMenu';
import DomainsList from '@/components/dashboard/DomainsList';
import ModulesList from '@/components/dashboard/ModulesList';
import ModuleForm from '@/components/dashboard/ModuleForm';
import CompanyList from '@/components/dashboard-coach/CompanyList';
import StudentList from '@/components/dashboard-coach/StudentList';
import { useModules } from '@/contexts/ModulesContext';
import { useStudents } from '@/contexts/StudentsContext';
import { Module } from '@/components/dashboard/ModuleCard';
import { StudentData } from '@/lib/studentService';
import { getCompaniesCount } from '@/lib/companyService';
import RecordingStudioView from '@/components/dashboard/RecordingStudioView';
import AnalyticsView from '@/components/dashboard-coach/analytics/AnalyticsView';
import MessagesView from '@/components/dashboard-coach/messages/MessagesView';
import ResourcesView from '@/components/dashboard-coach/resources/ResourcesView';
import SettingsView from '@/components/dashboard-coach/settings/SettingsView';
import dynamic from 'next/dynamic';

// Chargement dynamique pour éviter les problèmes de SSR
const SessionsList = dynamic(() => import('@/components/dashboard-coach/SessionsList'), {
  ssr: false,
  loading: () => (
    <div className="flex items-center justify-center h-64">
      <div className="animate-spin rounded-full h-8 w-8 border-t-2 border-b-2 border-yellow-500"></div>
    </div>
  ),
});

// Types
type NavigationItem = {
  id: string;
  label: string;
  icon: React.ComponentType<{ className?: string }>;
  active?: boolean;
  count?: number;
};

type StudentActivity = {
  id: number;
  name: string;
  avatar: string;
  action: string;
  time: string;
  module?: string;
  progress?: number;
  status?: 'completed' | 'pending' | 'feedback';
  rating?: number;
};

type MetricCardProps = {
  icon: React.ComponentType<{ className?: string }>;
  value: string | number;
  label: string;
  change: string;
  changeType: 'positive' | 'negative' | 'neutral';
  iconBg: string;
};

// Components
const MetricCard = ({ icon: Icon, value, label, change, changeType, iconBg }: MetricCardProps) => {
  return (
    <motion.div 
      whileHover={{ y: -2, boxShadow: '0 10px 25px -5px rgba(0, 0, 0, 0.1)' }}
      className="bg-gray-800/50 backdrop-blur-sm rounded-xl p-4 border border-gray-700/50 hover:border-yellow-400/30 transition-all"
    >
      <div className="flex items-center justify-between mb-3">
        <div className={`w-10 h-10 rounded-lg flex items-center justify-center ${iconBg}`}>
          <Icon className="w-5 h-5 text-white" />
        </div>
        <span className={`text-xs font-medium px-2 py-0.5 rounded-full ${
          changeType === 'positive' ? 'bg-green-900/50 text-green-400' : 
          changeType === 'negative' ? 'bg-red-900/50 text-red-400' : 
          'bg-blue-900/50 text-blue-400'
        }`}>
          {change}
        </span>
      </div>
      <div className="text-2xl font-bold text-white mb-1">{value}</div>
      <div className="text-gray-400 text-sm">{label}</div>
    </motion.div>
  );
};

const ActivityCard = ({ activity }: { activity: StudentActivity }) => {
  return (
    <motion.div 
      initial={{ opacity: 0, y: 10 }}
      animate={{ opacity: 1, y: 0 }}
      className="bg-gray-800/50 backdrop-blur-sm rounded-xl p-3 border border-gray-700/50 hover:border-yellow-400/30 transition-all"
    >
      <div className="flex items-start space-x-3">
        <div className="relative">
          <Image 
            src={activity.avatar} 
            alt={activity.name} 
            width={40} 
            height={40}
            className="w-10 h-10 rounded-full border-2 border-yellow-400/30 object-cover"
          />
          {activity.status === 'completed' && (
            <div className="absolute -bottom-1 -right-1 w-3 h-3 bg-green-400 rounded-full border-2 border-gray-800"></div>
          )}
        </div>
        
        <div className="flex-1 min-w-0">
          <div className="flex items-center justify-between">
            <h4 className="text-white font-medium text-sm">{activity.name}</h4>
            <span className="text-gray-500 text-xs">{activity.time}</span>
          </div>
          <p className="text-gray-400 text-sm">{activity.action} {activity.module && <span className="text-yellow-400">{activity.module}</span>}</p>
          
          {activity.progress !== undefined && (
            <div className="mt-2 flex items-center">
              <div className="w-full bg-gray-700 rounded-full h-1.5">
                <div 
                  className="bg-yellow-400 h-1.5 rounded-full" 
                  style={{ width: `${activity.progress}%` }}
                ></div>
              </div>
              <span className="ml-2 text-xs text-yellow-400 font-medium">{activity.progress}%</span>
            </div>
          )}
          
          {activity.rating !== undefined && (
            <div className="flex items-center mt-1">
              {[...Array(5)].map((_, i) => (
                <Star 
                  key={i} 
                  className={`w-3 h-3 ${i < activity.rating! ? 'text-yellow-400 fill-yellow-400' : 'text-gray-600'}`} 
                />
              ))}
            </div>
          )}
          
          {activity.status === 'pending' && (
            <div className="mt-2">
              <button className="text-xs bg-yellow-500 hover:bg-yellow-600 text-black font-medium px-3 py-1 rounded-full transition-colors">
                Review
              </button>
            </div>
          )}
        </div>
      </div>
    </motion.div>
  );
};

const QuickActionButton = ({ 
  icon: Icon, 
  label, 
  color = 'yellow',
  onClick 
}: { 
  icon: React.ComponentType<{ className?: string }>;
  label: string;
  color?: 'yellow' | 'blue' | 'purple' | 'gray';
  onClick: () => void;
}) => {
  const colorClasses = {
    yellow: 'from-yellow-400 to-yellow-500 text-black',
    blue: 'from-blue-400 to-blue-500 text-black',
    purple: 'from-purple-400 to-purple-500 text-black',
    gray: 'from-gray-700 to-gray-800 text-white border border-gray-600/50'
  };
  
  return (
    <motion.button
      whileTap={{ scale: 0.98 }}
      onClick={onClick}
      className={`w-full bg-gradient-to-r ${colorClasses[color]} rounded-xl p-3 font-medium text-sm flex flex-col items-center space-y-1`}
    >
      <Icon className="w-5 h-5" />
      <span>{label}</span>
    </motion.button>
  );
};

// Main Component
const CoachDashboard = () => {
  const [mounted, setMounted] = useState(false);
  const [isSidebarOpen, setIsSidebarOpen] = useState(true);
  const [activeTab, setActiveTab] = useState('dashboard');
  const [unreadNotifications, setUnreadNotifications] = useState(3);
  const [isProfileDropdownOpen, setIsProfileDropdownOpen] = useState(false);
  const profileDropdownRef = useRef<HTMLDivElement>(null);
  const { user, signOut } = useAuth();

  // Fermer le menu déroulant quand on clique en dehors
  useEffect(() => {
    function handleClickOutside(event: MouseEvent) {
      if (profileDropdownRef.current && !profileDropdownRef.current.contains(event.target as Node)) {
        setIsProfileDropdownOpen(false);
      }
    }
    // Ajouter l'écouteur d'événement
    document.addEventListener('mousedown', handleClickOutside);
    return () => {
      // Nettoyer l'écouteur d'événement
      document.removeEventListener('mousedown', handleClickOutside);
    };
  }, []);
  
  // Modules state
  const [activeModuleType, setActiveModuleType] = useState<'b2b' | 'b2c' | null>(null);
  const [selectedDomain, setSelectedDomain] = useState<any>(null);
  const [isModuleFormOpen, setIsModuleFormOpen] = useState(false);
  const [editingModule, setEditingModule] = useState<Module | null>(null);
  
  const { modules, addModule, updateModule, deleteModule, getModulesByDomain } = useModules();
  const { students, loading, error, refreshStudents } = useStudents();
  const [companiesCount, setCompaniesCount] = useState(0);

  useEffect(() => {
    setMounted(true);
  }, []);

  // Charger le nombre d'entreprises
  useEffect(() => {
    const loadCompaniesCount = async () => {
      try {
        const count = await getCompaniesCount();
        setCompaniesCount(count);
      } catch (error) {
        console.error('Erreur lors du chargement du nombre d\'entreprises:', error);
      }
    };

    loadCompaniesCount();
  }, []);

  // Recording Studio (header-controlled) state
  const [isRecording, setIsRecording] = useState(false);
  const [isPaused, setIsPaused] = useState(false);
  const [recordingTime, setRecordingTime] = useState(0);
  const recordingTimerRef = useRef<ReturnType<typeof setInterval> | null>(null);

  const startTimer = () => {
    if (recordingTimerRef.current) return;
    recordingTimerRef.current = setInterval(() => {
      setRecordingTime((t) => t + 1);
    }, 1000);
  };

  const stopTimer = () => {
    if (recordingTimerRef.current) {
      clearInterval(recordingTimerRef.current);
      recordingTimerRef.current = null;
    }
  };

  const handleToggleRecording = () => {
    if (isRecording) {
      // Stop
      setIsRecording(false);
      setIsPaused(false);
      stopTimer();
      setRecordingTime(0);
    } else {
      // Start
      setIsRecording(true);
      setIsPaused(false);
      startTimer();
    }
  };

  const handleTogglePause = () => {
    if (!isRecording) return;
    if (isPaused) {
      // Resume
      setIsPaused(false);
      startTimer();
    } else {
      // Pause
      setIsPaused(true);
      stopTimer();
    }
  };

  // Cleanup timer on unmount
  useEffect(() => {
    return () => {
      stopTimer();
    };
  }, []);

  // Navigation items
  const navigation: NavigationItem[] = [
    { id: 'dashboard', label: 'Dashboard', icon: Home, active: activeTab === 'dashboard' },
    { id: 'sessions', label: 'Sessions', icon: Video, active: activeTab === 'sessions', count: 5 },
    { id: 'recording-studio', label: 'Recording Studio', icon: Video, active: activeTab === 'recording-studio' },
    { id: 'analytics', label: 'Analytics', icon: BarChart2, active: activeTab === 'analytics' },
    { id: 'messages', label: 'Messages', icon: MessageSquare, active: activeTab === 'messages', count: 3 },
    { id: 'resources', label: 'Resources', icon: FileText, active: activeTab === 'resources' },
    { id: 'settings', label: 'Settings', icon: Settings, active: activeTab === 'settings' },
  ];

  // Gestion du clic sur une session
  const handleSessionClick = (sessionId: string) => {
    console.log('Session sélectionnée:', sessionId);
    // Ici, vous pouvez ajouter la logique pour afficher les détails de la session
  };

  // Gestion de la création d'une nouvelle session
  const handleNewSession = () => {
    console.log('Nouvelle session demandée');
    // Ici, vous pouvez ajouter la logique pour créer une nouvelle session
  };



  // Sample data
  const recentActivities: StudentActivity[] = [
    {
      id: 1,
      name: 'Sophie Ndiaye',
      avatar: 'https://images.unsplash.com/photo-1573496359142-b8d87734a5a2?w=200&h=200&fit=crop&crop=faces&q=80',
      action: 'Completed',
      module: 'Module 6: Body Language',
      time: '2 min ago',
      status: 'completed',
      progress: 85
    },
    {
      id: 2,
      name: 'Aïssatou Diallo',
      avatar: 'https://images.unsplash.com/photo-1580489944761-15a19d654956?w=200&h=200&fit=crop&crop=faces&q=80',
      action: 'Requested VR coaching session',
      time: '5 min ago',
      status: 'pending'
    },
    {
      id: 3,
      name: 'Fatoumata Bâ',
      avatar: 'https://images.unsplash.com/photo-1573497019940-1c28c88b4f3e?w=200&h=200&fit=crop&crop=faces&q=80',
      action: 'Left feedback on',
      module: 'Module 8',
      time: '12 min ago',
      status: 'feedback',
      rating: 5
    }
  ];

  const upcomingSessions = [
    { id: 1, title: 'VR Coaching', student: 'Alex M.', module: 'TEDx Module', time: 'In 15 min', status: 'live' },
    { id: 2, title: 'Pitch Review', student: 'Maria G.', module: 'Startup Pitch', time: '2:30 PM', status: 'upcoming' },
    { id: 3, title: 'Group Session', student: 'Team Alpha', module: 'Presentation Skills', time: '4:00 PM', status: 'upcoming' }
  ];

  // Module handlers
  const handleModuleTypeSelect = (type: 'b2b' | 'b2c') => {
    setActiveModuleType(type);
    setSelectedDomain(null);
    setActiveTab('modules');
  };

  const handleDomainSelect = (domain: any) => {
    setSelectedDomain(domain);
  };

  const handleBackToDomains = () => {
    setSelectedDomain(null);
  };

  const handleCreateModule = () => {
    setEditingModule(null);
    setIsModuleFormOpen(true);
  };

  const handleEditModule = (module: Module) => {
    setEditingModule(module);
    setIsModuleFormOpen(true);
  };

  const handleDeleteModule = (moduleId: string) => {
    if (confirm('Êtes-vous sûr de vouloir supprimer ce module ?')) {
      deleteModule(moduleId);
    }
  };

  const handleViewModule = (module: Module) => {
    console.log('View module:', module);
  };

  const handleModuleSubmit = async (moduleData: Partial<Module>) => {
    if (editingModule) {
      updateModule(editingModule.id, moduleData);
    } else {
      const newModule: Module = {
        id: Date.now().toString(),
        title: moduleData.title || '',
        description: moduleData.description || '',
        videoUrl: moduleData.videoUrl || '',
        theme: moduleData.theme || '',
        domain: moduleData.domain || '',
        offerType: moduleData.offerType || '',
        activityDomain: moduleData.activityDomain || '',
        difficulty: moduleData.difficulty || 'intermediate',
        duration: moduleData.duration || 30,
        tags: moduleData.tags || [],
        rating: 0,
        studentsCount: 0,
        createdAt: new Date().toISOString().split('T')[0]
      };
      addModule(newModule);
    }
  };



  // Student handlers
  const handleViewStudent = (student: StudentData) => {
    console.log('View student:', student);
  };

  // Navigation handlers
  const handleB2BNavigation = () => {
    setActiveTab('companies');
    setActiveModuleType(null);
    setSelectedDomain(null);
  };

  const handleB2CNavigation = () => {
    setActiveTab('students');
    setActiveModuleType(null);
    setSelectedDomain(null);
  };

  const getCurrentView = () => {
    if (activeTab === 'modules' && activeModuleType) {
      if (selectedDomain && selectedDomain.name) {
        return (
          <ModulesList
            domain={selectedDomain}
            modules={[] as any[]} // TODO: Passer les vrais modules
            onBack={handleBackToDomains}
            onCreateModule={handleCreateModule}
            onEditModule={() => {}}
            onDeleteModule={() => {}}
            onViewModule={() => {}}
          />
        );
      } else {
        return (
          <DomainsList
            moduleType={activeModuleType}
            onDomainSelect={handleDomainSelect}
            onCreateModule={handleCreateModule}
          />
        );
      }
    }

    if (activeTab === 'companies') {
      return (
        <CompanyList />
      );
    }

    if (activeTab === 'students') {
      return (
        <StudentList
          students={students}
          loading={loading}
          error={error}
          onViewStudent={handleViewStudent}
          onRefresh={refreshStudents}
        />
      );
    }

    if (activeTab === 'recording-studio') {
      return (
        <RecordingStudioView 
          onBack={() => setActiveTab('dashboard')}
          showChrome={false}
          isRecording={isRecording}
          isPaused={isPaused}
          recordingTime={recordingTime}
          onToggleRecording={handleToggleRecording}
          onTogglePause={handleTogglePause}
        />
      );
    }

    if (activeTab === 'resources') {
      return (
        <ResourcesView />
      );
    }

    if (activeTab === 'messages') {
      return (
        <MessagesView />
      );
    }

    if (activeTab === 'analytics') {
      return (
        <AnalyticsView />
      );
    }

    if (activeTab === 'sessions') {
      return (
        <SessionsList 
          onSessionClick={handleSessionClick}
          onNewSession={handleNewSession}
        />
      );
    }

    if (activeTab === 'settings') {
      return (
        <SettingsView />
      );
    }

    // Default dashboard view
    return (
      <>
          {/* Welcome Section */}
          <motion.div 
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5 }}
            className="mb-6"
          >
            <h2 className="text-2xl md:text-3xl font-bold text-white mb-1">Welcome back, Mawa!</h2>
            <p className="text-gray-400">Here's what's happening with your coaching today</p>
          </motion.div>

          {/* Live Session Alert */}
          <motion.div 
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5, delay: 0.1 }}
            className="relative overflow-hidden rounded-xl bg-gradient-to-r from-green-900/50 to-green-800/30 border border-green-500/30 p-4 mb-6"
          >
            <div className="absolute top-0 left-0 w-full h-full bg-gradient-to-r from-green-500/5 to-transparent opacity-30"></div>
            <div className="relative z-10">
              <div className="flex flex-col md:flex-row md:items-center md:justify-between">
                <div className="flex items-center space-x-3 mb-3 md:mb-0">
                  <div className="flex-shrink-0">
                    <div className="w-10 h-10 rounded-full bg-green-500/20 flex items-center justify-center">
                      <div className="w-2 h-2 bg-green-400 rounded-full animate-pulse"></div>
                    </div>
                  </div>
                  <div>
                    <h3 className="text-green-400 font-semibold">Live Session Active</h3>
                    <p className="text-gray-300 text-sm">VR Coaching - Alex M. (TEDx Module)</p>
                  </div>
                </div>
                <button className="bg-green-500 hover:bg-green-600 text-black font-medium px-4 py-2 rounded-lg transition-colors w-full md:w-auto">
                  Join Session
                </button>
              </div>
            </div>
          </motion.div>

          {/* Key Metrics */}
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 mb-6">
            <MetricCard 
              icon={Users} 
              value="247" 
              label="Active Students" 
              change="+12%" 
              changeType="positive"
              iconBg="bg-blue-600"
            />
            <MetricCard 
              icon={Check} 
              value="89%" 
              label="Completion Rate" 
              change="+8%" 
              changeType="positive"
              iconBg="bg-green-600"
            />
            <MetricCard 
              icon={Star} 
              value="4.8" 
              label="Avg. Rating" 
              change="4.9" 
              changeType="neutral"
              iconBg="bg-yellow-600"
            />
            <MetricCard 
              icon={Video} 
              value="12" 
              label="VR Sessions" 
              change="Live" 
              changeType="positive"
              iconBg="bg-purple-600"
            />
          </div>

          <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
            {/* Recent Activities */}
            <div className="lg:col-span-2">
              <div className="flex items-center justify-between mb-4">
                <h3 className="text-lg font-semibold text-white">Recent Activities</h3>
                <button className="text-sm text-yellow-400 hover:text-yellow-300 flex items-center">
                  View All <ChevronRight className="w-4 h-4 ml-1" />
                </button>
              </div>
              
              <div className="space-y-3">
                <AnimatePresence>
                  {recentActivities.map((activity) => (
                    <ActivityCard key={activity.id} activity={activity} />
                  ))}
                </AnimatePresence>
              </div>
            </div>

            {/* Upcoming Sessions & Quick Actions */}
            <div className="space-y-6">
              {/* Upcoming Sessions */}
              <div>
                <div className="flex items-center justify-between mb-4">
                  <h3 className="text-lg font-semibold text-white">Upcoming Sessions</h3>
                  <button className="text-sm text-yellow-400 hover:text-yellow-300">
                    View All
                  </button>
                </div>
                
                <div className="space-y-3">
                  {upcomingSessions.map((session, index) => (
                    <motion.div 
                      key={session.id}
                      initial={{ opacity: 0, y: 10 }}
                      animate={{ opacity: 1, y: 0 }}
                      transition={{ delay: index * 0.1 }}
                      className="bg-gray-800/50 backdrop-blur-sm rounded-xl p-4 border border-gray-700/50 hover:border-yellow-400/30 transition-all"
                    >
                      <div className="flex items-start">
                        <div className="flex-shrink-0 w-10 h-10 rounded-lg bg-yellow-500/10 flex items-center justify-center mr-3">
                          <Video className="w-5 h-5 text-yellow-400" />
                        </div>
                        <div className="flex-1 min-w-0">
                          <div className="flex items-center justify-between">
                            <h4 className="text-white font-medium">{session.title}</h4>
                            <span className={`text-xs px-2 py-0.5 rounded-full ${
                              session.status === 'live' 
                                ? 'bg-green-900/50 text-green-400' 
                                : 'bg-blue-900/50 text-blue-400'
                            }`}>
                              {session.status === 'live' ? 'Live' : session.time}
                            </span>
                          </div>
                          <p className="text-sm text-gray-400">{session.student} • {session.module}</p>
                        </div>
                      </div>
                    </motion.div>
                  ))}
                </div>
              </div>

              {/* Quick Actions */}
              <div>
                <h3 className="text-lg font-semibold text-white mb-4">Quick Actions</h3>
                <div className="grid grid-cols-2 gap-3">
                  <QuickActionButton 
                    icon={Video} 
                    label="Start Live" 
                    color="yellow"
                    onClick={() => {}}
                  />
                  <QuickActionButton 
                    icon={BarChart3} 
                    label="Analytics" 
                    color="blue"
                    onClick={() => {}}
                  />
                  <QuickActionButton 
                    icon={FileText} 
                    label="Create Content" 
                    color="purple"
                    onClick={() => {}}
                  />
                  <QuickActionButton 
                    icon={Users} 
                    label="Students" 
                    color="gray"
                    onClick={() => {}}
                  />
                </div>
              </div>
            </div>
          </div>
      </>
    );
  };

  if (!mounted) return null;

  return (
    <div className="flex min-h-screen bg-gradient-to-br from-gray-900 via-blue-900 to-gray-900 text-white">
      {/* Sidebar */}
      <motion.div 
        initial={{ x: -300, opacity: 0 }}
        animate={{ x: isSidebarOpen ? 0 : -300, opacity: isSidebarOpen ? 1 : 0.5 }}
        transition={{ type: 'spring', stiffness: 300, damping: 30 }}
        className={`fixed inset-y-0 left-0 z-50 w-64 bg-gray-900/95 backdrop-blur-md border-r border-gray-800/50 flex flex-col ${isSidebarOpen ? 'translate-x-0' : '-translate-x-full'}`}
      >
        {/* Logo */}
        <div className="p-4 border-b border-gray-800 flex items-center justify-between">
          <div className="flex items-center space-x-2">
            <div className="w-8 h-8 rounded-lg bg-yellow-400 flex items-center justify-center">
              <span className="text-black font-bold text-lg">P</span>
            </div>
            <h1 className="text-xl font-bold text-yellow-400">Pitch to Me</h1>
          </div>
          <button 
            onClick={() => setIsSidebarOpen(false)}
            className="text-gray-400 hover:text-white p-1 rounded-full hover:bg-gray-800"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Profile */}
        <div className="p-4 border-b border-gray-800">
          <div className="flex items-center space-x-3">
            <div className="relative">
              <Image 
                src="https://i.pravatar.cc/150?u=coach1" 
                alt="Mawa SIMBA" 
                width={48} 
                height={48}
                className="w-12 h-12 rounded-full border-2 border-yellow-400 object-cover"
              />
              <div className="absolute bottom-0 right-0 w-3 h-3 bg-green-400 rounded-full border-2 border-gray-900"></div>
            </div>
            <div>
              <div className="font-medium text-white">Mawa SIMBA</div>
              <div className="text-xs text-yellow-400 font-medium">Expert Coach</div>
            </div>
          </div>
        </div>

        {/* Navigation */}
        <nav className="flex-1 overflow-y-auto py-4 px-2">
          <ul className="space-y-1">
            {navigation.map((item) => (
              <li key={item.id}>
                <button
                  onClick={() => setActiveTab(item.id)}
                  className={`w-full flex items-center justify-between px-4 py-3 text-sm font-medium rounded-lg transition-colors ${
                    item.active 
                      ? 'bg-yellow-500/10 text-yellow-400' 
                      : 'text-gray-300 hover:bg-gray-800/50 hover:text-white'
                  }`}
                >
                  <div className="flex items-center">
                    <item.icon className="w-5 h-5 mr-3" />
                    <span>{item.label}</span>
                  </div>
                  {item.count && item.count > 0 && (
                    <span className="bg-yellow-500 text-black text-xs font-bold px-2 py-0.5 rounded-full">
                      {item.count}
                    </span>
                  )}
                </button>
              </li>
            ))}
            
            {/* B2B Menu */}
            <li>
              <SidebarB2BMenu
                isActive={activeTab === 'companies'}
                onClick={handleB2BNavigation}
                count={companiesCount}
              />
            </li>

            {/* B2C Menu */}
            <li>
              <SidebarB2CMenu
                isActive={activeTab === 'students'}
                onClick={handleB2CNavigation}
                count={students.length}
              />
            </li>
            
            {/* Modules Menu */}
            <li>
              <SidebarModulesMenu
                onModuleTypeSelect={handleModuleTypeSelect}
                activeModuleType={activeModuleType || undefined}
              />
            </li>
          </ul>
        </nav>

        {/* Footer */}
        <div className="p-4 border-t border-gray-800 mt-auto">
          <div className="bg-yellow-500/10 border border-yellow-500/30 rounded-lg p-3 text-center mb-3">
            <div className="text-yellow-400 mb-1">
              <Award className="w-5 h-5 mx-auto" />
            </div>
            <p className="text-xs text-yellow-400 font-medium">Coach of the Month</p>
            <p className="text-xs text-yellow-300">97% satisfaction</p>
          </div>
          
          <div className="flex items-center justify-between text-xs text-gray-500">
            <button className="flex items-center hover:text-yellow-400 transition-colors">
              <HelpCircle className="w-4 h-4 mr-1" />
              <span>Help</span>
            </button>
            <button className="flex items-center hover:text-yellow-400 transition-colors">
              <LogOut className="w-4 h-4 mr-1" />
              <span>Logout</span>
            </button>
          </div>
        </div>
      </motion.div>

      {/* Main Content */}
      <div className={`flex-1 flex flex-col transition-all duration-300 ${isSidebarOpen ? 'md:ml-64' : 'md:ml-0'}`}>
        {/* Top Navigation */}
        <header className="bg-gray-900/95 backdrop-blur-md border-b border-gray-800/50 fixed top-0 right-0 left-0 z-50 transition-all duration-300" style={{ left: isSidebarOpen ? '16rem' : '0' }}>
          <div className="flex items-center justify-between h-16 px-4">
            <div className="flex items-center">
              <button 
                onClick={() => setIsSidebarOpen(!isSidebarOpen)}
                className="text-gray-400 hover:text-white p-2 mr-2 rounded-full hover:bg-gray-800/50"
              >
                <Menu className="w-5 h-5" />
              </button>
              <h1 className="text-xl font-semibold text-white">
                {activeTab === 'modules' && activeModuleType 
                  ? `Modules ${activeModuleType.toUpperCase()}`
                  : activeTab === 'companies'
                  ? 'Entreprises B2B'
                  : activeTab === 'students'
                  ? 'Étudiants B2C'
                  : navigation.find(nav => nav.active)?.label || 'Dashboard'
                }
              </h1>
            </div>
            <div className="flex items-center space-x-4">
              <button className="relative p-2 text-gray-400 hover:text-white rounded-full hover:bg-gray-800/50">
                <Bell className="w-5 h-5" />
                {unreadNotifications > 0 && (
                  <span className="absolute top-1.5 right-1.5 w-2 h-2 bg-red-500 rounded-full"></span>
                )}
              </button>
              <div className="h-8 w-px bg-gray-700"></div>
              <div className="flex items-center space-x-2 relative" ref={profileDropdownRef}>
                <div className="text-right hidden md:block">
                  <p className="text-sm font-medium text-white">Mawa SIMBA</p>
                  <p className="text-xs text-yellow-400">Expert Coach</p>
                </div>
                <div 
                  className="relative cursor-pointer"
                  onClick={() => setIsProfileDropdownOpen(!isProfileDropdownOpen)}
                >
                  <Image 
                    src="https://i.pravatar.cc/150?u=coach1" 
                    alt="Mawa SIMBA" 
                    width={36} 
                    height={36}
                    className="w-9 h-9 rounded-full border-2 border-yellow-400 object-cover hover:border-yellow-300 transition-colors"
                  />
                  <div className="absolute bottom-0 right-0 w-2.5 h-2.5 bg-green-400 rounded-full border-2 border-gray-900"></div>
                  
                  {/* Menu déroulant */}
                  <AnimatePresence>
                    {isProfileDropdownOpen && (
                      <motion.div 
                        initial={{ opacity: 0, y: 10, scale: 0.95 }}
                        animate={{ opacity: 1, y: 15, scale: 1 }}
                        exit={{ opacity: 0, y: 10, scale: 0.95, transition: { duration: 0.15 } }}
                        transition={{ type: 'spring', stiffness: 500, damping: 30 }}
                        className="absolute right-0 mt-2 w-56 bg-gray-800 rounded-lg shadow-xl border border-gray-700 overflow-hidden z-50"
                      >
                        <div className="p-4 border-b border-gray-700">
                          <p className="text-sm font-medium text-white">{user?.user_metadata?.name || 'Utilisateur'}</p>
                          <p className="text-xs text-gray-400">{user?.email || ''}</p>
                        </div>
                        
                        <div className="py-1">
                          <a 
                            href="#" 
                            className="block px-4 py-2 text-sm text-gray-300 hover:bg-gray-700 hover:text-white flex items-center"
                          >
                            <User className="w-4 h-4 mr-3 text-gray-400" />
                            Mon profil
                          </a>
                          <a 
                            href="#" 
                            className="block px-4 py-2 text-sm text-gray-300 hover:bg-gray-700 hover:text-white flex items-center"
                          >
                            <Settings className="w-4 h-4 mr-3 text-gray-400" />
                            Paramètres
                          </a>
                          <a 
                            href="#" 
                            className="block px-4 py-2 text-sm text-gray-300 hover:bg-gray-700 hover:text-white flex items-center"
                          >
                            <HelpCircle className="w-4 h-4 mr-3 text-gray-400" />
                            Aide & Support
                          </a>
                        </div>
                        
                        <div className="p-2 border-t border-gray-700">
                          <button 
                            className="w-full flex items-center px-4 py-2 text-sm text-red-400 hover:bg-red-900/20 rounded-md transition-colors"
                            onClick={async (e) => {
                              e.preventDefault();
                              try {
                                await signOut();
                                // Redirection vers la page de connexion après déconnexion
                                window.location.href = '/login';
                              } catch (error) {
                                console.error('Erreur lors de la déconnexion:', error);
                              }
                            }}
                          >
                            <LogOut className="w-4 h-4 mr-3" />
                            Déconnexion
                          </button>
                        </div>
                      </motion.div>
                    )}
                  </AnimatePresence>
                </div>
              </div>
            </div>
          </div>
        </header>

        {/* Main Content Area */}
        <main className="flex-1 overflow-y-auto p-4 md:p-6 mt-16">
          {getCurrentView()}
        </main>
      </div>

      {/* Module Form Modal */}
      <ModuleForm
        isOpen={isModuleFormOpen}
        onClose={() => setIsModuleFormOpen(false)}
        onSubmit={handleModuleSubmit}
        moduleType={activeModuleType || 'b2b'}
        editingModule={editingModule}
        domains={activeModuleType === 'b2b' 
          ? [
              { id: 'banque', name: 'Banque & Finance' },
              { id: 'minier', name: 'Mines & Énergie' },
              { id: 'gouvernement', name: 'Gouvernement & Public' },
              { id: 'industrie', name: 'Industrie & Manufacture' },
              { id: 'automobile', name: 'Automobile & Transport' },
              { id: 'aerospatial', name: 'Aérospatial & Aviation' },
              { id: 'sante', name: 'Santé & Médical' },
              { id: 'education', name: 'Éducation & Formation' },
              { id: 'retail', name: 'Commerce & Retail' },
              { id: 'technologie', name: 'Technologie & IT' },
              { id: 'environnement', name: 'Environnement & Développement Durable' },
              { id: 'consulting', name: 'Consulting & Services' }
            ]
          : [
              { id: 'personal-development', name: 'Développement Personnel' },
              { id: 'career', name: 'Carrière & Emploi' },
              { id: 'public-speaking', name: 'Prise de Parole' },
              { id: 'networking', name: 'Networking & Relations' },
              { id: 'entrepreneurship', name: 'Entrepreneuriat' }
            ]
        }
      />


    </div>
  );
};

export default CoachDashboard;
