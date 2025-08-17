'use client';

import { Clock, User, Video, Calendar, Clock3 } from 'lucide-react';
import Image from 'next/image';

interface SessionCardProps {
  id: string;
  studentName: string;
  studentAvatar: string;
  date: string;
  duration: number; // en minutes
  status: 'scheduled' | 'completed' | 'cancelled';
  module?: string;
  notes?: string;
}

export default function SessionCard({
  id,
  studentName,
  studentAvatar,
  date,
  duration,
  status,
  module,
  notes
}: SessionCardProps) {
  const statusColors = {
    scheduled: 'bg-blue-500/10 text-blue-400',
    completed: 'bg-green-500/10 text-green-400',
    cancelled: 'bg-red-500/10 text-red-400'
  };

  const formattedDate = new Date(date).toLocaleDateString('fr-FR', {
    day: '2-digit',
    month: 'short',
    year: 'numeric',
    hour: '2-digit',
    minute: '2-digit'
  });

  return (
    <div className="bg-gray-800/50 backdrop-blur-sm rounded-xl p-4 border border-gray-700/50 hover:border-yellow-400/30 transition-all">
      <div className="flex items-start justify-between">
        <div className="flex items-start space-x-3">
          <div className="relative">
            <Image
              src={studentAvatar}
              alt={studentName}
              width={40}
              height={40}
              className="w-10 h-10 rounded-full border-2 border-yellow-400/30 object-cover"
            />
            <div className={`absolute -bottom-1 -right-1 w-3 h-3 rounded-full border-2 border-gray-800 ${
              status === 'scheduled' ? 'bg-blue-400' : 
              status === 'completed' ? 'bg-green-400' : 'bg-red-400'
            }`}></div>
          </div>
          
          <div>
            <h3 className="font-medium text-white">{studentName}</h3>
            <div className="flex items-center text-sm text-gray-400 mt-1">
              <Calendar className="w-3.5 h-3.5 mr-1.5" />
              <span>{formattedDate}</span>
              <Clock3 className="w-3.5 h-3.5 ml-3 mr-1.5" />
              <span>{duration} min</span>
              {module && (
                <>
                  <span className="mx-2">•</span>
                  <span className="text-yellow-400">{module}</span>
                </>
              )}
            </div>
            
            {notes && (
              <p className="text-sm text-gray-400 mt-2 line-clamp-2">{notes}</p>
            )}
          </div>
        </div>
        
        <div className="flex space-x-2">
          <button className="p-1.5 rounded-lg bg-gray-700/50 hover:bg-gray-600/50 transition-colors">
            <Video className="w-4 h-4 text-gray-300" />
          </button>
          <button className="p-1.5 rounded-lg bg-gray-700/50 hover:bg-gray-600/50 transition-colors">
            <User className="w-4 h-4 text-gray-300" />
          </button>
        </div>
      </div>
      
      <div className="flex items-center justify-between mt-3 pt-3 border-t border-gray-700/50">
        <span className={`text-xs px-2 py-1 rounded-full ${statusColors[status]}`}>
          {status === 'scheduled' ? 'Planifiée' : 
           status === 'completed' ? 'Terminée' : 'Annulée'}
        </span>
        
        <div className="flex space-x-2">
          <button className="text-xs px-3 py-1 bg-gray-700 hover:bg-gray-600 text-white rounded-full transition-colors">
            Détails
          </button>
          {status === 'scheduled' && (
            <button className="text-xs px-3 py-1 bg-yellow-500 hover:bg-yellow-600 text-black font-medium rounded-full transition-colors">
              Rejoindre
            </button>
          )}
        </div>
      </div>
    </div>
  );
}
