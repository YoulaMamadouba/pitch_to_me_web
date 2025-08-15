import { NextRequest, NextResponse } from 'next/server';
import { createClient } from '@supabase/supabase-js';

export async function POST(request: NextRequest) {
  try {
    const { email, password, name } = await request.json();

    // Créer un client Supabase avec les clés de service (admin)
    const supabase = createClient(
      process.env.NEXT_PUBLIC_SUPABASE_URL!,
      process.env.SUPABASE_SERVICE_ROLE_KEY!
    );

    // Créer l'utilisateur dans Supabase Auth
    const { data: authUser, error: authError } = await supabase.auth.admin.createUser({
      email,
      password,
      email_confirm: true,
      user_metadata: {
        name,
        role: 'rh'
      }
    });

    if (authError) {
      console.error('Erreur lors de la création de l\'utilisateur Auth:', authError);
      return NextResponse.json({ error: authError }, { status: 400 });
    }

    // Créer l'utilisateur dans la table users
    const { data: userData, error: userError } = await supabase
      .from('users')
      .insert([
        {
          id: authUser.user.id,
          name,
          email,
          role: 'rh',
          level: 0,
          xp: 0,
        },
      ])
      .select()
      .single();

    if (userError) {
      // Supprimer l'utilisateur Auth si la création dans users échoue
      await supabase.auth.admin.deleteUser(authUser.user.id);
      console.error('Erreur lors de la création dans users:', userError);
      return NextResponse.json({ error: userError }, { status: 400 });
    }

    return NextResponse.json({ 
      success: true, 
      user: userData,
      authUser: authUser.user 
    });

  } catch (error) {
    console.error('Erreur lors de la création de l\'utilisateur RH:', error);
    return NextResponse.json({ error: 'Erreur interne du serveur' }, { status: 500 });
  }
}
