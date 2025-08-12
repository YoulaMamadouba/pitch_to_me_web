'use client';

import { motion } from 'framer-motion';
import { Building, Users, Mail, Phone, Eye, Edit, Trash2 } from 'lucide-react';
import Image from 'next/image';

export interface Company {
  id: string;
  name: string;
  logo: string;
  industry: string;
  employeeCount: number;
  hrName: string;
  hrEmail: string;
  hrPhone: string;
  modules: string[];
  createdAt: string;
}

interface CompanyCardProps {
  company: Company;
  onView?: (company: Company) => void;
  onEdit?: (company: Company) => void;
  onDelete?: (companyId: string) => void;
}

export default function CompanyCard({ company, onView, onEdit, onDelete }: CompanyCardProps) {
  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      whileHover={{ y: -4, scale: 1.02 }}
      className="bg-gray-800/50 backdrop-blur-sm rounded-xl border border-gray-700/50 hover:border-yellow-400/30 transition-all group overflow-hidden"
    >
      {/* Header with Logo and Actions */}
      <div className="p-6 border-b border-gray-700/50">
        <div className="flex items-start justify-between mb-4">
          <div className="flex items-center space-x-4">
            <div className="relative">
              <div className="w-16 h-16 rounded-xl bg-gradient-to-br from-blue-500 to-blue-600 flex items-center justify-center overflow-hidden">
                {company.logo ? (
                  <Image 
                    src={company.logo} 
                    alt={company.name} 
                    width={64} 
                    height={64}
                    className="w-full h-full object-cover"
                  />
                ) : (
                  <Building className="w-8 h-8 text-white" />
                )}
              </div>
            </div>
            <div>
              <h3 className="text-xl font-semibold text-white group-hover:text-yellow-400 transition-colors">
                {company.name}
              </h3>
              <p className="text-gray-400 text-sm">{company.industry}</p>
            </div>
          </div>
          
          {/* Action Buttons */}
          <div className="flex space-x-2 opacity-0 group-hover:opacity-100 transition-opacity">
            {onView && (
              <button
                onClick={() => onView(company)}
                className="w-8 h-8 bg-black/50 backdrop-blur-sm rounded-full flex items-center justify-center text-white hover:bg-yellow-500 transition-colors"
              >
                <Eye className="w-4 h-4" />
              </button>
            )}
            {onEdit && (
              <button
                onClick={() => onEdit(company)}
                className="w-8 h-8 bg-black/50 backdrop-blur-sm rounded-full flex items-center justify-center text-white hover:bg-blue-500 transition-colors"
              >
                <Edit className="w-4 h-4" />
              </button>
            )}
            {onDelete && (
              <button
                onClick={() => onDelete(company.id)}
                className="w-8 h-8 bg-black/50 backdrop-blur-sm rounded-full flex items-center justify-center text-white hover:bg-red-500 transition-colors"
              >
                <Trash2 className="w-4 h-4" />
              </button>
            )}
          </div>
        </div>

        {/* Stats */}
        <div className="flex items-center space-x-6">
          <div className="flex items-center space-x-2">
            <Users className="w-4 h-4 text-cyan-400" />
            <span className="text-sm text-gray-300">{company.employeeCount} employés</span>
          </div>
          <div className="flex items-center space-x-2">
            <div className="w-2 h-2 bg-green-400 rounded-full"></div>
            <span className="text-sm text-gray-300">{company.modules.length} modules</span>
          </div>
        </div>
      </div>

      {/* Content */}
      <div className="p-6">
        {/* HR Contact Info */}
        <div className="mb-4">
          <h4 className="text-sm font-medium text-gray-300 mb-3">Contact RH</h4>
          <div className="space-y-2">
            <div className="flex items-center space-x-2">
              <div className="w-8 h-8 bg-gray-700/50 rounded-full flex items-center justify-center">
                <span className="text-xs font-medium text-white">
                  {company.hrName.split(' ').map(n => n[0]).join('')}
                </span>
              </div>
              <div>
                <p className="text-white text-sm font-medium">{company.hrName}</p>
                <div className="flex items-center space-x-4 text-xs text-gray-400">
                  <div className="flex items-center space-x-1">
                    <Mail className="w-3 h-3" />
                    <span>{company.hrEmail}</span>
                  </div>
                  <div className="flex items-center space-x-1">
                    <Phone className="w-3 h-3" />
                    <span>{company.hrPhone}</span>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Modules */}
        <div>
          <h4 className="text-sm font-medium text-gray-300 mb-3">Modules suivis</h4>
          <div className="flex flex-wrap gap-2">
            {company.modules.slice(0, 3).map((module, index) => (
              <span
                key={index}
                className="px-2 py-1 bg-yellow-500/20 text-yellow-400 text-xs rounded-full border border-yellow-500/30"
              >
                {module}
              </span>
            ))}
            {company.modules.length > 3 && (
              <span className="px-2 py-1 bg-gray-700/50 text-gray-400 text-xs rounded-full border border-gray-600/50">
                +{company.modules.length - 3}
              </span>
            )}
          </div>
        </div>

        {/* Footer */}
        <div className="flex items-center justify-between pt-4 mt-4 border-t border-gray-700/50">
          <div className="text-xs text-gray-500">
            Créée le {new Date(company.createdAt).toLocaleDateString('fr-FR')}
          </div>
          <div className="flex items-center space-x-2">
            <div className="w-2 h-2 bg-green-400 rounded-full"></div>
            <span className="text-xs text-green-400 font-medium">Active</span>
          </div>
        </div>
      </div>
    </motion.div>
  );
}
