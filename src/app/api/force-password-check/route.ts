import { NextRequest, NextResponse } from 'next/server';
import { createClient } from '@supabase/supabase-js';

const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL!;
const supabaseServiceKey = process.env.SUPABASE_SERVICE_ROLE_KEY!;

const supabase = createClient(supabaseUrl, supabaseServiceKey);

export async function POST(request: NextRequest) {
  try {
    const { email } = await request.json();

    if (!email) {
      return NextResponse.json(
        { error: 'Email requis' },
        { status: 400 }
      );
    }

    console.log('🔧 Force check pour:', email);

    // Récupérer les informations de l'utilisateur depuis la base de données
    const { data: userData, error: dbError } = await supabase
      .from('users')
      .select('id, password_changed, role')
      .eq('email', email)
      .single();

    if (dbError) {
      console.error('❌ Erreur lors de la récupération des données utilisateur:', dbError);
      return NextResponse.json(
        { error: 'Erreur lors de la récupération des données' },
        { status: 500 }
      );
    }

    console.log('🔧 Données utilisateur:', userData);

    // Forcer password_changed à false pour les utilisateurs RH et employés
    if (userData.role === 'rh' || userData.role === 'employee') {
      const { error: updateError } = await supabase
        .from('users')
        .update({ 
          password_changed: false,
          password_changed_at: null
        })
        .eq('id', userData.id);

      if (updateError) {
        console.error('❌ Erreur lors de la mise à jour:', updateError);
        return NextResponse.json(
          { error: 'Erreur lors de la mise à jour' },
          { status: 500 }
        );
      }

      console.log('✅ Utilisateur mis à jour - password_changed: false');
    }

    return NextResponse.json({
      success: true,
      message: 'Utilisateur mis à jour avec succès'
    });

  } catch (error) {
    console.error('❌ Erreur lors de la vérification forcée:', error);
    return NextResponse.json(
      { error: 'Erreur interne du serveur' },
      { status: 500 }
    );
  }
}
