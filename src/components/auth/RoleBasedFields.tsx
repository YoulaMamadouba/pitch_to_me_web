import { User, Briefcase, Award, BookOpen, Clock, Mail, Lock, Eye, EyeOff, Users } from 'lucide-react';
import { useState } from 'react';
import { useLanguageContext } from '@/contexts/LanguageContext';

type UserRole = 'learner' | 'coach' | 'hr';

interface RoleBasedFieldsProps {
  role: UserRole;
  formData: {
    email: string;
    password: string;
    [key: string]: any;
  };
  onInputChange: (e: React.ChangeEvent<HTMLInputElement>) => void;
  onCheckboxChange: (e: React.ChangeEvent<HTMLInputElement>) => void;
  showPassword: boolean;
  setShowPassword: (show: boolean) => void;
}

export default function RoleBasedFields({
  role,
  formData,
  onInputChange,
  onCheckboxChange,
  showPassword,
  setShowPassword,
}: RoleBasedFieldsProps) {
  const { t } = useLanguageContext();
  const [showAdvanced, setShowAdvanced] = useState(false);

  const getDefaultFields = () => (
    <>
      <div>
        <label htmlFor="email" className="block text-gray-300 text-sm font-medium mb-2">
          {t('auth.login.fields.email.label')}
        </label>
        <div className="relative">
          <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
            <Mail className="h-4 w-4 text-gray-400" />
          </div>
          <input
            id="email"
            name="email"
            type="email"
            placeholder={t('auth.login.fields.email.placeholder')}
            value={formData.email}
            onChange={onInputChange}
            className="w-full bg-gray-700 bg-opacity-50 border border-gray-600 rounded-lg pl-10 pr-4 py-3 text-white placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-yellow-400/30 focus:border-yellow-400 transition-all"
            required
          />
        </div>
      </div>

      <div>
        <label htmlFor="password" className="block text-gray-300 text-sm font-medium mb-2">
          {t('auth.login.fields.password.label')}
        </label>
        <div className="relative">
          <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
            <Lock className="h-4 w-4 text-gray-400" />
          </div>
          <input
            id="password"
            name="password"
            type={showPassword ? 'text' : 'password'}
            placeholder={t('auth.login.fields.password.placeholder')}
            value={formData.password}
            onChange={onInputChange}
            className="w-full bg-gray-700 bg-opacity-50 border border-gray-600 rounded-lg pl-10 pr-10 py-3 text-white placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-yellow-400/30 focus:border-yellow-400 transition-all"
            required
          />
          <button
            type="button"
            onClick={() => setShowPassword(!showPassword)}
            className="absolute inset-y-0 right-0 pr-3 flex items-center text-gray-400 hover:text-white transition-colors"
          >
            {showPassword ? (
              <EyeOff className="h-5 w-5" />
            ) : (
              <Eye className="h-5 w-5" />
            )}
          </button>
        </div>
      </div>
    </>
  );

  const getLearnerFields = () => (
    <div className="space-y-4">
      {getDefaultFields()}
      
      <div>
        <label htmlFor="learningGoal" className="block text-gray-300 text-sm font-medium mb-2">
          {t('auth.login.fields.learningGoal.label')}
        </label>
        <div className="relative">
          <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
            <BookOpen className="h-4 w-4 text-blue-400" />
          </div>
          <input
            id="learningGoal"
            name="learningGoal"
            type="text"
            placeholder={t('auth.login.fields.learningGoal.placeholder')}
            value={formData.learningGoal || ''}
            onChange={onInputChange}
            className="w-full bg-gray-700 bg-opacity-50 border border-gray-600 rounded-lg pl-10 pr-4 py-3 text-white placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-blue-400/30 focus:border-blue-400 transition-all"
          />
        </div>
      </div>
    </div>
  );

  const getCoachFields = () => (
    <div className="space-y-4">
      {getDefaultFields()}
      
      <div>
        <label htmlFor="specialization" className="block text-gray-300 text-sm font-medium mb-2">
          {t('auth.login.fields.specialization.label')}
        </label>
        <div className="relative">
          <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
            <Award className="h-4 w-4 text-yellow-400" />
          </div>
          <input
            id="specialization"
            name="specialization"
            type="text"
            placeholder={t('auth.login.fields.specialization.placeholder')}
            value={formData.specialization || ''}
            onChange={onInputChange}
            className="w-full bg-gray-700 bg-opacity-50 border border-gray-600 rounded-lg pl-10 pr-4 py-3 text-white placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-yellow-400/30 focus:border-yellow-400 transition-all"
          />
        </div>
      </div>

      <div>
        <label htmlFor="yearsOfExperience" className="block text-gray-300 text-sm font-medium mb-2">
          {t('auth.login.fields.yearsOfExperience.label')}
        </label>
        <div className="relative">
          <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
            <Clock className="h-4 w-4 text-yellow-400" />
          </div>
          <input
            id="yearsOfExperience"
            name="yearsOfExperience"
            type="number"
            min="0"
            placeholder={t('auth.login.fields.yearsOfExperience.placeholder')}
            value={formData.yearsOfExperience || ''}
            onChange={onInputChange}
            className="w-full bg-gray-700 bg-opacity-50 border border-gray-600 rounded-lg pl-10 pr-4 py-3 text-white placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-yellow-400/30 focus:border-yellow-400 transition-all"
          />
        </div>
      </div>
    </div>
  );

  const getHrFields = () => (
    <div className="space-y-4">
      {getDefaultFields()}
      
      <div>
        <label htmlFor="company" className="block text-gray-300 text-sm font-medium mb-2">
          {t('auth.login.fields.company.label')}
        </label>
        <div className="relative">
          <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
            <Briefcase className="h-4 w-4 text-purple-400" />
          </div>
          <input
            id="company"
            name="company"
            type="text"
            placeholder={t('auth.login.fields.company.placeholder')}
            value={formData.company || ''}
            onChange={onInputChange}
            className="w-full bg-gray-700 bg-opacity-50 border border-gray-600 rounded-lg pl-10 pr-4 py-3 text-white placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-purple-400/30 focus:border-purple-400 transition-all"
          />
        </div>
      </div>

      <div>
        <label htmlFor="department" className="block text-gray-300 text-sm font-medium mb-2">
          {t('auth.login.fields.department.label')}
        </label>
        <div className="relative">
          <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
            <Users className="h-4 w-4 text-purple-400" />
          </div>
          <input
            id="department"
            name="department"
            type="text"
            placeholder={t('auth.login.fields.department.placeholder')}
            value={formData.department || ''}
            onChange={onInputChange}
            className="w-full bg-gray-700 bg-opacity-50 border border-gray-600 rounded-lg pl-10 pr-4 py-3 text-white placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-purple-400/30 focus:border-purple-400 transition-all"
          />
        </div>
      </div>
    </div>
  );

  const renderRoleSpecificFields = () => {
    switch (role) {
      case 'coach':
        return getCoachFields();
      case 'hr':
        return getHrFields();
      case 'learner':
      default:
        return getLearnerFields();
    }
  };

  return (
    <div className="space-y-6">
      {renderRoleSpecificFields()}
      
      <div className="flex items-center justify-between">
        <div className="flex items-center">
          <input
            id="rememberMe"
            name="rememberMe"
            type="checkbox"
            checked={formData.rememberMe || false}
            onChange={onCheckboxChange}
            className="h-4 w-4 text-yellow-500 focus:ring-yellow-400 border-gray-600 rounded bg-gray-700"
          />
          <label htmlFor="rememberMe" className="ml-2 block text-sm text-gray-300">
            {t('auth.login.rememberMe')}
          </label>
        </div>

        <div className="text-sm">
          <a href="/forgot-password" className="font-medium text-yellow-400 hover:text-yellow-300">
            {t('auth.login.forgotPassword')}
          </a>
        </div>
      </div>
    </div>
  );
}
