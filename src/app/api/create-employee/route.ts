import { NextRequest, NextResponse } from 'next/server';
import { createClient } from '@supabase/supabase-js';

const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL!;
const supabaseServiceKey = process.env.SUPABASE_SERVICE_ROLE_KEY!;
const supabase = createClient(supabaseUrl, supabaseServiceKey);

export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    console.log('📧 Données reçues dans l\'API:', body);
    
    const { name, email, position, phone, offerType, companyId, password } = body;

    // Validation des données
    if (!name || !email || !position || !phone || !offerType || !companyId || !password) {
      console.log('❌ Données manquantes:', { 
        name: !!name, 
        email: !!email, 
        position: !!position, 
        phone: !!phone, 
        offerType: !!offerType, 
        companyId: !!companyId, 
        password: !!password 
      });
      return NextResponse.json(
        { error: 'Toutes les données sont requises' },
        { status: 400 }
      );
    }

    console.log('📧 Création d\'employé:', { name, email, position, phone, offerType, companyId });

    // 1. Créer l'utilisateur dans Supabase Auth
    const { data: authUser, error: authError } = await supabase.auth.admin.createUser({
      email,
      password,
      email_confirm: true,
      user_metadata: {
        name,
        role: 'employee'
      }
    });

    if (authError) {
      console.error('❌ Erreur lors de la création de l\'utilisateur Auth:', authError);
      return NextResponse.json(
        { error: authError.message },
        { status: 400 }
      );
    }

    console.log('✅ Utilisateur Auth créé:', authUser.user.id);

    // 2. Insérer dans la table users
    const { data: user, error: userError } = await supabase
      .from('users')
      .insert({
        id: authUser.user.id,
        name,
        email,
        role: 'employee',
        company_id: companyId,
        level: 0,
        xp: 0
      })
      .select()
      .single();

    if (userError) {
      console.error('❌ Erreur lors de l\'insertion dans users:', userError);
      // Rollback: supprimer l'utilisateur Auth si l'insertion échoue
      await supabase.auth.admin.deleteUser(authUser.user.id);
      return NextResponse.json(
        { error: userError.message },
        { status: 500 }
      );
    }

    console.log('✅ Utilisateur inséré dans users:', user.id);

    // 3. Insérer dans la table students
    const { error: studentError } = await supabase
      .from('students')
      .insert({
        user_id: authUser.user.id,
        progress: {},
        vr_sessions: 0
      });

    if (studentError) {
      console.error('❌ Erreur lors de l\'insertion dans students:', studentError);
      // Rollback: supprimer l'utilisateur Auth et user si l'insertion échoue
      await supabase.auth.admin.deleteUser(authUser.user.id);
      await supabase.from('users').delete().eq('id', authUser.user.id);
      return NextResponse.json(
        { error: studentError.message },
        { status: 500 }
      );
    }

    console.log('✅ Étudiant inséré dans students');

    // 4. Mettre à jour le nombre d'employés dans la table companies
    try {
      // Récupérer le nombre actuel d'employés
      const { data: companyData, error: companyFetchError } = await supabase
        .from('companies')
        .select('employee_count')
        .eq('id', companyId)
        .single();

      if (companyFetchError) {
        console.error('❌ Erreur lors de la récupération du nombre d\'employés:', companyFetchError);
      } else {
        const newEmployeeCount = (companyData.employee_count || 0) + 1;
        
        const { error: companyUpdateError } = await supabase
          .from('companies')
          .update({ 
            employee_count: newEmployeeCount
          })
          .eq('id', companyId);

        if (companyUpdateError) {
          console.error('❌ Erreur lors de la mise à jour du nombre d\'employés:', companyUpdateError);
          // Pas de rollback ici car l'employé est déjà créé
        } else {
          console.log('✅ Nombre d\'employés mis à jour');
        }
      }
    } catch (updateError) {
      console.error('❌ Erreur lors de la mise à jour du nombre d\'employés:', updateError);
      // Pas de rollback ici car l'employé est déjà créé
    }

    console.log('✅ Employé créé avec succès');

    return NextResponse.json({
      success: true,
      employee: {
        id: user.id,
        name: user.name,
        email: user.email,
        position,
        phone,
        offerType,
        company_id: user.company_id,
        status: 'active',
        created_at: user.created_at
      }
    });

  } catch (error) {
    console.error('❌ Erreur dans create-employee:', error);
    return NextResponse.json(
      { error: 'Erreur interne du serveur' },
      { status: 500 }
    );
  }
}
