'use client';

import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { ArrowLeft, Camera, Save, X, Lock, User, Mail, Phone, Building, Briefcase, ChevronLeft, Settings, Check, Eye, Share2, Star, Award, Clock, Zap, BarChart3, Trophy, Target, Upload } from 'lucide-react';
import { UserService, User as UserType } from '@/lib/userService';
import { createClient } from '@supabase/supabase-js';

const supabase = createClient(
  process.env.NEXT_PUBLIC_SUPABASE_URL!,
  process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!
);

interface LearnerProfileProps {
  onBack: () => void;
}

export default function LearnerProfile({ onBack }: LearnerProfileProps) {
  const [user, setUser] = useState<UserType | null>(null);
  const [loading, setLoading] = useState(true);
  const [showEditModal, setShowEditModal] = useState(false);
  const [showPasswordModal, setShowPasswordModal] = useState(false);
  const [previewImage, setPreviewImage] = useState<string | null>(null);
  const [profileImage, setProfileImage] = useState<File | null>(null);
  
  // Form states
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    phone: '',
    company: '',
    position: '',
    bio: ''
  });
  
  // Password states
  const [currentPassword, setCurrentPassword] = useState('');
  const [newPassword, setNewPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');

  useEffect(() => {
    const loadUserData = async () => {
      try {
        const userData = await UserService.getCurrentUser();
        setUser(userData);
        if (userData) {
          setFormData({
            name: userData.name || '',
            email: userData.email || '',
            phone: userData.phone || '',
            company: userData.company || '',
            position: userData.position || '',
            bio: userData.bio || ''
          });
        }
      } catch (error) {
        console.error('Erreur lors du chargement des données utilisateur:', error);
      } finally {
        setLoading(false);
      }
    };

    loadUserData();
  }, []);

  const getUserInitials = () => {
    if (!user?.name) return '??';
    return UserService.getUserInitials(user.name);
  };

  const handleImageChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      setProfileImage(file);
      const reader = new FileReader();
      reader.onloadend = () => {
        setPreviewImage(reader.result as string);
      };
      reader.readAsDataURL(file);
    }
  };

  const handleSaveProfile = async () => {
    if (!user) return;

    try {
      // Upload image if changed
      let avatarUrl = user.avatar_url;
      if (profileImage) {
        avatarUrl = await UserService.uploadAvatar(user.id, profileImage);
      }

      // Update user data
      const success = await UserService.updateUserProfile(user.id, {
        ...formData,
        avatar_url: avatarUrl
      });

      if (success) {
        // Refresh user data
        const updatedUser = await UserService.getCurrentUser();
        setUser(updatedUser);
        setShowEditModal(false);
        setProfileImage(null);
        setPreviewImage(null);
      }
    } catch (error) {
      console.error('Erreur lors de la sauvegarde:', error);
    }
  };

  const handleChangePassword = async () => {
    if (newPassword !== confirmPassword) {
      alert('Les mots de passe ne correspondent pas');
      return;
    }

    try {
      const success = await UserService.updateUserPassword(currentPassword, newPassword);
      if (success) {
        setShowPasswordModal(false);
        setCurrentPassword('');
        setNewPassword('');
        setConfirmPassword('');
        alert('Mot de passe mis à jour avec succès');
      }
    } catch (error) {
      console.error('Erreur lors du changement de mot de passe:', error);
      alert('Erreur lors du changement de mot de passe');
    }
  };

  // Données simulées pour les statistiques et activités
  const stats = [
    { value: '9/12', label: 'Modules Completed', progress: 75, color: 'from-green-400 to-green-500' },
    { value: '47h', label: 'Practice Time', sublabel: '+5h this week', color: 'from-blue-400 to-blue-500' },
    { value: '4.8', label: 'Avg Score', icon: Star, color: 'from-yellow-400 to-yellow-500' },
    { value: '23', label: 'VR Sessions', sublabel: '12h total', color: 'from-cyan-400 to-cyan-500' },
  ];

  const achievements = [
    { id: 1, name: 'First Star', icon: Star, color: 'from-yellow-400 to-yellow-500', unlocked: true },
    { id: 2, name: 'Consistent', icon: Check, color: 'from-green-400 to-green-500', unlocked: true },
    { id: 3, name: 'VR Master', icon: Eye, color: 'from-purple-400 to-purple-500', unlocked: true },
    { id: 4, name: 'Locked', icon: Award, color: 'from-gray-600 to-gray-700', unlocked: false },
  ];

  const activities = [
    { id: 1, title: 'Completed Module 9: Advanced Techniques', time: '2 hours ago', icon: Check, iconBg: 'bg-green-600', score: '4.9/5' },
    { id: 2, title: 'VR Session: TEDx Stage Practice', time: '1 day ago', icon: Clock, iconBg: 'bg-purple-600', duration: '18 min' },
  ];

  if (loading) {
    return (
      <div className="flex items-center justify-center h-64">
        <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-yellow-400"></div>
      </div>
    );
  }

  if (!user) {
    return (
      <div className="flex items-center justify-center h-64">
        <div className="text-white">Utilisateur non trouvé</div>
      </div>
    );
  }

  return (
    <>
      <motion.div 
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5, delay: 0.1 }}
        className="space-y-6"
      >
        {/* Profile Header */}
        <div className="bg-gray-800/80 backdrop-blur-sm rounded-xl shadow-lg p-6 border border-gray-700 hover:shadow-xl transition-all">
          <div className="mb-6">
            <div className="flex items-center justify-between mb-6">
              <button 
                onClick={onBack}
                className="p-2 rounded-full bg-gray-700/50 hover:bg-gray-600/50 transition-colors"
              >
                <ChevronLeft className="w-5 h-5 text-white" />
              </button>
              <div className="flex items-center space-x-2">
                <button 
                  onClick={() => setShowEditModal(true)}
                  className="px-3 py-1.5 bg-yellow-500 hover:bg-yellow-600 text-gray-900 text-sm font-medium rounded-lg transition-colors flex items-center space-x-1"
                >
                  <Settings className="w-3 h-3" />
                  <span>Modifier</span>
                </button>
                <button className="px-3 py-1.5 bg-gray-700/50 hover:bg-gray-600/50 text-white text-sm font-medium rounded-lg border border-gray-600 hover:border-gray-500 transition-colors flex items-center space-x-1">
                  <Share2 className="w-3 h-3" />
                  <span>Partager</span>
                </button>
              </div>
            </div>

            <div className="text-center">
              <h2 className="text-xl font-bold text-white mb-6">Mon Profil</h2>
              <div className="relative inline-block mb-4 group">
                <div className="w-28 h-28 rounded-full border-4 border-yellow-400 shadow-lg shadow-yellow-400/30 mx-auto overflow-hidden bg-gradient-to-br from-yellow-400 to-yellow-600 flex items-center justify-center">
                  {previewImage || user.avatar_url ? (
                    <img 
                      src={previewImage || user.avatar_url} 
                      alt="Profile"
                      className="w-full h-full object-cover"
                    />
                  ) : (
                    <span className="text-3xl font-bold text-gray-900">{getUserInitials()}</span>
                  )}
                </div>
                <div className="absolute -bottom-2 -right-2 bg-green-500 w-8 h-8 rounded-full border-4 border-gray-900 flex items-center justify-center">
                  <span className="text-white text-xs font-bold">{user.level}</span>
                </div>
                {/* Drop Icon */}
                <label className="absolute -bottom-1 -left-1 bg-yellow-400 hover:bg-yellow-500 text-gray-900 w-6 h-6 rounded-full border-2 border-gray-900 flex items-center justify-center cursor-pointer transition-all opacity-0 group-hover:opacity-100 hover:scale-110">
                  <Upload className="w-3 h-3" />
                  <input 
                    type="file" 
                    className="hidden" 
                    accept="image/*"
                    onChange={handleImageChange}
                  />
                </label>
              </div>
              
              <h1 className="text-2xl font-bold text-white mb-1">{user.name}</h1>
              <p className="text-gray-300 text-sm mb-6">
                {user.position && `${user.position} • `}{user.company || user.role}
              </p>
              
              {/* Level Progress */}
              <div className="bg-gray-700/50 rounded-xl p-4 border border-gray-600">
                <div className="flex items-center justify-between mb-2">
                  <span className="text-white font-medium">Niveau {user.level} - Orateur Avancé</span>
                  <span className="text-yellow-400 font-bold">{user.xp} XP</span>
                </div>
                <div className="w-full bg-gray-600 rounded-full h-2.5 mb-1.5">
                  <div 
                    className="h-2.5 rounded-full bg-gradient-to-r from-yellow-400 to-yellow-500"
                    style={{ width: `${(user.xp % 1000) / 10}%` }}
                  />
                </div>
                <div className="flex justify-between text-xs text-gray-300">
                  <span>{user.xp} / {Math.ceil(user.xp / 1000) * 1000} XP</span>
                  <span>{Math.ceil(user.xp / 1000) * 1000 - user.xp} XP pour le niveau {user.level + 1}</span>
                </div>
              </div>
            </div>
          </div>

          {/* Stats Grid */}
          <div className="grid grid-cols-2 gap-3 mb-6">
            {stats.map((stat, index) => (
              <div 
                key={index}
                className="bg-gray-700/50 backdrop-blur-sm rounded-xl p-4 border border-gray-600 hover:border-gray-500 transition-colors"
              >
                <div className="text-center">
                  <div className={`text-2xl font-bold bg-gradient-to-r ${stat.color} bg-clip-text text-transparent`}>
                    {stat.value}
                  </div>
                  <div className="text-sm text-gray-300 mt-1">{stat.label}</div>
                  {stat.progress && (
                    <div className="w-full bg-gray-700 rounded-full h-1 mt-2">
                      <div 
                        className={`h-1 rounded-full bg-gradient-to-r ${stat.color}`}
                        style={{ width: `${stat.progress}%` }}
                      />
                    </div>
                  )}
                  {stat.sublabel && (
                    <div className="text-xs text-gray-400 mt-1">{stat.sublabel}</div>
                  )}
                </div>
              </div>
            ))}
          </div>

          {/* Achievements */}
          <div className="bg-gray-700/50 backdrop-blur-sm rounded-xl p-6 border border-gray-600 mb-6">
            <h3 className="text-white font-semibold mb-4">Récompenses Récentes</h3>
            <div className="grid grid-cols-4 gap-3">
              {achievements.map((achievement) => (
                <div 
                  key={achievement.id}
                  className={`text-center ${!achievement.unlocked && 'opacity-50'}`}
                >
                  <div 
                    className={`w-12 h-12 rounded-full mx-auto mb-2 flex items-center justify-center ${
                      achievement.unlocked 
                        ? `bg-gradient-to-r ${achievement.color} shadow-md`
                        : 'bg-gray-700'
                    }`}
                  >
                    <achievement.icon 
                      className={`w-5 h-5 ${achievement.unlocked ? 'text-white' : 'text-gray-500'}`} 
                      fill={achievement.unlocked ? 'currentColor' : 'none'}
                    />
                  </div>
                  <span className={`text-xs ${achievement.unlocked ? 'text-white' : 'text-gray-500'}`}>
                    {achievement.name}
                  </span>
                </div>
              ))}
            </div>
          </div>

          {/* Recent Activity */}
          <div className="bg-gray-700/50 backdrop-blur-sm rounded-xl p-6 border border-gray-600 mb-6">
            <h3 className="text-white font-semibold mb-4">Activité Récente</h3>
            <div className="space-y-3">
              {activities.map((activity) => (
                <div 
                  key={activity.id}
                  className="bg-gray-600/50 rounded-xl p-3 border border-gray-500 hover:border-gray-400 transition-colors"
                >
                  <div className="flex items-start space-x-3">
                    <div className={`w-8 h-8 rounded-full ${activity.iconBg} flex-shrink-0 flex items-center justify-center`}>
                      <activity.icon className="w-4 h-4 text-white" />
                    </div>
                    <div className="flex-1 min-w-0">
                      <p className="text-sm text-white truncate">{activity.title}</p>
                      <div className="flex justify-between items-center">
                        <p className="text-xs text-gray-400">{activity.time}</p>
                        {activity.score && (
                          <span className="text-xs bg-green-900/50 text-green-400 px-2 py-0.5 rounded-full">
                            {activity.score}
                          </span>
                        )}
                        {activity.duration && (
                          <span className="text-xs bg-purple-900/50 text-purple-400 px-2 py-0.5 rounded-full">
                            {activity.duration}
                          </span>
                        )}
                      </div>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </div>


        </div>
      </motion.div>

      {/* Edit Profile Modal */}
      <AnimatePresence>
        {showEditModal && (
          <motion.div 
            className="fixed inset-0 bg-black/80 backdrop-blur-sm z-50 flex items-center justify-center p-4"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            onClick={() => setShowEditModal(false)}
          >
                         <motion.div 
               className="bg-gray-800 rounded-xl shadow-2xl w-full max-w-3xl mx-auto max-h-[90vh] overflow-y-auto"
               initial={{ scale: 0.9, opacity: 0 }}
               animate={{ scale: 1, opacity: 1 }}
               exit={{ scale: 0.9, opacity: 0 }}
               onClick={(e) => e.stopPropagation()}
             >
              {/* Modal Header */}
              <div className="bg-gradient-to-r from-gray-900 to-gray-800 p-6 border-b border-gray-700">
                <div className="flex items-center justify-between">
                  <div className="flex items-center space-x-4">
                    <div className="relative group">
                      <div className="w-20 h-20 rounded-full bg-gradient-to-br from-yellow-400 to-yellow-600 flex items-center justify-center text-2xl font-bold text-gray-900 overflow-hidden">
                        {previewImage || user.avatar_url ? (
                          <img 
                            src={previewImage || user.avatar_url} 
                            alt="Profile" 
                            className="w-full h-full object-cover"
                          />
                        ) : (
                          getUserInitials()
                        )}
                      </div>
                      <label className="absolute -bottom-1 -right-1 bg-yellow-400 hover:bg-yellow-500 text-gray-900 rounded-full p-1.5 cursor-pointer transition-colors">
                        <Camera className="h-4 w-4" />
                        <input 
                          type="file" 
                          className="hidden" 
                          accept="image/*"
                          onChange={handleImageChange}
                        />
                      </label>
                    </div>
                    <div>
                      <h2 className="text-2xl font-bold text-white">
                        {formData.name}
                      </h2>
                      <p className="text-yellow-400">{user.role}</p>
                      <p className="text-gray-300 text-sm">Niveau {user.level} • {user.xp} XP</p>
                    </div>
                  </div>
                  <button 
                    onClick={() => setShowEditModal(false)}
                    className="text-gray-400 hover:text-white transition-colors"
                  >
                    <X className="w-6 h-6" />
                  </button>
                </div>
              </div>

              {/* Modal Content */}
              <div className="p-6">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  {/* Personal Information */}
                  <div className="space-y-4">
                    <h3 className="text-lg font-semibold text-white border-b border-gray-700 pb-2 flex items-center">
                      <User className="w-5 h-5 mr-2" />
                      Informations personnelles
                    </h3>
                    
                    <div className="space-y-4">
                      <div>
                        <label className="block text-sm font-medium text-gray-300 mb-1">Nom complet</label>
                        <input
                          type="text"
                          value={formData.name}
                          onChange={(e) => setFormData({...formData, name: e.target.value})}
                          className="w-full px-3 py-2 bg-gray-700 border border-gray-600 rounded-lg text-white focus:outline-none focus:ring-2 focus:ring-yellow-500"
                        />
                      </div>
                      <div>
                        <label className="block text-sm font-medium text-gray-300 mb-1 flex items-center">
                          <Mail className="w-4 h-4 mr-1" />
                          Email
                        </label>
                        <input
                          type="email"
                          value={formData.email}
                          onChange={(e) => setFormData({...formData, email: e.target.value})}
                          className="w-full px-3 py-2 bg-gray-700 border border-gray-600 rounded-lg text-white focus:outline-none focus:ring-2 focus:ring-yellow-500"
                        />
                      </div>
                      <div>
                        <label className="block text-sm font-medium text-gray-300 mb-1 flex items-center">
                          <Phone className="w-4 h-4 mr-1" />
                          Téléphone
                        </label>
                        <input
                          type="tel"
                          value={formData.phone}
                          onChange={(e) => setFormData({...formData, phone: e.target.value})}
                          className="w-full px-3 py-2 bg-gray-700 border border-gray-600 rounded-lg text-white focus:outline-none focus:ring-2 focus:ring-yellow-500"
                        />
                      </div>
                    </div>
                  </div>

                  {/* Professional Information */}
                  <div className="space-y-4">
                    <h3 className="text-lg font-semibold text-white border-b border-gray-700 pb-2 flex items-center">
                      <Building className="w-5 h-5 mr-2" />
                      Informations professionnelles
                    </h3>
                    
                    <div className="space-y-4">
                      <div>
                        <label className="block text-sm font-medium text-gray-300 mb-1">Entreprise</label>
                        <input
                          type="text"
                          value={formData.company}
                          onChange={(e) => setFormData({...formData, company: e.target.value})}
                          className="w-full px-3 py-2 bg-gray-700 border border-gray-600 rounded-lg text-white focus:outline-none focus:ring-2 focus:ring-yellow-500"
                        />
                      </div>
                      <div>
                        <label className="block text-sm font-medium text-gray-300 mb-1 flex items-center">
                          <Briefcase className="w-4 h-4 mr-1" />
                          Poste
                        </label>
                        <input
                          type="text"
                          value={formData.position}
                          onChange={(e) => setFormData({...formData, position: e.target.value})}
                          className="w-full px-3 py-2 bg-gray-700 border border-gray-600 rounded-lg text-white focus:outline-none focus:ring-2 focus:ring-yellow-500"
                        />
                      </div>
                    </div>
                  </div>
                </div>

                {/* Bio */}
                <div className="mt-6">
                  <h3 className="text-lg font-semibold text-white border-b border-gray-700 pb-2 mb-4">
                    À propos
                  </h3>
                  <textarea
                    value={formData.bio}
                    onChange={(e) => setFormData({...formData, bio: e.target.value})}
                    className="w-full px-3 py-2 bg-gray-700 border border-gray-600 rounded-lg text-white focus:outline-none focus:ring-2 focus:ring-yellow-500 min-h-[100px]"
                    placeholder="Décrivez-vous en quelques mots..."
                  />
                </div>

                {/* Security Section */}
                <div className="mt-8 pt-6 border-t border-gray-700">
                  <div className="flex justify-between items-center mb-4">
                    <h3 className="text-lg font-semibold text-white flex items-center">
                      <Lock className="w-5 h-5 mr-2" />
                      Sécurité du compte
                    </h3>
                    <button 
                      onClick={() => setShowPasswordModal(true)}
                      className="text-yellow-400 hover:text-yellow-300 text-sm font-medium flex items-center"
                    >
                      <Lock className="w-4 h-4 mr-1" />
                      Changer le mot de passe
                    </button>
                  </div>
                </div>

                {/* Modal Actions */}
                <div className="flex justify-end space-x-3 mt-6 pt-6 border-t border-gray-700">
                  <button 
                    onClick={() => {
                      setShowEditModal(false);
                      setProfileImage(null);
                      setPreviewImage(null);
                      setFormData({
                        name: user.name || '',
                        email: user.email || '',
                        phone: user.phone || '',
                        company: user.company || '',
                        position: user.position || '',
                        bio: user.bio || ''
                      });
                    }}
                    className="px-6 py-2 bg-gray-600 hover:bg-gray-700 text-white font-medium rounded-lg transition-colors"
                  >
                    Annuler
                  </button>
                  <button 
                    onClick={handleSaveProfile}
                    className="px-6 py-2 bg-yellow-500 hover:bg-yellow-600 text-gray-900 font-medium rounded-lg transition-colors flex items-center"
                  >
                    <Save className="w-4 h-4 mr-2" />
                    Enregistrer
                  </button>
                </div>
              </div>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>

      {/* Change Password Modal */}
      <AnimatePresence>
        {showPasswordModal && (
          <motion.div 
            className="fixed inset-0 bg-black/80 backdrop-blur-sm z-50 flex items-center justify-center p-4"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            onClick={() => setShowPasswordModal(false)}
          >
            <motion.div 
              className="bg-gray-800 rounded-xl shadow-2xl w-full max-w-md"
              initial={{ scale: 0.9, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              exit={{ scale: 0.9, opacity: 0 }}
              onClick={(e) => e.stopPropagation()}
            >
              {/* Modal Header */}
              <div className="bg-gradient-to-r from-gray-900 to-gray-800 p-6 border-b border-gray-700">
                <div className="flex items-center justify-between">
                  <div className="flex items-center">
                    <Lock className="w-6 h-6 text-yellow-400 mr-3" />
                    <h2 className="text-xl font-bold text-white">Changer le mot de passe</h2>
                  </div>
                  <button 
                    onClick={() => setShowPasswordModal(false)}
                    className="text-gray-400 hover:text-white transition-colors"
                  >
                    <X className="w-6 h-6" />
                  </button>
                </div>
              </div>

              {/* Modal Content */}
              <div className="p-6">
                <div className="space-y-4">
                  <div>
                    <label className="block text-sm font-medium text-gray-300 mb-1">Mot de passe actuel</label>
                    <input
                      type="password"
                      value={currentPassword}
                      onChange={(e) => setCurrentPassword(e.target.value)}
                      className="w-full px-3 py-2 bg-gray-700 border border-gray-600 rounded-lg text-white focus:outline-none focus:ring-2 focus:ring-yellow-500"
                      placeholder="Entrez votre mot de passe actuel"
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-300 mb-1">Nouveau mot de passe</label>
                    <input
                      type="password"
                      value={newPassword}
                      onChange={(e) => setNewPassword(e.target.value)}
                      className="w-full px-3 py-2 bg-gray-700 border border-gray-600 rounded-lg text-white focus:outline-none focus:ring-2 focus:ring-yellow-500"
                      placeholder="Entrez votre nouveau mot de passe"
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-300 mb-1">Confirmer le nouveau mot de passe</label>
                    <input
                      type="password"
                      value={confirmPassword}
                      onChange={(e) => setConfirmPassword(e.target.value)}
                      className="w-full px-3 py-2 bg-gray-700 border border-gray-600 rounded-lg text-white focus:outline-none focus:ring-2 focus:ring-yellow-500"
                      placeholder="Confirmez votre nouveau mot de passe"
                    />
                  </div>
                </div>

                {/* Modal Actions */}
                <div className="flex justify-end space-x-3 mt-6 pt-6 border-t border-gray-700">
                  <button 
                    onClick={() => {
                      setShowPasswordModal(false);
                      setCurrentPassword('');
                      setNewPassword('');
                      setConfirmPassword('');
                    }}
                    className="px-6 py-2 bg-gray-600 hover:bg-gray-700 text-white font-medium rounded-lg transition-colors"
                  >
                    Annuler
                  </button>
                  <button 
                    onClick={handleChangePassword}
                    className="px-6 py-2 bg-yellow-500 hover:bg-yellow-600 text-gray-900 font-medium rounded-lg transition-colors"
                    disabled={!currentPassword || !newPassword || newPassword !== confirmPassword}
                  >
                    Enregistrer
                  </button>
                </div>
              </div>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>
    </>
  );
}
