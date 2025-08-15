'use client';

import { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { Building, Users, Calendar, Plus, Eye, Edit, Trash2, Target, TrendingUp } from 'lucide-react';
import { CompanyService } from '@/lib/companyService';
import { useAuth } from '@/contexts/AuthContext';
import CreateCompanyModal from '@/components/company/CreateCompanyModal';

export default function CompanyList() {
  const { user } = useAuth();
  const [companies, setCompanies] = useState<any[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [showCreateModal, setShowCreateModal] = useState(false);

  useEffect(() => {
    if (user) {
      loadCompanies();
    }
  }, [user]);

  const loadCompanies = async () => {
    if (!user) return;

    try {
      setIsLoading(true);
      console.log('🔄 Chargement des entreprises pour le coach:', user.id);
      const companiesData = await CompanyService.getCompaniesByCoach(user.id);
      console.log('📊 Données des entreprises reçues:', companiesData);
      setCompanies(companiesData);
    } catch (error) {
      console.error('Erreur lors du chargement des entreprises:', error);
    } finally {
      setIsLoading(false);
    }
  };

  const handleCompanyCreated = () => {
    loadCompanies();
  };

  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleDateString('fr-FR', {
      year: 'numeric',
      month: 'long',
      day: 'numeric'
    });
  };

  const totalEmployees = companies.reduce((total, company) => total + company.employee_count, 0);

  if (isLoading) {
    return (
      <div className="flex items-center justify-center h-64">
        <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-yellow-400"></div>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h2 className="text-2xl font-bold text-white mb-2">
            Entreprises B2B
          </h2>
          <p className="text-gray-400">
            Gérez vos partenariats avec les entreprises
          </p>
        </div>
        <button
          onClick={() => setShowCreateModal(true)}
          className="bg-gradient-to-r from-yellow-400 to-yellow-500 text-black font-semibold px-6 py-3 rounded-lg hover:shadow-lg transition-all flex items-center space-x-2"
        >
          <Plus className="w-5 h-5" />
          <span>Créer une entreprise</span>
        </button>
      </div>

      {/* Stats */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        <motion.div 
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.1 }}
          className="bg-gray-800/30 rounded-xl p-4 border border-gray-700/50"
        >
          <div className="flex items-center space-x-3">
            <div className="w-10 h-10 bg-blue-500/20 rounded-lg flex items-center justify-center">
              <Building className="w-5 h-5 text-blue-400" />
            </div>
            <div>
              <div className="text-2xl font-bold text-white">{companies.length}</div>
              <div className="text-sm text-gray-400">Entreprises</div>
            </div>
          </div>
        </motion.div>

        <motion.div 
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.2 }}
          className="bg-gray-800/30 rounded-xl p-4 border border-gray-700/50"
        >
          <div className="flex items-center space-x-3">
            <div className="w-10 h-10 bg-cyan-500/20 rounded-lg flex items-center justify-center">
              <Users className="w-5 h-5 text-cyan-400" />
            </div>
            <div>
              <div className="text-2xl font-bold text-white">{totalEmployees}</div>
              <div className="text-sm text-gray-400">Employés total</div>
            </div>
          </div>
        </motion.div>

        <motion.div 
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.3 }}
          className="bg-gray-800/30 rounded-xl p-4 border border-gray-700/50"
        >
          <div className="flex items-center space-x-3">
            <div className="w-10 h-10 bg-green-500/20 rounded-lg flex items-center justify-center">
              <Target className="w-5 h-5 text-green-400" />
            </div>
            <div>
              <div className="text-2xl font-bold text-white">{companies.length}</div>
              <div className="text-sm text-gray-400">RH actifs</div>
            </div>
          </div>
        </motion.div>
      </div>

      {/* Companies Grid */}
      {companies.length > 0 ? (
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          {companies.map((company, index) => (
            <motion.div
              key={company.id}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: index * 0.1 }}
              className="bg-gray-800/30 backdrop-blur-sm rounded-xl overflow-hidden border border-gray-700/50 hover:border-yellow-400/30 transition-all"
            >
              {/* Header de la carte */}
              <div className="p-6 border-b border-gray-700/50">
                <div className="flex items-center justify-between mb-4">
                  <div className="w-12 h-12 bg-gradient-to-r from-blue-500 to-purple-600 rounded-lg flex items-center justify-center">
                    <Building className="w-6 h-6 text-white" />
                  </div>
                  <span className={`px-2 py-1 text-xs font-medium rounded-full ${
                    company.status === 'active' 
                      ? 'bg-green-900/50 text-green-400' 
                      : 'bg-red-900/50 text-red-400'
                  }`}>
                    {company.status === 'active' ? 'Active' : 'Inactive'}
                  </span>
                </div>
                
                <h3 className="text-lg font-semibold text-white mb-2">{company.name}</h3>
                <p className="text-sm text-gray-400 mb-3">{company.domain}</p>
                
                <div className="flex items-center space-x-4 text-sm text-gray-400">
                  <div className="flex items-center space-x-1">
                    <Users className="w-4 h-4" />
                    <span>{company.employee_count} employés</span>
                  </div>
                  <div className="flex items-center space-x-1">
                    <Calendar className="w-4 h-4" />
                    <span>{formatDate(company.created_at)}</span>
                  </div>
                </div>
              </div>

              {/* Contact RH */}
              <div className="p-6 bg-gray-800/20">
                <h4 className="text-sm font-medium text-white mb-3">Contact RH</h4>
                <div className="space-y-2">
                  <p className="text-sm text-gray-300">
                    <span className="font-medium">{company.rh_user?.name}</span>
                  </p>
                  <p className="text-sm text-gray-400">{company.rh_user?.email}</p>
                  <p className="text-sm text-gray-400">{company.rh_user?.phone}</p>
                </div>
              </div>

              {/* Actions */}
              <div className="p-4 bg-gray-800/30 border-t border-gray-700/50">
                <div className="flex items-center justify-between">
                  <button className="flex items-center space-x-1 text-blue-400 hover:text-blue-300 text-sm font-medium">
                    <Eye className="w-4 h-4" />
                    <span>Voir</span>
                  </button>
                  <button className="flex items-center space-x-1 text-gray-400 hover:text-gray-300 text-sm font-medium">
                    <Edit className="w-4 h-4" />
                    <span>Modifier</span>
                  </button>
                  <button className="flex items-center space-x-1 text-red-400 hover:text-red-300 text-sm font-medium">
                    <Trash2 className="w-4 h-4" />
                    <span>Supprimer</span>
                  </button>
                </div>
              </div>
            </motion.div>
          ))}
        </div>
      ) : (
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="text-center py-12"
        >
          <div className="w-24 h-24 bg-gray-800/50 rounded-full flex items-center justify-center mx-auto mb-4">
            <Building className="w-12 h-12 text-gray-400" />
          </div>
          <h3 className="text-xl font-semibold text-white mb-2">Aucune entreprise</h3>
          <p className="text-gray-400 mb-6">
            Commencez par créer votre première entreprise partenaire
          </p>
          <button
            onClick={() => setShowCreateModal(true)}
            className="bg-gradient-to-r from-yellow-400 to-yellow-500 text-black font-semibold px-6 py-3 rounded-lg hover:shadow-lg transition-all flex items-center space-x-2 mx-auto"
          >
            <Plus className="w-5 h-5" />
            <span>Créer la première entreprise</span>
          </button>
        </motion.div>
      )}

      {/* Recent Activity */}
      {companies.length > 0 && (
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.4 }}
          className="bg-gray-800/30 rounded-xl p-6 border border-gray-700/50"
        >
          <div className="flex items-center justify-between mb-4">
            <h3 className="text-lg font-semibold text-white">Activité récente</h3>
            <TrendingUp className="w-5 h-5 text-yellow-400" />
          </div>
          <div className="space-y-3">
            {companies.slice(0, 3).map((company, index) => (
              <div key={company.id} className="flex items-center space-x-3">
                <div className="w-8 h-8 bg-blue-500/20 rounded-full flex items-center justify-center">
                  <Building className="w-4 h-4 text-blue-400" />
                </div>
                <div className="flex-1">
                  <p className="text-white text-sm">
                    <span className="font-medium">{company.name}</span> a rejoint la plateforme
                  </p>
                  <p className="text-gray-400 text-xs">
                    {formatDate(company.created_at)}
                  </p>
                </div>
                <div className="text-xs text-gray-500">
                  {company.employee_count} employés
                </div>
              </div>
            ))}
          </div>
        </motion.div>
      )}

      {/* Modal de création */}
      <CreateCompanyModal
        isOpen={showCreateModal}
        onClose={() => setShowCreateModal(false)}
        onSuccess={handleCompanyCreated}
      />
    </div>
  );
}
