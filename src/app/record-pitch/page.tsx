'use client';

import { useState, useRef } from 'react';
import Link from 'next/link';
import { ArrowLeft, Play, Square, RotateCcw, Download, Share2 } from 'lucide-react';
import { motion } from 'framer-motion';

export default function RecordPitchPage() {
  const [isRecording, setIsRecording] = useState(false);
  const [isPaused, setIsPaused] = useState(false);
  const [recordedVideo, setRecordedVideo] = useState<string | null>(null);
  const [recordingTime, setRecordingTime] = useState(0);
  const mediaRecorderRef = useRef<MediaRecorder | null>(null);
  const streamRef = useRef<MediaStream | null>(null);
  const videoRef = useRef<HTMLVideoElement>(null);

  const startRecording = async () => {
    try {
      const stream = await navigator.mediaDevices.getUserMedia({ 
        video: true, 
        audio: true 
      });
      
      streamRef.current = stream;
      if (videoRef.current) {
        videoRef.current.srcObject = stream;
      }

      const mediaRecorder = new MediaRecorder(stream);
      mediaRecorderRef.current = mediaRecorder;
      
      const chunks: Blob[] = [];
      
      mediaRecorder.ondataavailable = (event) => {
        if (event.data.size > 0) {
          chunks.push(event.data);
        }
      };

      mediaRecorder.onstop = () => {
        const blob = new Blob(chunks, { type: 'video/webm' });
        const videoUrl = URL.createObjectURL(blob);
        setRecordedVideo(videoUrl);
      };

      mediaRecorder.start();
      setIsRecording(true);
      setIsPaused(false);
      
      // Start timer
      const timer = setInterval(() => {
        setRecordingTime(prev => prev + 1);
      }, 1000);
      
      return () => clearInterval(timer);
    } catch (error) {
      console.error('Error accessing media devices:', error);
      alert('Impossible d\'accéder à la caméra et au microphone');
    }
  };

  const stopRecording = () => {
    if (mediaRecorderRef.current && isRecording) {
      mediaRecorderRef.current.stop();
      if (streamRef.current) {
        streamRef.current.getTracks().forEach(track => track.stop());
      }
      setIsRecording(false);
      setIsPaused(false);
    }
  };

  const pauseRecording = () => {
    if (mediaRecorderRef.current && isRecording) {
      if (isPaused) {
        mediaRecorderRef.current.resume();
        setIsPaused(false);
      } else {
        mediaRecorderRef.current.pause();
        setIsPaused(true);
      }
    }
  };

  const resetRecording = () => {
    setRecordedVideo(null);
    setRecordingTime(0);
    setIsRecording(false);
    setIsPaused(false);
    if (streamRef.current) {
      streamRef.current.getTracks().forEach(track => track.stop());
    }
  };

  const formatTime = (seconds: number) => {
    const mins = Math.floor(seconds / 60);
    const secs = seconds % 60;
    return `${mins.toString().padStart(2, '0')}:${secs.toString().padStart(2, '0')}`;
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-900 via-blue-900 to-gray-900">
      {/* Header */}
      <div className="flex justify-between items-center p-4 bg-black bg-opacity-20">
        <Link href="/dashboard" className="text-white hover:text-yellow-400 transition-colors">
          <ArrowLeft className="w-6 h-6" />
        </Link>
        <div className="text-lg font-bold text-white">Enregistrer un Pitch</div>
        <div className="w-6"></div>
      </div>

      <div className="px-6 py-8 max-w-4xl mx-auto">
        {/* Recording Interface */}
        <motion.div
          initial={{ opacity: 0, y: 50 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8 }}
          className="space-y-6"
        >
          {/* Video Preview */}
          <div className="relative bg-gray-800 rounded-xl overflow-hidden aspect-video">
            {recordedVideo ? (
              <video
                ref={videoRef}
                src={recordedVideo}
                controls
                className="w-full h-full object-cover"
              />
            ) : (
              <video
                ref={videoRef}
                autoPlay
                muted
                className="w-full h-full object-cover"
              />
            )}
            
            {/* Recording Overlay */}
            {isRecording && (
              <div className="absolute top-4 left-4 bg-red-500 text-white px-3 py-1 rounded-full text-sm font-bold flex items-center space-x-2">
                <div className="w-2 h-2 bg-white rounded-full animate-pulse"></div>
                <span>{formatTime(recordingTime)}</span>
              </div>
            )}
          </div>

          {/* Recording Controls */}
          <div className="bg-gray-800 bg-opacity-50 rounded-xl p-6 border border-gray-700">
            <div className="flex justify-center items-center space-x-4">
              {!isRecording && !recordedVideo && (
                <button
                  onClick={startRecording}
                  className="bg-gradient-to-r from-red-400 to-red-500 text-white p-4 rounded-full hover:shadow-lg transition-all hover:scale-105"
                >
                  <Play className="w-6 h-6" />
                </button>
              )}

              {isRecording && (
                <>
                  <button
                    onClick={pauseRecording}
                    className={`p-4 rounded-full transition-all hover:scale-105 ${
                      isPaused 
                        ? 'bg-gradient-to-r from-green-400 to-green-500 text-white' 
                        : 'bg-gradient-to-r from-yellow-400 to-yellow-500 text-black'
                    }`}
                  >
                    {isPaused ? <Play className="w-6 h-6" /> : <Square className="w-6 h-6" />}
                  </button>

                  <button
                    onClick={stopRecording}
                    className="bg-gradient-to-r from-red-400 to-red-500 text-white p-4 rounded-full hover:shadow-lg transition-all hover:scale-105"
                  >
                    <Square className="w-6 h-6" />
                  </button>
                </>
              )}

              {recordedVideo && (
                <>
                  <button
                    onClick={resetRecording}
                    className="bg-gradient-to-r from-gray-400 to-gray-500 text-white p-4 rounded-full hover:shadow-lg transition-all hover:scale-105"
                  >
                    <RotateCcw className="w-6 h-6" />
                  </button>

                  <button className="bg-gradient-to-r from-blue-400 to-blue-500 text-white p-4 rounded-full hover:shadow-lg transition-all hover:scale-105">
                    <Download className="w-6 h-6" />
                  </button>

                  <button className="bg-gradient-to-r from-green-400 to-green-500 text-white p-4 rounded-full hover:shadow-lg transition-all hover:scale-105">
                    <Share2 className="w-6 h-6" />
                  </button>
                </>
              )}
            </div>

            {/* Status Text */}
            <div className="text-center mt-4">
              {!isRecording && !recordedVideo && (
                <p className="text-gray-300">Cliquez sur le bouton pour commencer l'enregistrement</p>
              )}
              {isRecording && (
                <p className="text-red-400 font-semibold">
                  {isPaused ? 'Enregistrement en pause' : 'Enregistrement en cours...'}
                </p>
              )}
              {recordedVideo && (
                <p className="text-green-400 font-semibold">Enregistrement terminé</p>
              )}
            </div>
          </div>

          {/* Recording Tips */}
          <div className="bg-gray-800 bg-opacity-50 rounded-xl p-6 border border-gray-700">
            <h3 className="text-white font-semibold text-lg mb-4">Conseils pour un bon enregistrement</h3>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div className="flex items-start space-x-3">
                <div className="w-6 h-6 bg-gradient-to-r from-yellow-400 to-yellow-500 rounded-full flex items-center justify-center flex-shrink-0 mt-0.5">
                  <span className="text-black text-xs font-bold">1</span>
                </div>
                <div>
                  <h4 className="text-white font-medium">Bonne posture</h4>
                  <p className="text-gray-400 text-sm">Tenez-vous droit et regardez la caméra</p>
                </div>
              </div>
              <div className="flex items-start space-x-3">
                <div className="w-6 h-6 bg-gradient-to-r from-yellow-400 to-yellow-500 rounded-full flex items-center justify-center flex-shrink-0 mt-0.5">
                  <span className="text-black text-xs font-bold">2</span>
                </div>
                <div>
                  <h4 className="text-white font-medium">Éclairage</h4>
                  <p className="text-gray-400 text-sm">Assurez-vous d'avoir un bon éclairage</p>
                </div>
              </div>
              <div className="flex items-start space-x-3">
                <div className="w-6 h-6 bg-gradient-to-r from-yellow-400 to-yellow-500 rounded-full flex items-center justify-center flex-shrink-0 mt-0.5">
                  <span className="text-black text-xs font-bold">3</span>
                </div>
                <div>
                  <h4 className="text-white font-medium">Parole claire</h4>
                  <p className="text-gray-400 text-sm">Parlez lentement et articulez bien</p>
                </div>
              </div>
              <div className="flex items-start space-x-3">
                <div className="w-6 h-6 bg-gradient-to-r from-yellow-400 to-yellow-500 rounded-full flex items-center justify-center flex-shrink-0 mt-0.5">
                  <span className="text-black text-xs font-bold">4</span>
                </div>
                <div>
                  <h4 className="text-white font-medium">Concentration</h4>
                  <p className="text-gray-400 text-sm">Restez concentré sur votre message</p>
                </div>
              </div>
            </div>
          </div>
        </motion.div>
      </div>
    </div>
  );
}

