"use client";

import React from 'react';
import Link from 'next/link';
import { 
  Home, 
  BarChart2, 
  Users, 
  Settings, 
  Bell, 
  LogOut,
  FileText,
  MessageSquare,
  Calendar,
  Target,
  Award,
  HelpCircle
} from 'lucide-react';

const HRSidebar = () => {
  const navItems = [
    { name: 'Tableau de bord', icon: Home, href: '/hr-dashboard' },
    { name: 'Rapports', icon: BarChart2, href: '/hr-dashboard/reports' },
    { name: 'Équipe', icon: Users, href: '/hr-dashboard/team' },
    { name: 'Formations', icon: Award, href: '/hr-dashboard/trainings' },
    { name: 'Objectifs', icon: Target, href: '/hr-dashboard/goals' },
    { name: 'Messages', icon: MessageSquare, href: '/hr-dashboard/messages' },
    { name: 'Calendrier', icon: Calendar, href: '/hr-dashboard/calendar' },
    { name: 'Documents', icon: FileText, href: '/hr-dashboard/documents' },
  ];

  const bottomNavItems = [
    { name: 'Paramètres', icon: Settings, href: '/hr-dashboard/settings' },
    { name: 'Aide', icon: HelpCircle, href: '/hr-dashboard/help' },
  ];

  return (
    <div className="hidden md:flex md:flex-shrink-0">
      <div className="flex flex-col w-64 bg-gray-900 border-r border-gray-800">
        {/* Logo et profil */}
        <div className="flex flex-col items-center p-6 border-b border-gray-800">
          <div className="relative">
            <img
              className="w-16 h-16 rounded-full border-2 border-cyan-400"
              src="https://images.unsplash.com/photo-1560250097-0b93528c311a?w=128&h=128&fit=crop&crop=face"
              alt="Profile"
            />
            <div className="absolute -bottom-1 -right-1 w-4 h-4 bg-green-500 rounded-full border-2 border-gray-900"></div>
          </div>
          <h2 className="mt-4 text-lg font-semibold text-white">Sarah Mitchell</h2>
          <p className="text-sm text-cyan-400">Responsable RH</p>
          <div className="mt-2 px-3 py-1 bg-cyan-900 bg-opacity-50 text-cyan-300 text-xs rounded-full">
            TechCorp
          </div>
        </div>

        {/* Navigation principale */}
        <div className="flex-1 overflow-y-auto">
          <nav className="px-4 py-6 space-y-1">
            {navItems.map((item) => (
              <Link
                key={item.name}
                href={item.href}
                className="flex items-center px-4 py-3 text-gray-300 hover:bg-gray-800 hover:text-white rounded-lg transition-colors duration-200 group"
              >
                <item.icon className="w-5 h-5 mr-3 text-gray-400 group-hover:text-cyan-400" />
                <span className="text-sm font-medium">{item.name}</span>
                {item.name === 'Messages' && (
                  <span className="ml-auto px-2 py-0.5 text-xs font-medium bg-red-500 text-white rounded-full">
                    3
                  </span>
                )}
              </Link>
            ))}
          </nav>
        </div>

        {/* Navigation secondaire */}
        <div className="p-4 border-t border-gray-800">
          <nav className="space-y-1">
            {bottomNavItems.map((item) => (
              <Link
                key={item.name}
                href={item.href}
                className="flex items-center px-4 py-3 text-gray-300 hover:bg-gray-800 hover:text-white rounded-lg transition-colors duration-200 group"
              >
                <item.icon className="w-5 h-5 mr-3 text-gray-400 group-hover:text-cyan-400" />
                <span className="text-sm font-medium">{item.name}</span>
              </Link>
            ))}
            <button className="w-full flex items-center px-4 py-3 text-gray-300 hover:bg-gray-800 hover:text-white rounded-lg transition-colors duration-200 group">
              <LogOut className="w-5 h-5 mr-3 text-gray-400 group-hover:text-red-400" />
              <span className="text-sm font-medium">Déconnexion</span>
            </button>
          </nav>
          
          {/* Bannière de mise à jour */}
          <div className="mt-4 p-3 bg-gray-800 bg-opacity-50 rounded-lg">
            <div className="flex items-start">
              <div className="flex-shrink-0 mt-0.5">
                <div className="w-2 h-2 bg-cyan-400 rounded-full"></div>
              </div>
              <div className="ml-3">
                <p className="text-xs text-gray-300">Nouvelle mise à jour disponible</p>
                <button className="mt-1 text-xs font-medium text-cyan-400 hover:text-cyan-300">
                  Mettre à jour maintenant
                </button>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default HRSidebar;
