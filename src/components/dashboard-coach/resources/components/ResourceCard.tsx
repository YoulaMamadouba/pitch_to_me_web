'use client';

import { useState, useRef, useEffect } from 'react';
import { 
  Edit2, 
  Trash2, 
  MoreHorizontal, 
  Download, 
  Share2, 
  Copy,
  ChevronDown,
  ChevronRight,
  PlayCircle,
  Video,
  FileType2,
  ExternalLink,
  FileText,
  Image as ImageIcon,
  Link2,
  Folder as FolderIcon,
  FileAudio,
  FileArchive,
  FileCode,
  File as FileIcon
} from 'lucide-react';
import Image from 'next/image';
// Composant ResourceIcon local pour éviter les erreurs d'import
const ResourceIcon = ({ type, className = '' }: { type: ResourceType; className?: string }) => {
  const iconClass = `w-5 h-5 ${className}`;
  
  switch (type) {
    case 'document':
      return <FileText className={iconClass} />;
    case 'pdf':
      return <FileType2 className={iconClass} />;
    case 'video':
    case 'youtube':
      return <Video className={iconClass} />;
    case 'image':
      return <ImageIcon className={iconClass} />;
    case 'link':
      return <Link2 className={iconClass} />;
    case 'folder':
      return <FolderIcon className={iconClass} />;
    case 'audio':
      return <FileAudio className={iconClass} />;
    case 'archive':
      return <FileArchive className={iconClass} />;
    case 'code':
      return <FileCode className={iconClass} />;
    default:
      return <FileIcon className={iconClass} />;
  }
};

type ResourceType = 'document' | 'video' | 'image' | 'link' | 'folder' | 'pdf' | 'audio' | 'archive' | 'code' | 'youtube' | 'docx';

interface ResourceBase {
  id: string;
  name: string;
  type: ResourceType;
  lastModified: Date;
  url: string;
  folderId?: string;
  description?: string;
  thumbnail?: string;
}

interface FileResource extends ResourceBase {
  size: string;
  mimeType?: string;
}

interface FolderResource extends ResourceBase {
  type: 'folder';
  items: string[];
  isExpanded?: boolean;
}

type Resource = FileResource | FolderResource;

interface Folder extends Omit<Resource, 'type' | 'size'> {
  type: 'folder';
  items: string[];
  isExpanded?: boolean;
  size?: never;
}

interface ResourceCardProps {
  resource: Resource | Folder;
  onSelect: (id: string) => void;
  onDelete: (id: string) => void;
  onEdit: (id: string) => void;
  level?: number;
  isSelected?: boolean;
  viewMode: 'grid' | 'list';
}

export const ResourceCard = ({
  resource,
  onSelect,
  onDelete,
  onEdit,
  level = 0,
  isSelected = false,
  viewMode
}: ResourceCardProps) => {
  const isFolder = resource.type === 'folder';
  const [isExpanded, setIsExpanded] = useState((resource as Folder).isExpanded || false);
  const [showActions, setShowActions] = useState(false);
  const cardRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (cardRef.current && !cardRef.current.contains(event.target as Node)) {
        setShowActions(false);
      }
    };

    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  const toggleExpand = (e: React.MouseEvent) => {
    e.stopPropagation();
    if (isFolder) {
      setIsExpanded(!isExpanded);
    }
  };

  if (viewMode === 'list') {
    return (
      <div 
        ref={cardRef}
        className={`relative ${isSelected ? 'bg-gray-800/50' : 'hover:bg-gray-800/30'} rounded-lg transition-colors cursor-pointer`}
        onClick={() => onSelect(resource.id)}
      >
        <div 
          className="flex items-center p-3"
          style={{ paddingLeft: `${level * 16 + 12}px` }}
        >
          {/* Indentation et icône de dossier */}
          <div className="flex items-center">
            {isFolder ? (
              <button 
                onClick={toggleExpand}
                className="p-1 rounded-full hover:bg-gray-700/50 mr-1"
              >
                {isExpanded ? (
                  <ChevronDown className="w-4 h-4 text-gray-400" />
                ) : (
                  <ChevronRight className="w-4 h-4 text-gray-400" />
                )}
              </button>
            ) : (
              <div className="w-6" />
            )}
            <ResourceIcon 
              type={resource.type} 
              className={isFolder ? 'text-yellow-400' : 'text-blue-400'} 
            />
          </div>

          {/* Nom et infos de la ressource */}
          <div className="ml-3 flex-1 min-w-0">
            <h3 className="text-sm font-medium text-white truncate">
              {resource.name}
            </h3>
            <div className="flex items-center text-xs text-gray-400 mt-0.5">
              <span>{resource.lastModified.toLocaleDateString('fr-FR')}</span>
              {'size' in resource && resource.size && (
                <span className="mx-2">•</span>
              )}
              {'size' in resource && resource.size && (
                <span>{resource.size}</span>
              )}
            </div>
          </div>

          {/* Actions */}
          <div className="flex items-center space-x-1">
            <button 
              className="p-1.5 rounded-full hover:bg-gray-700/50 text-gray-400 hover:text-white"
              onClick={(e) => {
                e.stopPropagation();
                onEdit(resource.id);
              }}
            >
              <Edit2 className="w-4 h-4" />
            </button>
            <button 
              className="p-1.5 rounded-full hover:bg-gray-700/50 text-gray-400 hover:text-white"
              onClick={(e) => {
                e.stopPropagation();
                onDelete(resource.id);
              }}
            >
              <Trash2 className="w-4 h-4" />
            </button>
            <button 
              className="p-1.5 rounded-full hover:bg-gray-700/50 text-gray-400 hover:text-white"
              onClick={(e) => {
                e.stopPropagation();
                setShowActions(!showActions);
              }}
            >
              <MoreHorizontal className="w-4 h-4" />
            </button>
          </div>
        </div>

        {/* Menu d'actions déroulant */}
        {showActions && (
          <div className="absolute right-0 mt-1 w-48 bg-gray-800 rounded-md shadow-lg z-10 border border-gray-700">
            <div className="py-1">
              <button className="w-full text-left px-4 py-2 text-sm text-gray-200 hover:bg-gray-700 flex items-center">
                <Download className="w-4 h-4 mr-2" />
                Télécharger
              </button>
              <button className="w-full text-left px-4 py-2 text-sm text-gray-200 hover:bg-gray-700 flex items-center">
                <Share2 className="w-4 h-4 mr-2" />
                Partager
              </button>
              <button className="w-full text-left px-4 py-2 text-sm text-gray-200 hover:bg-gray-700 flex items-center">
                <Copy className="w-4 h-4 mr-2" />
                Copier le lien
              </button>
            </div>
          </div>
        )}
      </div>
    );
  }

  // Vue grille
  return (
    <div 
      ref={cardRef}
      className={`relative group bg-gray-800/50 rounded-xl p-4 border border-gray-700/50 hover:border-yellow-400/30 transition-all cursor-pointer ${
        isSelected ? 'ring-2 ring-yellow-500/50' : ''
      }`}
      onClick={() => onSelect(resource.id)}
    >
      <div className="flex flex-col h-full">
        <div className="relative aspect-video bg-gray-900/50 rounded-lg overflow-hidden mb-3 flex items-center justify-center">
          {resource.type === 'image' && resource.thumbnail ? (
            <Image
              src={resource.thumbnail}
              alt={resource.name}
              width={300}
              height={200}
              className="w-full h-full object-cover"
            />
          ) : resource.type === 'video' || resource.type === 'youtube' ? (
            <div className="relative w-full h-full flex items-center justify-center">
              {resource.thumbnail ? (
                <>
                  <Image
                    src={resource.thumbnail}
                    alt={resource.name}
                    width={300}
                    height={200}
                    className="w-full h-full object-cover"
                  />
                  <div className="absolute inset-0 bg-black/30 flex items-center justify-center">
                    <PlayCircle className="w-12 h-12 text-white/80 hover:text-yellow-400 transition-colors" />
                  </div>
                </>
              ) : (
                <Video className="w-12 h-12 text-gray-500" />
              )}
            </div>
          ) : resource.type === 'pdf' ? (
            <div className="p-4 w-full h-full flex flex-col items-center justify-center bg-gray-800/50">
              <FileType2 className="w-12 h-12 text-red-500 mb-2" />
              <span className="text-xs text-gray-400 text-center px-2 line-clamp-2">
                {resource.name}
              </span>
            </div>
          ) : resource.type === 'link' ? (
            <div className="p-4 w-full h-full flex flex-col items-center justify-center bg-gradient-to-br from-blue-900/30 to-purple-900/30">
              <ExternalLink className="w-10 h-10 text-blue-400 mb-2" />
              <span className="text-xs text-blue-300 text-center px-2 line-clamp-2">
                {resource.url.replace(/^https?:\/\//, '').split('/')[0]}
              </span>
            </div>
          ) : (
            <div className="p-6 text-gray-500">
              <ResourceIcon 
                type={resource.type} 
                className={`w-10 h-10 mx-auto mb-2 ${
                  resource.type === 'folder' ? 'text-yellow-400' : 'text-blue-400'
                }`} 
              />
              <span className="text-xs font-medium text-center block">
                {resource.type === 'document' ? 'DOCUMENT' : 
                 resource.type === 'folder' ? 'DOSSIER' : 'LIEN'}
              </span>
            </div>
          )}
          
          {/* Badge de type */}
          <div className={`absolute top-2 right-2 text-white text-xs px-2 py-1 rounded-full flex items-center ${
            resource.type === 'pdf' ? 'bg-red-600/90' :
            resource.type === 'video' ? 'bg-blue-600/90' :
            resource.type === 'image' ? 'bg-green-600/90' :
            resource.type === 'link' ? 'bg-purple-600/90' :
            resource.type === 'document' ? 'bg-yellow-600/90' :
            'bg-gray-700/90'
          }`}>
            <ResourceIcon 
              type={resource.type} 
              className="w-3 h-3 mr-1" 
            />
            <span className="text-[10px] font-medium">
              {resource.type === 'pdf' ? 'PDF' : 
               resource.type === 'video' ? 'VIDÉO' : 
               resource.type === 'image' ? 'IMAGE' : 
               resource.type === 'link' ? 'LIEN' : 
               resource.type === 'document' ? 'DOC' : 'DOSSIER'}
            </span>
          </div>
        </div>
        
        <div className="flex-1">
          <h3 className="font-medium text-white mb-1 line-clamp-2">
            {resource.name}
          </h3>
          <p className="text-xs text-gray-400 mb-2 line-clamp-2">
            {resource.description || 'Aucune description'}
          </p>
          <div className="flex items-center justify-between text-xs text-gray-500">
            <span>
              {resource.lastModified.toLocaleDateString('fr-FR', {
                day: '2-digit',
                month: 'short',
                year: 'numeric'
              })}
            </span>
            {'size' in resource && resource.size && (
              <span>{resource.size}</span>
            )}
          </div>
        </div>
      </div>
      
      {/* Actions au survol */}
      <div className="absolute inset-0 bg-gradient-to-t from-black/80 to-transparent opacity-0 group-hover:opacity-100 transition-opacity rounded-xl flex items-end p-3">
        <div className="flex space-x-2 w-full">
          <button 
            className="flex-1 py-1.5 px-2 bg-gray-800 hover:bg-gray-700 text-white text-xs font-medium rounded-md transition-colors flex items-center justify-center"
            onClick={(e) => {
              e.stopPropagation();
              onEdit(resource.id);
            }}
          >
            <Edit2 className="w-4 h-4 mr-1" />
            <span>Modifier</span>
          </button>
          <button 
            className="flex-1 py-1.5 px-2 bg-gray-800 hover:bg-red-500/20 text-red-400 text-xs font-medium rounded-md transition-colors flex items-center justify-center"
            onClick={(e) => {
              e.stopPropagation();
              onDelete(resource.id);
            }}
          >
            <Trash2 className="w-3 h-3 mr-1" />
            <span>Supprimer</span>
          </button>
        </div>
      </div>
    </div>
  );
};
