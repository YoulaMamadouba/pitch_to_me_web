import { getSupabase } from './supabase';

export interface StudentData {
  id: string;
  user_id: string;
  name: string;
  email: string;
  role: 'employee' | 'individual';
  level: number;
  xp: number;
  company_id?: string;
  company_name?: string;
  company_logo?: string;
  rh_user_name?: string;
  progress?: any;
  vr_sessions: number;
  created_at: string;
  modules: ModuleData[];
}

export interface ModuleData {
  id: string;
  title: string;
  description: string;
  theme?: string;
  domain_metier?: string;
  niveau_difficulte?: string;
  duree_estimee: number;
}

export async function getAllStudents(): Promise<StudentData[]> {
  try {
    const supabase = getSupabase();
    
    if (!supabase) {
      throw new Error('Supabase client non initialisé');
    }

    // Récupérer tous les utilisateurs avec le rôle employee ou individual
    const { data: users, error: usersError } = await supabase
      .from('users')
      .select(`
        id,
        name,
        email,
        role,
        level,
        xp,
        company_id,
        created_at
      `)
      .in('role', ['employee', 'individual']);

    if (usersError) {
      console.error('Erreur lors de la récupération des utilisateurs:', usersError);
      throw usersError;
    }

    if (!users || users.length === 0) {
      return [];
    }

    // Récupérer les informations des entreprises pour les employés
    const companyIds = users
      .filter(u => u.role === 'employee' && u.company_id)
      .map(u => u.company_id);

    let companiesData: any[] = [];
    if (companyIds.length > 0) {
      const { data: companies, error: companiesError } = await supabase
        .from('companies')
        .select(`
          id,
          name,
          logo,
          rh_user_id
        `)
        .in('id', companyIds);

      if (!companiesError) {
        companiesData = companies || [];
      }
    }

    // Récupérer les noms des RH pour les entreprises
    const rhUserIds = companiesData.map(c => c.rh_user_id).filter(Boolean);
    let rhUsersData: any[] = [];
    if (rhUserIds.length > 0) {
      const { data: rhUsers, error: rhUsersError } = await supabase
        .from('users')
        .select('id, name')
        .in('id', rhUserIds);

      if (!rhUsersError) {
        rhUsersData = rhUsers || [];
      }
    }

    // Récupérer les modules pour chaque étudiant
    let modulesData: any[] = [];
    
    if (companyIds.length > 0) {
      try {
        const { data: companyModules, error: companyModulesError } = await supabase
          .from('company_modules')
          .select(`
            company_id,
            modules!inner(
              id,
              title,
              description,
              theme,
              domain_metier,
              niveau_difficulte,
              duree_estimee
            )
          `)
          .in('company_id', companyIds);

        if (!companyModulesError) {
          modulesData = companyModules || [];
        }
      } catch (moduleError) {
        // Ignorer les erreurs de modules pour l'instant
      }
    }

    // Formater les données des étudiants
    const formattedStudents: StudentData[] = (users as any[]).map(user => {
      // Trouver les informations d'entreprise
      const company = companiesData.find(c => c.id === user.company_id);
      const rhUser = rhUsersData.find(rh => rh.id === company?.rh_user_id);
      
      // Récupérer les modules pour cet étudiant
      let studentModules: ModuleData[] = [];
      if (user.role === 'employee' && company) {
        const companyModulesForStudent = modulesData.filter(cm => cm.company_id === company.id);
        studentModules = companyModulesForStudent.map(cm => cm.modules).filter(Boolean);
      }

      return {
        id: user.id, // Utiliser l'ID de l'utilisateur comme ID principal
        user_id: user.id,
        name: user.name,
        email: user.email,
        role: user.role,
        level: user.level,
        xp: user.xp,
        company_id: user.company_id,
        company_name: company?.name,
        company_logo: company?.logo,
        rh_user_name: rhUser?.name,
        progress: { overall: 0 }, // Valeur par défaut
        vr_sessions: 0, // Valeur par défaut
        created_at: user.created_at,
        modules: studentModules
      };
    });

    return formattedStudents;

  } catch (error) {
    console.error('Erreur dans getAllStudents:', error);
    throw error;
  }
}

export async function getStudentById(studentId: string): Promise<StudentData | null> {
  try {
    const students = await getAllStudents();
    return students.find(s => s.id === studentId) || null;
  } catch (error) {
    console.error('Erreur dans getStudentById:', error);
    throw error;
  }
}

export async function getStudentsByRole(role: 'employee' | 'individual'): Promise<StudentData[]> {
  try {
    const students = await getAllStudents();
    return students.filter(s => s.role === role);
  } catch (error) {
    console.error('Erreur dans getStudentsByRole:', error);
    throw error;
  }
}
