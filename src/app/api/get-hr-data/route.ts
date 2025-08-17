import { NextRequest, NextResponse } from 'next/server';
import { createClient } from '@supabase/supabase-js';

const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL!;
const supabaseServiceKey = process.env.SUPABASE_SERVICE_ROLE_KEY!;
const supabase = createClient(supabaseUrl, supabaseServiceKey);

export async function POST(request: NextRequest) {
  try {
    const { userId, companyId } = await request.json();

    if (!userId) {
      return NextResponse.json(
        { error: 'ID utilisateur requis' },
        { status: 400 }
      );
    }

    console.log('📧 Récupération des données RH pour:', userId);

    // Récupérer les informations du RH
    const { data: hrUser, error } = await supabase
      .from('users')
      .select(`
        id,
        name,
        email,
        role,
        company_id,
        companies!fk_user_company (
          id,
          name,
          domain,
          logo,
          employee_count
        )
      `)
      .eq('id', userId)
      .eq('role', 'rh')
      .single();

    if (error) {
      console.error('❌ Erreur lors de la récupération du RH:', error);
      return NextResponse.json(
        { error: 'Erreur lors de la récupération des informations' },
        { status: 500 }
      );
    }

    console.log('✅ RH récupéré via API:', hrUser);

    // Si on demande aussi les employés
    let employees: any[] = [];
    if (companyId || hrUser?.company_id) {
      const companyIdToUse = companyId || hrUser.company_id;
      
      const { data: employeesData, error: employeesError } = await supabase
        .from('users')
        .select(`
          id,
          name,
          email,
          role,
          created_at
        `)
        .eq('company_id', companyIdToUse)
        .eq('role', 'employee');

      if (employeesError) {
        console.error('❌ Erreur lors de la récupération des employés:', employeesError);
      } else {
        employees = employeesData || [];
        console.log('✅ Employés récupérés:', employees.length);
      }
    }

    return NextResponse.json({
      success: true,
      hrUser,
      employees
    });

  } catch (error) {
    console.error('❌ Erreur dans get-hr-data:', error);
    return NextResponse.json(
      { error: 'Erreur interne du serveur' },
      { status: 500 }
    );
  }
}
