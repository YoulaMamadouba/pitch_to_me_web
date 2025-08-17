'use client';

import React, { useState, useRef } from 'react';
import { motion } from 'framer-motion';
import { ArrowLeft, Upload, FileText, Download, CheckCircle, AlertCircle, Save } from 'lucide-react';
import { EmployeeCardData } from './EmployeeCard';

interface FileUploadFormProps {
  onSubmit: (employees: EmployeeCardData[]) => void;
  onBack: () => void;
  isSubmitting: boolean;
}

interface ParsedEmployee {
  name: string;
  email: string;
  position: string;
  phone: string;
  offerType: string;
}

export default function FileUploadForm({ onSubmit, onBack, isSubmitting }: FileUploadFormProps) {
  const [file, setFile] = useState<File | null>(null);
  const [parsedEmployees, setParsedEmployees] = useState<ParsedEmployee[]>([]);
  const [isProcessing, setIsProcessing] = useState(false);
  const [error, setError] = useState<string>('');
  const fileInputRef = useRef<HTMLInputElement>(null);

  const offerTypeMapping: { [key: string]: string } = {
    'commercial': 'commercial',
    'marketing': 'marketing',
    'finance': 'finance',
    'rh': 'rh',
    'ressources humaines': 'rh',
    'international': 'international',
    'management': 'management',
    'gestion': 'management'
  };

  const handleFileSelect = (event: React.ChangeEvent<HTMLInputElement>) => {
    const selectedFile = event.target.files?.[0];
    if (selectedFile) {
      setFile(selectedFile);
      setError('');
      processFile(selectedFile);
    }
  };

  const processFile = async (selectedFile: File) => {
    setIsProcessing(true);
    setError('');

    try {
      if (selectedFile.type === 'text/csv' || selectedFile.name.endsWith('.csv')) {
        await processCSV(selectedFile);
      } else if (selectedFile.type.includes('spreadsheet') || selectedFile.name.endsWith('.xlsx')) {
        await processExcel(selectedFile);
      } else {
        setError('Format de fichier non supporté. Utilisez CSV ou Excel.');
      }
    } catch (err) {
      setError('Erreur lors du traitement du fichier. Vérifiez le format.');
      console.error('Erreur de traitement:', err);
    } finally {
      setIsProcessing(false);
    }
  };

  const processCSV = async (file: File) => {
    const text = await file.text();
    const lines = text.split('\n');
    const headers = lines[0].split(',').map(h => h.trim().toLowerCase());
    
    const employees: ParsedEmployee[] = [];
    
    for (let i = 1; i < lines.length; i++) {
      if (lines[i].trim()) {
        const values = lines[i].split(',').map(v => v.trim());
        const employee: ParsedEmployee = {
          name: values[headers.indexOf('nom')] || values[headers.indexOf('name')] || '',
          email: values[headers.indexOf('email')] || '',
          position: values[headers.indexOf('poste')] || values[headers.indexOf('position')] || '',
          phone: values[headers.indexOf('telephone')] || values[headers.indexOf('phone')] || '',
          offerType: values[headers.indexOf('type')] || values[headers.indexOf('offertype')] || 'commercial'
        };
        
        if (employee.name && employee.email) {
          employees.push(employee);
        }
      }
    }
    
    setParsedEmployees(employees);
  };

  const processExcel = async (file: File) => {
    // Simulation du traitement Excel - dans un vrai projet, utilisez une librairie comme xlsx
    setError('Traitement Excel en cours de développement. Utilisez un fichier CSV pour le moment.');
    
    // Pour la démonstration, créons des données fictives
    const mockEmployees: ParsedEmployee[] = [
      {
        name: 'Jean Dupont',
        email: 'jean.dupont@entreprise.com',
        position: 'Commercial Senior',
        phone: '+33 1 23 45 67 89',
        offerType: 'commercial'
      },
      {
        name: 'Marie Martin',
        email: 'marie.martin@entreprise.com',
        position: 'Marketing Manager',
        phone: '+33 1 98 76 54 32',
        offerType: 'marketing'
      }
    ];
    
    setParsedEmployees(mockEmployees);
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (parsedEmployees.length === 0) {
      setError('Aucun employé valide trouvé dans le fichier');
      return;
    }

    // Conversion en objets EmployeeCardData
    const newEmployees: EmployeeCardData[] = parsedEmployees.map((emp, index) => ({
      id: Date.now().toString() + index,
      name: emp.name,
      email: emp.email,
      position: emp.position,
      phone: emp.phone,
      offerType: (offerTypeMapping[emp.offerType.toLowerCase()] || 'commercial') as any,
      currentModule: 'Aucun module assigné',
      estimatedDuration: 0,
      photo: `https://images.unsplash.com/photo-${1500000000000 + index}?w=150&h=150&fit=crop&crop=face`,
      progress: 0,
      status: 'active' as const
    }));

    await onSubmit(newEmployees);
  };

  const downloadTemplate = () => {
    const csvContent = `Nom,Email,Poste,Téléphone,Type d'offre
Marie Dupont,marie.dupont@entreprise.com,Responsable Commercial,+33 1 23 45 67 89,commercial
Pierre Martin,pierre.martin@entreprise.com,Chef de Projet Marketing,+33 1 98 76 54 32,marketing
Sophie Bernard,sophie.bernard@entreprise.com,Analyste Financier,+33 1 45 67 89 12,finance`;

    const blob = new Blob([csvContent], { type: 'text/csv' });
    const url = window.URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = 'template_employes.csv';
    a.click();
    window.URL.revokeObjectURL(url);
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
          <h3 className="text-lg font-semibold text-white">Import de fichier</h3>
          <p className="text-sm text-gray-400">
            {parsedEmployees.length > 0 ? `${parsedEmployees.length} employé(s) détecté(s)` : 'Aucun fichier sélectionné'}
          </p>
        </div>
      </div>

      <form onSubmit={handleSubmit} className="space-y-6">
        {/* File Upload Area */}
        <div className="border-2 border-dashed border-gray-600/50 rounded-xl p-8 text-center">
          <input
            ref={fileInputRef}
            type="file"
            accept=".csv,.xlsx,.xls"
            onChange={handleFileSelect}
            className="hidden"
          />
          
          {!file ? (
            <div className="space-y-4">
              <div className="w-16 h-16 bg-cyan-500/20 rounded-full flex items-center justify-center mx-auto">
                <Upload className="w-8 h-8 text-cyan-400" />
              </div>
              <div>
                <h4 className="text-lg font-medium text-white mb-2">Glissez-déposez votre fichier</h4>
                <p className="text-gray-400 mb-4">
                  ou cliquez pour sélectionner un fichier CSV ou Excel
                </p>
                <button
                  type="button"
                  onClick={() => fileInputRef.current?.click()}
                  className="px-6 py-3 bg-cyan-500/20 text-cyan-400 rounded-lg hover:bg-cyan-500/30 transition-colors"
                >
                  Sélectionner un fichier
                </button>
              </div>
              <div className="text-sm text-gray-500">
                Formats acceptés: CSV, Excel (.xlsx, .xls)
              </div>
            </div>
          ) : (
            <div className="space-y-4">
              <div className="w-16 h-16 bg-green-500/20 rounded-full flex items-center justify-center mx-auto">
                <FileText className="w-8 h-8 text-green-400" />
              </div>
              <div>
                <h4 className="text-lg font-medium text-white mb-2">{file.name}</h4>
                <p className="text-gray-400">
                  {(file.size / 1024).toFixed(1)} KB • {parsedEmployees.length} employé(s) détecté(s)
                </p>
              </div>
              <button
                type="button"
                onClick={() => {
                  setFile(null);
                  setParsedEmployees([]);
                  setError('');
                }}
                className="px-4 py-2 bg-gray-700/50 text-gray-300 rounded-lg hover:bg-gray-600/50 transition-colors"
              >
                Changer de fichier
              </button>
            </div>
          )}
        </div>

        {/* Error Message */}
        {error && (
          <motion.div
            initial={{ opacity: 0, y: -10 }}
            animate={{ opacity: 1, y: 0 }}
            className="flex items-center space-x-3 p-4 bg-red-500/20 border border-red-500/30 rounded-lg"
          >
            <AlertCircle className="w-5 h-5 text-red-400" />
            <span className="text-red-400">{error}</span>
          </motion.div>
        )}

        {/* Processing Indicator */}
        {isProcessing && (
          <div className="flex items-center justify-center space-x-3 p-4 bg-blue-500/20 border border-blue-500/30 rounded-lg">
            <div className="w-5 h-5 border-2 border-blue-400 border-t-transparent rounded-full animate-spin"></div>
            <span className="text-blue-400">Traitement du fichier en cours...</span>
          </div>
        )}

        {/* Parsed Employees Preview */}
        {parsedEmployees.length > 0 && !isProcessing && (
          <div className="space-y-4">
            <div className="flex items-center justify-between">
              <h4 className="text-lg font-medium text-white">Aperçu des employés détectés</h4>
              <div className="flex items-center space-x-2 text-green-400">
                <CheckCircle className="w-5 h-5" />
                <span className="text-sm">{parsedEmployees.length} employé(s) valide(s)</span>
              </div>
            </div>
            
            <div className="max-h-64 overflow-y-auto space-y-2">
              {parsedEmployees.map((employee, index) => (
                <div
                  key={index}
                  className="flex items-center justify-between p-3 bg-gray-700/30 rounded-lg border border-gray-600/30"
                >
                  <div className="flex items-center space-x-3">
                    <div className="w-8 h-8 bg-cyan-500/20 rounded-full flex items-center justify-center">
                      <span className="text-sm font-medium text-cyan-400">{index + 1}</span>
                    </div>
                    <div>
                      <p className="text-white font-medium">{employee.name}</p>
                      <p className="text-sm text-gray-400">{employee.email}</p>
                    </div>
                  </div>
                  <div className="text-right">
                    <p className="text-sm text-white">{employee.position}</p>
                    <p className="text-xs text-gray-400">{employee.offerType}</p>
                  </div>
                </div>
              ))}
            </div>
          </div>
        )}

        {/* Template Download */}
        <div className="bg-gray-700/20 rounded-lg p-4 border border-gray-600/30">
          <div className="flex items-center justify-between">
            <div className="flex items-center space-x-3">
              <FileText className="w-5 h-5 text-cyan-400" />
              <div>
                <h4 className="text-sm font-medium text-white">Besoin d'un modèle ?</h4>
                <p className="text-xs text-gray-400">Téléchargez notre template CSV pour l'import</p>
              </div>
            </div>
            <button
              type="button"
              onClick={downloadTemplate}
              className="px-4 py-2 bg-cyan-500/20 text-cyan-400 text-sm font-medium rounded-lg hover:bg-cyan-500/30 transition-colors flex items-center space-x-2"
            >
              <Download className="w-4 h-4" />
              <span>Télécharger</span>
            </button>
          </div>
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
            disabled={isSubmitting || parsedEmployees.length === 0}
            className="px-6 py-3 bg-gradient-to-r from-cyan-400 to-blue-500 text-white font-semibold rounded-lg hover:shadow-lg transition-all flex items-center space-x-2 disabled:opacity-50 disabled:cursor-not-allowed"
          >
            {isSubmitting ? (
              <>
                <div className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin"></div>
                <span>Import en cours...</span>
              </>
            ) : (
              <>
                <Save className="w-4 h-4" />
                <span>Importer {parsedEmployees.length} employé(s)</span>
              </>
            )}
          </button>
        </div>
      </form>
    </div>
  );
}
