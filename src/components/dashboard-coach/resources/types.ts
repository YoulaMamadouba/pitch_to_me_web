export type ResourceType = 'document' | 'video' | 'image' | 'link' | 'folder' | 'pdf' | 'audio' | 'archive' | 'code' | 'youtube' | 'docx';

export interface ResourceBase {
  id: string;
  name: string;
  type: ResourceType;
  lastModified: Date;
  url: string;
  folderId?: string;
  description?: string;
  thumbnail?: string;
}

export interface FileResource extends ResourceBase {
  size: string;
  mimeType?: string;
}

export interface FolderResource extends ResourceBase {
  type: 'folder';
  items: string[];
  isExpanded?: boolean;
}

export type Resource = FileResource | FolderResource;

export interface ResourceViewerProps {
  resource: Resource;
  className?: string;
  onClose?: () => void;
}

export interface FileUpload {
  file: File;
  preview: string;
  type: ResourceType;
  progress?: number;
  error?: string;
}

export interface ResourceAction {
  id: string;
  label: string;
  icon: React.ReactNode;
  onClick: (resource: Resource) => void;
  variant?: 'default' | 'destructive' | 'outline' | 'ghost';
}

// Types pour la compatibilité avec l'ancien système
export interface Folder extends Omit<Resource, 'type' | 'size'> {
  type: 'folder';
  items: string[];
  isExpanded?: boolean;
  size?: never;
}
