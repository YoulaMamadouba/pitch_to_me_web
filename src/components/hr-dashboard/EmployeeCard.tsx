'use client';

import React from 'react';
import { motion } from 'framer-motion';
import { User, Mail, Phone, Clock, BookOpen, Eye, Edit, MoreVertical } from 'lucide-react';
import Image from 'next/image';

export interface Employee {
  id: string;
  name: string;
  email: string;
  position: string;
  phone: string;
  offerType: 'commercial' | 'marketing' | 'finance' | 'rh' | 'international' | 'management';
  currentModule: string;
  estimatedDuration: number;
  photo: string;
  progress: number;
  status: 'active' | 'inactive' | 'completed';
}

interface EmployeeCardProps {
  employee: Employee;
  onView?: (employee: Employee) => void;
  onEdit?: (employee: Employee) => void;
}

const offerTypeColors = {
  commercial: 'from-blue-500 to-blue-600',
  marketing: 'from-purple-500 to-purple-600',
  finance: 'from-green-500 to-green-600',
  rh: 'from-pink-500 to-pink-600',
  international: 'from-orange-500 to-orange-600',
  management: 'from-indigo-500 to-indigo-600'
};

const offerTypeLabels = {
  commercial: 'Commercial',
  marketing: 'Marketing',
  finance: 'Finance',
  rh: 'Ressources Humaines',
  international: 'International',
  management: 'Management'
};

export default function EmployeeCard({ employee, onView, onEdit }: EmployeeCardProps) {
  const getProgressColor = (progress: number) => {
    if (progress >= 80) return 'from-green-400 to-green-500';
    if (progress >= 50) return 'from-yellow-400 to-yellow-500';
    return 'from-red-400 to-red-500';
  };

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'active': return 'bg-green-500';
      case 'inactive': return 'bg-gray-500';
      case 'completed': return 'bg-blue-500';
      default: return 'bg-gray-500';
    }
  };

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      whileHover={{ y: -4, scale: 1.02 }}
      className="bg-gray-800/50 backdrop-blur-sm rounded-xl border border-gray-700/50 hover:border-cyan-400/30 transition-all group overflow-hidden"
    >
      {/* Header with Photo and Actions */}
      <div className="p-6 border-b border-gray-700/50">
        <div className="flex items-start justify-between mb-4">
          <div className="flex items-center space-x-4">
            <div className="relative">
              <div className="w-16 h-16 rounded-full bg-gradient-to-br from-cyan-500 to-blue-600 flex items-center justify-center overflow-hidden">
                {employee.photo ? (
                  <Image 
                    src={employee.photo} 
                    alt={employee.name} 
                    width={64} 
                    height={64}
                    className="w-full h-full object-cover"
                  />
                ) : (
                  <User className="w-8 h-8 text-white" />
                )}
              </div>
              <div className={`absolute -bottom-1 -right-1 w-4 h-4 ${getStatusColor(employee.status)} rounded-full border-2 border-gray-800`}></div>
            </div>
            <div>
              <h3 className="text-xl font-semibold text-white group-hover:text-cyan-400 transition-colors">
                {employee.name}
              </h3>
              <p className="text-gray-400 text-sm">{employee.position}</p>
            </div>
          </div>
          
          {/* Action Buttons */}
          <div className="flex space-x-2 opacity-0 group-hover:opacity-100 transition-opacity">
            {onView && (
              <button
                onClick={() => onView(employee)}
                className="w-8 h-8 bg-black/50 backdrop-blur-sm rounded-full flex items-center justify-center text-white hover:bg-cyan-500 transition-colors"
              >
                <Eye className="w-4 h-4" />
              </button>
            )}
            {onEdit && (
              <button
                onClick={() => onEdit(employee)}
                className="w-8 h-8 bg-black/50 backdrop-blur-sm rounded-full flex items-center justify-center text-white hover:bg-blue-500 transition-colors"
              >
                <Edit className="w-4 h-4" />
              </button>
            )}
            <button className="w-8 h-8 bg-black/50 backdrop-blur-sm rounded-full flex items-center justify-center text-white hover:bg-gray-600 transition-colors">
              <MoreVertical className="w-4 h-4" />
            </button>
          </div>
        </div>

        {/* Offer Type Badge */}
        <div className="flex items-center justify-between">
          <span className={`px-3 py-1 bg-gradient-to-r ${offerTypeColors[employee.offerType]} text-white text-xs font-medium rounded-full`}>
            {offerTypeLabels[employee.offerType]}
          </span>
          <div className="text-xs text-gray-500">
            {employee.progress}% complété
          </div>
        </div>
      </div>

      {/* Content */}
      <div className="p-6">
        {/* Contact Info */}
        <div className="mb-4 space-y-2">
          <div className="flex items-center space-x-2 text-sm text-gray-300">
            <Mail className="w-4 h-4 text-gray-400" />
            <span>{employee.email}</span>
          </div>
          <div className="flex items-center space-x-2 text-sm text-gray-300">
            <Phone className="w-4 h-4 text-gray-400" />
            <span>{employee.phone}</span>
          </div>
        </div>

        {/* Current Module */}
        <div className="mb-4">
          <h4 className="text-sm font-medium text-gray-300 mb-2 flex items-center space-x-2">
            <BookOpen className="w-4 h-4" />
            <span>Module en cours</span>
          </h4>
          <p className="text-white text-sm font-medium">{employee.currentModule}</p>
          <div className="flex items-center space-x-2 mt-1">
            <Clock className="w-4 h-4 text-gray-400" />
            <span className="text-xs text-gray-400">{employee.estimatedDuration} min estimées</span>
          </div>
        </div>

        {/* Progress Bar */}
        <div className="mb-4">
          <div className="flex items-center justify-between mb-2">
            <span className="text-sm text-gray-300">Progression</span>
            <span className="text-sm font-medium text-cyan-400">{employee.progress}%</span>
          </div>
          <div className="w-full bg-gray-700 rounded-full h-2">
            <div 
              className={`bg-gradient-to-r ${getProgressColor(employee.progress)} h-2 rounded-full transition-all duration-300`}
              style={{ width: `${employee.progress}%` }}
            ></div>
          </div>
        </div>

        {/* Quick Actions */}
        <div className="flex space-x-2">
          <button className="flex-1 px-3 py-2 bg-cyan-500/20 text-cyan-400 text-xs font-medium rounded-lg hover:bg-cyan-500/30 transition-colors">
            Voir détails
          </button>
          <button className="flex-1 px-3 py-2 bg-gray-700/50 text-gray-300 text-xs font-medium rounded-lg hover:bg-gray-600/50 transition-colors">
            Contacter
          </button>
        </div>
      </div>
    </motion.div>
  );
}
