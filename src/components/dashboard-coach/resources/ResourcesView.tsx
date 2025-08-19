'use client';

import { useState, useCallback } from 'react';
import { AnimatePresence } from 'framer-motion';
import { FolderOpen, Upload } from 'lucide-react';

// Composants
import { ResourceHeader } from './components/ResourceHeader';
import { ResourceCard } from './components/ResourceCard';
import { ResourceViewer } from './components/ResourceViewer';
import { FileUploader } from './components/FileUploader';
import { NewFolderModal } from './components/NewFolderModal';

// Types
import type { Resource, Folder } from './types';

// Données de démonstration
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
    size: 'Lien externe',
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

const ResourcesView = () => {
  const [resources, setResources] = useState<(Resource | Folder)[]>(demoResources);
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedResource, setSelectedResource] = useState<string | null>(null);
  const [currentFolder, setCurrentFolder] = useState<string | null>(null);
  const [viewMode, setViewMode] = useState<'grid' | 'list'>('list');
  const [showUploadModal, setShowUploadModal] = useState(false);
  const [showNewFolderModal, setShowNewFolderModal] = useState(false);

  // Filtre les ressources selon la recherche et le dossier courant
  const filteredResources = resources.filter(resource => {
    const matchesSearch = resource.name.toLowerCase().includes(searchQuery.toLowerCase());
    const isInCurrentFolder = 
      (currentFolder && 'folderId' in resource && resource.folderId === currentFolder) ||
      (currentFolder === null && !('folderId' in resource));
    
    return matchesSearch && isInCurrentFolder;
  });

  // Obtient le chemin du dossier actuel
  const getFolderPath = useCallback((folderId: string | null, path: string[] = []): string[] => {
    if (!folderId) return ['Racine', ...path];
    
    const folder = resources.find(r => r.id === folderId && r.type === 'folder') as Folder | undefined;
    if (!folder) return ['Racine', ...path];
    
    return getFolderPath(folder.folderId || null, [folder.name, ...path]);
  }, [resources]);

  const folderPath = getFolderPath(currentFolder);

  // Gestion des ressources
  const handleSelectResource = useCallback((id: string) => {
    const resource = resources.find(r => r.id === id);
    if (!resource) return;
    
    if (resource.type === 'folder') {
      setCurrentFolder(id);
    } else if (resource.type === 'link') {
      window.open(resource.url, '_blank', 'noopener,noreferrer');
    } else {
      setSelectedResource(id === selectedResource ? null : id);
    }
  }, [resources, selectedResource]);

  const handleDeleteResource = useCallback((id: string) => {
    setResources(prev => prev.filter(resource => resource.id !== id));
    if (selectedResource === id) {
      setSelectedResource(null);
    }
  }, [selectedResource]);

  const handleEditResource = useCallback((id: string) => {
    console.log('Édition de la ressource:', id);
    // Ici vous pourriez ouvrir un modal d'édition
  }, []);

  const handleUploadFiles = useCallback((files: File[]) => {
    const newResources: Resource[] = files.map(file => {
      const getFileType = (file: File): Resource['type'] => {
        const name = file.name.toLowerCase();
        const type = file.type;

        if (type === 'application/pdf' || name.endsWith('.pdf')) return 'pdf';
        if (type.startsWith('image/')) return 'image';
        if (type.startsWith('video/')) return 'video';
        if (type.startsWith('audio/')) return 'audio';
        if (type.includes('zip') || type.includes('compressed') || name.endsWith('.zip')) return 'archive';
        if (name.match(/\.(js|jsx|ts|tsx|html|css|scss|json)$/)) return 'code';
        
        return 'document';
      };

      return {
        id: `file-${Date.now()}-${Math.random()}`,
        name: file.name,
        type: getFileType(file),
        size: `${(file.size / 1024 / 1024).toFixed(1)} MB`,
        lastModified: new Date(),
        url: URL.createObjectURL(file),
        folderId: currentFolder || undefined,
        description: `Fichier uploadé: ${file.name}`,
      };
    });

    setResources(prev => [...prev, ...newResources]);
    setShowUploadModal(false);
  }, [currentFolder]);

  const handleCreateFolder = useCallback((name: string) => {
    const newFolder: Folder = {
      id: `folder-${Date.now()}`,
      name,
      type: 'folder',
      lastModified: new Date(),
      url: '#',
      items: [],
      isExpanded: false,
      folderId: currentFolder || undefined,
    };
    
    setResources(prev => [...prev, newFolder]);
    setShowNewFolderModal(false);
  }, [currentFolder]);

  const handleNavigateToFolder = useCallback((folderId: string | null) => {
    setCurrentFolder(folderId);
  }, []);

  // Rendu récursif des ressources
  const renderResources = useCallback((items: (Resource | Folder)[], level = 0) => {
    return items.map(item => (
      <div key={item.id}>
        <ResourceCard
          resource={item}
          onSelect={handleSelectResource}
          onDelete={handleDeleteResource}
          onEdit={handleEditResource}
          level={level}
          isSelected={selectedResource === item.id}
          viewMode={viewMode}
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
  }, [resources, selectedResource, viewMode, handleSelectResource, handleDeleteResource, handleEditResource]);

  const selectedResourceData = selectedResource 
    ? resources.find(r => r.id === selectedResource) as Resource | undefined
    : null;

  return (
    <div className="h-full flex flex-col bg-gray-900 rounded-xl overflow-hidden">
      {/* En-tête */}
      <ResourceHeader
        searchQuery={searchQuery}
        onSearchChange={setSearchQuery}
        onUpload={() => setShowUploadModal(true)}
        onNewFolder={() => setShowNewFolderModal(true)}
        viewMode={viewMode}
        onViewModeChange={setViewMode}
        folderPath={folderPath}
        onNavigateToFolder={handleNavigateToFolder}
      />

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
              <ResourceCard
                key={resource.id}
                resource={resource}
                onSelect={handleSelectResource}
                onDelete={handleDeleteResource}
                onEdit={handleEditResource}
                isSelected={selectedResource === resource.id}
                viewMode={viewMode}
              />
            ))}
          </div>
        )}
      </div>

      {/* Modals */}
      <AnimatePresence>
        {showUploadModal && (
          <FileUploader
            onUpload={handleUploadFiles}
            onClose={() => setShowUploadModal(false)}
            currentFolder={currentFolder || undefined}
          />
        )}
      </AnimatePresence>
      
      <AnimatePresence>
        {showNewFolderModal && (
          <NewFolderModal
            onClose={() => setShowNewFolderModal(false)}
            onCreate={handleCreateFolder}
            currentPath={folderPath}
          />
        )}
      </AnimatePresence>

      <AnimatePresence>
        {selectedResourceData && (
          <ResourceViewer
            resource={selectedResourceData}
            onClose={() => setSelectedResource(null)}
          />
        )}
      </AnimatePresence>
    </div>
  );
};

export default ResourcesView;
