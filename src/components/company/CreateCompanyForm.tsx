'use client';

import { useState } from 'react';
import { motion } from 'framer-motion';
import { Building, Upload, User, Mail, Phone, Check, X } from 'lucide-react';
import { CompanyService, CreateCompanyData } from '@/lib/companyService';
import { useAuth } from '@/contexts/AuthContext';
import NotificationDrawer, { NotificationData } from '@/components/ui/NotificationDrawer';

interface CreateCompanyFormProps {
  onSuccess?: () => void;
  onCancel?: () => void;
}

const AVAILABLE_MODULES = [
  'Techniques de vente avancées',
  'Présentation de projet efficace',
  'Management d\'équipe',
  'Stratégies marketing',
  'Communication digitale',
  'Présentation financière',
  'Négociation commerciale',
  'Développement personnel'
];

export default function CreateCompanyForm({ onSuccess, onCancel }: CreateCompanyFormProps) {
  const { user } = useAuth();
  const [isLoading, setIsLoading] = useState(false);
  const [notification, setNotification] = useState<NotificationData | null>(null);
  const [formData, setFormData] = useState({
    name: '',
    domain: '',
    logo: '',
    employeeCount: 0,
    rhFirstName: '',
    rhLastName: '',
    rhEmail: '',
    rhPhone: '',
    modules: [] as string[]
  });
  const [errors, setErrors] = useState<Record<string, string>>({});

  const handleInputChange = (field: string, value: any) => {
    setFormData(prev => ({ ...prev, [field]: value }));
    // Effacer l'erreur quand l'utilisateur commence à taper
    if (errors[field]) {
      setErrors(prev => ({ ...prev, [field]: '' }));
    }
  };

  const handleModuleToggle = (module: string) => {
    setFormData(prev => ({
      ...prev,
      modules: prev.modules.includes(module)
        ? prev.modules.filter(m => m !== module)
        : [...prev.modules, module]
    }));
  };

  const validateForm = () => {
    const newErrors: Record<string, string> = {};

    if (!formData.name.trim()) newErrors.name = 'Le nom de l\'entreprise est requis';
    if (!formData.domain.trim()) newErrors.domain = 'Le domaine d\'activité est requis';
    if (formData.employeeCount <= 0) newErrors.employeeCount = 'Le nombre d\'employés doit être supérieur à 0';
    if (!formData.rhFirstName.trim()) newErrors.rhFirstName = 'Le prénom du RH est requis';
    if (!formData.rhLastName.trim()) newErrors.rhLastName = 'Le nom du RH est requis';
    if (!formData.rhEmail.trim()) newErrors.rhEmail = 'L\'email du RH est requis';
    if (!formData.rhPhone.trim()) newErrors.rhPhone = 'Le téléphone du RH est requis';
    if (formData.modules.length === 0) newErrors.modules = 'Sélectionnez au moins un module';

    // Validation email
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (formData.rhEmail && !emailRegex.test(formData.rhEmail)) {
      newErrors.rhEmail = 'Format d\'email invalide';
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

    const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!validateForm()) return;
    if (!user) {
      setNotification({
        type: 'error',
        title: 'Erreur de connexion',
        message: 'Vous devez être connecté pour créer une entreprise.',
        duration: 5000
      });
      return;
    }

    setIsLoading(true);

    try {
      const companyData: CreateCompanyData = {
        name: formData.name,
        domain: formData.domain,
        logo: formData.logo,
        employeeCount: formData.employeeCount,
        rhName: `${formData.rhFirstName} ${formData.rhLastName}`,
        rhEmail: formData.rhEmail,
        rhPhone: formData.rhPhone,
        modules: formData.modules
      };

      const { company, rhUser, error } = await CompanyService.createCompany(companyData, user.id);

      if (error) {
        console.error('Erreur lors de la création:', error);
        
        if (error.code === 'EMAIL_EXISTS') {
          setNotification({
            type: 'error',
            title: 'Email déjà utilisé',
            message: error.message,
            duration: 8000
          });
        } else {
          setNotification({
            type: 'error',
            title: 'Erreur de création',
            message: 'Erreur lors de la création de l\'entreprise. Veuillez réessayer.',
            duration: 5000
          });
        }
        return;
      }

      const tempPassword = `Welcome${new Date().getFullYear()}!`;
      
      console.log('🎉 Affichage de la notification de succès');
      const notificationData = {
        type: 'success' as const,
        title: 'Entreprise créée avec succès !',
        message: `L'entreprise "${formData.name}" a été créée et un email de bienvenue a été envoyé au RH.`,
        details: {
          email: formData.rhEmail,
          password: tempPassword,
          companyName: formData.name
        },
        duration: 0 // Ne pas fermer automatiquement pour permettre la copie des identifiants
      };
      
      console.log('✅ Notification à définir:', notificationData);
      setNotification(notificationData);
      console.log('✅ setNotification appelé');
      console.log('✅ État notification après setNotification:', notification);
      
      if (onSuccess) {
        onSuccess();
      }
    } catch (error) {
      console.error('Erreur:', error);
      setNotification({
        type: 'error',
        title: 'Erreur inattendue',
        message: 'Une erreur inattendue s\'est produite. Veuillez réessayer.',
        duration: 5000
      });
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      exit={{ opacity: 0, y: -20 }}
      className="bg-gray-900/95 backdrop-blur-md rounded-xl shadow-xl border border-gray-800/50 p-6 max-w-4xl mx-auto text-white"
    >
      <div className="flex items-center justify-between mb-8">
        <div className="flex items-center space-x-4">
          <div className="w-12 h-12 bg-gradient-to-r from-yellow-400 to-yellow-500 rounded-lg flex items-center justify-center">
            <Building className="w-6 h-6 text-black" />
          </div>
          <div>
            <h2 className="text-2xl font-bold text-white">Créer une nouvelle entreprise</h2>
            <p className="text-gray-400">Création d'entreprise B2B</p>
          </div>
        </div>
        {onCancel && (
          <button
            onClick={onCancel}
            className="text-gray-400 hover:text-white transition-colors p-2 rounded-full hover:bg-gray-800/50"
          >
            <X className="w-5 h-5" />
          </button>
        )}
      </div>

      <form onSubmit={handleSubmit} className="space-y-8">
        {/* Informations de l'entreprise */}
        <div className="space-y-6">
          <h3 className="text-xl font-semibold text-white border-b border-gray-700/50 pb-3">Informations de l'entreprise</h3>
          
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div>
              <label className="block text-sm font-medium text-gray-300 mb-2">
                Nom de l'entreprise *
              </label>
              <input
                type="text"
                value={formData.name}
                onChange={(e) => handleInputChange('name', e.target.value)}
                placeholder="Ex: TechCorp Solutions"
                className={`w-full px-4 py-3 bg-gray-800/50 border rounded-lg focus:outline-none focus:ring-2 focus:ring-yellow-400/50 text-white placeholder-gray-400 ${
                  errors.name ? 'border-red-500' : 'border-gray-700/50'
                }`}
              />
              {errors.name && <p className="text-red-400 text-xs mt-2">{errors.name}</p>}
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-300 mb-2">
                Domaine d'activité *
              </label>
              <input
                type="text"
                value={formData.domain}
                onChange={(e) => handleInputChange('domain', e.target.value)}
                placeholder="Ex: Technologies de l'information"
                className={`w-full px-4 py-3 bg-gray-800/50 border rounded-lg focus:outline-none focus:ring-2 focus:ring-yellow-400/50 text-white placeholder-gray-400 ${
                  errors.domain ? 'border-red-500' : 'border-gray-700/50'
                }`}
              />
              {errors.domain && <p className="text-red-400 text-xs mt-2">{errors.domain}</p>}
            </div>
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-300 mb-2">
              Logo de l'entreprise
            </label>
            <div className="flex items-center space-x-3">
              <button
                type="button"
                className="flex items-center space-x-3 px-4 py-3 bg-gray-800/50 border border-gray-700/50 rounded-lg hover:bg-gray-700/50 transition-colors text-gray-300 hover:text-white"
              >
                <Upload className="w-4 h-4" />
                <span>Cliquez pour télécharger le logo de l'entreprise</span>
              </button>
            </div>
            <p className="text-xs text-gray-500 mt-2">
              Formats acceptés: JPG, PNG, SVG (max 2MB)
            </p>
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-300 mb-2">
              Nombre d'employés à former *
            </label>
            <input
              type="number"
              min="1"
              value={formData.employeeCount}
              onChange={(e) => handleInputChange('employeeCount', parseInt(e.target.value) || 0)}
              className={`w-full px-4 py-3 bg-gray-800/50 border rounded-lg focus:outline-none focus:ring-2 focus:ring-yellow-400/50 text-white placeholder-gray-400 ${
                errors.employeeCount ? 'border-red-500' : 'border-gray-700/50'
              }`}
            />
            {errors.employeeCount && <p className="text-red-400 text-xs mt-2">{errors.employeeCount}</p>}
          </div>
        </div>

        {/* Contact RH */}
        <div className="space-y-6">
          <h3 className="text-xl font-semibold text-white border-b border-gray-700/50 pb-3">Contact RH</h3>
          
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div>
              <label className="block text-sm font-medium text-gray-300 mb-2">
                Prénom du RH *
              </label>
              <div className="relative">
                <User className="absolute left-4 top-1/2 transform -translate-y-1/2 w-4 h-4 text-gray-400" />
                <input
                  type="text"
                  value={formData.rhFirstName}
                  onChange={(e) => handleInputChange('rhFirstName', e.target.value)}
                  placeholder="Ex: Marie"
                  className={`w-full pl-12 pr-4 py-3 bg-gray-800/50 border rounded-lg focus:outline-none focus:ring-2 focus:ring-yellow-400/50 text-white placeholder-gray-400 ${
                    errors.rhFirstName ? 'border-red-500' : 'border-gray-700/50'
                  }`}
                />
              </div>
              {errors.rhFirstName && <p className="text-red-400 text-xs mt-2">{errors.rhFirstName}</p>}
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-300 mb-2">
                Nom du RH *
              </label>
              <div className="relative">
                <User className="absolute left-4 top-1/2 transform -translate-y-1/2 w-4 h-4 text-gray-400" />
                <input
                  type="text"
                  value={formData.rhLastName}
                  onChange={(e) => handleInputChange('rhLastName', e.target.value)}
                  placeholder="Ex: Dupont"
                  className={`w-full pl-12 pr-4 py-3 bg-gray-800/50 border rounded-lg focus:outline-none focus:ring-2 focus:ring-yellow-400/50 text-white placeholder-gray-400 ${
                    errors.rhLastName ? 'border-red-500' : 'border-gray-700/50'
                  }`}
                />
              </div>
              {errors.rhLastName && <p className="text-red-400 text-xs mt-2">{errors.rhLastName}</p>}
            </div>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div>
              <label className="block text-sm font-medium text-gray-300 mb-2">
                Email du RH *
              </label>
              <div className="relative">
                <Mail className="absolute left-4 top-1/2 transform -translate-y-1/2 w-4 h-4 text-gray-400" />
                <input
                  type="email"
                  value={formData.rhEmail}
                  onChange={(e) => handleInputChange('rhEmail', e.target.value)}
                  placeholder="marie.dupont@entreprise.com"
                  className={`w-full pl-12 pr-4 py-3 bg-gray-800/50 border rounded-lg focus:outline-none focus:ring-2 focus:ring-yellow-400/50 text-white placeholder-gray-400 ${
                    errors.rhEmail ? 'border-red-500' : 'border-gray-700/50'
                  }`}
                />
              </div>
              {errors.rhEmail && <p className="text-red-400 text-xs mt-2">{errors.rhEmail}</p>}
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-300 mb-2">
                Téléphone du RH *
              </label>
              <div className="relative">
                <Phone className="absolute left-4 top-1/2 transform -translate-y-1/2 w-4 h-4 text-gray-400" />
                <input
                  type="tel"
                  value={formData.rhPhone}
                  onChange={(e) => handleInputChange('rhPhone', e.target.value)}
                  placeholder="+33 1 23 45 67 89"
                  className={`w-full pl-12 pr-4 py-3 bg-gray-800/50 border rounded-lg focus:outline-none focus:ring-2 focus:ring-yellow-400/50 text-white placeholder-gray-400 ${
                    errors.rhPhone ? 'border-red-500' : 'border-gray-700/50'
                  }`}
                />
              </div>
              {errors.rhPhone && <p className="text-red-400 text-xs mt-2">{errors.rhPhone}</p>}
            </div>
          </div>
        </div>

        {/* Modules attribués */}
        <div className="space-y-6">
          <h3 className="text-xl font-semibold text-white border-b border-gray-700/50 pb-3">Modules attribués</h3>
          
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {AVAILABLE_MODULES.map((module) => (
              <label key={module} className="flex items-center space-x-3 p-4 bg-gray-800/30 border border-gray-700/50 rounded-lg hover:bg-gray-700/30 cursor-pointer transition-colors">
                <input
                  type="checkbox"
                  checked={formData.modules.includes(module)}
                  onChange={() => handleModuleToggle(module)}
                  className="w-4 h-4 text-yellow-400 border-gray-600 rounded focus:ring-yellow-400/50 bg-gray-800"
                />
                <span className="text-sm text-gray-300">{module}</span>
              </label>
            ))}
          </div>
          
          {errors.modules && <p className="text-red-400 text-xs">{errors.modules}</p>}
          
          <p className="text-sm text-gray-400">
            Sélectionnez au moins un module pour cette entreprise
          </p>
        </div>

        {/* Boutons */}
        <div className="flex justify-end space-x-4 pt-8 border-t border-gray-700/50">
          {onCancel && (
            <button
              type="button"
              onClick={onCancel}
              className="px-6 py-3 text-gray-300 bg-gray-800/50 border border-gray-700/50 rounded-lg hover:bg-gray-700/50 hover:text-white transition-colors"
            >
              Annuler
            </button>
          )}
          <button
            type="submit"
            disabled={isLoading}
            className="px-8 py-3 bg-gradient-to-r from-yellow-400 to-yellow-500 text-black font-semibold rounded-lg hover:from-yellow-500 hover:to-yellow-600 transition-all disabled:opacity-50 disabled:cursor-not-allowed flex items-center space-x-2"
          >
            {isLoading ? (
              <>
                <div className="w-4 h-4 border-2 border-black border-t-transparent rounded-full animate-spin"></div>
                <span>Création en cours...</span>
              </>
            ) : (
              <>
                <Check className="w-4 h-4" />
                <span>Créer l'entreprise</span>
              </>
            )}
          </button>
        </div>
      </form>



      {/* Notification Drawer */}
      <NotificationDrawer
        notification={notification}
        onClose={() => setNotification(null)}
      />
    </motion.div>
  );
}
