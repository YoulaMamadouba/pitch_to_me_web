'use client';

import React, { useState, JSX } from 'react';
import Link from 'next/link';
import { ArrowLeft, Share2, Plus, Star, Clock, Users, Layout, Calendar, BarChart2, Users as TeamIcon, Check } from 'lucide-react';
import './presentation-builder.css';

interface Slide {
  id: number;
  title: string;
  type: string;
  active: boolean;
}

interface AISuggestion {
  id: number;
  icon: React.ReactNode;
  title: string;
  description: string;
  buttonText: string;
  bgColor: string;
  borderColor: string;
  iconBg: string;
}

interface Template {
  id: number;
  title: string;
  icon: React.ReactNode;
  gradient: string;
}

export default function PresentationBuilder() {
  const [activeSlide, setActiveSlide] = useState<number>(1);

  const slides: Slide[] = [
    { id: 1, title: 'Title Slide', type: 'Introduction', active: true },
    { id: 2, title: 'Market Analysis', type: 'Data & Charts', active: false },
    { id: 3, title: 'Strategy Overview', type: 'Key Points', active: false },
    { id: 4, title: 'Goals & KPIs', type: 'Metrics', active: false },
  ];

  const aiSuggestions: AISuggestion[] = [
    {
      id: 1,
      icon: <Star className="w-4 h-4" />,
      title: 'Add Visual Impact',
      description: 'Consider adding an infographic to slide 2 for better data visualization',
      buttonText: 'Apply',
      bgColor: 'bg-blue-900/30',
      borderColor: 'border-blue-600',
      iconBg: 'bg-blue-600',
    },
    {
      id: 2,
      icon: <Clock className="w-4 h-4" />,
      title: 'Timing Optimization',
      description: 'Slide 3 has too much content for a 2-minute segment. Consider splitting it.',
      buttonText: 'Split Slide',
      bgColor: 'bg-green-900/30',
      borderColor: 'border-green-600',
      iconBg: 'bg-green-600',
    },
  ];

  const templates: Template[] = [
    {
      id: 1,
      title: 'Data',
      icon: <BarChart2 className="w-6 h-6 text-white" />,
      gradient: 'from-blue-400 to-blue-600',
    },
    {
      id: 2,
      title: 'Timeline',
      icon: <Calendar className="w-6 h-6 text-white" />,
      gradient: 'from-green-400 to-green-600',
    },
    {
      id: 3,
      title: 'Team',
      icon: <TeamIcon className="w-6 h-6 text-white" />,
      gradient: 'from-purple-400 to-purple-600',
    },
  ];

  const renderSlidePreview = (slide: Slide) => {
    return (
      <div 
        key={slide.id}
        className={`slide-preview ${slide.active ? 'active' : ''} bg-white/5 rounded-lg p-3 border-2 ${slide.active ? 'border-yellow-400 shadow-yellow-400/20' : 'border-white/20'} transition-all duration-300 hover:scale-105`}
        onClick={() => setActiveSlide(slide.id)}
      >
        <div className="bg-gray-700/50 rounded h-16 mb-2 flex items-center justify-center">
          {slide.id === 1 && (
            <div className="text-center">
              <div className="w-8 h-1 bg-white/80 rounded mb-1 mx-auto"></div>
              <div className="w-6 h-1 bg-white/40 rounded mb-1 mx-auto"></div>
              <div className="w-4 h-1 bg-white/40 rounded mx-auto"></div>
            </div>
          )}
          {slide.id === 2 && (
            <div className="grid grid-cols-2 gap-1 w-8">
              <div className="h-2 bg-cyan-400 rounded"></div>
              <div className="h-2 bg-yellow-400 rounded"></div>
              <div className="h-2 bg-green-400 rounded"></div>
              <div className="h-2 bg-purple-400 rounded"></div>
            </div>
          )}
          {slide.id === 3 && (
            <div className="space-y-1">
              <div className="w-8 h-1 bg-white/80 rounded"></div>
              <div className="w-6 h-1 bg-white/40 rounded"></div>
              <div className="w-7 h-1 bg-white/40 rounded"></div>
            </div>
          )}
          {slide.id === 4 && (
            <div className="w-6 h-6 border-2 border-green-400 rounded-full flex items-center justify-center">
              <div className="w-2 h-2 bg-green-400 rounded-full"></div>
            </div>
          )}
        </div>
        <p className="text-white text-xs font-medium">{slide.id}. {slide.title}</p>
        <p className="text-gray-400 text-xs">{slide.type}</p>
      </div>
    );
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-900 to-gray-800 text-white">
      {/* Fixed Header */}
      <header className="fixed top-0 left-0 right-0 z-50 bg-gray-900/90 backdrop-blur-sm border-b border-gray-700">
        <div className="container mx-auto px-4 py-4 flex items-center justify-between">
          <Link href="/dashboard" className="flex items-center text-gray-300 hover:text-white transition-colors">
            <ArrowLeft className="w-6 h-6" />
            <span className="ml-1">Back</span>
          </Link>
          <h1 className="text-xl font-bold">Presentation Builder</h1>
          <button className="text-gray-300 hover:text-white transition-colors">
            <Share2 className="w-6 h-6" />
          </button>
        </div>
      </header>

      <main className="container mx-auto px-4 pt-28 pb-32 max-w-4xl">
        {/* Presentation Info */}
        <div className="bg-gradient-to-r from-purple-500 to-purple-600 rounded-2xl p-5 mb-6 shadow-lg">
          <h2 className="text-white font-bold text-xl mb-3">Q3 Marketing Strategy</h2>
          <div className="flex flex-wrap items-center gap-4 text-white/90 text-sm">
            <div className="flex items-center space-x-1.5">
              <Layout className="w-4 h-4" />
              <span>8 slides</span>
            </div>
            <div className="flex items-center space-x-1.5">
              <Clock className="w-4 h-4" />
              <span>15 min</span>
            </div>
            <div className="flex items-center space-x-1.5">
              <Users className="w-4 h-4" />
              <span>Board meeting</span>
            </div>
          </div>
        </div>

        {/* Slide Overview */}
        <div className="mb-8">
          <div className="flex items-center justify-between mb-4">
            <h3 className="text-white font-semibold text-lg">Slides Overview</h3>
            <button className="bg-yellow-500 hover:bg-yellow-600 text-gray-900 px-4 py-2 rounded-xl text-sm font-medium flex items-center transition-colors">
              <Plus className="w-4 h-4 mr-1" />
              Add Slide
            </button>
          </div>
          
          <div className="grid grid-cols-2 gap-3">
            {slides.map(slide => renderSlidePreview(slide))}
          </div>
        </div>

        {/* AI Suggestions */}
        <div className="mb-8">
          <h3 className="text-white font-semibold text-lg mb-4">AI Suggestions</h3>
          <div className="space-y-3">
            {aiSuggestions.map(suggestion => (
              <div 
                key={suggestion.id}
                className={`${suggestion.bgColor} border ${suggestion.borderColor} rounded-xl p-4 animate-fade-in`}
              >
                <div className="flex items-start space-x-3">
                  <div className={`${suggestion.iconBg} w-8 h-8 rounded-full flex items-center justify-center flex-shrink-0`}>
                    {suggestion.icon}
                  </div>
                  <div className="flex-1">
                    <h4 className="text-white font-medium text-sm mb-1">{suggestion.title}</h4>
                    <p className="text-gray-300 text-xs mb-2">{suggestion.description}</p>
                    <button className="${suggestion.iconBg} text-white px-3 py-1 rounded-lg text-xs font-medium hover:opacity-90 transition-opacity">
                      {suggestion.buttonText}
                    </button>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Quick Templates */}
        <div className="mb-8">
          <h3 className="text-white font-semibold text-lg mb-4">Quick Templates</h3>
          <div className="grid grid-cols-3 gap-3">
            {templates.map(template => (
              <div 
                key={template.id}
                className="template-card bg-white/5 rounded-xl p-3 border border-white/10 hover:border-white/20 transition-all hover:-translate-y-0.5 hover:shadow-lg"
              >
                <div className={`bg-gradient-to-br ${template.gradient} rounded-lg h-12 mb-2 flex items-center justify-center`}>
                  {template.icon}
                </div>
                <p className="text-white text-xs font-medium text-center">{template.title}</p>
              </div>
            ))}
          </div>
        </div>
      </main>

      {/* Fixed Bottom Action Buttons */}
      <div className="fixed bottom-0 left-0 right-0 bg-gray-900/95 backdrop-blur-md border-t border-gray-800 py-4 px-6">
        <div className="max-w-2xl mx-auto w-full">
          <div className="grid grid-cols-2 gap-3 mb-3">
            <button className="bg-gray-700 hover:bg-gray-600 text-white font-medium py-3 rounded-xl border border-gray-600 transition-colors flex items-center justify-center">
              <svg className="w-4 h-4 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 12a3 3 0 11-6 0 3 3 0 016 0z" />
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M2.458 12C3.732 7.943 7.523 5 12 5c4.478 0 8.268 2.943 9.542 7-1.274 4.057-5.064 7-9.542 7-4.477 0-8.268-2.943-9.542-7z" />
              </svg>
              Preview
            </button>
            <button className="bg-purple-600 hover:bg-purple-700 text-white font-medium py-3 rounded-xl transition-colors flex items-center justify-center">
              <svg className="w-4 h-4 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9.663 17h4.673M12 3v1m6.364 1.636l-.707.707M21 12h-1M4 12H3m3.343-5.657l-.707-.707m2.828 9.9a5 5 0 117.072 0l-.548.547A3.374 3.374 0 0014 18.469V19a2 2 0 11-4 0v-.531c0-.895-.356-1.754-.988-2.386l-.548-.547z" />
              </svg>
              Practice Mode
            </button>
          </div>
          <button className="w-full bg-gradient-to-r from-yellow-400 to-yellow-500 hover:from-yellow-500 hover:to-yellow-600 text-gray-900 font-semibold py-4 rounded-xl transition-all hover:shadow-lg flex items-center justify-center">
            <svg className="w-5 h-5 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M14.752 11.168l-3.197-2.132A1 1 0 0010 9.87v4.263a1 1 0 001.555.832l3.197-2.132a1 1 0 000-1.664z" />
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
            </svg>
            Start VR Presentation
          </button>
        </div>
      </div>
    </div>
  );
}
