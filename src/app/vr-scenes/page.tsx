'use client';

import { useState } from 'react';
import Link from 'next/link';
import { ArrowLeft, Play, Users, Building, Mic, Award, Zap } from 'lucide-react';
import { motion } from 'framer-motion';

export default function VRScenesPage() {
  const [selectedScene, setSelectedScene] = useState<string | null>(null);

  const scenes = [
    {
      id: 'tedx',
      title: 'TEDx Conference',
      description: 'Présentez devant un public de 500 personnes dans un auditorium moderne',
      image: 'https://images.unsplash.com/photo-1540575467063-178a50c2df87?w=400&h=300&fit=crop',
      difficulty: 'Avancé',
      duration: '15 min',
      participants: '500+',
      icon: Mic,
      color: 'from-red-400 to-red-500'
    },
    {
      id: 'boardroom',
      title: 'Salle de Réunion',
      description: 'Réunion d\'équipe avec 10 collègues dans un environnement professionnel',
      image: 'https://images.unsplash.com/photo-1517502884422-41eaead166d4?w=400&h=300&fit=crop',
      difficulty: 'Intermédiaire',
      duration: '10 min',
      participants: '10',
      icon: Users,
      color: 'from-blue-400 to-blue-500'
    },
    {
      id: 'startup-pitch',
      title: 'Pitch Startup',
      description: 'Présentez votre startup devant des investisseurs potentiels',
      image: 'https://images.unsplash.com/photo-1552664730-d307ca884978?w=400&h=300&fit=crop',
      difficulty: 'Avancé',
      duration: '5 min',
      participants: '5',
      icon: Building,
      color: 'from-green-400 to-green-500'
    },
    {
      id: 'job-interview',
      title: 'Entretien d\'Embauche',
      description: 'Entretien professionnel avec un recruteur senior',
      image: 'https://images.unsplash.com/photo-1551836022-d5d88e9218df?w=400&h=300&fit=crop',
      difficulty: 'Intermédiaire',
      duration: '30 min',
      participants: '1',
      icon: Award,
      color: 'from-purple-400 to-purple-500'
    },
    {
      id: 'sales-presentation',
      title: 'Présentation Commerciale',
      description: 'Présentation produit devant des prospects qualifiés',
      image: 'https://images.unsplash.com/photo-1556761175-b413da4baf72?w=400&h=300&fit=crop',
      difficulty: 'Intermédiaire',
      duration: '20 min',
      participants: '15',
      icon: Zap,
      color: 'from-yellow-400 to-yellow-500'
    },
    {
      id: 'press-conference',
      title: 'Conférence de Presse',
      description: 'Conférence de presse avec journalistes et caméras',
      image: 'https://images.unsplash.com/photo-1581094794329-c8112a89af12?w=400&h=300&fit=crop',
      difficulty: 'Expert',
      duration: '45 min',
      participants: '50+',
      icon: Mic,
      color: 'from-pink-400 to-pink-500'
    }
  ];

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-900 via-blue-900 to-gray-900 flex flex-col">
      {/* Fixed Header */}
      <div className="fixed top-0 left-0 right-0 z-50 flex justify-between items-center p-4 bg-black bg-opacity-20 backdrop-blur-sm border-b border-gray-700">
        <Link href="/dashboard" className="text-white hover:text-yellow-400 transition-colors">
          <ArrowLeft className="w-6 h-6" />
        </Link>
        <div className="text-lg font-bold text-white">Scènes VR</div>
        <div className="w-6"></div>
      </div>

      {/* Main Content */}
      <div className="flex-1 px-4 pt-20 pb-8">
        <div className="max-w-6xl mx-auto">
          {/* Hero Section */}
          <motion.div
            initial={{ opacity: 0, y: 50 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8 }}
            className="text-center mb-8"
          >
            <h1 className="text-3xl md:text-4xl font-bold text-white mb-4">
              Choisissez votre scène VR
            </h1>
            <p className="text-xl text-gray-300 mb-8">
              Entraînez-vous dans des environnements réalistes et immersifs
            </p>
          </motion.div>

          {/* VR Scenes Grid */}
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {scenes.map((scene, index) => (
              <motion.div
                key={scene.id}
                initial={{ opacity: 0, y: 50 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.6, delay: index * 0.1 }}
                className={`relative bg-gray-800 bg-opacity-50 rounded-xl overflow-hidden border-2 transition-all cursor-pointer hover:scale-105 ${
                  selectedScene === scene.id ? 'border-yellow-400' : 'border-gray-700 hover:border-gray-600'
                }`}
                onClick={() => setSelectedScene(scene.id)}
              >
                {/* Scene Image */}
                <div className="relative h-48 overflow-hidden">
                  <img 
                    src={scene.image} 
                    alt={scene.title} 
                    className="w-full h-full object-cover"
                  />
                  <div className="absolute inset-0 bg-gradient-to-t from-black via-transparent to-transparent"></div>
                  
                  {/* Difficulty Badge */}
                  <div className="absolute top-4 left-4">
                    <span className={`px-3 py-1 rounded-full text-xs font-bold ${
                      scene.difficulty === 'Expert' ? 'bg-red-500 text-white' :
                      scene.difficulty === 'Avancé' ? 'bg-orange-500 text-white' :
                      scene.difficulty === 'Intermédiaire' ? 'bg-yellow-500 text-black' :
                      'bg-green-500 text-white'
                    }`}>
                      {scene.difficulty}
                    </span>
                  </div>

                  {/* Duration Badge */}
                  <div className="absolute top-4 right-4">
                    <span className="bg-black bg-opacity-50 text-white px-2 py-1 rounded text-xs">
                      {scene.duration}
                    </span>
                  </div>
                </div>

                {/* Scene Content */}
                <div className="p-6">
                  <div className="flex items-center space-x-3 mb-3">
                    <div className={`w-10 h-10 bg-gradient-to-r ${scene.color} rounded-full flex items-center justify-center`}>
                      <scene.icon className="w-5 h-5 text-black" />
                    </div>
                    <div>
                      <h3 className="text-white font-semibold text-lg">{scene.title}</h3>
                      <p className="text-gray-400 text-sm">{scene.participants} participants</p>
                    </div>
                  </div>
                  
                  <p className="text-gray-300 text-sm mb-4">{scene.description}</p>

                  {/* Action Button */}
                  <button className={`w-full py-3 rounded-lg font-medium transition-all ${
                    selectedScene === scene.id
                      ? 'bg-gradient-to-r from-yellow-400 to-yellow-500 text-black'
                      : 'bg-gray-700 text-white hover:bg-gray-600'
                  }`}>
                    {selectedScene === scene.id ? 'Scène sélectionnée' : 'Sélectionner'}
                  </button>
                </div>
              </motion.div>
            ))}
          </div>

          {/* Bottom CTA */}
          {selectedScene && (
            <motion.div
              initial={{ opacity: 0, y: 50 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6 }}
              className="text-center mt-12"
            >
              <div className="bg-gray-800 bg-opacity-50 p-8 rounded-xl border border-gray-700 max-w-2xl mx-auto">
                <h3 className="text-2xl font-bold text-white mb-4">
                  Prêt à entrer en VR ?
                </h3>
                <p className="text-gray-300 mb-6">
                  Vous allez être transporté dans un environnement immersif pour pratiquer votre prise de parole.
                </p>
                <Link 
                  href="/vr-session"
                  className="inline-flex items-center space-x-2 bg-gradient-to-r from-cyan-400 to-cyan-500 text-black font-semibold py-4 px-8 rounded-xl hover:shadow-2xl transition-all hover:scale-105"
                >
                  <Play className="w-5 h-5" />
                  <span>Entrer en VR</span>
                </Link>
              </div>
            </motion.div>
          )}
        </div>
      </div>
    </div>
  );
}

