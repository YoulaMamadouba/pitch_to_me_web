import Header from '@/components/Header';
import Hero from '@/components/Hero';
import Features from '@/components/Features';
import B2CSection from '@/components/B2CSection';
import { Mic } from 'lucide-react';

export default function Home() {
  return (
    <main className="min-h-screen">
      <Header />
      <div className="pt-16">
        <Hero />
        <Features />
        <B2CSection />
      </div>
      
      {/* Footer */}
      <footer className="bg-gray-900 py-12 px-6 relative overflow-hidden">
        <div className="absolute inset-0 bg-[url('https://www.transparenttextures.com/patterns/always-grey.png')] opacity-5"></div>
        <div className="max-w-6xl mx-auto relative z-10">
          <div className="grid grid-cols-1 md:grid-cols-4 gap-8 mb-12">
            <div className="space-y-4">
              <div className="flex items-center space-x-2 group">
                <div className="w-8 h-8 relative">
                  <Mic className="w-full h-full text-yellow-400 group-hover:scale-110 transition-transform" />
                </div>
                <span className="text-xl font-bold text-white group-hover:text-yellow-400 transition-colors">Pitch to Me</span>
              </div>
              <p className="text-gray-400 text-sm">Transformez votre voix en opportunités avec notre plateforme d'entraînement au pitch ultime.</p>
              <div className="flex space-x-4">
                {['twitter', 'linkedin', 'instagram', 'youtube'].map((social) => (
                  <a key={social} href="#" className="text-gray-400 hover:text-yellow-400 transition-colors">
                    <span className="sr-only">{social}</span>
                    <div className="w-8 h-8 flex items-center justify-center rounded-full bg-gray-800 hover:bg-gray-700">
                      <svg className="w-4 h-4" fill="currentColor" viewBox="0 0 24 24" aria-hidden="true">
                        <use xlinkHref={`/sprite.svg#${social}`}></use>
                      </svg>
                    </div>
                  </a>
                ))}
              </div>
            </div>
            
            {[
              {
                title: 'Navigation',
                links: ['Accueil', 'Fonctionnalités', 'Tarifs', 'Témoignages']
              },
              {
                title: 'Entreprise',
                links: ['À propos', 'Carrières', 'Presse', 'Contact']
              },
              {
                title: 'Légal',
                links: ['Confidentialité', 'CGU', 'Mentions légales', 'Cookies']
              }
            ].map((section, index) => (
              <div key={index} className="space-y-4">
                <h3 className="text-white font-semibold text-lg">{section.title}</h3>
                <ul className="space-y-2">
                  {section.links.map((link, i) => (
                    <li key={i}>
                      <a href="#" className="text-gray-400 hover:text-yellow-400 transition-colors text-sm">
                        {link}
                      </a>
                    </li>
                  ))}
                </ul>
              </div>
            ))}
          </div>
          
          <div className="border-t border-gray-800 pt-8 flex flex-col md:flex-row justify-between items-center">
            <p className="text-gray-500 text-sm mb-4 md:mb-0">
              © {new Date().getFullYear()} Pitch to Me. Tous droits réservés.
            </p>
            <div className="flex space-x-6">
              <a href="#" className="text-gray-500 hover:text-yellow-400 text-sm transition-colors">
                Confidentialité
              </a>
              <a href="#" className="text-gray-500 hover:text-yellow-400 text-sm transition-colors">
                Conditions d'utilisation
              </a>
              <a href="#" className="text-gray-500 hover:text-yellow-400 text-sm transition-colors">
                Préférences de cookies
              </a>
            </div>
          </div>
        </div>
      </footer>
    </main>
  );
}
