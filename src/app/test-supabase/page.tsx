'use client';

import { useState, useEffect } from 'react';
import { getSupabase } from '@/lib/supabase';

export default function TestSupabasePage() {
  const [status, setStatus] = useState<string>('Test en cours...');
  const [coaches, setCoaches] = useState<any[]>([]);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    testSupabaseConnection();
  }, []);

  const testSupabaseConnection = async () => {
    try {
      setStatus('Test de la connexion Supabase...');
      
      // Test 1: Vérifier la connexion de base
      const supabase = getSupabase();
      if (!supabase) {
        setStatus('⚠️ Supabase non configuré côté serveur (SSR). Essayez côté client ou vérifiez .env.local');
        return;
      }
      const { data, error } = await supabase
        .from('coaches')
        .select('*')
        .limit(5);

      if (error) {
        throw error;
      }

      setCoaches(data || []);
      setStatus('✅ Connexion Supabase réussie !');
    } catch (err: any) {
      setError(err.message);
      setStatus('❌ Erreur de connexion Supabase');
    }
  };

  return (
    <div className="min-h-screen bg-gray-900 text-white p-8">
      <div className="max-w-4xl mx-auto">
        <h1 className="text-3xl font-bold mb-8">Test de Connexion Supabase</h1>
        
        <div className="bg-gray-800 rounded-lg p-6 mb-6">
          <h2 className="text-xl font-semibold mb-4">Statut de la connexion</h2>
          <p className="text-lg">{status}</p>
          {error && (
            <div className="mt-4 p-4 bg-red-900 border border-red-500 rounded">
              <p className="text-red-300">Erreur: {error}</p>
            </div>
          )}
        </div>

        {coaches.length > 0 && (
          <div className="bg-gray-800 rounded-lg p-6">
            <h2 className="text-xl font-semibold mb-4">Coaches trouvés ({coaches.length})</h2>
            <div className="space-y-4">
              {coaches.map((coach, index) => (
                <div key={index} className="bg-gray-700 p-4 rounded">
                  <p><strong>ID:</strong> {coach.id}</p>
                  <p><strong>User ID:</strong> {coach.user_id}</p>
                  <p><strong>Expertise:</strong> {coach.expertise}</p>
                  <p><strong>Sessions:</strong> {coach.sessions_conducted}</p>
                </div>
              ))}
            </div>
          </div>
        )}

        <div className="mt-8">
          <button
            onClick={testSupabaseConnection}
            className="bg-blue-600 hover:bg-blue-700 px-4 py-2 rounded"
          >
            Retester la connexion
          </button>
        </div>
      </div>
    </div>
  );
}
