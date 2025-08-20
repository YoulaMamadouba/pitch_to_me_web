'use client';

import React, { useState } from 'react';
import { Video, Play, CheckCircle } from 'lucide-react';
import MediaPipeAnalyzer from './MediaPipeAnalyzer';

interface VideoMotivationRecorderProps {
  onRecordingComplete?: (data: any) => void;
  onClose?: () => void;
}

export const VideoMotivationRecorder = ({ onRecordingComplete, onClose }: VideoMotivationRecorderProps) => {
  const [showAnalyzer, setShowAnalyzer] = useState(false);
  const [recordingData, setRecordingData] = useState<any>(null);
  const [isCompleted, setIsCompleted] = useState(false);

  const handleRecordingComplete = (data: any) => {
    setRecordingData(data);
    setIsCompleted(true);
    setShowAnalyzer(false);
    
    if (onRecordingComplete) {
      onRecordingComplete(data);
    }
  };

  const handleRetry = () => {
    setRecordingData(null);
    setIsCompleted(false);
    setShowAnalyzer(true);
  };

  if (showAnalyzer) {
    return (
      <MediaPipeAnalyzer
        onRecordingComplete={handleRecordingComplete}
        onClose={() => setShowAnalyzer(false)}
      />
    );
  }

  if (isCompleted && recordingData) {
    return (
      <div className="fixed inset-0 bg-black/80 backdrop-blur-sm z-50 flex items-center justify-center p-4">
        <div className="bg-gray-900 rounded-2xl p-6 max-w-2xl w-full">
          <div className="flex justify-between items-center mb-6">
            <h2 className="text-2xl font-bold text-white">Enregistrement Terminé</h2>
            <button
              onClick={onClose}
              className="text-gray-400 hover:text-white text-2xl"
            >
              ×
            </button>
          </div>

          <div className="text-center space-y-6">
            <div className="flex justify-center">
              <CheckCircle className="w-20 h-20 text-green-400" />
            </div>
            
            <div>
              <h3 className="text-xl font-semibold text-white mb-2">
                Analyse IA Complète
              </h3>
              <p className="text-gray-300 mb-4">
                Votre vidéo de motivation a été analysée avec succès !
              </p>
            </div>

            <div className="bg-gray-800 rounded-lg p-4 space-y-3">
              <h4 className="text-lg font-medium text-white mb-3">Résultats de l'Analyse</h4>
              
              <div className="grid grid-cols-2 gap-4">
                <div className="text-center">
                  <div className="text-2xl font-bold text-green-400">
                    {recordingData.metrics.posture}%
                  </div>
                  <div className="text-sm text-gray-400">Posture</div>
                </div>
                <div className="text-center">
                  <div className="text-2xl font-bold text-blue-400">
                    {recordingData.metrics.eyeContact}%
                  </div>
                  <div className="text-sm text-gray-400">Contact Visuel</div>
                </div>
                <div className="text-center">
                  <div className="text-2xl font-bold text-purple-400">
                    {recordingData.metrics.gestures}%
                  </div>
                  <div className="text-sm text-gray-400">Gestes</div>
                </div>
                <div className="text-center">
                  <div className="text-2xl font-bold text-yellow-400">
                    {recordingData.metrics.confidence}%
                  </div>
                  <div className="text-sm text-gray-400">Score Global</div>
                </div>
              </div>

              <div className="mt-4 pt-4 border-t border-gray-700">
                <div className="text-center">
                  <div className="text-3xl font-bold text-white mb-1">
                    {recordingData.metrics.confidence}%
                  </div>
                  <div className="text-sm text-gray-400">Score Global IA</div>
                  <div className="mt-2">
                    {recordingData.metrics.confidence >= 80 ? (
                      <span className="text-green-400 text-sm font-medium">Excellent !</span>
                    ) : recordingData.metrics.confidence >= 60 ? (
                      <span className="text-yellow-400 text-sm font-medium">Bon, continuez !</span>
                    ) : (
                      <span className="text-red-400 text-sm font-medium">À améliorer</span>
                    )}
                  </div>
                </div>
              </div>
            </div>

            <div className="text-sm text-gray-400">
              <p>Durée: {Math.round(recordingData.duration / 1000)} secondes</p>
              <p>Frames analysées: {recordingData.data.length}</p>
            </div>

            <div className="flex justify-center space-x-4">
              <button
                onClick={handleRetry}
                className="bg-blue-600 hover:bg-blue-700 text-white px-6 py-3 rounded-lg transition-colors"
              >
                <Video className="w-5 h-5 inline mr-2" />
                Nouvel Enregistrement
              </button>
              <button
                onClick={onClose}
                className="bg-gray-600 hover:bg-gray-700 text-white px-6 py-3 rounded-lg transition-colors"
              >
                Terminer
              </button>
            </div>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="fixed inset-0 bg-black/80 backdrop-blur-sm z-50 flex items-center justify-center p-4">
      <div className="bg-gray-900 rounded-2xl p-4 max-w-sm w-full mt-8">
        <div className="flex justify-between items-center mb-4">
          <h2 className="text-lg font-bold text-white">Enregistrer une Vidéo de Motivation</h2>
          <button
            onClick={onClose}
            className="text-gray-400 hover:text-white text-2xl"
          >
            ×
          </button>
        </div>

        <div className="text-center space-y-3">
          <div className="flex justify-center">
            <Video className="w-12 h-12 text-blue-400" />
          </div>
          
          <div>
            <h3 className="text-base font-semibold text-white mb-1">
              Analyse IA en Temps Réel
            </h3>
            <p className="text-gray-300 mb-2 text-xs">
              Enregistrez votre vidéo de motivation avec analyse automatique de votre posture, 
              contact visuel et gestes en temps réel.
            </p>
          </div>

          <div className="bg-gray-800 rounded-lg p-2 space-y-1">
            <h4 className="text-sm font-medium text-white mb-1">Fonctionnalités IA</h4>
            
            <div className="space-y-1 text-left">
              <div className="flex items-center space-x-2">
                <div className="w-1.5 h-1.5 bg-green-400 rounded-full"></div>
                <span className="text-xs text-gray-300">Analyse de posture en temps réel</span>
              </div>
              <div className="flex items-center space-x-2">
                <div className="w-1.5 h-1.5 bg-blue-400 rounded-full"></div>
                <span className="text-xs text-gray-300">Détection du contact visuel</span>
              </div>
              <div className="flex items-center space-x-2">
                <div className="w-1.5 h-1.5 bg-purple-400 rounded-full"></div>
                <span className="text-xs text-gray-300">Analyse des gestes et mouvements</span>
              </div>
              <div className="flex items-center space-x-2">
                <div className="w-1.5 h-1.5 bg-yellow-400 rounded-full"></div>
                <span className="text-xs text-gray-300">Score de confiance global</span>
              </div>
            </div>
          </div>

          <div className="text-xs text-gray-400 space-y-0.5">
            <p>• Assurez-vous d'être sur HTTPS pour l'accès à la caméra</p>
            <p>• Autorisez l'accès à la caméra quand le navigateur le demande</p>
            <p>• L'analyse IA fonctionne en temps réel pendant l'enregistrement</p>
          </div>

          <button
            onClick={() => setShowAnalyzer(true)}
            className="w-full bg-red-600 hover:bg-red-700 text-white px-3 py-2 rounded-lg transition-all transform hover:scale-105 flex items-center justify-center space-x-2"
          >
            <Play className="w-3 h-3" />
            <span className="text-xs">Commencer l'Enregistrement</span>
          </button>
        </div>
      </div>
    </div>
  );
};
