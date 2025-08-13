'use client';

import { Building, ChevronRight } from 'lucide-react';

interface SidebarB2BMenuProps {
  isActive: boolean;
  onClick: () => void;
  count?: number;
}

export default function SidebarB2BMenu({ isActive, onClick, count }: SidebarB2BMenuProps) {
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
      <div className="flex items-center">
        {count !== undefined && count > 0 && (
          <span className="bg-yellow-500 text-black text-xs font-bold px-1.5 py-0.5 rounded-full mr-2">
            {count}
          </span>
        )}
        <ChevronRight className="w-4 h-4" />
      </div>
    </button>
  );
}
