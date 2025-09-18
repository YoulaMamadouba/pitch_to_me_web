import { NextRequest, NextResponse } from 'next/server';
import { createClient } from '@supabase/supabase-js';

const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL!;
const supabaseServiceKey = process.env.SUPABASE_SERVICE_ROLE_KEY!;

const supabase = createClient(supabaseUrl, supabaseServiceKey);

export async function POST(request: NextRequest) {
  try {
    const { email, password, firstName, lastName, phone, country } = await request.json();

    // Validation des données
    if (!email || !password || !firstName || !lastName || !phone || !country) {
      return NextResponse.json(
        { error: 'Toutes les données sont requises' },
        { status: 400 }
      );
    }

    console.log('🔧 Création d\'utilisateur individuel:', { email, firstName, lastName });

    // 1. Créer l'utilisateur dans Supabase Auth avec les privilèges admin
    const { data: authData, error: authError } = await supabase.auth.admin.createUser({
      email: email.trim(),
      password: password.trim(),
      email_confirm: true, // Confirmer automatiquement l'email
      user_metadata: {
        name: `${firstName} ${lastName}`,
        role: 'individual',
        first_name: firstName,
        last_name: lastName,
        phone: phone,
        country: country,
      },
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

    // 2. Créer l'utilisateur dans la table users
    const { error: userError } = await supabase
      .from('users')
      .insert([
        {
          id: authData.user.id,
          name: `${firstName} ${lastName}`,
          email: email.trim(),
          role: 'individual',
          level: 0,
          xp: 0,
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

    console.log('✅ Utilisateur inséré dans la table users');

    // 3. Créer un profil étudiant
    const { error: studentError } = await supabase
      .from('students')
      .insert([
        {
          user_id: authData.user.id,
          progress: {},
          vr_sessions: 0,
        },
      ]);

    if (studentError) {
      console.error('❌ Erreur création profil étudiant:', studentError);
      // Ne pas faire échouer l'inscription pour cette erreur
    } else {
      console.log('✅ Profil étudiant créé');
    }

    console.log('✅ Utilisateur individuel créé avec succès:', authData.user.id);

    return NextResponse.json({
      success: true,
      user: {
        id: authData.user.id,
        email: authData.user.email,
        name: `${firstName} ${lastName}`,
        role: 'individual',
      },
    });

  } catch (error) {
    console.error('❌ Erreur lors de la création de l\'utilisateur individuel:', error);
    return NextResponse.json(
      { error: 'Erreur interne du serveur' },
      { status: 500 }
    );
  }
}










