'use client';

import { ChevronLeft, ChevronRight, LogOut, Building, Briefcase, X } from 'lucide-react';

interface NavigationItem {
  id: string;
  label: string;
  icon: any;
  active?: boolean;
  onClick?: () => void;
}

interface B2BSidebarProps {
  navigationItems: NavigationItem[];
  collapsed: boolean;
  onToggleCollapse: () => void;
  onSignOut: () => void;
  showMobileMenu: boolean;
  onCloseMobileMenu: () => void;
}

export default function B2BSidebar({
  navigationItems,
  collapsed,
  onToggleCollapse,
  onSignOut,
  showMobileMenu,
  onCloseMobileMenu
}: B2BSidebarProps) {
  return (
    <>
      {/* Desktop Sidebar */}
      <aside className={`hidden lg:flex flex-col bg-gray-800 border-r border-gray-700 ${collapsed ? 'w-20' : 'w-64'}`}>
        <div className="flex items-center justify-between p-4 border-b border-gray-700">
          <div className="flex items-center space-x-3">
            <div className="w-8 h-8 bg-gradient-to-r from-yellow-400 to-amber-500 rounded-lg flex items-center justify-center">
              <Building className="w-5 h-5 text-black" />
            </div>
            {!collapsed && <div className="text-lg font-bold text-white">B2B Learning</div>}
          </div>
          <button onClick={onToggleCollapse} className="p-1 rounded-lg hover:bg-gray-700">
            {collapsed ? <ChevronRight className="w-4 h-4 text-gray-400" /> : <ChevronLeft className="w-4 h-4 text-gray-400" />}
          </button>
        </div>

        <nav className="flex-1 p-4 space-y-2">
          {navigationItems.map((item) => (
            <button
              key={item.id}
              onClick={item.onClick}
              className={`w-full flex items-center space-x-3 px-3 py-2 rounded-lg transition-all duration-200 ${
                item.active
                  ? 'bg-yellow-500/20 text-yellow-400 border border-yellow-500/30'
                  : 'text-gray-300 hover:bg-gray-700 hover:text-white'
              }`}
            >
              <item.icon className="w-5 h-5 flex-shrink-0" />
              {!collapsed && <span className="text-sm font-medium">{item.label}</span>}
            </button>
          ))}
        </nav>

        <div className="p-4 border-t border-gray-700">
          <div className="flex items-center space-x-3 mb-4">
            <div className="w-8 h-8 bg-gradient-to-r from-blue-500 to-purple-600 rounded-full flex items-center justify-center">
              <Briefcase className="w-4 h-4 text-white" />
            </div>
            {!collapsed && (
              <div className="flex-1">
                <div className="text-sm font-medium text-white">Employé</div>
                <div className="text-xs text-gray-400">B2B Learning</div>
              </div>
            )}
          </div>
          
          <button
            onClick={onSignOut}
            className="w-full flex items-center space-x-3 px-3 py-2 rounded-lg text-gray-300 hover:bg-gray-700 hover:text-white"
          >
            <LogOut className="w-5 h-5" />
            {!collapsed && <span className="text-sm">Déconnexion</span>}
          </button>
        </div>
      </aside>

      {/* Mobile Sidebar */}
      {showMobileMenu && (
        <aside className="fixed inset-y-0 left-0 z-50 w-72 bg-gray-800 border-r border-gray-700 lg:hidden">
          <div className="flex items-center justify-between p-4 border-b border-gray-700">
            <div className="flex items-center space-x-3">
              <div className="w-8 h-8 bg-gradient-to-r from-yellow-400 to-amber-500 rounded-lg flex items-center justify-center">
                <Building className="w-5 h-5 text-black" />
              </div>
              <div className="text-lg font-bold text-white">B2B Learning</div>
            </div>
            <button onClick={onCloseMobileMenu} className="p-1 rounded-lg hover:bg-gray-700">
              <X className="w-5 h-5 text-gray-400" />
            </button>
          </div>

          <nav className="flex-1 p-4 space-y-2">
            {navigationItems.map((item) => (
              <button
                key={item.id}
                onClick={() => {
                  item.onClick?.();
                  onCloseMobileMenu();
                }}
                className={`w-full flex items-center space-x-3 px-3 py-2 rounded-lg transition-all duration-200 ${
                  item.active
                    ? 'bg-yellow-500/20 text-yellow-400 border border-yellow-500/30'
                    : 'text-gray-300 hover:bg-gray-700 hover:text-white'
                }`}
              >
                <item.icon className="w-5 h-5 flex-shrink-0" />
                <span className="text-sm font-medium">{item.label}</span>
              </button>
            ))}
          </nav>

          <div className="p-4 border-t border-gray-700">
            <div className="flex items-center space-x-3 mb-4">
              <div className="w-8 h-8 bg-gradient-to-r from-blue-500 to-purple-600 rounded-full flex items-center justify-center">
                <Briefcase className="w-4 h-4 text-white" />
              </div>
              <div className="flex-1">
                <div className="text-sm font-medium text-white">Employé</div>
                <div className="text-xs text-gray-400">B2B Learning</div>
              </div>
            </div>
            
            <button
              onClick={() => {
                onSignOut();
                onCloseMobileMenu();
              }}
              className="w-full flex items-center space-x-3 px-3 py-2 rounded-lg text-gray-300 hover:bg-gray-700 hover:text-white"
            >
              <LogOut className="w-5 h-5" />
              <span className="text-sm">Déconnexion</span>
            </button>
          </div>
        </aside>
      )}
    </>
  );
}
