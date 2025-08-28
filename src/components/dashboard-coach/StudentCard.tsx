'use client';

import { motion } from 'framer-motion';
import { User, MapPin, Calendar, BookOpen, Star, Eye, Building, Users, Briefcase } from 'lucide-react';
import Image from 'next/image';
import { StudentData } from '@/lib/studentService';

interface StudentCardProps {
  student: StudentData;
  onView?: (student: StudentData) => void;
}

export default function StudentCard({ student, onView }: StudentCardProps) {
  const isB2B = student.role === 'employee';
  const progress = student.progress?.overall || 0;
  const lastActivity = student.progress?.lastActivity || student.created_at;

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      whileHover={{ y: -4, scale: 1.02 }}
      className="bg-gray-800/50 backdrop-blur-sm rounded-xl border border-gray-700/50 hover:border-yellow-400/30 transition-all group overflow-hidden"
    >
      {/* Header with Photo and Actions */}
      <div className="p-6 border-b border-gray-700/50">
        <div className="flex items-start justify-between mb-4">
          <div className="flex items-center space-x-4">
            <div className="relative">
              <div className="w-16 h-16 rounded-full bg-gradient-to-br from-purple-500 to-purple-600 flex items-center justify-center overflow-hidden">
                {student.company_logo ? (
                  <Image 
                    src={student.company_logo} 
                    alt={student.name} 
                    width={64} 
                    height={64}
                    className="w-full h-full object-cover"
                  />
                ) : (
                  <User className="w-8 h-8 text-white" />
                )}
              </div>
              <div className="absolute -bottom-1 -right-1 w-4 h-4 bg-green-400 rounded-full border-2 border-gray-800"></div>
            </div>
            <div>
              <h3 className="text-xl font-semibold text-white group-hover:text-yellow-400 transition-colors">
                {student.name}
              </h3>
              <div className="flex items-center space-x-4 text-sm text-gray-400">
                <div className="flex items-center space-x-1">
                  <Briefcase className="w-4 h-4" />
                  <span className={`px-2 py-1 rounded-full text-xs font-medium ${
                    isB2B 
                      ? 'bg-blue-500/20 text-blue-400 border border-blue-500/30' 
                      : 'bg-purple-500/20 text-purple-400 border border-purple-500/30'
                  }`}>
                    {isB2B ? 'B2B - Employé' : 'B2C - Individuel'}
                  </span>
                </div>
                <div className="flex items-center space-x-1">
                  <Star className="w-4 h-4 text-yellow-400" />
                  <span>Niveau {student.level}</span>
                </div>
              </div>
            </div>
          </div>
          
          {/* Action Button */}
          {onView && (
            <button
              onClick={() => onView(student)}
              className="w-8 h-8 bg-black/50 backdrop-blur-sm rounded-full flex items-center justify-center text-white hover:bg-yellow-500 transition-colors opacity-0 group-hover:opacity-100"
            >
              <Eye className="w-4 h-4" />
            </button>
          )}
        </div>

        {/* Company Info for B2B */}
        {isB2B && student.company_name && (
          <div className="mb-4 p-3 bg-blue-500/10 rounded-lg border border-blue-500/20">
            <div className="flex items-center space-x-2 mb-2">
              <Building className="w-4 h-4 text-blue-400" />
              <span className="text-sm font-medium text-blue-300">{student.company_name}</span>
            </div>
            {student.rh_user_name && (
              <div className="flex items-center space-x-2">
                <Users className="w-4 h-4 text-blue-400" />
                <span className="text-xs text-blue-400">RH: {student.rh_user_name}</span>
              </div>
            )}
          </div>
        )}

        {/* Stats */}
        <div className="flex items-center justify-between">
          <div className="flex items-center space-x-4">
            <div className="flex items-center space-x-2">
              <BookOpen className="w-4 h-4 text-purple-400" />
              <span className="text-sm text-gray-300">{student.modules.length} modules</span>
            </div>
            <div className="flex items-center space-x-2">
              <Calendar className="w-4 h-4 text-green-400" />
              <span className="text-sm text-gray-300">{student.vr_sessions} sessions VR</span>
            </div>
          </div>
          <div className="text-xs text-gray-500">
            Dernière activité: {new Date(lastActivity).toLocaleDateString('fr-FR')}
          </div>
        </div>
      </div>

      {/* Content */}
      <div className="p-6">
        {/* Progress */}
        <div className="mb-4">
          <div className="flex items-center justify-between mb-2">
            <h4 className="text-sm font-medium text-gray-300">Progression globale</h4>
            <span className="text-sm text-yellow-400 font-medium">{progress}%</span>
          </div>
          <div className="w-full bg-gray-700 rounded-full h-2">
            <div 
              className="bg-gradient-to-r from-yellow-400 to-yellow-500 h-2 rounded-full transition-all duration-300" 
              style={{ width: `${progress}%` }}
            ></div>
          </div>
        </div>

        {/* Modules */}
        <div>
          <h4 className="text-sm font-medium text-gray-300 mb-3">Modules suivis</h4>
          <div className="flex flex-wrap gap-2">
            {student.modules.slice(0, 3).map((module, index) => (
              <span
                key={module.id}
                className="px-2 py-1 bg-purple-500/20 text-purple-400 text-xs rounded-full border border-purple-500/30"
                title={module.description}
              >
                {module.title}
              </span>
            ))}
            {student.modules.length > 3 && (
              <span className="px-2 py-1 bg-gray-700/50 text-gray-400 text-xs rounded-full border border-gray-600/50">
                +{student.modules.length - 3}
              </span>
            )}
            {student.modules.length === 0 && (
              <span className="px-2 py-1 bg-gray-700/50 text-gray-400 text-xs rounded-full border border-gray-600/50">
                Aucun module assigné
              </span>
            )}
          </div>
        </div>

        {/* Footer */}
        <div className="flex items-center justify-between pt-4 mt-4 border-t border-gray-700/50">
          <div className="text-xs text-gray-500">
            Inscrit le {new Date(student.created_at).toLocaleDateString('fr-FR')}
          </div>
          <div className="flex items-center space-x-2">
            <div className="w-2 h-2 bg-green-400 rounded-full"></div>
            <span className="text-xs text-green-400 font-medium">Actif</span>
          </div>
        </div>
      </div>
    </motion.div>
  );
}
