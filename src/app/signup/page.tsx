'use client';
import { useState } from 'react';
import Link from 'next/link';
import { Eye, EyeOff, Mail, Lock, User, ArrowLeft, Building, UserCheck, Phone } from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';

export default function SignupPage() {
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);
  const [showOtpModal, setShowOtpModal] = useState(false);
  const [formData, setFormData] = useState({
    firstName: '',
    lastName: '',
    email: '',
    phone: '+33 6 12 34 56 78',
    password: '',
    confirmPassword: '',
    accountType: 'b2c',
    country: '',
    termsAccepted: false
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

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-900 via-blue-900 to-gray-900 flex flex-col">
      {/* Fixed Header */}
      <div className="fixed top-0 left-0 right-0 z-50 flex justify-between items-center p-4 bg-black bg-opacity-20 backdrop-blur-sm border-b border-gray-700">
        <Link href="/" className="text-white hover:text-yellow-400 transition-colors">
          <ArrowLeft className="w-6 h-6" />
        </Link>
        <div className="text-lg font-bold text-white">Create Account</div>
        <div className="w-6"></div>
      </div>

      {/* Main Content */}
      <div className="flex-1 flex items-center justify-center px-4 pt-20 pb-8">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6 }}
          className="w-full max-w-lg"
        >
          {/* Signup Card */}
          <div className="bg-gray-800 bg-opacity-50 backdrop-blur-sm rounded-2xl p-8 border border-gray-600 shadow-2xl">
            {/* Progress Indicator */}
            <div className="flex items-center justify-center space-x-2 mb-4">
              <div className="w-8 h-1 bg-yellow-400 rounded-full"></div>
              <div className="w-8 h-1 bg-gray-600 rounded-full"></div>
              <div className="w-8 h-1 bg-gray-600 rounded-full"></div>
            </div>
            <p className="text-center text-gray-400 text-sm mb-6">Step 1 of 3</p>

            {/* Hero Section */}
            <div className="text-center mb-6">
              <div className="w-16 h-16 bg-gradient-to-r from-yellow-400 to-yellow-500 rounded-full mx-auto mb-4 flex items-center justify-center">
                <User className="w-8 h-8 text-black" />
              </div>
              <h1 className="text-2xl font-bold text-white mb-2">Join Pitch to Me</h1>
              <p className="text-gray-300 text-sm">Start your journey to speaking mastery</p>
            </div>

            {/* Social Login Cards */}
            <div className="space-y-3 mb-6">
              <button className="w-full bg-white text-gray-800 py-2.5 rounded-xl flex items-center justify-center space-x-3 font-medium hover:bg-gray-100 transition-colors">
                <svg className="w-4 h-4" viewBox="0 0 24 24">
                  <path fill="#4285F4" d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z"/>
                  <path fill="#34A853" d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z"/>
                  <path fill="#FBBC05" d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l2.85-2.22.81-.62z"/>
                  <path fill="#EA4335" d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z"/>
                </svg>
                <span>Continue with Google</span>
              </button>

              <button className="w-full bg-blue-600 text-white py-2.5 rounded-xl flex items-center justify-center space-x-3 font-medium hover:bg-blue-700 transition-colors">
                <svg className="w-4 h-4" fill="currentColor" viewBox="0 0 24 24">
                  <path d="M24 12.073c0-6.627-5.373-12-12-12s-12 5.373-12 12c0 5.99 4.388 10.954 10.125 11.854v-8.385H7.078v-3.47h3.047V9.43c0-3.007 1.792-4.669 4.533-4.669 1.312 0 2.686.235 2.686.235v2.953H15.83c-1.491 0-1.956.925-1.956 1.874v2.25h3.328l-.532 3.47h-2.796v8.385C19.612 23.027 24 18.062 24 12.073z"/>
                </svg>
                <span>Continue with Facebook</span>
              </button>

              <button className="w-full bg-black text-white py-2.5 rounded-xl flex items-center justify-center space-x-3 font-medium border border-gray-600 hover:bg-gray-900 transition-colors">
                <svg className="w-4 h-4" fill="currentColor" viewBox="0 0 24 24">
                  <path d="M12.017 0C5.396 0 .029 5.367.029 11.987c0 5.079 3.158 9.417 7.618 11.174-.105-.949-.199-2.403.041-3.439.219-.937 1.406-5.957 1.406-5.957s-.359-.72-.359-1.781c0-1.663.967-2.911 2.168-2.911 1.024 0 1.518.769 1.518 1.688 0 1.029-.653 2.567-.992 3.992-.285 1.193.6 2.165 1.775 2.165 2.128 0 3.768-2.245 3.768-5.487 0-2.861-2.063-4.869-5.008-4.869-3.41 0-5.409 2.562-5.409 5.199 0 1.033.394 2.143.889 2.741.099.12.112.225.085.345-.09.375-.293 1.199-.334 1.363-.053.225-.172.271-.402.165-1.495-.69-2.433-2.878-2.433-4.646 0-3.776 2.748-7.252 7.92-7.252 4.158 0 7.392 2.967 7.392 6.923 0 4.135-2.607 7.462-6.233 7.462-1.214 0-2.357-.629-2.746-1.378l-.748 2.853c-.271 1.043-1.002 2.35-1.492 3.146C9.57 23.812 10.763 24.009 12.017 24c6.624 0 11.99-5.367 11.99-11.987C24.007 5.367 18.641.001 12.017.001z"/>
                </svg>
                <span>Continue with Apple</span>
              </button>
            </div>

            {/* Divider */}
            <div className="flex items-center mb-6">
              <div className="flex-1 h-px bg-gray-600"></div>
              <span className="px-4 text-gray-400 text-sm">or</span>
              <div className="flex-1 h-px bg-gray-600"></div>
            </div>

            {/* Registration Form */}
            <form onSubmit={handleSubmit} className="space-y-4 mb-6">
              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block text-gray-300 text-sm mb-2">First Name</label>
                  <input
                    type="text"
                    placeholder="John"
                    value={formData.firstName}
                    onChange={(e) => setFormData({...formData, firstName: e.target.value})}
                    className="w-full bg-gray-700 bg-opacity-50 border border-gray-600 rounded-lg px-4 py-3 text-white placeholder-gray-400 focus:outline-none focus:border-yellow-400 focus:shadow-lg focus:shadow-yellow-400/20 transition-all"
                  />
                </div>
                <div>
                  <label className="block text-gray-300 text-sm mb-2">Last Name</label>
                  <input
                    type="text"
                    placeholder="Doe"
                    value={formData.lastName}
                    onChange={(e) => setFormData({...formData, lastName: e.target.value})}
                    className="w-full bg-gray-700 bg-opacity-50 border border-gray-600 rounded-lg px-4 py-3 text-white placeholder-gray-400 focus:outline-none focus:border-yellow-400 focus:shadow-lg focus:shadow-yellow-400/20 transition-all"
                  />
                </div>
              </div>

              <div>
                <label className="block text-gray-300 text-sm mb-2">Email Address</label>
                <input
                  type="email"
                  placeholder="john.doe@example.com"
                  value={formData.email}
                  onChange={(e) => setFormData({...formData, email: e.target.value})}
                  className="w-full bg-gray-700 bg-opacity-50 border border-gray-600 rounded-lg px-4 py-3 text-white placeholder-gray-400 focus:outline-none focus:border-yellow-400 focus:shadow-lg focus:shadow-yellow-400/20 transition-all"
                />
              </div>

              <div>
                <label className="block text-gray-300 text-sm mb-2">Phone Number</label>
                <div className="flex">
                  <select className="bg-gray-700 bg-opacity-50 border border-gray-600 rounded-l-lg px-3 py-3 text-white focus:outline-none focus:border-yellow-400">
                    <option>🇺🇸 +1</option>
                    <option>🇫🇷 +33</option>
                    <option>🇨🇮 +225</option>
                    <option>🇸🇳 +221</option>
                    <option>🇲🇦 +212</option>
                  </select>
                  <input
                    type="tel"
                    placeholder="123 456 7890"
                    value={formData.phone}
                    onChange={(e) => setFormData({...formData, phone: e.target.value})}
                    className="flex-1 bg-gray-700 bg-opacity-50 border border-gray-600 border-l-0 rounded-r-lg px-4 py-3 text-white placeholder-gray-400 focus:outline-none focus:border-yellow-400 focus:shadow-lg focus:shadow-yellow-400/20 transition-all"
                  />
                </div>
              </div>

              <div>
                <label className="block text-gray-300 text-sm mb-2">Password</label>
                <div className="relative">
                  <input
                    type={showPassword ? 'text' : 'password'}
                    placeholder="••••••••"
                    value={formData.password}
                    onChange={(e) => setFormData({...formData, password: e.target.value})}
                    className="w-full bg-gray-700 bg-opacity-50 border border-gray-600 rounded-lg px-4 py-3 text-white placeholder-gray-400 focus:outline-none focus:border-yellow-400 focus:shadow-lg focus:shadow-yellow-400/20 transition-all"
                  />
                  <button
                    type="button"
                    onClick={() => setShowPassword(!showPassword)}
                    className="absolute right-3 top-1/2 transform -translate-y-1/2 text-gray-400 hover:text-white"
                  >
                    {showPassword ? <EyeOff className="w-5 h-5" /> : <Eye className="w-5 h-5" />}
                  </button>
                </div>
              </div>

              <div>
                <label className="block text-gray-300 text-sm mb-2">Country/Region</label>
                <select
                  value={formData.country}
                  onChange={(e) => setFormData({...formData, country: e.target.value})}
                  className="w-full bg-gray-700 bg-opacity-50 border border-gray-600 rounded-lg px-4 py-3 text-white focus:outline-none focus:border-yellow-400 focus:shadow-lg focus:shadow-yellow-400/20 transition-all"
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
              </div>
            </form>

            {/* Terms & Continue */}
            <div className="flex items-start space-x-3 mb-6">
              <input
                type="checkbox"
                checked={formData.termsAccepted}
                onChange={(e) => setFormData({...formData, termsAccepted: e.target.checked})}
                className="mt-1 w-4 h-4 text-yellow-400 bg-gray-700 border-gray-600 rounded focus:ring-yellow-400"
              />
              <p className="text-gray-400 text-sm">
                I agree to the <span className="text-yellow-400 underline">Terms of Service</span> and 
                <span className="text-yellow-400 underline"> Privacy Policy</span>
              </p>
            </div>
            
            <button
              type="submit"
              onClick={handleSubmit}
              className="w-full bg-gradient-to-r from-yellow-400 to-yellow-500 text-black font-semibold py-3 rounded-xl hover:from-yellow-300 hover:to-yellow-400 transition-all duration-300 shadow-lg shadow-yellow-400/25 mb-4"
            >
              Create Account
            </button>
            
            <div className="text-center">
              <p className="text-gray-400 text-sm">
                Already have an account? 
                <Link href="/login" className="text-yellow-400 underline ml-1 hover:text-yellow-300">
                  Sign In
                </Link>
              </p>
            </div>
          </div>
        </motion.div>
      </div>

      {/* OTP Modal */}
      <AnimatePresence>
        {showOtpModal && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4"
          >
            <motion.div
              initial={{ scale: 0.9, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              exit={{ scale: 0.9, opacity: 0 }}
              className="bg-gradient-to-br from-gray-900 to-gray-800 rounded-2xl p-6 w-full max-w-md"
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
                <div className="w-24 h-24 bg-gradient-to-r from-cyan-400 to-cyan-500 rounded-full mx-auto mb-4 flex items-center justify-center animate-pulse">
                  <Phone className="w-12 h-12 text-black" />
                </div>
                <h1 className="text-2xl font-bold text-white mb-2">Verify Your Phone</h1>
                <p className="text-gray-300 text-sm mb-1">We've sent a 6-digit code to</p>
                <p className="text-yellow-400 font-medium">{formData.phone}</p>
              </div>

              {/* OTP Input */}
              <div className="mb-6">
                <div className="flex justify-center space-x-3 mb-4">
                  {[1, 2, 3, 4, 5, 6].map((digit) => (
                    <input
                      key={digit}
                      type="text"
                      maxLength={1}
                      className="w-12 h-12 bg-gray-800 bg-opacity-50 border border-gray-600 rounded-lg text-white text-center text-xl font-bold focus:outline-none focus:border-yellow-400 focus:shadow-lg focus:shadow-yellow-400/20"
                    />
                  ))}
                </div>

                <div className="text-center">
                  <p className="text-gray-400 text-sm mb-2">Didn't receive the code?</p>
                  <button className="text-yellow-400 font-medium text-sm underline hover:text-yellow-300">
                    Resend Code
                  </button>
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

