'use client';

import { 
  FileText, 
  FileType2, 
  Video, 
  Image as ImageIcon, 
  Link2, 
  Folder,
  FileAudio,
  FileArchive,
  FileCode,
  File
} from 'lucide-react';

type ResourceType = 'document' | 'video' | 'image' | 'link' | 'folder' | 'pdf' | 'audio' | 'archive' | 'code' | 'youtube' | 'docx';

interface ResourceIconProps {
  type: ResourceType;
  className?: string;
}

export const ResourceIcon = ({ type, className = '' }: ResourceIconProps) => {
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
