// Composant principal
export { default as ResourcesView } from './ResourcesView';

// Composants
export { ResourceCard } from './components/ResourceCard';
export { ResourceIcon } from './components/ResourceIcon';
export { ResourceHeader } from './components/ResourceHeader';
export { ResourceViewer } from './components/ResourceViewer';
export { FileUploader } from './components/FileUploader';
export { NewFolderModal } from './components/NewFolderModal';
export { PdfViewer } from './components/PdfViewer';
export { VideoPlayer } from './components/VideoPlayer';

// Types
export type {
  Resource,
  ResourceType,
  Folder,
  FileResource,
  FolderResource,
  ResourceViewerProps,
  FileUpload,
  ResourceAction
} from './types';
