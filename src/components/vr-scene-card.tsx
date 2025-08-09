'use client';

import { motion } from 'framer-motion';
import { Star } from 'lucide-react';
import Link from 'next/link';

interface VRSceneCardProps {
  id: string;
  title: string;
  description: string;
  image: string;
  difficulty: 'Beginner' | 'Intermediate' | 'Advanced';
  duration: string;
  tag: string;
  rating: number;
  color: string;
}

export default function VRSceneCard({
  id,
  title,
  description,
  image,
  difficulty,
  duration,
  tag,
  rating,
  color
}: VRSceneCardProps) {
  const difficultyColors = {
    Beginner: 'bg-green-600',
    Intermediate: 'bg-yellow-600',
    Advanced: 'bg-red-600'
  };

  const colorGradients = {
    red: 'from-red-900 to-red-700',
    gray: 'from-gray-800 to-gray-700',
    blue: 'from-blue-900 to-blue-700',
    green: 'from-green-900 to-green-700'
  };

  return (
    <motion.div 
      className="scene-card bg-gradient-to-r rounded-xl overflow-hidden shadow-lg hover:shadow-xl transition-all duration-300 transform hover:-translate-y-1"
      whileHover={{ scale: 1.01 }}
    >
      <div className={`bg-gradient-to-r ${colorGradients[color as keyof typeof colorGradients] || colorGradients.blue} h-32 relative`}>
        <img 
          src={image} 
          alt={title}
          className="w-full h-full object-cover opacity-50"
        />
        <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-transparent to-transparent"></div>
        <div className="absolute top-2 right-2 bg-black/60 text-white text-xs px-2 py-1 rounded font-bold">
          {tag}
        </div>
      </div>
      <div className="p-4">
        <div className="flex items-center justify-between mb-2">
          <h3 className="text-white font-semibold text-lg">{title}</h3>
          <div className="flex items-center space-x-1">
            <Star className="w-4 h-4 text-yellow-400 fill-yellow-400" />
            <span className="text-yellow-400 text-sm">{rating}</span>
          </div>
        </div>
        <p className="text-gray-300 text-sm mb-3">{description}</p>
        <div className="flex items-center justify-between">
          <div className="flex items-center space-x-2">
            <span className={`text-xs text-white px-2 py-1 rounded ${difficultyColors[difficulty]}`}>
              {difficulty}
            </span>
            <span className="text-xs text-gray-400">{duration}</span>
          </div>
          <Link 
            href={`/vr-scenes/${id}`}
            className="bg-white text-gray-800 hover:bg-gray-100 px-4 py-2 rounded-lg text-sm font-medium transition-colors"
          >
            Enter VR
          </Link>
        </div>
      </div>
    </motion.div>
  );
}
