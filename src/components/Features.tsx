'use client';

import { CheckCircle, Monitor, Users, Trophy } from 'lucide-react';
import { motion } from 'framer-motion';
import { useLanguageContext } from '@/contexts/LanguageContext';

const features = [
  {
    icon: CheckCircle,
    key: 'ai',
    gradient: "from-yellow-400 to-yellow-500"
  },
  {
    icon: Monitor,
    key: 'vr',
    gradient: "from-cyan-400 to-cyan-500"
  },
  {
    icon: Users,
    key: 'community',
    gradient: "from-purple-400 to-purple-500"
  },
  {
    icon: Trophy,
    key: 'certification',
    gradient: "from-pink-400 to-pink-500"
  }
];

export default function Features() {
  const { t } = useLanguageContext();
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
          <h2 className="text-3xl md:text-5xl font-bold text-white mb-6">
            {t('features.title')} <span className="text-yellow-400">Pitch to Me</span> ?
          </h2>
          <p className="text-xl text-gray-300 max-w-2xl mx-auto">
            {t('features.subtitle')}
          </p>
        </motion.div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
          {features.map((feature, index) => (
            <motion.div
              key={feature.key}
              initial={{ opacity: 0, y: 50 }}
              whileInView={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6, delay: index * 0.1 }}
              viewport={{ once: true }}
              className="bg-gray-800 bg-opacity-50 p-6 rounded-xl border border-gray-700 hover:border-gray-600 transition-all hover:transform hover:scale-105"
            >
              <div className={`w-12 h-12 bg-gradient-to-r ${feature.gradient} rounded-full flex items-center justify-center mb-4`}>
                <feature.icon className="w-6 h-6 text-black" />
              </div>
              <h3 className="text-white font-semibold text-lg mb-2">{t(`features.items.${feature.key}.title`)}</h3>
              <p className="text-gray-400">{t(`features.items.${feature.key}.description`)}</p>
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  );
}


