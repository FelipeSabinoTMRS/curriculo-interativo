import React, { useState, useEffect } from 'react';
import { Edit3, Download, Menu, X, Github, Sun, Moon, RefreshCw } from 'lucide-react';

// Componente para o título animado
const AnimatedTitle = ({ isDarkTheme }: { isDarkTheme: boolean }) => {
  const [currentText, setCurrentText] = useState('Interativo');
  const [isClient, setIsClient] = useState(false);

  // Garantir que a animação só rode no cliente
  useEffect(() => {
    setIsClient(true);
  }, []);

  useEffect(() => {
    if (!isClient) return;
    
    const words = ['Interativo', 'Especialista'];
    let wordIndex = 0;
    let charIndex = 0;
    let isDeleting = false;

    const typeText = () => {
      const currentWord = words[wordIndex];
      
      if (isDeleting) {
        setCurrentText(currentWord.substring(0, charIndex - 1));
        charIndex--;
      } else {
        setCurrentText(currentWord.substring(0, charIndex + 1));
        charIndex++;
      }

      let typeSpeed = isDeleting ? 100 : 200;

      if (!isDeleting && charIndex === currentWord.length) {
        typeSpeed = 2000;
        isDeleting = true;
      } else if (isDeleting && charIndex === 0) {
        isDeleting = false;
        wordIndex = (wordIndex + 1) % words.length;
        typeSpeed = 500;
      }

      setTimeout(typeText, typeSpeed);
    };

    const timer = setTimeout(typeText, 1000);
    return () => clearTimeout(timer);
  }, [isClient]);

  return (
    <h1 className={`text-xl font-bold ${isDarkTheme ? 'text-white' : 'text-black'}`}>
      Currículo{' '}
      <span 
        className="inline-block min-w-[120px]"
        style={{
          color: '#fbbf24',
        }}
        suppressHydrationWarning={true}
      >
        {currentText}
      </span>
    </h1>
  );
};

interface TopBarProps {
  onEdit: () => void;
  onDownloadPDF: () => void;
  onResetData: () => void;
  isEditing: boolean;
  isDarkTheme: boolean;
  onThemeToggle: () => void;
  hasSecondaryDocument?: boolean;
}

export default function TopBar({ 
  onEdit, 
  onDownloadPDF, 
  onResetData,
  isEditing, 
  isDarkTheme, 
  onThemeToggle,
  hasSecondaryDocument
}: TopBarProps) {
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const [isClient, setIsClient] = useState(false);

  useEffect(() => { setIsClient(true); }, []);

  const toggleMobileMenu = () => {
    setMobileMenuOpen(prev => !prev);
  };

  const closeMobileMenu = () => {
    setMobileMenuOpen(false);
  };

  // Fechar menu quando redimensionar para desktop
  useEffect(() => {
    const handleResize = () => {
      if (window.innerWidth >= 768) {
        setMobileMenuOpen(false);
      }
    };

    window.addEventListener('resize', handleResize);
    return () => window.removeEventListener('resize', handleResize);
  }, []);

  // Fechar com Escape
  useEffect(() => {
    const handleKeyDown = (event: KeyboardEvent) => {
      if (event.key === 'Escape') {
        setMobileMenuOpen(false);
      }
    };

    document.addEventListener('keydown', handleKeyDown);
    return () => document.removeEventListener('keydown', handleKeyDown);
  }, []);

  return (
    <>
      <div className={`flex justify-between items-center p-4 mb-4 rounded-lg shadow-lg transition-colors ${
        isDarkTheme ? 'bg-gray-800 text-white' : 'bg-white text-gray-900'
      }`}>
        {/* Logo/Title */}
        <div className="flex items-center space-x-4">
          <img 
            src="/curriculo_interativo.png" 
            alt="Logo Currículo Interativo" 
            className="w-8 h-8 rounded-lg"
          />
          <AnimatedTitle isDarkTheme={isDarkTheme} />
          {isEditing && (
            <div className="hidden sm:flex items-center space-x-2">
              <div className="w-2 h-2 bg-yellow-500 rounded-full animate-pulse"></div>
              <span className="text-sm text-yellow-600 font-medium">Modo Edição Ativado</span>
            </div>
          )}
        </div>
        
        {/* Desktop Actions */}
        <div className="hidden md:flex items-center space-x-3">
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
            <Edit3 size={20} />
          </button>

          <button 
            onClick={onDownloadPDF}
            disabled={isEditing}
            className={`btn-sober ${isDarkTheme ? 'dark' : ''} ${isEditing ? 'opacity-50 cursor-not-allowed' : ''} relative`}
            title={isEditing ? "Finalize a edição primeiro para salvar como PDF" : "Salvar como PDF"}
          >
            <Download size={20} />
            {hasSecondaryDocument && (
              <div className="absolute -top-1 -right-1 w-5 h-5 bg-yellow-500 rounded-full flex items-center justify-center text-xs font-bold text-white">
                +1
              </div>
            )}
          </button>

          <button 
            onClick={onResetData}
            className={`btn-sober ${isDarkTheme ? 'dark' : ''}`}
            title="Limpar Dados Salvos"
          >
            <RefreshCw size={20} />
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
          style={isEditing ? {
            backgroundColor: isDarkTheme ? '#d97706' : '#fbbf24',
            borderColor: isDarkTheme ? '#92400e' : '#f59e0b',
            color: isDarkTheme ? '#fef3c7' : '#92400e'
          } : {}}
          aria-label={mobileMenuOpen ? "Fechar menu" : "Abrir menu"}
        >
          {mobileMenuOpen ? <X size={24} /> : <Menu size={24} />}
        </button>
      </div>

      {/* Mobile Menu e Overlay só no cliente */}
      {isClient && (
        <>
          {mobileMenuOpen && (
            <div 
              className="mobile-menu-overlay open"
              onClick={closeMobileMenu}
            ></div>
          )}
          <div className={`mobile-menu ${isDarkTheme ? 'dark' : ''} ${mobileMenuOpen ? 'open' : ''} ${isEditing ? 'editing' : ''}`}>
            <div className={`flex justify-between items-center p-4 border-b ${
              isEditing
                ? (isDarkTheme ? 'border-yellow-600 bg-yellow-900' : 'border-yellow-300 bg-yellow-50')
                : (isDarkTheme ? 'border-gray-600' : 'border-gray-200')
            }`}>
              <h2 className={`text-lg font-semibold ${
                isEditing
                  ? (isDarkTheme ? 'text-yellow-100' : 'text-yellow-800')
                  : (isDarkTheme ? 'text-white' : 'text-gray-900')
              }`}>Menu</h2>
              <button
                onClick={closeMobileMenu}
                className={`p-2 rounded-lg transition-colors ${
                  isEditing
                    ? (isDarkTheme ? 'hover:bg-yellow-800 text-yellow-100 active:bg-yellow-700' : 'hover:bg-yellow-100 text-yellow-800 active:bg-yellow-200')
                    : (isDarkTheme ? 'hover:bg-gray-600 text-white active:bg-gray-500' : 'hover:bg-gray-100 text-gray-900 active:bg-gray-200')
                }`}
                aria-label="Fechar menu"
              >
                <X size={20} />
              </button>
            </div>
            <div className="p-4 space-y-6">
              {isEditing && (
                <div className={`flex items-center space-x-2 p-3 rounded-lg border ${
                  isDarkTheme 
                    ? 'bg-yellow-900 border-yellow-700 text-yellow-200' 
                    : 'bg-yellow-50 border-yellow-200 text-yellow-800'
                }`}>
                  <div className="w-2 h-2 bg-yellow-500 rounded-full animate-pulse"></div>
                  <span className="text-sm font-medium">Modo Edição Ativado</span>
                </div>
              )}
              <div className="space-y-3">
                <button 
                  onClick={() => { onEdit(); closeMobileMenu(); }}
                  className={`w-full flex items-center space-x-3 p-4 rounded-lg transition-colors ${
                    isEditing 
                      ? (isDarkTheme ? 'bg-yellow-600 text-white' : 'bg-yellow-500 text-white')
                      : (isDarkTheme ? 'bg-gray-600 hover:bg-gray-700 text-white' : 'bg-gray-100 hover:bg-gray-200 text-gray-900')
                  }`}
                >
                  <Edit3 size={20} />
                  <span>{isEditing ? 'Finalizar Edição' : 'Editar Localmente'}</span>
                </button>
                <button 
                  onClick={() => { onDownloadPDF(); closeMobileMenu(); }}
                  disabled={isEditing}
                  className={`w-full flex items-center space-x-3 p-4 rounded-lg transition-colors relative ${
                    isEditing 
                      ? (isDarkTheme ? 'bg-gray-400 text-gray-300 cursor-not-allowed' : 'bg-gray-300 text-gray-500 cursor-not-allowed')
                      : (isDarkTheme ? 'bg-gray-600 hover:bg-gray-700 text-white' : 'bg-gray-100 hover:bg-gray-200 text-gray-900')
                  }`}
                >
                  <Download size={20} />
                  <span>{isEditing ? 'Finalize a edição primeiro' : 'Salvar como PDF'}</span>
                  {hasSecondaryDocument && (
                    <div className="absolute top-2 right-2 w-5 h-5 bg-yellow-500 rounded-full flex items-center justify-center text-xs font-bold text-white">
                      +1
                    </div>
                  )}
                </button>
                <button 
                  onClick={() => { onResetData(); closeMobileMenu(); }}
                  className={`w-full flex items-center space-x-3 p-4 rounded-lg transition-colors ${
                    isDarkTheme ? 'bg-gray-600 hover:bg-gray-700 text-white' : 'bg-gray-100 hover:bg-gray-200 text-gray-900'
                  }`}
                >
                  <RefreshCw size={20} />
                  <span>Limpar Dados Salvos</span>
                </button>
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
                >
                  <Github size={20} />
                  <span>GitHub</span>
                </a>
              </div>
            </div>
          </div>
        </>
      )}
    </>
  );
}