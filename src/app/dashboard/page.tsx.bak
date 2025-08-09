'use client';

import { useState } from 'react';
import Link from 'next/link';
import { 
  Home, 
  BookOpen, 
  Users, 
  User, 
  BarChart3, 
  Play, 
  Trophy,
  TrendingUp,
  Target,
  Calendar,
  ArrowRight
} from 'lucide-react';
import { motion } from 'framer-motion';

export default function DashboardPage() {
  const [activeTab, setActiveTab] = useState('home');

  const navigation = [
    { id: 'home', label: 'Accueil', icon: Home },
    { id: 'modules', label: 'Modules', icon: BookOpen },
    { id: 'community', label: 'Communauté', icon: Users },
    { id: 'profile', label: 'Profil', icon: User }
  ];

  const progressData = {
    overall: 65,
    modules: [
      { name: 'Fondamentaux', progress: 80, color: 'from-green-400 to-green-500' },
      { name: 'Techniques Avancées', progress: 45, color: 'from-blue-400 to-blue-500' },
      { name: 'VR Training', progress: 30, color: 'from-purple-400 to-purple-500' },
      { name: 'Présentation', progress: 90, color: 'from-yellow-400 to-yellow-500' }
    ]
  };

  const recentActivities = [
    { type: 'module', title: 'Module 3 terminé', time: 'Il y a 2h', icon: Trophy },
    { type: 'practice', title: 'Session VR complétée', time: 'Il y a 4h', icon: Play },
    { type: 'achievement', title: 'Badge "Orateur Confiant"', time: 'Il y a 1j', icon: Target }
  ];

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-900 via-blue-900 to-gray-900">
      {/* Fixed Header */}
      <div className="fixed top-0 left-0 right-0 z-50 flex justify-between items-center p-4 bg-black bg-opacity-20 backdrop-blur-sm border-b border-gray-700">
        <div className="text-xl font-bold text-white">Pitch to Me</div>
        <div className="flex items-center space-x-4">
          <div className="w-8 h-8 bg-gradient-to-r from-yellow-400 to-yellow-500 rounded-full flex items-center justify-center">
            <User className="w-4 h-4 text-black" />
          </div>
        </div>
      </div>

      <div className="flex pt-16">
        {/* Sidebar Navigation */}
        <div className="w-64 bg-black bg-opacity-20 min-h-screen p-4">
          <nav className="space-y-2">
            {navigation.map((item) => (
              <button
                key={item.id}
                onClick={() => setActiveTab(item.id)}
                className={`w-full flex items-center space-x-3 p-3 rounded-lg transition-all ${
                  activeTab === item.id
                    ? 'bg-gradient-to-r from-yellow-400 to-yellow-500 text-black'
                    : 'text-white hover:bg-gray-700'
                }`}
              >
                <item.icon className="w-5 h-5" />
                <span className="font-medium">{item.label}</span>
              </button>
            ))}
          </nav>
        </div>

        {/* Main Content */}
        <div className="flex-1 p-6">
          {activeTab === 'home' && (
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6 }}
              className="space-y-6"
            >
              {/* Welcome Section */}
              <div className="bg-gray-800 bg-opacity-50 rounded-xl p-6 border border-gray-700">
                <h1 className="text-2xl font-bold text-white mb-2">
                  Bonjour, Alex ! 👋
                </h1>
                <p className="text-gray-300">
                  Continuez votre progression vers l'excellence en prise de parole
                </p>
              </div>

              {/* Progress Overview */}
              <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                <div className="bg-gray-800 bg-opacity-50 rounded-xl p-6 border border-gray-700">
                  <div className="flex items-center justify-between mb-4">
                    <h3 className="text-white font-semibold">Progression Globale</h3>
                    <BarChart3 className="w-6 h-6 text-yellow-400" />
                  </div>
                  <div className="text-3xl font-bold text-white mb-2">{progressData.overall}%</div>
                  <div className="w-full bg-gray-700 rounded-full h-2">
                    <div 
                      className="bg-gradient-to-r from-yellow-400 to-yellow-500 h-2 rounded-full transition-all"
                      style={{ width: `${progressData.overall}%` }}
                    ></div>
                  </div>
                </div>

                <div className="bg-gray-800 bg-opacity-50 rounded-xl p-6 border border-gray-700">
                  <div className="flex items-center justify-between mb-4">
                    <h3 className="text-white font-semibold">Modules Terminés</h3>
                    <BookOpen className="w-6 h-6 text-cyan-400" />
                  </div>
                  <div className="text-3xl font-bold text-white mb-2">3/12</div>
                  <p className="text-gray-400 text-sm">25% complété</p>
                </div>

                <div className="bg-gray-800 bg-opacity-50 rounded-xl p-6 border border-gray-700">
                  <div className="flex items-center justify-between mb-4">
                    <h3 className="text-white font-semibold">Score Moyen</h3>
                    <Trophy className="w-6 h-6 text-green-400" />
                  </div>
                  <div className="text-3xl font-bold text-white mb-2">85%</div>
                  <p className="text-gray-400 text-sm">Excellent travail !</p>
                </div>
              </div>

              {/* Premium VR Practice Card */}
              <div className="bg-gradient-to-r from-purple-600 to-purple-800 rounded-xl p-6 border border-purple-500 shadow-lg shadow-purple-500/25">
                <div className="flex items-center justify-between mb-4">
                  <div>
                    <h3 className="text-white font-semibold text-xl mb-2">Premium Pratique VR</h3>
                    <p className="text-purple-200">Accédez à des environnements VR immersifs pour pratiquer vos présentations</p>
                  </div>
                  <div className="w-16 h-16 bg-white bg-opacity-20 rounded-full flex items-center justify-center">
                    <Play className="w-8 h-8 text-white" />
                  </div>
                </div>
                <Link
                  href="/vr-scenes"
                  className="inline-flex items-center space-x-2 bg-white text-purple-600 font-semibold py-3 px-6 rounded-lg hover:bg-gray-100 transition-all duration-300"
                >
                  <span>Accéder aux scènes VR</span>
                  <ArrowRight className="w-5 h-5" />
                </Link>
              </div>

              {/* Module Progress */}
              <div className="bg-gray-800 bg-opacity-50 rounded-xl p-6 border border-gray-700">
                <h3 className="text-white font-semibold text-lg mb-4">Progression des Modules</h3>
                <div className="space-y-4">
                  {progressData.modules.map((module, index) => (
                    <div key={module.name} className="flex items-center justify-between">
                      <div className="flex-1">
                        <div className="flex justify-between text-sm mb-1">
                          <span className="text-white">{module.name}</span>
                          <span className="text-gray-400">{module.progress}%</span>
                        </div>
                        <div className="w-full bg-gray-700 rounded-full h-2">
                          <div 
                            className={`bg-gradient-to-r ${module.color} h-2 rounded-full transition-all`}
                            style={{ width: `${module.progress}%` }}
                          ></div>
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              </div>

              {/* Recent Activities */}
              <div className="bg-gray-800 bg-opacity-50 rounded-xl p-6 border border-gray-700">
                <h3 className="text-white font-semibold text-lg mb-4">Activités Récentes</h3>
                <div className="space-y-4">
                  {recentActivities.map((activity, index) => (
                    <div key={index} className="flex items-center space-x-4">
                      <div className="w-10 h-10 bg-gradient-to-r from-yellow-400 to-yellow-500 rounded-full flex items-center justify-center">
                        <activity.icon className="w-5 h-5 text-black" />
                      </div>
                      <div className="flex-1">
                        <div className="text-white font-medium">{activity.title}</div>
                        <div className="text-gray-400 text-sm">{activity.time}</div>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            </motion.div>
          )}

          {activeTab === 'modules' && (
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6 }}
              className="space-y-6"
            >
              <h2 className="text-2xl font-bold text-white mb-6">Mes Modules</h2>
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                {progressData.modules.map((module, index) => (
                  <div key={module.name} className="bg-gray-800 bg-opacity-50 rounded-xl p-6 border border-gray-700 hover:border-gray-600 transition-all">
                    <div className="flex items-center justify-between mb-4">
                      <h3 className="text-white font-semibold">{module.name}</h3>
                      <div className="text-2xl font-bold text-white">{module.progress}%</div>
                    </div>
                    <div className="w-full bg-gray-700 rounded-full h-2 mb-4">
                      <div 
                        className={`bg-gradient-to-r ${module.color} h-2 rounded-full transition-all`}
                        style={{ width: `${module.progress}%` }}
                      ></div>
                    </div>
                    <button className="w-full bg-gradient-to-r from-yellow-400 to-yellow-500 text-black font-semibold py-2 rounded-lg hover:shadow-lg transition-all">
                      Continuer
                    </button>
                  </div>
                ))}
              </div>
            </motion.div>
          )}

          {activeTab === 'community' && (
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6 }}
              className="space-y-6"
            >
              <h2 className="text-2xl font-bold text-white mb-6">Communauté</h2>
              <div className="bg-gray-800 bg-opacity-50 rounded-xl p-6 border border-gray-700">
                <p className="text-gray-300">Fonctionnalité communautaire à venir...</p>
              </div>
            </motion.div>
          )}

          {activeTab === 'profile' && (
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6 }}
              className="space-y-6"
            >
              <h2 className="text-2xl font-bold text-white mb-6">Mon Profil</h2>
              <div className="bg-gray-800 bg-opacity-50 rounded-xl p-6 border border-gray-700">
                <p className="text-gray-300">Fonctionnalité profil à venir...</p>
              </div>
            </motion.div>
          )}
        </div>
      </div>
    </div>
  );
}

