'use client';

import { 
  Search, 
  Upload, 
  FolderPlus, 
  LayoutGrid, 
  List, 
  ChevronRight 
} from 'lucide-react';

interface ResourceHeaderProps {
  searchQuery: string;
  onSearchChange: (query: string) => void;
  onUpload: () => void;
  onNewFolder: () => void;
  viewMode: 'grid' | 'list';
  onViewModeChange: (mode: 'grid' | 'list') => void;
  folderPath: string[];
  onNavigateToFolder: (folderId: string | null) => void;
}

export const ResourceHeader = ({
  searchQuery,
  onSearchChange,
  onUpload,
  onNewFolder,
  viewMode,
  onViewModeChange,
  folderPath,
  onNavigateToFolder
}: ResourceHeaderProps) => {
  return (
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
                      : null; // Ici vous devriez implémenter la logique pour trouver l'ID
                    onNavigateToFolder(folderId);
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
            onClick={() => onViewModeChange('grid')}
            title="Vue grille"
          >
            <LayoutGrid className="w-5 h-5" />
          </button>
          <button 
            className={`p-2 rounded-lg ${viewMode === 'list' ? 'bg-gray-800 text-yellow-400' : 'text-gray-400 hover:bg-gray-800/50'}`}
            onClick={() => onViewModeChange('list')}
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
            onChange={(e) => onSearchChange(e.target.value)}
          />
        </div>
        
        <div className="flex space-x-2">
          <button 
            className="flex items-center space-x-1.5 px-3 py-2 bg-yellow-500 hover:bg-yellow-600 text-black font-medium rounded-lg transition-colors"
            onClick={onUpload}
          >
            <Upload className="w-4 h-4" />
            <span>Importer</span>
          </button>
          <button 
            className="flex items-center space-x-1.5 px-3 py-2 bg-gray-800 hover:bg-gray-700 text-white font-medium rounded-lg transition-colors"
            onClick={onNewFolder}
          >
            <FolderPlus className="w-4 h-4" />
            <span>Nouveau dossier</span>
          </button>
        </div>
      </div>
    </div>
  );
};
