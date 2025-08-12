'use client';

import { Building, ChevronRight } from 'lucide-react';

interface SidebarB2BMenuProps {
  isActive: boolean;
  onClick: () => void;
}

export default function SidebarB2BMenu({ isActive, onClick }: SidebarB2BMenuProps) {
  return (
    <button
      onClick={onClick}
      className={`w-full flex items-center justify-between px-4 py-3 text-sm font-medium rounded-lg transition-colors ${
        isActive 
          ? 'bg-yellow-500/10 text-yellow-400' 
          : 'text-gray-300 hover:bg-gray-800/50 hover:text-white'
      }`}
    >
      <div className="flex items-center">
        <Building className="w-5 h-5 mr-3" />
        <span>Entreprises</span>
      </div>
      <ChevronRight className="w-4 h-4" />
    </button>
  );
}
