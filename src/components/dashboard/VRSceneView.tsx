'use client';

import { Headset } from 'lucide-react';
import VRSceneCard from '@/components/vr-scene-card';
import { useState } from 'react';
import { motion } from 'framer-motion';

type Scene = {
  id: string;
  title: string;
  description: string;
  image: string;
  difficulty: 'Beginner' | 'Intermediate' | 'Advanced';
  duration: string;
  tag: string;
  rating: number;
  color: 'red' | 'blue' | 'green' | 'gray';
  audience: number;
  audienceAttention: number;
  confidence: 'High' | 'Medium';
};

interface VRSceneViewProps {
  onSceneSelect: (sceneId: string) => void;
  onBack?: () => void;
}

export default function VRSceneView({ onSceneSelect, onBack }: VRSceneViewProps) {
  const [selectedCategory, setSelectedCategory] = useState('all');

  const scenes: Scene[] = [
    {
      id: 'tedx',
      title: 'TEDx Talk Stage',
      description: 'Present to 500+ audience members on the iconic red circle',
      image: 'https://images.unsplash.com/photo-1540575467063-178a50c2df87?w=400&h=300&fit=crop',
      difficulty: 'Advanced' as const,
      duration: '18 min',
      tag: 'TEDx',
      rating: 4.9,
      color: 'red' as const,
      audience: 487,
      audienceAttention: 94,
      confidence: 'High'
    },
    {
      id: 'boardroom',
      title: 'Executive Boardroom',
      description: 'Pitch to C-level executives in a luxury boardroom setting',
      image: 'https://images.unsplash.com/photo-1497366216548-37526070297c?w=400&h=300&fit=crop',
      difficulty: 'Intermediate' as const,
      duration: '12 min',
      tag: 'EXEC',
      rating: 4.7,
      color: 'gray' as const,
      audience: 12,
      audienceAttention: 88,
      confidence: 'Medium'
    },
    {
      id: 'one-to-one',
      title: 'One-to-One Meeting',
      description: 'Perfect your personal pitch in intimate conversation',
      image: 'https://images.unsplash.com/photo-1556761175-4b46a572b786?w=400&h=300&fit=crop',
      difficulty: 'Beginner' as const,
      duration: '8 min',
      tag: '1:1',
      rating: 4.8,
      color: 'blue' as const,
      audience: 2,
      audienceAttention: 92,
      confidence: 'High'
    },
    {
      id: 'classroom',
      title: 'University Classroom',
      description: 'Teach and present to engaged students in academic setting',
      image: 'https://images.unsplash.com/photo-1523580846011-d3a5bc25702b?auto=format&fit=crop&w=800&q=80',
      difficulty: 'Beginner' as const,
      duration: '10 min',
      tag: 'EDU',
      rating: 4.6,
      color: 'green' as const,
      audience: 20,
      audienceAttention: 90,
      confidence: 'Medium'
    }
  ];

  const handleSceneSelect = (sceneId: string) => {
    const scene = scenes.find(s => s.id === sceneId);
    if (scene) {
      sessionStorage.setItem('selectedScene', JSON.stringify(scene));
      onSceneSelect(sceneId);
    }
  };

  return (
    <motion.div 
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.5, delay: 0.1 }}
      className="bg-gray-800/80 backdrop-blur-sm rounded-xl shadow-lg p-6 border border-gray-700 hover:shadow-xl transition-all"
    >
      {/* Header */}
      <div className="mb-6">
        <div className="grid grid-cols-3 items-center">
          {/* Left: Back + Title */}
          <div className="flex items-center">
            {onBack && (
              <button 
                onClick={onBack}
                className="flex items-center text-gray-300 hover:text-white transition-colors text-sm mr-4"
              >
                <svg className="w-4 h-4 mr-1" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 19l-7-7 7-7" />
                </svg>
                <span>Retour</span>
              </button>
            )}
            <h1 className="text-xl font-bold text-white">VR Practice</h1>
          </div>

          {/* Center: Former footer info */}
          <div className="flex flex-col items-center justify-center text-center">
            <div className="flex items-center space-x-2">
              <Headset className="w-5 h-5 text-cyan-400" />
              <span className="text-sm font-medium text-white">VR Headset Required</span>
            </div>
            <p className="text-[11px] text-gray-400">Compatible with Oculus, HTC Vive, PlayStation VR</p>
          </div>

          {/* Right: Premium */}
          <div className="flex items-center justify-end">
            <div className="bg-gradient-to-r from-yellow-400 to-yellow-500 text-black text-xs px-2 py-1 rounded-full font-bold">
              PREMIUM
            </div>
          </div>
        </div>
      </div>

      {/* Hero Section */}
      <div className="text-center mb-8">
        <div className="w-16 h-16 bg-gradient-to-r from-cyan-400 to-cyan-500 rounded-full mx-auto mb-4 flex items-center justify-center shadow-lg shadow-cyan-500/30">
          <svg xmlns="http://www.w3.org/2000/svg" className="h-8 w-8 text-black" fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 12a3 3 0 11-6 0 3 3 0 016 0z" />
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M2.458 12C3.732 7.943 7.523 5 12 5c4.478 0 8.268 2.943 9.542 7-1.274 4.057-5.064 7-9.542 7-4.477 0-8.268-2.943-9.542-7z" />
          </svg>
        </div>
        <h2 className="text-2xl font-bold mb-2 text-white">Choose Your Stage</h2>
        <p className="text-gray-300">Practice in realistic VR environments</p>
      </div>

      {/* VR Scenes Grid */}
              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6 max-w-5xl mx-auto">
        {scenes.map((scene) => (
          <div 
            key={scene.id}
            onClick={() => handleSceneSelect(scene.id)}
            className="cursor-pointer"
          >
            <VRSceneCard
              id={scene.id}
              title={scene.title}
              description={scene.description}
              image={scene.image}
              difficulty={scene.difficulty}
              duration={scene.duration}
              tag={scene.tag}
              rating={scene.rating}
              color={scene.color}
            />
          </div>
        ))}
      </div>

      
    </motion.div>
  );
}
