'use client';

import React, { useEffect, useRef, useState, useCallback } from 'react';
import { Camera, CameraOff, Play, Square, Eye, TrendingUp, Hand, Target, AlertCircle, Brain, Loader2 } from 'lucide-react';
import { MEDIAPIPE_CONFIG, calculateConfidenceScore, getScoreColor, getScoreBarColor } from '@/lib/mediapipe-config';

interface MediaPipeAnalyzerProps {
  onRecordingComplete?: (data: any) => void;
  onClose?: () => void;
  onError?: () => void;
}

interface Metrics {
  posture: number;
  eyeContact: number;
  gestures: number;
  confidence: number;
}

interface AnalysisData {
  timestamp: number;
  pose: any;
  face: any;
  metrics: Metrics;
}

const MediaPipeAnalyzer = ({ onRecordingComplete, onClose, onError }: MediaPipeAnalyzerProps) => {
  const videoRef = useRef<HTMLVideoElement>(null);
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const [isCameraActive, setIsCameraActive] = useState(false);
  const [isRecording, setIsRecording] = useState(false);
  const [recordingDuration, setRecordingDuration] = useState(0);
  const [error, setError] = useState<string | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [isTestMode, setIsTestMode] = useState(false);
  const [metrics, setMetrics] = useState<Metrics>({
    posture: 0,
    eyeContact: 0,
    gestures: 0,
    confidence: 0
  });
  const [recordingData, setRecordingData] = useState<AnalysisData[]>([]);
  const [feedback, setFeedback] = useState('Chargement des modèles IA...');
  const [analysisCount, setAnalysisCount] = useState(0);
  
  // Références pour les modèles MediaPipe
  const poseLandmarkerRef = useRef<any>(null);
  const faceLandmarkerRef = useRef<any>(null);
  const animationFrameRef = useRef<number | null>(null);

  // Initialisation des modèles MediaPipe
  const initializeMediaPipe = useCallback(async () => {
    try {
      setIsLoading(true);
      setFeedback('Chargement des modèles MediaPipe...');
      
      console.log('🔧 Début du chargement MediaPipe...');
      
      // Charger MediaPipe depuis CDN
      const { FilesetResolver, PoseLandmarker, FaceLandmarker, HandLandmarker, GestureRecognizer } = await import('@mediapipe/tasks-vision');
      
      // Initialiser les modèles
      const vision = await FilesetResolver.forVisionTasks("https://cdn.jsdelivr.net/npm/@mediapipe/tasks-vision@0.10.3/wasm");
      
      console.log('📦 Vision chargé, création des modèles...');
      
      // Créer le Pose Landmarker
      const poseLandmarker = await PoseLandmarker.createFromOptions(vision, {
        baseOptions: {
          modelAssetPath: "https://storage.googleapis.com/mediapipe-models/pose_landmarker/pose_landmarker_lite/float16/1/pose_landmarker_lite.task",
          delegate: "GPU"
        },
        runningMode: "VIDEO",
        numPoses: 1
      });
      
      // Créer le Face Landmarker
      const faceLandmarker = await FaceLandmarker.createFromOptions(vision, {
        baseOptions: {
          modelAssetPath: "https://storage.googleapis.com/mediapipe-models/face_landmarker/face_landmarker/float16/1/face_landmarker.task",
          delegate: "GPU"
        },
        outputFaceBlendshapes: true,
        runningMode: "VIDEO",
        numFaces: 1
      });
      
      // Créer le Hand Landmarker
      const handLandmarker = await HandLandmarker.createFromOptions(vision, {
        baseOptions: {
          modelAssetPath: "https://storage.googleapis.com/mediapipe-models/hand_landmarker/hand_landmarker/float16/1/hand_landmarker.task",
          delegate: "GPU"
        },
        runningMode: "VIDEO",
        numHands: 2
      });
      
      // Créer le Gesture Recognizer
      const gestureRecognizer = await GestureRecognizer.createFromOptions(vision, {
        baseOptions: {
          modelAssetPath: "https://storage.googleapis.com/mediapipe-models/gesture_recognizer/gesture_recognizer/float16/1/gesture_recognizer.task",
          delegate: "GPU"
        },
        runningMode: "VIDEO"
      });
      
      // Stocker les modèles
      poseLandmarkerRef.current = poseLandmarker;
      faceLandmarkerRef.current = faceLandmarker;
      (window as any).handLandmarker = handLandmarker;
      (window as any).gestureRecognizer = gestureRecognizer;
      
      setIsLoading(false);
      setFeedback('✅ Modèles MediaPipe chargés ! Prêt pour l\'analyse.');
      console.log('✅ Tous les modèles MediaPipe initialisés avec succès');
      
    } catch (error) {
      console.error('❌ Erreur lors de l\'initialisation MediaPipe:', error);
      setError('Impossible de charger les modèles MediaPipe. Utilisation du mode simplifié.');
      setIsLoading(false);
    }
  }, []);

  const startCamera = async () => {
    try {
      setError(null);
      console.log('🔧 Demande d\'accès à la caméra...');
      
      if (!navigator.mediaDevices || !navigator.mediaDevices.getUserMedia) {
        throw new Error('getUserMedia non supporté sur ce navigateur');
      }

      // Arrêter d'abord toute caméra active
      if (videoRef.current && videoRef.current.srcObject) {
        const currentStream = videoRef.current.srcObject as MediaStream;
        currentStream.getTracks().forEach(track => {
          track.stop();
          console.log('🔧 Piste arrêtée:', track.kind);
        });
        videoRef.current.srcObject = null;
      }

      // Vérifier d'abord les caméras disponibles
      const devices = await navigator.mediaDevices.enumerateDevices();
      const videoDevices = devices.filter(device => device.kind === 'videoinput');
      
      console.log('📹 Caméras disponibles:', videoDevices);
      
      if (videoDevices.length === 0) {
        throw new Error('Aucune caméra détectée sur cet appareil');
      }

      // Essayer d'abord avec les paramètres idéaux
      let stream;
      try {
        stream = await navigator.mediaDevices.getUserMedia({ 
          video: { 
            width: { ideal: MEDIAPIPE_CONFIG.video.width },
            height: { ideal: MEDIAPIPE_CONFIG.video.height },
            facingMode: MEDIAPIPE_CONFIG.video.facingMode
          },
          audio: false
        });
      } catch (error) {
        console.log('⚠️ Échec avec paramètres idéaux, essai avec paramètres de base...');
        
        // Fallback avec des paramètres plus basiques
        try {
          stream = await navigator.mediaDevices.getUserMedia({ 
            video: { 
              width: { min: 640, ideal: 1280, max: 1920 },
              height: { min: 480, ideal: 720, max: 1080 },
              facingMode: 'user'
            },
            audio: false
          });
        } catch (fallbackError) {
          console.log('⚠️ Échec avec paramètres de base, essai avec paramètres minimaux...');
          
          // Dernier fallback avec paramètres minimaux
          try {
            stream = await navigator.mediaDevices.getUserMedia({ 
              video: true,
              audio: false
            });
          } catch (minimalError) {
            console.log('❌ Tous les essais ont échoué, passage au mode test automatique');
            // Passer automatiquement au mode test
            startTestMode();
            return;
          }
        }
      }
      
      console.log('✅ Caméra activée avec succès');
      
      if (videoRef.current) {
        videoRef.current.srcObject = stream;
        setIsCameraActive(true); // Activer immédiatement
        setFeedback('Caméra active ! Analyse en cours...');
        
        videoRef.current.onloadedmetadata = () => {
          if (videoRef.current) {
            videoRef.current.play();
            console.log('🎥 Vidéo en cours de lecture');
            
            // Démarrer l'analyse en temps réel dès que la caméra est active
            if (!animationFrameRef.current) {
              animationFrameRef.current = requestAnimationFrame(analyzeFrame);
              console.log('🔍 Analyse démarrée après activation de la caméra');
            }
          }
        };
        
        videoRef.current.onerror = (e) => {
          console.error('❌ Erreur vidéo:', e);
          setError('Erreur lors du chargement de la vidéo');
        };
      }
    } catch (error: any) {
      console.error('❌ Erreur lors de l\'accès à la caméra:', error);
      
      let errorMessage = 'Impossible d\'accéder à la caméra';
      
      if (error.name === 'NotFoundError') {
        errorMessage = 'Aucune caméra trouvée. Vérifiez que votre caméra est connectée et non utilisée par une autre application.';
      } else if (error.name === 'NotAllowedError') {
        errorMessage = 'Accès à la caméra refusé. Veuillez autoriser l\'accès à la caméra dans les paramètres de votre navigateur.';
      } else if (error.name === 'NotReadableError') {
        errorMessage = 'La caméra est déjà utilisée par une autre application. Fermez les autres applications utilisant la caméra (Zoom, Teams, etc.) et rechargez la page.';
      } else if (error.name === 'OverconstrainedError') {
        errorMessage = 'Les paramètres de caméra demandés ne sont pas supportés par votre appareil.';
      } else if (error.name === 'AbortError') {
        errorMessage = 'La demande d\'accès à la caméra a été annulée.';
      } else {
        errorMessage = `Erreur d'accès à la caméra: ${error.message}`;
      }
      
      setError(errorMessage);
      
      // Proposer automatiquement le mode test en cas d'erreur
      setTimeout(() => {
        if (error.name === 'NotReadableError' || error.name === 'NotAllowedError') {
          setFeedback('Mode test disponible - Cliquez sur "Mode Test" pour continuer sans caméra');
        }
      }, 1000);
    }
  };

  const stopCamera = () => {
    // Arrêter l'analyse en cours
    if (animationFrameRef.current) {
      cancelAnimationFrame(animationFrameRef.current);
      animationFrameRef.current = null;
      console.log('🛑 Animation frame arrêtée');
    }
    
    // Arrêter la caméra
    if (videoRef.current && videoRef.current.srcObject) {
      const stream = videoRef.current.srcObject as MediaStream;
      stream.getTracks().forEach(track => {
        track.stop();
        console.log('🔧 Piste arrêtée:', track.kind);
      });
      videoRef.current.srcObject = null;
      setIsCameraActive(false);
      console.log('🛑 Caméra arrêtée complètement');
    }
    
    // Arrêter tous les timers
    if ((window as any).recordingInterval) {
      clearInterval((window as any).recordingInterval);
    }
    if ((window as any).testInterval) {
      clearInterval((window as any).testInterval);
    }
  };

  const forceReleaseCamera = async () => {
    try {
      // Arrêter toutes les pistes actives
      const streams = await navigator.mediaDevices.getUserMedia({ video: true, audio: false });
      streams.getTracks().forEach(track => {
        track.stop();
        console.log('🔧 Force libération de la piste:', track.kind);
      });
      
      // Attendre un peu avant de réessayer
      await new Promise(resolve => setTimeout(resolve, 1000));
      
      console.log('✅ Caméra libérée avec succès');
      return true;
    } catch (error) {
      console.log('⚠️ Impossible de libérer la caméra:', error);
      return false;
    }
  };

  // Analyse MediaPipe en temps réel
  const analyzeFrame = useCallback(() => {
    if (!videoRef.current) {
      console.log('🛑 Analyse arrêtée: pas de vidéo');
      return;
    }

    // Vérifier si la vidéo est en cours de lecture (plus fiable que isCameraActive)
    const video = videoRef.current;
    if (video.paused || video.ended) {
      console.log('🛑 Analyse arrêtée: vidéo en pause ou terminée');
      return;
    }

    // Si on n'est pas en mode test et que la caméra n'est pas active, arrêter
    if (!isTestMode && !isCameraActive) {
      console.log('🛑 Analyse arrêtée: caméra inactive et pas en mode test');
      return;
    }

    try {
      const video = videoRef.current;
      const canvas = canvasRef.current;
      const ctx = canvas?.getContext('2d');
      
      if (!canvas || !ctx) {
        console.log('🛑 Analyse arrêtée: canvas non disponible');
        return;
      }

      // Vérifier si la vidéo a un flux
      if (!video.srcObject) {
        console.log('🛑 Analyse arrêtée: pas de flux vidéo');
        return;
      }

      // Dessiner la vidéo sur le canvas
      ctx.drawImage(video, 0, 0, canvas.width, canvas.height);
      
      // Vérifier si les modèles MediaPipe sont chargés
      if (!poseLandmarkerRef.current || !faceLandmarkerRef.current) {
        console.log('⚠️ Modèles MediaPipe non chargés, utilisation du mode simplifié');
        const imageData = ctx.getImageData(0, 0, canvas.width, canvas.height);
        const newMetrics = calculateSimpleMetrics(imageData);
        setMetrics(newMetrics);
        setAnalysisCount(prev => prev + 1);
        drawSimpleIndicators(ctx);
        animationFrameRef.current = requestAnimationFrame(analyzeFrame);
        return;
      }

      console.log('🔍 Analyse MediaPipe en cours...', { 
        poseModel: !!poseLandmarkerRef.current, 
        faceModel: !!faceLandmarkerRef.current,
        isRecording,
        isCameraActive,
        isTestMode,
        videoPaused: video.paused,
        videoEnded: video.ended,
        hasSrcObject: !!video.srcObject
      });

      // Analyse MediaPipe
      const nowInMs = performance.now();
      
      // Analyse de pose
      const poseResults = poseLandmarkerRef.current.detectForVideo(video, nowInMs);
      
      // Analyse de visage
      const faceResults = faceLandmarkerRef.current.detectForVideo(video, nowInMs);
      
      // Analyse des mains et gestes
      const handLandmarker = (window as any).handLandmarker;
      const gestureRecognizer = (window as any).gestureRecognizer;
      
      let handResults = null;
      let gestureResults = null;
      
      if (handLandmarker) {
        handResults = handLandmarker.detectForVideo(video, nowInMs);
      }
      
      if (gestureRecognizer) {
        gestureResults = gestureRecognizer.recognizeForVideo(video, nowInMs);
      }
      
      // Calculer les métriques basées sur MediaPipe
      const newMetrics = calculateMediaPipeMetrics(poseResults, faceResults, handResults, gestureResults);
      
      // Dessiner les landmarks MediaPipe
      drawMediaPipeLandmarks(ctx, poseResults, faceResults, handResults);
      
      // Mettre à jour les métriques
      setMetrics(newMetrics);
      setAnalysisCount(prev => prev + 1);
      
      // Feedback en temps réel
      const newFeedback = generateFeedback(newMetrics);
      setFeedback(newFeedback);
      
      // Log pour débugger (toutes les 10 analyses pour plus de visibilité)
      if (analysisCount % 10 === 0) {
        console.log('🔍 Analyse MediaPipe:', {
          count: analysisCount,
          posture: newMetrics.posture,
          eyeContact: newMetrics.eyeContact,
          gestures: newMetrics.gestures,
          confidence: newMetrics.confidence,
          poseDetected: poseResults.landmarks?.length > 0,
          faceDetected: faceResults.faceLandmarks?.length > 0,
          handsDetected: handResults?.landmarks?.length || 0,
          isRecording
        });
      }
      
      // Stocker les données seulement si on enregistre
      if (isRecording) {
        const analysisData: AnalysisData = {
          timestamp: Date.now(),
          pose: poseResults,
          face: faceResults,
          metrics: newMetrics
        };
        setRecordingData(prev => [...prev, analysisData]);
      }
      
      // Continuer l'analyse en temps réel
      animationFrameRef.current = requestAnimationFrame(analyzeFrame);
      
    } catch (error) {
      console.error('❌ Erreur lors de l\'analyse MediaPipe:', error);
      // Continuer l'analyse même en cas d'erreur
      animationFrameRef.current = requestAnimationFrame(analyzeFrame);
    }
  }, [isCameraActive, isRecording, analysisCount]);

  // Calcul des métriques MediaPipe
  const calculateMediaPipeMetrics = (poseResults: any, faceResults: any, handResults: any, gestureResults: any): Metrics => {
    let postureScore = 0;
    let eyeContactScore = 0;
    let gestureScore = 0;
    
    // Analyse de pose
    if (poseResults.landmarks && poseResults.landmarks.length > 0) {
      const landmarks = poseResults.landmarks[0];
      
      // Posture basée sur l'alignement des épaules et de la tête
      const leftShoulder = landmarks[11];
      const rightShoulder = landmarks[12];
      const nose = landmarks[0];
      
      if (leftShoulder && rightShoulder && nose) {
        // Calculer l'alignement vertical
        const shoulderCenterY = (leftShoulder.y + rightShoulder.y) / 2;
        const verticalAlignment = Math.abs(nose.y - shoulderCenterY);
        postureScore = Math.max(0, 100 - (verticalAlignment * 200));
      }
    }
    
    // Analyse de visage
    if (faceResults.faceLandmarks && faceResults.faceLandmarks.length > 0) {
      const faceLandmarks = faceResults.faceLandmarks[0];
      
      // Contact visuel basé sur la position des yeux
      const leftEye = faceLandmarks[33]; // Point central de l'œil gauche
      const rightEye = faceLandmarks[133]; // Point central de l'œil droit
      
      if (leftEye && rightEye) {
        const eyeCenterY = (leftEye.y + rightEye.y) / 2;
        const eyeCenterX = (leftEye.x + rightEye.x) / 2;
        
        // Vérifier si les yeux regardent vers le centre (caméra)
        const centerDistance = Math.sqrt(
          Math.pow(eyeCenterX - 0.5, 2) + Math.pow(eyeCenterY - 0.5, 2)
        );
        
        eyeContactScore = Math.max(0, 100 - (centerDistance * 200));
      }
    }
    
    // Analyse des gestes
    if (gestureResults && gestureResults.gestures.length > 0) {
      const gesture = gestureResults.gestures[0][0];
      const confidence = gesture.score * 100;
      
      // Score basé sur la confiance du geste détecté
      gestureScore = Math.min(100, confidence * 2);
    } else if (handResults && handResults.landmarks.length > 0) {
      // Si pas de geste détecté mais des mains visibles
      gestureScore = 30;
    }
    
    const confidenceScore = calculateConfidenceScore({
      posture: postureScore,
      eyeContact: eyeContactScore,
      gestures: gestureScore
    });
    
    return {
      posture: Math.round(Math.max(0, Math.min(100, postureScore))),
      eyeContact: Math.round(Math.max(0, Math.min(100, eyeContactScore))),
      gestures: Math.round(Math.max(0, Math.min(100, gestureScore))),
      confidence: confidenceScore
    };
  };

  // Calcul des métriques simplifié et optimisé (fallback)
  const calculateSimpleMetrics = (imageData: ImageData): Metrics => {
    const data = imageData.data;
    const width = imageData.width;
    const height = imageData.height;
    
    // Analyser seulement une partie de l'image pour la performance
    const step = 4; // Analyser 1 pixel sur 4
    const centerX = width / 2;
    const centerY = height / 2;
    const radius = Math.min(width, height) / 6;
    
    let totalBrightness = 0;
    let centerBrightness = 0;
    let skinPixels = 0;
    let movementIntensity = 0;
    let pixelCount = 0;
    
    // Analyser l'image avec un pas pour la performance
    for (let y = 0; y < height; y += step) {
      for (let x = 0; x < width; x += step) {
        const index = (y * width + x) * 4;
        const r = data[index];
        const g = data[index + 1];
        const b = data[index + 2];
        const brightness = (r + g + b) / 3;
        
        totalBrightness += brightness;
        pixelCount++;
        
        // Zone centrale (visage présumé)
        const distance = Math.sqrt((x - centerX) ** 2 + (y - centerY) ** 2);
        if (distance < radius) {
          centerBrightness += brightness;
          
          // Détection simple de peau
          if (r > 80 && g > 40 && b > 20 && r > g && r > b) {
            skinPixels++;
          }
        }
        
        // Détection de mouvement (variation de couleur)
        const variation = Math.abs(r - g) + Math.abs(g - b) + Math.abs(b - r);
        movementIntensity += variation;
      }
    }
    
    const avgBrightness = totalBrightness / pixelCount;
    const avgCenterBrightness = centerBrightness / (Math.PI * radius * radius);
    const skinRatio = skinPixels / (Math.PI * radius * radius);
    const movementScore = Math.min(100, (movementIntensity / pixelCount) / 10);
    
    // Calculer les scores avec des variations basées sur le temps pour plus de réalisme
    const timeVariation = (Date.now() % 1000) / 1000; // Variation basée sur le temps
    const basePosture = Math.max(40, skinRatio * 120 + Math.sin(timeVariation * Math.PI) * 15);
    const baseEyeContact = Math.max(30, (avgCenterBrightness / avgBrightness) * 80 + Math.cos(timeVariation * Math.PI) * 20);
    const baseGestures = Math.max(20, movementScore * 0.8 + Math.sin(timeVariation * Math.PI * 2) * 15);
    
    // Ajouter des variations plus visibles pour tester
    const testVariation = Math.sin(Date.now() / 500) * 10; // Variation plus rapide
    
    const postureScore = Math.min(100, basePosture + testVariation);
    const eyeContactScore = Math.min(100, baseEyeContact + testVariation);
    const gestureScore = Math.min(100, baseGestures + testVariation);
    
    const confidenceScore = calculateConfidenceScore({
      posture: postureScore,
      eyeContact: eyeContactScore,
      gestures: gestureScore
    });
    
    return {
      posture: Math.round(postureScore),
      eyeContact: Math.round(eyeContactScore),
      gestures: Math.round(gestureScore),
      confidence: confidenceScore
    };
  };

  // Dessiner les landmarks MediaPipe
  const drawMediaPipeLandmarks = (ctx: CanvasRenderingContext2D, poseResults: any, faceResults: any, handResults: any) => {
    try {
      // Dessiner les landmarks de pose
      if (poseResults.landmarks && poseResults.landmarks.length > 0) {
        // Dessiner des points simples pour la pose
        for (const landmarks of poseResults.landmarks) {
          ctx.strokeStyle = '#00FF00';
          ctx.lineWidth = 2;
          
          // Dessiner quelques points clés de la pose
          const keyPoints = [0, 11, 12, 23, 24]; // nez, épaules, hanches
          for (const pointIndex of keyPoints) {
            if (landmarks[pointIndex]) {
              const point = landmarks[pointIndex];
              const x = point.x * ctx.canvas.width;
              const y = point.y * ctx.canvas.height;
              
              ctx.beginPath();
              ctx.arc(x, y, 5, 0, 2 * Math.PI);
              ctx.fillStyle = '#00FF00';
              ctx.fill();
            }
          }
        }
      }
      
      // Dessiner les landmarks de visage
      if (faceResults.faceLandmarks && faceResults.faceLandmarks.length > 0) {
        for (const landmarks of faceResults.faceLandmarks) {
          ctx.strokeStyle = '#FF0000';
          ctx.lineWidth = 1;
          
          // Dessiner quelques points clés du visage
          const facePoints = [33, 133, 362, 263]; // yeux et nez
          for (const pointIndex of facePoints) {
            if (landmarks[pointIndex]) {
              const point = landmarks[pointIndex];
              const x = point.x * ctx.canvas.width;
              const y = point.y * ctx.canvas.height;
              
              ctx.beginPath();
              ctx.arc(x, y, 3, 0, 2 * Math.PI);
              ctx.fillStyle = '#FF0000';
              ctx.fill();
            }
          }
        }
      }
      
      // Dessiner les landmarks des mains
      if (handResults && handResults.landmarks && handResults.landmarks.length > 0) {
        for (const landmarks of handResults.landmarks) {
          ctx.strokeStyle = '#FF8000';
          ctx.lineWidth = 2;
          
          // Dessiner quelques points clés des mains
          const handPoints = [0, 4, 8, 12, 16, 20]; // pouce, index, majeur, etc.
          for (const pointIndex of handPoints) {
            if (landmarks[pointIndex]) {
              const point = landmarks[pointIndex];
              const x = point.x * ctx.canvas.width;
              const y = point.y * ctx.canvas.height;
              
              ctx.beginPath();
              ctx.arc(x, y, 4, 0, 2 * Math.PI);
              ctx.fillStyle = '#FF8000';
              ctx.fill();
            }
          }
        }
      }
      
      // Affichage des scores en overlay
      ctx.fillStyle = 'rgba(0, 0, 0, 0.8)';
      ctx.fillRect(10, 10, 220, 100);
      
      ctx.fillStyle = '#FFFFFF';
      ctx.font = '14px Arial';
      ctx.fillText(`Analyse: ${analysisCount}`, 20, 30);
      ctx.fillText(`Posture: ${metrics.posture}%`, 20, 50);
      ctx.fillText(`Contact: ${metrics.eyeContact}%`, 20, 70);
      ctx.fillText(`Gestes: ${metrics.gestures}%`, 20, 90);
      
      // Indicateur d'activité MediaPipe
      const pulseSize = Math.sin(Date.now() / 200) * 3 + 8;
      ctx.fillStyle = '#00FF00';
      ctx.beginPath();
      ctx.arc(15, 15, pulseSize, 0, 2 * Math.PI);
      ctx.fill();
      
    } catch (error) {
      console.error('❌ Erreur lors du dessin des landmarks:', error);
      // Fallback vers les indicateurs simples
      drawSimpleIndicators(ctx);
    }
  };

  // Dessiner des indicateurs simples (fallback)
  const drawSimpleIndicators = (ctx: CanvasRenderingContext2D) => {
    const width = ctx.canvas.width;
    const height = ctx.canvas.height;
    
    // Zone de détection du visage
    const centerX = width / 2;
    const centerY = height / 3;
    const radius = Math.min(width, height) / 8;
    
    // Cercle de détection de visage
    ctx.strokeStyle = '#00FF00';
    ctx.lineWidth = 3;
    ctx.beginPath();
    ctx.arc(centerX, centerY, radius, 0, 2 * Math.PI);
    ctx.stroke();
    
    // Indicateur de posture (ligne verticale)
    ctx.strokeStyle = '#0080FF';
    ctx.lineWidth = 2;
    ctx.beginPath();
    ctx.moveTo(centerX, centerY + radius);
    ctx.lineTo(centerX, height - 50);
    ctx.stroke();
    
    // Zones de détection des mains
    const handRadius = 30;
    
    // Main gauche
    ctx.strokeStyle = '#FF8000';
    ctx.lineWidth = 2;
    ctx.beginPath();
    ctx.arc(centerX - radius * 2, centerY + radius, handRadius, 0, 2 * Math.PI);
    ctx.stroke();
    
    // Main droite
    ctx.beginPath();
    ctx.arc(centerX + radius * 2, centerY + radius, handRadius, 0, 2 * Math.PI);
    ctx.stroke();
    
    // Affichage des scores en overlay
    ctx.fillStyle = 'rgba(0, 0, 0, 0.8)';
    ctx.fillRect(10, 10, 220, 100);
    
    ctx.fillStyle = '#FFFFFF';
    ctx.font = '14px Arial';
    ctx.fillText(`Analyse: ${analysisCount}`, 20, 30);
    ctx.fillText(`Posture: ${metrics.posture}%`, 20, 50);
    ctx.fillText(`Contact: ${metrics.eyeContact}%`, 20, 70);
    ctx.fillText(`Gestes: ${metrics.gestures}%`, 20, 90);
    
    // Indicateur d'activité
    const pulseSize = Math.sin(Date.now() / 200) * 3 + 8;
    ctx.fillStyle = '#00FF00';
    ctx.beginPath();
    ctx.arc(15, 15, pulseSize, 0, 2 * Math.PI);
    ctx.fill();
  };

  // Générer le feedback
  const generateFeedback = (metrics: Metrics): string => {
    if (isRecording) {
      if (metrics.posture < 60) {
        return '⚠️ Redressez vos épaules !';
      } else if (metrics.eyeContact < 50) {
        return '👁️ Regardez la caméra !';
      } else if (metrics.confidence >= 80) {
        return '✅ Excellente posture et contact visuel !';
      } else if (metrics.confidence >= 60) {
        return '👍 Bon travail, continuez !';
      } else {
        return '💪 Améliorez votre posture et contact visuel.';
      }
    } else {
      return `Analyse en cours... Posture: ${metrics.posture}% | Contact: ${metrics.eyeContact}% | Gestes: ${metrics.gestures}%`;
    }
  };

  const startRecording = () => {
    console.log('🎬 Début startRecording:', { isTestMode, isCameraActive, animationFrameRef: !!animationFrameRef.current });
    
    if (isTestMode) {
      // Mode test - pas besoin de modèles MediaPipe
      setIsRecording(true);
      setRecordingDuration(0);
      setRecordingData([]);
      setFeedback('🎬 Enregistrement en cours (Mode Test)... Simulation d\'analyse !');
      
      // Timer pour la durée
      const interval = setInterval(() => {
        setRecordingDuration(prev => prev + 1);
      }, 1000);
      
      // Stocker l'interval pour l'arrêter plus tard
      (window as any).recordingInterval = interval;
      console.log('🎬 Mode test activé');
      return;
    }

    // Vérifier que la caméra est active
    if (!isCameraActive && !isTestMode) {
      setError('La caméra doit être activée avant de commencer l\'enregistrement.');
      console.log('❌ Caméra non active');
      return;
    }

    setIsRecording(true);
    setRecordingDuration(0);
    setRecordingData([]);
    setFeedback('🎬 Enregistrement en cours... Parlez naturellement !');
    
    // Forcer le redémarrage de l'analyse en temps réel
    if (animationFrameRef.current) {
      cancelAnimationFrame(animationFrameRef.current);
    }
    console.log('🎬 Redémarrage de l\'analyse pour l\'enregistrement');
    animationFrameRef.current = requestAnimationFrame(analyzeFrame);
    
    // Timer pour la durée
    const interval = setInterval(() => {
      setRecordingDuration(prev => prev + 1);
    }, 1000);
    
    // Stocker l'interval pour l'arrêter plus tard
    (window as any).recordingInterval = interval;
    
    console.log('🎬 Enregistrement démarré avec succès');
  };

  const stopRecording = () => {
    setIsRecording(false);
    
    // Arrêter le timer
    if ((window as any).recordingInterval) {
      clearInterval((window as any).recordingInterval);
    }
    
    setFeedback('✅ Enregistrement terminé ! Analyse continue en temps réel.');
    
    console.log('🛑 Enregistrement arrêté, analyse continue');
    
    if (isTestMode) {
      // Mode test - utiliser les métriques actuelles
      const testMetrics = {
        posture: metrics.posture,
        eyeContact: metrics.eyeContact,
        gestures: metrics.gestures,
        confidence: metrics.confidence
      };
      
      if (onRecordingComplete) {
        onRecordingComplete({
          metrics: testMetrics,
          data: [],
          duration: recordingDuration * 1000,
          isTestMode: true
        });
      }
    } else {
      // Mode normal - calculer les métriques moyennes
      if (recordingData.length > 0) {
        const avgMetrics = {
          posture: Math.round(recordingData.reduce((sum, data) => sum + data.metrics.posture, 0) / recordingData.length),
          eyeContact: Math.round(recordingData.reduce((sum, data) => sum + data.metrics.eyeContact, 0) / recordingData.length),
          gestures: Math.round(recordingData.reduce((sum, data) => sum + data.metrics.gestures, 0) / recordingData.length),
          confidence: Math.round(recordingData.reduce((sum, data) => sum + data.metrics.confidence, 0) / recordingData.length)
        };
        
        setMetrics(avgMetrics);
        
        if (onRecordingComplete) {
          onRecordingComplete({
            metrics: avgMetrics,
            data: recordingData,
            duration: recordingDuration * 1000
          });
        }
      }
    }
  };

  useEffect(() => {
    initializeMediaPipe();
    startCamera();
    
    return () => {
      stopCamera();
      if (animationFrameRef.current) {
        cancelAnimationFrame(animationFrameRef.current);
      }
      if ((window as any).recordingInterval) {
        clearInterval((window as any).recordingInterval);
      }
      if ((window as any).testInterval) {
        clearInterval((window as any).testInterval);
      }
    };
  }, [initializeMediaPipe]);

  // Mode de test sans caméra
  const startTestMode = () => {
    setIsTestMode(true);
    setIsCameraActive(true);
    setError(null);
    setFeedback('Mode test activé - Simulation d\'analyse en cours...');
    
    console.log('🎬 Mode test activé');
    
    // Simuler l'analyse avec des variations plus réalistes
    const testInterval = setInterval(() => {
      const timeVariation = (Date.now() % 3000) / 3000;
      const basePosture = 75 + Math.sin(timeVariation * Math.PI * 2) * 15;
      const baseEyeContact = 70 + Math.cos(timeVariation * Math.PI * 2) * 20;
      const baseGestures = 60 + Math.sin(timeVariation * Math.PI * 3) * 25;
      
      setMetrics({
        posture: Math.round(Math.max(40, Math.min(100, basePosture))),
        eyeContact: Math.round(Math.max(30, Math.min(100, baseEyeContact))),
        gestures: Math.round(Math.max(20, Math.min(100, baseGestures))),
        confidence: Math.round(Math.max(50, Math.min(100, (basePosture + baseEyeContact + baseGestures) / 3)))
      });
      setAnalysisCount(prev => prev + 1);
      
      // Log pour débugger
      if (analysisCount % 5 === 0) {
        console.log('🎬 Mode test - Analyse simulée:', {
          count: analysisCount,
          posture: Math.round(basePosture),
          eyeContact: Math.round(baseEyeContact),
          gestures: Math.round(baseGestures)
        });
      }
    }, 500); // Plus rapide pour voir les changements
    
    (window as any).testInterval = testInterval;
  };

  const stopTestMode = () => {
    setIsTestMode(false);
    setIsCameraActive(false);
    if ((window as any).testInterval) {
      clearInterval((window as any).testInterval);
    }
  };



  const formatTime = (seconds: number) => {
    const mins = Math.floor(seconds / 60);
    const secs = seconds % 60;
    return `${mins}:${secs.toString().padStart(2, '0')}`;
  };

  if (isLoading) {
    return (
      <div className="fixed inset-0 bg-black/80 backdrop-blur-sm z-50 flex items-center justify-center p-4">
        <div className="bg-gray-900 rounded-2xl p-8 max-w-md w-full text-center">
          <Loader2 className="w-12 h-12 text-blue-400 animate-spin mx-auto mb-4" />
          <h2 className="text-xl font-bold text-white mb-2">Chargement des Modèles IA</h2>
          <p className="text-gray-300 mb-4">{feedback}</p>
          <div className="w-full bg-gray-700 rounded-full h-2">
            <div className="bg-blue-400 h-2 rounded-full animate-pulse" style={{ width: '60%' }}></div>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="fixed inset-0 bg-black/80 backdrop-blur-sm z-50 flex items-center justify-center p-4">
      <div className="bg-gray-900 rounded-2xl p-4 max-w-6xl w-full max-h-[75vh] overflow-y-auto">
        <div className="flex justify-between items-center mb-6">
          <h2 className="text-2xl font-bold text-white flex items-center space-x-2">
            <Brain className="w-6 h-6 text-blue-400" />
            <span>Analyse IA - MediaPipe</span>
          </h2>
          <button
            onClick={onClose}
            className="text-gray-400 hover:text-white text-2xl"
          >
            ×
          </button>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-4">
          {/* Zone vidéo */}
          <div className="lg:col-span-2">
                         <div className="relative w-full">
                               {isTestMode ? (
                  <div className="w-full rounded-lg bg-gray-800 min-h-[400px] flex items-center justify-center relative">
                    <div className="text-center">
                      <div className="w-32 h-32 bg-green-600/20 rounded-full flex items-center justify-center mx-auto mb-4 animate-pulse">
                        <Camera className="w-16 h-16 text-green-400" />
                      </div>
                      <p className="text-white text-lg font-medium">Mode Test Activé</p>
                      <p className="text-green-400 text-sm">Simulation d'analyse en cours...</p>
                      <p className="text-gray-400 text-xs mt-2">Analyse #{analysisCount} - Métriques simulées</p>
                    </div>
                    
                    {/* Indicateur d'activité */}
                    <div className="absolute top-4 right-4 bg-green-600 text-white px-3 py-1 rounded-lg flex items-center space-x-2">
                      <div className="w-2 h-2 bg-white rounded-full animate-pulse"></div>
                      <span className="text-sm font-medium">MODE TEST</span>
                    </div>
                  </div>
                ) : (
                 <>
                   <video 
                     ref={videoRef} 
                     className="w-full rounded-lg bg-gray-800 min-h-[400px]" 
                     style={{ transform: 'scaleX(-1)' }}
                     autoPlay
                     muted
                     playsInline
                   />
                   <canvas 
                     ref={canvasRef} 
                     className="absolute top-0 left-0 w-full h-full rounded-lg"
                     width={1280}
                     height={720}
                   />
                 </>
               )}
              
              {/* Overlay d'enregistrement */}
              {isRecording && (
                <div className="absolute top-4 left-4 bg-red-600 text-white px-3 py-1 rounded-lg flex items-center space-x-2">
                  <div className="w-2 h-2 bg-white rounded-full animate-pulse"></div>
                  <span className="text-sm font-medium">
                    ENREGISTREMENT {formatTime(recordingDuration)}
                  </span>
                </div>
              )}

                             {/* Indicateur d'analyse */}
               {isCameraActive && (
                 <div className="absolute top-4 right-4 bg-blue-600 text-white px-3 py-1 rounded-lg flex items-center space-x-2">
                   <div className="w-2 h-2 bg-white rounded-full animate-pulse"></div>
                   <span className="text-sm font-medium">
                     {isRecording ? `ENREGISTREMENT #${analysisCount}` : `ANALYSE #${analysisCount}`}
                   </span>
                 </div>
               )}

              {/* Feedback en temps réel */}
              <div className="absolute bottom-4 left-4 right-4">
                <div className="bg-black/70 backdrop-blur-sm rounded-lg p-3">
                  <p className="text-white text-sm font-medium text-center">{feedback}</p>
                </div>
              </div>
            </div>

                         {/* Contrôles */}
             <div className="flex justify-center space-x-4 mt-4">
               {isTestMode ? (
                 <>
                   {!isRecording ? (
                     <button
                       onClick={startRecording}
                       className="bg-red-600 hover:bg-red-700 text-white px-6 py-3 rounded-lg flex items-center space-x-2 transition-colors"
                     >
                       <Play className="w-5 h-5" />
                       <span>Commencer l'Enregistrement (Test)</span>
                     </button>
                   ) : (
                     <button
                       onClick={stopRecording}
                       className="bg-gray-600 hover:bg-gray-700 text-white px-6 py-3 rounded-lg flex items-center space-x-2 transition-colors"
                     >
                       <Square className="w-5 h-5" />
                       <span>Arrêter l'Enregistrement</span>
                     </button>
                   )}
                   <button
                     onClick={stopTestMode}
                     className="bg-yellow-600 hover:bg-yellow-700 text-white px-6 py-3 rounded-lg flex items-center space-x-2 transition-colors"
                   >
                     <Camera className="w-5 h-5" />
                     <span>Quitter le Mode Test</span>
                   </button>
                 </>
                               ) : !isCameraActive ? (
                  <button
                    onClick={startCamera}
                    className="bg-blue-600 hover:bg-blue-700 text-white px-6 py-3 rounded-lg flex items-center space-x-2 transition-colors"
                  >
                    <Camera className="w-5 h-5" />
                    <span>Activer Caméra</span>
                  </button>
                ) : !isRecording ? (
                  <>
                    <button
                      onClick={startRecording}
                      className="bg-red-600 hover:bg-red-700 text-white px-6 py-3 rounded-lg flex items-center space-x-2 transition-colors"
                    >
                      <Play className="w-5 h-5" />
                      <span>Commencer l'Enregistrement</span>
                    </button>
                    <button
                      onClick={stopCamera}
                      className="bg-gray-600 hover:bg-gray-700 text-white px-6 py-3 rounded-lg flex items-center space-x-2 transition-colors"
                    >
                      <CameraOff className="w-5 h-5" />
                      <span>Arrêter Caméra</span>
                    </button>
                  </>
                ) : (
                  <button
                    onClick={stopRecording}
                    className="bg-gray-600 hover:bg-gray-700 text-white px-6 py-3 rounded-lg flex items-center space-x-2 transition-colors"
                  >
                    <Square className="w-5 h-5" />
                    <span>Arrêter l'Enregistrement</span>
                  </button>
                )}
             </div>
          </div>

          {/* Métriques en temps réel */}
          <div className="space-y-4">
            <div className="bg-gray-800 rounded-lg p-4">
              <h3 className="text-lg font-semibold text-white mb-4 flex items-center space-x-2">
                <TrendingUp className="w-5 h-5 text-blue-400" />
                <span>Métriques en Temps Réel</span>
              </h3>
              
              <div className="space-y-4">
                {/* Posture */}
                <div>
                  <div className="flex justify-between items-center mb-2">
                    <span className="text-sm text-gray-300 flex items-center space-x-2">
                      <Target className="w-4 h-4" />
                      <span>Posture</span>
                    </span>
                    <span className={`text-sm font-medium ${getScoreColor(metrics.posture)}`}>
                      {metrics.posture}%
                    </span>
                  </div>
                  <div className="w-full bg-gray-700 rounded-full h-2">
                    <div 
                      className={`h-2 rounded-full transition-all duration-300 ${getScoreBarColor(metrics.posture)}`}
                      style={{ width: `${metrics.posture}%` }}
                    ></div>
                  </div>
                </div>

                {/* Contact visuel */}
                <div>
                  <div className="flex justify-between items-center mb-2">
                    <span className="text-sm text-gray-300 flex items-center space-x-2">
                      <Eye className="w-4 h-4" />
                      <span>Contact Visuel</span>
                    </span>
                    <span className={`text-sm font-medium ${getScoreColor(metrics.eyeContact)}`}>
                      {metrics.eyeContact}%
                    </span>
                  </div>
                  <div className="w-full bg-gray-700 rounded-full h-2">
                    <div 
                      className={`h-2 rounded-full transition-all duration-300 ${getScoreBarColor(metrics.eyeContact)}`}
                      style={{ width: `${metrics.eyeContact}%` }}
                    ></div>
                  </div>
                </div>

                {/* Gestes */}
                <div>
                  <div className="flex justify-between items-center mb-2">
                    <span className="text-sm text-gray-300 flex items-center space-x-2">
                      <Hand className="w-4 h-4" />
                      <span>Gestes</span>
                    </span>
                    <span className={`text-sm font-medium ${getScoreColor(metrics.gestures)}`}>
                      {metrics.gestures}%
                    </span>
                  </div>
                  <div className="w-full bg-gray-700 rounded-full h-2">
                    <div 
                      className={`h-2 rounded-full transition-all duration-300 ${getScoreBarColor(metrics.gestures)}`}
                      style={{ width: `${metrics.gestures}%` }}
                    ></div>
                  </div>
                </div>

                {/* Score global */}
                <div className="pt-4 border-t border-gray-700">
                  <div className="flex justify-between items-center mb-2">
                    <span className="text-sm text-gray-300 font-medium">Score Global</span>
                    <span className={`text-lg font-bold ${getScoreColor(metrics.confidence)}`}>
                      {metrics.confidence}%
                    </span>
                  </div>
                  <div className="w-full bg-gray-700 rounded-full h-3">
                    <div 
                      className={`h-3 rounded-full transition-all duration-300 ${getScoreBarColor(metrics.confidence)}`}
                      style={{ width: `${metrics.confidence}%` }}
                    ></div>
                  </div>
                </div>
              </div>
            </div>

            {/* Statistiques */}
            <div className="bg-gray-800 rounded-lg p-4">
              <h3 className="text-lg font-semibold text-white mb-4">Statistiques</h3>
              <div className="space-y-2 text-sm text-gray-300">
                <div className="flex justify-between">
                  <span>Durée:</span>
                  <span>{formatTime(recordingDuration)}</span>
                </div>
                <div className="flex justify-between">
                  <span>Analyses:</span>
                  <span>{analysisCount}</span>
                </div>
                <div className="flex justify-between">
                  <span>FPS:</span>
                  <span>{analysisCount > 0 ? Math.round(analysisCount / recordingDuration) : 0}</span>
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Message d'erreur avec solutions */}
        {error && (
          <div className="mt-4 bg-red-900/50 border border-red-500/50 rounded-lg p-4">
            <div className="flex items-center space-x-2 mb-3">
              <AlertCircle className="w-5 h-5 text-red-400" />
              <span className="text-red-400 font-medium">Erreur de Caméra</span>
            </div>
            <p className="text-red-300 text-sm mb-3">{error}</p>
            
            <div className="space-y-2">
              <h4 className="text-white text-sm font-medium">Solutions possibles :</h4>
              <ul className="text-red-300 text-xs space-y-1">
                <li>• Vérifiez que votre caméra est bien connectée</li>
                <li>• Fermez les autres applications utilisant la caméra (Zoom, Teams, etc.)</li>
                <li>• Autorisez l'accès à la caméra dans les paramètres de votre navigateur</li>
                <li>• Rechargez la page et réessayez</li>
                <li>• Utilisez un navigateur moderne (Chrome, Firefox, Safari)</li>
              </ul>
            </div>
            
                         <div className="flex space-x-3 mt-4">
               <button
                 onClick={startCamera}
                 className="bg-blue-600 hover:bg-blue-700 text-white px-4 py-2 rounded-lg text-sm transition-colors"
               >
                 Réessayer
               </button>
               <button
                 onClick={async () => {
                   await forceReleaseCamera();
                   setTimeout(() => startCamera(), 1000);
                 }}
                 className="bg-orange-600 hover:bg-orange-700 text-white px-4 py-2 rounded-lg text-sm transition-colors"
               >
                 Forcer Libération
               </button>
               <button
                 onClick={startTestMode}
                 className="bg-green-600 hover:bg-green-700 text-white px-4 py-2 rounded-lg text-sm transition-colors"
               >
                 Mode Test (Recommandé)
               </button>
             </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default MediaPipeAnalyzer;
