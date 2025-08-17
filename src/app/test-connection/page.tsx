'use client';

import { useState } from 'react';
import { getSupabase } from '@/lib/supabase';

export default function TestConnectionPage() {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [result, setResult] = useState<any>(null);
  const [loading, setLoading] = useState(false);

  const testConnection = async () => {
    setLoading(true);
    setResult(null);

    try {
      const supabase = getSupabase();
      if (!supabase) {
        setResult({ error: 'Supabase non configuré' });
        return;
      }

      console.log('🔧 Test de connexion avec:', { email, password });

      const { data, error } = await supabase.auth.signInWithPassword({
        email: email.trim(),
        password: password.trim(),
      });

      if (error) {
        console.error('❌ Erreur de connexion:', error);
        setResult({ error: error.message });
      } else {
        console.log('✅ Connexion réussie:', data);
        setResult({ success: true, user: data.user });
      }
    } catch (error) {
      console.error('❌ Erreur inattendue:', error);
      setResult({ error: error instanceof Error ? error.message : 'Erreur inconnue' });
    } finally {
      setLoading(false);
    }
  };

  const checkUserInDB = async () => {
    setLoading(true);
    setResult(null);

    try {
      const supabase = getSupabase();
      if (!supabase) {
        setResult({ error: 'Supabase non configuré' });
        return;
      }

      console.log('🔧 Vérification de l\'utilisateur dans la DB:', email);

      const { data, error } = await supabase
        .from('users')
        .select('*')
        .eq('email', email)
        .single();

      if (error) {
        console.error('❌ Erreur lors de la vérification:', error);
        setResult({ error: error.message });
      } else {
        console.log('✅ Utilisateur trouvé dans la DB:', data);
        setResult({ success: true, user: data });
      }
    } catch (error) {
      console.error('❌ Erreur inattendue:', error);
      setResult({ error: error instanceof Error ? error.message : 'Erreur inconnue' });
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-gray-900 flex items-center justify-center p-4">
      <div className="bg-gray-800 border border-gray-700 rounded-lg p-6 w-full max-w-md">
        <h1 className="text-2xl font-bold text-white mb-6">Test de Connexion</h1>
        
        <div className="space-y-4">
          <div>
            <label className="block text-sm font-medium text-gray-300 mb-2">
              Email
            </label>
            <input
              type="email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              className="w-full bg-gray-700 border border-gray-600 rounded-lg px-4 py-3 text-white placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-yellow-500"
              placeholder="email@example.com"
            />
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-300 mb-2">
              Mot de passe
            </label>
            <input
              type="password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              className="w-full bg-gray-700 border border-gray-600 rounded-lg px-4 py-3 text-white placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-yellow-500"
              placeholder="Mot de passe"
            />
          </div>

          <div className="flex space-x-2">
            <button
              onClick={testConnection}
              disabled={loading}
              className="flex-1 bg-yellow-500 hover:bg-yellow-400 disabled:opacity-50 text-black font-semibold py-3 px-4 rounded-lg"
            >
              {loading ? 'Test...' : 'Tester Connexion'}
            </button>

            <button
              onClick={checkUserInDB}
              disabled={loading}
              className="flex-1 bg-blue-500 hover:bg-blue-400 disabled:opacity-50 text-white font-semibold py-3 px-4 rounded-lg"
            >
              {loading ? 'Vérif...' : 'Vérifier DB'}
            </button>
          </div>
        </div>

        {result && (
          <div className="mt-6 p-4 rounded-lg">
            {result.error ? (
              <div className="bg-red-500/10 border border-red-500/20 rounded-lg p-3">
                <h3 className="text-red-400 font-semibold mb-2">Erreur</h3>
                <p className="text-red-300 text-sm">{result.error}</p>
              </div>
            ) : (
              <div className="bg-green-500/10 border border-green-500/20 rounded-lg p-3">
                <h3 className="text-green-400 font-semibold mb-2">Succès</h3>
                <pre className="text-green-300 text-xs overflow-auto">
                  {JSON.stringify(result, null, 2)}
                </pre>
              </div>
            )}
          </div>
        )}
      </div>
    </div>
  );
}
