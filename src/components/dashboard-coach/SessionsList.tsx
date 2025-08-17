'use client';

import { useState, useEffect } from 'react';
import { Search, Filter, Calendar as CalendarIcon, Plus } from 'lucide-react';
import SessionCard from './SessionCard';
import { motion } from 'framer-motion';

// Types pour les données de session
export interface Session {
  id: string;
  studentName: string;
  studentAvatar: string;
  date: string;
  duration: number;
  status: 'scheduled' | 'completed' | 'cancelled';
  module?: string;
  notes?: string;
}

interface SessionsListProps {
  onNewSession?: () => void;
  onSessionClick?: (sessionId: string) => void;
}

export default function SessionsList({ onNewSession, onSessionClick }: SessionsListProps) {
  // État pour les filtres
  const [statusFilter, setStatusFilter] = useState<string>('all');
  const [searchQuery, setSearchQuery] = useState('');
  
  // Données de démonstration - à remplacer par un appel API
  const [sessions, setSessions] = useState<Session[]>([]);

  // Charger les données de démonstration
  useEffect(() => {
    // Simuler un chargement asynchrone
    const loadDemoData = async () => {
      // Simuler un délai de chargement
      await new Promise(resolve => setTimeout(resolve, 500));
      
      const demoData: Session[] = [
        {
          id: '1',
          studentName: 'Jean Dupont',
          studentAvatar: 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=200&h=200&fit=crop&crop=faces',
          date: new Date(Date.now() + 2 * 24 * 60 * 60 * 1000).toISOString(), // Demain
          duration: 60,
          status: 'scheduled',
          module: 'Présentation produit',
          notes: 'Préparer les slides pour la nouvelle gamme de produits.'
        },
        {
          id: '2',
          studentName: 'Marie Martin',
          studentAvatar: 'https://images.unsplash.com/photo-1438761681033-6461ffad8d80?w=200&h=200&fit=crop&crop=faces',
          date: new Date(Date.now() - 2 * 24 * 60 * 60 * 1000).toISOString(), // Il y a 2 jours
          duration: 45,
          status: 'completed',
          module: 'Négociation',
          notes: 'À relancer pour un suivi dans 2 semaines.'
        },
        {
          id: '3',
          studentName: 'Pierre Durand',
          studentAvatar: 'https://images.unsplash.com/photo-1500648767791-00dcc994a43e?w=200&h=200&fit=crop&crop=faces',
          date: new Date(Date.now() - 5 * 24 * 60 * 60 * 1000).toISOString(), // Il y a 5 jours
          duration: 30,
          status: 'cancelled',
          notes: 'Reporté à une date ultérieure.'
        },
        {
          id: '4',
          studentName: 'Sophie Lambert',
          studentAvatar: 'https://images.unsplash.com/photo-1494790108377-be9c29b29330?w=200&h=200&fit=crop&crop=faces',
          date: new Date(Date.now() + 5 * 24 * 60 * 60 * 1000).toISOString(), // Dans 5 jours
          duration: 60,
          status: 'scheduled',
          module: 'Entretien RH',
          notes: 'Préparer les questions pour la simulation d\'entretien.'
        },
        {
          id: '5',
          studentName: 'Thomas Leroy',
          studentAvatar: 'https://images.unsplash.com/photo-1519085360753-af0119f7cbe7?w=200&h=200&fit=crop&crop=faces',
          date: new Date(Date.now() - 1 * 24 * 60 * 60 * 1000).toISOString(), // Hier
          duration: 45,
          status: 'completed',
          module: 'Pitch Elevator',
          notes: 'Très bon progrès sur la présentation.'
        }
      ];
      
      setSessions(demoData);
    };
    
    loadDemoData();
  }, []);

  // Filtrer les sessions
  const filteredSessions = sessions.filter(session => {
    const matchesSearch = session.studentName.toLowerCase().includes(searchQuery.toLowerCase()) ||
                         session.module?.toLowerCase().includes(searchQuery.toLowerCase());
    
    const matchesStatus = statusFilter === 'all' || session.status === statusFilter;
    
    return matchesSearch && matchesStatus;
  });

  // Gérer le clic sur une session
  const handleSessionClick = (sessionId: string) => {
    if (onSessionClick) {
      onSessionClick(sessionId);
    }
  };

  // Gérer le clic sur le bouton de nouvelle session
  const handleNewSession = () => {
    if (onNewSession) {
      onNewSession();
    } else {
      // Comportement par défaut
      alert('Fonctionnalité de nouvelle session à implémenter');
    }
  };

  return (
    <div className="space-y-6">
      {/* En-tête avec titre et bouton d'ajout */}
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between">
        <h2 className="text-2xl font-bold text-white">Sessions de coaching</h2>
        <motion.button 
          whileHover={{ scale: 1.02 }}
          whileTap={{ scale: 0.98 }}
          onClick={handleNewSession}
          className="mt-4 sm:mt-0 inline-flex items-center justify-center px-4 py-2 bg-gradient-to-r from-yellow-500 to-yellow-600 hover:from-yellow-600 hover:to-yellow-700 text-black font-medium rounded-lg transition-all shadow-lg shadow-yellow-500/20"
        >
          <Plus className="w-4 h-4 mr-2" />
          Nouvelle session
        </motion.button>
      </div>
      
      {/* Barre de recherche et filtres */}
      <div className="bg-gray-800/50 backdrop-blur-sm rounded-xl p-4 border border-gray-700/50">
        <div className="flex flex-col md:flex-row md:items-center md:space-x-4 space-y-4 md:space-y-0">
          <div className="relative flex-1">
            <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 w-4 h-4 text-gray-400" />
            <input
              type="text"
              placeholder="Rechercher une session..."
              className="w-full pl-10 pr-4 py-2 bg-gray-700/50 border border-gray-600/50 rounded-lg text-white placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-yellow-500 focus:border-transparent transition-all"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
            />
          </div>
          
          <div className="flex flex-wrap gap-2">
            <div className="relative">
              <select
                className="appearance-none bg-gray-700/50 border border-gray-600/50 text-white text-sm rounded-lg focus:ring-yellow-500 focus:border-yellow-500 block w-full pl-3 pr-8 py-2 transition-all"
                value={statusFilter}
                onChange={(e) => setStatusFilter(e.target.value)}
              >
                <option value="all">Tous les statuts</option>
                <option value="scheduled">Planifiées</option>
                <option value="completed">Terminées</option>
                <option value="cancelled">Annulées</option>
              </select>
              <Filter className="absolute right-2 top-1/2 transform -translate-y-1/2 w-4 h-4 text-gray-400 pointer-events-none" />
            </div>
            
            <button className="flex items-center justify-center px-3 py-2 bg-gray-700/50 hover:bg-gray-600/50 border border-gray-600/50 rounded-lg text-sm text-white transition-colors">
              <CalendarIcon className="w-4 h-4 mr-2" />
              <span>Filtrer par date</span>
            </button>
          </div>
        </div>
      </div>
      
      {/* Liste des sessions */}
      <div className="space-y-4">
        {filteredSessions.length > 0 ? (
          <motion.div 
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.3 }}
            className="grid gap-4"
          >
            {filteredSessions.map((session) => (
              <motion.div 
                key={session.id}
                whileHover={{ scale: 1.01 }}
                whileTap={{ scale: 0.99 }}
                onClick={() => handleSessionClick(session.id)}
                className="cursor-pointer"
              >
                <SessionCard {...session} />
              </motion.div>
            ))}
          </motion.div>
        ) : (
          <div className="text-center py-12 bg-gray-800/30 rounded-xl border border-dashed border-gray-700/50">
            <div className="mx-auto w-12 h-12 rounded-full bg-gray-700/50 flex items-center justify-center mb-4">
              <CalendarIcon className="w-6 h-6 text-gray-500" />
            </div>
            <h3 className="text-lg font-medium text-gray-300">Aucune session trouvée</h3>
            <p className="mt-1 text-sm text-gray-500 max-w-md mx-auto">
              {searchQuery || statusFilter !== 'all' 
                ? 'Aucune session ne correspond à vos critères de recherche.'
                : 'Vous n\'avez pas encore de sessions de coaching.'}
            </p>
            {(!searchQuery && statusFilter === 'all') && (
              <button
                onClick={handleNewSession}
                className="mt-4 inline-flex items-center px-4 py-2 border border-transparent text-sm font-medium rounded-md shadow-sm text-white bg-yellow-500 hover:bg-yellow-600 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-yellow-500 transition-colors"
              >
                <Plus className="-ml-1 mr-2 h-4 w-4" />
                Planifier une session
              </button>
            )}
          </div>
        )}
      </div>
    </div>
  );
}
