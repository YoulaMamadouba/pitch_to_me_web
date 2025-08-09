'use client';

import Link from 'next/link';
import { ChevronLeft, Headset } from 'lucide-react';
import VRSceneCard from '@/components/vr-scene-card';

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
};

export default function VRScenesPage() {
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
      color: 'red' as const
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
      color: 'gray' as const
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
      color: 'blue' as const
    },
    {
      id: 'classroom',
      title: 'University Classroom',
      description: 'Teach and present to engaged students in academic setting',
      image: 'https://images.unsplash.com/photo-1523050854058-8df90110c9d1?w=400&h=300&fit=crop',
      difficulty: 'Beginner' as const,
      duration: '10 min',
      tag: 'EDU',
      rating: 4.6,
      color: 'green' as const
    }
  ];

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-900 via-blue-900 to-gray-900 text-white">
      {/* Header */}
      <header className="fixed top-0 left-0 right-0 z-50 bg-black/70 backdrop-blur-md border-b border-gray-800">
        <div className="container mx-auto px-6 py-4 flex items-center justify-between">
          <Link href="/dashboard" className="text-gray-300 hover:text-white">
            <ChevronLeft className="w-6 h-6" />
          </Link>
          <h1 className="text-lg font-bold">VR Practice</h1>
          <div className="bg-gradient-to-r from-yellow-400 to-yellow-500 text-black text-xs px-2 py-1 rounded-full font-bold">
            PREMIUM
          </div>
        </div>
      </header>

      <main className="container mx-auto px-4 pt-24 pb-8">
        {/* Hero Section */}
        <div className="text-center mb-8">
          <div className="w-16 h-16 bg-gradient-to-r from-cyan-400 to-cyan-500 rounded-full mx-auto mb-4 flex items-center justify-center shadow-lg shadow-cyan-500/30">
            <svg xmlns="http://www.w3.org/2000/svg" className="h-8 w-8 text-black" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 12a3 3 0 11-6 0 3 3 0 016 0z" />
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M2.458 12C3.732 7.943 7.523 5 12 5c4.478 0 8.268 2.943 9.542 7-1.274 4.057-5.064 7-9.542 7-4.477 0-8.268-2.943-9.542-7z" />
            </svg>
          </div>
          <h2 className="text-2xl font-bold mb-2">Choose Your Stage</h2>
          <p className="text-gray-300">Practice in realistic VR environments</p>
        </div>

        {/* VR Scenes Grid */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6 max-w-6xl mx-auto">
          {scenes.map((scene) => (
            <VRSceneCard
              key={scene.id}
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
          ))}
        </div>
      </main>

      {/* Bottom Info */}
      <div className="bg-black/30 border-t border-gray-800 p-6 mt-12">
        <div className="container mx-auto max-w-6xl">
          <div className="flex flex-col items-center justify-center space-y-2">
            <div className="flex items-center space-x-2">
              <Headset className="w-5 h-5 text-cyan-400" />
              <span className="text-sm font-medium">VR Headset Required</span>
            </div>
            <p className="text-xs text-gray-400 text-center">Compatible with Oculus, HTC Vive, and PlayStation VR</p>
          </div>
        </div>
      </div>
    </div>
  );
}

