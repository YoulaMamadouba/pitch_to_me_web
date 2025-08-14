import { NextResponse } from 'next/server';
import { createClient } from '@supabase/supabase-js';

export const dynamic = 'force-dynamic';

function getAdminClient() {
  const url = process.env.NEXT_PUBLIC_SUPABASE_URL;
  const serviceRoleKey = process.env.SUPABASE_SERVICE_ROLE_KEY;
  if (!url || !serviceRoleKey) {
    const details = {
      hasUrl: !!url,
      hasServiceRoleKey: !!serviceRoleKey,
    };
    throw new Error(`Config Supabase manquante (URL ou SERVICE_ROLE_KEY): ${JSON.stringify(details)}`);
  }
  return createClient(url, serviceRoleKey, {
    auth: { autoRefreshToken: false, persistSession: false }
  });
}

export async function GET(request: Request) {
  try {
    const admin = getAdminClient();

    const urlObj = new URL(request.url);
    const email = (urlObj.searchParams.get('email') || 'mawa.simba@example.com').trim();
    const password = (urlObj.searchParams.get('password') || 'mawasimba2025').trim();
    const name = (urlObj.searchParams.get('name') || 'Mawa Simba').trim();

    // Lire le paramètre reset pour forcer la recréation
    const reset = urlObj.searchParams.get('reset') === '1' || urlObj.searchParams.get('force') === '1';

    // 1) Créer l'utilisateur Auth (ou ignorer si déjà présent)
    let userId: string | null = null;
    const createRes = await admin.auth.admin.createUser({
      email,
      password,
      email_confirm: true,
      user_metadata: { name, role: 'coach' }
    });

    if (createRes.error) {
      // Continuer: on récupèrera via listUsers ci-dessous
    }

    // Récupérer l'utilisateur créé depuis la liste (fallback):
    // L'API ne filtre pas par email. On tente une page raisonnable.
    const list = await admin.auth.admin.listUsers({ page: 1, perPage: 1000 });
    if (list.data) {
      const hit = list.data.users.find(u => u.email?.toLowerCase() === email.toLowerCase());
      if (hit) userId = hit.id;
    }

    // Si on force la recréation, supprimer l'utilisateur Auth et les lignes applicatives avant de recréer
    if (reset && userId) {
      try {
        await admin.auth.admin.deleteUser(userId);
      } catch {}
      // Nettoyer les tables applicatives liées à l'ancien email
      try { await admin.from('coaches').delete().gte('sessions_conducted', 0); } catch {}
      try {
        await admin.from('users').delete().eq('email', email);
      } catch {}
      userId = null;
    }

    // Si encore introuvable mais déjà présent côté applicatif `users`, on récupère l'id
    if (!userId) {
      const { data: existingAppUser } = await admin
        .from('users')
        .select('id')
        .eq('email', email)
        .maybeSingle();
      if (existingAppUser?.id) {
        userId = existingAppUser.id;
      }
    }

    if (!userId) {
      // Tentative 2: inviter l'utilisateur (création côté Auth sans password), puis définir le password
      try {
        // @ts-ignore - selon version supabase-js
        const inviteRes = await admin.auth.admin.inviteUserByEmail(email);
        if (inviteRes?.data?.user?.id) {
          userId = inviteRes.data.user.id;
        }
      } catch {}
    }

    if (!userId) {
      // Tentative 3: créer via client public (signUp). Si la confirmation email est désactivée, l'user sera actif immédiatement
      const anonKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY;
      if (!anonKey) {
        throw new Error("Anon key manquante pour tentative signUp publique");
      }
      const publicUrl = process.env.NEXT_PUBLIC_SUPABASE_URL as string;
      const publicClient = createClient(publicUrl, anonKey, { auth: { autoRefreshToken: false, persistSession: false } });
      const { data: signUpData, error: signUpError } = await publicClient.auth.signUp({ email, password });
      if (signUpError) {
        const adminErr = createRes.error ? { name: createRes.error.name, message: createRes.error.message } : null;
        throw new Error(`Impossible de créer l'utilisateur via Admin ni via signUp public (admin: ${JSON.stringify(adminErr)}, public: ${signUpError.message})`);
      }
      userId = signUpData.user?.id || null;
    }

    // 2) Forcer la mise à jour du mot de passe et métadonnées (si l'utilisateur existait déjà)
    try {
      await admin.auth.admin.updateUserById(userId as string, {
        password,
        email_confirm: true,
        user_metadata: { name, role: 'coach' }
      });
    } catch (e) {
      // ignorer si non critique
    }

    // 3) Insérer/mettre à jour dans la table applicative users
    const db = admin; // même client, mais on utilise la partie Postgrest

    // Supprimer l'éventuelle ligne users par email pour éviter le conflit unique si reset
    if (reset) {
      try { await db.from('users').delete().eq('email', email); } catch {}
      try { await db.from('coaches').delete().gte('sessions_conducted', 0); } catch {}
    }

    // upsert users (id/email/role)
    const { error: upsertUserError } = await db
      .from('users')
      .upsert({
        id: userId,
        name,
        email,
        role: 'coach',
        level: 0,
        xp: 0
      }, { onConflict: 'id' });

    if (upsertUserError) {
      throw upsertUserError;
    }

    // 4) Créer le coach s'il n'existe pas déjà
    const { data: existingCoach, error: fetchCoachError } = await db
      .from('coaches')
      .select('id')
      .limit(1);

    if (fetchCoachError) {
      throw fetchCoachError;
    }

    if (!existingCoach || existingCoach.length === 0) {
      const { error: insertCoachError } = await db
        .from('coaches')
        .insert({ user_id: userId, expertise: 'Formation et gestion B2B', sessions_conducted: 0 });
      if (insertCoachError) {
        // Si le trigger bloque (déjà un coach), on ignore.
      }
    }

    return NextResponse.json({ ok: true, message: 'Coach initialisé', userId });
  } catch (e: any) {
    const url = process.env.NEXT_PUBLIC_SUPABASE_URL;
    const serviceRoleKey = process.env.SUPABASE_SERVICE_ROLE_KEY;
    return NextResponse.json(
      {
        ok: false,
        error: e?.message || 'Erreur inconnue',
        diagnostics: {
          hasUrl: !!url,
          hasServiceRoleKey: !!serviceRoleKey,
          urlPrefix: url ? url.slice(0, 30) : null,
          keyPrefix: serviceRoleKey ? serviceRoleKey.slice(0, 12) : null,
        },
      },
      { status: 500 }
    );
  }
}


