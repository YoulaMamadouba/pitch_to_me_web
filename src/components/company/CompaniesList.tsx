'use client';

import { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { Building, Users, Calendar, Plus, Eye, Edit, Trash2 } from 'lucide-react';
import { CompanyService } from '@/lib/companyService';
import { useAuth } from '@/contexts/AuthContext';
import CreateCompanyModal from './CreateCompanyModal';

export default function CompaniesList() {
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
      const companiesData = await CompanyService.getCompaniesByCoach(user.id);
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

  if (isLoading) {
    return (
      <div className="flex items-center justify-center h-64">
        <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-500"></div>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h2 className="text-2xl font-bold text-gray-900">Mes entreprises</h2>
          <p className="text-gray-600">Gérez les entreprises que vous avez créées</p>
        </div>
        <button
          onClick={() => setShowCreateModal(true)}
          className="flex items-center space-x-2 px-4 py-2 bg-gradient-to-r from-blue-500 to-purple-600 text-white rounded-lg hover:from-blue-600 hover:to-purple-700 transition-all"
        >
          <Plus className="w-4 h-4" />
          <span>Créer une entreprise</span>
        </button>
      </div>

      {/* Liste des entreprises */}
      {companies.length === 0 ? (
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="text-center py-12"
        >
          <Building className="w-16 h-16 text-gray-400 mx-auto mb-4" />
          <h3 className="text-lg font-medium text-gray-900 mb-2">Aucune entreprise créée</h3>
          <p className="text-gray-600 mb-6">
            Commencez par créer votre première entreprise pour gérer vos clients B2B.
          </p>
          <button
            onClick={() => setShowCreateModal(true)}
            className="inline-flex items-center space-x-2 px-4 py-2 bg-gradient-to-r from-blue-500 to-purple-600 text-white rounded-lg hover:from-blue-600 hover:to-purple-700 transition-all"
          >
            <Plus className="w-4 h-4" />
            <span>Créer ma première entreprise</span>
          </button>
        </motion.div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {companies.map((company, index) => (
            <motion.div
              key={company.id}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: index * 0.1 }}
              className="bg-white rounded-lg shadow-md border border-gray-200 overflow-hidden hover:shadow-lg transition-shadow"
            >
              {/* Header de la carte */}
              <div className="p-6 border-b border-gray-200">
                <div className="flex items-center justify-between mb-4">
                  <div className="w-12 h-12 bg-gradient-to-r from-blue-500 to-purple-600 rounded-lg flex items-center justify-center">
                    <Building className="w-6 h-6 text-white" />
                  </div>
                  <span className={`px-2 py-1 text-xs font-medium rounded-full ${
                    company.status === 'active' 
                      ? 'bg-green-100 text-green-800' 
                      : 'bg-red-100 text-red-800'
                  }`}>
                    {company.status === 'active' ? 'Active' : 'Inactive'}
                  </span>
                </div>
                
                <h3 className="text-lg font-semibold text-gray-900 mb-2">{company.name}</h3>
                <p className="text-sm text-gray-600 mb-3">{company.domain}</p>
                
                <div className="flex items-center space-x-4 text-sm text-gray-500">
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
              <div className="p-6 bg-gray-50">
                <h4 className="text-sm font-medium text-gray-900 mb-3">Contact RH</h4>
                <div className="space-y-2">
                  <p className="text-sm text-gray-600">
                    <span className="font-medium">{company.rh_user?.name}</span>
                  </p>
                  <p className="text-sm text-gray-600">{company.rh_user?.email}</p>
                  <p className="text-sm text-gray-600">{company.rh_user?.phone}</p>
                </div>
              </div>

              {/* Actions */}
              <div className="p-4 bg-white border-t border-gray-200">
                <div className="flex items-center justify-between">
                  <button className="flex items-center space-x-1 text-blue-600 hover:text-blue-700 text-sm font-medium">
                    <Eye className="w-4 h-4" />
                    <span>Voir</span>
                  </button>
                  <button className="flex items-center space-x-1 text-gray-600 hover:text-gray-700 text-sm font-medium">
                    <Edit className="w-4 h-4" />
                    <span>Modifier</span>
                  </button>
                  <button className="flex items-center space-x-1 text-red-600 hover:text-red-700 text-sm font-medium">
                    <Trash2 className="w-4 h-4" />
                    <span>Supprimer</span>
                  </button>
                </div>
              </div>
            </motion.div>
          ))}
        </div>
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
