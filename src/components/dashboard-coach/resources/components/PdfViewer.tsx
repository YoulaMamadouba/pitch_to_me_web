'use client';

import { Download, FileType2 } from 'lucide-react';

interface PdfViewerProps {
  url: string;
  title?: string;
  className?: string;
}

export const PdfViewer = ({ url, title, className = '' }: PdfViewerProps) => {
  return (
    <div className={`w-full h-full ${className}`}>
      <object 
        data={`${url}#view=fitH`} 
        type="application/pdf"
        className="w-full h-full min-h-[500px] bg-gray-900 rounded-lg"
      >
        <div className="flex flex-col items-center justify-center p-8 text-center">
          <FileType2 className="w-12 h-12 text-red-500 mb-4" />
          <p className="text-gray-300 mb-4">
            Impossible d'afficher le PDF. Vous pouvez le télécharger ci-dessous.
          </p>
          <a 
            href={url} 
            target="_blank" 
            rel="noopener noreferrer"
            className="px-4 py-2 bg-blue-600 hover:bg-blue-700 text-white rounded-lg flex items-center transition-colors"
          >
            <Download className="w-4 h-4 mr-2" />
            Télécharger le PDF
          </a>
        </div>
      </object>
    </div>
  );
};
