'use client';

import React, { useState } from 'react';
import { motion } from 'framer-motion';
import { ArrowLeft, Plus, Trash2, Save, User, Mail, Phone, Briefcase, Users } from 'lucide-react';
import { Employee } from './EmployeeCard';

interface ManualEmployeeFormProps {
  onSubmit: (employees: Employee[]) => void;
  onBack: () => void;
  isSubmitting: boolean;
}

interface EmployeeFormData {
  name: string;
  email: string;
  position: string;
  phone: string;
  offerType: 'commercial' | 'marketing' | 'finance' | 'rh' | 'international' | 'management';
}

export default function ManualEmployeeForm({ onSubmit, onBack, isSubmitting }: ManualEmployeeFormProps) {
  const [employees, setEmployees] = useState<EmployeeFormData[]>([
    { name: '', email: '', position: '', phone: '', offerType: 'commercial' }
  ]);

  const offerTypeOptions = [
    { value: 'commercial', label: 'Commercial' },
    { value: 'marketing', label: 'Marketing' },
    { value: 'finance', label: 'Finance' },
    { value: 'rh', label: 'Ressources Humaines' },
    { value: 'international', label: 'International' },
    { value: 'management', label: 'Management' }
  ];

  const handleInputChange = (index: number, field: keyof EmployeeFormData, value: string) => {
    const newEmployees = [...employees];
    newEmployees[index] = { ...newEmployees[index], [field]: value };
    setEmployees(newEmployees);
  };

  const addEmployee = () => {
    setEmployees([...employees, { name: '', email: '', position: '', phone: '', offerType: 'commercial' }]);
  };

  const removeEmployee = (index: number) => {
    if (employees.length > 1) {
      setEmployees(employees.filter((_, i) => i !== index));
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    // Validation
    const validEmployees = employees.filter(emp => 
      emp.name.trim() && emp.email.trim() && emp.position.trim() && emp.phone.trim()
    );

    if (validEmployees.length === 0) {
      alert('Veuillez remplir au moins un employé');
      return;
    }

    // Conversion en objets Employee
    const newEmployees: Employee[] = validEmployees.map((emp, index) => ({
      id: Date.now().toString() + index,
      name: emp.name.trim(),
      email: emp.email.trim(),
      position: emp.position.trim(),
      phone: emp.phone.trim(),
      offerType: emp.offerType,
      currentModule: 'Aucun module assigné',
      estimatedDuration: 0,
      photo: `https://images.unsplash.com/photo-${1500000000000 + index}?w=150&h=150&fit=crop&crop=face`,
      progress: 0,
      status: 'active' as const
    }));

    await onSubmit(newEmployees);
  };

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <button
          onClick={onBack}
          className="flex items-center space-x-2 text-gray-400 hover:text-white transition-colors"
        >
          <ArrowLeft className="w-5 h-5" />
          <span>Retour</span>
        </button>
        <div className="text-right">
          <h3 className="text-lg font-semibold text-white">Inscription manuelle</h3>
          <p className="text-sm text-gray-400">{employees.length} employé(s) à ajouter</p>
        </div>
      </div>

      <form onSubmit={handleSubmit} className="space-y-6">
        {/* Employees List */}
        <div className="space-y-4">
          {employees.map((employee, index) => (
            <motion.div
              key={index}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: index * 0.1 }}
              className="bg-gray-700/30 rounded-xl p-6 border border-gray-600/50"
            >
              <div className="flex items-center justify-between mb-4">
                <div className="flex items-center space-x-3">
                  <div className="w-8 h-8 bg-cyan-500/20 rounded-lg flex items-center justify-center">
                    <User className="w-4 h-4 text-cyan-400" />
                  </div>
                  <h4 className="text-white font-medium">Employé {index + 1}</h4>
                </div>
                {employees.length > 1 && (
                  <button
                    type="button"
                    onClick={() => removeEmployee(index)}
                    className="w-8 h-8 bg-red-500/20 rounded-lg flex items-center justify-center text-red-400 hover:bg-red-500/30 transition-colors"
                  >
                    <Trash2 className="w-4 h-4" />
                  </button>
                )}
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                {/* Name */}
                <div>
                  <label className="block text-sm font-medium text-gray-300 mb-2">
                    Nom complet *
                  </label>
                  <input
                    type="text"
                    value={employee.name}
                    onChange={(e) => handleInputChange(index, 'name', e.target.value)}
                    required
                    className="w-full px-4 py-3 bg-gray-700/50 border border-gray-600/50 rounded-lg text-white placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-cyan-500 focus:border-transparent"
                    placeholder="Ex: Marie Dupont"
                  />
                </div>

                {/* Email */}
                <div>
                  <label className="block text-sm font-medium text-gray-300 mb-2">
                    Email *
                  </label>
                  <div className="relative">
                    <Mail className="absolute left-3 top-1/2 transform -translate-y-1/2 w-4 h-4 text-gray-400" />
                    <input
                      type="email"
                      value={employee.email}
                      onChange={(e) => handleInputChange(index, 'email', e.target.value)}
                      required
                      className="w-full pl-10 pr-4 py-3 bg-gray-700/50 border border-gray-600/50 rounded-lg text-white placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-cyan-500 focus:border-transparent"
                      placeholder="marie.dupont@entreprise.com"
                    />
                  </div>
                </div>

                {/* Position */}
                <div>
                  <label className="block text-sm font-medium text-gray-300 mb-2">
                    Poste *
                  </label>
                  <div className="relative">
                    <Briefcase className="absolute left-3 top-1/2 transform -translate-y-1/2 w-4 h-4 text-gray-400" />
                    <input
                      type="text"
                      value={employee.position}
                      onChange={(e) => handleInputChange(index, 'position', e.target.value)}
                      required
                      className="w-full pl-10 pr-4 py-3 bg-gray-700/50 border border-gray-600/50 rounded-lg text-white placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-cyan-500 focus:border-transparent"
                      placeholder="Ex: Responsable Commercial"
                    />
                  </div>
                </div>

                {/* Phone */}
                <div>
                  <label className="block text-sm font-medium text-gray-300 mb-2">
                    Téléphone *
                  </label>
                  <div className="relative">
                    <Phone className="absolute left-3 top-1/2 transform -translate-y-1/2 w-4 h-4 text-gray-400" />
                    <input
                      type="tel"
                      value={employee.phone}
                      onChange={(e) => handleInputChange(index, 'phone', e.target.value)}
                      required
                      className="w-full pl-10 pr-4 py-3 bg-gray-700/50 border border-gray-600/50 rounded-lg text-white placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-cyan-500 focus:border-transparent"
                      placeholder="+33 1 23 45 67 89"
                    />
                  </div>
                </div>

                {/* Offer Type */}
                <div className="md:col-span-2">
                  <label className="block text-sm font-medium text-gray-300 mb-2">
                    Type d'offre *
                  </label>
                  <select
                    value={employee.offerType}
                    onChange={(e) => handleInputChange(index, 'offerType', e.target.value as any)}
                    required
                    className="w-full px-4 py-3 bg-gray-700/50 border border-gray-600/50 rounded-lg text-white focus:outline-none focus:ring-2 focus:ring-cyan-500 focus:border-transparent"
                  >
                    {offerTypeOptions.map(option => (
                      <option key={option.value} value={option.value}>
                        {option.label}
                      </option>
                    ))}
                  </select>
                </div>
              </div>
            </motion.div>
          ))}
        </div>

        {/* Add Employee Button */}
        <div className="text-center">
          <button
            type="button"
            onClick={addEmployee}
            className="inline-flex items-center space-x-2 px-6 py-3 bg-gray-700/50 border border-gray-600/50 rounded-lg text-white hover:bg-gray-600/50 transition-colors"
          >
            <Plus className="w-5 h-5" />
            <span>Ajouter un autre employé</span>
          </button>
        </div>

        {/* Actions */}
        <div className="flex items-center justify-end space-x-3 pt-6 border-t border-gray-700/50">
          <button
            type="button"
            onClick={onBack}
            className="px-6 py-3 border border-gray-600/50 text-gray-400 hover:text-white hover:bg-gray-700/50 rounded-lg transition-all"
          >
            Annuler
          </button>
          <button
            type="submit"
            disabled={isSubmitting}
            className="px-6 py-3 bg-gradient-to-r from-cyan-400 to-blue-500 text-white font-semibold rounded-lg hover:shadow-lg transition-all flex items-center space-x-2 disabled:opacity-50 disabled:cursor-not-allowed"
          >
            {isSubmitting ? (
              <>
                <div className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin"></div>
                <span>Ajout en cours...</span>
              </>
            ) : (
              <>
                <Save className="w-4 h-4" />
                <span>Ajouter {employees.length} employé(s)</span>
              </>
            )}
          </button>
        </div>
      </form>
    </div>
  );
}
