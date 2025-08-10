'use client';

import React, { useState } from 'react';
import Link from 'next/link';
import { 
  ArrowLeft, 
  Download, 
  Calendar, 
  ChevronUp, 
  ChevronDown, 
  CheckCircle2, 
  Clock, 
  Star, 
  DollarSign, 
  BarChart2, 
  TrendingUp, 
  AlertTriangle,
  Users,
  Zap,
  Trophy,
  Award,
  Lightbulb,
  AlertCircle,
  ChevronRight,
  ArrowUpRight,
  ArrowDownRight,
  ChevronLeft,
  MoreVertical
} from 'lucide-react';

export default function CompanyAnalyticsPage() {
  const [timeRange, setTimeRange] = useState('Q3 2024');
  const [isMenuOpen, setIsMenuOpen] = useState(false);

  // Key metrics data
  const metrics = [
    {
      id: 1,
      title: 'Completion',
      value: '87%',
      change: '+23%',
      icon: CheckCircle2,
      iconColor: 'text-green-400',
      bgColor: 'bg-green-900/30',
      borderColor: 'border-green-800/50',
      trend: 'up',
      description: 'vs 64% last quarter'
    },
    {
      id: 2,
      title: 'Training',
      value: '42h',
      change: '+15%',
      icon: Clock,
      iconColor: 'text-blue-400',
      bgColor: 'bg-blue-900/30',
      borderColor: 'border-blue-800/50',
      trend: 'up',
      description: 'per employee'
    },
    {
      id: 3,
      title: 'Satisfaction',
      value: '4.6',
      change: '+8%',
      icon: Star,
      iconColor: 'text-yellow-400',
      bgColor: 'bg-yellow-900/30',
      borderColor: 'border-yellow-800/50',
      trend: 'up',
      description: 'out of 5.0'
    },
    {
      id: 4,
      title: 'ROI',
      value: '$2.8M',
      change: '-12%',
      icon: DollarSign,
      iconColor: 'text-purple-400',
      bgColor: 'bg-purple-900/30',
      borderColor: 'border-purple-800/50',
      trend: 'down',
      description: 'estimated value'
    }
  ];

  // Department data for the chart
  const departments = [
    { name: 'Sales', value: 85, color: 'bg-green-400' },
    { name: 'Marketing', value: 72, color: 'bg-blue-400' },
    { name: 'HR', value: 68, color: 'bg-purple-400' },
    { name: 'IT', value: 45, color: 'bg-yellow-400' },
    { name: 'Finance', value: 38, color: 'bg-red-400' },
  ];

  // Insights data
  const insights = [
    {
      id: 1,
      type: 'success',
      title: 'Strong Performance',
      description: 'Sales team shows 23% improvement in presentation confidence scores',
      icon: TrendingUp,
      iconBg: 'bg-green-900/30',
      iconColor: 'text-green-400',
      borderColor: 'border-green-800/50'
    },
    {
      id: 2,
      type: 'warning',
      title: 'Attention Needed',
      description: 'Finance team engagement is 40% below company average',
      icon: AlertTriangle,
      iconBg: 'bg-yellow-900/30',
      iconColor: 'text-yellow-400',
      borderColor: 'border-yellow-800/50'
    }
  ];

  return (
    <div className="min-h-screen bg-gradient-to-b from-gray-900 to-gray-800 text-white">
      {/* Fixed Header */}
      <header className="fixed top-0 left-0 right-0 z-50 bg-gray-900/90 backdrop-blur-sm border-b border-gray-800/50">
        <div className="container mx-auto px-4 py-2">
          <div className="flex items-center justify-between">
            <div className="flex items-center space-x-2">
              <Link href="/b2b" className="p-1.5 rounded-lg hover:bg-white/10 transition-colors flex items-center">
                <ChevronLeft className="w-5 h-5 text-gray-300" />
              </Link>
              <h1 className="text-lg font-semibold flex items-center">
                <BarChart2 className="w-4 h-4 mr-2 text-blue-400" />
                Company Analytics
              </h1>
            </div>
            <div className="flex items-center space-x-2">
              <button className="p-1.5 rounded-lg hover:bg-white/10 transition-colors text-gray-300 hover:text-white">
                <Download className="w-4 h-4" />
              </button>
              <button className="p-1.5 text-gray-400 hover:text-white hover:bg-gray-700/50 rounded-lg transition-colors">
                <MoreVertical className="w-5 h-5" />
              </button>
            </div>
          </div>
        </div>
      </header>

      {/* Main Content */}
      <main className="pt-16 pb-4 max-w-6xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Company Overview - Compact Card */}
        <div className="mb-4">
          <div className="bg-gradient-to-r from-blue-500 to-blue-600 rounded-xl p-4 shadow-lg">
            <div className="flex items-center justify-between">
              <div>
                <h2 className="text-xl font-bold text-white">TechCorp Analytics</h2>
                <p className="text-blue-100 text-sm">Enterprise Plan • 150 employees</p>
              </div>
              <div className="text-right">
                <div className="text-xl font-bold text-white">{timeRange}</div>
                <p className="text-blue-100 text-xs">Current Period</p>
              </div>
            </div>
          </div>
        </div>

        {/* Key Metrics Grid - Single Row */}
        <div className="grid grid-cols-4 gap-3 mb-4">
          {metrics.map((metric) => {
            const Icon = metric.icon;
            return (
              <div 
                key={metric.id}
                className={`${metric.bgColor} backdrop-blur-sm rounded-xl p-4 border ${metric.borderColor} hover:border-opacity-70 transition-all duration-300 transform hover:-translate-y-0.5 hover:shadow-lg`}
              >
                <div className="flex justify-between items-start">
                  <div className={`w-9 h-9 rounded-lg flex items-center justify-center ${metric.iconColor} bg-black/20`}>
                    <Icon className="w-5 h-5" />
                  </div>
                  <span className={`text-[11px] font-medium px-1.5 py-0.5 rounded ${
                    metric.trend === 'up' ? 'bg-green-900/30 text-green-400' : 'bg-red-900/30 text-red-400'
                  }`}>
                    {metric.change}
                  </span>
                </div>
                <div className="mt-2">
                  <div className="text-xl font-bold text-white">{metric.value}</div>
                  <div className="text-xs font-medium text-gray-300 mt-0.5">{metric.title}</div>
                  <div className="text-[10px] text-gray-400 mt-0.5">{metric.description}</div>
                </div>
              </div>
            );
          })}
        </div>

        {/* Department Performance and ROI in a single row */}
        <div className="grid grid-cols-2 gap-4 mb-4">
          {/* Department Performance */}
          <div className="bg-white/5 backdrop-blur-sm rounded-xl p-3 border border-white/10 hover:border-blue-400/30 transition-all">
            <div className="flex items-center justify-between mb-3">
              <h3 className="text-xs font-semibold text-gray-300 flex items-center">
                <Users className="w-3.5 h-3.5 mr-1.5 text-blue-400" />
                Department Performance
              </h3>
              <div className="text-[10px] text-blue-400 flex items-center">
                <span>View All</span>
                <ChevronRight className="w-3 h-3 ml-0.5" />
              </div>
            </div>
            <div className="h-36 flex items-end justify-between space-x-1 px-0.5">
              {departments.map((dept, index) => (
                <div key={index} className="flex flex-col items-center flex-1">
                  <div className="relative w-full flex flex-col items-center">
                    <div 
                      className={`w-full ${dept.color} rounded-t-sm transition-all duration-500 hover:opacity-90`} 
                      style={{ height: `${dept.value * 1.2}px` }}
                    />
                    <div className={`absolute -bottom-5 text-[10px] font-bold ${dept.color.replace('bg-', 'text-')}`}>
                      {dept.value}%
                    </div>
                  </div>
                  <div className="text-[9px] text-center mt-4 text-gray-300 font-medium">
                    {dept.name}
                  </div>
                </div>
              ))}
            </div>
            <p className="text-center text-[10px] text-gray-400 mt-3">Completion rates by department</p>
          </div>

          {/* ROI Analysis */}
          <div className="bg-white/5 backdrop-blur-sm rounded-xl p-3 border border-white/10 hover:border-green-400/30 transition-all">
            <div className="flex items-center justify-between mb-3">
              <h3 className="text-xs font-semibold text-gray-300 flex items-center">
                <DollarSign className="w-3.5 h-3.5 mr-1.5 text-green-400" />
                ROI Analysis
              </h3>
              <div className="text-[10px] text-blue-400 flex items-center">
                <span>Details</span>
                <ChevronRight className="w-3 h-3 ml-0.5" />
              </div>
            </div>
            
            <div className="space-y-3">
              <div className="grid grid-cols-2 gap-2">
                <div>
                  <div className="text-[10px] text-gray-400">Investment</div>
                  <div className="text-base font-bold text-red-400">$125K</div>
                </div>
                <div>
                  <div className="text-[10px] text-gray-400">Returns</div>
                  <div className="text-base font-bold text-green-400">$2.8M</div>
                </div>
              </div>
              
              <div>
                <div className="h-1.5 bg-gray-700 rounded-full overflow-hidden mb-1">
                  <div 
                    className="h-full bg-gradient-to-r from-green-400 to-green-500 rounded-full transition-all duration-500"
                    style={{ width: '78%' }}
                  />
                </div>
                <div className="flex justify-between text-[10px]">
                  <span className="text-gray-300 font-medium">ROI: 2,240%</span>
                  <span className="text-green-400 font-medium">+340% vs avg</span>
                </div>
              </div>
              
              <div className="flex items-center justify-center mt-2">
                <div className="text-center">
                  <div className="text-[10px] text-gray-400">Per Employee</div>
                  <div className="text-xs font-bold text-white">$18,667</div>
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* AI Insights - Side by Side */}
        <div className="mb-4">
          <h3 className="text-xs font-semibold mb-2 text-gray-300 flex items-center">
            <Lightbulb className="w-3.5 h-3.5 mr-1.5 text-yellow-400" />
            AI Insights
          </h3>
          <div className="grid grid-cols-2 gap-3">
            {insights.map((insight) => {
              const Icon = insight.icon;
              return (
                <div 
                  key={insight.id}
                  className={`p-2.5 rounded-lg ${insight.iconBg} border ${insight.borderColor} hover:border-opacity-70 transition-all`}
                >
                  <div className="flex items-start">
                    <div className={`p-1 rounded-md ${insight.iconBg} border ${insight.borderColor} mr-2 flex-shrink-0`}>
                      <Icon className={`w-3.5 h-3.5 ${insight.iconColor}`} />
                    </div>
                    <div className="flex-1 min-w-0">
                      <h4 className={`text-xs font-medium ${insight.iconColor}`}>
                        {insight.title}
                      </h4>
                      <p className="text-[10px] text-gray-300 mt-0.5 leading-relaxed">{insight.description}</p>
                    </div>
                  </div>
                </div>
              );
            })}
          </div>
        </div>

        {/* Action Buttons - Compact */}
        <div className="flex gap-3 mt-4">
          <button className="group flex-1 bg-gradient-to-r from-blue-500 to-cyan-500 hover:from-blue-600 hover:to-cyan-600 text-white text-sm font-medium py-2 px-3 rounded-lg transition-all duration-200 transform hover:-translate-y-0.5 hover:shadow-md flex items-center justify-center">
            <Download className="w-3.5 h-3.5 mr-1.5 group-hover:scale-110 transition-transform" />
            <span>Export Report</span>
          </button>
          <button className="group flex-1 bg-white/5 hover:bg-white/10 text-white text-sm font-medium py-2 px-3 rounded-lg border border-white/10 transition-all duration-200 transform hover:-translate-y-0.5 hover:shadow-md flex items-center justify-center">
            <Calendar className="w-3.5 h-3.5 mr-1.5 group-hover:scale-110 transition-transform" />
            <span>Schedule Review</span>
          </button>
        </div>
      </main>
    </div>
  );
}
