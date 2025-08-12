'use client';

import { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { X, Save, Building, Upload, Mail, Phone, User, Target } from 'lucide-react';
import { Company } from './CompanyCard';

interface CompanyFormProps {
  isOpen: boolean;
  onClose: () => void;
  onSubmit: (companyData: Partial<Company>) => void;
  editingCompany?: Company | null;
  availableModules: string[];
}

export default function CompanyForm({ 
  isOpen, 
  onClose, 
  onSubmit, 
  editingCompany, 
  availableModules 
}: CompanyFormProps) {
  const [formData, setFormData] = useState({
    name: '',
    logo: '',
    industry: '',
    employeeCount: 0,
    hrName: '',
    hrEmail: '',
    hrPhone: '',
    modules: [] as string[]
  });

  const [isSubmitting, setIsSubmitting] = useState(false);
  const [logoPreview, setLogoPreview] = useState<string>('');

  useEffect(() => {
    if (editingCompany) {
      setFormData({
        name: editingCompany.name,
        logo: editingCompany.logo,
        industry: editingCompany.industry,
        employeeCount: editingCompany.employeeCount,
        hrName: editingCompany.hrName,
        hrEmail: editingCompany.hrEmail,
        hrPhone: editingCompany.hrPhone,
        modules: editingCompany.modules
      });
      setLogoPreview(editingCompany.logo);
    } else {
      setFormData({
        name: '',
        logo: '',
        industry: '',
        employeeCount: 0,
        hrName: '',
        hrEmail: '',
        hrPhone: '',
        modules: []
      });
      setLogoPreview('');
    }
  }, [editingCompany, isOpen]);

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>) => {
    const { name, value } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: name === 'employeeCount' ? parseInt(value) || 0 : value,
    }));
  };

  const handleLogoChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      const reader = new FileReader();
      reader.onload = (e) => {
        const result = e.target?.result as string;
        setLogoPreview(result);
        setFormData(prev => ({ ...prev, logo: result }));
      };
      reader.readAsDataURL(file);
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

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsSubmitting(true);

    try {
      await onSubmit(formData);
      onClose();
    } catch (error) {
      console.error('Erreur lors de la création de l\'entreprise:', error);
    } finally {
      setIsSubmitting(false);
    }
  };

  if (!isOpen) return null;

  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
      className="fixed inset-0 bg-black bg-opacity-50 backdrop-blur-sm z-50 flex items-center justify-center p-4"
      onClick={onClose}
    >
      <motion.div
        initial={{ scale: 0.9, opacity: 0 }}
        animate={{ scale: 1, opacity: 1 }}
        exit={{ scale: 0.9, opacity: 0 }}
        className="bg-gray-800/95 backdrop-blur-sm rounded-xl border border-gray-700/50 w-full max-w-2xl max-h-[90vh] overflow-y-auto"
        onClick={(e) => e.stopPropagation()}
      >
        <div className="flex items-center justify-between p-6 border-b border-gray-700/50">
          <div className="flex items-center space-x-3">
            <div className="w-10 h-10 bg-blue-500/20 rounded-lg flex items-center justify-center">
              <Building className="w-5 h-5 text-blue-400" />
            </div>
            <div>
              <h2 className="text-xl font-semibold text-white">
                {editingCompany ? 'Modifier l\'entreprise' : 'Créer une nouvelle entreprise'}
              </h2>
              <p className="text-sm text-gray-400">
                {editingCompany ? 'Modification' : 'Création'} d'entreprise B2B
              </p>
            </div>
          </div>
          <button
            onClick={onClose}
            className="w-8 h-8 bg-gray-700/50 rounded-lg flex items-center justify-center text-gray-400 hover:text-white hover:bg-gray-700 transition-all"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        <form onSubmit={handleSubmit} className="p-6 space-y-6">
          {/* Company Info */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <label className="block text-sm font-medium text-gray-300 mb-2">
                Nom de l'entreprise *
              </label>
              <input
                type="text"
                name="name"
                value={formData.name}
                onChange={handleInputChange}
                required
                className="w-full px-4 py-3 bg-gray-700/50 border border-gray-600/50 rounded-lg text-white placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                placeholder="Ex: TechCorp Solutions"
              />
            </div>
            
            <div>
              <label className="block text-sm font-medium text-gray-300 mb-2">
                Domaine d'activité *
              </label>
              <input
                type="text"
                name="industry"
                value={formData.industry}
                onChange={handleInputChange}
                required
                className="w-full px-4 py-3 bg-gray-700/50 border border-gray-600/50 rounded-lg text-white placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                placeholder="Ex: Technologies de l'information"
              />
            </div>
          </div>

          {/* Logo Upload */}
          <div>
            <label className="block text-sm font-medium text-gray-300 mb-2">
              Logo de l'entreprise
            </label>
            <div className="flex items-center space-x-4">
              <div className="relative">
                <div className="w-20 h-20 rounded-xl bg-gradient-to-br from-blue-500 to-blue-600 flex items-center justify-center overflow-hidden border-2 border-gray-600/50">
                  {logoPreview ? (
                    <img src={logoPreview} alt="Logo preview" className="w-full h-full object-cover" />
                  ) : (
                    <Upload className="w-8 h-8 text-white" />
                  )}
                </div>
                <input
                  type="file"
                  accept="image/*"
                  onChange={handleLogoChange}
                  className="absolute inset-0 w-full h-full opacity-0 cursor-pointer"
                />
              </div>
              <div className="flex-1">
                <p className="text-sm text-gray-400">
                  Cliquez pour télécharger le logo de l'entreprise
                </p>
                <p className="text-xs text-gray-500">
                  Formats acceptés: JPG, PNG, SVG (max 2MB)
                </p>
              </div>
            </div>
          </div>

          {/* Employee Count */}
          <div>
            <label className="block text-sm font-medium text-gray-300 mb-2">
              Nombre d'employés *
            </label>
            <input
              type="number"
              name="employeeCount"
              value={formData.employeeCount}
              onChange={handleInputChange}
              required
              min="1"
              max="10000"
              className="w-full px-4 py-3 bg-gray-700/50 border border-gray-600/50 rounded-lg text-white placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
              placeholder="Ex: 150"
            />
          </div>

          {/* HR Contact Info */}
          <div className="space-y-4">
            <h3 className="text-lg font-medium text-white flex items-center space-x-2">
              <User className="w-5 h-5 text-blue-400" />
              <span>Contact RH</span>
            </h3>
            
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <label className="block text-sm font-medium text-gray-300 mb-2">
                  Nom du RH *
                </label>
                <input
                  type="text"
                  name="hrName"
                  value={formData.hrName}
                  onChange={handleInputChange}
                  required
                  className="w-full px-4 py-3 bg-gray-700/50 border border-gray-600/50 rounded-lg text-white placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                  placeholder="Ex: Marie Dupont"
                />
              </div>
              
              <div>
                <label className="block text-sm font-medium text-gray-300 mb-2">
                  Email du RH *
                </label>
                <div className="relative">
                  <Mail className="absolute left-3 top-1/2 transform -translate-y-1/2 w-5 h-5 text-gray-400" />
                  <input
                    type="email"
                    name="hrEmail"
                    value={formData.hrEmail}
                    onChange={handleInputChange}
                    required
                    className="w-full pl-10 pr-4 py-3 bg-gray-700/50 border border-gray-600/50 rounded-lg text-white placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                    placeholder="marie.dupont@entreprise.com"
                  />
                </div>
              </div>
            </div>
            
            <div>
              <label className="block text-sm font-medium text-gray-300 mb-2">
                Téléphone du RH *
              </label>
              <div className="relative">
                <Phone className="absolute left-3 top-1/2 transform -translate-y-1/2 w-5 h-5 text-gray-400" />
                <input
                  type="tel"
                  name="hrPhone"
                  value={formData.hrPhone}
                  onChange={handleInputChange}
                  required
                  className="w-full pl-10 pr-4 py-3 bg-gray-700/50 border border-gray-600/50 rounded-lg text-white placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                  placeholder="+33 1 23 45 67 89"
                />
              </div>
            </div>
          </div>

          {/* Modules Selection */}
          <div>
            <h3 className="text-lg font-medium text-white mb-4 flex items-center space-x-2">
              <Target className="w-5 h-5 text-green-400" />
              <span>Modules attribués</span>
            </h3>
            <div className="grid grid-cols-2 md:grid-cols-3 gap-3">
              {availableModules.map((module) => (
                <label
                  key={module}
                  className={`flex items-center space-x-2 p-3 rounded-lg border cursor-pointer transition-all ${
                    formData.modules.includes(module)
                      ? 'bg-green-500/20 border-green-500/30 text-green-400'
                      : 'bg-gray-700/50 border-gray-600/50 text-gray-300 hover:bg-gray-600/50'
                  }`}
                >
                  <input
                    type="checkbox"
                    checked={formData.modules.includes(module)}
                    onChange={() => handleModuleToggle(module)}
                    className="sr-only"
                  />
                  <div className={`w-4 h-4 rounded border-2 flex items-center justify-center ${
                    formData.modules.includes(module)
                      ? 'bg-green-500 border-green-500'
                      : 'border-gray-400'
                  }`}>
                    {formData.modules.includes(module) && (
                      <div className="w-2 h-2 bg-white rounded-sm"></div>
                    )}
                  </div>
                  <span className="text-sm font-medium">{module}</span>
                </label>
              ))}
            </div>
            {formData.modules.length === 0 && (
              <p className="text-sm text-gray-400 mt-2">
                Sélectionnez au moins un module pour cette entreprise
              </p>
            )}
          </div>

          {/* Actions */}
          <div className="flex items-center justify-end space-x-3 pt-6 border-t border-gray-700/50">
            <button
              type="button"
              onClick={onClose}
              className="px-6 py-3 border border-gray-600/50 text-gray-400 hover:text-white hover:bg-gray-700/50 rounded-lg transition-all"
            >
              Annuler
            </button>
            <button
              type="submit"
              disabled={isSubmitting || formData.modules.length === 0}
              className="px-6 py-3 bg-gradient-to-r from-blue-400 to-blue-500 text-white font-semibold rounded-lg hover:shadow-lg transition-all flex items-center space-x-2 disabled:opacity-50 disabled:cursor-not-allowed"
            >
              {isSubmitting ? (
                <>
                  <div className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin"></div>
                  <span>Enregistrement...</span>
                </>
              ) : (
                <>
                  <Save className="w-4 h-4" />
                  <span>{editingCompany ? 'Modifier' : 'Créer'} l'entreprise</span>
                </>
              )}
            </button>
          </div>
        </form>
      </motion.div>
    </motion.div>
  );
}
