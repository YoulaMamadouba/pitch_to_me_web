'use client';

import { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Eye, EyeOff, Lock, AlertTriangle } from 'lucide-react';
import { apiCall } from '@/lib/apiUtils';
import { getSupabase } from '@/lib/supabase';

interface ForcePasswordChangeModalProps {
  isOpen: boolean;
  onPasswordChanged: () => void;
}

export default function ForcePasswordChangeModal({ 
  isOpen, 
  onPasswordChanged 
}: ForcePasswordChangeModalProps) {
  const [formData, setFormData] = useState({
    currentPassword: '',
    newPassword: '',
    confirmPassword: ''
  });
  const [showPasswords, setShowPasswords] = useState({
    current: false,
    new: false,
    confirm: false
  });
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState('');
  const [success, setSuccess] = useState(false);

  const handleInputChange = (field: string, value: string) => {
    setFormData(prev => ({ ...prev, [field]: value }));
    setError(''); // Clear error when user types
  };

  const togglePasswordVisibility = (field: 'current' | 'new' | 'confirm') => {
    setShowPasswords(prev => ({ ...prev, [field]: !prev[field] }));
  };

  const validatePassword = (password: string) => {
    const minLength = 8;
    const hasUpperCase = /[A-Z]/.test(password);
    const hasLowerCase = /[a-z]/.test(password);
    const hasNumbers = /\d/.test(password);
    const hasSpecialChar = /[!@#$%^&*(),.?":{}|<>]/.test(password);

    if (password.length < minLength) {
      return 'Le mot de passe doit contenir au moins 8 caractères';
    }
    if (!hasUpperCase) {
      return 'Le mot de passe doit contenir au moins une majuscule';
    }
    if (!hasLowerCase) {
      return 'Le mot de passe doit contenir au moins une minuscule';
    }
    if (!hasNumbers) {
      return 'Le mot de passe doit contenir au moins un chiffre';
    }
    if (!hasSpecialChar) {
      return 'Le mot de passe doit contenir au moins un caractère spécial';
    }
    return null;
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError('');

    // Validation
    if (formData.newPassword !== formData.confirmPassword) {
      setError('Les mots de passe ne correspondent pas');
      return;
    }

    const passwordError = validatePassword(formData.newPassword);
    if (passwordError) {
      setError(passwordError);
      return;
    }

    setIsLoading(true);

    try {
      // Récupérer le token d'authentification
      const supabase = getSupabase();
      const { data: { session }, error: sessionError } = await supabase.auth.getSession();
      
      if (sessionError || !session?.access_token) {
        setError('Erreur d\'authentification');
        setIsLoading(false);
        return;
      }

      // Récupérer l'email de l'utilisateur actuel
      const { data: { user }, error: userError } = await supabase.auth.getUser(session.access_token);
      if (userError || !user?.email) {
        setError('Impossible de récupérer les informations utilisateur');
        setIsLoading(false);
        return;
      }

      const result = await apiCall('/api/change-password', {
        method: 'POST',
        headers: {
          'Authorization': `Bearer ${session.access_token}`
        },
        body: JSON.stringify({
          currentPassword: formData.currentPassword,
          newPassword: formData.newPassword
        }),
      });

      if (result.success) {
        setSuccess(true);
        
        // Attendre un peu puis se reconnecter avec le nouveau mot de passe
        setTimeout(async () => {
          try {
            console.log('🔧 Reconnexion avec le nouveau mot de passe...');
            
            // Se reconnecter avec le nouveau mot de passe
            const { data: signInData, error: signInError } = await supabase.auth.signInWithPassword({
              email: user.email,
              password: formData.newPassword
            });

            if (signInError) {
              console.error('❌ Erreur lors de la reconnexion:', signInError);
              // Rediriger vers la page de connexion
              window.location.href = '/login';
              return;
            }

            console.log('✅ Reconnexion réussie');
            
            // Appeler le callback de succès
            onPasswordChanged();
            
          } catch (reconnectError) {
            console.error('❌ Erreur lors de la reconnexion:', reconnectError);
            // Rediriger vers la page de connexion en cas d'erreur
            window.location.href = '/login';
          }
        }, 1500);
        
      } else {
        setError(result.error || 'Erreur lors du changement de mot de passe');
      }
    } catch (error) {
      setError('Erreur de connexion au serveur');
    } finally {
      setIsLoading(false);
    }
  };

  if (!isOpen) return null;

  return (
    <AnimatePresence>
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        exit={{ opacity: 0 }}
        className="fixed inset-0 bg-black/80 backdrop-blur-sm z-50 flex items-center justify-center p-4"
      >
        <motion.div
          initial={{ scale: 0.9, opacity: 0 }}
          animate={{ scale: 1, opacity: 1 }}
          exit={{ scale: 0.9, opacity: 0 }}
          className="bg-gray-900 border border-gray-700 rounded-xl p-5 w-full max-w-sm mx-4"
        >
          {/* Header */}
          <div className="text-center mb-4">
            <div className="w-12 h-12 bg-yellow-500/20 rounded-full flex items-center justify-center mx-auto mb-3">
              <Lock className="w-6 h-6 text-yellow-400" />
            </div>
            <h2 className="text-lg font-bold text-white mb-1">
              Changement de mot de passe
            </h2>
            <p className="text-gray-400 text-xs">
              Mot de passe temporaire à changer
            </p>
          </div>

          {success ? (
            <div className="text-center">
              <div className="w-12 h-12 bg-green-500/20 rounded-full flex items-center justify-center mx-auto mb-3">
                <div className="w-6 h-6 bg-green-500 rounded-full flex items-center justify-center">
                  <svg className="w-3 h-3 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                  </svg>
                </div>
              </div>
              <h3 className="text-base font-semibold text-white mb-1">Mot de passe changé !</h3>
              <p className="text-gray-400 text-xs">Reconnexion en cours...</p>
            </div>
          ) : (
            <form onSubmit={handleSubmit} className="space-y-3">
              {/* Current Password */}
              <div>
                <label className="block text-xs font-medium text-gray-300 mb-1">
                  Mot de passe actuel
                </label>
                <div className="relative">
                  <input
                    type={showPasswords.current ? 'text' : 'password'}
                    value={formData.currentPassword}
                    onChange={(e) => handleInputChange('currentPassword', e.target.value)}
                    className="w-full bg-gray-800 border border-gray-600 rounded-lg px-3 py-2 text-sm text-white placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-yellow-500 focus:border-transparent"
                    placeholder="Mot de passe actuel"
                    required
                  />
                  <button
                    type="button"
                    onClick={() => togglePasswordVisibility('current')}
                    className="absolute right-2 top-1/2 transform -translate-y-1/2 text-gray-400 hover:text-white"
                  >
                    {showPasswords.current ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
                  </button>
                </div>
              </div>

              {/* New Password */}
              <div>
                <label className="block text-xs font-medium text-gray-300 mb-1">
                  Nouveau mot de passe
                </label>
                <div className="relative">
                  <input
                    type={showPasswords.new ? 'text' : 'password'}
                    value={formData.newPassword}
                    onChange={(e) => handleInputChange('newPassword', e.target.value)}
                    className="w-full bg-gray-800 border border-gray-600 rounded-lg px-3 py-2 text-sm text-white placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-yellow-500 focus:border-transparent"
                    placeholder="Nouveau mot de passe"
                    required
                  />
                  <button
                    type="button"
                    onClick={() => togglePasswordVisibility('new')}
                    className="absolute right-2 top-1/2 transform -translate-y-1/2 text-gray-400 hover:text-white"
                  >
                    {showPasswords.new ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
                  </button>
                </div>
              </div>

              {/* Confirm Password */}
              <div>
                <label className="block text-xs font-medium text-gray-300 mb-1">
                  Confirmer
                </label>
                <div className="relative">
                  <input
                    type={showPasswords.confirm ? 'text' : 'password'}
                    value={formData.confirmPassword}
                    onChange={(e) => handleInputChange('confirmPassword', e.target.value)}
                    className="w-full bg-gray-800 border border-gray-600 rounded-lg px-3 py-2 text-sm text-white placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-yellow-500 focus:border-transparent"
                    placeholder="Confirmer le mot de passe"
                    required
                  />
                  <button
                    type="button"
                    onClick={() => togglePasswordVisibility('confirm')}
                    className="absolute right-2 top-1/2 transform -translate-y-1/2 text-gray-400 hover:text-white"
                  >
                    {showPasswords.confirm ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
                  </button>
                </div>
              </div>

              {/* Password Requirements - Compact */}
              <div className="bg-gray-800/50 rounded-lg p-2">
                <h4 className="text-xs font-medium text-gray-300 mb-1">Exigences :</h4>
                <div className="grid grid-cols-2 gap-1">
                  <div className={`text-xs ${formData.newPassword.length >= 8 ? 'text-green-400' : 'text-gray-400'}`}>
                    • 8+ caractères
                  </div>
                  <div className={`text-xs ${/[A-Z]/.test(formData.newPassword) ? 'text-green-400' : 'text-gray-400'}`}>
                    • Majuscule
                  </div>
                  <div className={`text-xs ${/[a-z]/.test(formData.newPassword) ? 'text-green-400' : 'text-gray-400'}`}>
                    • Minuscule
                  </div>
                  <div className={`text-xs ${/\d/.test(formData.newPassword) ? 'text-green-400' : 'text-gray-400'}`}>
                    • Chiffre
                  </div>
                  <div className={`text-xs ${/[!@#$%^&*(),.?":{}|<>]/.test(formData.newPassword) ? 'text-green-400' : 'text-gray-400'}`}>
                    • Caractère spécial
                  </div>
                </div>
              </div>

              {/* Error Message */}
              {error && (
                <div className="bg-red-500/10 border border-red-500/20 rounded-lg p-2 flex items-center">
                  <AlertTriangle className="w-4 h-4 text-red-400 mr-2 flex-shrink-0" />
                  <span className="text-red-400 text-xs">{error}</span>
                </div>
              )}

              {/* Submit Button */}
              <button
                type="submit"
                disabled={isLoading}
                className="w-full bg-gradient-to-r from-yellow-400 to-amber-500 hover:from-yellow-300 hover:to-amber-400 disabled:opacity-50 disabled:cursor-not-allowed text-black font-semibold py-2 px-4 rounded-lg transition-all transform hover:scale-[1.02] active:scale-95 text-sm"
              >
                {isLoading ? (
                  <div className="flex items-center justify-center">
                    <div className="w-4 h-4 border-2 border-black border-t-transparent rounded-full animate-spin mr-2"></div>
                    Changement...
                  </div>
                ) : (
                  'Changer le mot de passe'
                )}
              </button>
            </form>
          )}
        </motion.div>
      </motion.div>
    </AnimatePresence>
  );
}
