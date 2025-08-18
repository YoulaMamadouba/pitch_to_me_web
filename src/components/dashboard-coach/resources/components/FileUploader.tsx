'use client';

import { useState, useRef, useCallback } from 'react';
import { Upload, UploadCloud, X, File, FileText, Image as ImageIcon, Video, FileType2 } from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';

type ResourceType = 'document' | 'video' | 'image' | 'link' | 'folder' | 'pdf' | 'audio' | 'archive' | 'code' | 'youtube';

interface FileUploaderProps {
  onUpload: (files: File[]) => void;
  onClose: () => void;
  currentFolder?: string;
}

interface UploadingFile {
  file: File;
  progress: number;
  status: 'uploading' | 'success' | 'error';
  error?: string;
}

export const FileUploader = ({ onUpload, onClose, currentFolder }: FileUploaderProps) => {
  const [isDragOver, setIsDragOver] = useState(false);
  const [uploadingFiles, setUploadingFiles] = useState<UploadingFile[]>([]);
  const fileInputRef = useRef<HTMLInputElement>(null);

  const getFileType = (file: File): ResourceType => {
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

  const getFileIcon = (type: ResourceType) => {
    switch (type) {
      case 'pdf': return <FileType2 className="w-4 h-4" />;
      case 'image': return <ImageIcon className="w-4 h-4" />;
      case 'video': return <Video className="w-4 h-4" />;
      case 'document': return <FileText className="w-4 h-4" />;
      default: return <File className="w-4 h-4" />;
    }
  };

  const handleFiles = useCallback((files: FileList | File[]) => {
    const fileArray = Array.from(files);
    const newUploadingFiles: UploadingFile[] = fileArray.map(file => ({
      file,
      progress: 0,
      status: 'uploading'
    }));

    setUploadingFiles(prev => [...prev, ...newUploadingFiles]);

    // Simuler l'upload progressif
    newUploadingFiles.forEach((uploadingFile, index) => {
      const interval = setInterval(() => {
        setUploadingFiles(prev => 
          prev.map((uf, i) => {
            if (uf.file === uploadingFile.file) {
              const newProgress = uf.progress + Math.random() * 20;
              if (newProgress >= 100) {
                clearInterval(interval);
                return { ...uf, progress: 100, status: 'success' as const };
              }
              return { ...uf, progress: newProgress };
            }
            return uf;
          })
        );
      }, 200);
    });

    // Appeler la fonction d'upload après un délai
    setTimeout(() => {
      onUpload(fileArray);
    }, 2000);
  }, [onUpload]);

  const handleDragOver = useCallback((e: React.DragEvent) => {
    e.preventDefault();
    setIsDragOver(true);
  }, []);

  const handleDragLeave = useCallback((e: React.DragEvent) => {
    e.preventDefault();
    setIsDragOver(false);
  }, []);

  const handleDrop = useCallback((e: React.DragEvent) => {
    e.preventDefault();
    setIsDragOver(false);
    const files = e.dataTransfer.files;
    if (files.length > 0) {
      handleFiles(files);
    }
  }, [handleFiles]);

  const handleFileSelect = useCallback((e: React.ChangeEvent<HTMLInputElement>) => {
    const files = e.target.files;
    if (files && files.length > 0) {
      handleFiles(files);
    }
  }, [handleFiles]);

  const removeFile = (fileToRemove: File) => {
    setUploadingFiles(prev => prev.filter(uf => uf.file !== fileToRemove));
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
        className="bg-gray-800 rounded-xl w-full max-w-2xl p-6 relative"
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
        
        <div className="text-center mb-6">
          <div className="w-16 h-16 bg-yellow-500/10 rounded-full flex items-center justify-center mx-auto mb-4">
            <UploadCloud className="w-8 h-8 text-yellow-400" />
          </div>
          <h3 className="text-xl font-bold text-white mb-1">Importer des fichiers</h3>
          <p className="text-gray-400 text-sm">
            {currentFolder ? `Dossier de destination: ${currentFolder}` : 'Glissez et déposez vos fichiers ici'}
          </p>
        </div>
        
        <div 
          className={`border-2 border-dashed rounded-xl p-8 text-center mb-6 cursor-pointer transition-colors ${
            isDragOver 
              ? 'border-yellow-500 bg-yellow-500/10' 
              : 'border-gray-700 hover:border-yellow-500/50'
          }`}
          onDragOver={handleDragOver}
          onDragLeave={handleDragLeave}
          onDrop={handleDrop}
          onClick={() => fileInputRef.current?.click()}
        >
          <div className="flex flex-col items-center justify-center space-y-2">
            <Upload className="w-10 h-10 text-gray-500" />
            <p className="text-sm text-gray-400">Glissez vos fichiers ici</p>
            <p className="text-xs text-gray-500">ou cliquez pour parcourir</p>
          </div>
          <input 
            ref={fileInputRef}
            type="file" 
            className="hidden" 
            multiple 
            onChange={handleFileSelect}
            accept=".pdf,.doc,.docx,.txt,.jpg,.jpeg,.png,.gif,.mp4,.avi,.mov,.mp3,.wav,.zip,.rar,.js,.jsx,.ts,.tsx,.html,.css,.scss,.json"
          />
        </div>

        {/* Liste des fichiers en cours d'upload */}
        <AnimatePresence>
          {uploadingFiles.length > 0 && (
            <motion.div 
              className="space-y-2 max-h-64 overflow-y-auto"
              initial={{ opacity: 0, height: 0 }}
              animate={{ opacity: 1, height: 'auto' }}
              exit={{ opacity: 0, height: 0 }}
            >
              <h4 className="text-sm font-medium text-white mb-3">Fichiers en cours d'upload</h4>
              {uploadingFiles.map((uploadingFile, index) => (
                <motion.div 
                  key={`${uploadingFile.file.name}-${index}`}
                  className="flex items-center space-x-3 p-3 bg-gray-700/50 rounded-lg"
                  initial={{ opacity: 0, x: -20 }}
                  animate={{ opacity: 1, x: 0 }}
                  exit={{ opacity: 0, x: 20 }}
                >
                  <div className="flex-shrink-0">
                    {getFileIcon(getFileType(uploadingFile.file))}
                  </div>
                  <div className="flex-1 min-w-0">
                    <p className="text-sm text-white truncate">{uploadingFile.file.name}</p>
                    <div className="w-full bg-gray-600 rounded-full h-2 mt-1">
                      <div 
                        className={`h-2 rounded-full transition-all duration-300 ${
                          uploadingFile.status === 'success' 
                            ? 'bg-green-500' 
                            : uploadingFile.status === 'error'
                            ? 'bg-red-500'
                            : 'bg-yellow-500'
                        }`}
                        style={{ width: `${uploadingFile.progress}%` }}
                      />
                    </div>
                  </div>
                  <button 
                    className="text-gray-400 hover:text-red-400"
                    onClick={() => removeFile(uploadingFile.file)}
                  >
                    <X className="w-4 h-4" />
                  </button>
                </motion.div>
              ))}
            </motion.div>
          )}
        </AnimatePresence>
        
        <div className="flex justify-end space-x-3 mt-6">
          <button 
            className="px-4 py-2 bg-transparent border border-gray-700 text-white rounded-lg hover:bg-gray-700/50 transition-colors"
            onClick={onClose}
          >
            Annuler
          </button>
          <button 
            className="px-4 py-2 bg-yellow-500 hover:bg-yellow-600 text-black font-medium rounded-lg transition-colors"
            onClick={() => fileInputRef.current?.click()}
          >
            Sélectionner des fichiers
          </button>
        </div>
      </motion.div>
    </motion.div>
  );
};
