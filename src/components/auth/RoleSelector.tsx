import React, { useState } from 'react';
import { User, GraduationCap, Users } from 'lucide-react';
import { useLanguageContext } from '@/contexts/LanguageContext';

type UserRole = 'learner' | 'coach' | 'hr';

interface RoleOption {
  value: UserRole;
  label: string;
  icon: React.ReactNode;
  color: string;
}

interface RoleSelectorProps {
  selectedRole: UserRole;
  onRoleChange: (role: UserRole) => void;
}

export default function RoleSelector({ selectedRole, onRoleChange }: RoleSelectorProps) {
  const { t } = useLanguageContext();
  const [showDropdown, setShowDropdown] = useState(false);

  const roleOptions: RoleOption[] = [
    {
      value: 'learner',
      label: t('auth.login.roleSelector.roles.learner'),
      icon: <GraduationCap className="w-5 h-5" />,
      color: 'text-blue-400',
    },
    {
      value: 'coach',
      label: t('auth.login.roleSelector.roles.coach'),
      icon: <User className="w-5 h-5" />,
      color: 'text-yellow-400',
    },
    {
      value: 'hr',
      label: t('auth.login.roleSelector.roles.hr'),
      icon: <Users className="w-5 h-5" />,
      color: 'text-purple-400',
    },
  ];

  const selectedOption = roleOptions.find(option => option.value === selectedRole);

  return (
    <div className="relative w-full">
      <label className="block text-gray-300 text-sm font-medium mb-2">{t('auth.login.roleSelector.label')}</label>
      <button
        type="button"
        onClick={() => setShowDropdown(!showDropdown)}
        className={`w-full flex items-center justify-between px-4 py-3 bg-gray-700 bg-opacity-50 border rounded-lg ${
          showDropdown ? 'border-yellow-400' : 'border-gray-600'
        }`}
      >
        <div className="flex items-center">
          <span className={`${selectedOption?.color} mr-2`}>
            {selectedOption?.icon}
          </span>
          <span className="text-white">{selectedOption?.label}</span>
        </div>
        <svg
          className={`w-5 h-5 text-gray-400 transition-transform ${
            showDropdown ? 'transform rotate-180' : ''
          }`}
          fill="none"
          viewBox="0 0 24 24"
          stroke="currentColor"
        >
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
        </svg>
      </button>

      {showDropdown && (
        <div className="absolute z-10 w-full mt-1 bg-gray-800 border border-gray-700 rounded-lg shadow-lg">
          {roleOptions.map((option) => (
            <button
              key={option.value}
              type="button"
              onClick={() => {
                onRoleChange(option.value);
                setShowDropdown(false);
              }}
              className={`w-full flex items-center px-4 py-3 text-left hover:bg-gray-700 ${
                selectedRole === option.value ? 'bg-gray-700' : ''
              }`}
            >
              <span className={`${option.color} mr-2`}>{option.icon}</span>
              <span className="text-white">{option.label}</span>
            </button>
          ))}
        </div>
      )}
    </div>
  );
}
