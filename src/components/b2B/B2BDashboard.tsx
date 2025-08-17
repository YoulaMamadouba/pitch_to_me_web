'use client';

import { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { useRouter } from 'next/navigation';
import { useAuth } from '@/contexts/AuthContext';
import { getSupabase } from '@/lib/supabase';
import { 
  Home, 
  BookOpen, 
  Users,
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
  Building,
  LogOut,
  Briefcase,
  Award,
  Clock,
  Star,
  Plus,
  Search
} from 'lucide-react';
import B2BSidebar from './B2BSidebar';
import B2BHeader from './B2BHeader';
import B2BHome from './B2BHome';
import B2BModules from './B2BModules';
import B2BProgress from './B2BProgress';
import B2BProfile from './B2BProfile';
import B2BSettings from './B2BSettings';

interface NavigationItem {
  id: string;
  label: string;
  icon: React.ComponentType<{ className?: string }>;
  className?: string;
  active?: boolean;
  onClick?: () => void;
}

type ViewType = 
  | 'home' 
  | 'modules' 
  | 'progress' 
  | 'profile' 
  | 'settings';

export default function B2BDashboard() {
  const { user, signOut } = useAuth();
  const router = useRouter();
  const [currentView, setCurrentView] = useState<ViewType>('home');
  const [sidebarCollapsed, setSidebarCollapsed] = useState(false);
  const [showMobileMenu, setShowMobileMenu] = useState(false);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    console.log('🔧 B2BDashboard - useEffect triggered');
    console.log('🔧 User:', user);
    
    if (!user) {
      console.log('🔧 Pas d\'utilisateur, redirection vers /login');
      router.push('/login');
      return;
    }

    // Vérifier le rôle dans la base de données
    const checkUserRole = async () => {
      try {
        const supabase = getSupabase();
        const { data: userData, error } = await supabase
          .from('users')
          .select('role')
          .eq('id', user.id)
          .single();

        if (error) {
          console.error('❌ Erreur lors de la récupération du rôle:', error);
          router.push('/dashboard');
          return;
        }

        console.log('🔧 Rôle depuis la base de données:', userData.role);

        if (userData.role !== 'employee') {
          console.log('🔧 Utilisateur n\'est pas un employé, redirection...');
          
          // Rediriger vers le dashboard approprié
          switch (userData.role) {
            case 'individual':
              router.push('/dashboard');
              break;
            case 'rh':
              router.push('/hr-dashboard');
              break;
            case 'coach':
              router.push('/coach-dashboard');
              break;
            default:
              router.push('/dashboard');
          }
          return;
        }

        console.log('🔧 Utilisateur employee confirmé, affichage du dashboard B2B');
        setLoading(false);
      } catch (error) {
        console.error('❌ Erreur lors de la vérification du rôle:', error);
        router.push('/dashboard');
      }
    };

    checkUserRole();
  }, [user, router]);

  const handleSignOut = async () => {
    try {
      await signOut();
      router.push('/login');
    } catch (error) {
      console.error('Erreur lors de la déconnexion:', error);
    }
  };

  const navigationItems: NavigationItem[] = [
    {
      id: 'home',
      label: 'Accueil',
      icon: Home,
      active: currentView === 'home',
      onClick: () => setCurrentView('home')
    },
    {
      id: 'modules',
      label: 'Modules',
      icon: BookOpen,
      active: currentView === 'modules',
      onClick: () => setCurrentView('modules')
    },
    {
      id: 'progress',
      label: 'Progression',
      icon: BarChart3,
      active: currentView === 'progress',
      onClick: () => setCurrentView('progress')
    },
    {
      id: 'profile',
      label: 'Profil',
      icon: User,
      active: currentView === 'profile',
      onClick: () => setCurrentView('profile')
    },
    {
      id: 'settings',
      label: 'Paramètres',
      icon: Settings,
      active: currentView === 'settings',
      onClick: () => setCurrentView('settings')
    }
  ];

  if (loading) {
    return (
      <div className="min-h-screen bg-gray-900 flex items-center justify-center">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-yellow-400"></div>
      </div>
    );
  }

  const renderCurrentView = () => {
    switch (currentView) {
      case 'home':
        return <B2BHome />;
      case 'modules':
        return <B2BModules />;
      case 'progress':
        return <B2BProgress />;
      case 'profile':
        return <B2BProfile />;
      case 'settings':
        return <B2BSettings />;
      default:
        return <B2BHome />;
    }
  };

  return (
    <div className="min-h-screen bg-gray-900 text-white">
      {/* Mobile Menu Overlay */}
      <AnimatePresence>
        {showMobileMenu && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 bg-black/50 z-40 lg:hidden"
            onClick={() => setShowMobileMenu(false)}
          />
        )}
      </AnimatePresence>

      <div className="flex h-screen">
        {/* Sidebar */}
        <B2BSidebar
          navigationItems={navigationItems}
          collapsed={sidebarCollapsed}
          onToggleCollapse={() => setSidebarCollapsed(!sidebarCollapsed)}
          onSignOut={handleSignOut}
          showMobileMenu={showMobileMenu}
          onCloseMobileMenu={() => setShowMobileMenu(false)}
        />

        {/* Main Content */}
        <div className="flex-1 flex flex-col overflow-hidden">
          {/* Header */}
          <B2BHeader
            user={user}
            onToggleMobileMenu={() => setShowMobileMenu(true)}
            onSignOut={handleSignOut}
          />

          {/* Main Content Area */}
          <main className="flex-1 overflow-y-auto bg-gray-900">
            <div className="container mx-auto px-4 py-6">
              <AnimatePresence mode="wait">
                <motion.div
                  key={currentView}
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  exit={{ opacity: 0, y: -20 }}
                  transition={{ duration: 0.3 }}
                >
                  {renderCurrentView()}
                </motion.div>
              </AnimatePresence>
            </div>
          </main>
        </div>
      </div>
    </div>
  );
}
