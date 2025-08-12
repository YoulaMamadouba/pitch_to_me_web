'use client';

import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { X, Users, Upload, FileText, UserPlus } from 'lucide-react';
import ManualEmployeeForm from './ManualEmployeeForm';
import FileUploadForm from './FileUploadForm';
import { Employee } from './EmployeeCard';

interface AddEmployeeModalProps {
  isOpen: boolean;
  onClose: () => void;
  onSubmit: (employees: Employee[]) => void;
}

type FormMode = 'selection' | 'manual' | 'file';

export default function AddEmployeeModal({ isOpen, onClose, onSubmit }: AddEmployeeModalProps) {
  const [mode, setMode] = useState<FormMode>('selection');
  const [isSubmitting, setIsSubmitting] = useState(false);

  const handleSubmit = async (employees: Employee[]) => {
    setIsSubmitting(true);
    try {
      await onSubmit(employees);
      setMode('selection');
    } catch (error) {
      console.error('Erreur lors de l\'ajout des employés:', error);
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleBack = () => {
    setMode('selection');
  };

  if (!isOpen) return null;

  return (
    <AnimatePresence>
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        exit={{ opacity: 0 }}
        className="fixed inset-0 bg-black bg-opacity-50 backdrop-blur-sm z-50 flex items-center justify-center p-4"
        onClick={onClose}
      >
        <motion.div
          initial={{ scale: 0.9, opacity: 0 }}
          animate={{ scale: 1, opacity: 1 }}
          exit={{ scale: 0.9, opacity: 0 }}
          className="bg-gray-800/95 backdrop-blur-sm rounded-xl border border-gray-700/50 w-full max-w-4xl max-h-[90vh] overflow-y-auto"
          onClick={(e) => e.stopPropagation()}
        >
          {/* Header */}
          <div className="flex items-center justify-between p-6 border-b border-gray-700/50">
            <div className="flex items-center space-x-3">
              <div className="w-10 h-10 bg-cyan-500/20 rounded-lg flex items-center justify-center">
                <Users className="w-5 h-5 text-cyan-400" />
              </div>
              <div>
                <h2 className="text-xl font-semibold text-white">
                  {mode === 'selection' && 'Ajouter des employés'}
                  {mode === 'manual' && 'Inscription manuelle'}
                  {mode === 'file' && 'Import de fichier'}
                </h2>
                <p className="text-sm text-gray-400">
                  {mode === 'selection' && 'Choisissez votre méthode d\'ajout'}
                  {mode === 'manual' && 'Ajoutez vos employés un par un'}
                  {mode === 'file' && 'Importez une liste d\'employés depuis un fichier'}
                </p>
              </div>
            </div>
            <button
              onClick={onClose}
              className="w-8 h-8 bg-gray-700/50 rounded-lg flex items-center justify-center text-gray-400 hover:text-white hover:bg-gray-700 transition-all"
            >
              <X className="w-5 h-5" />
            </button>
          </div>

          {/* Content */}
          <div className="p-6">
            {mode === 'selection' && (
              <div className="space-y-6">
                <div className="text-center mb-8">
                  <h3 className="text-lg font-medium text-white mb-2">
                    Comment souhaitez-vous ajouter vos employés ?
                  </h3>
                  <p className="text-gray-400">
                    Choisissez la méthode qui vous convient le mieux
                  </p>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  {/* Manual Option */}
                  <motion.button
                    whileHover={{ scale: 1.02 }}
                    whileTap={{ scale: 0.98 }}
                    onClick={() => setMode('manual')}
                    className="p-6 bg-gray-700/30 rounded-xl border border-gray-600/50 hover:border-cyan-400/30 transition-all group text-left"
                  >
                    <div className="flex items-center space-x-4 mb-4">
                      <div className="w-12 h-12 bg-cyan-500/20 rounded-lg flex items-center justify-center group-hover:bg-cyan-500/30 transition-colors">
                        <UserPlus className="w-6 h-6 text-cyan-400" />
                      </div>
                      <div>
                        <h4 className="text-lg font-semibold text-white group-hover:text-cyan-400 transition-colors">
                          Inscription manuelle
                        </h4>
                        <p className="text-sm text-gray-400">Ajoutez vos employés un par un</p>
                      </div>
                    </div>
                    <ul className="text-sm text-gray-300 space-y-1">
                      <li>• Contrôle total sur chaque employé</li>
                      <li>• Validation en temps réel</li>
                      <li>• Idéal pour de petits groupes</li>
                    </ul>
                  </motion.button>

                  {/* File Upload Option */}
                  <motion.button
                    whileHover={{ scale: 1.02 }}
                    whileTap={{ scale: 0.98 }}
                    onClick={() => setMode('file')}
                    className="p-6 bg-gray-700/30 rounded-xl border border-gray-600/50 hover:border-cyan-400/30 transition-all group text-left"
                  >
                    <div className="flex items-center space-x-4 mb-4">
                      <div className="w-12 h-12 bg-purple-500/20 rounded-lg flex items-center justify-center group-hover:bg-purple-500/30 transition-colors">
                        <Upload className="w-6 h-6 text-purple-400" />
                      </div>
                      <div>
                        <h4 className="text-lg font-semibold text-white group-hover:text-purple-400 transition-colors">
                          Import de fichier
                        </h4>
                        <p className="text-sm text-gray-400">Importez depuis Excel ou CSV</p>
                      </div>
                    </div>
                    <ul className="text-sm text-gray-300 space-y-1">
                      <li>• Import en masse</li>
                      <li>• Formats Excel et CSV</li>
                      <li>• Idéal pour de gros volumes</li>
                    </ul>
                  </motion.button>
                </div>

                {/* Template Download */}
                <div className="bg-gray-700/20 rounded-lg p-4 border border-gray-600/30">
                  <div className="flex items-center justify-between">
                    <div className="flex items-center space-x-3">
                      <FileText className="w-5 h-5 text-cyan-400" />
                      <div>
                        <h4 className="text-sm font-medium text-white">Besoin d'un modèle ?</h4>
                        <p className="text-xs text-gray-400">Téléchargez notre template Excel pour l'import</p>
                      </div>
                    </div>
                    <button className="px-4 py-2 bg-cyan-500/20 text-cyan-400 text-sm font-medium rounded-lg hover:bg-cyan-500/30 transition-colors">
                      Télécharger
                    </button>
                  </div>
                </div>
              </div>
            )}

            {mode === 'manual' && (
              <ManualEmployeeForm
                onSubmit={handleSubmit}
                onBack={handleBack}
                isSubmitting={isSubmitting}
              />
            )}

            {mode === 'file' && (
              <FileUploadForm
                onSubmit={handleSubmit}
                onBack={handleBack}
                isSubmitting={isSubmitting}
              />
            )}
          </div>
        </motion.div>
      </motion.div>
    </AnimatePresence>
  );
}
