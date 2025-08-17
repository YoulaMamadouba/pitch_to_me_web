'use client';

import { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { 
  ArrowUpIcon, 
  ArrowDownIcon, 
  UsersIcon, 
  CurrencyDollarIcon, 
  ClockIcon, 
  StarIcon,
  CalendarIcon,
  ChartBarIcon,
  UserGroupIcon,
  AcademicCapIcon
} from '@heroicons/react/24/outline';
import { 
  LineChart, 
  Line, 
  BarChart, 
  Bar, 
  XAxis, 
  YAxis, 
  CartesianGrid, 
  Tooltip, 
  Legend, 
  ResponsiveContainer,
  PieChart,
  Pie,
  Cell
} from 'recharts';

// Données de démonstration pour les graphiques
const sessionData = [
  { name: 'Jan', sessions: 12 },
  { name: 'Fév', sessions: 19 },
  { name: 'Mar', sessions: 15 },
  { name: 'Avr', sessions: 28 },
  { name: 'Mai', sessions: 32 },
  { name: 'Juin', sessions: 29 },
  { name: 'Juil', sessions: 35 },
];

const studentProgressData = [
  { name: 'Débutants', value: 35 },
  { name: 'Intermédiaires', value: 45 },
  { name: 'Avancés', value: 20 },
];

const satisfactionData = [
  { name: '1', rating: 2 },
  { name: '2', rating: 5 },
  { name: '3', rating: 8 },
  { name: '4', rating: 15 },
  { name: '5', rating: 70 },
];

const COLORS = ['#0088FE', '#00C49F', '#FFBB28', '#FF8042', '#8884d8'];

// Composant de KPI
const KpiCard = ({ 
  title, 
  value, 
  change, 
  isPositive, 
  icon: Icon,
  iconBg 
}: { 
  title: string; 
  value: string; 
  change: string; 
  isPositive: boolean; 
  icon: React.ElementType;
  iconBg: string;
}) => (
  <motion.div 
    whileHover={{ y: -2 }}
    className="bg-gray-800/50 backdrop-blur-sm rounded-xl p-5 border border-gray-700/50 hover:border-yellow-400/30 transition-all"
  >
    <div className="flex items-center justify-between mb-4">
      <div className={`p-2 rounded-lg ${iconBg}`}>
        <Icon className="h-6 w-6 text-white" />
      </div>
      <span className={`text-xs font-medium px-2 py-1 rounded-full ${isPositive ? 'bg-green-900/50 text-green-400' : 'bg-red-900/50 text-red-400'}`}>
        {isPositive ? '+' : ''}{change}%
      </span>
    </div>
    <h3 className="text-2xl font-bold text-white mb-1">{value}</h3>
    <p className="text-sm text-gray-400">{title}</p>
  </motion.div>
);

// Composant principal
const AnalyticsView = () => {
  const [timeRange, setTimeRange] = useState('month');
  const [isLoading, setIsLoading] = useState(true);

  // Simuler le chargement des données
  useEffect(() => {
    const timer = setTimeout(() => {
      setIsLoading(false);
    }, 1000);
    return () => clearTimeout(timer);
  }, []);

  if (isLoading) {
    return (
      <div className="flex items-center justify-center h-64">
        <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-yellow-500"></div>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      {/* En-tête */}
      <div className="flex flex-col md:flex-row md:items-center md:justify-between">
        <div>
          <h2 className="text-2xl font-bold text-white">Analytics Dashboard</h2>
          <p className="text-gray-400">Vue d'ensemble des performances et statistiques</p>
        </div>
        <div className="mt-4 md:mt-0">
          <div className="inline-flex items-center rounded-md bg-gray-800/50 border border-gray-700/50 p-1">
            {['day', 'week', 'month', 'year'].map((range) => (
              <button
                key={range}
                onClick={() => setTimeRange(range)}
                className={`px-3 py-1 text-sm rounded-md transition-colors ${
                  timeRange === range
                    ? 'bg-yellow-500/10 text-yellow-400'
                    : 'text-gray-400 hover:text-white'
                }`}
              >
                {range === 'day' ? 'Aujourd\'hui' : 
                 range === 'week' ? 'Semaine' :
                 range === 'month' ? 'Mois' : 'Année'}
              </button>
            ))}
          </div>
        </div>
      </div>

      {/* KPIs */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
        <KpiCard
          title="Sessions ce mois"
          value="42"
          change="12"
          isPositive={true}
          icon={CalendarIcon}
          iconBg="bg-blue-600"
        />
        <KpiCard
          title="Étudiants actifs"
          value="127"
          change="8"
          isPositive={true}
          icon={UsersIcon}
          iconBg="bg-green-600"
        />
        <KpiCard
          title="Taux de complétion"
          value="87%"
          change="5"
          isPositive={true}
          icon={ChartBarIcon}
          iconBg="bg-purple-600"
        />
        <KpiCard
          title="Satisfaction"
          value="4.7/5"
          change="0.3"
          isPositive={true}
          icon={StarIcon}
          iconBg="bg-yellow-600"
        />
      </div>

      {/* Graphique des sessions */}
      <motion.div 
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.1 }}
        className="bg-gray-800/50 backdrop-blur-sm rounded-xl p-6 border border-gray-700/50 hover:border-yellow-400/30 transition-all"
      >
        <div className="flex items-center justify-between mb-6">
          <h3 className="text-lg font-semibold text-white">Activité des sessions</h3>
          <div className="flex items-center space-x-2 text-sm">
            <div className="flex items-center">
              <div className="w-3 h-3 rounded-full bg-blue-500 mr-2"></div>
              <span className="text-gray-400">Sessions</span>
            </div>
          </div>
        </div>
        <div className="h-80">
          <ResponsiveContainer width="100%" height="100%">
            <LineChart data={sessionData}>
              <CartesianGrid strokeDasharray="3 3" stroke="#374151" />
              <XAxis 
                dataKey="name" 
                stroke="#9CA3AF" 
                tickLine={false}
                axisLine={{ stroke: '#374151' }}
              />
              <YAxis 
                stroke="#9CA3AF" 
                tickLine={false}
                axisLine={{ stroke: '#374151' }}
              />
              <Tooltip 
                contentStyle={{ 
                  backgroundColor: 'rgba(31, 41, 55, 0.9)',
                  borderColor: 'rgba(75, 85, 99, 0.5)',
                  borderRadius: '0.5rem',
                }}
                itemStyle={{ color: '#F3F4F6' }}
                labelStyle={{ color: '#9CA3AF' }}
              />
              <Line 
                type="monotone" 
                dataKey="sessions" 
                stroke="#3B82F6" 
                strokeWidth={2}
                dot={{ r: 4, fill: '#1D4ED8' }}
                activeDot={{ r: 6, fill: '#3B82F6' }}
              />
            </LineChart>
          </ResponsiveContainer>
        </div>
      </motion.div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Niveau des étudiants */}
        <motion.div 
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.2 }}
          className="bg-gray-800/50 backdrop-blur-sm rounded-xl p-6 border border-gray-700/50 hover:border-yellow-400/30 transition-all"
        >
          <h3 className="text-lg font-semibold text-white mb-6">Niveau des étudiants</h3>
          <div className="h-64">
            <ResponsiveContainer width="100%" height="100%">
              <PieChart>
                <Pie
                  data={studentProgressData}
                  cx="50%"
                  cy="50%"
                  innerRadius={60}
                  outerRadius={80}
                  paddingAngle={5}
                  dataKey="value"
                >
                  {studentProgressData.map((entry, index) => (
                    <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
                  ))}
                </Pie>
                <Tooltip 
                  contentStyle={{ 
                    backgroundColor: 'rgba(31, 41, 55, 0.9)',
                    borderColor: 'rgba(75, 85, 99, 0.5)',
                    borderRadius: '0.5rem',
                  }}
                  itemStyle={{ color: '#F3F4F6' }}
                  labelStyle={{ color: '#9CA3AF' }}
                />
                <Legend />
              </PieChart>
            </ResponsiveContainer>
          </div>
          <div className="mt-4 grid grid-cols-3 gap-2 text-center">
            {studentProgressData.map((item, index) => (
              <div key={index} className="text-sm">
                <div className="flex items-center justify-center mb-1">
                  <div 
                    className="w-3 h-3 rounded-full mr-2" 
                    style={{ backgroundColor: COLORS[index % COLORS.length] }}
                  ></div>
                  <span className="text-gray-300">{item.name}</span>
                </div>
                <span className="text-xl font-bold text-white">{item.value}%</span>
              </div>
            ))}
          </div>
        </motion.div>

        {/* Satisfaction */}
        <motion.div 
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.3 }}
          className="bg-gray-800/50 backdrop-blur-sm rounded-xl p-6 border border-gray-700/50 hover:border-yellow-400/30 transition-all"
        >
          <h3 className="text-lg font-semibold text-white mb-6">Satisfaction des étudiants</h3>
          <div className="h-64">
            <ResponsiveContainer width="100%" height="100%">
              <BarChart data={satisfactionData}>
                <CartesianGrid strokeDasharray="3 3" stroke="#374151" />
                <XAxis 
                  dataKey="name" 
                  stroke="#9CA3AF" 
                  tickLine={false}
                  axisLine={{ stroke: '#374151' }}
                />
                <YAxis 
                  stroke="#9CA3AF" 
                  tickLine={false}
                  axisLine={{ stroke: '#374151' }}
                />
                <Tooltip 
                  contentStyle={{ 
                    backgroundColor: 'rgba(31, 41, 55, 0.9)',
                    borderColor: 'rgba(75, 85, 99, 0.5)',
                    borderRadius: '0.5rem',
                  }}
                  itemStyle={{ color: '#F3F4F6' }}
                  labelStyle={{ color: '#9CA3AF' }}
                />
                <Bar 
                  dataKey="rating" 
                  fill="#F59E0B"
                  radius={[4, 4, 0, 0]}
                >
                  {satisfactionData.map((entry, index) => (
                    <Cell 
                      key={`cell-${index}`} 
                      fill={
                        index === satisfactionData.length - 1 
                          ? '#F59E0B' 
                          : `rgba(245, 158, 11, ${0.5 + (index * 0.1)})`
                      } 
                    />
                  ))}
                </Bar>
              </BarChart>
            </ResponsiveContainer>
          </div>
          <div className="mt-4 flex items-center justify-between text-sm text-gray-400">
            <span>1 étoile</span>
            <span>2 étoiles</span>
            <span>3 étoiles</span>
            <span>4 étoiles</span>
            <span className="text-yellow-400 font-medium">5 étoiles</span>
          </div>
        </motion.div>
      </div>

      {/* Dernières activités */}
      <motion.div 
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.4 }}
        className="bg-gray-800/50 backdrop-blur-sm rounded-xl p-6 border border-gray-700/50 hover:border-yellow-400/30 transition-all"
      >
        <div className="flex items-center justify-between mb-6">
          <h3 className="text-lg font-semibold text-white">Dernières activités</h3>
          <button className="text-sm text-yellow-400 hover:text-yellow-300">
            Voir tout
          </button>
        </div>
        <div className="space-y-4">
          {[
            { id: 1, user: 'Jean Dupont', action: 'a terminé le module "Présentation produit"', time: 'Il y a 2h', isPositive: true },
            { id: 2, user: 'Marie Martin', action: 'a commencé un nouveau cours', time: 'Il y a 5h', isPositive: true },
            { id: 3, user: 'Pierre Durand', action: 'a annulé sa session', time: 'Hier', isPositive: false },
            { id: 4, user: 'Sophie Lambert', action: 'a donné une note de 5 étoiles', time: 'Hier', isPositive: true },
          ].map((activity) => (
            <div key={activity.id} className="flex items-start pb-4 border-b border-gray-700/50 last:border-0 last:pb-0">
              <div className={`w-8 h-8 rounded-full flex items-center justify-center mr-3 mt-0.5 ${
                activity.isPositive ? 'bg-green-900/30 text-green-400' : 'bg-red-900/30 text-red-400'
              }`}>
                {activity.isPositive ? (
                  <ArrowUpIcon className="w-4 h-4" />
                ) : (
                  <ArrowDownIcon className="w-4 h-4" />
                )}
              </div>
              <div className="flex-1">
                <p className="text-sm text-white">
                  <span className="font-medium">{activity.user}</span> {activity.action}
                </p>
                <p className="text-xs text-gray-500 mt-1">{activity.time}</p>
              </div>
            </div>
          ))}
        </div>
      </motion.div>
    </div>
  );
};

export default AnalyticsView;
