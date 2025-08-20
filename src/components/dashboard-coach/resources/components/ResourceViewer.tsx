'use client';

import { motion } from 'framer-motion';
import { 
  ExternalLink, 
  Download, 
  Share2, 
  Copy, 
  X,
  FileType2
} from 'lucide-react';
import { PdfViewer } from './PdfViewer';
import { VideoPlayer } from './VideoPlayer';
import { ResourceIcon } from './ResourceIcon';
import type { Resource } from '../types';

interface ResourceViewerProps {
  resource: Resource;
  onClose: () => void;
}

export const ResourceViewer = ({ resource, onClose }: ResourceViewerProps) => {
  const handleCopyLink = () => {
    navigator.clipboard.writeText(resource.url);
    // Ici vous pourriez ajouter une notification de succès
  };

  const handleShare = () => {
    if (navigator.share) {
      navigator.share({
        title: resource.name,
        url: resource.url,
      });
    } else {
      handleCopyLink();
    }
  };

  return (
    <motion.div 
      className="fixed inset-0 bg-black/90 z-50 flex items-center justify-center p-4"
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
      onClick={onClose}
    >
      <div 
        className="relative w-full max-w-5xl max-h-[90vh] bg-gray-900 rounded-xl overflow-hidden flex flex-col"
        onClick={e => e.stopPropagation()}
      >
        {/* En-tête */}
        <div className="flex items-center justify-between p-4 bg-gray-800 border-b border-gray-700">
          <div className="flex items-center space-x-3 max-w-[80%]">
            <ResourceIcon 
              type={resource.type} 
              className={`w-5 h-5 ${
                resource.type === 'pdf' ? 'text-red-400' :
                resource.type === 'video' ? 'text-blue-400' :
                resource.type === 'link' ? 'text-purple-400' : 'text-yellow-400'
              }`} 
            />
            <h3 className="text-white font-medium truncate">
              {resource.name}
            </h3>
          </div>
          <div className="flex items-center space-x-2">
            <a 
              href={resource.url} 
              target="_blank" 
              rel="noopener noreferrer"
              className="p-2 text-gray-400 hover:text-white transition-colors"
              title="Ouvrir dans un nouvel onglet"
            >
              <ExternalLink className="w-5 h-5" />
            </a>
            <a 
              href={resource.url} 
              download={resource.name}
              className="p-2 text-gray-400 hover:text-white transition-colors"
              title="Télécharger"
            >
              <Download className="w-5 h-5" />
            </a>
            <button 
              className="p-2 text-gray-400 hover:text-white transition-colors"
              onClick={onClose}
            >
              <X className="w-5 h-5" />
            </button>
          </div>
        </div>
        
        {/* Contenu */}
        <div className="flex-1 overflow-auto p-6">
          {resource.type === 'pdf' ? (
            <PdfViewer url={resource.url} title={resource.name} />
          ) : resource.type === 'video' ? (
            <VideoPlayer 
              url={resource.url} 
              thumbnail={resource.thumbnail} 
              title={resource.name}
            />
          ) : resource.type === 'image' ? (
            <div className="flex justify-center">
              <img 
                src={resource.url} 
                alt={resource.name}
                className="max-w-full max-h-[70vh] object-contain"
              />
            </div>
          ) : resource.type === 'link' ? (
            <div className="h-[70vh] flex items-center justify-center">
              <div className="text-center max-w-md">
                <ExternalLink className="w-12 h-12 text-blue-400 mx-auto mb-4" />
                <h3 className="text-xl font-medium text-white mb-2">Lien externe</h3>
                <p className="text-gray-400 mb-6">Vous allez être redirigé vers :</p>
                <div className="bg-gray-800/50 p-4 rounded-lg mb-6 break-all">
                  <p className="text-blue-400 text-sm">{resource.url}</p>
                </div>
                <a 
                  href={resource.url} 
                  target="_blank" 
                  rel="noopener noreferrer"
                  className="inline-flex items-center px-6 py-2.5 bg-blue-600 hover:bg-blue-700 text-white rounded-lg font-medium transition-colors"
                >
                  <ExternalLink className="w-4 h-4 mr-2" />
                  Ouvrir le lien
                </a>
              </div>
            </div>
          ) : (
            <div className="flex items-center justify-center h-64 text-gray-500">
              <div className="text-center">
                <FileType2 className="w-12 h-12 text-gray-600 mx-auto mb-4" />
              <p>Aperçu non disponible pour ce type de fichier</p>
              <a 
                href={resource.url} 
                download={resource.name}
                className="inline-flex items-center px-4 py-2 mt-4 bg-blue-600 hover:bg-blue-700 text-white rounded-lg transition-colors"
              >
                <Download className="w-4 h-4 mr-2" />
                Télécharger le fichier
              </a>
              </div>
            </div>
          )}
        </div>
        
        {/* Pied de page */}
        <div className="p-4 bg-gray-800 border-t border-gray-700 text-sm text-gray-400">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-white">{resource.name}</p>
              <p className="text-xs">
                Ajouté le {resource.lastModified.toLocaleDateString('fr-FR', {
                  day: '2-digit',
                  month: 'long',
                  year: 'numeric'
                })}
                {'size' in resource && resource.size && (
                  <span> • {resource.size}</span>
                )}
              </p>
            </div>
            <div className="flex items-center space-x-2">
              <button 
                className="p-2 text-gray-400 hover:text-white transition-colors"
                onClick={handleShare}
                title="Partager"
              >
                <Share2 className="w-4 h-4" />
              </button>
              <button 
                className="p-2 text-gray-400 hover:text-white transition-colors"
                onClick={handleCopyLink}
                title="Copier le lien"
              >
                <Copy className="w-4 h-4" />
              </button>
              <a 
                href={resource.url} 
                download={resource.name}
                className="p-2 text-gray-400 hover:text-white transition-colors"
                title="Télécharger"
              >
                <Download className="w-4 h-4" />
              </a>
            </div>
          </div>
        </div>
      </div>
    </motion.div>
  );
};
