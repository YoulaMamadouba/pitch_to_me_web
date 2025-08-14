'use client';
import { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import Link from 'next/link';
import { Eye, EyeOff, Mail, Lock, Home, User, GraduationCap, Users, Briefcase, Award, BookOpen, Clock } from 'lucide-react';
import AuthCard from '@/components/ui/AuthCard';
import { motion, AnimatePresence } from 'framer-motion';
import AuthPageHeader from '@/components/ui/AuthPageHeader';
import RoleSelector from '@/components/auth/RoleSelector';
import RoleBasedFields from '@/components/auth/RoleBasedFields';
import { useLanguageContext } from '@/contexts/LanguageContext';
import { useAuth } from '@/contexts/AuthContext';

type UserRole = 'learner' | 'coach' | 'hr';

interface FormData {
  email: string;
  password: string;
  rememberMe: boolean;
  // Learner fields
  learningGoal?: string;
  currentLevel?: string;
  // Coach fields
  specialization?: string;
  yearsOfExperience?: number;
  // HR fields
  company?: string;
  department?: string;
}

const getDefaultFormData = (role: UserRole): FormData => {
  // Start with empty values so placeholders are visible and translate correctly
  const baseData: FormData = {
    email: '',
    password: '',
    rememberMe: false,
    learningGoal: '',
    currentLevel: '',
    specialization: '',
    yearsOfExperience: undefined as unknown as number,
    company: '',
    department: ''
  };

  // Optionally customize per role later without hardcoded demo texts
  switch (role) {
    case 'coach':
      return { ...baseData };
    case 'hr':
      return { ...baseData };
    case 'learner':
    default:
      return { ...baseData };
  }
};

export default function LoginPage() {
  const router = useRouter();
  const { t } = useLanguageContext();
  const { signIn, loading: authLoading } = useAuth();
  const [showPassword, setShowPassword] = useState(false);
  const [selectedRole, setSelectedRole] = useState<UserRole>('learner');
  const [formData, setFormData] = useState<FormData>(getDefaultFormData('learner'));
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  // Mettre à jour les champs par défaut quand le rôle change
  useEffect(() => {
    setFormData(getDefaultFormData(selectedRole));
  }, [selectedRole]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsLoading(true);
    setError(null);

    try {
      const { error } = await signIn(formData.email, formData.password);
      
      if (error) {
        setError(error.message);
      }
      // La redirection sera gérée automatiquement par le contexte d'authentification
    } catch (err) {
      setError('Une erreur inattendue s\'est produite');
    } finally {
      setIsLoading(false);
    }
  };

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value, type } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: type === 'number' ? parseInt(value, 10) : value,
    }));
  };

  const handleCheckboxChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, checked } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: checked,
    }));
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-900 via-blue-900 to-gray-900 flex flex-col">
      {/* Auth Page Header */}
      <AuthPageHeader pageTitle={t('header.login')} />
      
      {/* Main Content */}
      <div className="flex-1 flex items-center justify-center p-4 pt-24">
        <AuthCard
          title={t('auth.login.card.title')}
          subtitle={t('auth.login.card.subtitle')}
          icon={<Home className="w-8 h-8 text-white" />}
        >
          {/* Quick Stats */}
          <div className="bg-gray-700 bg-opacity-50 rounded-xl p-4">
            <div className="grid grid-cols-3 gap-4 text-center">
              <div>
                <div className="text-lg font-bold text-yellow-400">50k+</div>
                <div className="text-xs text-gray-400">{t('auth.login.stats.users')}</div>
              </div>
              <div>
                <div className="text-lg font-bold text-cyan-400">12</div>
                <div className="text-xs text-gray-400">{t('auth.login.stats.modules')}</div>
              </div>
              <div>
                <div className="text-lg font-bold text-green-400">95%</div>
                <div className="text-xs text-gray-400">{t('auth.login.stats.success')}</div>
              </div>
            </div>
          </div>

          {/* Login Form */}
          <form onSubmit={handleSubmit} className="space-y-6">
            {/* Sélecteur de rôle */}
            <RoleSelector 
              selectedRole={selectedRole}
              onRoleChange={setSelectedRole}
            />

            {/* Champs dynamiques en fonction du rôle */}
            <RoleBasedFields
              role={selectedRole}
              formData={formData}
              onInputChange={handleInputChange}
              onCheckboxChange={handleCheckboxChange}
              showPassword={showPassword}
              setShowPassword={setShowPassword}
            />

            {/* Affichage des erreurs */}
            {error && (
              <div className="bg-red-500 bg-opacity-10 border border-red-500 rounded-lg p-3">
                <p className="text-red-400 text-sm">{error}</p>
              </div>
            )}

            {/* Bouton de connexion */}
            <div>
              <button
                type="submit"
                disabled={isLoading || authLoading}
                className={`w-full flex justify-center py-3 px-4 border border-transparent rounded-xl shadow-sm text-sm font-medium text-black focus:outline-none focus:ring-2 focus:ring-offset-2 transition-all duration-200 disabled:opacity-50 disabled:cursor-not-allowed ${
                  selectedRole === 'coach'
                    ? 'bg-gradient-to-r from-yellow-400 to-yellow-500 hover:from-yellow-300 hover:to-yellow-400 focus:ring-yellow-500'
                    : selectedRole === 'hr'
                    ? 'bg-gradient-to-r from-purple-400 to-purple-500 hover:from-purple-300 hover:to-purple-400 focus:ring-purple-500'
                    : 'bg-gradient-to-r from-blue-400 to-blue-500 hover:from-blue-300 hover:to-blue-400 focus:ring-blue-500'
                }`}
              >
                {isLoading || authLoading ? (
                  <div className="flex items-center">
                    <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-black mr-2"></div>
                    Connexion...
                  </div>
                ) : (
                  selectedRole === 'coach' 
                    ? t('auth.login.cta.coach')
                    : selectedRole === 'hr'
                    ? t('auth.login.cta.hr')
                    : t('auth.login.cta.default')
                )}
              </button>
            </div>
          </form>

          {/* Divider */}
          <div className="relative mt-8 mb-6">
            <div className="absolute inset-0 flex items-center" aria-hidden="true">
              <div className="w-full border-t border-gray-600"></div>
            </div>
            <div className="relative flex justify-center text-sm">
              <span className="px-2 bg-gray-800 text-gray-400">{t('auth.login.divider')}</span>
            </div>
          </div>

          {/* Social Login */}
          <div className="grid grid-cols-3 gap-3">
            <button 
              type="button"
              className="w-full inline-flex justify-center py-2.5 px-4 border border-gray-600 rounded-lg shadow-sm bg-gray-700 text-sm font-medium text-white hover:bg-gray-600 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-yellow-500 transition-colors"
            >
              <svg className="w-5 h-5" viewBox="0 0 24 24" fill="currentColor">
                <path d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z" fill="#4285F4"/>
                <path d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z" fill="#34A853"/>
                <path d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l2.85-2.22.81-.62z" fill="#FBBC05"/>
                <path d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z" fill="#EA4335"/>
              </svg>
            </button>
            
            <button 
              type="button"
              className="w-full inline-flex justify-center py-2.5 px-4 border border-gray-600 rounded-lg shadow-sm bg-blue-600 text-sm font-medium text-white hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500 transition-colors"
            >
              <svg className="w-5 h-5" fill="currentColor" viewBox="0 0 24 24">
                <path d="M24 12.073c0-6.627-5.373-12-12-12s-12 5.373-12 12c0 5.99 4.388 10.954 10.125 11.854v-8.385H7.078v-3.47h3.047V9.43c0-3.007 1.792-4.669 4.533-4.669 1.312 0 2.686.235 2.686.235v2.953H15.83c-1.491 0-1.956.925-1.956 1.874v2.25h3.328l-.532 3.47h-2.796v8.385C19.612 23.027 24 18.062 24 12.073z"/>
              </svg>
            </button>
            
            <button 
              type="button"
              className="w-full inline-flex justify-center py-2.5 px-4 border border-gray-600 rounded-lg shadow-sm bg-black text-sm font-medium text-white hover:bg-gray-900 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-gray-500 transition-colors"
            >
              <svg className="w-5 h-5" fill="currentColor" viewBox="0 0 24 24">
                <path d="M12.017 0C5.396 0 .029 5.367.029 11.987c0 5.079 3.158 9.417 7.618 11.174-.105-.949-.199-2.403.041-3.439.219-.937 1.406-5.957 1.406-5.957s-.359-.72-.359-1.781c0-1.663.967-2.911 2.168-2.911 1.024 0 1.518.769 1.518 1.688 0 1.029-.653 2.567-.992 3.992-.285 1.193.6 2.165 1.775 2.165 2.128 0 3.768-2.245 3.768-5.487 0-2.861-2.063-4.869-5.008-4.869-3.41 0-5.409 2.562-5.409 5.199 0 1.033.394 2.143.889 2.741.099.12.112.225.085.345-.09.375-.293 1.199-.334 1.363-.053.225-.172.271-.402.165-1.495-.69-2.433-2.878-2.433-4.646 0-3.776 2.748-7.252 7.92-7.252 4.158 0 7.392 2.967 7.392 6.923 0 4.135-2.607 7.462-6.233 7.462-1.214 0-2.357-.629-2.746-1.378l-.748 2.853c-.271 1.043-1.002 2.35-1.492 3.146C9.57 23.812 10.763 24.009 12.017 24c6.624 0 11.99-5.367 11.99-11.987C24.007 5.367 18.641.001 12.017.001z"/>
              </svg>
            </button>
          </div>

          <div className="mt-6 text-center text-sm">
            <p className="text-gray-400">
              {t('auth.login.noAccount')}{' '}
              <Link href="/signup" className="font-medium text-yellow-400 hover:text-yellow-300">
                {t('auth.login.signup')}
              </Link>
            </p>
          </div>
        </AuthCard>
      </div>
    </div>
  );
}

