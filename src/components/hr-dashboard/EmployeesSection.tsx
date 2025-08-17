'use client';

import React, { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { Users, Plus, Search, Filter, Download } from 'lucide-react';
import { createClient } from '@supabase/supabase-js';
import EmployeeCard from './EmployeeCard';
import AddEmployeeButton from './AddEmployeeButton';
import AddEmployeeModal from './AddEmployeeModal';
import { EmployeeCardData } from './EmployeeCard';
import { HRService, HRUser } from '@/lib/hrService';

const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL!;
const supabaseKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!;
const supabase = createClient(supabaseUrl, supabaseKey);

// Données de démonstration
const initialEmployees: EmployeeCardData[] = [
  {
    id: '1',
    name: 'Marie Dupont',
    email: 'marie.dupont@techcorp.com',
    position: 'Responsable Commercial',
    phone: '+33 1 23 45 67 89',
    offerType: 'commercial',
    currentModule: 'Techniques de vente avancées',
    estimatedDuration: 45,
    photo: 'https://images.unsplash.com/photo-1494790108755-2616b612b786?w=150&h=150&fit=crop&crop=face',
    progress: 75,
    status: 'active'
  },
  {
    id: '2',
    name: 'Pierre Martin',
    email: 'pierre.martin@techcorp.com',
    position: 'Chef de Projet Marketing',
    phone: '+33 1 98 76 54 32',
    offerType: 'marketing',
    currentModule: 'Stratégies marketing digital',
    estimatedDuration: 60,
    photo: 'https://images.unsplash.com/photo-1472099645785-5658abf4ff4e?w=150&h=150&fit=crop&crop=face',
    progress: 45,
    status: 'active'
  },
  {
    id: '3',
    name: 'Sophie Bernard',
    email: 'sophie.bernard@techcorp.com',
    position: 'Analyste Financier',
    phone: '+33 1 45 67 89 12',
    offerType: 'finance',
    currentModule: 'Présentation financière',
    estimatedDuration: 30,
    photo: 'https://images.unsplash.com/photo-1438761681033-6461ffad8d80?w=150&h=150&fit=crop&crop=face',
    progress: 90,
    status: 'active'
  },
  {
    id: '4',
    name: 'Thomas Leroy',
    email: 'thomas.leroy@techcorp.com',
    position: 'Manager RH',
    phone: '+33 1 34 56 78 90',
    offerType: 'rh',
    currentModule: 'Management d\'équipe',
    estimatedDuration: 90,
    photo: 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=150&h=150&fit=crop&crop=face',
    progress: 30,
    status: 'active'
  },
  {
    id: '5',
    name: 'Julie Moreau',
    email: 'julie.moreau@techcorp.com',
    position: 'Directeur International',
    phone: '+33 1 56 78 90 12',
    offerType: 'international',
    currentModule: 'Business international',
    estimatedDuration: 120,
    photo: 'https://images.unsplash.com/photo-1544005313-94ddf0286df2?w=150&h=150&fit=crop&crop=face',
    progress: 60,
    status: 'active'
  },
  {
    id: '6',
    name: 'Alexandre Dubois',
    email: 'alexandre.dubois@techcorp.com',
    position: 'Directeur Général',
    phone: '+33 1 67 89 01 23',
    offerType: 'management',
    currentModule: 'Leadership stratégique',
    estimatedDuration: 180,
    photo: 'https://images.unsplash.com/photo-1500648767791-00dcc994a43e?w=150&h=150&fit=crop&crop=face',
    progress: 25,
    status: 'active'
  }
];

export default function EmployeesSection() {
  const [employees, setEmployees] = useState<EmployeeCardData[]>([]);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [searchTerm, setSearchTerm] = useState('');
  const [filterType, setFilterType] = useState<string>('all');
  const [hrUser, setHrUser] = useState<HRUser | null>(null);
  const [loading, setLoading] = useState(true);

  // Récupérer les informations du RH et des employés
  useEffect(() => {
    const fetchData = async () => {
      try {
        const { data: { user } } = await supabase.auth.getUser();
        
        if (!user) {
          console.log('❌ Aucun utilisateur connecté');
          return;
        }

        // Récupérer RH et employés en une seule requête
        const response = await fetch('/api/get-hr-data', {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
          },
          body: JSON.stringify({ userId: user.id }),
        });

        if (!response.ok) {
          const errorData = await response.json();
          throw new Error(errorData.error || 'Erreur lors de la récupération des données');
        }

        const result = await response.json();
        console.log('✅ Données récupérées:', result);
        
        setHrUser(result.hrUser);
        setEmployees(result.employees || []);
        
        // Debug: afficher les données récupérées
        console.log('🔍 Données RH:', result.hrUser);
        console.log('🔍 Nom de l\'entreprise:', result.hrUser?.company?.name);
      } catch (error) {
        console.error('Erreur lors de la récupération des données:', error);
      } finally {
        setLoading(false);
      }
    };

    fetchData();
  }, []);

  const handleAddEmployees = (newEmployees: EmployeeCardData[]) => {
    setEmployees(prev => [...prev, ...newEmployees]);
    setIsModalOpen(false);
  };

  const filteredEmployees = employees.filter(employee => {
    const matchesSearch = employee.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         employee.position.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         employee.email.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesFilter = filterType === 'all' || employee.offerType === filterType;
    return matchesSearch && matchesFilter;
  });

  const offerTypeOptions = [
    { value: 'all', label: 'Tous les types' },
    { value: 'commercial', label: 'Commercial' },
    { value: 'marketing', label: 'Marketing' },
    { value: 'finance', label: 'Finance' },
    { value: 'rh', label: 'Ressources Humaines' },
    { value: 'international', label: 'International' },
    { value: 'management', label: 'Management' }
  ];

  const stats = {
    total: employees.length,
    active: employees.filter(e => e.status === 'active').length,
    inProgress: employees.filter(e => e.progress > 0 && e.progress < 100).length,
    completed: employees.filter(e => e.progress === 100).length
  };

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold text-white mb-2">Employés</h1>
          <p className="text-gray-400">Gérez votre équipe et suivez leurs formations</p>
        </div>
        <AddEmployeeButton onClick={() => setIsModalOpen(true)} />
      </div>

      {/* Stats */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
        <motion.div 
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.1 }}
          className="bg-gradient-to-r from-cyan-500 to-blue-600 rounded-xl p-4"
        >
          <div className="flex items-center justify-between">
            <div>
              <p className="text-cyan-100 text-sm">Total Employés</p>
              <p className="text-2xl font-bold text-white">{stats.total}</p>
            </div>
            <Users className="w-8 h-8 text-white" />
          </div>
        </motion.div>

        <motion.div 
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.2 }}
          className="bg-gradient-to-r from-green-500 to-emerald-600 rounded-xl p-4"
        >
          <div className="flex items-center justify-between">
            <div>
              <p className="text-green-100 text-sm">Actifs</p>
              <p className="text-2xl font-bold text-white">{stats.active}</p>
            </div>
            <div className="w-8 h-8 bg-white bg-opacity-20 rounded-lg flex items-center justify-center">
              <div className="w-4 h-4 bg-white rounded-full"></div>
            </div>
          </div>
        </motion.div>

        <motion.div 
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.3 }}
          className="bg-gradient-to-r from-yellow-500 to-orange-600 rounded-xl p-4"
        >
          <div className="flex items-center justify-between">
            <div>
              <p className="text-yellow-100 text-sm">En cours</p>
              <p className="text-2xl font-bold text-white">{stats.inProgress}</p>
            </div>
            <div className="w-8 h-8 bg-white bg-opacity-20 rounded-lg flex items-center justify-center">
              <div className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin"></div>
            </div>
          </div>
        </motion.div>

        <motion.div 
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.4 }}
          className="bg-gradient-to-r from-purple-500 to-pink-600 rounded-xl p-4"
        >
          <div className="flex items-center justify-between">
            <div>
              <p className="text-purple-100 text-sm">Terminés</p>
              <p className="text-2xl font-bold text-white">{stats.completed}</p>
            </div>
            <div className="w-8 h-8 bg-white bg-opacity-20 rounded-lg flex items-center justify-center">
              <div className="w-4 h-4 bg-white rounded-sm"></div>
            </div>
          </div>
        </motion.div>
      </div>

      {/* Search and Filters */}
      <div className="flex flex-col sm:flex-row gap-4">
        <div className="flex-1 relative">
          <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 w-5 h-5 text-gray-400" />
          <input
            type="text"
            placeholder="Rechercher un employé..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="w-full pl-10 pr-4 py-3 bg-gray-800/50 border border-gray-700/50 rounded-lg text-white placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-cyan-500 focus:border-transparent"
          />
        </div>
        
        <div className="relative">
          <Filter className="absolute left-3 top-1/2 transform -translate-y-1/2 w-5 h-5 text-gray-400" />
          <select
            value={filterType}
            onChange={(e) => setFilterType(e.target.value)}
            className="pl-10 pr-8 py-3 bg-gray-800/50 border border-gray-700/50 rounded-lg text-white focus:outline-none focus:ring-2 focus:ring-cyan-500 focus:border-transparent appearance-none"
          >
            {offerTypeOptions.map(option => (
              <option key={option.value} value={option.value}>
                {option.label}
              </option>
            ))}
          </select>
        </div>

        <button className="px-6 py-3 bg-gray-800/50 border border-gray-700/50 rounded-lg text-white hover:bg-gray-700/50 transition-colors flex items-center space-x-2">
          <Download className="w-5 h-5" />
          <span>Exporter</span>
        </button>
      </div>

      {/* Employees Grid */}
      {filteredEmployees.length > 0 ? (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {filteredEmployees.map((employee, index) => (
            <motion.div
              key={employee.id}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.1 * (index + 1) }}
            >
              <EmployeeCard employee={employee} />
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
            <Users className="w-12 h-12 text-gray-400" />
          </div>
          <h3 className="text-xl font-semibold text-white mb-2">Aucun employé trouvé</h3>
          <p className="text-gray-400 mb-6">
            {searchTerm || filterType !== 'all' 
              ? 'Aucun employé ne correspond à vos critères de recherche'
              : 'Commencez par ajouter votre premier employé'
            }
          </p>
          {!searchTerm && filterType === 'all' && (
            <button
              onClick={() => setIsModalOpen(true)}
              className="bg-gradient-to-r from-cyan-400 to-blue-500 text-white font-semibold px-6 py-3 rounded-lg hover:shadow-lg transition-all flex items-center space-x-2 mx-auto"
            >
              <Plus className="w-5 h-5" />
              <span>Ajouter des employés</span>
            </button>
          )}
        </motion.div>
      )}

      {/* Add Employee Modal */}
      <AddEmployeeModal
        isOpen={isModalOpen}
        onClose={() => setIsModalOpen(false)}
        onSubmit={handleAddEmployees}
        companyId={hrUser?.company_id || ''}
        companyName={hrUser?.company?.name || ''}
      />
      
      {/* Debug info */}
      {process.env.NODE_ENV === 'development' && (
        <div className="fixed bottom-4 right-4 bg-gray-800 p-4 rounded-lg text-xs text-white opacity-75">
          <div>HR User: {hrUser ? '✅' : '❌'}</div>
          <div>Company ID: {hrUser?.company_id || '❌'}</div>
          <div>Company Name: {hrUser?.company?.name || '❌'}</div>
        </div>
      )}
    </div>
  );
}
