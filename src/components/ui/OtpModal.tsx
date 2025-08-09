import { motion, AnimatePresence } from 'framer-motion';
import { X, ArrowLeft, Phone } from 'lucide-react';

interface OtpModalProps {
  isOpen: boolean;
  onClose: () => void;
  phoneNumber: string;
  onVerify: () => void;
  onResendCode: () => void;
  title?: string;
  subtitle?: string;
  buttonText?: string;
}

export default function OtpModal({
  isOpen,
  onClose,
  phoneNumber,
  onVerify,
  onResendCode,
  title = "Verify Your Phone",
  subtitle = "We've sent a 6-digit code to",
  buttonText = "Continue"
}: OtpModalProps) {
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
              aria-label="Close"
            >
              <X className="w-5 h-5" />
            </button>

            {/* Header */}
            <div className="text-center mb-6">
              <div className="w-20 h-20 bg-gradient-to-r from-cyan-400 to-cyan-500 rounded-full mx-auto mb-4 flex items-center justify-center">
                <Phone className="w-10 h-10 text-black" />
              </div>
              <h2 className="text-xl font-bold text-white mb-1">{title}</h2>
              <p className="text-gray-300 text-sm">
                {subtitle} <span className="text-yellow-400 font-medium">{phoneNumber}</span>
              </p>
            </div>

            {/* OTP Input */}
            <div className="mb-6">
              <div className="flex justify-center space-x-2 mb-4">
                {[1, 2, 3, 4, 5, 6].map((digit) => (
                  <input
                    key={digit}
                    type="text"
                    maxLength={1}
                    inputMode="numeric"
                    pattern="[0-9]*"
                    className="w-12 h-12 bg-gray-700 border border-gray-600 rounded-lg text-white text-center text-xl font-bold focus:outline-none focus:border-yellow-400 focus:ring-2 focus:ring-yellow-400/30 transition-all"
                  />
                ))}
              </div>

              <div className="text-center">
                <p className="text-gray-400 text-sm mb-2">Didn't receive the code?</p>
                <button 
                  onClick={onResendCode}
                  className="text-yellow-400 font-medium text-sm hover:text-yellow-300 transition-colors"
                >
                  Resend Code
                </button>
              </div>
            </div>

            {/* Continue Button */}
            <button
              onClick={onVerify}
              className="w-full bg-gradient-to-r from-yellow-400 to-yellow-500 text-black font-semibold py-3 rounded-xl hover:from-yellow-300 hover:to-yellow-400 transition-all duration-300 shadow-lg shadow-yellow-400/20"
            >
              {buttonText}
            </button>
          </motion.div>
        </motion.div>
      )}
    </AnimatePresence>
  );
}
