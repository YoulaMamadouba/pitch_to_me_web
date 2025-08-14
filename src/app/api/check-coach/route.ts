import { NextResponse } from 'next/server';
import { createClient } from '@supabase/supabase-js';

export const dynamic = 'force-dynamic';

export async function GET() {
  try {
    const url = process.env.NEXT_PUBLIC_SUPABASE_URL;
    const serviceRoleKey = process.env.SUPABASE_SERVICE_ROLE_KEY;
    if (!url || !serviceRoleKey) {
      return NextResponse.json({ ok: false, error: 'Config manquante', hasUrl: !!url, hasServiceRoleKey: !!serviceRoleKey }, { status: 500 });
    }

    const admin = createClient(url, serviceRoleKey, { auth: { autoRefreshToken: false, persistSession: false } });
    const email = 'mawa.simba@example.com';

    const list = await admin.auth.admin.listUsers({ page: 1, perPage: 1000 });
    const user = list.data?.users.find(u => u.email?.toLowerCase() === email.toLowerCase());

    if (!user) {
      return NextResponse.json({ ok: false, error: 'Utilisateur non trouvé dans Auth', email }, { status: 404 });
    }

    return NextResponse.json({
      ok: true,
      user: {
        id: user.id,
        email: user.email,
        email_confirmed_at: (user as any).email_confirmed_at ?? null,
        phone: user.phone ?? null,
        created_at: user.created_at,
        last_sign_in_at: (user as any).last_sign_in_at ?? null,
        identities: (user as any).identities?.map((i: any) => ({ provider: i.provider, identity_id: i.identity_id })) ?? [],
        is_banned: (user as any).banned_until ? true : false,
      }
    });
  } catch (e: any) {
    return NextResponse.json({ ok: false, error: e?.message || 'Erreur inconnue' }, { status: 500 });
  }
}


