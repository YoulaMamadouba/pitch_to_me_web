'use client';

import React, { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { 
  BookOpen, 
  Play, 
  CheckCircle, 
  Clock, 
  Target, 
  Award, 
  TrendingUp,
  User,
  LogOut,
  Settings,
  Bell
} from 'lucide-react';
import { createClient } from '@supabase/supabase-js';
import { useRouter } from 'next/navigation';

const supabase = createClient(
  process.env.NEXT_PUBLIC_SUPABASE_URL!,
  process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!
);

interface Employee {
  id: string;
  name: string;
  email: string;
  role: string;
  company_id: string;
  company?: {
    name: string;
    domain: string;
  };
}

export default function B2BContent() {
  const [employee, setEmployee] = useState<Employee | null>(null);
  const [loading, setLoading] = useState(true);
  const router = useRouter();

  useEffect(() => {
    const fetchEmployee = async () => {
      try {
        const { data: { user } } = await supabase.auth.getUser();
        
        if (!user) {
          router.push('/login');
          return;
        }

        const { data: employeeData, error } = await supabase
          .from('users')
          .select(`
            id,
            name,
            email,
            role,
            company_id,
            companies!fk_user_company (
              name,
              domain
            )
          `)
          .eq('id', user.id)
          .eq('role', 'employee')
          .single();

        if (error) {
          console.error('Erreur lors de la récupération de l\'employé:', error);
          router.push('/login');
          return;
        }

        setEmployee(employeeData);
      } catch (error) {
        console.error('Erreur:', error);
        router.push('/login');
      } finally {
        setLoading(false);
      }
    };

    fetchEmployee();
  }, [router]);

  const handleSignOut = async () => {
    try {
      await supabase.auth.signOut();
      router.push('/login');
    } catch (error) {
      console.error('Erreur lors de la déconnexion:', error);
    }
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center min-h-screen bg-gray-900">
        <div className="text-white text-lg">Chargement...</div>
      </div>
    );
  }

  if (!employee) {
    return (
      <div className="flex items-center justify-center min-h-screen bg-gray-900">
        <div className="text-white text-lg">Accès non autorisé</div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-900 to-gray-800 text-white">
      {/* Header */}
      <header className="bg-gray-900 border-b border-gray-800">
        <div className="max-w-7xl mx-auto px-6 py-4">
          <div className="flex items-center justify-between">
            <div className="flex items-center space-x-4">
              <div className="w-10 h-10 bg-gradient-to-r from-cyan-400 to-blue-500 rounded-lg flex items-center justify-center">
                <BookOpen className="w-6 h-6 text-white" />
              </div>
              <div>
                <h1 className="text-xl font-bold">Pitch To Me</h1>
                <p className="text-sm text-gray-400">Espace B2B - {employee.company?.name}</p>
              </div>
            </div>
            
            <div className="flex items-center space-x-4">
              <button className="p-2 text-gray-400 hover:text-white hover:bg-gray-800 rounded-lg transition-colors">
                <Bell className="w-5 h-5" />
              </button>
              <button className="p-2 text-gray-400 hover:text-white hover:bg-gray-800 rounded-lg transition-colors">
                <Settings className="w-5 h-5" />
              </button>
              <div className="flex items-center space-x-3">
                <div className="w-8 h-8 bg-gradient-to-r from-cyan-400 to-blue-500 rounded-full flex items-center justify-center">
                  <User className="w-4 h-4 text-white" />
                </div>
                <div className="text-sm">
                  <p className="font-medium">{employee.name}</p>
                  <p className="text-gray-400">{employee.role}</p>
                </div>
                <button
                  onClick={handleSignOut}
                  className="p-2 text-gray-400 hover:text-red-400 hover:bg-gray-800 rounded-lg transition-colors"
                >
                  <LogOut className="w-5 h-5" />
                </button>
              </div>
            </div>
          </div>
        </div>
      </header>

      {/* Main Content */}
      <main className="max-w-7xl mx-auto px-6 py-8">
        <div className="space-y-8">
          {/* Welcome Section */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            className="bg-gradient-to-r from-cyan-500 to-blue-600 rounded-xl p-8"
          >
            <div className="flex items-center justify-between">
              <div>
                <h2 className="text-3xl font-bold mb-2">Bienvenue, {employee.name} !</h2>
                <p className="text-cyan-100 text-lg">
                  Prêt à développer vos compétences en pitch et présentation ?
                </p>
                                 <p className="text-cyan-100 mt-2">
                   {employee.company?.name} • {employee.role}
                 </p>
              </div>
              <div className="w-24 h-24 bg-white bg-opacity-20 rounded-full flex items-center justify-center">
                <Award className="w-12 h-12 text-white" />
              </div>
            </div>
          </motion.div>

          {/* Stats */}
          <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.1 }}
              className="bg-gray-800/50 rounded-xl p-6 border border-gray-700/50"
            >
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-gray-400 text-sm">Modules disponibles</p>
                  <p className="text-2xl font-bold">12</p>
                </div>
                <div className="w-12 h-12 bg-blue-500/20 rounded-lg flex items-center justify-center">
                  <BookOpen className="w-6 h-6 text-blue-400" />
                </div>
              </div>
            </motion.div>

            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.2 }}
              className="bg-gray-800/50 rounded-xl p-6 border border-gray-700/50"
            >
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-gray-400 text-sm">En cours</p>
                  <p className="text-2xl font-bold">3</p>
                </div>
                <div className="w-12 h-12 bg-yellow-500/20 rounded-lg flex items-center justify-center">
                  <Clock className="w-6 h-6 text-yellow-400" />
                </div>
              </div>
            </motion.div>

            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.3 }}
              className="bg-gray-800/50 rounded-xl p-6 border border-gray-700/50"
            >
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-gray-400 text-sm">Terminés</p>
                  <p className="text-2xl font-bold">8</p>
                </div>
                <div className="w-12 h-12 bg-green-500/20 rounded-lg flex items-center justify-center">
                  <CheckCircle className="w-6 h-6 text-green-400" />
                </div>
              </div>
            </motion.div>

            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.4 }}
              className="bg-gray-800/50 rounded-xl p-6 border border-gray-700/50"
            >
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-gray-400 text-sm">Progression</p>
                  <p className="text-2xl font-bold">75%</p>
                </div>
                <div className="w-12 h-12 bg-purple-500/20 rounded-lg flex items-center justify-center">
                  <TrendingUp className="w-6 h-6 text-purple-400" />
                </div>
              </div>
            </motion.div>
          </div>

          {/* Quick Actions */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.5 }}
            className="bg-gray-800/50 rounded-xl p-6 border border-gray-700/50"
          >
            <h3 className="text-xl font-bold mb-4">Actions rapides</h3>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
              <button className="p-4 bg-gradient-to-r from-cyan-400 to-blue-500 rounded-lg hover:shadow-lg transition-all flex items-center space-x-3">
                <Play className="w-6 h-6" />
                <span>Continuer ma formation</span>
              </button>
              <button className="p-4 bg-gray-700/50 border border-gray-600/50 rounded-lg hover:bg-gray-600/50 transition-colors flex items-center space-x-3">
                <Target className="w-6 h-6" />
                <span>Voir mes objectifs</span>
              </button>
              <button className="p-4 bg-gray-700/50 border border-gray-600/50 rounded-lg hover:bg-gray-600/50 transition-colors flex items-center space-x-3">
                <Award className="w-6 h-6" />
                <span>Mes certificats</span>
              </button>
            </div>
          </motion.div>

          {/* Recent Activity */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.6 }}
            className="bg-gray-800/50 rounded-xl p-6 border border-gray-700/50"
          >
            <h3 className="text-xl font-bold mb-4">Activité récente</h3>
            <div className="space-y-4">
              <div className="flex items-center space-x-4 p-4 bg-gray-700/30 rounded-lg">
                <div className="w-10 h-10 bg-green-500/20 rounded-lg flex items-center justify-center">
                  <CheckCircle className="w-5 h-5 text-green-400" />
                </div>
                <div className="flex-1">
                  <p className="font-medium">Module "Techniques de vente avancées" terminé</p>
                  <p className="text-sm text-gray-400">Il y a 2 heures</p>
                </div>
                <span className="text-sm text-green-400 font-medium">100%</span>
              </div>
              
              <div className="flex items-center space-x-4 p-4 bg-gray-700/30 rounded-lg">
                <div className="w-10 h-10 bg-yellow-500/20 rounded-lg flex items-center justify-center">
                  <Clock className="w-5 h-5 text-yellow-400" />
                </div>
                <div className="flex-1">
                  <p className="font-medium">Module "Présentation de projet efficace" en cours</p>
                  <p className="text-sm text-gray-400">Il y a 1 jour</p>
                </div>
                <span className="text-sm text-yellow-400 font-medium">65%</span>
              </div>
              
              <div className="flex items-center space-x-4 p-4 bg-gray-700/30 rounded-lg">
                <div className="w-10 h-10 bg-blue-500/20 rounded-lg flex items-center justify-center">
                  <Play className="w-5 h-5 text-blue-400" />
                </div>
                <div className="flex-1">
                  <p className="font-medium">Nouveau module "Management d'équipe" disponible</p>
                  <p className="text-sm text-gray-400">Il y a 3 jours</p>
                </div>
                <span className="text-sm text-blue-400 font-medium">Nouveau</span>
              </div>
            </div>
          </motion.div>
        </div>
      </main>
    </div>
  );
}
