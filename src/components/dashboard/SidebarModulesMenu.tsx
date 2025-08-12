'use client';

import { useState } from 'react';
import { ChevronDown, BookOpen, Building, User } from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';

interface SidebarModulesMenuProps {
  onModuleTypeSelect: (type: 'b2b' | 'b2c') => void;
  activeModuleType?: 'b2b' | 'b2c';
}

export default function SidebarModulesMenu({ onModuleTypeSelect, activeModuleType }: SidebarModulesMenuProps) {
  const [isOpen, setIsOpen] = useState(false);

  const toggleDropdown = () => {
    setIsOpen(!isOpen);
  };

  const handleModuleSelect = (type: 'b2b' | 'b2c') => {
    onModuleTypeSelect(type);
    setIsOpen(false);
  };

  return (
    <div className="relative">
      <button
        onClick={toggleDropdown}
        className={`w-full flex items-center justify-between px-4 py-3 text-sm font-medium rounded-lg transition-colors ${
          activeModuleType 
            ? 'bg-yellow-500/10 text-yellow-400' 
            : 'text-gray-300 hover:bg-gray-800/50 hover:text-white'
        }`}
      >
        <div className="flex items-center">
          <BookOpen className="w-5 h-5 mr-3" />
          <span>Modules</span>
        </div>
        <ChevronDown 
          className={`w-4 h-4 transition-transform duration-200 ${isOpen ? 'rotate-180' : ''}`} 
        />
      </button>

      <AnimatePresence>
        {isOpen && (
          <motion.div
            initial={{ opacity: 0, height: 0 }}
            animate={{ opacity: 1, height: 'auto' }}
            exit={{ opacity: 0, height: 0 }}
            transition={{ duration: 0.2 }}
            className="overflow-hidden"
          >
            <div className="ml-4 mt-1 space-y-1">
              <button
                onClick={() => handleModuleSelect('b2b')}
                className={`w-full flex items-center px-4 py-2 text-sm rounded-lg transition-colors ${
                  activeModuleType === 'b2b'
                    ? 'bg-yellow-500/10 text-yellow-400'
                    : 'text-gray-400 hover:bg-gray-800/50 hover:text-white'
                }`}
              >
                <Building className="w-4 h-4 mr-3" />
                <span>B2B</span>
              </button>
              
              <button
                onClick={() => handleModuleSelect('b2c')}
                className={`w-full flex items-center px-4 py-2 text-sm rounded-lg transition-colors ${
                  activeModuleType === 'b2c'
                    ? 'bg-yellow-500/10 text-yellow-400'
                    : 'text-gray-400 hover:bg-gray-800/50 hover:text-white'
                }`}
              >
                <User className="w-4 h-4 mr-3" />
                <span>B2C</span>
              </button>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}
