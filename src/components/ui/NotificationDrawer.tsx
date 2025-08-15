'use client';

import { useEffect } from 'react';

export interface NotificationData {
  type: 'success' | 'error' | 'warning' | 'info';
  title: string;
  message: string;
  details?: {
    email?: string;
    password?: string;
    companyName?: string;
  };
  duration?: number;
}

interface NotificationDrawerProps {
  notification: NotificationData | null;
  onClose: () => void;
}

export default function NotificationDrawer({ notification, onClose }: NotificationDrawerProps) {
  useEffect(() => {
    console.log('🔔 NotificationDrawer useEffect:', { notification });

    if (notification) {
      console.log('🔔 Affichage de la notification:', notification);

      // Auto-close after duration
      if (notification.duration !== 0) {
        const timer = setTimeout(() => {
          console.log('🔔 Auto-fermeture de la notification');
          onClose();
        }, notification.duration || 8000);

        return () => clearTimeout(timer);
      }
    }
  }, [notification, onClose, notification?.duration]);

  console.log('🔔 NotificationDrawer render:', { notification });
  
  if (!notification) {
    console.log('🔔 Pas de notification, retour null');
    return null;
  }

  console.log('🔔 Rendu du drawer de notification');
  
  // Rendu simple et direct
  return (
    <div 
      className="fixed top-4 right-4 z-50 w-96 max-w-sm bg-green-500 text-white p-4 rounded-lg shadow-lg"
      style={{ zIndex: 9999 }}
    >
      <h3 className="font-bold mb-2">✅ {notification.title}</h3>
      <p className="mb-2">{notification.message}</p>
      {notification.details && (
        <div className="bg-white/20 p-3 rounded mb-3">
          <p><strong>Email RH:</strong> {notification.details.email}</p>
          <p><strong>Mot de passe:</strong> {notification.details.password}</p>
          <p><strong>Entreprise:</strong> {notification.details.companyName}</p>
        </div>
      )}
      <button 
        onClick={() => onClose()}
        className="bg-white/20 px-4 py-2 rounded hover:bg-white/30"
      >
        Fermer
      </button>
    </div>
  );
}
