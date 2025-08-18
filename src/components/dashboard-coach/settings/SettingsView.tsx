'use client';

import { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { SettingsTabs } from './components/SettingsTabs';
import { ProfileForm } from './components/ProfileForm';
import { PasswordChangeForm } from './components/PasswordChangeForm';
import type { SettingsViewProps, CoachProfile, ProfileUpdateData, PasswordChangeData } from './types';

// Données de démonstration pour le coach connecté
const demoCoachProfile: CoachProfile = {
  id: 'coach-1',
  firstName: 'Marie',
  lastName: 'Dubois',
  email: 'marie.dubois@example.com',
  phone: '+33 6 12 34 56 78',
  avatar: 'https://images.unsplash.com/photo-1494790108755-2616b612b786?w=150&h=150&fit=crop&crop=faces',
  bio: 'Coach expérimentée spécialisée dans l\'art du pitch et la communication d\'entreprise. Plus de 10 ans d\'expérience dans l\'accompagnement de startups et d\'entreprises en croissance.',
  specialization: 'Pitch, Communication, Leadership',
  experience: 12,
  location: 'Paris, France',
  website: 'https://mariedubois-coaching.com',
  linkedin: 'https://linkedin.com/in/mariedubois',
  twitter: 'https://twitter.com/mariedubois',
  createdAt: new Date('2020-01-15'),
  updatedAt: new Date('2024-12-01'),
};

export const SettingsView = ({ activeTab = 'profile' }: SettingsViewProps) => {
  const [currentTab, setCurrentTab] = useState(activeTab);
  const [profile, setProfile] = useState<CoachProfile>(demoCoachProfile);
  const [isLoading, setIsLoading] = useState(false);

  // Simuler la mise à jour du profil
  const handleProfileUpdate = async (data: ProfileUpdateData) => {
    setIsLoading(true);
    
    // Simuler un délai d'API
    await new Promise(resolve => setTimeout(resolve, 1000));
    
    // Mettre à jour le profil
    setProfile(prev => ({
      ...prev,
      ...data,
      updatedAt: new Date(),
    }));
    
    setIsLoading(false);
  };

  // Simuler le changement d'avatar
  const handleAvatarChange = async (file: File) => {
    setIsLoading(true);
    
    // Simuler un délai d'upload
    await new Promise(resolve => setTimeout(resolve, 1500));
    
    // Créer une URL temporaire pour l'avatar
    const avatarUrl = URL.createObjectURL(file);
    
    setProfile(prev => ({
      ...prev,
      avatar: avatarUrl,
      updatedAt: new Date(),
    }));
    
    setIsLoading(false);
  };

  // Simuler le changement de mot de passe
  const handlePasswordChange = async (data: PasswordChangeData) => {
    setIsLoading(true);
    
    // Simuler un délai d'API
    await new Promise(resolve => setTimeout(resolve, 1000));
    
    // Ici vous feriez l'appel API réel
    console.log('Changement de mot de passe:', data);
    
    setIsLoading(false);
  };

  // Rendu du contenu selon l'onglet actif
  const renderTabContent = () => {
    switch (currentTab) {
      case 'profile':
        return (
          <ProfileForm
            profile={profile}
            onUpdate={handleProfileUpdate}
            onAvatarChange={handleAvatarChange}
            isLoading={isLoading}
          />
        );
      
      case 'security':
        return (
          <PasswordChangeForm
            onChangePassword={handlePasswordChange}
            isLoading={isLoading}
          />
        );
      
      case 'notifications':
        return (
          <motion.div 
            className="bg-gray-800 rounded-xl p-6"
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
          >
            <h2 className="text-xl font-bold text-white mb-4">Notifications</h2>
            <p className="text-gray-400">
              Les paramètres de notifications seront bientôt disponibles.
            </p>
          </motion.div>
        );
      
      case 'preferences':
        return (
          <motion.div 
            className="bg-gray-800 rounded-xl p-6"
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
          >
            <h2 className="text-xl font-bold text-white mb-4">Préférences</h2>
            <p className="text-gray-400">
              Les paramètres de préférences seront bientôt disponibles.
            </p>
          </motion.div>
        );
      
      default:
        return null;
    }
  };

  return (
    <div className="h-full flex flex-col lg:flex-row gap-6 p-6">
      {/* Sidebar avec les onglets */}
      <div className="lg:w-80 flex-shrink-0">
        <SettingsTabs
          activeTab={currentTab}
          onTabChange={setCurrentTab}
        />
      </div>

      {/* Contenu principal */}
      <div className="flex-1 min-w-0">
        <AnimatePresence mode="wait">
          <motion.div
            key={currentTab}
            initial={{ opacity: 0, x: 20 }}
            animate={{ opacity: 1, x: 0 }}
            exit={{ opacity: 0, x: -20 }}
            transition={{ duration: 0.2 }}
          >
            {renderTabContent()}
          </motion.div>
        </AnimatePresence>
      </div>
    </div>
  );
};

export default SettingsView;
