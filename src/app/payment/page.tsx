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
  Zap,
  Briefcase,
  Presentation,
  MessageCircle
} from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';

import AuthPageHeader from '@/components/ui/AuthPageHeader';
import { useSignup } from '@/contexts/SignupContext';
import { getAmountInCents } from '@/types/payment';
import { getActivityDomainsByType, ActivityDomain } from '@/lib/activityDomainService';
import { getModulesByType, Module } from '@/lib/moduleService';

// Types pour les formations avec prix statiques
interface FormationWithPrice extends Module {
  price: {
    USD: number;
    EUR: number;
    XOF: number;
  };
  color: string;
  icon: React.ComponentType<{ className?: string }>;
  isPopular?: boolean;
  isNew?: boolean;
}

interface DomainWithFormations extends ActivityDomain {
  icon: React.ComponentType<{ className?: string }>;
  color: string;
  formations: FormationWithPrice[];
}

// Mapping des icônes par nom
const iconMapping: { [key: string]: React.ComponentType<{ className?: string }> } = {
  'TrendingUp': TrendingUp,
  'Video': Video,
  'Users': Users,
  'Zap': Zap,
  'Target': Target,
  'Brain': Brain,
  'Briefcase': Briefcase,
  'Presentation': Presentation,
  'MessageCircle': MessageCircle
};

// Mapping des couleurs par nom
const colorMapping: { [key: string]: string } = {
  'from-green-500 to-emerald-600': 'from-green-500 to-emerald-600',
  'from-blue-500 to-purple-600': 'from-blue-500 to-purple-600',
  'from-yellow-500 to-orange-600': 'from-yellow-500 to-orange-600',
  'from-red-500 to-pink-600': 'from-red-500 to-pink-600',
  'from-purple-500 to-pink-600': 'from-purple-500 to-pink-600',
  'from-emerald-600 to-teal-700': 'from-emerald-600 to-teal-700',
  'from-indigo-500 to-blue-600': 'from-indigo-500 to-blue-600',
  'from-orange-500 to-red-600': 'from-orange-500 to-red-600'
};

// Prix statiques par type de module (en fonction de la difficulté et de la durée)
const getStaticPrice = (module: Module) => {
  const basePrice = {
    'debutant': { USD: 149, EUR: 129, XOF: 85000 },
    'intermediaire': { USD: 199, EUR: 179, XOF: 115000 },
    'avance': { USD: 299, EUR: 269, XOF: 175000 }
  };
  
  const difficulty = module.niveau_difficulte || 'debutant';
  const durationMultiplier = Math.max(1, module.duree_estimee / 8); // Prix de base pour 8h
  
  const base = basePrice[difficulty];
  return {
    USD: Math.round(base.USD * durationMultiplier),
    EUR: Math.round(base.EUR * durationMultiplier),
    XOF: Math.round(base.XOF * durationMultiplier)
  };
};

// Couleurs et icônes par domaine - Soft et transparentes
const getDomainStyling = (domainName: string) => {
  const stylingMap: { [key: string]: { color: string; icon: React.ComponentType<{ className?: string }> } } = {
    'Développement Personnel': { color: 'from-purple-300/30 to-pink-400/40', icon: Users },
    'Carrière & Emploi': { color: 'from-blue-300/30 to-cyan-400/40', icon: Target },
    'Prise de Parole': { color: 'from-emerald-300/30 to-teal-400/40', icon: TrendingUp },
    'Networking & Relations': { color: 'from-orange-300/30 to-amber-400/40', icon: MessageCircle },
    'Entrepreneuriat': { color: 'from-rose-300/30 to-red-400/40', icon: Briefcase },
    'default': { color: 'from-slate-300/30 to-gray-400/40', icon: Briefcase }
  };
  
  return stylingMap[domainName] || stylingMap.default;
};

export default function PaymentPage() {
  const { formData } = useSignup();
  const [selectedCurrency, setSelectedCurrency] = useState('USD');
  const [selectedFormation, setSelectedFormation] = useState<FormationWithPrice | null>(null);
  const [isProcessing, setIsProcessing] = useState(false);
  const [selectedDomain, setSelectedDomain] = useState<string | null>(null);
  const [domains, setDomains] = useState<DomainWithFormations[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  // Récupérer les domaines et modules depuis la base de données
  useEffect(() => {
    const fetchData = async () => {
      try {
        setIsLoading(true);
        setError(null);
        
        // Récupérer les domaines d'activité B2C
        const activityDomains = await getActivityDomainsByType('b2c');
        
        // Récupérer tous les modules B2C
        const modules = await getModulesByType('b2c');
        
        // Organiser les modules par domaine d'activité
        const domainsWithFormations: DomainWithFormations[] = activityDomains.map(domain => {
          const domainModules = modules.filter(module => 
            module.activity_domain_id === domain.id
          );
          
          // Convertir les modules en formations avec prix statiques
          const formations: FormationWithPrice[] = domainModules.map(module => {
            const styling = getDomainStyling(domain.name);
            const price = getStaticPrice(module);
            
            return {
              ...module,
              price,
              color: styling.color,
              icon: styling.icon,
              isPopular: Math.random() > 0.7, // 30% de chance d'être populaire
              isNew: Math.random() > 0.8 // 20% de chance d'être nouveau
            };
          });
          
          const styling = getDomainStyling(domain.name);
          
          return {
            ...domain,
            icon: styling.icon,
            color: styling.color,
            formations
          };
        });
        
        setDomains(domainsWithFormations);
      } catch (err) {
        console.error('Erreur lors de la récupération des données:', err);
        setError('Erreur lors du chargement des formations. Veuillez réessayer.');
      } finally {
        setIsLoading(false);
      }
    };

    fetchData();
  }, []);

  // Vérifier que nous avons les données du formulaire d'inscription
  useEffect(() => {
    if (!formData || !formData.email) {
      console.log('🔧 Données d\'inscription manquantes, redirection vers /signup');
      window.location.href = '/signup';
      return;
    }
  }, [formData]);

  const handleFormationSelect = (formation: FormationWithPrice) => {
    setSelectedFormation(formation);
  };

  const handlePayment = async (formation: FormationWithPrice) => {
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
      'debutant': 'text-green-400',
      'intermediaire': 'text-yellow-400',
      'avance': 'text-red-400'
    };
    return colors[difficulty as keyof typeof colors] || 'text-gray-400';
  };

  if (isLoading) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-gray-900 via-blue-900 to-gray-900 flex items-center justify-center">
        <div className="text-center">
          <Loader2 className="w-12 h-12 text-yellow-500 animate-spin mx-auto mb-4" />
          <p className="text-white text-lg">Chargement des formations...</p>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-gray-900 via-blue-900 to-gray-900 flex items-center justify-center">
        <div className="text-center">
          <div className="text-red-500 text-6xl mb-4">⚠️</div>
          <p className="text-white text-lg mb-4">{error}</p>
          <button 
            onClick={() => window.location.reload()} 
            className="bg-yellow-500 text-black px-6 py-3 rounded-lg font-bold hover:bg-yellow-400 transition-colors"
          >
            Réessayer
          </button>
        </div>
      </div>
    );
  }

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
                        <div className={`p-6 bg-gradient-to-br ${formation.color} backdrop-blur-md border border-white/10 rounded-t-xl`}>
                          <div className="flex items-start justify-between mb-4">
                            <div className="flex-1">
                              <h3 className="text-xl font-bold text-white mb-2 drop-shadow-xl">{formation.title}</h3>
                              <p className="text-white/90 text-sm drop-shadow-lg leading-relaxed">{formation.description}</p>
                            </div>
                            <div className="w-14 h-14 bg-white/20 rounded-xl flex items-center justify-center backdrop-blur-sm border border-white/30 shadow-lg">
                              <Icon className="w-7 h-7 text-white drop-shadow-xl" />
                            </div>
                          </div>
                          
                          {/* Prix */}
                          <div className="text-center bg-white/10 rounded-xl p-4 backdrop-blur-sm border border-white/20">
                            <div className="text-3xl font-bold text-white drop-shadow-xl">
                              {getCurrencySymbol(selectedCurrency)}
                              {formation.price[selectedCurrency as keyof typeof formation.price].toLocaleString('fr-FR')}
                              {selectedCurrency === 'XOF' ? ' FCFA' : ''}
                            </div>
                            <div className="text-white/80 text-sm drop-shadow-lg mt-1">
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
                              <div className="text-sm font-medium text-white">{formation.duree_estimee}h</div>
                              <div className="text-xs text-gray-400">Durée</div>
                            </div>
                            <div className="text-center">
                              <div className="flex items-center justify-center text-blue-400 mb-1">
                                <BookOpen className="w-4 h-4 mr-1" />
                              </div>
                              <div className="text-sm font-medium text-white">-</div>
                              <div className="text-xs text-gray-400">Leçons</div>
                            </div>
                            <div className="text-center">
                              <div className="flex items-center justify-center text-green-400 mb-1">
                                <Users className="w-4 h-4 mr-1" />
                              </div>
                              <div className="text-sm font-medium text-white">-</div>
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
                                      i < 4
                                        ? 'text-yellow-400 fill-current'
                                        : 'text-gray-600'
                                    }`}
                                  />
                                ))}
                              </div>
                              <span className="text-sm text-gray-300">4.0</span>
                            </div>
                            <span className={`text-sm font-medium ${getDifficultyColor(formation.niveau_difficulte || 'debutant')}`}>
                              {formation.niveau_difficulte || 'débutant'}
                            </span>
                          </div>

                          {/* Features */}
                          <div className="mb-6">
                            <h4 className="text-white font-medium mb-3">Ce que vous apprendrez :</h4>
                            <ul className="space-y-2">
                              <li className="flex items-center text-sm text-gray-300">
                                <Check className="w-4 h-4 text-green-400 mr-2 flex-shrink-0" />
                                {formation.theme || 'Formation spécialisée'}
                              </li>
                              <li className="flex items-center text-sm text-gray-300">
                                  <Check className="w-4 h-4 text-green-400 mr-2 flex-shrink-0" />
                                {formation.duree_estimee} heures de contenu
                                </li>
                              <li className="flex items-center text-sm text-gray-300">
                                <Check className="w-4 h-4 text-green-400 mr-2 flex-shrink-0" />
                                Accès illimité
                                </li>
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
                                {formation.price[selectedCurrency as keyof typeof formation.price].toLocaleString('fr-FR')}
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
