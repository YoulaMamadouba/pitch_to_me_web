'use client';

import React from 'react';
import { motion } from 'framer-motion';
import { Plus, Users } from 'lucide-react';

interface AddEmployeeButtonProps {
  onClick: () => void;
}

export default function AddEmployeeButton({ onClick }: AddEmployeeButtonProps) {
  return (
    <motion.button
      whileHover={{ scale: 1.05 }}
      whileTap={{ scale: 0.95 }}
      onClick={onClick}
      className="bg-gradient-to-r from-cyan-400 to-blue-500 text-white font-semibold px-6 py-3 rounded-lg hover:shadow-lg transition-all flex items-center space-x-2 group"
    >
      <div className="relative">
        <Plus className="w-5 h-5 group-hover:rotate-90 transition-transform duration-200" />
        <Users className="w-4 h-4 absolute -top-1 -right-1 opacity-75" />
      </div>
      <span>Ajouter des employés</span>
    </motion.button>
  );
}
