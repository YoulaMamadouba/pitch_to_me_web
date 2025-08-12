"use client";

import React, { useState } from 'react';
import { Search, Bell, Settings, User, LogOut, ChevronDown, MessageSquare, Calendar, FileText } from 'lucide-react';
import Image from 'next/image';

const HRHeader = () => {
  const [isProfileOpen, setIsProfileOpen] = useState(false);
  const [isNotificationsOpen, setIsNotificationsOpen] = useState(false);
  
  const notifications = [
    { 
      id: 1, 
      title: 'Nouveau rapport disponible', 
      message: 'Le rapport trimestriel des performances est prêt',
      time: 'Il y a 2h',
      read: false,
      icon: FileText,
      color: 'text-blue-500 bg-blue-500/10'
    },
    { 
      id: 2, 
      title: 'Formation à évaluer', 
      message: '5 nouvelles formations nécessitent votre évaluation',
      time: 'Il y a 1 jour',
      read: false,
      icon: MessageSquare,
      color: 'text-amber-500 bg-amber-500/10'
    },
    { 
      id: 3, 
      title: 'Rappel : Réunion d\'équipe', 
      message: 'Réunion hebdomadaire dans 30 minutes',
      time: 'Il y a 2 jours',
      read: true,
      icon: Calendar,
      color: 'text-emerald-500 bg-emerald-500/10'
    },
  ];

  const unreadCount = notifications.filter(n => !n.read).length;

  return (
    <header className="bg-gray-900 border-b border-gray-800">
      <div className="flex items-center justify-between px-6 py-4">
        {/* Search bar */}
        <div className="flex-1 max-w-2xl">
          <div className="relative">
            <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
              <Search className="h-4 w-4 text-gray-400" />
            </div>
            <input
              type="text"
              className="block w-full pl-10 pr-3 py-2 border border-gray-700 rounded-lg bg-gray-800 text-white placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-cyan-500 focus:border-transparent"
              placeholder="Rechercher des employés, des rapports..."
            />
          </div>
        </div>

        {/* Right side icons */}
        <div className="flex items-center space-x-4">
          {/* Notifications */}
          <div className="relative">
            <button 
              onClick={() => setIsNotificationsOpen(!isNotificationsOpen)}
              className="p-1.5 rounded-full text-gray-400 hover:text-white hover:bg-gray-800 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-offset-gray-900 focus:ring-cyan-500 relative"
            >
              <Bell className="h-5 w-5" />
              {unreadCount > 0 && (
                <span className="absolute -top-1 -right-1 h-4 w-4 flex items-center justify-center bg-red-500 text-white text-xs font-bold rounded-full">
                  {unreadCount}
                </span>
              )}
            </button>

            {/* Notifications dropdown */}
            {isNotificationsOpen && (
              <div className="absolute right-0 mt-2 w-80 bg-gray-800 rounded-lg shadow-xl border border-gray-700 z-50">
                <div className="p-3 border-b border-gray-700">
                  <div className="flex items-center justify-between">
                    <h3 className="text-sm font-medium text-white">Notifications</h3>
                    <button className="text-xs text-cyan-400 hover:text-cyan-300">
                      Tout marquer comme lu
                    </button>
                  </div>
                </div>
                <div className="max-h-96 overflow-y-auto">
                  {notifications.length > 0 ? (
                    <div className="divide-y divide-gray-700">
                      {notifications.map((notification) => (
                        <div 
                          key={notification.id} 
                          className={`p-3 hover:bg-gray-700 cursor-pointer ${!notification.read ? 'bg-gray-700/50' : ''}`}
                        >
                          <div className="flex">
                            <div className={`flex-shrink-0 h-10 w-10 rounded-lg ${notification.color} flex items-center justify-center`}>
                              <notification.icon className="h-5 w-5" />
                            </div>
                            <div className="ml-3">
                              <p className="text-sm font-medium text-white">{notification.title}</p>
                              <p className="text-xs text-gray-300">{notification.message}</p>
                              <p className="text-xs text-gray-400 mt-1">{notification.time}</p>
                            </div>
                            {!notification.read && (
                              <div className="ml-auto">
                                <span className="h-2 w-2 bg-cyan-500 rounded-full inline-block"></span>
                              </div>
                            )}
                          </div>
                        </div>
                      ))}
                    </div>
                  ) : (
                    <div className="p-4 text-center text-sm text-gray-400">
                      Aucune notification
                    </div>
                  )}
                </div>
                <div className="p-2 border-t border-gray-700 text-center">
                  <a href="#" className="text-xs font-medium text-cyan-400 hover:text-cyan-300">
                    Voir toutes les notifications
                  </a>
                </div>
              </div>
            )}
          </div>

          {/* Settings */}
          <button className="p-1.5 rounded-full text-gray-400 hover:text-white hover:bg-gray-800 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-offset-gray-900 focus:ring-cyan-500">
            <Settings className="h-5 w-5" />
          </button>

          {/* Profile dropdown */}
          <div className="relative ml  -4">
            <button 
              onClick={() => setIsProfileOpen(!isProfileOpen)}
              className="flex items-center max-w-xs rounded-full text-sm focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-offset-gray-900 focus:ring-cyan-500"
            >
              <span className="sr-only">Ouvrir le menu du profil</span>
              <div className="h-8 w-8 rounded-full overflow-hidden">
                <Image
                  src="https://images.unsplash.com/photo-1560250097-0b93528c311a?w=80&h=80&fit=crop&crop=face"
                  alt="Profile"
                  width={32}
                  height={32}
                  className="h-full w-full object-cover"
                />
              </div>
              <ChevronDown className="ml-1 h-4 w-4 text-gray-400" />
            </button>

            {/* Profile dropdown menu */}
            {isProfileOpen && (
              <div className="origin-top-right absolute right-0 mt-2 w-48 rounded-md shadow-lg bg-gray-800 ring-1 ring-black ring-opacity-5 z-50">
                <div className="py-1">
                  <div className="px-4 py-2 border-b border-gray-700">
                    <p className="text-sm text-white font-medium">Sarah Mitchell</p>
                    <p className="text-xs text-gray-400">sarah.m@techcorp.com</p>
                  </div>
                  <a
                    href="#"
                    className="block px-4 py-2 text-sm text-gray-300 hover:bg-gray-700 hover:text-white"
                  >
                    <div className="flex items-center">
                      <User className="mr-2 h-4 w-4" />
                      <span>Mon profil</span>
                    </div>
                  </a>
                  <a
                    href="#"
                    className="block px-4 py-2 text-sm text-gray-300 hover:bg-gray-700 hover:text-white"
                  >
                    <div className="flex items-center">
                      <Settings className="mr-2 h-4 w-4" />
                      <span>Paramètres</span>
                    </div>
                  </a>
                  <div className="border-t border-gray-700"></div>
                  <button
                    onClick={() => {}}
                    className="w-full text-left px-4 py-2 text-sm text-red-400 hover:bg-gray-700 hover:text-red-300"
                  >
                    <div className="flex items-center">
                      <LogOut className="mr-2 h-4 w-4" />
                      <span>Déconnexion</span>
                    </div>
                  </button>
                </div>
              </div>
            )}
          </div>
        </div>
      </div>
    </header>
  );
};

export default HRHeader;
