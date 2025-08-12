'use client';

import { motion } from 'framer-motion';
import { Users, BookOpen, Star, TrendingUp, MapPin } from 'lucide-react';
import StudentCard, { Student } from './StudentCard';

interface StudentListProps {
  students: Student[];
  onViewStudent: (student: Student) => void;
}

export default function StudentList({ students, onViewStudent }: StudentListProps) {
  const averageRating = students.length > 0 
    ? (students.reduce((total, student) => total + student.rating, 0) / students.length).toFixed(1)
    : '0.0';
  
  const averageProgress = students.length > 0
    ? Math.round(students.reduce((total, student) => total + student.progress, 0) / students.length)
    : 0;

  const cities = [...new Set(students.map(student => student.city))];

  return (
    <div className="space-y-6">
      {/* Header */}
      <div>
        <h2 className="text-2xl font-bold text-white mb-2">
          Étudiants B2C
        </h2>
        <p className="text-gray-400">
          Suivez les progrès de vos étudiants individuels
        </p>
      </div>

      {/* Stats */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
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
              <div className="text-sm text-gray-400">Étudiants</div>
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
            <div className="w-10 h-10 bg-yellow-500/20 rounded-lg flex items-center justify-center">
              <Star className="w-5 h-5 text-yellow-400" />
            </div>
            <div>
              <div className="text-2xl font-bold text-white">{averageRating}</div>
              <div className="text-sm text-gray-400">Note moyenne</div>
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
            <div className="w-10 h-10 bg-blue-500/20 rounded-lg flex items-center justify-center">
              <MapPin className="w-5 h-5 text-blue-400" />
            </div>
            <div>
              <div className="text-2xl font-bold text-white">{cities.length}</div>
              <div className="text-sm text-gray-400">Villes</div>
            </div>
          </div>
        </motion.div>
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
            Aucun étudiant B2C n'est actuellement inscrit
          </p>
        </motion.div>
      )}

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
              .sort((a, b) => new Date(b.lastActivity).getTime() - new Date(a.lastActivity).getTime())
              .slice(0, 3)
              .map((student, index) => (
                <div key={student.id} className="flex items-center space-x-3">
                  <div className="w-8 h-8 bg-purple-500/20 rounded-full flex items-center justify-center">
                    <Users className="w-4 h-4 text-purple-400" />
                  </div>
                  <div className="flex-1">
                    <p className="text-white text-sm">
                      <span className="font-medium">{student.name}</span> a terminé un module
                    </p>
                    <p className="text-gray-400 text-xs">
                      {new Date(student.lastActivity).toLocaleDateString('fr-FR')}
                    </p>
                  </div>
                  <div className="text-xs text-gray-500">
                    {student.progress}% complété
                  </div>
                </div>
              ))}
          </div>
        </motion.div>
      )}
    </div>
  );
}
