'use client';

import React, { useState } from 'react';
import HRSidebar from '@/components/hr/HRSidebar';
import HRHeader from '@/components/hr/HRHeader';
import EmployeesSection from '@/components/hr-dashboard/EmployeesSection';
import { Check, Clock, AlertTriangle, Star, BarChart3, Search, Bell, Users } from 'lucide-react';

// Export par défaut pour faciliter l'import dynamique
export default function HRDashboardContent() {
  const [activeTab, setActiveTab] = useState<'dashboard' | 'employees' | 'trainings' | 'skills' | 'evaluation'>('dashboard');

  const renderContent = () => {
    switch (activeTab) {
      case 'employees':
        return <EmployeesSection />;
      case 'dashboard':
      default:
        return (
          <>
            {/* Company Overview */}
            <CompanyOverview />
            
            {/* Key Metrics */}
            <KeyMetrics />
            
            {/* Department Breakdown */}
            <DepartmentBreakdown />
            
            {/* Recent Activity */}
            <RecentActivity />
            
            {/* Quick Actions */}
            <QuickActions />
          </>
        );
    }
  };

  return (
    <div className="flex h-screen bg-gradient-to-br from-gray-900 to-gray-800 text-gray-100">
      {/* Sidebar */}
      <HRSidebar />
      
      {/* Main Content */}
      <div className="flex-1 flex flex-col overflow-hidden">
        {/* Header */}
        <HRHeader />
        
        {/* Navigation Tabs */}
        <div className="bg-gray-900 border-b border-gray-800">
          <div className="max-w-7xl mx-auto px-6">
            <nav className="flex space-x-8">
              <button
                onClick={() => setActiveTab('dashboard')}
                className={`py-4 px-1 border-b-2 font-medium text-sm transition-colors ${
                  activeTab === 'dashboard'
                    ? 'border-cyan-500 text-cyan-400'
                    : 'border-transparent text-gray-400 hover:text-gray-300 hover:border-gray-700'
                }`}
              >
                Tableau de bord
              </button>
              <button
                onClick={() => setActiveTab('employees')}
                className={`py-4 px-1 border-b-2 font-medium text-sm transition-colors ${
                  activeTab === 'employees'
                    ? 'border-cyan-500 text-cyan-400'
                    : 'border-transparent text-gray-400 hover:text-gray-300 hover:border-gray-700'
                }`}
              >
                Employés
              </button>
              <button
                onClick={() => setActiveTab('trainings')}
                className={`py-4 px-1 border-b-2 font-medium text-sm transition-colors ${
                  activeTab === 'trainings'
                    ? 'border-cyan-500 text-cyan-400'
                    : 'border-transparent text-gray-400 hover:text-gray-300 hover:border-gray-700'
                }`}
              >
                Formations
              </button>
              <button
                onClick={() => setActiveTab('skills')}
                className={`py-4 px-1 border-b-2 font-medium text-sm transition-colors ${
                  activeTab === 'skills'
                    ? 'border-cyan-500 text-cyan-400'
                    : 'border-transparent text-gray-400 hover:text-gray-300 hover:border-gray-700'
                }`}
              >
                Compétences
              </button>
              <button
                onClick={() => setActiveTab('evaluation')}
                className={`py-4 px-1 border-b-2 font-medium text-sm transition-colors ${
                  activeTab === 'evaluation'
                    ? 'border-cyan-500 text-cyan-400'
                    : 'border-transparent text-gray-400 hover:text-gray-300 hover:border-gray-700'
                }`}
              >
                Évaluation
              </button>
            </nav>
          </div>
        </div>
        
        {/* Main Content */}
        <main className="flex-1 overflow-y-auto p-6">
          <div className="max-w-7xl mx-auto">
            {renderContent()}
          </div>
        </main>
      </div>
    </div>
  );
}

// Temporary components - will be moved to separate files
function CompanyOverview() {
  return (
    <div className="mb-8">
      <h2 className="text-2xl font-bold mb-4">Aperçu de l'entreprise</h2>
      <div className="bg-gradient-to-r from-cyan-500 to-blue-600 rounded-xl p-6 shadow-lg">
        <div className="flex items-center justify-between">
          <div>
            <h3 className="text-xl font-bold text-white">TechCorp Training</h3>
            <p className="text-cyan-100">Plan Entreprise • 150 employés</p>
          </div>
          <div className="relative w-24 h-24">
            <svg className="w-full h-full" viewBox="0 0 100 100">
              <circle cx="50" cy="50" r="45" fill="none" stroke="#1f2937" strokeWidth="10" />
              <circle 
                className="progress-ring-circle" 
                cx="50" 
                cy="50" 
                r="45" 
                fill="none" 
                stroke="#ffffff" 
                strokeWidth="10" 
                strokeDasharray="282.74"
                strokeDashoffset="84.82"
              />
            </svg>
            <div className="absolute inset-0 flex items-center justify-center">
              <span className="text-2xl font-bold text-white">70%</span>
            </div>
          </div>
        </div>
        <div className="mt-4 text-white font-medium">Progression globale de l'équipe</div>
      </div>
    </div>
  );
}

function KeyMetrics() {
  const metrics = [
    { 
      title: 'Terminés', 
      value: '105', 
      change: '+15%', 
      icon: <Check className="w-5 h-5" />,
      color: 'bg-green-500',
      textColor: 'text-green-500',
      changeColor: 'text-green-400'
    },
    { 
      title: 'En cours', 
      value: '32', 
      change: 'Actif', 
      icon: <Clock className="w-5 h-5" />,
      color: 'bg-yellow-500',
      textColor: 'text-yellow-500',
      changeColor: 'text-yellow-400'
    },
    { 
      title: 'Inactifs', 
      value: '13', 
      change: 'Alerte', 
      icon: <AlertTriangle className="w-5 h-5" />,
      color: 'bg-red-500',
      textColor: 'text-red-500',
      changeColor: 'text-red-400'
    },
    { 
      title: 'Note moyenne', 
      value: '4.4', 
      change: '4.6', 
      icon: <Star className="w-5 h-5" />,
      color: 'bg-blue-500',
      textColor: 'text-blue-500',
      changeColor: 'text-blue-400'
    },
  ];

  return (
    <div className="mb-8">
      <h2 className="text-2xl font-bold mb-4">Indicateurs clés</h2>
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
        {metrics.map((metric, index) => (
          <div key={index} className="bg-white bg-opacity-10 backdrop-blur-sm rounded-xl p-4 border border-white border-opacity-20 hover:bg-opacity-20 transition-all duration-300">
            <div className="flex items-center justify-between mb-2">
              <div className={`w-10 h-10 ${metric.color} rounded-lg flex items-center justify-center text-white text-xl`}>
                {metric.icon}
              </div>
              <span className={`text-sm font-bold ${metric.changeColor}`}>{metric.change}</span>
            </div>
            <div className="text-3xl font-bold text-white mb-1">{metric.value}</div>
            <div className="text-gray-300 text-sm font-medium">{metric.title}</div>
          </div>
        ))}
      </div>
    </div>
  );
}

function DepartmentBreakdown() {
  const departments = [
    {
      name: 'Équipe commerciale',
      progress: 92,
      completed: 23,
      total: 25,
      avgScore: 4.8,
      avgTime: '12h',
      color: 'bg-green-400'
    },
    {
      name: 'Marketing',
      progress: 76,
      completed: 19,
      total: 25,
      avgScore: 4.2,
      avgTime: '15h',
      color: 'bg-yellow-400'
    },
    {
      name: 'Direction',
      progress: 45,
      completed: 9,
      total: 20,
      avgScore: 3.8,
      avgTime: '8h',
      color: 'bg-red-400'
    },
  ];

  return (
    <div className="mb-8">
      <h2 className="text-2xl font-bold mb-4">Progression par département</h2>
      <div className="space-y-4">
        {departments.map((dept, index) => (
          <div key={index} className="bg-white bg-opacity-10 backdrop-blur-sm rounded-xl p-4 border border-white border-opacity-20">
            <div className="flex items-center justify-between mb-2">
              <h3 className="text-white font-semibold">{dept.name}</h3>
              <span className={`text-sm font-bold ${dept.progress > 80 ? 'text-green-400' : dept.progress > 50 ? 'text-yellow-400' : 'text-red-400'}`}>
                {dept.progress}%
              </span>
            </div>
            <div className="w-full bg-gray-700 rounded-full h-2 mb-2">
              <div 
                className={`h-2 rounded-full ${dept.color}`} 
                style={{ width: `${dept.progress}%` }}
              ></div>
            </div>
            <div className="flex justify-between text-sm text-gray-300">
              <span>{dept.completed}/{dept.total} complétés</span>
              <div className="flex space-x-4">
                <span>Moy: {dept.avgScore}/5</span>
                <span>Tps: {dept.avgTime} moy</span>
              </div>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}

function RecentActivity() {
  const activities = [
    {
      name: 'John Smith',
      avatar: 'https://images.unsplash.com/photo-1472099645785-5658abf4ff4e?w=40&h=40&fit=crop&crop=face',
      time: 'il y a 5 min',
      action: 'A terminé le Module 4',
      team: 'Équipe commerciale',
      status: 'Terminé',
      statusColor: 'bg-green-900 bg-opacity-50 text-green-400'
    },
    {
      name: 'Lisa Johnson',
      avatar: 'https://images.unsplash.com/photo-1494790108755-2616b612b786?w=40&h=40&fit=crop&crop=face',
      time: 'il y a 12 min',
      action: 'A commencé le Module 2',
      team: 'Marketing',
      status: 'En cours',
      statusColor: 'bg-yellow-900 bg-opacity-50 text-yellow-400'
    },
  ];

  return (
    <div className="mb-8">
      <h2 className="text-2xl font-bold mb-4">Activité récente</h2>
      <div className="space-y-3">
        {activities.map((activity, index) => (
          <div key={index} className="bg-white bg-opacity-10 backdrop-blur-sm rounded-xl p-4 border border-white border-opacity-20 hover:bg-opacity-20 transition-colors duration-300">
            <div className="flex items-center space-x-3">
              <img 
                src={activity.avatar} 
                alt={activity.name} 
                className="w-10 h-10 rounded-full border-2 border-cyan-400"
              />
              <div className="flex-1">
                <div className="flex items-center justify-between">
                  <h3 className="text-white font-semibold">{activity.name}</h3>
                  <span className="text-xs text-gray-400">{activity.time}</span>
                </div>
                <p className="text-sm text-gray-300">{activity.action} • {activity.team}</p>
              </div>
              <span className={`text-xs px-2 py-1 rounded-full font-medium ${activity.statusColor}`}>
                {activity.status}
              </span>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}

function QuickActions() {
  const actions = [
    { 
      title: 'Exporter un rapport', 
      icon: <BarChart3 className="w-6 h-6" />,
      color: 'from-cyan-400 to-cyan-500',
      textColor: 'text-black'
    },
    { 
      title: 'Voir les détails', 
      icon: <Search className="w-6 h-6" />,
      color: 'from-yellow-400 to-yellow-500',
      textColor: 'text-black'
    },
    { 
      title: 'Envoyer un rappel', 
      icon: <Bell className="w-6 h-6" />,
      color: 'bg-white bg-opacity-10 border border-white border-opacity-20',
      textColor: 'text-white'
    },
    { 
      title: 'Gérer les utilisateurs', 
      icon: <Users className="w-6 h-6" />,
      color: 'bg-white bg-opacity-10 border border-white border-opacity-20',
      textColor: 'text-white'
    },
  ];

  return (
    <div className="mb-8">
      <h2 className="text-2xl font-bold mb-4">Actions rapides</h2>
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        {actions.map((action, index) => (
          <button 
            key={index}
            className={`p-4 rounded-xl flex flex-col items-center justify-center space-y-2 transition-all duration-300 hover:scale-105 ${
              action.color.startsWith('bg-') ? action.color : `bg-gradient-to-r ${action.color}`
            }`}
          >
            <span className="text-2xl">{action.icon}</span>
            <span className={`text-sm font-medium ${action.textColor}`}>{action.title}</span>
          </button>
        ))}
      </div>
    </div>
  );
}
