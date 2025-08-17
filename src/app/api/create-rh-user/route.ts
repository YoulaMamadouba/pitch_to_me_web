import { NextRequest, NextResponse } from 'next/server';
import { createClient } from '@supabase/supabase-js';

const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL!;
const supabaseServiceKey = process.env.SUPABASE_SERVICE_ROLE_KEY!;

const supabase = createClient(supabaseUrl, supabaseServiceKey);

export async function POST(request: NextRequest) {
  try {
    const { email, password, name } = await request.json();

    // Validation des données
    if (!email || !password || !name) {
      return NextResponse.json(
        { error: 'Email, mot de passe et nom requis' },
        { status: 400 }
      );
    }

    console.log('🔧 Création d\'utilisateur RH:', { email, name });

    // 1. Créer l'utilisateur dans Supabase Auth
    const { data: authData, error: authError } = await supabase.auth.admin.createUser({
      email: email.trim(),
      password: password.trim(),
      email_confirm: true, // Confirmer automatiquement l'email
      user_metadata: {
        name: name,
        role: 'rh',
      },
    });

    console.log('🔧 Réponse création Auth:', { 
      success: !!authData.user, 
      error: !!authError,
      userId: authData.user?.id 
    });

    if (authError) {
      console.error('❌ Erreur création Auth:', authError);
      return NextResponse.json(
        { error: authError.message },
        { status: 400 }
      );
    }

    if (!authData.user) {
      return NextResponse.json(
        { error: 'Erreur lors de la création de l\'utilisateur' },
        { status: 500 }
      );
    }

    console.log('✅ Utilisateur Auth créé:', authData.user.id);

    // 2. Créer l'utilisateur dans la table users avec password_changed = false
    const { error: userError } = await supabase
      .from('users')
      .insert([
        {
          id: authData.user.id,
          name: name,
          email: email.trim(),
          role: 'rh',
          level: 0,
          xp: 0,
          password_changed: false, // L'utilisateur devra changer son mot de passe
          password_changed_at: null
        },
      ]);

    if (userError) {
      console.error('❌ Erreur insertion users:', userError);
      // Supprimer l'utilisateur Auth créé
      await supabase.auth.admin.deleteUser(authData.user.id);
      return NextResponse.json(
        { error: userError.message },
        { status: 400 }
      );
    }

    console.log('✅ Utilisateur RH inséré dans la table users');

    return NextResponse.json({
      success: true,
      user: {
        id: authData.user.id,
        email: authData.user.email,
        name: name,
        role: 'rh',
      },
    });

  } catch (error) {
    console.error('❌ Erreur lors de la création de l\'utilisateur RH:', error);
    return NextResponse.json(
      { error: 'Erreur interne du serveur' },
      { status: 500 }
    );
  }
}
