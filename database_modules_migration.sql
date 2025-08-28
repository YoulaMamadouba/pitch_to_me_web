-- Migration pour ajouter les tables de domaines d'activité, modules et leçons
-- À exécuter dans votre éditeur SQL Supabase

-- 1. Table des domaines d'activité
CREATE TABLE IF NOT EXISTS public.activity_domains (
  id uuid NOT NULL DEFAULT extensions.uuid_generate_v4(),
  name character varying(255) NOT NULL,
  description text,
  type character varying(10) NOT NULL CHECK (type IN ('b2b', 'b2c')),
  color character varying(100),
  icon_name character varying(100),
  created_at timestamp with time zone DEFAULT CURRENT_TIMESTAMP,
  updated_at timestamp with time zone DEFAULT CURRENT_TIMESTAMP,
  CONSTRAINT activity_domains_pkey PRIMARY KEY (id),
  CONSTRAINT activity_domains_name_key UNIQUE (name)
);

-- 2. Ajouter le champ type à la table modules existante
ALTER TABLE public.modules 
ADD COLUMN IF NOT EXISTS type character varying(10) DEFAULT 'b2b' CHECK (type IN ('b2b', 'b2c')),
ADD COLUMN IF NOT EXISTS activity_domain_id uuid REFERENCES public.activity_domains(id) ON DELETE SET NULL;

-- 3. Table des leçons
CREATE TABLE IF NOT EXISTS public.lessons (
  id uuid NOT NULL DEFAULT extensions.uuid_generate_v4(),
  module_id uuid NOT NULL,
  title character varying(255) NOT NULL,
  description text,
  content_type character varying(50) NOT NULL DEFAULT 'video' CHECK (content_type IN ('video', 'pdf', 'text', 'quiz', 'exercise')),
  content_url character varying(500),
  content_text text,
  duration_minutes integer DEFAULT 0,
  order_index integer NOT NULL DEFAULT 0,
  is_locked boolean DEFAULT false,
  created_at timestamp with time zone DEFAULT CURRENT_TIMESTAMP,
  updated_at timestamp with time zone DEFAULT CURRENT_TIMESTAMP,
  CONSTRAINT lessons_pkey PRIMARY KEY (id),
  CONSTRAINT lessons_module_id_fkey FOREIGN KEY (module_id) REFERENCES public.modules(id) ON DELETE CASCADE
);

-- 4. Table de progression des étudiants
CREATE TABLE IF NOT EXISTS public.student_progress (
  id uuid NOT NULL DEFAULT extensions.uuid_generate_v4(),
  student_id uuid NOT NULL,
  lesson_id uuid NOT NULL,
  module_id uuid NOT NULL,
  status character varying(20) NOT NULL DEFAULT 'not_started' CHECK (status IN ('not_started', 'in_progress', 'completed', 'failed')),
  progress_percentage integer DEFAULT 0 CHECK (progress_percentage >= 0 AND progress_percentage <= 100),
  time_spent_seconds integer DEFAULT 0,
  completed_at timestamp with time zone,
  created_at timestamp with time zone DEFAULT CURRENT_TIMESTAMP,
  updated_at timestamp with time zone DEFAULT CURRENT_TIMESTAMP,
  CONSTRAINT student_progress_pkey PRIMARY KEY (id),
  CONSTRAINT student_progress_student_id_fkey FOREIGN KEY (student_id) REFERENCES public.users(id) ON DELETE CASCADE,
  CONSTRAINT student_progress_lesson_id_fkey FOREIGN KEY (lesson_id) REFERENCES public.lessons(id) ON DELETE CASCADE,
  CONSTRAINT student_progress_module_id_fkey FOREIGN KEY (module_id) REFERENCES public.modules(id) ON DELETE CASCADE,
  CONSTRAINT student_progress_unique UNIQUE (student_id, lesson_id)
);

-- 5. Table des inscriptions aux domaines d'activité (pour les étudiants individuels)
CREATE TABLE IF NOT EXISTS public.student_domain_enrollments (
  id uuid NOT NULL DEFAULT extensions.uuid_generate_v4(),
  student_id uuid NOT NULL,
  activity_domain_id uuid NOT NULL,
  enrolled_at timestamp with time zone DEFAULT CURRENT_TIMESTAMP,
  status character varying(20) DEFAULT 'active' CHECK (status IN ('active', 'completed', 'cancelled')),
  CONSTRAINT student_domain_enrollments_pkey PRIMARY KEY (id),
  CONSTRAINT student_domain_enrollments_student_id_fkey FOREIGN KEY (student_id) REFERENCES public.users(id) ON DELETE CASCADE,
  CONSTRAINT student_domain_enrollments_activity_domain_id_fkey FOREIGN KEY (activity_domain_id) REFERENCES public.activity_domains(id) ON DELETE CASCADE,
  CONSTRAINT student_domain_enrollments_unique UNIQUE (student_id, activity_domain_id)
);

-- 6. Ajouter le champ activity_domain_id à la table companies
ALTER TABLE public.companies 
ADD COLUMN IF NOT EXISTS activity_domain_id uuid REFERENCES public.activity_domains(id) ON DELETE SET NULL;

-- 7. Créer les index pour optimiser les performances
CREATE INDEX IF NOT EXISTS idx_modules_type ON public.modules(type);
CREATE INDEX IF NOT EXISTS idx_modules_activity_domain_id ON public.modules(activity_domain_id);
CREATE INDEX IF NOT EXISTS idx_lessons_module_id ON public.lessons(module_id);
CREATE INDEX IF NOT EXISTS idx_lessons_order_index ON public.lessons(order_index);
CREATE INDEX IF NOT EXISTS idx_student_progress_student_id ON public.student_progress(student_id);
CREATE INDEX IF NOT EXISTS idx_student_progress_module_id ON public.student_progress(module_id);
CREATE INDEX IF NOT EXISTS idx_student_progress_status ON public.student_progress(status);
CREATE INDEX IF NOT EXISTS idx_activity_domains_type ON public.activity_domains(type);
CREATE INDEX IF NOT EXISTS idx_student_domain_enrollments_student_id ON public.student_domain_enrollments(student_id);

-- 8. Insérer les domaines d'activité B2B par défaut
INSERT INTO public.activity_domains (name, description, type, color, icon_name) VALUES
('Banque & Finance', 'Modules spécialisés pour les professionnels du secteur bancaire et financier', 'b2b', 'from-green-500 to-green-600', 'BarChart3'),
('Mines & Énergie', 'Formation pour les secteurs miniers, pétroliers et énergétiques', 'b2b', 'from-yellow-500 to-yellow-600', 'Wrench'),
('Gouvernement & Public', 'Modules adaptés aux fonctionnaires et employés du secteur public', 'b2b', 'from-blue-500 to-blue-600', 'Shield'),
('Industrie & Manufacture', 'Formation pour les secteurs industriels et manufacturiers', 'b2b', 'from-gray-500 to-gray-600', 'Factory'),
('Automobile & Transport', 'Modules pour les professionnels de l''automobile et du transport', 'b2b', 'from-red-500 to-red-600', 'Car'),
('Aérospatial & Aviation', 'Formation spécialisée pour l''industrie aérospatiale', 'b2b', 'from-indigo-500 to-indigo-600', 'Plane'),
('Santé & Médical', 'Modules pour les professionnels de la santé et du médical', 'b2b', 'from-pink-500 to-pink-600', 'Heart'),
('Éducation & Formation', 'Formation pour les acteurs du secteur éducatif', 'b2b', 'from-purple-500 to-purple-600', 'GraduationCap'),
('Commerce & Retail', 'Modules pour les professionnels du commerce et de la distribution', 'b2b', 'from-orange-500 to-orange-600', 'ShoppingBag'),
('Technologie & IT', 'Formation pour les professionnels de la technologie', 'b2b', 'from-cyan-500 to-cyan-600', 'Zap'),
('Environnement & Développement Durable', 'Modules pour les secteurs environnementaux et durables', 'b2b', 'from-emerald-500 to-emerald-600', 'Leaf'),
('Consulting & Services', 'Formation pour les consultants et prestataires de services', 'b2b', 'from-violet-500 to-violet-600', 'Briefcase')
ON CONFLICT (name) DO NOTHING;

-- 9. Insérer les domaines d'activité B2C par défaut
INSERT INTO public.activity_domains (name, description, type, color, icon_name) VALUES
('Développement Personnel', 'Modules pour améliorer la confiance en soi et les compétences personnelles', 'b2c', 'from-purple-500 to-purple-600', 'Users'),
('Carrière & Emploi', 'Formation pour réussir sa carrière professionnelle', 'b2c', 'from-blue-500 to-blue-600', 'Target'),
('Prise de Parole', 'Modules pour maîtriser l''art de la communication orale', 'b2c', 'from-green-500 to-green-600', 'TrendingUp'),
('Networking & Relations', 'Formation pour développer son réseau professionnel', 'b2c', 'from-yellow-500 to-yellow-600', 'Globe'),
('Entrepreneuriat', 'Modules pour créer et développer son entreprise', 'b2c', 'from-red-500 to-red-600', 'Building')
ON CONFLICT (name) DO NOTHING;

-- 10. Fonction pour mettre à jour automatiquement updated_at
CREATE OR REPLACE FUNCTION update_updated_at_column()
RETURNS TRIGGER AS $$
BEGIN
    NEW.updated_at = CURRENT_TIMESTAMP;
    RETURN NEW;
END;
$$ language 'plpgsql';

-- 11. Triggers pour mettre à jour automatiquement updated_at
CREATE TRIGGER update_activity_domains_updated_at BEFORE UPDATE ON public.activity_domains FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();
CREATE TRIGGER update_lessons_updated_at BEFORE UPDATE ON public.lessons FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();
CREATE TRIGGER update_student_progress_updated_at BEFORE UPDATE ON public.student_progress FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();

-- 12. Commentaires pour documenter les tables
COMMENT ON TABLE public.activity_domains IS 'Domaines d''activité pour B2B et B2C';
COMMENT ON TABLE public.lessons IS 'Leçons individuelles dans les modules';
COMMENT ON TABLE public.student_progress IS 'Progression des étudiants dans les leçons';
COMMENT ON TABLE public.student_domain_enrollments IS 'Inscriptions des étudiants individuels aux domaines d''activité';
COMMENT ON COLUMN public.modules.type IS 'Type de module: b2b ou b2c';
COMMENT ON COLUMN public.modules.activity_domain_id IS 'Référence au domaine d''activité';
COMMENT ON COLUMN public.companies.activity_domain_id IS 'Domaine d''activité de l''entreprise';
