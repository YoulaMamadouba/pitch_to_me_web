import { ReactNode } from 'react';
import { motion } from 'framer-motion';

interface AuthCardProps {
  title: string;
  subtitle: string;
  children: ReactNode;
  icon: ReactNode;
  showProgress?: boolean;
  currentStep?: number;
  totalSteps?: number;
  footer?: ReactNode;
  className?: string;
}

export default function AuthCard({
  title,
  subtitle,
  children,
  icon,
  showProgress = false,
  currentStep = 1,
  totalSteps = 1,
  footer,
  className = ''
}: AuthCardProps) {
  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.6 }}
      className={`bg-gray-800 bg-opacity-50 backdrop-blur-sm rounded-2xl p-8 border border-gray-600 shadow-2xl w-full max-w-md ${className}`}
    >
      {showProgress && totalSteps > 1 && (
        <div className="mb-6">
          <div className="flex items-center justify-center space-x-2 mb-2">
            {Array.from({ length: totalSteps }).map((_, index) => (
              <div 
                key={index}
                className={`w-8 h-1 rounded-full ${index < currentStep ? 'bg-yellow-400' : 'bg-gray-600'}`}
              />
            ))}
          </div>
          <p className="text-center text-gray-400 text-sm">
            Step {currentStep} of {totalSteps}
          </p>
        </div>
      )}

      <div className="text-center mb-8">
        <div className="w-16 h-16 bg-gradient-to-r from-yellow-400 to-yellow-500 rounded-full mx-auto mb-4 flex items-center justify-center">
          {icon}
        </div>
        <h1 className="text-2xl font-bold text-white mb-2">{title}</h1>
        <p className="text-gray-300 text-sm">{subtitle}</p>
      </div>

      <div className="space-y-6">
        {children}
      </div>

      {footer && (
        <div className="mt-8 pt-6 border-t border-gray-700">
          {footer}
        </div>
      )}
    </motion.div>
  );
}
