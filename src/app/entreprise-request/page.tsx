'use client';
import { useState } from 'react';
import { useRouter } from 'next/navigation';
import Link from 'next/link';
import { Building, Mail, Phone, Users, Target, Send, ArrowLeft, CheckCircle } from 'lucide-react';
import AuthCard from '@/components/ui/AuthCard';
import { motion } from 'framer-motion';
import AuthPageHeader from '@/components/ui/AuthPageHeader';

interface FormData {
  companyName: string;
  contactName: string;
  email: string;
  phone: string;
  companySize: string;
  industry: string;
  needs: string;
  budget: string;
  timeline: string;
  additionalInfo: string;
}

const defaultFormData: FormData = {
  companyName: '',
  contactName: '',
  email: '',
  phone: '',
  companySize: '',
  industry: '',
  needs: '',
  budget: '',
  timeline: '',
  additionalInfo: ''
};

export default function EntrepriseRequestPage() {
  const router = useRouter();
  const [formData, setFormData] = useState<FormData>(defaultFormData);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [isSubmitted, setIsSubmitted] = useState(false);

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>) => {
    const { name, value } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: value,
    }));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsSubmitting(true);
    
    // Simuler l'envoi de la requête
    await new Promise(resolve => setTimeout(resolve, 2000));
    
    console.log('Entreprise request submitted:', formData);
    setIsSubmitting(false);
    setIsSubmitted(true);
  };

  if (isSubmitted) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-gray-900 via-blue-900 to-gray-900 flex flex-col">
        <AuthPageHeader pageTitle="Demande envoyée" />
        
        <div className="flex-1 flex items-center justify-center p-4 pt-24">
          <AuthCard
            title="Demande envoyée !"
            subtitle="Nous vous recontacterons dans les plus brefs délais"
            icon={<CheckCircle className="w-8 h-8 text-green-400" />}
          >
            <motion.div
              initial={{ opacity: 0, scale: 0.9 }}
              animate={{ opacity: 1, scale: 1 }}
              transition={{ duration: 0.5 }}
              className="text-center space-y-6"
            >
              <div className="w-16 h-16 bg-green-100 rounded-full flex items-center justify-center mx-auto">
                <CheckCircle className="w-8 h-8 text-green-600" />
              </div>
              
              <div className="space-y-2">
                <h3 className="text-xl font-semibold text-white">Merci pour votre intérêt !</h3>
                <p className="text-gray-400">
                  Notre équipe commerciale va analyser votre demande et vous recontacter dans les 24-48h.
                </p>
              </div>

              <div className="bg-gray-700 bg-opacity-50 rounded-xl p-4 space-y-3">
                <div className="flex items-center space-x-3">
                  <div className="w-2 h-2 bg-green-400 rounded-full"></div>
                  <span className="text-sm text-gray-300">Email de confirmation envoyé</span>
                </div>
                <div className="flex items-center space-x-3">
                  <div className="w-2 h-2 bg-blue-400 rounded-full"></div>
                  <span className="text-sm text-gray-300">Analyse de votre demande en cours</span>
                </div>
                <div className="flex items-center space-x-3">
                  <div className="w-2 h-2 bg-yellow-400 rounded-full"></div>
                  <span className="text-sm text-gray-300">Contact sous 24-48h</span>
                </div>
              </div>

              <div className="flex flex-col space-y-3">
                <Link 
                  href="/"
                  className="w-full bg-gradient-to-r from-yellow-400 to-yellow-500 text-black font-semibold py-3 px-4 rounded-lg hover:shadow-xl transition-all flex items-center justify-center space-x-2"
                >
                  <ArrowLeft className="w-5 h-5" />
                  <span>Retour à l'accueil</span>
                </Link>
                
                <Link 
                  href="/login"
                  className="w-full border border-gray-600 text-white font-semibold py-3 px-4 rounded-lg hover:bg-gray-700 transition-all flex items-center justify-center space-x-2"
                >
                  <span>Accéder à votre espace</span>
                </Link>
              </div>
            </motion.div>
          </AuthCard>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-900 via-blue-900 to-gray-900 flex flex-col">
      {/* Auth Page Header */}
      <AuthPageHeader pageTitle="Demande entreprise" />
      
      {/* Main Content */}
      <div className="flex-1 flex items-center justify-center p-4 pt-24">
        <AuthCard
          title="Demande de devis"
          subtitle="Découvrez nos solutions pour votre entreprise"
          icon={<Building className="w-8 h-8 text-white" />}
        >
          {/* Quick Stats */}
          <div className="bg-gray-700 bg-opacity-50 rounded-xl p-4">
            <div className="grid grid-cols-3 gap-4 text-center">
              <div>
                <div className="text-lg font-bold text-yellow-400">500+</div>
                <div className="text-xs text-gray-400">Entreprises</div>
              </div>
              <div>
                <div className="text-lg font-bold text-cyan-400">24h</div>
                <div className="text-xs text-gray-400">Réponse</div>
              </div>
              <div>
                <div className="text-lg font-bold text-green-400">98%</div>
                <div className="text-xs text-gray-400">Satisfaction</div>
              </div>
            </div>
          </div>

          {/* Request Form */}
          <form onSubmit={handleSubmit} className="space-y-6">
            {/* Informations de base */}
            <div className="space-y-4">
              <h3 className="text-lg font-semibold text-white flex items-center space-x-2">
                <Building className="w-5 h-5 text-yellow-400" />
                <span>Informations de l'entreprise</span>
              </h3>
              
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-medium text-gray-300 mb-2">
                    Nom de l'entreprise *
                  </label>
                  <input
                    type="text"
                    name="companyName"
                    value={formData.companyName}
                    onChange={handleInputChange}
                    required
                    className="w-full px-4 py-3 bg-gray-700 border border-gray-600 rounded-lg text-white placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-yellow-500 focus:border-transparent"
                    placeholder="Votre entreprise"
                  />
                </div>
                
                <div>
                  <label className="block text-sm font-medium text-gray-300 mb-2">
                    Nom du contact *
                  </label>
                  <input
                    type="text"
                    name="contactName"
                    value={formData.contactName}
                    onChange={handleInputChange}
                    required
                    className="w-full px-4 py-3 bg-gray-700 border border-gray-600 rounded-lg text-white placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-yellow-500 focus:border-transparent"
                    placeholder="Votre nom"
                  />
                </div>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-medium text-gray-300 mb-2">
                    Email *
                  </label>
                  <input
                    type="email"
                    name="email"
                    value={formData.email}
                    onChange={handleInputChange}
                    required
                    className="w-full px-4 py-3 bg-gray-700 border border-gray-600 rounded-lg text-white placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-yellow-500 focus:border-transparent"
                    placeholder="contact@entreprise.com"
                  />
                </div>
                
                <div>
                  <label className="block text-sm font-medium text-gray-300 mb-2">
                    Téléphone
                  </label>
                  <input
                    type="tel"
                    name="phone"
                    value={formData.phone}
                    onChange={handleInputChange}
                    className="w-full px-4 py-3 bg-gray-700 border border-gray-600 rounded-lg text-white placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-yellow-500 focus:border-transparent"
                    placeholder="+33 1 23 45 67 89"
                  />
                </div>
              </div>
            </div>

            {/* Détails de l'entreprise */}
            <div className="space-y-4">
              <h3 className="text-lg font-semibold text-white flex items-center space-x-2">
                <Users className="w-5 h-5 text-cyan-400" />
                <span>Détails de l'entreprise</span>
              </h3>
              
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-medium text-gray-300 mb-2">
                    Taille de l'entreprise *
                  </label>
                  <select
                    name="companySize"
                    value={formData.companySize}
                    onChange={handleInputChange}
                    required
                    className="w-full px-4 py-3 bg-gray-700 border border-gray-600 rounded-lg text-white focus:outline-none focus:ring-2 focus:ring-yellow-500 focus:border-transparent"
                  >
                    <option value="">Sélectionnez...</option>
                    <option value="1-10">1-10 employés</option>
                    <option value="11-50">11-50 employés</option>
                    <option value="51-200">51-200 employés</option>
                    <option value="201-1000">201-1000 employés</option>
                    <option value="1000+">1000+ employés</option>
                  </select>
                </div>
                
                <div>
                  <label className="block text-sm font-medium text-gray-300 mb-2">
                    Secteur d'activité *
                  </label>
                  <select
                    name="industry"
                    value={formData.industry}
                    onChange={handleInputChange}
                    required
                    className="w-full px-4 py-3 bg-gray-700 border border-gray-600 rounded-lg text-white focus:outline-none focus:ring-2 focus:ring-yellow-500 focus:border-transparent"
                  >
                    <option value="">Sélectionnez...</option>
                    <option value="tech">Technologie</option>
                    <option value="finance">Finance</option>
                    <option value="healthcare">Santé</option>
                    <option value="education">Éducation</option>
                    <option value="retail">Commerce</option>
                    <option value="manufacturing">Industrie</option>
                    <option value="consulting">Conseil</option>
                    <option value="other">Autre</option>
                  </select>
                </div>
              </div>
            </div>

            {/* Besoins et budget */}
            <div className="space-y-4">
              <h3 className="text-lg font-semibold text-white flex items-center space-x-2">
                <Target className="w-5 h-5 text-green-400" />
                <span>Vos besoins</span>
              </h3>
              
              <div>
                <label className="block text-sm font-medium text-gray-300 mb-2">
                  Besoins principaux *
                </label>
                <textarea
                  name="needs"
                  value={formData.needs}
                  onChange={handleInputChange}
                  required
                  rows={3}
                  className="w-full px-4 py-3 bg-gray-700 border border-gray-600 rounded-lg text-white placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-yellow-500 focus:border-transparent"
                  placeholder="Décrivez vos besoins en formation, nombre de personnes à former, objectifs..."
                />
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-medium text-gray-300 mb-2">
                    Budget estimé
                  </label>
                  <select
                    name="budget"
                    value={formData.budget}
                    onChange={handleInputChange}
                    className="w-full px-4 py-3 bg-gray-700 border border-gray-600 rounded-lg text-white focus:outline-none focus:ring-2 focus:ring-yellow-500 focus:border-transparent"
                  >
                    <option value="">Sélectionnez...</option>
                    <option value="<5000">Moins de 5 000€</option>
                    <option value="5000-15000">5 000€ - 15 000€</option>
                    <option value="15000-50000">15 000€ - 50 000€</option>
                    <option value="50000+">Plus de 50 000€</option>
                  </select>
                </div>
                
                <div>
                  <label className="block text-sm font-medium text-gray-300 mb-2">
                    Délai souhaité
                  </label>
                  <select
                    name="timeline"
                    value={formData.timeline}
                    onChange={handleInputChange}
                    className="w-full px-4 py-3 bg-gray-700 border border-gray-600 rounded-lg text-white focus:outline-none focus:ring-2 focus:ring-yellow-500 focus:border-transparent"
                  >
                    <option value="">Sélectionnez...</option>
                    <option value="immediate">Immédiat</option>
                    <option value="1month">Dans 1 mois</option>
                    <option value="3months">Dans 3 mois</option>
                    <option value="6months">Dans 6 mois</option>
                    <option value="flexible">Flexible</option>
                  </select>
                </div>
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-300 mb-2">
                  Informations complémentaires
                </label>
                <textarea
                  name="additionalInfo"
                  value={formData.additionalInfo}
                  onChange={handleInputChange}
                  rows={3}
                  className="w-full px-4 py-3 bg-gray-700 border border-gray-600 rounded-lg text-white placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-yellow-500 focus:border-transparent"
                  placeholder="Toute information supplémentaire qui pourrait nous aider à mieux comprendre vos besoins..."
                />
              </div>
            </div>

            {/* Bouton de soumission */}
            <div>
              <button
                type="submit"
                disabled={isSubmitting}
                className="w-full flex justify-center py-3 px-4 border border-transparent rounded-xl shadow-sm text-sm font-medium text-black bg-gradient-to-r from-yellow-400 to-yellow-500 hover:from-yellow-300 hover:to-yellow-400 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-yellow-500 transition-all duration-200 disabled:opacity-50 disabled:cursor-not-allowed"
              >
                {isSubmitting ? (
                  <div className="flex items-center space-x-2">
                    <div className="w-4 h-4 border-2 border-black border-t-transparent rounded-full animate-spin"></div>
                    <span>Envoi en cours...</span>
                  </div>
                ) : (
                  <div className="flex items-center space-x-2">
                    <Send className="w-5 h-5" />
                    <span>Envoyer ma demande</span>
                  </div>
                )}
              </button>
            </div>
          </form>

          {/* Divider */}
          <div className="relative mt-8 mb-6">
            <div className="absolute inset-0 flex items-center" aria-hidden="true">
              <div className="w-full border-t border-gray-600"></div>
            </div>
            <div className="relative flex justify-center text-sm">
              <span className="px-2 bg-gray-800 text-gray-400">Ou</span>
            </div>
          </div>

          <div className="text-center space-y-3">
            <Link 
              href="/login"
              className="w-full border border-gray-600 text-white font-semibold py-3 px-4 rounded-lg hover:bg-gray-700 transition-all flex items-center justify-center space-x-2"
            >
              <span>Vous êtes déjà client ?</span>
            </Link>
            
            <Link 
              href="/"
              className="w-full text-gray-400 hover:text-white transition-colors flex items-center justify-center space-x-2 text-sm"
            >
              <ArrowLeft className="w-4 h-4" />
              <span>Retour à l'accueil</span>
            </Link>
          </div>
        </AuthCard>
      </div>
    </div>
  );
}
