'use client';

import React, { useState } from 'react';
import Link from 'next/link';
import { ArrowLeft, Crown, BarChart2, Filter, ChevronUp, ChevronDown, Award, Star, Trophy, Zap } from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';
import './leaderboard.css';

const LeaderboardPage = () => {
  const [activeTab, setActiveTab] = useState('global');
  const [isFilterOpen, setIsFilterOpen] = useState(false);
  const [timeFilter, setTimeFilter] = useState('all-time');

  // Sample data
  const topPerformers = [
    {
      id: 1,
      name: 'Marcus Johnson',
      avatar: 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=70&h=70&fit=crop&crop=face',
      xp: 5240,
      level: 8,
      department: 'Sales',
      position: 1,
      change: 0,
    },
    {
      id: 2,
      name: 'Sarah Chen',
      avatar: 'https://images.unsplash.com/photo-1494790108755-2616b612b786?w=60&h=60&fit=crop&crop=face',
      xp: 4890,
      level: 7,
      department: 'Marketing',
      position: 2,
      change: 1,
    },
    {
      id: 3,
      name: 'Alex Martin',
      avatar: 'https://images.unsplash.com/photo-1472099645785-5658abf4ff4e?w=60&h=60&fit=crop&crop=face',
      xp: 4650,
      level: 7,
      department: 'Product',
      position: 3,
      change: -1,
    },
  ];

  const rankings = [
    {
      id: 4,
      name: 'Emma Wilson',
      avatar: 'https://images.unsplash.com/photo-1438761681033-6461ffad8d80?w=40&h=40&fit=crop&crop=face',
      xp: 4320,
      level: 6,
      department: 'Marketing',
      position: 4,
      change: 1,
    },
    {
      id: 5,
      name: 'David Kim',
      avatar: 'https://images.unsplash.com/photo-1500648767791-00dcc994a43e?w=40&h=40&fit=crop&crop=face',
      xp: 4180,
      level: 7,
      department: 'Sales',
      position: 5,
      change: 0,
    },
    {
      id: 6,
      name: 'Lisa Rodriguez',
      avatar: 'https://images.unsplash.com/photo-1544005313-94ddf0286df2?w=40&h=40&fit=crop&crop=face',
      xp: 3950,
      level: 6,
      department: 'HR',
      position: 6,
      change: -1,
    },
  ];

  const currentUser = {
    id: 7,
    name: 'You (Alex Martin)',
    avatar: 'https://images.unsplash.com/photo-1472099645785-5658abf4ff4e?w=50&h=50&fit=crop&crop=face',
    xp: 3890,
    level: 7,
    position: 7,
    change: 2,
  };

  const getMedalColor = (position: number) => {
    switch (position) {
      case 1: return 'from-yellow-400 to-yellow-500';
      case 2: return 'from-gray-300 to-gray-400';
      case 3: return 'from-amber-500 to-orange-400';
      default: return 'from-gray-600 to-gray-700';
    }
  };

  const getPodiumHeight = (position: number) => {
    switch (position) {
      case 1: return 'h-16';
      case 2: return 'h-12';
      case 3: return 'h-8';
      default: return 'h-4';
    }
  };

  const getChangeIcon = (change: number) => {
    if (change > 0) return <ChevronUp className="w-4 h-4 text-green-400" />;
    if (change < 0) return <ChevronDown className="w-4 h-4 text-red-400" />;
    return <span className="w-4"></span>;
  };

  return (
    <div className="min-h-screen bg-gradient-to-b from-gray-900 to-gray-800 text-white">
      {/* Fixed Header */}
      <header className="fixed top-0 left-0 right-0 z-50 bg-gray-900/95 backdrop-blur-md border-b border-gray-700/50 shadow-lg">
        <div className="max-w-2xl mx-auto px-4 py-3 flex items-center justify-between">
          <Link href="/dashboard" className="text-white hover:text-yellow-400 transition-colors p-1 -ml-1">
            <ArrowLeft className="w-5 h-5" />
          </Link>
          <h1 className="text-lg font-bold">Classement</h1>
          <button 
            className="text-white hover:text-yellow-400 transition-colors p-1 -mr-1"
            onClick={() => setIsFilterOpen(!isFilterOpen)}
          >
            <Filter className="w-5 h-5" />
          </button>
        </div>

        {/* Filter Dropdown */}
        <AnimatePresence>
          {isFilterOpen && (
            <motion.div 
              initial={{ opacity: 0, height: 0 }}
              animate={{ opacity: 1, height: 'auto' }}
              exit={{ opacity: 0, height: 0 }}
              className="overflow-hidden bg-gray-800/80 backdrop-blur-sm"
            >
              <div className="p-4 border-t border-gray-700">
                <h3 className="text-sm font-medium text-gray-300 mb-2">Time Period</h3>
                <div className="grid grid-cols-3 gap-2">
                  {['week', 'month', 'all-time'].map((period) => (
                    <button
                      key={period}
                      onClick={() => setTimeFilter(period)}
                      className={`text-sm py-2 px-3 rounded-lg transition-colors ${
                        timeFilter === period
                          ? 'bg-yellow-500 text-black font-medium'
                          : 'bg-gray-700 text-gray-200 hover:bg-gray-600'
                      }`}
                    >
                      {period.charAt(0).toUpperCase() + period.slice(1)}
                    </button>
                  ))}
                </div>
              </div>
            </motion.div>
          )}
        </AnimatePresence>
      </header>

      <main className="pt-16 pb-24 max-w-2xl mx-auto px-4">
        {/* Tabs */}
        <div className="bg-gray-800/50 rounded-xl p-1 mb-6 max-w-md mx-auto">
          <div className="flex">
            {['global', 'company', 'friends'].map((tab) => (
              <button
                key={tab}
                onClick={() => setActiveTab(tab)}
                className={`flex-1 py-2 px-4 rounded-lg text-sm font-medium transition-colors ${
                  activeTab === tab
                    ? 'bg-gradient-to-r from-yellow-400 to-yellow-500 text-black'
                    : 'text-gray-300 hover:text-white'
                }`}
              >
                {tab.charAt(0).toUpperCase() + tab.slice(1)}
              </button>
            ))}
          </div>
        </div>
        {/* Podium */}
        <div className="mb-6">
          <div className="flex items-end justify-center gap-3 mb-4">
            {/* 2nd Place */}
            <div className="flex-1 max-w-[100px] text-center">
              <div className="relative mx-auto w-16 h-16">
                <img 
                  src="https://randomuser.me/api/portraits/women/44.jpg" 
                  alt={topPerformers[1].name}
                  className="w-full h-full rounded-full border-3 border-gray-400 object-cover"
                />
                <div className="absolute -top-1 -right-1 w-5 h-5 bg-gray-400 rounded-full flex items-center justify-center shadow-md">
                  <span className="text-[10px] font-bold text-white">2</span>
                </div>
              </div>
              <h4 className="text-xs font-medium mt-1.5 text-gray-200 truncate px-1">{topPerformers[1].name.split(' ')[0]}</h4>
              <p className="text-[10px] text-gray-400">{topPerformers[1].xp.toLocaleString()} XP</p>
              <div className="h-10 bg-gray-400 rounded-t-lg mt-1.5 flex items-center justify-center">
                <span className="text-white font-bold text-sm">2</span>
              </div>
            </div>

            {/* 1st Place */}
            <div className="flex-1 max-w-[120px] text-center relative">
              <div className="absolute -top-5 left-1/2 transform -translate-x-1/2">
                <Crown className="w-6 h-6 text-yellow-400 animate-bounce" />
              </div>
              <div className="relative mx-auto w-20 h-20">
                <img 
                  src={topPerformers[0].avatar} 
                  alt={topPerformers[0].name}
                  className="w-full h-full rounded-full border-3 border-yellow-400 object-cover shadow-lg shadow-yellow-400/30"
                />
                <div className="absolute -top-1 -right-1 w-6 h-6 bg-yellow-400 rounded-full flex items-center justify-center shadow-md">
                  <span className="text-xs font-bold text-black">1</span>
                </div>
              </div>
              <h4 className="text-sm font-semibold mt-1.5 text-white truncate px-1">{topPerformers[0].name.split(' ')[0]}</h4>
              <p className="text-xs text-yellow-400 font-medium">{topPerformers[0].xp.toLocaleString()} XP</p>
              <div className="h-14 bg-gradient-to-t from-yellow-400 to-yellow-500 rounded-t-lg mt-1.5 flex items-center justify-center">
                <span className="text-black font-bold text-base">1</span>
              </div>
            </div>

            {/* 3rd Place */}
            <div className="flex-1 max-w-[100px] text-center">
              <div className="relative mx-auto w-16 h-16">
                <img 
                  src="https://randomuser.me/api/portraits/men/32.jpg" 
                  alt={topPerformers[2].name}
                  className="w-full h-full rounded-full border-3 border-amber-500 object-cover"
                />
                <div className="absolute -top-1 -right-1 w-5 h-5 bg-amber-500 rounded-full flex items-center justify-center shadow-md">
                  <span className="text-[10px] font-bold text-white">3</span>
                </div>
              </div>
              <h4 className="text-xs font-medium mt-1.5 text-gray-200 truncate px-1">{topPerformers[2].name.split(' ')[0]}</h4>
              <p className="text-[10px] text-gray-400">{topPerformers[2].xp.toLocaleString()} XP</p>
              <div className="h-8 bg-amber-500 rounded-t-lg mt-1.5 flex items-center justify-center">
                <span className="text-white font-bold text-sm">3</span>
              </div>
            </div>
          </div>
        </div>

        {/* Current User Rank */}
        <div className="mb-6 bg-gradient-to-r from-cyan-400 to-cyan-500 rounded-xl p-3 shadow-lg">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 bg-black/20 rounded-full flex items-center justify-center flex-shrink-0">
              <span className="text-white font-bold text-sm">#{currentUser.position}</span>
            </div>
            <img 
              src="https://randomuser.me/api/portraits/women/65.jpg" 
              alt={currentUser.name}
              className="w-10 h-10 rounded-full border-2 border-white flex-shrink-0"
            />
            <div className="flex-1 min-w-0">
              <h4 className="font-semibold text-gray-900 text-sm truncate">{currentUser.name}</h4>
              <p className="text-xs text-gray-800 truncate">{currentUser.xp.toLocaleString()} XP • Niv. {currentUser.level}</p>
            </div>
            <div className="text-right flex-shrink-0">
              <div className="flex items-center justify-end gap-0.5">
                {getChangeIcon(currentUser.change)}
                <span className={`text-xs font-bold ${currentUser.change > 0 ? 'text-green-700' : currentUser.change < 0 ? 'text-red-700' : 'text-gray-800'}`}>
                  {currentUser.change > 0 ? `+${currentUser.change}` : currentUser.change}
                </span>
              </div>
              <div className="text-[10px] text-gray-700">Cette semaine</div>
            </div>
          </div>
        </div>

        {/* Rankings List */}
        <div className="mb-4">
          <div className="flex items-center justify-between mb-3 px-1">
            <h2 className="text-base font-semibold">Top Performers</h2>
            <div className="flex items-center text-xs text-gray-400">
              <BarChart2 className="w-3.5 h-3.5 mr-1" />
              <span>XP</span>
            </div>
          </div>

          <div className="space-y-2">
            {rankings.map((user) => {
              // Utiliser une image différente pour Sarah (position 4)
              const avatar = user.position === 4 
                ? 'https://randomuser.me/api/portraits/women/65.jpg' 
                : user.avatar;
                
              return (
                <motion.div 
                  key={user.id}
                  whileHover={{ x: 3 }}
                  transition={{ type: 'spring', stiffness: 400 }}
                  className="bg-white/5 backdrop-blur-sm rounded-xl p-2.5 border border-white/5 hover:border-yellow-400/20 transition-all"
                >
                  <div className="flex items-center gap-2">
                    <div className="w-7 h-7 rounded-full flex items-center justify-center bg-gray-700/80 flex-shrink-0">
                      <span className="text-[10px] font-bold">{user.position}</span>
                    </div>
                    <img 
                      src={avatar}
                      alt={user.name}
                      className="w-9 h-9 rounded-full flex-shrink-0"
                    />
                    <div className="flex-1 min-w-0">
                      <h4 className="font-medium text-white text-sm truncate">{user.name}</h4>
                      <p className="text-[11px] text-gray-400 truncate">{user.department} • Niv. {user.level}</p>
                    </div>
                    <div className="text-right flex-shrink-0">
                      <div className="flex items-center justify-end gap-1">
                        {getChangeIcon(user.change)}
                        <span className="text-sm font-semibold">{user.xp.toLocaleString()}</span>
                        <Zap className="w-3 h-3 text-yellow-400 fill-yellow-400" />
                      </div>
                      <div className="text-[10px] text-gray-400">XP</div>
                    </div>
                  </div>
                </motion.div>
              );
            })}
          </div>
        </div>

        {/* Fixed Bottom Button */}
        <div className="fixed bottom-4 left-0 right-0 flex justify-center px-4">
          <motion.button
            whileHover={{ scale: 1.03 }}
            whileTap={{ scale: 0.98 }}
            className="bg-gradient-to-r from-yellow-400 to-yellow-500 text-black font-semibold py-2.5 px-6 rounded-full text-sm shadow-lg hover:shadow-yellow-500/30 transition-all"
          >
            Défier le meilleur joueur
          </motion.button>
        </div>
      </main>
    </div>
  );
};

export default LeaderboardPage;
