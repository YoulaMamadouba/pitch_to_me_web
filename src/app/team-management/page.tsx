'use client';

import React, { useState } from 'react';
import Link from 'next/link';
import { 
  ChevronLeft, 
  Plus, 
  Download, 
  Filter, 
  Search, 
  Users, 
  CheckCircle, 
  Clock, 
  X, 
  ChevronDown,
  BarChart2,
  Send,
  FileText,
  AlertCircle,
  MoreHorizontal,
  ArrowRight
} from 'lucide-react';

const TeamManagementPage = () => {
  const [selectedMembers, setSelectedMembers] = useState<string[]>([]);
  const [searchQuery, setSearchQuery] = useState('');
  const [activeFilter, setActiveFilter] = useState('all');

  // Team members data
  const teamMembers = [
    {
      id: '1',
      name: 'Alex Martin',
      role: 'Senior Sales Rep',
      level: 7,
      status: 'online',
      progress: 100,
      lastActive: '2h ago',
      avatar: 'https://images.unsplash.com/photo-1472099645785-5658abf4ff4e?w=100&h=100&fit=crop&crop=face',
      completionStatus: 'complete'
    },
    {
      id: '2',
      name: 'Sarah Chen',
      role: 'Sales Manager',
      level: 5,
      status: 'away',
      progress: 75,
      lastActive: '1d ago',
      avatar: 'https://images.unsplash.com/photo-1494790108755-2616b612b786?w=100&h=100&fit=crop&crop=face',
      completionStatus: 'in-progress'
    },
    {
      id: '3',
      name: 'Marcus Johnson',
      role: 'Junior Sales Rep',
      level: 3,
      status: 'offline',
      progress: 25,
      lastActive: '5d ago',
      avatar: 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=100&h=100&fit=crop&crop=face',
      completionStatus: 'behind'
    },
    {
      id: '4',
      name: 'Emma Wilson',
      role: 'Account Executive',
      level: 6,
      status: 'online',
      progress: 100,
      lastActive: '30m ago',
      avatar: 'https://images.unsplash.com/photo-1438761681033-6461ffad8d80?w=100&h=100&fit=crop&crop=face',
      completionStatus: 'complete'
    },
  ];

  // Filter team members based on search and active filter
  const filteredMembers = teamMembers.filter(member => {
    const matchesSearch = member.name.toLowerCase().includes(searchQuery.toLowerCase()) || 
                         member.role.toLowerCase().includes(searchQuery.toLowerCase());
    const matchesFilter = activeFilter === 'all' || 
                         (activeFilter === 'complete' && member.completionStatus === 'complete') ||
                         (activeFilter === 'in-progress' && member.completionStatus === 'in-progress') ||
                         (activeFilter === 'behind' && member.completionStatus === 'behind');
    return matchesSearch && matchesFilter;
  });

  // Toggle member selection
  const toggleMemberSelection = (id: string) => {
    setSelectedMembers(prev => 
      prev.includes(id) 
        ? prev.filter(memberId => memberId !== id)
        : [...prev, id]
    );
  };

  // Clear all selections
  const clearSelections = () => {
    setSelectedMembers([]);
  };

  return (
    <div className="min-h-screen bg-gradient-to-b from-gray-900 to-gray-800 text-white">
      {/* Fixed Header */}
      <header className="fixed top-0 left-0 right-0 z-50 bg-gray-900/90 backdrop-blur-sm border-b border-gray-800/50">
        <div className="container mx-auto px-4 py-3">
          <div className="flex items-center justify-between">
            <div className="flex items-center space-x-2">
              <Link href="/b2b" className="p-1.5 rounded-lg hover:bg-white/10 transition-colors flex items-center">
                <ChevronLeft className="w-5 h-5 text-gray-300" />
              </Link>
              <h1 className="text-lg font-semibold flex items-center">
                <Users className="w-4 h-4 mr-2 text-purple-400" />
                Team Management
              </h1>
            </div>
            <div className="flex items-center space-x-2">
              <button className="p-1.5 rounded-lg hover:bg-white/10 transition-colors text-gray-300 hover:text-white">
                <Plus className="w-5 h-5" />
              </button>
            </div>
          </div>
        </div>
      </header>

      {/* Main Content */}
      <main className="pt-20 pb-24 max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Team Overview Card */}
        <div className="mb-6">
          <div className="bg-gradient-to-r from-purple-500 to-indigo-600 rounded-xl p-5 shadow-lg">
            <div className="flex items-center justify-between">
              <div>
                <h2 className="text-xl font-bold text-white">Sales Team</h2>
                <p className="text-purple-100 text-sm">25 members • 92% completion rate</p>
              </div>
              <div className="relative w-14 h-14">
                <svg className="w-14 h-14" viewBox="0 0 42 42">
                  <circle cx="21" cy="21" r="19" fill="none" stroke="rgba(255,255,255,0.3)" strokeWidth="4" />
                  <circle 
                    cx="21" 
                    cy="21" 
                    r="19" 
                    fill="none" 
                    stroke="white" 
                    strokeWidth="4" 
                    strokeLinecap="round"
                    strokeDasharray="119.4" 
                    strokeDashoffset="9.55"
                  />
                </svg>
                <div className="absolute inset-0 flex items-center justify-center">
                  <span className="text-white font-bold text-sm">92%</span>
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Quick Actions */}
        <div className="mb-6">
          <h3 className="text-sm font-semibold text-gray-300 mb-3">Quick Actions</h3>
          <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
            <button className="bg-gradient-to-r from-green-500 to-emerald-500 hover:from-green-600 hover:to-emerald-600 text-white font-medium py-3 px-2 rounded-xl transition-all duration-200 transform hover:-translate-y-0.5 hover:shadow-lg">
              <div className="flex flex-col items-center space-y-1">
                <Plus className="w-5 h-5" />
                <span className="text-xs">Add Members</span>
              </div>
            </button>

            <button className="bg-gradient-to-r from-blue-500 to-indigo-500 hover:from-blue-600 hover:to-indigo-600 text-white font-medium py-3 px-2 rounded-xl transition-all duration-200 transform hover:-translate-y-0.5 hover:shadow-lg">
              <div className="flex flex-col items-center space-y-1">
                <FileText className="w-5 h-5" />
                <span className="text-xs">Assign Modules</span>
              </div>
            </button>

            <button className="bg-gradient-to-r from-amber-400 to-yellow-500 hover:from-amber-500 hover:to-yellow-600 text-gray-900 font-medium py-3 px-2 rounded-xl transition-all duration-200 transform hover:-translate-y-0.5 hover:shadow-lg">
              <div className="flex flex-col items-center space-y-1">
                <BarChart2 className="w-5 h-5" />
                <span className="text-xs">View Reports</span>
              </div>
            </button>

            <button className="bg-gradient-to-r from-rose-500 to-pink-500 hover:from-rose-600 hover:to-pink-600 text-white font-medium py-3 px-2 rounded-xl transition-all duration-200 transform hover:-translate-y-0.5 hover:shadow-lg">
              <div className="flex flex-col items-center space-y-1">
                <Send className="w-5 h-5" />
                <span className="text-xs">Send Reminders</span>
              </div>
            </button>
          </div>
        </div>

        {/* Team Members Section */}
        <div>
          <div className="flex flex-col sm:flex-row sm:items-center justify-between mb-4 gap-3">
            <h3 className="text-sm font-semibold text-gray-300">Team Members</h3>
            <div className="flex items-center space-x-2">
              <div className="relative">
                <select 
                  className="bg-gray-800 border border-gray-700 text-gray-300 text-xs rounded-lg pl-3 pr-8 py-2 appearance-none focus:outline-none focus:ring-2 focus:ring-purple-500 focus:border-transparent"
                  value={activeFilter}
                  onChange={(e) => setActiveFilter(e.target.value)}
                >
                  <option value="all">All Members</option>
                  <option value="complete">Completed</option>
                  <option value="in-progress">In Progress</option>
                  <option value="behind">Behind</option>
                </select>
                <div className="pointer-events-none absolute inset-y-0 right-0 flex items-center px-2 text-gray-400">
                  <ChevronDown className="w-4 h-4" />
                </div>
              </div>
              <div className="relative">
                <Search className="w-4 h-4 text-gray-400 absolute left-3 top-1/2 transform -translate-y-1/2" />
                <input
                  type="text"
                  placeholder="Search team..."
                  className="bg-gray-800 border border-gray-700 text-gray-300 text-xs rounded-lg pl-10 pr-4 py-2 w-full focus:outline-none focus:ring-2 focus:ring-purple-500 focus:border-transparent"
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                />
                {searchQuery && (
                  <button 
                    onClick={() => setSearchQuery('')}
                    className="absolute right-3 top-1/2 transform -translate-y-1/2 text-gray-400 hover:text-white"
                  >
                    <X className="w-4 h-4" />
                  </button>
                )}
              </div>
            </div>
          </div>

          {/* Team Members List */}
          <div className="space-y-3">
            {filteredMembers.map((member) => (
              <div 
                key={member.id} 
                className={`bg-white/5 backdrop-blur-sm rounded-xl p-4 border transition-all duration-200 ${
                  selectedMembers.includes(member.id) 
                    ? 'border-purple-500/50 bg-purple-500/10' 
                    : 'border-white/10 hover:border-white/20'
                }`}
              >
                <div className="flex items-center space-x-3">
                  <div className="relative">
                    <img 
                      src={member.avatar} 
                      alt={member.name} 
                      className="w-12 h-12 rounded-full border-2 border-white/20"
                    />
                    <span className={`absolute -bottom-1 -right-1 w-3.5 h-3.5 rounded-full border-2 border-gray-900 ${
                      member.status === 'online' ? 'bg-green-500' : 
                      member.status === 'away' ? 'bg-yellow-500' : 'bg-gray-500'
                    }`}></span>
                  </div>
                  <div className="flex-1 min-w-0">
                    <div className="flex items-center justify-between">
                      <h4 className="text-sm font-medium text-white truncate">{member.name}</h4>
                      <span className={`text-xs px-2 py-0.5 rounded-full ${
                        member.completionStatus === 'complete' ? 'bg-green-900/30 text-green-400' :
                        member.completionStatus === 'in-progress' ? 'bg-yellow-900/30 text-yellow-400' :
                        'bg-red-900/30 text-red-400'
                      }`}>
                        {member.completionStatus === 'complete' ? 'Complete' :
                         member.completionStatus === 'in-progress' ? 'In Progress' : 'Behind'}
                      </span>
                    </div>
                    <p className="text-xs text-gray-400 truncate">{member.role} • Level {member.level}</p>
                    <div className="flex items-center justify-between mt-1.5">
                      <div className="flex items-center space-x-2">
                        <div className="w-16 bg-gray-700 rounded-full h-1.5">
                          <div 
                            className={`h-full rounded-full ${
                              member.progress === 100 ? 'bg-green-400' :
                              member.progress > 50 ? 'bg-yellow-400' : 'bg-red-400'
                            }`} 
                            style={{ width: `${member.progress}%` }}
                          />
                        </div>
                        <span className="text-xs text-gray-400">{member.progress}%</span>
                      </div>
                      <span className="text-xs text-gray-500">Last active: {member.lastActive}</span>
                    </div>
                  </div>
                  <button className="text-gray-400 hover:text-white p-1">
                    <MoreHorizontal className="w-5 h-5" />
                  </button>
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Bulk Actions Footer */}
        {selectedMembers.length > 0 && (
          <div className="fixed bottom-4 left-0 right-0 px-4">
            <div className="bg-gray-800/90 backdrop-blur-md rounded-xl p-4 shadow-xl border border-gray-700/50 max-w-4xl mx-auto">
              <div className="flex items-center justify-between">
                <div className="flex items-center space-x-2">
                  <button 
                    onClick={clearSelections}
                    className="p-1.5 rounded-lg hover:bg-white/10 transition-colors"
                  >
                    <X className="w-4 h-4 text-gray-300" />
                  </button>
                  <span className="text-sm text-gray-300">{selectedMembers.length} selected</span>
                </div>
                <div className="flex space-x-2">
                  <button className="bg-blue-600 hover:bg-blue-700 text-white text-xs font-medium px-3 py-1.5 rounded-lg flex items-center space-x-1">
                    <FileText className="w-3.5 h-3.5" />
                    <span>Assign</span>
                  </button>
                  <button className="bg-red-600 hover:bg-red-700 text-white text-xs font-medium px-3 py-1.5 rounded-lg flex items-center space-x-1">
                    <X className="w-3.5 h-3.5" />
                    <span>Remove</span>
                  </button>
                </div>
              </div>
            </div>
          </div>
        )}
      </main>
    </div>
  );
};

export default TeamManagementPage;
