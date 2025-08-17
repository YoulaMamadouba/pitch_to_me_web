'use client';

import { Play, Check, Lock, Star, Clock, Award } from 'lucide-react';

export default function B2BModules() {
  const modules = [
    {
      id: 1,
      title: 'Sales Pitch Mastery',
      description: 'Maîtrisez l\'art de la persuasion commerciale',
      progress: 75,
      status: 'En cours',
      difficulty: 'Intermédiaire',
      duration: '4h',
      completed: false,
      color: 'bg-yellow-400'
    },
    {
      id: 2,
      title: 'Objection Handling',
      description: 'Transformez les objections en opportunités',
      progress: 100,
      status: 'Terminé',
      difficulty: 'Avancé',
      duration: '3h',
      completed: true,
      color: 'bg-cyan-400'
    },
    {
      id: 3,
      title: 'Client Relations',
      description: 'Construisez des relations client durables',
      progress: 45,
      status: 'En cours',
      difficulty: 'Débutant',
      duration: '5h',
      completed: false,
      color: 'bg-purple-400'
    },
    {
      id: 4,
      title: 'Closing Deals',
      description: 'Finalisez vos ventes avec succès',
      progress: 0,
      status: 'À commencer',
      difficulty: 'Intermédiaire',
      duration: '6h',
      completed: false,
      color: 'bg-green-400'
    },
    {
      id: 5,
      title: 'Negotiation Skills',
      description: 'Stratégies gagnant-gagnant',
      progress: 0,
      status: 'À commencer',
      difficulty: 'Avancé',
      duration: '7h',
      completed: false,
      color: 'bg-pink-400'
    },
    {
      id: 6,
      title: 'Product Demo',
      description: 'Présentez vos produits efficacement',
      progress: 0,
      status: 'À commencer',
      difficulty: 'Intermédiaire',
      duration: '4h',
      completed: false,
      color: 'bg-indigo-400'
    }
  ];

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <h1 className="text-2xl font-bold text-white">Modules d'apprentissage</h1>
        <div className="flex items-center space-x-2">
          <span className="text-gray-400 text-sm">Filtrer par :</span>
          <select className="bg-gray-700 border border-gray-600 rounded-lg px-3 py-2 text-white text-sm">
            <option>Tous les modules</option>
            <option>En cours</option>
            <option>Terminés</option>
            <option>À commencer</option>
          </select>
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        {modules.map((module) => (
          <div key={module.id} className="bg-gray-800 rounded-xl p-6 border border-gray-700 hover:border-gray-600 transition-colors">
            <div className="flex items-start justify-between mb-4">
              <div className="flex-1">
                <div className="flex items-center space-x-3 mb-2">
                  <div className={`w-10 h-10 ${module.color} rounded-lg flex items-center justify-center`}>
                    <Star className="w-5 h-5 text-black" />
                  </div>
                  <div>
                    <h3 className="text-lg font-semibold text-white">{module.title}</h3>
                    <p className="text-gray-400 text-sm">{module.description}</p>
                  </div>
                </div>
                <div className="flex items-center space-x-4 text-xs text-gray-500">
                  <span>{module.difficulty}</span>
                  <span>•</span>
                  <span>{module.duration}</span>
                </div>
              </div>
              <div className="flex items-center space-x-2">
                {module.completed ? (
                  <Check className="w-5 h-5 text-green-400" />
                ) : (
                  <Lock className="w-5 h-5 text-gray-500" />
                )}
              </div>
            </div>

            <div className="space-y-3">
              <div className="flex items-center justify-between">
                <span className="text-sm text-gray-400">Progression</span>
                <span className="text-sm text-white">{module.progress}%</span>
              </div>
              <div className="w-full bg-gray-700 rounded-full h-2">
                <div 
                  className={`${module.color} h-2 rounded-full transition-all duration-300`}
                  style={{ width: `${module.progress}%` }}
                ></div>
              </div>
              <div className="flex items-center justify-between">
                <span className={`text-xs px-2 py-1 rounded-full ${
                  module.status === 'Terminé' ? 'bg-green-500/20 text-green-400' : 
                  module.status === 'En cours' ? 'bg-yellow-500/20 text-yellow-400' : 
                  'bg-gray-500/20 text-gray-400'
                }`}>
                  {module.status}
                </span>
                <button className="flex items-center space-x-2 bg-yellow-500 hover:bg-yellow-600 text-black px-4 py-2 rounded-lg text-sm font-medium transition-colors">
                  <Play className="w-4 h-4" />
                  <span>Continuer</span>
                </button>
              </div>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
