-- Migration pour ajouter les colonnes de changement de mot de passe
-- À exécuter dans votre éditeur SQL Supabase

-- Ajouter les colonnes password_changed et password_changed_at à la table users
ALTER TABLE users 
ADD COLUMN IF NOT EXISTS password_changed BOOLEAN DEFAULT false,
ADD COLUMN IF NOT EXISTS password_changed_at TIMESTAMP WITH TIME ZONE DEFAULT NULL;

-- Mettre à jour les utilisateurs existants pour marquer qu'ils ont déjà changé leur mot de passe
-- (sauf les utilisateurs RH et employés qui doivent changer leur mot de passe)
UPDATE users 
SET password_changed = true, 
    password_changed_at = created_at 
WHERE role NOT IN ('rh', 'employee') 
  AND password_changed IS NULL;

-- Créer un index pour optimiser les requêtes sur password_changed
CREATE INDEX IF NOT EXISTS idx_users_password_changed ON users(password_changed);

-- Créer un index pour optimiser les requêtes sur role et password_changed
CREATE INDEX IF NOT EXISTS idx_users_role_password_changed ON users(role, password_changed);

-- Commentaires pour documenter les nouvelles colonnes
COMMENT ON COLUMN users.password_changed IS 'Indique si l''utilisateur a changé son mot de passe temporaire (obligatoire pour RH et employés)';
COMMENT ON COLUMN users.password_changed_at IS 'Date et heure du changement de mot de passe';
