'use client';

import { motion } from 'framer-motion';
import { Plus, Building, Users, Target, TrendingUp } from 'lucide-react';
import CompanyCard, { Company } from './CompanyCard';

interface CompanyListProps {
  companies: Company[];
  onCreateCompany: () => void;
  onEditCompany: (company: Company) => void;
  onDeleteCompany: (companyId: string) => void;
  onViewCompany: (company: Company) => void;
}

export default function CompanyList({ 
  companies, 
  onCreateCompany, 
  onEditCompany, 
  onDeleteCompany, 
  onViewCompany 
}: CompanyListProps) {
  const totalEmployees = companies.reduce((total, company) => total + company.employeeCount, 0);
  const totalModules = companies.reduce((total, company) => total + company.modules.length, 0);

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
          onClick={onCreateCompany}
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
              <div className="text-2xl font-bold text-white">{totalModules}</div>
              <div className="text-sm text-gray-400">Modules actifs</div>
            </div>
          </div>
        </motion.div>
      </div>

      {/* Companies Grid */}
      {companies.length > 0 ? (
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          {companies.map((company, index) => (
            <CompanyCard
              key={company.id}
              company={company}
              onEdit={onEditCompany}
              onDelete={onDeleteCompany}
              onView={onViewCompany}
            />
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
            onClick={onCreateCompany}
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
                    {new Date(company.createdAt).toLocaleDateString('fr-FR')}
                  </p>
                </div>
                <div className="text-xs text-gray-500">
                  {company.employeeCount} employés
                </div>
              </div>
            ))}
          </div>
        </motion.div>
      )}
    </div>
  );
}
