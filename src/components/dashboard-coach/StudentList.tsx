'use client';

import { motion } from 'framer-motion';
import { Users, BookOpen, Star, TrendingUp, MapPin, Building, RefreshCw, AlertCircle } from 'lucide-react';
import StudentCard from './StudentCard';
import { StudentData } from '@/lib/studentService';

interface StudentListProps {
  students: StudentData[];
  loading: boolean;
  error: string | null;
  onViewStudent: (student: StudentData) => void;
  onRefresh: () => Promise<void>;
}

export default function StudentList({ students, loading, error, onViewStudent, onRefresh }: StudentListProps) {
  const b2bStudents = students.filter(s => s.role === 'employee');
  const b2cStudents = students.filter(s => s.role === 'individual');
  
  const averageProgress = students.length > 0 
    ? Math.round(students.reduce((total, student) => total + (student.progress?.overall || 0), 0) / students.length)
    : 0;

  const totalVrSessions = students.reduce((total, student) => total + student.vr_sessions, 0);
  const uniqueCompanies = [...new Set(b2bStudents.map(s => s.company_name).filter(Boolean))];

  if (loading) {
    return (
      <div className="space-y-6">
        <div className="text-center py-12">
          <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-yellow-500 mx-auto mb-4"></div>
          <p className="text-gray-400">Chargement des étudiants...</p>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="space-y-6">
        <div className="text-center py-12">
          <div className="w-24 h-24 bg-red-500/20 rounded-full flex items-center justify-center mx-auto mb-4">
            <AlertCircle className="w-12 h-12 text-red-400" />
          </div>
          <h3 className="text-xl font-semibold text-white mb-2">Erreur de chargement</h3>
          <p className="text-gray-400 mb-6">{error}</p>
          <button
            onClick={onRefresh}
            className="px-4 py-2 bg-yellow-500 text-black rounded-lg hover:bg-yellow-400 transition-colors flex items-center space-x-2 mx-auto"
          >
            <RefreshCw className="w-4 h-4" />
            <span>Réessayer</span>
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h2 className="text-2xl font-bold text-white mb-2">
            Étudiants
          </h2>
          <p className="text-gray-400">
            Suivez les progrès de tous vos étudiants
          </p>
        </div>
        <button
          onClick={onRefresh}
          className="px-4 py-2 bg-gray-700 text-white rounded-lg hover:bg-gray-600 transition-colors flex items-center space-x-2"
        >
          <RefreshCw className="w-4 h-4" />
          <span>Actualiser</span>
        </button>
      </div>

      {/* Stats */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
        <motion.div 
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.1 }}
          className="bg-gray-800/30 rounded-xl p-4 border border-gray-700/50"
        >
          <div className="flex items-center space-x-3">
            <div className="w-10 h-10 bg-purple-500/20 rounded-lg flex items-center justify-center">
              <Users className="w-5 h-5 text-purple-400" />
            </div>
            <div>
              <div className="text-2xl font-bold text-white">{students.length}</div>
              <div className="text-sm text-gray-400">Total étudiants</div>
            </div>
          </div>
        </motion.div>

        <motion.div 
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.2 }}
          className="bg-gray-800/30 rounded-xl p-4 border border-gray-700/50"
        >
          <div className="flex items-center space-x-3">
            <div className="w-10 h-10 bg-blue-500/20 rounded-lg flex items-center justify-center">
              <Building className="w-5 h-5 text-blue-400" />
            </div>
            <div>
              <div className="text-2xl font-bold text-white">{b2bStudents.length}</div>
              <div className="text-sm text-gray-400">B2B - Employés</div>
            </div>
          </div>
        </motion.div>

        <motion.div 
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.3 }}
          className="bg-gray-800/30 rounded-xl p-4 border border-gray-700/50"
        >
          <div className="flex items-center space-x-3">
            <div className="w-10 h-10 bg-green-500/20 rounded-lg flex items-center justify-center">
              <BookOpen className="w-5 h-5 text-green-400" />
            </div>
            <div>
              <div className="text-2xl font-bold text-white">{averageProgress}%</div>
              <div className="text-sm text-gray-400">Progression moyenne</div>
            </div>
          </div>
        </motion.div>

        <motion.div 
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.4 }}
          className="bg-gray-800/30 rounded-xl p-4 border border-gray-700/50"
        >
          <div className="flex items-center space-x-3">
            <div className="w-10 h-10 bg-yellow-500/20 rounded-lg flex items-center justify-center">
              <Star className="w-5 h-5 text-yellow-400" />
            </div>
            <div>
              <div className="text-2xl font-bold text-white">{totalVrSessions}</div>
              <div className="text-sm text-gray-400">Sessions VR</div>
            </div>
          </div>
        </motion.div>
      </div>

      {/* B2B vs B2C Tabs */}
      <div className="bg-gray-800/30 rounded-xl p-6 border border-gray-700/50">
        <div className="flex items-center space-x-6 mb-6">
          <div className="flex items-center space-x-2">
            <Building className="w-5 h-5 text-blue-400" />
            <span className="text-lg font-semibold text-white">B2B - Employés ({b2bStudents.length})</span>
          </div>
          <div className="flex items-center space-x-2">
            <Users className="w-5 h-5 text-purple-400" />
            <span className="text-lg font-semibold text-white">B2C - Individuels ({b2cStudents.length})</span>
          </div>
        </div>

        {/* Students Grid */}
        {students.length > 0 ? (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {students.map((student, index) => (
              <StudentCard
                key={student.id}
                student={student}
                onView={onViewStudent}
              />
            ))}
          </div>
        ) : (
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            className="text-center py-12"
          >
            <div className="w-24 h-24 bg-gray-800/50 rounded-full flex items-center justify-center mx-auto mb-4">
              <Users className="w-12 h-12 text-gray-400" />
            </div>
            <h3 className="text-xl font-semibold text-white mb-2">Aucun étudiant</h3>
            <p className="text-gray-400 mb-6">
              Aucun étudiant n'est actuellement inscrit
            </p>
          </motion.div>
        )}
      </div>

      {/* Recent Activity */}
      {students.length > 0 && (
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.5 }}
          className="bg-gray-800/30 rounded-xl p-6 border border-gray-700/50"
        >
          <div className="flex items-center justify-between mb-4">
            <h3 className="text-lg font-semibold text-white">Activité récente</h3>
            <TrendingUp className="w-5 h-5 text-yellow-400" />
          </div>
          <div className="space-y-3">
            {students
              .sort((a, b) => new Date(b.created_at).getTime() - new Date(a.created_at).getTime())
              .slice(0, 3)
              .map((student, index) => (
                <div key={student.id} className="flex items-center space-x-3">
                  <div className={`w-8 h-8 rounded-full flex items-center justify-center ${
                    student.role === 'employee' 
                      ? 'bg-blue-500/20' 
                      : 'bg-purple-500/20'
                  }`}>
                    {student.role === 'employee' ? (
                      <Building className="w-4 h-4 text-blue-400" />
                    ) : (
                      <Users className="w-4 h-4 text-purple-400" />
                    )}
                  </div>
                  <div className="flex-1">
                    <p className="text-white text-sm">
                      <span className="font-medium">{student.name}</span> 
                      {student.role === 'employee' ? ' (B2B)' : ' (B2C)'} s'est inscrit
                    </p>
                    <p className="text-gray-400 text-xs">
                      {new Date(student.created_at).toLocaleDateString('fr-FR')}
                    </p>
                  </div>
                  <div className="text-xs text-gray-500">
                    {student.progress?.overall || 0}% complété
                  </div>
                </div>
              ))}
          </div>
        </motion.div>
      )}
    </div>
  );
}
