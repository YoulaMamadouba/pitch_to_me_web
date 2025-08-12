import { motion } from 'framer-motion';
import { ChevronLeft, Settings, Check, Eye, Share2, Star, Award, Clock, Zap } from 'lucide-react';
import Link from 'next/link';

interface LearnerProfileProps {
  onBack: () => void;
}

export default function LearnerProfile({ onBack }: LearnerProfileProps) {
  const stats = [
    { value: '9/12', label: 'Modules Completed', progress: 75, color: 'from-green-400 to-green-500' },
    { value: '47h', label: 'Practice Time', sublabel: '+5h this week', color: 'from-blue-400 to-blue-500' },
    { value: '4.8', label: 'Avg Score', icon: Star, color: 'from-yellow-400 to-yellow-500' },
    { value: '23', label: 'VR Sessions', sublabel: '12h total', color: 'from-cyan-400 to-cyan-500' },
  ];

  const achievements = [
    { id: 1, name: 'First Star', icon: Star, color: 'from-yellow-400 to-yellow-500', unlocked: true },
    { id: 2, name: 'Consistent', icon: Check, color: 'from-green-400 to-green-500', unlocked: true },
    { id: 3, name: 'VR Master', icon: Eye, color: 'from-purple-400 to-purple-500', unlocked: true },
    { id: 4, name: 'Locked', icon: Award, color: 'from-gray-600 to-gray-700', unlocked: false },
  ];

  const activities = [
    { id: 1, title: 'Completed Module 9: Advanced Techniques', time: '2 hours ago', icon: Check, iconBg: 'bg-green-600', score: '4.9/5' },
    { id: 2, title: 'VR Session: TEDx Stage Practice', time: '1 day ago', icon: Clock, iconBg: 'bg-purple-600', duration: '18 min' },
  ];

  return (
    <motion.div 
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.5, delay: 0.1 }}
      className="bg-gray-800/80 backdrop-blur-sm rounded-xl shadow-lg p-6 border border-gray-700 hover:shadow-xl transition-all"
    >
      {/* Profile Header */}
      <div className="mb-6">
        <div className="flex items-center justify-between mb-6">
          <button 
            onClick={onBack}
            className="p-2 rounded-full bg-gray-700/50 hover:bg-gray-600/50 transition-colors"
          >
            <ChevronLeft className="w-5 h-5 text-white" />
          </button>
          <h2 className="text-xl font-bold text-white">Mon Profil</h2>
          <button className="p-2 rounded-full bg-gray-700/50 hover:bg-gray-600/50 transition-colors">
            <Settings className="w-5 h-5 text-white" />
          </button>
        </div>

        <div className="text-center">
          <div className="relative inline-block mb-4">
            <img 
              src="https://images.unsplash.com/photo-1472099645785-5658abf4ff4e?w=120&h=120&fit=crop&crop=face"
              alt="Profile"
              className="w-28 h-28 rounded-full border-4 border-yellow-400 shadow-lg shadow-yellow-400/30 mx-auto"
            />
            <div className="absolute -bottom-2 -right-2 bg-green-500 w-8 h-8 rounded-full border-4 border-gray-900 flex items-center justify-center">
              <span className="text-white text-xs font-bold">7</span>
            </div>
          </div>
          
          <h1 className="text-2xl font-bold text-white mb-1">Alex Martin</h1>
          <p className="text-gray-300 text-sm mb-6">Marketing Manager • TechCorp</p>
          
          {/* Level Progress */}
          <div className="bg-gray-700/50 rounded-xl p-4 border border-gray-600">
            <div className="flex items-center justify-between mb-2">
              <span className="text-white font-medium">Niveau 7 - Orateur Avancé</span>
              <span className="text-yellow-400 font-bold">2,340 XP</span>
            </div>
            <div className="w-full bg-gray-600 rounded-full h-2.5 mb-1.5">
              <div 
                className="h-2.5 rounded-full bg-gradient-to-r from-yellow-400 to-yellow-500"
                style={{ width: '78%' }}
              />
            </div>
            <div className="flex justify-between text-xs text-gray-300">
              <span>2,340 / 3,000 XP</span>
              <span>660 XP pour le niveau 8</span>
            </div>
          </div>
        </div>
      </div>

      {/* Stats Grid */}
      <div className="grid grid-cols-2 gap-3 mb-6">
        {stats.map((stat, index) => (
          <div 
            key={index}
            className="bg-gray-700/50 backdrop-blur-sm rounded-xl p-4 border border-gray-600 hover:border-gray-500 transition-colors"
          >
            <div className="text-center">
              <div className={`text-2xl font-bold bg-gradient-to-r ${stat.color} bg-clip-text text-transparent`}>
                {stat.value}
              </div>
              <div className="text-sm text-gray-300 mt-1">{stat.label}</div>
              {stat.progress && (
                <div className="w-full bg-gray-700 rounded-full h-1 mt-2">
                  <div 
                    className={`h-1 rounded-full bg-gradient-to-r ${stat.color}`}
                    style={{ width: `${stat.progress}%` }}
                  />
                </div>
              )}
              {stat.sublabel && (
                <div className="text-xs text-gray-400 mt-1">{stat.sublabel}</div>
              )}
            </div>
          </div>
        ))}
      </div>

      {/* Achievements */}
      <div className="bg-gray-700/50 backdrop-blur-sm rounded-xl p-6 border border-gray-600 mb-6">
        <h3 className="text-white font-semibold mb-4">Récompenses Récentes</h3>
        <div className="grid grid-cols-4 gap-3">
          {achievements.map((achievement) => (
            <div 
              key={achievement.id}
              className={`text-center ${!achievement.unlocked && 'opacity-50'}`}
            >
              <div 
                className={`w-12 h-12 rounded-full mx-auto mb-2 flex items-center justify-center ${
                  achievement.unlocked 
                    ? `bg-gradient-to-r ${achievement.color} shadow-md`
                    : 'bg-gray-700'
                }`}
              >
                <achievement.icon 
                  className={`w-5 h-5 ${achievement.unlocked ? 'text-white' : 'text-gray-500'}`} 
                  fill={achievement.unlocked ? 'currentColor' : 'none'}
                />
              </div>
              <span className={`text-xs ${achievement.unlocked ? 'text-white' : 'text-gray-500'}`}>
                {achievement.name}
              </span>
            </div>
          ))}
        </div>
      </div>

      {/* Recent Activity */}
      <div className="bg-gray-700/50 backdrop-blur-sm rounded-xl p-6 border border-gray-600 mb-6">
        <h3 className="text-white font-semibold mb-4">Activité Récente</h3>
        <div className="space-y-3">
          {activities.map((activity) => (
            <div 
              key={activity.id}
              className="bg-gray-600/50 rounded-xl p-3 border border-gray-500 hover:border-gray-400 transition-colors"
            >
              <div className="flex items-start space-x-3">
                <div className={`w-8 h-8 rounded-full ${activity.iconBg} flex-shrink-0 flex items-center justify-center`}>
                  <activity.icon className="w-4 h-4 text-white" />
                </div>
                <div className="flex-1 min-w-0">
                  <p className="text-sm text-white truncate">{activity.title}</p>
                  <div className="flex justify-between items-center">
                    <p className="text-xs text-gray-400">{activity.time}</p>
                    {activity.score && (
                      <span className="text-xs bg-green-900/50 text-green-400 px-2 py-0.5 rounded-full">
                        {activity.score}
                      </span>
                    )}
                    {activity.duration && (
                      <span className="text-xs bg-purple-900/50 text-purple-400 px-2 py-0.5 rounded-full">
                        {activity.duration}
                      </span>
                    )}
                  </div>
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* Action Buttons */}
      <div className="grid grid-cols-2 gap-3">
        <button className="bg-gradient-to-r from-yellow-500 to-yellow-600 hover:from-yellow-400 hover:to-yellow-500 text-black font-medium py-3 rounded-xl transition-all flex items-center justify-center space-x-2">
          <Settings className="w-4 h-4" />
          <span>Modifier le Profil</span>
        </button>
        <button className="bg-gray-700/50 hover:bg-gray-600/50 text-white font-medium py-3 rounded-xl border border-gray-600 hover:border-gray-500 transition-all flex items-center justify-center space-x-2">
          <Share2 className="w-4 h-4" />
          <span>Partager</span>
        </button>
      </div>
    </motion.div>
  );
}
