import { NextResponse } from 'next/server';
import { createClient } from '@supabase/supabase-js';

export const dynamic = 'force-dynamic';

export async function GET(request: Request) {
  try {
    const url = process.env.NEXT_PUBLIC_SUPABASE_URL;
    const anon = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY;
    if (!url || !anon) {
      return NextResponse.json({ ok: false, error: 'Config publique manquante', hasUrl: !!url, hasAnon: !!anon }, { status: 500 });
    }
    const client = createClient(url, anon, { auth: { autoRefreshToken: false, persistSession: false } });

    const urlObj = new URL(request.url);
    const email = (urlObj.searchParams.get('email') || 'mawa.simba@example.com').trim();
    const password = (urlObj.searchParams.get('password') || 'mawasimba2025').trim();

    const { data, error } = await client.auth.signInWithPassword({ email: email.trim(), password: password.trim() });
    if (error) {
      return NextResponse.json({
        ok: false,
        error: error.message,
        code: (error as any).name || 'AuthError',
        diagnostics: {
          urlPrefix: url.slice(0, 32),
          anonPrefix: anon.slice(0, 12),
          anonLength: anon.length,
          emailUsed: email.trim(),
        }
      }, { status: 400 });
    }
    return NextResponse.json({ ok: true, user: data.user ? { id: data.user.id, email: data.user.email } : null });
  } catch (e: any) {
    return NextResponse.json({ ok: false, error: e?.message || 'Erreur inconnue' }, { status: 500 });
  }
}


