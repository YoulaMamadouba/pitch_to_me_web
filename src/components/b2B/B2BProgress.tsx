'use client';

import { BarChart3, TrendingUp, Target, Award, Calendar, Clock, CheckCircle, Star } from 'lucide-react';

export default function B2BProgress() {
  const progressData = {
    overall: 68,
    modules: [
      { name: 'Sales Pitch', progress: 75, target: 100 },
      { name: 'Objection Handling', progress: 100, target: 100 },
      { name: 'Client Relations', progress: 45, target: 100 },
      { name: 'Closing Deals', progress: 0, target: 100 },
      { name: 'Negotiation', progress: 0, target: 100 },
      { name: 'Product Demo', progress: 0, target: 100 }
    ],
    stats: [
      { label: 'Modules complétés', value: '2/6', icon: CheckCircle, color: 'text-green-400' },
      { label: 'Heures d\'apprentissage', value: '24h', icon: Clock, color: 'text-blue-400' },
      { label: 'Score moyen', value: '85%', icon: Star, color: 'text-yellow-400' },
      { label: 'Objectif mensuel', value: '68%', icon: Target, color: 'text-purple-400' }
    ],
    achievements: [
      { title: 'Premier module terminé', description: 'Objection Handling', date: '2024-01-15', icon: Award },
      { title: '10h d\'apprentissage', description: 'Objectif atteint', date: '2024-01-10', icon: Clock },
      { title: 'Score parfait', description: '100% sur Objection Handling', date: '2024-01-15', icon: Star }
    ]
  };

  return (
    <div className="space-y-6">
      <h1 className="text-2xl font-bold text-white">Ma progression</h1>
      
      {/* Overall Progress */}
      <div className="bg-gray-800 rounded-xl p-6 border border-gray-700">
        <div className="flex items-center justify-between mb-4">
          <h2 className="text-xl font-semibold text-white">Progression globale</h2>
          <div className="text-right">
            <div className="text-2xl font-bold text-white">{progressData.overall}%</div>
            <div className="text-sm text-gray-400">Objectif: 100%</div>
          </div>
        </div>
        <div className="w-full bg-gray-700 rounded-full h-3 mb-4">
          <div 
            className="bg-gradient-to-r from-yellow-400 to-amber-500 h-3 rounded-full transition-all duration-300"
            style={{ width: `${progressData.overall}%` }}
          ></div>
        </div>
        <div className="flex items-center space-x-2 text-sm text-gray-400">
          <TrendingUp className="w-4 h-4 text-green-400" />
          <span>+12% ce mois</span>
        </div>
      </div>

      {/* Stats Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        {progressData.stats.map((stat, index) => (
          <div key={index} className="bg-gray-800 rounded-xl p-6 border border-gray-700">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-gray-400 text-sm">{stat.label}</p>
                <p className="text-2xl font-bold text-white">{stat.value}</p>
              </div>
              <stat.icon className={`w-8 h-8 ${stat.color}`} />
            </div>
          </div>
        ))}
      </div>

      {/* Module Progress */}
      <div className="bg-gray-800 rounded-xl p-6 border border-gray-700">
        <h2 className="text-xl font-semibold text-white mb-4">Progression par module</h2>
        <div className="space-y-4">
          {progressData.modules.map((module, index) => (
            <div key={index} className="flex items-center space-x-4">
              <div className="flex-1">
                <div className="flex items-center justify-between mb-1">
                  <span className="text-white font-medium">{module.name}</span>
                  <span className="text-sm text-gray-400">{module.progress}/{module.target}%</span>
                </div>
                <div className="w-full bg-gray-700 rounded-full h-2">
                  <div 
                    className={`h-2 rounded-full transition-all duration-300 ${
                      module.progress === 100 ? 'bg-green-400' : 
                      module.progress > 50 ? 'bg-yellow-400' : 'bg-blue-400'
                    }`}
                    style={{ width: `${module.progress}%` }}
                  ></div>
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* Achievements */}
      <div className="bg-gray-800 rounded-xl p-6 border border-gray-700">
        <h2 className="text-xl font-semibold text-white mb-4">Réalisations</h2>
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
          {progressData.achievements.map((achievement, index) => (
            <div key={index} className="bg-gray-700 rounded-lg p-4 border border-gray-600">
              <div className="flex items-start space-x-3">
                <div className="w-10 h-10 bg-yellow-500/20 rounded-lg flex items-center justify-center flex-shrink-0">
                  <achievement.icon className="w-5 h-5 text-yellow-400" />
                </div>
                <div className="flex-1">
                  <h3 className="text-white font-medium text-sm">{achievement.title}</h3>
                  <p className="text-gray-400 text-xs mt-1">{achievement.description}</p>
                  <p className="text-gray-500 text-xs mt-2">{achievement.date}</p>
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* Weekly Activity */}
      <div className="bg-gray-800 rounded-xl p-6 border border-gray-700">
        <h2 className="text-xl font-semibold text-white mb-4">Activité hebdomadaire</h2>
        <div className="flex items-end space-x-2 h-32">
          {[65, 80, 45, 90, 70, 85, 60].map((value, index) => (
            <div key={index} className="flex-1 flex flex-col items-center">
              <div 
                className="w-full bg-gradient-to-t from-yellow-400 to-amber-500 rounded-t transition-all duration-300 hover:opacity-80"
                style={{ height: `${value}%` }}
              ></div>
              <span className="text-xs text-gray-400 mt-2">
                {['Lun', 'Mar', 'Mer', 'Jeu', 'Ven', 'Sam', 'Dim'][index]}
              </span>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}
