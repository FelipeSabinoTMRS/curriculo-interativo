import { Printer, Github, Sun, Moon, Edit, Save, Menu, X } from 'lucide-react';
import { useState } from 'react';
import DebugPanel from './DebugPanel';

interface TopBarProps {
  onPrint: () => void;
  onEdit: () => void;
  onSave: () => void;
  isEditing: boolean;
  hasUnsavedChanges: boolean;
  isDarkTheme: boolean;
  onThemeToggle: () => void;
}

export default function TopBar({ 
  onPrint, 
  onEdit, 
  onSave, 
  isEditing, 
  hasUnsavedChanges, 
  isDarkTheme, 
  onThemeToggle 
}: TopBarProps) {
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);

  const toggleMobileMenu = () => {
    setMobileMenuOpen(!mobileMenuOpen);
  };

  const closeMobileMenu = () => {
    setMobileMenuOpen(false);
  };

  return (
    <>
      <div className={`flex justify-between items-center p-4 mb-4 rounded-lg shadow-lg transition-colors ${
        isDarkTheme ? 'bg-gray-800 text-white' : 'bg-white text-gray-900'
      }`}>
        {/* Logo/Title */}
        <div className="flex items-center space-x-4">
          <h1 className="text-xl font-bold">Currículo Interativo</h1>
          {isEditing && (
            <div className="hidden sm:flex items-center space-x-2">
              <div className="w-2 h-2 bg-yellow-500 rounded-full animate-pulse"></div>
              <span className="text-sm text-yellow-600 font-medium">Modo Edição Ativado</span>
              {hasUnsavedChanges && (
                <span className="text-xs bg-yellow-100 text-yellow-800 px-2 py-1 rounded-full">
                  Alterações não salvas
                </span>
              )}
            </div>
          )}
        </div>
        
        {/* Desktop Actions */}
        <div className="hidden md:flex items-center space-x-3">
          {/* Debug Panel Desktop */}
          <div className="hidden lg:block">
            <DebugPanel isDarkTheme={isDarkTheme} />
          </div>

          {/* Action Buttons */}
          <button 
            onClick={onEdit}
            className={`btn-sober ${isDarkTheme ? 'dark' : ''} ${isEditing ? 'active' : ''}`}
            style={isEditing ? {
              backgroundColor: isDarkTheme ? '#d97706' : '#fbbf24',
              borderColor: isDarkTheme ? '#92400e' : '#f59e0b',
              color: isDarkTheme ? '#fef3c7' : '#92400e'
            } : {}}
            title={isEditing ? 'Finalizar Edição' : 'Editar Localmente'}
          >
            <Edit size={20} />
          </button>

          <button 
            onClick={onSave}
            disabled={!hasUnsavedChanges}
            className={`btn-sober ${isDarkTheme ? 'dark' : ''} ${hasUnsavedChanges ? 'active' : ''} ${
              !hasUnsavedChanges ? 'opacity-50 cursor-not-allowed' : ''
            }`}
            title="Salvar Padrão"
          >
            <Save size={20} />
          </button>

          <button
            onClick={onPrint}
            className={`btn-sober ${isDarkTheme ? 'dark' : ''}`}
            title="Imprimir"
          >
            <Printer size={20} />
          </button>

          {/* Theme Toggle */}
          <div className="flex items-center space-x-2">
            <Sun size={16} className={isDarkTheme ? 'text-gray-400' : 'text-yellow-600'} />
            <div 
              className={`theme-toggle-switch ${isDarkTheme ? 'dark' : ''}`}
              onClick={onThemeToggle}
            ></div>
            <Moon size={16} className={isDarkTheme ? 'text-blue-400' : 'text-gray-400'} />
          </div>

          <a
            href="https://github.com/FelipeSabinoTMRS/curriculo-interativo"
            target="_blank"
            rel="noopener noreferrer"
            className={`btn-sober ${isDarkTheme ? 'dark' : ''}`}
            title="GitHub"
          >
            <Github size={20} />
          </a>
        </div>

        {/* Mobile Menu Button */}
        <button
          onClick={toggleMobileMenu}
          className={`md:hidden hamburger ${isDarkTheme ? 'dark' : ''}`}
        >
          <Menu size={24} />
        </button>
      </div>

      {/* Mobile Menu Overlay */}
      <div 
        className={`mobile-menu-overlay ${mobileMenuOpen ? 'open' : ''}`}
        onClick={closeMobileMenu}
      ></div>

      {/* Mobile Menu */}
      <div className={`mobile-menu ${isDarkTheme ? 'dark' : ''} ${mobileMenuOpen ? 'open' : ''}`}>
        <div className={`flex justify-between items-center p-4 border-b ${
          isDarkTheme ? 'border-gray-600' : 'border-gray-200'
        }`}>
          <h2 className="text-lg font-semibold">Menu</h2>
          <button
            onClick={closeMobileMenu}
            className={`p-2 rounded-lg ${isDarkTheme ? 'hover:bg-gray-600' : 'hover:bg-gray-100'}`}
          >
            <X size={20} />
          </button>
        </div>

        <div className="p-4 space-y-6">
          {/* Status de Edição Mobile */}
          {isEditing && (
            <div className={`flex items-center space-x-2 p-3 rounded-lg border ${
              isDarkTheme 
                ? 'bg-yellow-900 border-yellow-700 text-yellow-200' 
                : 'bg-yellow-50 border-yellow-200 text-yellow-800'
            }`}>
              <div className="w-2 h-2 bg-yellow-500 rounded-full animate-pulse"></div>
              <span className="text-sm font-medium">Modo Edição Ativado</span>
              {hasUnsavedChanges && (
                <span className={`text-xs px-2 py-1 rounded-full ${
                  isDarkTheme 
                    ? 'bg-yellow-800 text-yellow-200'
                    : 'bg-yellow-100 text-yellow-800'
                }`}>
                  Não salvo
                </span>
              )}
            </div>
          )}

          {/* Action Buttons Mobile */}
          <div className="space-y-3">
            <button 
              onClick={() => { onEdit(); closeMobileMenu(); }}
              className={`w-full flex items-center space-x-3 p-4 rounded-lg transition-colors ${
                isEditing 
                  ? (isDarkTheme ? 'bg-yellow-600 text-white' : 'bg-yellow-500 text-white')
                  : (isDarkTheme ? 'bg-gray-600 hover:bg-gray-700 text-white' : 'bg-gray-100 hover:bg-gray-200 text-gray-900')
              }`}
            >
              <Edit size={20} />
              <span>{isEditing ? 'Finalizar Edição' : 'Editar Localmente'}</span>
            </button>

            <button 
              onClick={() => { onSave(); closeMobileMenu(); }}
              disabled={!hasUnsavedChanges}
              className={`w-full flex items-center space-x-3 p-4 rounded-lg transition-colors ${
                hasUnsavedChanges
                  ? (isDarkTheme ? 'bg-green-600 hover:bg-green-700 text-white' : 'bg-green-500 hover:bg-green-600 text-white')
                  : 'bg-gray-300 text-gray-500 cursor-not-allowed'
              }`}
            >
              <Save size={20} />
              <span>Salvar Padrão</span>
            </button>

            <button
              onClick={() => { onPrint(); closeMobileMenu(); }}
              className={`w-full flex items-center space-x-3 p-4 rounded-lg transition-colors ${
                isDarkTheme ? 'bg-gray-600 hover:bg-gray-700 text-white' : 'bg-gray-100 hover:bg-gray-200 text-gray-900'
              }`}
            >
              <Printer size={20} />
              <span>Imprimir</span>
            </button>

            {/* Theme Toggle Mobile */}
            <div className={`flex items-center justify-between p-4 rounded-lg ${
              isDarkTheme ? 'bg-gray-600' : 'bg-gray-100'
            }`}>
              <div className="flex items-center space-x-3">
                <div className="flex items-center space-x-2">
                  <Sun size={16} />
                  <Moon size={16} />
                </div>
                <span>Tema {isDarkTheme ? 'Escuro' : 'Claro'}</span>
              </div>
              <div 
                className={`theme-toggle-switch ${isDarkTheme ? 'dark' : ''}`}
                onClick={onThemeToggle}
              ></div>
            </div>

            <a
              href="https://github.com/FelipeSabinoTMRS/curriculo-interativo"
              target="_blank"
              rel="noopener noreferrer"
              className={`w-full flex items-center space-x-3 p-4 rounded-lg transition-colors ${
                isDarkTheme ? 'bg-gray-600 hover:bg-gray-700 text-white' : 'bg-gray-100 hover:bg-gray-200 text-gray-900'
              }`}
              onClick={closeMobileMenu}
            >
              <Github size={20} />
              <span>GitHub</span>
            </a>
          </div>

          {/* Debug Panel Mobile */}
          <div className="border-t pt-4">
            <h3 className={`text-sm font-semibold mb-3 ${isDarkTheme ? 'text-gray-300' : 'text-gray-700'}`}>
              Debug Panel
            </h3>
            <div className="scale-95 origin-top-left">
              <DebugPanel isDarkTheme={isDarkTheme} />
            </div>
          </div>
        </div>
      </div>
    </>
  );
} 