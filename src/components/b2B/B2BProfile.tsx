'use client';

import { useState } from 'react';
import { User, Mail, Building, Calendar, Award, Edit, Save, X, Camera, Shield, Bell, Globe } from 'lucide-react';

export default function B2BProfile() {
  const [isEditing, setIsEditing] = useState(false);
  const [profile, setProfile] = useState({
    name: 'Test Employee',
    email: 'test.employee@example.com',
    company: 'TechCorp Solutions',
    position: 'Commercial Senior',
    department: 'Ventes',
    startDate: '2023-03-15',
    avatar: 'https://images.unsplash.com/photo-1472099645785-5658abf4ff4e?w=150&h=150&fit=crop&crop=face',
    phone: '+33 6 12 34 56 78',
    location: 'Paris, France',
    timezone: 'Europe/Paris',
    language: 'Français'
  });

  const [formData, setFormData] = useState(profile);

  const achievements = [
    { title: 'Premier module terminé', date: '2024-01-15', icon: Award },
    { title: '10h d\'apprentissage', date: '2024-01-10', icon: Award },
    { title: 'Score parfait', date: '2024-01-15', icon: Award }
  ];

  const handleSave = () => {
    setProfile(formData);
    setIsEditing(false);
  };

  const handleCancel = () => {
    setFormData(profile);
    setIsEditing(false);
  };

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <h1 className="text-2xl font-bold text-white">Mon profil</h1>
        <button
          onClick={() => setIsEditing(!isEditing)}
          className="flex items-center space-x-2 bg-yellow-500 hover:bg-yellow-600 text-black px-4 py-2 rounded-lg font-medium transition-colors"
        >
          {isEditing ? <X className="w-4 h-4" /> : <Edit className="w-4 h-4" />}
          <span>{isEditing ? 'Annuler' : 'Modifier'}</span>
        </button>
      </div>

      {/* Profile Header */}
      <div className="bg-gray-800 rounded-xl p-6 border border-gray-700">
        <div className="flex items-start space-x-6">
          <div className="relative">
            <img
              src={profile.avatar}
              alt="Profile"
              className="w-24 h-24 rounded-full object-cover border-4 border-gray-700"
            />
            <button className="absolute bottom-0 right-0 w-8 h-8 bg-yellow-500 rounded-full flex items-center justify-center hover:bg-yellow-600 transition-colors">
              <Camera className="w-4 h-4 text-black" />
            </button>
          </div>
          <div className="flex-1">
            <div className="flex items-center space-x-3 mb-2">
              <h2 className="text-2xl font-bold text-white">{profile.name}</h2>
              <span className="bg-green-500/20 text-green-400 text-xs px-2 py-1 rounded-full">Actif</span>
            </div>
            <p className="text-gray-400 mb-1">{profile.position}</p>
            <p className="text-gray-400">{profile.company}</p>
            <div className="flex items-center space-x-4 mt-3">
              <div className="flex items-center space-x-2 text-sm text-gray-400">
                <Calendar className="w-4 h-4" />
                <span>Membre depuis {new Date(profile.startDate).toLocaleDateString('fr-FR')}</span>
              </div>
            </div>
          </div>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Personal Information */}
        <div className="lg:col-span-2 space-y-6">
          <div className="bg-gray-800 rounded-xl p-6 border border-gray-700">
            <h3 className="text-xl font-semibold text-white mb-4">Informations personnelles</h3>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <label className="block text-sm font-medium text-gray-400 mb-2">Nom complet</label>
                {isEditing ? (
                  <input
                    type="text"
                    value={formData.name}
                    onChange={(e) => setFormData({...formData, name: e.target.value})}
                    className="w-full bg-gray-700 border border-gray-600 rounded-lg px-3 py-2 text-white focus:outline-none focus:ring-2 focus:ring-yellow-500"
                  />
                ) : (
                  <div className="flex items-center space-x-2 text-white">
                    <User className="w-4 h-4 text-gray-400" />
                    <span>{profile.name}</span>
                  </div>
                )}
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-400 mb-2">Email</label>
                {isEditing ? (
                  <input
                    type="email"
                    value={formData.email}
                    onChange={(e) => setFormData({...formData, email: e.target.value})}
                    className="w-full bg-gray-700 border border-gray-600 rounded-lg px-3 py-2 text-white focus:outline-none focus:ring-2 focus:ring-yellow-500"
                  />
                ) : (
                  <div className="flex items-center space-x-2 text-white">
                    <Mail className="w-4 h-4 text-gray-400" />
                    <span>{profile.email}</span>
                  </div>
                )}
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-400 mb-2">Téléphone</label>
                {isEditing ? (
                  <input
                    type="tel"
                    value={formData.phone}
                    onChange={(e) => setFormData({...formData, phone: e.target.value})}
                    className="w-full bg-gray-700 border border-gray-600 rounded-lg px-3 py-2 text-white focus:outline-none focus:ring-2 focus:ring-yellow-500"
                  />
                ) : (
                  <div className="text-white">{profile.phone}</div>
                )}
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-400 mb-2">Localisation</label>
                {isEditing ? (
                  <input
                    type="text"
                    value={formData.location}
                    onChange={(e) => setFormData({...formData, location: e.target.value})}
                    className="w-full bg-gray-700 border border-gray-600 rounded-lg px-3 py-2 text-white focus:outline-none focus:ring-2 focus:ring-yellow-500"
                  />
                ) : (
                  <div className="text-white">{profile.location}</div>
                )}
              </div>
            </div>

            {isEditing && (
              <div className="flex items-center space-x-3 mt-6">
                <button
                  onClick={handleSave}
                  className="flex items-center space-x-2 bg-green-500 hover:bg-green-600 text-white px-4 py-2 rounded-lg font-medium transition-colors"
                >
                  <Save className="w-4 h-4" />
                  <span>Sauvegarder</span>
                </button>
                <button
                  onClick={handleCancel}
                  className="flex items-center space-x-2 bg-gray-600 hover:bg-gray-700 text-white px-4 py-2 rounded-lg font-medium transition-colors"
                >
                  <X className="w-4 h-4" />
                  <span>Annuler</span>
                </button>
              </div>
            )}
          </div>

          {/* Company Information */}
          <div className="bg-gray-800 rounded-xl p-6 border border-gray-700">
            <h3 className="text-xl font-semibold text-white mb-4">Informations entreprise</h3>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <label className="block text-sm font-medium text-gray-400 mb-2">Entreprise</label>
                <div className="flex items-center space-x-2 text-white">
                  <Building className="w-4 h-4 text-gray-400" />
                  <span>{profile.company}</span>
                </div>
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-400 mb-2">Poste</label>
                <div className="text-white">{profile.position}</div>
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-400 mb-2">Département</label>
                <div className="text-white">{profile.department}</div>
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-400 mb-2">Date d'entrée</label>
                <div className="text-white">{new Date(profile.startDate).toLocaleDateString('fr-FR')}</div>
              </div>
            </div>
          </div>
        </div>

        {/* Sidebar */}
        <div className="space-y-6">
          {/* Achievements */}
          <div className="bg-gray-800 rounded-xl p-6 border border-gray-700">
            <h3 className="text-xl font-semibold text-white mb-4">Réalisations</h3>
            <div className="space-y-3">
              {achievements.map((achievement, index) => (
                <div key={index} className="flex items-center space-x-3">
                  <div className="w-8 h-8 bg-yellow-500/20 rounded-lg flex items-center justify-center">
                    <achievement.icon className="w-4 h-4 text-yellow-400" />
                  </div>
                  <div className="flex-1">
                    <p className="text-white text-sm font-medium">{achievement.title}</p>
                    <p className="text-gray-400 text-xs">{achievement.date}</p>
                  </div>
                </div>
              ))}
            </div>
          </div>

          {/* Preferences */}
          <div className="bg-gray-800 rounded-xl p-6 border border-gray-700">
            <h3 className="text-xl font-semibold text-white mb-4">Préférences</h3>
            <div className="space-y-4">
              <div className="flex items-center justify-between">
                <div className="flex items-center space-x-2">
                  <Globe className="w-4 h-4 text-gray-400" />
                  <span className="text-white text-sm">Langue</span>
                </div>
                <span className="text-gray-400 text-sm">{profile.language}</span>
              </div>
              <div className="flex items-center justify-between">
                <div className="flex items-center space-x-2">
                  <Bell className="w-4 h-4 text-gray-400" />
                  <span className="text-white text-sm">Notifications</span>
                </div>
                <span className="text-gray-400 text-sm">Activées</span>
              </div>
              <div className="flex items-center justify-between">
                <div className="flex items-center space-x-2">
                  <Shield className="w-4 h-4 text-gray-400" />
                  <span className="text-white text-sm">Sécurité</span>
                </div>
                <span className="text-gray-400 text-sm">2FA activé</span>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
