// Configuration MediaPipe pour l'analyse en temps réel
export const MEDIAPIPE_CONFIG = {
  // URLs des modèles MediaPipe
  models: {
    poseLandmarker: "https://storage.googleapis.com/mediapipe-models/pose_landmarker/pose_landmarker_lite/float16/1/pose_landmarker_lite.task",
    faceLandmarker: "https://storage.googleapis.com/mediapipe-models/face_landmarker/face_landmarker/float16/1/face_landmarker.task"
  },
  
  // Configuration CDN
  cdn: {
    wasm: "https://cdn.jsdelivr.net/npm/@mediapipe/tasks-vision@latest/wasm"
  },
  
  // Paramètres d'analyse
  analysis: {
    // Nombre de poses/visages à détecter
    numPoses: 1,
    numFaces: 1,
    
    // Mode d'exécution
    runningMode: "VIDEO" as const,
    
    // Délégation GPU
    delegate: "GPU" as const,
    
    // Seuils de confiance
    confidenceThreshold: 0.5,
    
    // FPS cible
    targetFPS: 30
  },
  
  // Paramètres de calcul des métriques
  metrics: {
    // Seuils pour les scores
    thresholds: {
      excellent: 80,
      good: 60,
      poor: 40
    },
    
    // Pondération des métriques
    weights: {
      posture: 0.4,
      eyeContact: 0.4,
      gestures: 0.2
    }
  },
  
  // Configuration vidéo
  video: {
    width: 1280,
    height: 720,
    facingMode: 'user' as const
  }
};

// Types pour MediaPipe
export interface MediaPipeResults {
  pose: {
    landmarks?: any[][];
    worldLandmarks?: any[][];
  };
  face: {
    faceLandmarks?: any[][];
    faceBlendshapes?: any[];
  };
}

// Fonction utilitaire pour calculer le score de confiance
export const calculateConfidenceScore = (metrics: {
  posture: number;
  eyeContact: number;
  gestures: number;
}): number => {
  const { weights } = MEDIAPIPE_CONFIG.metrics;
  
  return Math.round(
    metrics.posture * weights.posture +
    metrics.eyeContact * weights.eyeContact +
    metrics.gestures * weights.gestures
  );
};

// Fonction utilitaire pour obtenir la couleur du score
export const getScoreColor = (score: number): string => {
  const { thresholds } = MEDIAPIPE_CONFIG.metrics;
  
  if (score >= thresholds.excellent) return 'text-green-400';
  if (score >= thresholds.good) return 'text-yellow-400';
  if (score >= thresholds.poor) return 'text-orange-400';
  return 'text-red-400';
};

// Fonction utilitaire pour obtenir la couleur de la barre de score
export const getScoreBarColor = (score: number): string => {
  const { thresholds } = MEDIAPIPE_CONFIG.metrics;
  
  if (score >= thresholds.excellent) return 'bg-green-400';
  if (score >= thresholds.good) return 'bg-yellow-400';
  if (score >= thresholds.poor) return 'bg-orange-400';
  return 'bg-red-400';
};
