import { NextRequest, NextResponse } from 'next/server';
import { createClient } from '@supabase/supabase-js';

const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL!;
const supabaseServiceKey = process.env.SUPABASE_SERVICE_ROLE_KEY!;

const supabase = createClient(supabaseUrl, supabaseServiceKey);

export async function GET(request: NextRequest) {
  try {
    // Récupérer le token depuis les headers
    const authHeader = request.headers.get('authorization');
    if (!authHeader || !authHeader.startsWith('Bearer ')) {
      return NextResponse.json(
        { error: 'Token d\'authentification manquant' },
        { status: 401 }
      );
    }

    const token = authHeader.replace('Bearer ', '');
    
    // Vérifier le token et récupérer l'utilisateur
    const { data: { user }, error: authError } = await supabase.auth.getUser(token);

    if (authError || !user) {
      console.log('❌ Erreur d\'authentification:', authError);
      return NextResponse.json(
        { error: 'Utilisateur non authentifié' },
        { status: 401 }
      );
    }

    console.log('🔧 Vérification du changement de mot de passe pour:', user.email);

    // Récupérer les informations de l'utilisateur depuis la base de données
    const { data: userData, error: dbError } = await supabase
      .from('users')
      .select('password_changed, role')
      .eq('id', user.id)
      .single();

    if (dbError) {
      console.error('❌ Erreur lors de la récupération des données utilisateur:', dbError);
      return NextResponse.json(
        { error: 'Erreur lors de la récupération des données' },
        { status: 500 }
      );
    }

    // Vérifier si l'utilisateur doit changer son mot de passe
    // Seuls les utilisateurs RH et employés doivent changer leur mot de passe
    const needsPasswordChange = (userData.role === 'rh' || userData.role === 'employee') && 
                               !userData.password_changed;

    console.log('🔧 Utilisateur doit changer son mot de passe:', needsPasswordChange);

    return NextResponse.json({
      success: true,
      needsPasswordChange,
      role: userData.role
    });

  } catch (error) {
    console.error('❌ Erreur lors de la vérification du mot de passe:', error);
    return NextResponse.json(
      { error: 'Erreur interne du serveur' },
      { status: 500 }
    );
  }
}
