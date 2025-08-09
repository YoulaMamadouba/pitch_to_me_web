'use client';
import { useState } from 'react';
import Link from 'next/link';
import { ArrowLeft, BarChart3, TrendingUp, Mic, Volume2, Zap, Target } from 'lucide-react';
import { motion } from 'framer-motion';

export default function VoiceAnalysisPage() {
  const [activeTab, setActiveTab] = useState('overview');

  const analysisData = {
    clarity: 85,
    speed: 72,
    expressiveness: 78,
    confidence: 82,
    overall: 79
  };

  const recommendations = [
    {
      category: 'Clarté',
      title: 'Excellent travail sur la prononciation',
      description: 'Votre articulation est claire et précise. Continuez à maintenir ce niveau.',
      icon: Mic,
      color: 'text-green-400'
    },
    {
      category: 'Vitesse',
      title: 'Ralentissez légèrement',
      description: 'Votre débit est un peu rapide. Essayez de faire des pauses plus fréquentes.',
      icon: Volume2,
      color: 'text-yellow-400'
    },
    {
      category: 'Expressivité',
      title: 'Améliorez la variation tonale',
      description: 'Utilisez plus de variations dans votre ton de voix pour captiver l\'audience.',
      icon: Zap,
      color: 'text-blue-400'
    },
    {
      category: 'Confiance',
      title: 'Posture et contact visuel',
      description: 'Votre niveau de confiance est bon. Travaillez sur le contact visuel.',
      icon: Target,
      color: 'text-purple-400'
    }
  ];

  const generateChartData = (value: number) => {
    const radius = 60;
    const circumference = 2 * Math.PI * radius;
    const strokeDasharray = circumference;
    const strokeDashoffset = circumference - (value / 100) * circumference;
    return { radius, circumference, strokeDasharray, strokeDashoffset };
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-900 via-blue-900 to-gray-900 flex flex-col">
      {/* Fixed Header */}
      <div className="fixed top-0 left-0 right-0 z-50 flex justify-between items-center p-4 bg-black bg-opacity-20 backdrop-blur-sm border-b border-gray-700">
        <Link href="/dashboard" className="text-white hover:text-yellow-400 transition-colors">
          <ArrowLeft className="w-6 h-6" />
        </Link>
        <div className="text-lg font-bold text-white">Analyse Vocale IA</div>
        <div className="w-6"></div>
      </div>

      {/* Main Content */}
      <div className="flex-1 flex items-center justify-center px-4 pt-20 pb-8">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6 }}
          className="w-full max-w-4xl"
        >
          {/* Voice Analysis Card */}
          <div className="bg-gray-800 bg-opacity-50 backdrop-blur-sm rounded-2xl p-8 border border-gray-600 shadow-2xl">
            {/* Hero Section */}
            <motion.div
              initial={{ opacity: 0, y: 50 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.8 }}
              className="text-center mb-8"
            >
              <div className="w-24 h-24 bg-gradient-to-r from-cyan-400 to-cyan-500 rounded-full mx-auto mb-6 flex items-center justify-center">
                <BarChart3 className="w-12 h-12 text-black" />
              </div>
              <h1 className="text-3xl font-bold text-white mb-4">Analyse de votre performance</h1>
              <p className="text-gray-300">Voici les résultats détaillés de votre session VR</p>
            </motion.div>

            {/* Overall Score */}
            <motion.div
              initial={{ opacity: 0, y: 30 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6, delay: 0.2 }}
              className="bg-gray-700 rounded-xl p-6 border border-gray-600 mb-8"
            >
              <div className="flex flex-col md:flex-row items-center justify-center space-y-4 md:space-y-0 md:space-x-8">
                <div className="relative">
                  <svg className="w-32 h-32 transform -rotate-90">
                    <circle
                      cx="64"
                      cy="64"
                      r="60"
                      stroke="currentColor"
                      strokeWidth="8"
                      fill="transparent"
                      className="text-gray-600"
                    />
                    <circle
                      cx="64"
                      cy="64"
                      r="60"
                      stroke="currentColor"
                      strokeWidth="8"
                      fill="transparent"
                      strokeDasharray={generateChartData(analysisData.overall).strokeDasharray}
                      strokeDashoffset={generateChartData(analysisData.overall).strokeDashoffset}
                      className="text-yellow-400 transition-all duration-1000"
                    />
                  </svg>
                  <div className="absolute inset-0 flex items-center justify-center">
                    <div className="text-center">
                      <div className="text-3xl font-bold text-white">{analysisData.overall}%</div>
                      <div className="text-gray-400 text-sm">Score global</div>
                    </div>
                  </div>
                </div>
                <div className="text-center md:text-left">
                  <h3 className="text-xl font-bold text-white mb-2">Performance excellente !</h3>
                  <p className="text-gray-300">
                    Votre présentation a été très bien reçue. Continuez à pratiquer pour maintenir ce niveau.
                  </p>
                </div>
              </div>
            </motion.div>

            {/* Detailed Metrics */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-8">
              {Object.entries(analysisData).filter(([key]) => key !== 'overall').map(([key, value], index) => (
                <motion.div
                  key={key}
                  initial={{ opacity: 0, y: 30 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ duration: 0.6, delay: 0.3 + index * 0.1 }}
                  className="bg-gray-700 rounded-xl p-6 border border-gray-600"
                >
                  <div className="flex items-center justify-between mb-4">
                    <h3 className="text-white font-semibold capitalize">{key}</h3>
                    <div className={`w-8 h-8 rounded-full flex items-center justify-center ${
                      value >= 80 ? 'bg-green-500' : value >= 60 ? 'bg-yellow-500' : 'bg-red-500'
                    }`}>
                      <TrendingUp className="w-4 h-4 text-white" />
                    </div>
                  </div>
                  <div className="text-3xl font-bold text-white mb-2">{value}%</div>
                  <div className="w-full bg-gray-600 rounded-full h-2">
                    <div 
                      className={`h-2 rounded-full transition-all duration-1000 ${
                        value >= 80 ? 'bg-green-400' : value >= 60 ? 'bg-yellow-400' : 'bg-red-400'
                      }`}
                      style={{ width: `${value}%` }}
                    ></div>
                  </div>
                </motion.div>
              ))}
            </div>

            {/* Recommendations */}
            <motion.div
              initial={{ opacity: 0, y: 30 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6, delay: 0.6 }}
              className="bg-gray-700 rounded-xl p-6 border border-gray-600 mb-8"
            >
              <h3 className="text-xl font-bold text-white mb-6">Recommandations personnalisées</h3>
              <div className="grid grid-cols-1 gap-6">
                {recommendations.map((rec, index) => (
                  <div key={rec.category} className="flex items-start space-x-4">
                    <div className={`w-12 h-12 bg-gray-600 rounded-full flex items-center justify-center flex-shrink-0`}>
                      <rec.icon className={`w-6 h-6 ${rec.color}`} />
                    </div>
                    <div>
                      <h4 className="text-white font-semibold mb-1">{rec.title}</h4>
                      <p className="text-gray-300 text-sm">{rec.description}</p>
                    </div>
                  </div>
                ))}
              </div>
            </motion.div>

            {/* Action Buttons */}
            <motion.div
              initial={{ opacity: 0, y: 30 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6, delay: 0.8 }}
              className="flex flex-col sm:flex-row justify-center space-y-4 sm:space-y-0 sm:space-x-4"
            >
              <Link
                href="/vr-scenes"
                className="bg-gradient-to-r from-cyan-400 to-cyan-500 text-black font-semibold py-3 px-8 rounded-xl hover:from-cyan-300 hover:to-cyan-400 transition-all duration-300 text-center"
              >
                Pratiquer à nouveau
              </Link>
              <Link
                href="/dashboard"
                className="bg-gradient-to-r from-yellow-400 to-yellow-500 text-black font-semibold py-3 px-8 rounded-xl hover:from-yellow-300 hover:to-yellow-400 transition-all duration-300 text-center"
              >
                Retour au dashboard
              </Link>
            </motion.div>
          </div>
        </motion.div>
      </div>
    </div>
  );
}
