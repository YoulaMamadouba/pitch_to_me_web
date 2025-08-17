'use client';

import { useState, useRef, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { 
  Search, 
  Plus, 
  FileText, 
  File, 
  Video, 
  Image as ImageIcon, 
  Link2, 
  Download, 
  Trash2,
  Edit2,
  Folder,
  FolderPlus,
  ChevronDown,
  ChevronRight,
  MoreHorizontal,
  Share2,
  Copy,
  Upload,
  UploadCloud,
  X,
  PlayCircle,
  FolderOpen,
  LayoutGrid,
  List,
  ExternalLink,
  FileArchive,
  FileCode,
  FileAudio,
  FileVideo as FileVideo2,
  FileType2,
  FileJson
} from 'lucide-react';

// Alias pour la compatibilité
const FileVideo = FileVideo2;
const FilePdf = FileType2;
const FileJsonIcon = FileJson;
import Image from 'next/image';

// Types
type ResourceType = 'document' | 'video' | 'image' | 'link' | 'folder' | 'pdf' | 'audio' | 'archive' | 'code' | 'youtube';

interface Resource {
  id: string;
  name: string;
  type: ResourceType;
  size?: string;
  lastModified: Date;
  url: string;
  folderId?: string;
  thumbnail?: string;
  description?: string;
}

interface Folder extends Omit<Resource, 'type'> {
  type: 'folder';
  items: string[]; // IDs des ressources dans ce dossier
  isExpanded?: boolean;
}

// Données de démonstration avec des exemples réels
const demoResources: (Resource | Folder)[] = [
  {
    id: 'folder-1',
    name: 'Formation Pitch',
    type: 'folder',
    lastModified: new Date('2025-08-15'),
    url: '#',
    items: ['pdf-1', 'video-1', 'youtube-1'],
    isExpanded: true,
  },
  {
    id: 'pdf-1',
    name: 'Guide du pitch parfait.pdf',
    type: 'pdf',
    size: '2.4 MB',
    lastModified: new Date('2025-08-10'),
    url: 'https://www.w3.org/WAI/ER/tests/xhtml/testfiles/resources/pdf/dummy.pdf',
    folderId: 'folder-1',
    thumbnail: 'https://images.unsplash.com/photo-1461749280684-dccba630e2f6?w=200&h=200&fit=crop&crop=faces',
    description: 'Guide complet pour maîtriser l\'art du pitch en entreprise',
  },
  {
    id: 'video-1',
    name: 'Exemple de pitch réussi.mp4',
    type: 'video',
    size: '45.2 MB',
    lastModified: new Date('2025-08-12'),
    url: 'http://commondatastorage.googleapis.com/gtv-videos-bucket/sample/BigBuckBunny.mp4',
    folderId: 'folder-1',
    thumbnail: 'https://images.unsplash.com/photo-1551817958-9cc07887d3df?w=200&h=200&fit=crop&crop=faces',
    description: 'Exemple de pitch réussi par un de nos étudiants',
  },
  {
    id: 'youtube-1',
    name: 'Comment pitcher comme un pro',
    type: 'video',
    size: 'Lien YouTube',
    lastModified: new Date('2025-08-11'),
    url: 'https://www.youtube.com/watch?v=HAnw168huqA',
    folderId: 'folder-1',
    thumbnail: 'https://i.ytimg.com/vi/HAnw168huqA/hqdefault.jpg',
    description: 'Tutoriel vidéo sur les techniques de pitch',
  },
  {
    id: 'folder-2',
    name: 'Ressources Graphiques',
    type: 'folder',
    lastModified: new Date('2025-08-05'),
    url: '#',
    items: ['img-1', 'doc-2'],
    isExpanded: false,
  },
  {
    id: 'img-1',
    name: 'Template présentation pitch.png',
    type: 'image',
    size: '1.8 MB',
    lastModified: new Date('2025-07-28'),
    url: 'https://images.unsplash.com/photo-1551288049-bebda4e38f71?w=800&h=600&fit=crop&crop=faces',
    folderId: 'folder-2',
    thumbnail: 'https://images.unsplash.com/photo-1551288049-bebda4e38f71?w=200&h=200&fit=crop&crop=faces',
  },
  {
    id: 'doc-2',
    name: 'Structure type pitch.docx',
    type: 'document',
    size: '1.2 MB',
    lastModified: new Date('2025-07-25'),
    url: 'https://www.w3.org/WAI/ER/tests/xhtml/testfiles/resources/pdf/dummy.pdf',
    folderId: 'folder-2',
    description: 'Structure type à suivre pour un pitch efficace',
  },
  {
    id: 'link-1',
    name: 'Outils de présentation en ligne',
    type: 'link',
    lastModified: new Date('2025-08-01'),
    url: 'https://www.canva.com/presentations/templates/',
    description: 'Modèles de présentation professionnels sur Canva',
  },
  {
    id: 'pdf-2',
    name: 'Exercices pratiques pitch.pdf',
    type: 'pdf',
    size: '3.1 MB',
    lastModified: new Date('2025-08-03'),
    url: 'https://www.w3.org/WAI/ER/tests/xhtml/testfiles/resources/pdf/dummy.pdf',
    description: 'Exercices pour s\'entraîner à pitcher efficacement',
  },
  {
    id: 'vimeo-1',
    name: 'Storytelling pour pitch',
    type: 'video',
    size: 'Lien Vimeo',
    lastModified: new Date('2025-07-20'),
    url: 'https://vimeo.com/76979871',
    thumbnail: 'https://i.vimeocdn.com/video/452001751-3f8a7b3f5d7b3e8f3e5d3a2f1e2d3c1b',
    description: 'Comment intégrer le storytelling dans votre pitch',
  },
];

// Fonction pour déterminer le type de ressource à partir de l'URL ou du nom de fichier
const getResourceType = (url: string, name: string): ResourceType => {
  const lowerUrl = url.toLowerCase();
  const lowerName = name.toLowerCase();
  
  if (lowerUrl.includes('youtube.com') || lowerUrl.includes('youtu.be') || lowerUrl.includes('vimeo.com')) {
    return 'video';
  }
  
  if (lowerName.endsWith('.pdf')) return 'pdf';
  if (lowerName.match(/\.(jpg|jpeg|png|gif|webp|svg)$/)) return 'image';
  if (lowerName.match(/\.(mp4|webm|mov|avi|mkv)$/)) return 'video';
  if (lowerName.match(/\.(mp3|wav|ogg|m4a)$/)) return 'audio';
  if (lowerName.match(/\.(zip|rar|7z|tar\.gz)$/)) return 'archive';
  if (lowerName.match(/\.(js|jsx|ts|tsx|html|css|scss|json)$/)) return 'code';
  if (lowerName.match(/^https?:\/\//)) return 'link';
  
  return 'document';
};

// Composant d'icône de ressource
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
      return <Folder className={iconClass} />;
    case 'audio':
      return <FileAudio className={iconClass} />;
    case 'archive':
      return <FileArchive className={iconClass} />;
    case 'code':
      return <FileCode className={iconClass} />;
    default:
      return <File className={iconClass} />;
  }
};

// Composant de carte de ressource
const ResourceCard = ({
  resource,
  onSelect,
  onDelete,
  onEdit,
  level = 0,
  isSelected = false,
}: {
  resource: Resource | Folder;
  onSelect: (id: string) => void;
  onDelete: (id: string) => void;
  onEdit: (id: string) => void;
  level?: number;
  isSelected?: boolean;
}) => {
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
};

// Composant pour afficher un aperçu PDF
const PdfViewer = ({ url }: { url: string }) => {
  return (
    <div className="w-full h-full">
      <object 
        data={`${url}#view=fitH`} 
        type="application/pdf"
        className="w-full h-full min-h-[500px] bg-gray-900"
      >
        <div className="flex flex-col items-center justify-center p-8 text-center">
          <FilePdf className="w-12 h-12 text-red-500 mb-4" />
          <p className="text-gray-300 mb-4">Impossible d'afficher le PDF. Vous pouvez le télécharger ci-dessous.</p>
          <a 
            href={url} 
            target="_blank" 
            rel="noopener noreferrer"
            className="px-4 py-2 bg-blue-600 hover:bg-blue-700 text-white rounded-lg flex items-center"
          >
            <Download className="w-4 h-4 mr-2" />
            Télécharger le PDF
          </a>
        </div>
      </object>
    </div>
  );
};

// Composant pour afficher une vidéo intégrée
const VideoPlayer = ({ url, thumbnail }: { url: string; thumbnail?: string }) => {
  const isYouTube = url.includes('youtube.com') || url.includes('youtu.be');
  const isVimeo = url.includes('vimeo.com');
  
  let videoId = '';
  let embedUrl = '';
  
  if (isYouTube) {
    // Extraire l'ID de la vidéo YouTube
    const match = url.match(/(?:youtube\.com\/(?:[^\/]+\/.+\/|(?:v|e(?:mbed)?)\/|.*[?&]v=)|youtu\.be\/)([^\"&?\/\s]{11})/);
    videoId = match ? match[1] : '';
    embedUrl = `https://www.youtube.com/embed/${videoId}?autoplay=1`;
  } else if (isVimeo) {
    // Extraire l'ID de la vidéo Vimeo
    const match = url.match(/(?:vimeo\.com\/|player\.vimeo\.com\/video\/)(\d+)/);
    videoId = match ? match[1] : '';
    embedUrl = `https://player.vimeo.com/video/${videoId}?autoplay=1`;
  }
  
  if (isYouTube || isVimeo) {
    return (
      <div className="relative aspect-video w-full bg-black rounded-lg overflow-hidden">
        <iframe
          src={embedUrl}
          className="absolute inset-0 w-full h-full"
          frameBorder="0"
          allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
          allowFullScreen
          title="Vidéo intégrée"
        />
      </div>
    );
  }
  
  // Pour les vidéos locales ou MP4
  return (
    <div className="relative w-full">
      <video 
        controls 
        className="w-full max-h-[70vh] bg-black rounded-lg"
        poster={thumbnail}
      >
        <source src={url} type="video/mp4" />
        Votre navigateur ne prend pas en charge la lecture de vidéos.
      </video>
    </div>
  );
};

// Composant principal
const ResourcesView = () => {
  const [resources, setResources] = useState<(Resource | Folder)[]>(demoResources);
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedResource, setSelectedResource] = useState<string | null>(null);
  const [currentFolder, setCurrentFolder] = useState<string | null>(null);
  const [viewMode, setViewMode] = useState<'grid' | 'list'>('list');
  const [showUploadModal, setShowUploadModal] = useState(false);
  const [showNewFolderModal, setShowNewFolderModal] = useState(false);
  const [newFolderName, setNewFolderName] = useState('');

  // Filtre les ressources selon la recherche et le dossier courant
  const filteredResources = resources.filter(resource => {
    // Filtre par recherche
    const matchesSearch = resource.name.toLowerCase().includes(searchQuery.toLowerCase());
    
    // Filtre par dossier parent
    const isInCurrentFolder = 
      (currentFolder && 'folderId' in resource && resource.folderId === currentFolder) ||
      (currentFolder === null && !('folderId' in resource));
    
    return matchesSearch && isInCurrentFolder;
  });

  // Obtient le dossier actuel
  const currentFolderData = currentFolder 
    ? resources.find(r => r.id === currentFolder && r.type === 'folder') as Folder | undefined
    : null;

  // Obtient le chemin du dossier actuel
  const getFolderPath = (folderId: string | null, path: string[] = []): string[] => {
    if (!folderId) return ['Racine', ...path];
    
    const folder = resources.find(r => r.id === folderId && r.type === 'folder') as Folder | undefined;
    if (!folder) return ['Racine', ...path];
    
    return getFolderPath(folder.folderId || null, [folder.name, ...path]);
  };

  const folderPath = getFolderPath(currentFolder);

  // Gestion des dossiers
  const toggleFolder = (folderId: string) => {
    setResources(resources.map(resource => {
      if (resource.id === folderId && resource.type === 'folder') {
        return { ...resource, isExpanded: !(resource as Folder).isExpanded };
      }
      return resource;
    }));
  };

  const createNewFolder = () => {
    if (!newFolderName.trim()) return;
    
    const newFolder: Folder = {
      id: `folder-${Date.now()}`,
      name: newFolderName.trim(),
      type: 'folder',
      lastModified: new Date(),
      url: '#',
      items: [],
      isExpanded: false,
      folderId: currentFolder || undefined,
    };
    
    setResources([...resources, newFolder]);
    setNewFolderName('');
    setShowNewFolderModal(false);
  };

  // Gestion des ressources
  const handleSelectResource = (id: string) => {
    const resource = resources.find(r => r.id === id);
    if (!resource) return;
    
    if (resource.type === 'folder') {
      setCurrentFolder(id);
    } else if (resource.type === 'link') {
      // Ouvrir les liens externes dans un nouvel onglet
      window.open(resource.url, '_blank', 'noopener,noreferrer');
    } else {
      setSelectedResource(id === selectedResource ? null : id);
    }
  };

  const handleDeleteResource = (id: string) => {
    // Ici, vous pourriez ajouter une confirmation avant suppression
    setResources(resources.filter(resource => resource.id !== id));
    
    // Si la ressource supprimée est sélectionnée, on la désélectionne
    if (selectedResource === id) {
      setSelectedResource(null);
    }
  };

  const handleEditResource = (id: string) => {
    // Ici, vous pourriez ouvrir un modal d'édition
    console.log('Édition de la ressource:', id);
  };

  // Rendu récursif des ressources
  const renderResources = (items: (Resource | Folder)[], level = 0) => {
    return items.map(item => (
      <div key={item.id}>
        <ResourceCard
          resource={item}
          onSelect={handleSelectResource}
          onDelete={handleDeleteResource}
          onEdit={handleEditResource}
          level={level}
          isSelected={selectedResource === item.id}
        />
        
        {/* Rendu récursif pour les dossiers */}
        {item.type === 'folder' && 
         (item as Folder).isExpanded && 
         (item as Folder).items.length > 0 && (
          <div className="ml-6">
            {renderResources(
              resources.filter(r => (item as Folder).items.includes(r.id)),
              level + 1
            )}
          </div>
        )}
      </div>
    ));
  };

  return (
    <div className="h-full flex flex-col bg-gray-900 rounded-xl overflow-hidden">
      {/* En-tête */}
      <div className="p-4 border-b border-gray-800 bg-gray-900/80 backdrop-blur-sm">
        <div className="flex items-center justify-between mb-4">
          <div>
            <h2 className="text-xl font-bold text-white">Ressources</h2>
            <div className="flex items-center text-sm text-gray-400 mt-1">
              {folderPath.map((folder, index) => (
                <div key={index} className="flex items-center">
                  {index > 0 && <ChevronRight className="w-4 h-4 mx-1 text-gray-500" />}
                  <button 
                    className="hover:text-yellow-400 transition-colors"
                    onClick={() => {
                      // Trouver l'ID du dossier correspondant
                      const pathIndex = index;
                      const folderId = pathIndex === 0 
                        ? null 
                        : resources.find(r => r.name === folderPath[pathIndex] && r.type === 'folder')?.id || null;
                      setCurrentFolder(folderId);
                    }}
                  >
                    {folder}
                  </button>
                </div>
              ))}
            </div>
          </div>
          
          <div className="flex space-x-2">
            <button 
              className={`p-2 rounded-lg ${viewMode === 'grid' ? 'bg-gray-800 text-yellow-400' : 'text-gray-400 hover:bg-gray-800/50'}`}
              onClick={() => setViewMode('grid')}
              title="Vue grille"
            >
              <LayoutGrid className="w-5 h-5" />
            </button>
            <button 
              className={`p-2 rounded-lg ${viewMode === 'list' ? 'bg-gray-800 text-yellow-400' : 'text-gray-400 hover:bg-gray-800/50'}`}
              onClick={() => setViewMode('list')}
              title="Vue liste"
            >
              <List className="w-5 h-5" />
            </button>
          </div>
        </div>
        
        <div className="flex items-center space-x-3">
          <div className="relative flex-1">
            <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 w-4 h-4 text-gray-500" />
            <input
              type="text"
              placeholder="Rechercher des ressources..."
              className="w-full pl-10 pr-4 py-2 bg-gray-800 rounded-lg text-white placeholder-gray-500 focus:outline-none focus:ring-2 focus:ring-yellow-500 focus:border-transparent"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
            />
          </div>
          
          <div className="flex space-x-2">
            <button 
              className="flex items-center space-x-1.5 px-3 py-2 bg-yellow-500 hover:bg-yellow-600 text-black font-medium rounded-lg transition-colors"
              onClick={() => setShowUploadModal(true)}
            >
              <Upload className="w-4 h-4" />
              <span>Importer</span>
            </button>
            <button 
              className="flex items-center space-x-1.5 px-3 py-2 bg-gray-800 hover:bg-gray-700 text-white font-medium rounded-lg transition-colors"
              onClick={() => setShowNewFolderModal(true)}
            >
              <FolderPlus className="w-4 h-4" />
              <span>Nouveau dossier</span>
            </button>
          </div>
        </div>
      </div>

      {/* Liste des ressources */}
      <div className="flex-1 overflow-y-auto p-2">
        {viewMode === 'list' ? (
          <div className="space-y-1">
            {filteredResources.length > 0 ? (
              renderResources(filteredResources)
            ) : (
              <div className="flex flex-col items-center justify-center h-64 text-center text-gray-500">
                <FolderOpen className="w-12 h-12 mb-4 text-gray-600" />
                <p className="text-lg font-medium">Aucune ressource trouvée</p>
                <p className="text-sm mt-1">
                  {searchQuery 
                    ? 'Aucun résultat pour votre recherche' 
                    : currentFolder 
                      ? 'Ce dossier est vide' 
                      : 'Commencez par ajouter des ressources'}
                </p>
                {!searchQuery && (
                  <button 
                    className="mt-4 px-4 py-2 bg-yellow-500 hover:bg-yellow-600 text-black font-medium rounded-lg transition-colors flex items-center space-x-2"
                    onClick={() => setShowUploadModal(true)}
                  >
                    <Upload className="w-4 h-4" />
                    <span>Importer des fichiers</span>
                  </button>
                )}
              </div>
            )}
          </div>
        ) : (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-4 p-4">
            {filteredResources.map(resource => (
              <div 
                key={resource.id}
                className={`relative group bg-gray-800/50 rounded-xl p-4 border border-gray-700/50 hover:border-yellow-400/30 transition-all cursor-pointer ${
                  selectedResource === resource.id ? 'ring-2 ring-yellow-500/50' : ''
                }`}
                onClick={() => handleSelectResource(resource.id)}
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
                        handleEditResource(resource.id);
                      }}
                    >
                      <Edit2 className="w-4 h-4 mr-1" />
                      <span>Modifier</span>
                    </button>
                    <button 
                      className="flex-1 py-1.5 px-2 bg-gray-800 hover:bg-red-500/20 text-red-400 text-xs font-medium rounded-md transition-colors flex items-center justify-center"
                      onClick={(e) => {
                        e.stopPropagation();
                        handleDeleteResource(resource.id);
                      }}
                    >
                      <Trash2 className="w-3 h-3 mr-1" />
                      <span>Supprimer</span>
                    </button>
                  </div>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>

      {/* Modal de visualisation de ressource */}
      <AnimatePresence>
        {selectedResource && (() => {
          const resource = resources.find(r => r.id === selectedResource);
          if (!resource || resource.type === 'folder') return null;
          
          return (
            <motion.div 
              className="fixed inset-0 bg-black/90 z-50 flex items-center justify-center p-4"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              onClick={() => setSelectedResource(null)}
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
                      onClick={() => setSelectedResource(null)}
                    >
                      <X className="w-5 h-5" />
                    </button>
                  </div>
                </div>
                
                {/* Contenu */}
                <div className="flex-1 overflow-auto p-6">
                  {resource.type === 'pdf' ? (
                    <PdfViewer url={resource.url} />
                  ) : resource.type === 'video' ? (
                    <VideoPlayer url={resource.url} thumbnail={resource.thumbnail} />
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
                      <p>Aperçu non disponible pour ce type de fichier</p>
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
                      <button className="p-2 text-gray-400 hover:text-white transition-colors">
                        <Share2 className="w-4 h-4" />
                      </button>
                      <button className="p-2 text-gray-400 hover:text-white transition-colors">
                        <Copy className="w-4 h-4" />
                      </button>
                      <a 
                        href={resource.url} 
                        download={resource.name}
                        className="p-2 text-gray-400 hover:text-white transition-colors"
                      >
                        <Download className="w-4 h-4" />
                      </a>
                    </div>
                  </div>
                </div>
              </div>
            </motion.div>
          );
        })()}
      </AnimatePresence>
      
      {/* Modal d'import de fichiers */}
      <AnimatePresence>
        {showUploadModal && (
          <motion.div 
            className="fixed inset-0 bg-black/70 flex items-center justify-center z-50 p-4"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            onClick={() => setShowUploadModal(false)}
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
                onClick={() => setShowUploadModal(false)}
              >
                <X className="w-5 h-5" />
              </button>
              
              <div className="text-center mb-6">
                <div className="w-16 h-16 bg-yellow-500/10 rounded-full flex items-center justify-center mx-auto mb-4">
                  <UploadCloud className="w-8 h-8 text-yellow-400" />
                </div>
                <h3 className="text-xl font-bold text-white mb-1">Importer des fichiers</h3>
                <p className="text-gray-400 text-sm">Glissez et déposez vos fichiers ici ou cliquez pour les sélectionner</p>
              </div>
              
              <div className="border-2 border-dashed border-gray-700 rounded-xl p-8 text-center mb-6 cursor-pointer hover:border-yellow-500/50 transition-colors">
                <div className="flex flex-col items-center justify-center space-y-2">
                  <Upload className="w-10 h-10 text-gray-500" />
                  <p className="text-sm text-gray-400">Glissez vos fichiers ici</p>
                  <p className="text-xs text-gray-500">ou cliquez pour parcourir</p>
                </div>
                <input 
                  type="file" 
                  className="hidden" 
                  multiple 
                  onChange={(e) => {
                    // Gérer le téléversement des fichiers ici
                    console.log('Fichiers sélectionnés:', e.target.files);
                    setShowUploadModal(false);
                  }}
                />
              </div>
              
              <div className="grid grid-cols-2 gap-3">
                <button 
                  className="px-4 py-2 bg-transparent border border-gray-700 text-white rounded-lg hover:bg-gray-700/50 transition-colors"
                  onClick={() => setShowUploadModal(false)}
                >
                  Annuler
                </button>
                <button 
                  className="px-4 py-2 bg-yellow-500 hover:bg-yellow-600 text-black font-medium rounded-lg transition-colors flex items-center justify-center"
                  onClick={() => {
                    // Simuler un téléversement
                    console.log('Téléversement des fichiers...');
                    setShowUploadModal(false);
                  }}
                >
                  Importer
                </button>
              </div>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>

      {/* Modal de création de dossier */}
      <AnimatePresence>
        {showNewFolderModal && (
          <motion.div 
            className="fixed inset-0 bg-black/70 flex items-center justify-center z-50 p-4"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            onClick={() => setShowNewFolderModal(false)}
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
                onClick={() => setShowNewFolderModal(false)}
              >
                <X className="w-5 h-5" />
              </button>
              
              <div className="mb-6">
                <h3 className="text-xl font-bold text-white mb-2">Nouveau dossier</h3>
                <p className="text-gray-400 text-sm">Créez un nouveau dossier pour organiser vos ressources</p>
              </div>
              
              <div className="mb-6">
                <label className="block text-sm font-medium text-gray-300 mb-2">
                  Nom du dossier
                </label>
                <input
                  type="text"
                  className="w-full px-4 py-2 bg-gray-700 border border-gray-600 rounded-lg text-white placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-yellow-500 focus:border-transparent"
                  placeholder="Ex: Documents de formation"
                  value={newFolderName}
                  onChange={(e) => setNewFolderName(e.target.value)}
                  autoFocus
                />
                <p className="mt-1 text-xs text-gray-500">
                  Emplacement: {folderPath.join(' > ')}
                </p>
              </div>
              
              <div className="flex justify-end space-x-3">
                <button 
                  className="px-4 py-2 bg-transparent border border-gray-700 text-white rounded-lg hover:bg-gray-700/50 transition-colors"
                  onClick={() => setShowNewFolderModal(false)}
                >
                  Annuler
                </button>
                <button 
                  className={`px-4 py-2 rounded-lg font-medium transition-colors ${
                    newFolderName.trim() 
                      ? 'bg-yellow-500 hover:bg-yellow-600 text-black' 
                      : 'bg-gray-700 text-gray-500 cursor-not-allowed'
                  }`}
                  onClick={createNewFolder}
                  disabled={!newFolderName.trim()}
                >
                  Créer le dossier
                </button>
              </div>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
};

export default ResourcesView;
