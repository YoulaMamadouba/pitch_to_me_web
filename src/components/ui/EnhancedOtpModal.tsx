'use client';

import { useState, useRef, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { X, ArrowLeft, Phone, Clock } from 'lucide-react';

interface EnhancedOtpModalProps {
  isOpen: boolean;
  onClose: () => void;
  phoneNumber: string;
  onVerify: (code: string) => void;
  onResendCode: () => void;
  title?: string;
  subtitle?: string;
  buttonText?: string;
}

export default function EnhancedOtpModal({
  isOpen,
  onClose,
  phoneNumber,
  onVerify,
  onResendCode,
  title = "Vérification téléphonique",
  subtitle = "Nous avons envoyé un code à 6 chiffres à",
  buttonText = "Continuer"
}: EnhancedOtpModalProps) {
  const [otpValues, setOtpValues] = useState(['', '', '', '', '', '']);
  const [timeLeft, setTimeLeft] = useState(300); // 5 minutes en secondes
  const [canResend, setCanResend] = useState(false);
  const inputRefs = useRef<(HTMLInputElement | null)[]>([]);

  // Code de test affiché en haut
  const testCode = "123456";

  useEffect(() => {
    if (isOpen) {
      setTimeLeft(300);
      setCanResend(false);
      setOtpValues(['', '', '', '', '', '']);
      // Focus sur le premier champ
      setTimeout(() => {
        inputRefs.current[0]?.focus();
      }, 100);
    }
  }, [isOpen]);

  useEffect(() => {
    let timer: NodeJS.Timeout;
    if (isOpen && timeLeft > 0) {
      timer = setInterval(() => {
        setTimeLeft(prev => {
          if (prev <= 1) {
            setCanResend(true);
            return 0;
          }
          return prev - 1;
        });
      }, 1000);
    }
    return () => clearInterval(timer);
  }, [isOpen, timeLeft]);

  const formatTime = (seconds: number) => {
    const mins = Math.floor(seconds / 60);
    const secs = seconds % 60;
    return `${mins.toString().padStart(2, '0')}:${secs.toString().padStart(2, '0')}`;
  };

  const handleOtpChange = (index: number, value: string) => {
    if (value.length > 1) return; // Empêcher plus d'un caractère

    const newOtpValues = [...otpValues];
    newOtpValues[index] = value;
    setOtpValues(newOtpValues);

    // Navigation automatique vers le champ suivant
    if (value && index < 5) {
      inputRefs.current[index + 1]?.focus();
    }
  };

  const handleKeyDown = (index: number, e: React.KeyboardEvent<HTMLInputElement>) => {
    if (e.key === 'Backspace' && !otpValues[index] && index > 0) {
      // Aller au champ précédent si le champ actuel est vide
      inputRefs.current[index - 1]?.focus();
    }
  };

  const handlePaste = (e: React.ClipboardEvent) => {
    e.preventDefault();
    const pastedData = e.clipboardData.getData('text/plain').slice(0, 6);
    if (/^\d{6}$/.test(pastedData)) {
      const newOtpValues = pastedData.split('');
      setOtpValues([...newOtpValues, '', '', '', '', '', ''].slice(0, 6));
      inputRefs.current[5]?.focus();
    }
  };

  const handleResend = () => {
    if (canResend) {
      onResendCode();
      setTimeLeft(300);
      setCanResend(false);
      setOtpValues(['', '', '', '', '', '']);
      inputRefs.current[0]?.focus();
    }
  };

  const isOtpComplete = otpValues.every(val => val !== '');
  const isOtpValid = otpValues.join('') === testCode;

  return (
    <AnimatePresence>
      {isOpen && (
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          className="fixed inset-0 bg-black bg-opacity-70 flex items-center justify-center z-50 p-4"
          onClick={(e) => e.target === e.currentTarget && onClose()}
        >
          <motion.div
            initial={{ scale: 0.9, opacity: 0, y: 20 }}
            animate={{ scale: 1, opacity: 1, y: 0 }}
            exit={{ scale: 0.9, opacity: 0, y: 20 }}
            transition={{ type: 'spring', damping: 25, stiffness: 300 }}
            className="bg-gradient-to-br from-gray-900 to-gray-800 rounded-2xl p-6 w-full max-w-sm relative"
          >
            {/* Close Button */}
            <button
              onClick={onClose}
              className="absolute top-4 right-4 text-gray-400 hover:text-white transition-colors"
              aria-label="Fermer"
            >
              <X className="w-5 h-5" />
            </button>

            {/* Code de test */}
            <div className="absolute top-4 left-4 bg-yellow-400 text-black px-2 py-1 rounded text-xs font-bold">
              Code test: {testCode}
            </div>

            {/* Header */}
            <div className="text-center mb-6 mt-8">
              <div className="w-20 h-20 bg-gradient-to-r from-cyan-400 to-cyan-500 rounded-full mx-auto mb-4 flex items-center justify-center">
                <Phone className="w-10 h-10 text-black" />
              </div>
              <h2 className="text-xl font-bold text-white mb-1">{title}</h2>
              <p className="text-gray-300 text-sm">
                {subtitle} <span className="text-yellow-400 font-medium">{phoneNumber}</span>
              </p>
            </div>

            {/* Timer */}
            <div className="bg-gray-800 bg-opacity-50 rounded-xl p-3 text-center mb-4">
              <div className="flex items-center justify-center space-x-2 mb-1">
                <Clock className="w-4 h-4 text-yellow-400" />
                <span className="text-white font-medium text-sm">Code expire dans</span>
              </div>
              <div className="text-xl font-bold text-yellow-400">{formatTime(timeLeft)}</div>
            </div>

            {/* OTP Input */}
            <div className="mb-6">
              <div className="flex justify-center space-x-2 mb-4">
                {[0, 1, 2, 3, 4, 5].map((index) => (
                  <input
                    key={index}
                    ref={(el) => (inputRefs.current[index] = el)}
                    type="text"
                    maxLength={1}
                    inputMode="numeric"
                    pattern="[0-9]*"
                    value={otpValues[index]}
                    onChange={(e) => handleOtpChange(index, e.target.value)}
                    onKeyDown={(e) => handleKeyDown(index, e)}
                    onPaste={handlePaste}
                    className={`w-12 h-12 bg-gray-700 border border-gray-600 rounded-lg text-white text-center text-xl font-bold focus:outline-none focus:border-yellow-400 focus:ring-2 focus:ring-yellow-400/30 transition-all ${
                      otpValues[index] ? 'border-yellow-400' : ''
                    }`}
                  />
                ))}
              </div>

              {/* Message de validation */}
              {isOtpComplete && (
                <div className="text-center mb-4">
                  {isOtpValid ? (
                    <p className="text-green-400 text-sm font-medium">✓ Code correct !</p>
                  ) : (
                    <p className="text-red-400 text-sm font-medium">✗ Code incorrect</p>
                  )}
                </div>
              )}

              <div className="text-center">
                <p className="text-gray-400 text-sm mb-2">Vous n'avez pas reçu le code ?</p>
                <button 
                  onClick={handleResend}
                  disabled={!canResend}
                  className={`font-medium text-sm transition-colors ${
                    canResend 
                      ? 'text-yellow-400 hover:text-yellow-300' 
                      : 'text-gray-500 cursor-not-allowed'
                  }`}
                >
                  {canResend ? 'Renvoyer le code' : `Renvoyer dans ${formatTime(timeLeft)}`}
                </button>
              </div>
            </div>

            {/* Continue Button */}
            <button
              onClick={() => onVerify(otpValues.join(''))}
              disabled={!isOtpComplete || !isOtpValid}
              className={`w-full font-semibold py-3 rounded-xl transition-all duration-300 shadow-lg ${
                isOtpComplete && isOtpValid
                  ? 'bg-gradient-to-r from-yellow-400 to-yellow-500 text-black hover:from-yellow-300 hover:to-yellow-400 shadow-yellow-400/20'
                  : 'bg-gray-600 text-gray-400 cursor-not-allowed'
              }`}
            >
              {buttonText}
            </button>
          </motion.div>
        </motion.div>
      )}
    </AnimatePresence>
  );
}
