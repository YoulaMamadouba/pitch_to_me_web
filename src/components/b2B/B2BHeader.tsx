'use client';

import { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Menu, Bell, Search, ChevronDown, User, Settings, LogOut, Briefcase } from 'lucide-react';

interface B2BHeaderProps {
  user: any;
  onToggleMobileMenu: () => void;
  onSignOut: () => void;
}

export default function B2BHeader({ user, onToggleMobileMenu, onSignOut }: B2BHeaderProps) {
  const [showUserMenu, setShowUserMenu] = useState(false);

  return (
    <header className="bg-gray-800 border-b border-gray-700 px-4 py-3">
      <div className="flex items-center justify-between">
        <div className="flex items-center space-x-4">
          <button onClick={onToggleMobileMenu} className="lg:hidden p-2 rounded-lg hover:bg-gray-700">
            <Menu className="w-5 h-5 text-gray-300" />
          </button>
          <div className="hidden md:flex items-center space-x-2 bg-gray-700 rounded-lg px-3 py-2">
            <Search className="w-4 h-4 text-gray-400" />
            <input type="text" placeholder="Rechercher..." className="bg-transparent text-white placeholder-gray-400 outline-none text-sm w-64" />
          </div>
        </div>
        
        <div className="flex items-center space-x-4">
          <button className="relative p-2 rounded-lg hover:bg-gray-700">
            <Bell className="w-5 h-5 text-gray-300" />
            <span className="absolute -top-1 -right-1 w-5 h-5 bg-red-500 text-white text-xs rounded-full flex items-center justify-center">3</span>
          </button>
          
          <div className="relative">
            <button onClick={() => setShowUserMenu(!showUserMenu)} className="flex items-center space-x-3 p-2 rounded-lg hover:bg-gray-700">
              <div className="w-8 h-8 bg-gradient-to-r from-blue-500 to-purple-600 rounded-full flex items-center justify-center">
                <Briefcase className="w-4 h-4 text-white" />
              </div>
              <div className="hidden md:block text-left">
                <div className="text-white text-sm font-medium">{user?.name || 'Employé'}</div>
                <div className="text-gray-400 text-xs">B2B Learning</div>
              </div>
              <ChevronDown className="w-4 h-4 text-gray-400" />
            </button>
            
            <AnimatePresence>
              {showUserMenu && (
                <motion.div initial={{ opacity: 0, y: -10 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0, y: -10 }}
                  className="absolute right-0 mt-2 w-56 bg-gray-800 border border-gray-700 rounded-lg shadow-lg z-50">
                  <div className="p-4 border-b border-gray-700">
                    <div className="flex items-center space-x-3">
                      <div className="w-10 h-10 bg-gradient-to-r from-blue-500 to-purple-600 rounded-full flex items-center justify-center">
                        <Briefcase className="w-5 h-5 text-white" />
                      </div>
                      <div>
                        <div className="text-white font-medium">{user?.name || 'Employé'}</div>
                        <div className="text-gray-400 text-sm">{user?.email}</div>
                      </div>
                    </div>
                  </div>
                  <div className="p-2">
                    <button className="w-full flex items-center space-x-3 px-3 py-2 rounded-lg text-gray-300 hover:bg-gray-700 hover:text-white">
                      <User className="w-4 h-4" />
                      <span className="text-sm">Mon Profil</span>
                    </button>
                    <button className="w-full flex items-center space-x-3 px-3 py-2 rounded-lg text-gray-300 hover:bg-gray-700 hover:text-white">
                      <Settings className="w-4 h-4" />
                      <span className="text-sm">Paramètres</span>
                    </button>
                  </div>
                  <div className="p-2 border-t border-gray-700">
                    <button onClick={onSignOut} className="w-full flex items-center space-x-3 px-3 py-2 rounded-lg text-red-400 hover:bg-red-500/10 hover:text-red-300">
                      <LogOut className="w-4 h-4" />
                      <span className="text-sm">Déconnexion</span>
                    </button>
                  </div>
                </motion.div>
              )}
            </AnimatePresence>
          </div>
        </div>
      </div>
      
      <div className="mt-3 md:hidden">
        <div className="flex items-center space-x-2 bg-gray-700 rounded-lg px-3 py-2">
          <Search className="w-4 h-4 text-gray-400" />
          <input type="text" placeholder="Rechercher..." className="bg-transparent text-white placeholder-gray-400 outline-none text-sm flex-1" />
        </div>
      </div>
    </header>
  );
}
