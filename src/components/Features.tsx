'use client';

import { CheckCircle, Monitor, Users, Trophy } from 'lucide-react';
import { motion } from 'framer-motion';

const features = [
  {
    icon: CheckCircle,
    title: "AI-Powered Training",
    description: "Personalized coaching with voice analysis and real-time feedback",
    gradient: "from-yellow-400 to-yellow-500"
  },
  {
    icon: Monitor,
    title: "VR Experience",
    description: "Immersive practice environments for realistic training scenarios",
    gradient: "from-cyan-400 to-cyan-500"
  },
  {
    icon: Users,
    title: "Global Community",
    description: "Connect with speakers worldwide and share experiences",
    gradient: "from-purple-400 to-purple-500"
  },
  {
    icon: Trophy,
    title: "Certification",
    description: "Earn certificates and track your progress with detailed analytics",
    gradient: "from-pink-400 to-pink-500"
  }
];

export default function Features() {
  return (
    <section className="py-20 px-6 bg-black bg-opacity-20">
      <div className="max-w-6xl mx-auto">
        <motion.div
          initial={{ opacity: 0, y: 50 }}
          whileInView={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8 }}
          viewport={{ once: true }}
          className="text-center mb-16"
        >
          <h2 className="text-3xl md:text-4xl font-bold text-white mb-4">
            Pourquoi choisir <span className="bg-gradient-to-r from-yellow-400 to-yellow-500 bg-clip-text text-transparent">Pitch to Me</span> ?
          </h2>
          <p className="text-xl text-gray-300 max-w-2xl mx-auto">
            Découvrez les fonctionnalités qui font de notre plateforme la solution ultime pour maîtriser l'art de la prise de parole en public.
          </p>
        </motion.div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
          {features.map((feature, index) => (
            <motion.div
              key={feature.title}
              initial={{ opacity: 0, y: 50 }}
              whileInView={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6, delay: index * 0.1 }}
              viewport={{ once: true }}
              className="bg-gray-800 bg-opacity-50 p-6 rounded-xl border border-gray-700 hover:border-gray-600 transition-all hover:transform hover:scale-105"
            >
              <div className={`w-12 h-12 bg-gradient-to-r ${feature.gradient} rounded-full flex items-center justify-center mb-4`}>
                <feature.icon className="w-6 h-6 text-black" />
              </div>
              <h3 className="text-white font-semibold text-lg mb-2">{feature.title}</h3>
              <p className="text-gray-400">{feature.description}</p>
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  );
}


