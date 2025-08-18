'use client';

import { useState, useRef } from 'react';
import { motion } from 'framer-motion';
import { 
  User, 
  Mail, 
  Phone, 
  MapPin, 
  Globe, 
  Linkedin, 
  Twitter, 
  Camera, 
  Save, 
  X,
  Briefcase,
  Award
} from 'lucide-react';
import Image from 'next/image';
import type { ProfileFormProps } from '../types';

export const ProfileForm = ({ profile, onUpdate, onAvatarChange, isLoading = false }: ProfileFormProps) => {
  const [formData, setFormData] = useState({
    firstName: profile.firstName || '',
    lastName: profile.lastName || '',
    phone: profile.phone || '',
    bio: profile.bio || '',
    specialization: profile.specialization || '',
    experience: profile.experience || 0,
    location: profile.location || '',
    website: profile.website || '',
    linkedin: profile.linkedin || '',
    twitter: profile.twitter || '',
  });
  
  const [isEditing, setIsEditing] = useState(false);
  const [avatarPreview, setAvatarPreview] = useState<string | null>(null);
  const [isUploadingAvatar, setIsUploadingAvatar] = useState(false);
  const fileInputRef = useRef<HTMLInputElement>(null);

  const handleInputChange = (field: string, value: string | number) => {
    setFormData(prev => ({ ...prev, [field]: value }));
  };

  const handleAvatarChange = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    // Validation du fichier
    if (!file.type.startsWith('image/')) {
      alert('Veuillez sélectionner une image valide');
      return;
    }

    if (file.size > 5 * 1024 * 1024) { // 5MB max
      alert('L\'image doit faire moins de 5MB');
      return;
    }

    setIsUploadingAvatar(true);
    
    try {
      // Créer un aperçu
      const reader = new FileReader();
      reader.onload = (e) => {
        setAvatarPreview(e.target?.result as string);
      };
      reader.readAsDataURL(file);

      // Upload de l'avatar
      await onAvatarChange(file);
    } catch (error) {
      console.error('Erreur lors de l\'upload de l\'avatar:', error);
      alert('Erreur lors de l\'upload de l\'avatar');
    } finally {
      setIsUploadingAvatar(false);
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsEditing(false);
    
    try {
      await onUpdate(formData);
    } catch (error) {
      console.error('Erreur lors de la mise à jour du profil:', error);
      alert('Erreur lors de la mise à jour du profil');
    }
  };

  const currentAvatar = avatarPreview || profile.avatar;

  return (
    <motion.div 
      className="bg-gray-800 rounded-xl p-6"
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
    >
      <div className="flex items-center justify-between mb-6">
        <h2 className="text-xl font-bold text-white flex items-center">
          <User className="w-5 h-5 mr-2 text-yellow-400" />
          Profil Coach
        </h2>
        <button
          onClick={() => setIsEditing(!isEditing)}
          className={`px-4 py-2 rounded-lg font-medium transition-colors ${
            isEditing 
              ? 'bg-gray-600 hover:bg-gray-500 text-white' 
              : 'bg-yellow-500 hover:bg-yellow-600 text-black'
          }`}
        >
          {isEditing ? 'Annuler' : 'Modifier'}
        </button>
      </div>

      <form onSubmit={handleSubmit} className="space-y-6">
        {/* Section Avatar */}
        <div className="flex items-center space-x-6">
          <div className="relative">
            <div className="w-24 h-24 rounded-full overflow-hidden bg-gray-700 border-2 border-gray-600">
              {currentAvatar ? (
                <Image
                  src={currentAvatar}
                  alt={`${profile.firstName} ${profile.lastName}`}
                  width={96}
                  height={96}
                  className="w-full h-full object-cover"
                />
              ) : (
                <div className="w-full h-full flex items-center justify-center">
                  <User className="w-12 h-12 text-gray-400" />
                </div>
              )}
            </div>
            
            {isEditing && (
              <button
                type="button"
                onClick={() => fileInputRef.current?.click()}
                disabled={isUploadingAvatar}
                className="absolute -bottom-1 -right-1 w-8 h-8 bg-yellow-500 hover:bg-yellow-600 rounded-full flex items-center justify-center transition-colors disabled:opacity-50"
              >
                {isUploadingAvatar ? (
                  <div className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin" />
                ) : (
                  <Camera className="w-4 h-4 text-black" />
                )}
              </button>
            )}
            
            <input
              ref={fileInputRef}
              type="file"
              accept="image/*"
              onChange={handleAvatarChange}
              className="hidden"
            />
          </div>
          
          <div className="flex-1">
            <h3 className="text-lg font-semibold text-white mb-1">
              {profile.firstName} {profile.lastName}
            </h3>
            <p className="text-gray-400 flex items-center">
              <Mail className="w-4 h-4 mr-2" />
              {profile.email}
            </p>
            {profile.phone && (
              <p className="text-gray-400 flex items-center mt-1">
                <Phone className="w-4 h-4 mr-2" />
                {profile.phone}
              </p>
            )}
          </div>
        </div>

        {/* Informations personnelles */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div>
            <label className="block text-sm font-medium text-gray-300 mb-2">
              Prénom
            </label>
            <input
              type="text"
              value={formData.firstName}
              onChange={(e) => handleInputChange('firstName', e.target.value)}
              disabled={!isEditing}
              className="w-full px-3 py-2 bg-gray-700 border border-gray-600 rounded-lg text-white disabled:opacity-50 disabled:cursor-not-allowed focus:border-yellow-500 focus:outline-none"
            />
          </div>
          
          <div>
            <label className="block text-sm font-medium text-gray-300 mb-2">
              Nom
            </label>
            <input
              type="text"
              value={formData.lastName}
              onChange={(e) => handleInputChange('lastName', e.target.value)}
              disabled={!isEditing}
              className="w-full px-3 py-2 bg-gray-700 border border-gray-600 rounded-lg text-white disabled:opacity-50 disabled:cursor-not-allowed focus:border-yellow-500 focus:outline-none"
            />
          </div>
          
          <div>
            <label className="block text-sm font-medium text-gray-300 mb-2">
              Téléphone
            </label>
            <input
              type="tel"
              value={formData.phone}
              onChange={(e) => handleInputChange('phone', e.target.value)}
              disabled={!isEditing}
              className="w-full px-3 py-2 bg-gray-700 border border-gray-600 rounded-lg text-white disabled:opacity-50 disabled:cursor-not-allowed focus:border-yellow-500 focus:outline-none"
            />
          </div>
          
          <div>
            <label className="block text-sm font-medium text-gray-300 mb-2">
              Localisation
            </label>
            <input
              type="text"
              value={formData.location}
              onChange={(e) => handleInputChange('location', e.target.value)}
              disabled={!isEditing}
              className="w-full px-3 py-2 bg-gray-700 border border-gray-600 rounded-lg text-white disabled:opacity-50 disabled:cursor-not-allowed focus:border-yellow-500 focus:outline-none"
            />
          </div>
        </div>

        {/* Spécialisation et expérience */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div>
            <label className="block text-sm font-medium text-gray-300 mb-2">
              Spécialisation
            </label>
            <input
              type="text"
              value={formData.specialization}
              onChange={(e) => handleInputChange('specialization', e.target.value)}
              disabled={!isEditing}
              placeholder="ex: Pitch, Communication, Leadership"
              className="w-full px-3 py-2 bg-gray-700 border border-gray-600 rounded-lg text-white disabled:opacity-50 disabled:cursor-not-allowed focus:border-yellow-500 focus:outline-none"
            />
          </div>
          
          <div>
            <label className="block text-sm font-medium text-gray-300 mb-2">
              Années d'expérience
            </label>
            <input
              type="number"
              min="0"
              max="50"
              value={formData.experience}
              onChange={(e) => handleInputChange('experience', parseInt(e.target.value) || 0)}
              disabled={!isEditing}
              className="w-full px-3 py-2 bg-gray-700 border border-gray-600 rounded-lg text-white disabled:opacity-50 disabled:cursor-not-allowed focus:border-yellow-500 focus:outline-none"
            />
          </div>
        </div>

        {/* Bio */}
        <div>
          <label className="block text-sm font-medium text-gray-300 mb-2">
            Biographie
          </label>
          <textarea
            value={formData.bio}
            onChange={(e) => handleInputChange('bio', e.target.value)}
            disabled={!isEditing}
            rows={4}
            placeholder="Parlez-nous de votre parcours et de votre expertise..."
            className="w-full px-3 py-2 bg-gray-700 border border-gray-600 rounded-lg text-white disabled:opacity-50 disabled:cursor-not-allowed focus:border-yellow-500 focus:outline-none resize-none"
          />
        </div>

        {/* Réseaux sociaux */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          <div>
            <label className="block text-sm font-medium text-gray-300 mb-2">
              Site web
            </label>
            <input
              type="url"
              value={formData.website}
              onChange={(e) => handleInputChange('website', e.target.value)}
              disabled={!isEditing}
              placeholder="https://votre-site.com"
              className="w-full px-3 py-2 bg-gray-700 border border-gray-600 rounded-lg text-white disabled:opacity-50 disabled:cursor-not-allowed focus:border-yellow-500 focus:outline-none"
            />
          </div>
          
          <div>
            <label className="block text-sm font-medium text-gray-300 mb-2">
              LinkedIn
            </label>
            <input
              type="url"
              value={formData.linkedin}
              onChange={(e) => handleInputChange('linkedin', e.target.value)}
              disabled={!isEditing}
              placeholder="https://linkedin.com/in/votre-profil"
              className="w-full px-3 py-2 bg-gray-700 border border-gray-600 rounded-lg text-white disabled:opacity-50 disabled:cursor-not-allowed focus:border-yellow-500 focus:outline-none"
            />
          </div>
          
          <div>
            <label className="block text-sm font-medium text-gray-300 mb-2">
              Twitter
            </label>
            <input
              type="url"
              value={formData.twitter}
              onChange={(e) => handleInputChange('twitter', e.target.value)}
              disabled={!isEditing}
              placeholder="https://twitter.com/votre-compte"
              className="w-full px-3 py-2 bg-gray-700 border border-gray-600 rounded-lg text-white disabled:opacity-50 disabled:cursor-not-allowed focus:border-yellow-500 focus:outline-none"
            />
          </div>
        </div>

        {/* Bouton de sauvegarde */}
        {isEditing && (
          <div className="flex justify-end space-x-3 pt-4 border-t border-gray-700">
            <button
              type="button"
              onClick={() => setIsEditing(false)}
              className="px-4 py-2 bg-gray-600 hover:bg-gray-500 text-white rounded-lg font-medium transition-colors"
            >
              Annuler
            </button>
            <button
              type="submit"
              disabled={isLoading}
              className="px-6 py-2 bg-yellow-500 hover:bg-yellow-600 text-black rounded-lg font-medium transition-colors disabled:opacity-50 disabled:cursor-not-allowed flex items-center"
            >
              {isLoading ? (
                <>
                  <div className="w-4 h-4 border-2 border-black border-t-transparent rounded-full animate-spin mr-2" />
                  Sauvegarde...
                </>
              ) : (
                <>
                  <Save className="w-4 h-4 mr-2" />
                  Sauvegarder
                </>
              )}
            </button>
          </div>
        )}
      </form>
    </motion.div>
  );
};
