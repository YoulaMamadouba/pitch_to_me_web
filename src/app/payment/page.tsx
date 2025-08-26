'use client';
import { useState, useEffect } from 'react';
import { 
  CreditCard, 
  Shield, 
  Check, 
  Loader2, 
  Lock,
  Star,
  Clock,
  Users,
  BookOpen,
  Video,
  Brain,
  Target,
  TrendingUp,
  Zap
} from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';

import AuthPageHeader from '@/components/ui/AuthPageHeader';
import { useSignup } from '@/contexts/SignupContext';
import { getAmountInCents } from '@/types/payment';

// Types pour les formations
interface Formation {
  id: string;
  title: string;
  description: string;
  price: {
    USD: number;
    EUR: number;
    XOF: number;
  };
  duration: number; // en heures
  lessons: number;
  students: number;
  rating: number;
  difficulty: 'débutant' | 'intermédiaire' | 'avancé';
  features: string[];
  color: string;
  icon: React.ComponentType<{ className?: string }>;
  isPopular?: boolean;
  isNew?: boolean;
}

interface Domain {
  id: string;
  name: string;
  description: string;
  icon: React.ComponentType<{ className?: string }>;
  color: string;
  formations: Formation[];
}

export default function PaymentPage() {
  const { formData } = useSignup();
  const [selectedCurrency, setSelectedCurrency] = useState('USD');
  const [selectedFormation, setSelectedFormation] = useState<Formation | null>(null);
  const [isProcessing, setIsProcessing] = useState(false);
  const [selectedDomain, setSelectedDomain] = useState<string | null>(null);

  // Vérifier que nous avons les données du formulaire d'inscription
  useEffect(() => {
    if (!formData || !formData.email) {
      console.log('🔧 Données d\'inscription manquantes, redirection vers /signup');
      window.location.href = '/signup';
      return;
    }
  }, [formData]);

  // Données des domaines et formations
  const domains: Domain[] = [
    {
      id: 'commercial',
      name: 'Commercial & Vente',
      description: 'Maîtrisez l\'art de la vente et de la négociation',
      icon: TrendingUp,
      color: 'from-green-500 to-emerald-600',
      formations: [
        {
          id: 'commercial-basics',
          title: 'Fondamentaux de la Vente',
          description: 'Apprenez les bases essentielles de la vente et de la négociation commerciale',
          price: { USD: 199, EUR: 179, XOF: 115000 },
          duration: 8,
          lessons: 12,
          students: 234,
          rating: 4.8,
          difficulty: 'débutant',
          features: ['Techniques de prospection', 'Gestion des objections', 'Clôture de vente', 'Suivi client'],
          color: 'from-green-500 to-emerald-600',
          icon: Target,
          isPopular: true
        },
        {
          id: 'commercial-advanced',
          title: 'Vente Avancée & Négociation',
          description: 'Techniques avancées pour les vendeurs expérimentés',
          price: { USD: 299, EUR: 269, XOF: 175000 },
          duration: 12,
          lessons: 18,
          students: 156,
          rating: 4.9,
          difficulty: 'avancé',
          features: ['Négociation complexe', 'Gestion des gros comptes', 'Stratégies de pricing', 'Leadership commercial'],
          color: 'from-emerald-600 to-teal-700',
          icon: TrendingUp,
          isNew: true
        }
      ]
    },
    {
      id: 'presentation',
      name: 'Présentation & Pitch',
      description: 'Développez votre impact et votre charisme',
      icon: Video,
      color: 'from-blue-500 to-purple-600',
      formations: [
        {
          id: 'pitch-mastery',
          title: 'Maîtrise du Pitch',
          description: 'Créez des présentations percutantes qui convertissent',
          price: { USD: 249, EUR: 229, XOF: 145000 },
          duration: 10,
          lessons: 15,
          students: 189,
          rating: 4.7,
          difficulty: 'intermédiaire',
          features: ['Storytelling', 'Structure narrative', 'Techniques de présentation', 'Gestion du stress'],
          color: 'from-blue-500 to-purple-600',
          icon: Video,
          isPopular: true
        },
        {
          id: 'public-speaking',
          title: 'Prise de Parole en Public',
          description: 'Développez votre confiance et votre impact scénique',
          price: { USD: 179, EUR: 159, XOF: 95000 },
          duration: 6,
          lessons: 10,
          students: 312,
          rating: 4.6,
          difficulty: 'débutant',
          features: ['Confiance en soi', 'Techniques vocales', 'Langage corporel', 'Gestion de l\'audience'],
          color: 'from-purple-500 to-pink-600',
          icon: Brain
        }
      ]
    },
    {
      id: 'leadership',
      name: 'Leadership & Management',
      description: 'Devenez un leader inspirant et efficace',
      icon: Users,
      color: 'from-yellow-500 to-orange-600',
      formations: [
        {
          id: 'team-leadership',
          title: 'Leadership d\'Équipe',
          description: 'Motivez et dirigez vos équipes vers l\'excellence',
          price: { USD: 329, EUR: 299, XOF: 195000 },
          duration: 14,
          lessons: 20,
          students: 98,
          rating: 4.9,
          difficulty: 'avancé',
          features: ['Motivation d\'équipe', 'Gestion des conflits', 'Délégation efficace', 'Communication managériale'],
          color: 'from-yellow-500 to-orange-600',
          icon: Users,
          isNew: true
        }
      ]
    },
    {
      id: 'communication',
      name: 'Communication & Influence',
      description: 'Maîtrisez l\'art de la communication persuasive',
      icon: Zap,
      color: 'from-red-500 to-pink-600',
      formations: [
        {
          id: 'persuasion-techniques',
          title: 'Techniques de Persuasion',
          description: 'Influencez positivement vos interlocuteurs',
          price: { USD: 199, EUR: 179, XOF: 115000 },
          duration: 8,
          lessons: 12,
          students: 167,
          rating: 4.8,
          difficulty: 'intermédiaire',
          features: ['Psychologie de l\'influence', 'Techniques de persuasion', 'Éthique de la communication', 'Résistance aux manipulations'],
          color: 'from-red-500 to-pink-600',
          icon: Zap
        }
      ]
    }
  ];

  const handleFormationSelect = (formation: Formation) => {
    setSelectedFormation(formation);
  };

  const handlePayment = async (formation: Formation) => {
    setIsProcessing(true);
    
    try {
      if (!formData || !formData.email) {
        throw new Error('Données d\'inscription manquantes');
      }
      
      const amount = getAmountInCents(selectedCurrency as 'USD' | 'EUR' | 'XOF', formation.price[selectedCurrency as keyof typeof formation.price]);
      const plan = formation.id;

      const response = await fetch('/api/checkout', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          amount,
          currency: selectedCurrency,
          plan,
          userData: formData,
          formationData: {
            id: formation.id,
            title: formation.title,
            price: formation.price[selectedCurrency as keyof typeof formation.price]
          }
        }),
      });

      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(errorData.error || 'Erreur lors de la création de la session de paiement');
      }

      const { url } = await response.json();
      
      if (url) {
        window.location.href = url;
      } else {
        throw new Error('URL de paiement non reçue');
      }
    } catch (error) {
      console.error('Erreur lors du paiement:', error);
      alert(`Erreur lors du paiement: ${error instanceof Error ? error.message : 'Erreur inconnue'}`);
      setIsProcessing(false);
    }
  };

  const getCurrencySymbol = (currency: string) => {
    const symbols = { USD: '$', EUR: '€', XOF: 'FCFA' };
    return symbols[currency as keyof typeof symbols] || currency;
  };

  const getDifficultyColor = (difficulty: string) => {
    const colors = {
      'débutant': 'text-green-400',
      'intermédiaire': 'text-yellow-400',
      'avancé': 'text-red-400'
    };
    return colors[difficulty as keyof typeof colors] || 'text-gray-400';
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-900 via-blue-900 to-gray-900">
      <AuthPageHeader pageTitle="Catalogue de Formations" />
      
      <div className="container mx-auto px-4 py-8 pt-20">
        {/* Header */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6 }}
          className="text-center mb-12"
        >
          <h1 className="text-4xl md:text-5xl font-bold text-white mb-4">
            Choisissez Votre Formation
          </h1>
          <p className="text-xl text-gray-300 mb-8">
            Des formations spécialisées pour développer vos compétences professionnelles
          </p>
          
          {/* Sélecteur de devise */}
          <div className="flex justify-center mb-8">
            <div className="bg-gray-800/50 backdrop-blur-sm rounded-xl p-2 border border-gray-700">
              <div className="flex space-x-2">
                {['USD', 'EUR', 'XOF'].map((currency) => (
                  <motion.button
                    key={currency}
                    onClick={() => setSelectedCurrency(currency)}
                    whileHover={{ scale: 1.05 }}
                    whileTap={{ scale: 0.95 }}
                    className={`px-4 py-2 rounded-lg text-sm font-medium transition-all ${
                      selectedCurrency === currency
                        ? 'bg-yellow-500 text-black shadow-lg'
                        : 'text-gray-300 hover:text-white hover:bg-gray-700/50'
                    }`}
                  >
                    {getCurrencySymbol(currency)}
                  </motion.button>
                ))}
              </div>
            </div>
          </div>
        </motion.div>

        {/* Filtres par domaine */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6, delay: 0.2 }}
          className="mb-8"
        >
          <div className="flex flex-wrap justify-center gap-4">
            <motion.button
              onClick={() => setSelectedDomain(null)}
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
              className={`px-6 py-3 rounded-xl font-medium transition-all ${
                selectedDomain === null
                  ? 'bg-yellow-500 text-black shadow-lg'
                  : 'bg-gray-800/50 text-gray-300 hover:text-white hover:bg-gray-700/50 border border-gray-700'
              }`}
            >
              Tous les domaines
            </motion.button>
            {domains.map((domain) => {
              const Icon = domain.icon;
              return (
                <motion.button
                  key={domain.id}
                  onClick={() => setSelectedDomain(domain.id)}
                  whileHover={{ scale: 1.05 }}
                  whileTap={{ scale: 0.95 }}
                  className={`px-6 py-3 rounded-xl font-medium transition-all flex items-center space-x-2 ${
                    selectedDomain === domain.id
                      ? 'bg-gradient-to-r ' + domain.color + ' text-white shadow-lg'
                      : 'bg-gray-800/50 text-gray-300 hover:text-white hover:bg-gray-700/50 border border-gray-700'
                  }`}
                >
                  <Icon className="w-4 h-4" />
                  <span>{domain.name}</span>
                </motion.button>
              );
            })}
          </div>
        </motion.div>

        {/* Grille des formations */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
          {domains
            .filter(domain => !selectedDomain || domain.id === selectedDomain)
            .map((domain) => (
              <div key={domain.id} className="space-y-6">
                {domain.formations.map((formation, index) => {
                  const Icon = formation.icon;
                  return (
                    <motion.div
                      key={formation.id}
                      initial={{ opacity: 0, y: 20 }}
                      animate={{ opacity: 1, y: 0 }}
                      transition={{ duration: 0.6, delay: index * 0.1 }}
                      className="relative"
                    >
                      <div className="bg-gray-800/80 backdrop-blur-sm rounded-xl overflow-hidden border border-gray-700 shadow-xl hover:shadow-2xl transition-all duration-300 hover:scale-105">
                        {/* Badges */}
                        <div className="absolute top-4 left-4 z-10 flex space-x-2">
                          {formation.isPopular && (
                            <span className="bg-yellow-500 text-black text-xs px-2 py-1 rounded-full font-bold">
                              POPULAIRE
                            </span>
                          )}
                          {formation.isNew && (
                            <span className="bg-green-500 text-white text-xs px-2 py-1 rounded-full font-bold">
                              NOUVEAU
                            </span>
                          )}
                        </div>

                        {/* Header */}
                        <div className={`p-6 bg-gradient-to-r ${formation.color}`}>
                          <div className="flex items-start justify-between mb-4">
                            <div className="flex-1">
                              <h3 className="text-xl font-bold text-white mb-2">{formation.title}</h3>
                              <p className="text-white/90 text-sm">{formation.description}</p>
                            </div>
                            <div className="w-12 h-12 bg-white/20 rounded-lg flex items-center justify-center">
                              <Icon className="w-6 h-6 text-white" />
                            </div>
                          </div>
                          
                          {/* Prix */}
                          <div className="text-center">
                            <div className="text-3xl font-bold text-white">
                              {getCurrencySymbol(selectedCurrency)}
                              {formation.price[selectedCurrency as keyof typeof formation.price]}
                              {selectedCurrency === 'XOF' ? ' FCFA' : ''}
                            </div>
                            <div className="text-white/80 text-sm">
                              {selectedCurrency !== 'XOF' && 'TVA incluse'}
                            </div>
                          </div>
                        </div>

                        {/* Contenu */}
                        <div className="p-6">
                          {/* Stats */}
                          <div className="grid grid-cols-3 gap-4 mb-6">
                            <div className="text-center">
                              <div className="flex items-center justify-center text-yellow-400 mb-1">
                                <Clock className="w-4 h-4 mr-1" />
                              </div>
                              <div className="text-sm font-medium text-white">{formation.duration}h</div>
                              <div className="text-xs text-gray-400">Durée</div>
                            </div>
                            <div className="text-center">
                              <div className="flex items-center justify-center text-blue-400 mb-1">
                                <BookOpen className="w-4 h-4 mr-1" />
                              </div>
                              <div className="text-sm font-medium text-white">{formation.lessons}</div>
                              <div className="text-xs text-gray-400">Leçons</div>
                            </div>
                            <div className="text-center">
                              <div className="flex items-center justify-center text-green-400 mb-1">
                                <Users className="w-4 h-4 mr-1" />
                              </div>
                              <div className="text-sm font-medium text-white">{formation.students}</div>
                              <div className="text-xs text-gray-400">Étudiants</div>
                            </div>
                          </div>

                          {/* Rating et difficulté */}
                          <div className="flex items-center justify-between mb-4">
                            <div className="flex items-center space-x-2">
                              <div className="flex items-center">
                                {[...Array(5)].map((_, i) => (
                                  <Star
                                    key={i}
                                    className={`w-4 h-4 ${
                                      i < Math.floor(formation.rating)
                                        ? 'text-yellow-400 fill-current'
                                        : 'text-gray-600'
                                    }`}
                                  />
                                ))}
                              </div>
                              <span className="text-sm text-gray-300">{formation.rating}</span>
                            </div>
                            <span className={`text-sm font-medium ${getDifficultyColor(formation.difficulty)}`}>
                              {formation.difficulty}
                            </span>
                          </div>

                          {/* Features */}
                          <div className="mb-6">
                            <h4 className="text-white font-medium mb-3">Ce que vous apprendrez :</h4>
                            <ul className="space-y-2">
                              {formation.features.slice(0, 3).map((feature, index) => (
                                <li key={index} className="flex items-center text-sm text-gray-300">
                                  <Check className="w-4 h-4 text-green-400 mr-2 flex-shrink-0" />
                                  {feature}
                                </li>
                              ))}
                              {formation.features.length > 3 && (
                                <li className="text-sm text-gray-400 ml-6">
                                  +{formation.features.length - 3} autres compétences
                                </li>
                              )}
                            </ul>
                          </div>

                          {/* Bouton de paiement */}
                          <motion.button
                            onClick={() => handlePayment(formation)}
                            disabled={isProcessing}
                            whileHover={{ scale: 1.02 }}
                            whileTap={{ scale: 0.98 }}
                            className={`w-full py-3 px-4 rounded-lg font-bold transition-all duration-300 ${
                              isProcessing
                                ? 'bg-gray-600 text-gray-300 cursor-not-allowed'
                                : `bg-gradient-to-r ${formation.color} text-white hover:shadow-lg`
                            }`}
                          >
                            {isProcessing ? (
                              <div className="flex items-center justify-center">
                                <Loader2 className="w-4 h-4 mr-2 animate-spin" />
                                Traitement...
                              </div>
                            ) : (
                              <div className="flex items-center justify-center">
                                <Lock className="w-4 h-4 mr-2" />
                                Payer {getCurrencySymbol(selectedCurrency)}
                                {formation.price[selectedCurrency as keyof typeof formation.price]}
                                {selectedCurrency === 'XOF' ? ' FCFA' : ''}
                              </div>
                            )}
                          </motion.button>
                        </div>
                      </div>
                    </motion.div>
                  );
                })}
              </div>
            ))}
        </div>

        {/* Footer sécurisé */}
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ duration: 0.6, delay: 0.8 }}
          className="text-center mt-12"
        >
          <div className="flex items-center justify-center text-sm text-gray-400">
            <Shield className="w-4 h-4 mr-2 text-green-400" />
            <span>Paiement 100% sécurisé et crypté avec Stripe</span>
          </div>
        </motion.div>
      </div>
    </div>
  );
}
