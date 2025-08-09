import Header from '@/components/Header';
import Hero from '@/components/Hero';
import Features from '@/components/Features';

export default function Home() {
  return (
    <main className="min-h-screen">
      <Header />
      <div className="pt-16">
        <Hero />
        <Features />
      </div>
      
      {/* Footer */}
      <footer className="bg-black bg-opacity-30 py-8 px-6">
        <div className="max-w-6xl mx-auto">
          <div className="flex flex-col md:flex-row justify-between items-center space-y-4 md:space-y-0">
            <div className="text-white font-bold text-lg">
              Pitch to Me
            </div>
            <div className="flex space-x-6 text-sm text-gray-400">
              <a href="#" className="hover:text-white transition-colors">À propos</a>
              <a href="#" className="hover:text-white transition-colors">Témoignages</a>
              <a href="#" className="hover:text-white transition-colors">Presse</a>
              <a href="#" className="hover:text-white transition-colors">Contact</a>
            </div>
          </div>
          <div className="border-t border-gray-700 mt-6 pt-6 text-center text-gray-400 text-sm">
            © 2024 Pitch to Me. Tous droits réservés.
          </div>
        </div>
      </footer>
    </main>
  );
}
