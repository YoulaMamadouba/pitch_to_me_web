'use client';

import { useState, useEffect } from 'react';
import type React from 'react';
import Link from 'next/link';
import { motion } from 'framer-motion';
import dynamic from 'next/dynamic';
import { useRouter } from 'next/navigation';
import { useAuth } from '@/contexts/AuthContext';
import { UserService, User as UserType } from '@/lib/userService';
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
  Smile,
  MessageSquareText,
  Building
} from 'lucide-react';
import LearnerProfile from '@/components/LearnerProfile';
import Community from '@/components/Community';
import VRCalibration from '@/components/VRCalibration';

// Import dynamique des composants pour le chargement à la demande
const ModuleView = dynamic(() => import('@/components/dashboard/ModuleView'), {
  loading: () => <div className="flex items-center justify-center h-64"><div className="animate-spin rounded-full h-8 w-8 border-b-2 border-yellow-400"></div></div>
});

const DomainsList = dynamic(() => import('@/components/dashboard/DomainsList'), {
  loading: () => <div className="flex items-center justify-center h-64"><div className="animate-spin rounded-full h-8 w-8 border-b-2 border-yellow-400"></div></div>
});

const ModulesList = dynamic(() => import('@/components/dashboard/ModulesList'), {
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

const EmotionRecognitionView = dynamic(() => import('@/components/dashboard/EmotionRecognitionView'), {
  loading: () => <div className="flex items-center justify-center h-64"><div className="animate-spin rounded-full h-8 w-8 border-b-2 border-yellow-400"></div></div>
});

const AICoachDrawer = dynamic(() => import('@/components/dashboard/AICoachDrawer'), {
  loading: () => <div className="flex items-center justify-center h-64"><div className="animate-spin rounded-full h-8 w-8 border-b-2 border-yellow-400"></div></div>
});


interface NavigationItem {
  id: string;
  label: string;
  icon: React.ComponentType<{ className?: string }>;
  className?: string;
  active?: boolean;
  onClick?: () => void;
}

type ViewType = 
  | 'dashboard' 
  | 'profile' 
  | 'community' 
  | 'vrcalibration'
  | 'module'
  | 'modules-b2b'
  | 'modules-b2c'
  | 'vr-scene'
  | 'vr-session'
  | 'voice-analysis'
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
      <svg height={size} width={size} className="transform -rotate-90">
        <circle
          cx={size / 2}
          cy={size / 2}
          r={radius}
          stroke="#2D3748"
          strokeWidth={stroke}
          fill="transparent"
          className="text-gray-700"
        />
        <circle
          cx={size / 2}
          cy={size / 2}
          r={radius}
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

const ProfileView = ({ 
  currentUser, 
  isEditing, 
  previewImage, 
  getUserInitials, 
  handleImageChange, 
  setIsEditing, 
  handleSaveProfile, 
  setCurrentUser,
  isChangingPassword,
  setIsChangingPassword,
  currentPassword,
  setCurrentPassword,
  newPassword,
  setNewPassword,
  confirmPassword,
  setConfirmPassword,
  handleChangePassword
}: {
  currentUser: any;
  isEditing: boolean;
  previewImage: string | null;
  getUserInitials: () => string;
  handleImageChange: (e: React.ChangeEvent<HTMLInputElement>) => void;
  setIsEditing: (value: boolean) => void;
  handleSaveProfile: () => void;
  setCurrentUser: (user: any) => void;
  isChangingPassword: boolean;
  setIsChangingPassword: (value: boolean) => void;
  currentPassword: string;
  setCurrentPassword: (value: string) => void;
  newPassword: string;
  setNewPassword: (value: string) => void;
  confirmPassword: string;
  setConfirmPassword: (value: string) => void;
  handleChangePassword: () => void;
}) => (
  <div className="p-6 max-w-4xl mx-auto">
    <div className="bg-gray-800 rounded-xl shadow-lg overflow-hidden">
      {/* Profile Header */}
      <div className="bg-gradient-to-r from-gray-900 to-gray-800 p-6">
        <div className="flex flex-col md:flex-row md:items-center md:justify-between">
          <div className="flex items-center space-x-4">
            <div className="relative group">
              <div className="w-24 h-24 rounded-full bg-gradient-to-br from-yellow-400 to-yellow-600 flex items-center justify-center text-3xl font-bold text-gray-900">
                {previewImage ? (
                  <img 
                    src={previewImage} 
                    alt="Profile" 
                    className="w-full h-full rounded-full object-cover"
                  />
                ) : (
                  getUserInitials()
                )}
              </div>
              {isEditing && (
                <label className="absolute bottom-0 right-0 bg-yellow-400 hover:bg-yellow-500 text-gray-900 rounded-full p-2 cursor-pointer transition-colors">
                  <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" viewBox="0 0 20 20" fill="currentColor">
                    <path d="M13.586 3.586a2 2 0 112.828 2.828l-.793.793-2.828-2.828.793-.793zM11.379 5.793L3 14.172V17h2.828l8.38-8.379-2.83-2.828z" />
                  </svg>
                  <input 
                    type="file" 
                    className="hidden" 
                    accept="image/*"
                    onChange={handleImageChange}
                  />
                </label>
              )}
            </div>
            <div>
              <h2 className="text-2xl font-bold text-white">
                {currentUser.firstName} {currentUser.lastName}
              </h2>
              <p className="text-yellow-400">{currentUser.role}</p>
            </div>
          </div>
          <div className="mt-4 md:mt-0">
            {!isEditing ? (
              <button 
                onClick={() => setIsEditing(true)}
                className="px-4 py-2 bg-yellow-500 hover:bg-yellow-600 text-gray-900 font-medium rounded-lg transition-colors"
              >
                Modifier le profil
              </button>
            ) : (
              <div className="space-x-2">
                <button 
                  onClick={handleSaveProfile}
                  className="px-4 py-2 bg-green-500 hover:bg-green-600 text-white font-medium rounded-lg transition-colors"
                >
                  Enregistrer
                </button>
                <button 
                  onClick={() => setIsEditing(false)}
                  className="px-4 py-2 bg-gray-600 hover:bg-gray-700 text-white font-medium rounded-lg transition-colors"
                >
                  Annuler
                </button>
              </div>
            )}
          </div>
        </div>
      </div>

      {/* Profile Content */}
      <div className="p-6">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          {/* Personal Information */}
          <div className="space-y-4">
            <h3 className="text-lg font-semibold text-white border-b border-gray-700 pb-2">
              Informations personnelles
            </h3>
            
            {isEditing ? (
              <div className="space-y-4">
                <div>
                  <label className="block text-sm font-medium text-gray-300 mb-1">Prénom</label>
                  <input
                    type="text"
                    value={currentUser.firstName}
                    onChange={(e) => setCurrentUser({...currentUser, firstName: e.target.value})}
                    className="w-full px-3 py-2 bg-gray-700 border border-gray-600 rounded-lg text-white focus:outline-none focus:ring-2 focus:ring-yellow-500"
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-300 mb-1">Nom</label>
                  <input
                    type="text"
                    value={currentUser.lastName}
                    onChange={(e) => setCurrentUser({...currentUser, lastName: e.target.value})}
                    className="w-full px-3 py-2 bg-gray-700 border border-gray-600 rounded-lg text-white focus:outline-none focus:ring-2 focus:ring-yellow-500"
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-300 mb-1">Email</label>
                  <input
                    type="email"
                    value={currentUser.email}
                    onChange={(e) => setCurrentUser({...currentUser, email: e.target.value})}
                    className="w-full px-3 py-2 bg-gray-700 border border-gray-600 rounded-lg text-white focus:outline-none focus:ring-2 focus:ring-yellow-500"
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-300 mb-1">Téléphone</label>
                  <input
                    type="tel"
                    value={currentUser.phone}
                    onChange={(e) => setCurrentUser({...currentUser, phone: e.target.value})}
                    className="w-full px-3 py-2 bg-gray-700 border border-gray-600 rounded-lg text-white focus:outline-none focus:ring-2 focus:ring-yellow-500"
                  />
                </div>
              </div>
            ) : (
              <div className="space-y-3">
                <div>
                  <p className="text-sm text-gray-400">Email</p>
                  <p className="text-white">{currentUser.email}</p>
                </div>
                <div>
                  <p className="text-sm text-gray-400">Téléphone</p>
                  <p className="text-white">{currentUser.phone}</p>
                </div>
              </div>
            )}
          </div>

          {/* Company Information */}
          <div className="space-y-4">
            <h3 className="text-lg font-semibold text-white border-b border-gray-700 pb-2">
              Informations professionnelles
            </h3>
            
            {isEditing ? (
              <div className="space-y-4">
                <div>
                  <label className="block text-sm font-medium text-gray-300 mb-1">Entreprise</label>
                  <input
                    type="text"
                    value={currentUser.company}
                    onChange={(e) => setCurrentUser({...currentUser, company: e.target.value})}
                    className="w-full px-3 py-2 bg-gray-700 border border-gray-600 rounded-lg text-white focus:outline-none focus:ring-2 focus:ring-yellow-500"
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-300 mb-1">Poste</label>
                  <input
                    type="text"
                    value={currentUser.position}
                    onChange={(e) => setCurrentUser({...currentUser, position: e.target.value})}
                    className="w-full px-3 py-2 bg-gray-700 border border-gray-600 rounded-lg text-white focus:outline-none focus:ring-2 focus:ring-yellow-500"
                  />
                </div>
              </div>
            ) : (
              <div className="space-y-3">
                <div>
                  <p className="text-sm text-gray-400">Entreprise</p>
                  <p className="text-white">{currentUser.company}</p>
                </div>
                <div>
                  <p className="text-sm text-gray-400">Poste</p>
                  <p className="text-white">{currentUser.position}</p>
                </div>
              </div>
            )}
          </div>
        </div>

        {/* Bio */}
        <div className="mt-6">
          <h3 className="text-lg font-semibold text-white border-b border-gray-700 pb-2 mb-4">
            À propos
          </h3>
          {isEditing ? (
            <textarea
              value={currentUser.bio}
              onChange={(e) => setCurrentUser({...currentUser, bio: e.target.value})}
              className="w-full px-3 py-2 bg-gray-700 border border-gray-600 rounded-lg text-white focus:outline-none focus:ring-2 focus:ring-yellow-500 min-h-[100px]"
              placeholder="Décrivez-vous en quelques mots..."
            />
          ) : (
            <p className="text-gray-300 whitespace-pre-line">
              {currentUser.bio || "Aucune description fournie."}
            </p>
          )}
        </div>

        {/* Change Password Section */}
        <div className="mt-8 pt-6 border-t border-gray-700">
          <div className="flex justify-between items-center mb-4">
            <h3 className="text-lg font-semibold text-white">Sécurité du compte</h3>
            {!isChangingPassword ? (
              <button 
                onClick={() => setIsChangingPassword(true)}
                className="text-yellow-400 hover:text-yellow-300 text-sm font-medium"
              >
                Changer le mot de passe
              </button>
            ) : null}
          </div>

          {isChangingPassword && (
            <div className="bg-gray-800 p-4 rounded-lg">
              <h4 className="text-white font-medium mb-3">Changer le mot de passe</h4>
              <div className="space-y-3">
                <div>
                  <label className="block text-sm text-gray-300 mb-1">Mot de passe actuel</label>
                  <input
                    type="password"
                    value={currentPassword}
                    onChange={(e) => setCurrentPassword(e.target.value)}
                    className="w-full px-3 py-2 bg-gray-700 border border-gray-600 rounded-lg text-white focus:outline-none focus:ring-2 focus:ring-yellow-500"
                    placeholder="Entrez votre mot de passe actuel"
                  />
                </div>
                <div>
                  <label className="block text-sm text-gray-300 mb-1">Nouveau mot de passe</label>
                  <input
                    type="password"
                    value={newPassword}
                    onChange={(e) => setNewPassword(e.target.value)}
                    className="w-full px-3 py-2 bg-gray-700 border border-gray-600 rounded-lg text-white focus:outline-none focus:ring-2 focus:ring-yellow-500"
                    placeholder="Entrez votre nouveau mot de passe"
                  />
                </div>
                <div>
                  <label className="block text-sm text-gray-300 mb-1">Confirmer le nouveau mot de passe</label>
                  <input
                    type="password"
                    value={confirmPassword}
                    onChange={(e) => setConfirmPassword(e.target.value)}
                    className="w-full px-3 py-2 bg-gray-700 border border-gray-600 rounded-lg text-white focus:outline-none focus:ring-2 focus:ring-yellow-500"
                    placeholder="Confirmez votre nouveau mot de passe"
                  />
                </div>
                <div className="flex justify-end space-x-2 pt-2">
                  <button 
                    onClick={handleChangePassword}
                    className="px-4 py-2 bg-yellow-500 hover:bg-yellow-600 text-gray-900 font-medium rounded-lg transition-colors"
                    disabled={!currentPassword || !newPassword || newPassword !== confirmPassword}
                  >
                    Enregistrer
                  </button>
                  <button 
                    onClick={() => {
                      setIsChangingPassword(false);
                      setCurrentPassword('');
                      setNewPassword('');
                      setConfirmPassword('');
                    }}
                    className="px-4 py-2 bg-gray-600 hover:bg-gray-700 text-white font-medium rounded-lg transition-colors"
                  >
                    Annuler
                  </button>
                </div>
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  </div>
);

export default function DashboardPage() {
  const router = useRouter();
  const { signOut, user } = useAuth();
  
  // User state
  const [currentUser, setCurrentUser] = useState<UserType | null>(null);
  const [loading, setLoading] = useState(true);
  
  // UI state
  const [activeView, setActiveView] = useState<ViewType>('dashboard');
  const [isSidebarOpen, setIsSidebarOpen] = useState(true);
  const [isScrolled, setIsScrolled] = useState(false);
  const [isUserMenuOpen, setIsUserMenuOpen] = useState(false);
  const [isAICoachOpen, setIsAICoachOpen] = useState(false);
  const [mounted, setMounted] = useState(false);
  const [showWelcomeNotification, setShowWelcomeNotification] = useState(false);
  const [showOnboardingSuccess, setShowOnboardingSuccess] = useState(false);

  // Check for onboarding completion
  useEffect(() => {
    const searchParams = new URLSearchParams(window.location.search);
    const fromOnboarding = sessionStorage.getItem('fromOnboarding') === 'true';
    const onboardingComplete = searchParams.get('onboarding') === 'complete';
    
    if (fromOnboarding && onboardingComplete) {
      setShowOnboardingSuccess(true);
      // Clear the flag from session storage
      sessionStorage.removeItem('fromOnboarding');
      // Remove the query parameter from the URL without reloading
      const newUrl = window.location.pathname;
      window.history.replaceState({}, '', newUrl);
      
      // Hide the success message after 5 seconds
      const timer = setTimeout(() => {
        setShowOnboardingSuccess(false);
      }, 5000);
      
      return () => clearTimeout(timer);
    }
  }, [router]);

  // Load user data
  useEffect(() => {
    const loadUserData = async () => {
      try {
        console.log('🔧 Chargement des données utilisateur...');
        const userData = await UserService.getCurrentUser();
        
        if (!userData) {
          console.error('❌ Aucune donnée utilisateur trouvée');
          // Rediriger vers la page de login si pas de données utilisateur
          router.push('/login');
          return;
        }
        
        console.log('✅ Données utilisateur chargées:', userData);
        setCurrentUser(userData);
        
        // Afficher la notification de bienvenue si c'est la première fois
        const hasSeenWelcome = sessionStorage.getItem('hasSeenWelcome');
        const isFromOnboarding = sessionStorage.getItem('fromOnboarding');
        
        if (!hasSeenWelcome || isFromOnboarding) {
          setShowWelcomeNotification(true);
          sessionStorage.setItem('hasSeenWelcome', 'true');
          sessionStorage.removeItem('fromOnboarding'); // Nettoyer le flag
          // Masquer la notification après 5 secondes
          setTimeout(() => setShowWelcomeNotification(false), 5000);
        }
      } catch (error) {
        console.error('❌ Erreur lors du chargement des données utilisateur:', error);
        // Rediriger vers la page de login en cas d'erreur
        router.push('/login');
      } finally {
        setLoading(false);
      }
    };

    if (user) {
      loadUserData();
    } else {
      console.log('🔧 Aucun utilisateur connecté, redirection vers /login');
      router.push('/login');
    }
  }, [user, router]);
  
  // Form state
  const [isEditing, setIsEditing] = useState(false);
  const [isChangingPassword, setIsChangingPassword] = useState(false);
  const [previewImage, setPreviewImage] = useState<string | null>(null);
  const [currentPassword, setCurrentPassword] = useState('');
  const [newPassword, setNewPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  
  // Module/Content state
  const [selectedModuleId, setSelectedModuleId] = useState('6');
  const [selectedDomain, setSelectedDomain] = useState<any>(null);
  const [selectedVRScene, setSelectedVRScene] = useState('');
  const [moduleType, setModuleType] = useState<'b2b' | 'b2c'>('b2b');
  const [activeModule, setActiveModule] = useState<number>(5); // Module 6 is active (index 5)
  const [profileImage, setProfileImage] = useState<File | null>(null);

  // Get user initials for avatar
  const getUserInitials = () => {
    if (!currentUser?.name) return '??';
    return UserService.getUserInitials(currentUser.name);
  };

  const handleImageChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      setProfileImage(file);
      const reader = new FileReader();
      reader.onloadend = () => {
        setPreviewImage(reader.result as string);
      };
      reader.readAsDataURL(file);
    }
  };

  const handleSaveProfile = () => {
    // Here you would typically make an API call to update the user's profile
    console.log('Saving profile...', currentUser);
    if (profileImage) {
      console.log('Uploading new profile image...');
      // Upload the image here
    }
    setIsEditing(false);
  };

  const handleChangePassword = () => {
    // Here you would typically make an API call to change the password
    console.log('Changing password...');
    setCurrentPassword('');
    setNewPassword('');
    setConfirmPassword('');
    setIsChangingPassword(false);
  };

  const handleLogout = async () => {
    try {
      await signOut();
      router.push('/login');
    } catch (error) {
      console.error('Error during logout:', error);
      // Optionally show an error message to the user
    }
  };

  // Get user initials for the profile circle is already defined above

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
    }
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
      {/* Onboarding Success Notification */}
      {showOnboardingSuccess && (
        <div className="fixed top-4 right-4 z-50">
          <div className="bg-green-500 text-white px-6 py-3 rounded-lg shadow-lg flex items-center space-x-2 animate-fade-in">
            <Check className="w-5 h-5" />
            <span>Onboarding terminé avec succès ! Profitez de votre formation.</span>
          </div>
        </div>
      )}
      
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
            <div className="w-14 h-14 rounded-full bg-gradient-to-br from-yellow-400 to-yellow-600 flex items-center justify-center border-2 border-yellow-400">
              <span className="text-xl font-bold text-gray-900">{getUserInitials()}</span>
            </div>
            <div className="absolute -bottom-1 -right-1 w-5 h-5 bg-green-400 rounded-full border-2 border-gray-900"></div>
          </div>
          {isSidebarOpen && (
            <div>
              <div className="font-medium text-white">{currentUser?.name || 'Utilisateur'}</div>
              <div className="text-xs text-gray-400">{currentUser?.email}</div>
              <div className="text-xs text-yellow-400 mt-1">{currentUser?.role}</div>
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
            <p> 2024 Pitch to Me</p>
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
                {activeView === 'modules-b2b' && 'Modules B2B'}
                {activeView === 'modules-b2c' && 'Modules B2C'}
                {activeView === 'vr-scene' && 'S\'entraîner en VR'}
                {activeView === 'vr-session' && 'Session VR'}
                {activeView === 'voice-analysis' && 'Analyse Vocale'}
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
              <div className="relative">
                <button
                  onClick={() => setIsUserMenuOpen(!isUserMenuOpen)}
                  className="flex items-center space-x-3 focus:outline-none"
                >
                  <div className="relative">
                    {previewImage || currentUser?.avatar_url ? (
                      <img 
                        src={previewImage || currentUser?.avatar_url} 
                        alt="Profile" 
                        className="w-8 h-8 rounded-full border-2 border-yellow-400 object-cover"
                      />
                    ) : (
                      <div className="w-8 h-8 rounded-full bg-yellow-400 flex items-center justify-center text-gray-900 font-bold text-sm">
                        {getUserInitials()}
                      </div>
                    )}
                    <div className="absolute -bottom-1 -right-1 w-2.5 h-2.5 bg-green-400 rounded-full border-2 border-white"></div>
                  </div>
                  <span className="hidden md:inline text-sm font-medium text-white">{currentUser?.name || 'Utilisateur'}</span>
                  <ChevronDown className={`w-4 h-4 text-gray-300 transition-transform ${isUserMenuOpen ? 'rotate-180' : ''}`} />
                </button>
                {isUserMenuOpen && (
                  <div className="absolute right-0 mt-2 w-56 bg-gray-900/95 backdrop-blur rounded-lg shadow-lg border border-gray-700 z-20">
                    <div className="px-4 py-3">
                      <p className="text-sm font-medium text-white">{currentUser?.name || 'Utilisateur'}</p>
                      <p className="text-xs text-gray-300">{currentUser?.email}</p>
                    </div>
                    <div className="border-t border-gray-700"></div>
                    <button
                      onClick={handleLogout}
                      className="w-full text-left px-4 py-2 text-sm text-gray-200 hover:bg-gray-800"
                    >
                      Déconnexion
                    </button>
                  </div>
                )}
              </div>
            </div>
          </div>
        </header>

        {/* Main Content Area */}
        <main className="flex-1 overflow-y-auto pt-4 px-4 pb-3 md:pt-6 md:px-6 md:pb-4">
          {loading ? (
            <div className="flex items-center justify-center h-64">
              <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-yellow-400"></div>
            </div>
          ) : activeView === 'profile' ? (
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
          ) : activeView === 'modules-b2b' || activeView === 'modules-b2c' ? (
            selectedDomain ? (
              <ModulesList 
                domainName={selectedDomain.name}
                onBackToDomains={() => setSelectedDomain(null)}
              />
            ) : (
              <DomainsList 
                moduleType={moduleType}
                onDomainSelect={(domain) => setSelectedDomain(domain)}
                onCreateModule={() => console.log('Créer un module')}
              />
            )
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
            <h2 className="text-xl font-semibold text-white mb-2">
              Bon retour, {currentUser?.name?.split(' ')[0] || 'Utilisateur'} !
            </h2>
            <p className="text-gray-300 mb-6">Continuez votre apprentissage là où vous vous êtes arrêté.</p>
            
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

      {/* Welcome Notification */}
      {showWelcomeNotification && (
        <div className="fixed top-4 right-4 z-50 bg-green-500 text-white px-6 py-4 rounded-lg shadow-lg border border-green-400 animate-in slide-in-from-right duration-300">
          <div className="flex items-center space-x-3">
            <div className="w-8 h-8 bg-green-400 rounded-full flex items-center justify-center">
              <Check className="w-4 h-4 text-white" />
            </div>
            <div>
              <p className="font-medium">Bienvenue, {currentUser?.name?.split(' ')[0] || 'Utilisateur'} !</p>
              <p className="text-sm opacity-90">Vous êtes maintenant connecté à votre dashboard.</p>
            </div>
            <button 
              onClick={() => setShowWelcomeNotification(false)}
              className="text-white hover:text-gray-200"
            >
              <X className="w-4 h-4" />
            </button>
          </div>
        </div>
      )}

      {/* AI Coach Circle Button */}
      <motion.button
        initial={{ scale: 0, opacity: 0 }}
        animate={{ scale: 1, opacity: 1 }}
        transition={{ delay: 0.5, type: "spring", stiffness: 200 }}
        whileHover={{ scale: 1.05 }}
        whileTap={{ scale: 0.95 }}
        onClick={() => setIsAICoachOpen(true)}
        className="fixed bottom-8 right-8 z-40 w-16 h-16 bg-gradient-to-br from-yellow-400 to-orange-500 rounded-full shadow-lg hover:shadow-xl transition-all duration-200 flex items-center justify-center"
      >
        <MessageSquareText className="w-6 h-6 text-white" />
      </motion.button>

      {/* AI Coach Drawer */}
      <AICoachDrawer 
        isOpen={isAICoachOpen} 
        onClose={() => setIsAICoachOpen(false)} 
      />
    </div>
  );
}
