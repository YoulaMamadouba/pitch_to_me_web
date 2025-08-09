'use client';
import { useState } from 'react';
import Link from 'next/link';
import { Eye, EyeOff, Mail, Lock, User, Building, UserCheck, Phone, ArrowLeft } from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';
import AuthCard from '@/components/ui/AuthCard';
import OtpModal from '@/components/ui/OtpModal';
import AuthPageHeader from '@/components/ui/AuthPageHeader';

export default function SignupPage() {
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);
  const [showOtpModal, setShowOtpModal] = useState(false);
  const [formData, setFormData] = useState({
    firstName: 'John',
    lastName: 'Doe',
    email: 'john.doe@example.com',
    phone: '+33 6 12 34 56 78',
    password: 'SecurePass123!',
    confirmPassword: 'SecurePass123!',
    accountType: 'b2c',
    country: 'FR',
    termsAccepted: true
  });

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    // Afficher la popup de vérification téléphonique
    setShowOtpModal(true);
  };

  const handleOtpSubmit = () => {
    // Rediriger vers la page de paiement
    window.location.href = '/payment';
  };

  const handleResendCode = () => {
    // TODO: Implement resend code logic
    console.log('Resending code...');
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-900 via-blue-900 to-gray-900 flex flex-col">
      {/* Auth Page Header */}
      <AuthPageHeader pageTitle="Inscription" />
      
      {/* Main Content */}
      <div className="flex-1 flex items-center justify-center p-4 pt-24">
        <AuthCard
          title="Join Pitch to Me"
          subtitle="Start your journey to speaking mastery"
          icon={<User className="w-8 h-8 text-black" />}
          showProgress={true}
          currentStep={1}
          totalSteps={3}
        >

          {/* Social Login */}
          <div className="space-y-3 mb-6">
            <button 
              type="button"
              className="w-full bg-white text-gray-800 py-2.5 rounded-xl flex items-center justify-center space-x-3 font-medium hover:bg-gray-100 transition-colors"
            >
              <svg className="w-5 h-5" viewBox="0 0 24 24" fill="currentColor">
                <path fill="#4285F4" d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z"/>
                <path fill="#34A853" d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z"/>
                <path fill="#FBBC05" d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l2.85-2.22.81-.62z"/>
                <path fill="#EA4335" d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z"/>
              </svg>
              <span>Continue with Google</span>
            </button>

            <button 
              type="button"
              className="w-full bg-blue-600 text-white py-2.5 rounded-xl flex items-center justify-center space-x-3 font-medium hover:bg-blue-700 transition-colors"
            >
              <svg className="w-5 h-5" fill="currentColor" viewBox="0 0 24 24">
                <path d="M24 12.073c0-6.627-5.373-12-12-12s-12 5.373-12 12c0 5.99 4.388 10.954 10.125 11.854v-8.385H7.078v-3.47h3.047V9.43c0-3.007 1.792-4.669 4.533-4.669 1.312 0 2.686.235 2.686.235v2.953H15.83c-1.491 0-1.956.925-1.956 1.874v2.25h3.328l-.532 3.47h-2.796v8.385C19.612 23.027 24 18.062 24 12.073z"/>
              </svg>
              <span>Continue with Facebook</span>
            </button>

            <button 
              type="button"
              className="w-full bg-black text-white py-2.5 rounded-xl flex items-center justify-center space-x-3 font-medium border border-gray-600 hover:bg-gray-900 transition-colors"
            >
              <svg className="w-5 h-5" fill="currentColor" viewBox="0 0 24 24">
                <path d="M12.017 0C5.396 0 .029 5.367.029 11.987c0 5.079 3.158 9.417 7.618 11.174-.105-.949-.199-2.403.041-3.439.219-.937 1.406-5.957 1.406-5.957s-.359-.72-.359-1.781c0-1.663.967-2.911 2.168-2.911 1.024 0 1.518.769 1.518 1.688 0 1.029-.653 2.567-.992 3.992-.285 1.193.6 2.165 1.775 2.165 2.128 0 3.768-2.245 3.768-5.487 0-2.861-2.063-4.869-5.008-4.869-3.41 0-5.409 2.562-5.409 5.199 0 1.033.394 2.143.889 2.741.099.12.112.225.085.345-.09.375-.293 1.199-.334 1.363-.053.225-.172.271-.402.165-1.495-.69-2.433-2.878-2.433-4.646 0-3.776 2.748-7.252 7.92-7.252 4.158 0 7.392 2.967 7.392 6.923 0 4.135-2.607 7.462-6.233 7.462-1.214 0-2.357-.629-2.746-1.378l-.748 2.853c-.271 1.043-1.002 2.35-1.492 3.146C9.57 23.812 10.763 24.009 12.017 24c6.624 0 11.99-5.367 11.99-11.987C24.007 5.367 18.641.001 12.017.001z"/>
              </svg>
              <span>Continue with Apple</span>
            </button>
          </div>

          {/* Divider */}
          <div className="relative my-6">
            <div className="absolute inset-0 flex items-center" aria-hidden="true">
              <div className="w-full border-t border-gray-600"></div>
            </div>
            <div className="relative flex justify-center text-sm">
              <span className="px-2 bg-gray-800 text-gray-400">Or sign up with email</span>
            </div>
          </div>

          {/* Registration Form */}
          <form onSubmit={handleSubmit} className="space-y-4">
            <div className="grid grid-cols-2 gap-3">
              <div>
                <label htmlFor="firstName" className="block text-gray-300 text-sm font-medium mb-2">
                  First Name
                </label>
                <div className="relative">
                  <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                    <User className="h-4 w-4 text-gray-400" />
                  </div>
                  <input
                    id="firstName"
                    type="text"
                    placeholder="John"
                    value={formData.firstName}
                    onChange={(e) => setFormData({...formData, firstName: e.target.value})}
                    className="w-full bg-gray-700 bg-opacity-50 border border-gray-600 rounded-lg pl-10 pr-4 py-3 text-white placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-yellow-400/30 focus:border-yellow-400 transition-all"
                    required
                  />
                </div>
              </div>
              <div>
                <label htmlFor="lastName" className="block text-gray-300 text-sm font-medium mb-2">
                  Last Name
                </label>
                <div className="relative">
                  <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                    <User className="h-4 w-4 text-gray-400" />
                  </div>
                  <input
                    id="lastName"
                    type="text"
                    placeholder="Doe"
                    value={formData.lastName}
                    onChange={(e) => setFormData({...formData, lastName: e.target.value})}
                    className="w-full bg-gray-700 bg-opacity-50 border border-gray-600 rounded-lg pl-10 pr-4 py-3 text-white placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-yellow-400/30 focus:border-yellow-400 transition-all"
                    required
                  />
                </div>
              </div>
            </div>

            <div>
              <label htmlFor="email" className="block text-gray-300 text-sm font-medium mb-2">
                Email Address
              </label>
              <div className="relative">
                <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                  <Mail className="h-4 w-4 text-gray-400" />
                </div>
                <input
                  id="email"
                  type="email"
                  placeholder="john.doe@example.com"
                  value={formData.email}
                  onChange={(e) => setFormData({...formData, email: e.target.value})}
                  className="w-full bg-gray-700 bg-opacity-50 border border-gray-600 rounded-lg pl-10 pr-4 py-3 text-white placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-yellow-400/30 focus:border-yellow-400 transition-all"
                  required
                />
              </div>
            </div>

            <div>
              <label htmlFor="phone" className="block text-gray-300 text-sm font-medium mb-2">
                Phone Number
              </label>
              <div className="flex">
                <select 
                  className="bg-gray-700 bg-opacity-50 border border-gray-600 rounded-l-lg px-3 py-3 text-white focus:outline-none focus:ring-2 focus:ring-yellow-400/30 focus:border-yellow-400"
                  value={formData.phone.split(' ')[0]}
                  onChange={(e) => {
                    const prefix = e.target.value;
                    const currentNumber = formData.phone.split(' ').slice(1).join(' ');
                    setFormData({...formData, phone: `${prefix} ${currentNumber}`});
                  }}
                >
                  <option value="+1">🇺🇸 +1</option>
                  <option value="+33">🇫🇷 +33</option>
                  <option value="+225">🇨🇮 +225</option>
                  <option value="+221">🇸🇳 +221</option>
                  <option value="+212">🇲🇦 +212</option>
                </select>
                <div className="relative flex-1">
                  <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                    <Phone className="h-4 w-4 text-gray-400" />
                  </div>
                  <input
                    id="phone"
                    type="tel"
                    placeholder="123 456 7890"
                    value={formData.phone.split(' ').slice(1).join(' ')}
                    onChange={(e) => {
                      const prefix = formData.phone.split(' ')[0];
                      setFormData({...formData, phone: `${prefix} ${e.target.value}`});
                    }}
                    className="w-full bg-gray-700 bg-opacity-50 border border-gray-600 border-l-0 rounded-r-lg pl-10 pr-4 py-3 text-white placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-yellow-400/30 focus:border-yellow-400 transition-all"
                    required
                  />
                </div>
              </div>
            </div>

            <div>
              <label htmlFor="password" className="block text-gray-300 text-sm font-medium mb-2">
                Password
              </label>
              <div className="relative">
                <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                  <Lock className="h-4 w-4 text-gray-400" />
                </div>
                <input
                  id="password"
                  type={showPassword ? 'text' : 'password'}
                  placeholder="••••••••"
                  value={formData.password}
                  onChange={(e) => setFormData({...formData, password: e.target.value})}
                  className="w-full bg-gray-700 bg-opacity-50 border border-gray-600 rounded-lg pl-10 pr-10 py-3 text-white placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-yellow-400/30 focus:border-yellow-400 transition-all"
                  required
                  minLength={8}
                />
                <button
                  type="button"
                  onClick={() => setShowPassword(!showPassword)}
                  className="absolute inset-y-0 right-0 pr-3 flex items-center text-gray-400 hover:text-white transition-colors"
                  aria-label={showPassword ? 'Hide password' : 'Show password'}
                >
                  {showPassword ? <EyeOff className="h-5 w-5" /> : <Eye className="h-5 w-5" />}
                </button>
              </div>
              <p className="mt-1 text-xs text-gray-400 mb-4">
                Must be at least 8 characters long
              </p>
            </div>

            <div>
              <label htmlFor="confirmPassword" className="block text-gray-300 text-sm font-medium mb-2">
                Confirm Password
              </label>
              <div className="relative">
                <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                  <Lock className="h-4 w-4 text-gray-400" />
                </div>
                <input
                  id="confirmPassword"
                  type={showConfirmPassword ? 'text' : 'password'}
                  placeholder="••••••••"
                  value={formData.confirmPassword}
                  onChange={(e) => setFormData({...formData, confirmPassword: e.target.value})}
                  className="w-full bg-gray-700 bg-opacity-50 border border-gray-600 rounded-lg pl-10 pr-10 py-3 text-white placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-yellow-400/30 focus:border-yellow-400 transition-all"
                  required
                />
                <button
                  type="button"
                  onClick={() => setShowConfirmPassword(!showConfirmPassword)}
                  className="absolute inset-y-0 right-0 pr-3 flex items-center text-gray-400 hover:text-white transition-colors"
                  aria-label={showConfirmPassword ? 'Hide password' : 'Show password'}
                >
                  {showConfirmPassword ? <EyeOff className="h-5 w-5" /> : <Eye className="h-5 w-5" />}
                </button>
              </div>
            </div>

            {/* Account Type */}
            <div>
              <span className="block text-gray-300 text-sm font-medium mb-2">Account Type</span>
              <div className="grid grid-cols-2 gap-3">
                <button
                  type="button"
                  onClick={() => setFormData({...formData, accountType: 'b2c'})}
                  className={`flex items-center justify-center space-x-2 py-3 px-4 rounded-lg border-2 ${
                    formData.accountType === 'b2c' 
                      ? 'border-yellow-400 bg-yellow-400/10 text-white' 
                      : 'border-gray-600 hover:border-gray-500 text-gray-300 hover:text-white'
                  } transition-colors`}
                  aria-pressed={formData.accountType === 'b2c'}
                >
                  <UserCheck className="w-5 h-5" />
                  <span>Individual</span>
                </button>
                <button
                  type="button"
                  onClick={() => setFormData({...formData, accountType: 'b2b'})}
                  className={`flex items-center justify-center space-x-2 py-3 px-4 rounded-lg border-2 ${
                    formData.accountType === 'b2b' 
                      ? 'border-yellow-400 bg-yellow-400/10 text-white' 
                      : 'border-gray-600 hover:border-gray-500 text-gray-300 hover:text-white'
                  } transition-colors`}
                  aria-pressed={formData.accountType === 'b2b'}
                >
                  <Building className="w-5 h-5" />
                  <span>Business</span>
                </button>
              </div>
            </div>

            {/* Country Selector */}
            <div>
              <label htmlFor="country" className="block text-gray-300 text-sm font-medium mb-2">
                Country/Region
              </label>
              <div className="relative">
                <select
                  id="country"
                  value={formData.country}
                  onChange={(e) => setFormData({...formData, country: e.target.value})}
                  className="w-full bg-gray-700 bg-opacity-50 border border-gray-600 rounded-lg pl-3 pr-10 py-3 text-white appearance-none focus:outline-none focus:ring-2 focus:ring-yellow-400/30 focus:border-yellow-400 transition-all"
                  required
                >
                  <option value="">Select your country</option>
                  <option value="US">🇺🇸 United States</option>
                  <option value="FR">🇫🇷 France</option>
                  <option value="CI">🇨🇮 Côte d'Ivoire</option>
                  <option value="SN">🇸🇳 Senegal</option>
                  <option value="MA">🇲🇦 Morocco</option>
                  <option value="NG">🇳🇬 Nigeria</option>
                  <option value="KE">🇰🇪 Kenya</option>
                </select>
                <div className="absolute inset-y-0 right-0 flex items-center pr-3 pointer-events-none">
                  <svg className="w-4 h-4 text-gray-400" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
                  </svg>
                </div>
              </div>
            </div>

            {/* Terms & Continue */}
            <div className="flex items-start space-x-3 mb-6">
              <input
                type="checkbox"
                id="terms"
                checked={formData.termsAccepted}
                onChange={(e) => setFormData({...formData, termsAccepted: e.target.checked})}
                className="mt-1 w-4 h-4 text-yellow-400 bg-gray-700 border-gray-600 rounded focus:ring-yellow-400"
                required
              />
              <label htmlFor="terms" className="text-gray-400 text-sm">
                I agree to the <a href="/terms" className="text-yellow-400 underline hover:text-yellow-300">Terms of Service</a> and 
                <a href="/privacy" className="text-yellow-400 underline hover:text-yellow-300"> Privacy Policy</a>
              </label>
            </div>
            
            <button
              type="submit"
              className="w-full bg-gradient-to-r from-yellow-400 to-yellow-500 text-black font-semibold py-3 rounded-xl hover:from-yellow-300 hover:to-yellow-400 transition-all duration-300 shadow-lg shadow-yellow-400/25 mb-4"
            >
              Create Account
            </button>
            
            <div className="text-center">
              <p className="text-gray-400 text-sm">
                Already have an account?{' '}
                <Link href="/login" className="text-yellow-400 underline hover:text-yellow-300">
                  Sign In
                </Link>
              </p>
            </div>
          </form>
        </AuthCard>
      </div>

      {/* OTP Modal */}
      <AnimatePresence>
        {showOtpModal && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 bg-black/80 backdrop-blur-sm flex items-center justify-center z-50 p-4"
          >
            <motion.div
              initial={{ scale: 0.95, opacity: 0, y: 20 }}
              animate={{ scale: 1, opacity: 1, y: 0 }}
              exit={{ scale: 0.95, opacity: 0, y: 20 }}
              transition={{ type: 'spring', damping: 25, stiffness: 300 }}
              className="bg-gradient-to-br from-gray-900 to-gray-800 rounded-2xl p-6 w-full max-w-sm border border-gray-700 shadow-2xl"
            >
              {/* Header */}
              <div className="flex justify-between items-center mb-6">
                <button
                  onClick={() => setShowOtpModal(false)}
                  className="text-white hover:text-gray-300"
                >
                  <ArrowLeft className="w-6 h-6" />
                </button>
                <div className="text-lg font-bold text-white">Verification</div>
                <div className="w-6"></div>
              </div>

              {/* Progress Indicator */}
              <div className="flex items-center justify-center space-x-2 mb-4">
                <div className="w-8 h-1 bg-yellow-400 rounded-full"></div>
                <div className="w-8 h-1 bg-yellow-400 rounded-full"></div>
                <div className="w-8 h-1 bg-gray-600 rounded-full"></div>
              </div>
              <p className="text-center text-gray-400 text-sm mb-6">Step 2 of 3</p>

              {/* Hero Section */}
              <div className="text-center mb-6">
                <div className="w-20 h-20 bg-gradient-to-r from-yellow-400 to-yellow-500 rounded-full mx-auto mb-4 flex items-center justify-center animate-pulse">
                  <Phone className="w-10 h-10 text-black" />
                </div>
                <h1 className="text-xl font-bold text-white mb-2">Verify Your Phone</h1>
                <p className="text-gray-300 text-xs mb-1">We've sent a 6-digit code to</p>
                <p className="text-yellow-400 font-medium text-sm">{formData.phone}</p>
              </div>

              {/* OTP Input */}
              <div className="mb-6">
                <div className="flex justify-center space-x-2 mb-4 px-2">
                  {[1, 2, 3, 4, 5, 6].map((digit) => (
                    <input
                      key={digit}
                      type="text"
                      maxLength={1}
                      className="w-10 h-12 bg-gray-800/70 border border-gray-600 rounded-lg text-white text-center text-lg font-bold focus:outline-none focus:border-yellow-400 focus:ring-2 focus:ring-yellow-400/30 transition-all"
                      autoFocus={digit === 1}
                    />
                  ))}
                </div>

                <div className="text-center">
                  <p className="text-gray-400 text-xs mb-2">Didn't receive the code? <button className="text-yellow-400 font-medium hover:underline hover:text-yellow-300">Resend Code</button></p>
                  <p className="text-xs text-gray-500 mt-2">Code expires in 04:59</p>
                </div>
              </div>

              {/* Continue Button */}
              <button
                onClick={handleOtpSubmit}
                className="w-full bg-gradient-to-r from-yellow-400 to-yellow-500 text-black font-semibold py-4 rounded-xl hover:from-yellow-300 hover:to-yellow-400 transition-all duration-300"
              >
                Continue
              </button>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}

