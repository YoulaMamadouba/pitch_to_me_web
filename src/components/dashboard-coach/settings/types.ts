export interface CoachProfile {
  id: string;
  firstName: string;
  lastName: string;
  email: string;
  phone?: string;
  avatar?: string;
  bio?: string;
  specialization?: string;
  experience?: number;
  location?: string;
  website?: string;
  linkedin?: string;
  twitter?: string;
  createdAt: Date;
  updatedAt: Date;
}

export interface PasswordChangeData {
  currentPassword: string;
  newPassword: string;
  confirmPassword: string;
}

export interface ProfileUpdateData {
  firstName?: string;
  lastName?: string;
  phone?: string;
  bio?: string;
  specialization?: string;
  experience?: number;
  location?: string;
  website?: string;
  linkedin?: string;
  twitter?: string;
}

export interface SettingsViewProps {
  activeTab?: 'profile' | 'security' | 'notifications' | 'preferences';
}

export interface ProfileFormProps {
  profile: CoachProfile;
  onUpdate: (data: ProfileUpdateData) => Promise<void>;
  onAvatarChange: (file: File) => Promise<void>;
  isLoading?: boolean;
}

export interface PasswordChangeFormProps {
  onChangePassword: (data: PasswordChangeData) => Promise<void>;
  isLoading?: boolean;
}
