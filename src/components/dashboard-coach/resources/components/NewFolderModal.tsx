'use client';

import { useState } from 'react';
import { motion } from 'framer-motion';
import { X, FolderPlus } from 'lucide-react';

interface NewFolderModalProps {
  onClose: () => void;
  onCreate: (name: string) => void;
  currentPath: string[];
}

export const NewFolderModal = ({ onClose, onCreate, currentPath }: NewFolderModalProps) => {
  const [folderName, setFolderName] = useState('');

  const handleCreate = () => {
    if (folderName.trim()) {
      onCreate(folderName.trim());
      setFolderName('');
      onClose();
    }
  };

  const handleKeyDown = (e: React.KeyboardEvent) => {
    if (e.key === 'Enter') {
      handleCreate();
    } else if (e.key === 'Escape') {
      onClose();
    }
  };

  return (
    <motion.div 
      className="fixed inset-0 bg-black/70 flex items-center justify-center z-50 p-4"
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
      onClick={onClose}
    >
      <motion.div 
        className="bg-gray-800 rounded-xl w-full max-w-md p-6 relative"
        initial={{ y: 20, opacity: 0 }}
        animate={{ y: 0, opacity: 1 }}
        exit={{ y: -20, opacity: 0 }}
        onClick={(e) => e.stopPropagation()}
      >
        <button 
          className="absolute top-4 right-4 text-gray-400 hover:text-white"
          onClick={onClose}
        >
          <X className="w-5 h-5" />
        </button>
        
        <div className="mb-6">
          <div className="w-12 h-12 bg-yellow-500/10 rounded-full flex items-center justify-center mx-auto mb-4">
            <FolderPlus className="w-6 h-6 text-yellow-400" />
          </div>
          <h3 className="text-xl font-bold text-white mb-2 text-center">Nouveau dossier</h3>
          <p className="text-gray-400 text-sm text-center">
            Créez un nouveau dossier pour organiser vos ressources
          </p>
        </div>
        
        <div className="mb-6">
          <label className="block text-sm font-medium text-gray-300 mb-2">
            Nom du dossier
          </label>
          <input
            type="text"
            className="w-full px-4 py-2 bg-gray-700 border border-gray-600 rounded-lg text-white placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-yellow-500 focus:border-transparent"
            placeholder="Ex: Documents de formation"
            value={folderName}
            onChange={(e) => setFolderName(e.target.value)}
            onKeyDown={handleKeyDown}
            autoFocus
          />
          <p className="mt-1 text-xs text-gray-500">
            Emplacement: {currentPath.join(' > ')}
          </p>
        </div>
        
        <div className="flex justify-end space-x-3">
          <button 
            className="px-4 py-2 bg-transparent border border-gray-700 text-white rounded-lg hover:bg-gray-700/50 transition-colors"
            onClick={onClose}
          >
            Annuler
          </button>
          <button 
            className={`px-4 py-2 rounded-lg font-medium transition-colors ${
              folderName.trim() 
                ? 'bg-yellow-500 hover:bg-yellow-600 text-black' 
                : 'bg-gray-700 text-gray-500 cursor-not-allowed'
            }`}
            onClick={handleCreate}
            disabled={!folderName.trim()}
          >
            Créer le dossier
          </button>
        </div>
      </motion.div>
    </motion.div>
  );
};
