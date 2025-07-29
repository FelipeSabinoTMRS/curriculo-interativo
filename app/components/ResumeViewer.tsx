import React, { useRef, useLayoutEffect, useState } from "react";
import type { Resume } from '~/types';
import { Github, Mail, Phone, MapPin, Globe, Edit3, Check, X, Palette, Image, Upload, User } from 'lucide-react';

interface ResumeViewerProps {
  resume: Resume;
  isDarkTheme?: boolean;
  isEditing?: boolean;
  onFieldChange?: () => void;
}

interface EditableFieldProps {
  value: string;
  onSave: (newValue: string) => void;
  isEditing: boolean;
  type?: 'text' | 'textarea' | 'email' | 'tel';
  className?: string;
  placeholder?: string;
  isDarkTheme?: boolean;
}

interface Theme {
  id: string;
  name: string;
  colors: {
    primary: string;
    secondary: string;
    accent: string;
    border: string;
    background: string;
  };
}

interface Wallpaper {
  id: string;
  name: string;
  type: 'pixels' | 'geometric' | 'minimal';
  pattern: string;
}

const themes: Theme[] = [
  {
    id: 'default',
    name: 'Clássico Azul',
    colors: {
      primary: '#2563eb',
      secondary: '#1e40af',
      accent: '#3b82f6',
      border: '#93c5fd',
      background: '#dbeafe'
    }
  },
  {
    id: 'green',
    name: 'Verde Profissional',
    colors: {
      primary: '#059669',
      secondary: '#047857',
      accent: '#10b981',
      border: '#6ee7b7',
      background: '#d1fae5'
    }
  },
  {
    id: 'purple',
    name: 'Roxo Criativo',
    colors: {
      primary: '#7c3aed',
      secondary: '#6d28d9',
      accent: '#8b5cf6',
      border: '#c4b5fd',
      background: '#e9d5ff'
    }
  },
  {
    id: 'red',
    name: 'Vermelho Executivo',
    colors: {
      primary: '#dc2626',
      secondary: '#b91c1c',
      accent: '#ef4444',
      border: '#fca5a5',
      background: '#fee2e2'
    }
  },
  {
    id: 'orange',
    name: 'Laranja Energético',
    colors: {
      primary: '#ea580c',
      secondary: '#c2410c',
      accent: '#f97316',
      border: '#fdba74',
      background: '#fed7aa'
    }
  }
];

const wallpapers: Wallpaper[] = [
  {
    id: 'none',
    name: 'Sem Wallpaper',
    type: 'minimal',
    pattern: ''
  },
  {
    id: 'pixels',
    name: 'Pixels Tech',
    type: 'pixels',
    pattern: 'data:image/svg+xml,%3Csvg width="20" height="20" viewBox="0 0 20 20" xmlns="http://www.w3.org/2000/svg"%3E%3Crect width="2" height="2" fill="%23000" opacity="0.1"/%3E%3Crect x="2" y="2" width="2" height="2" fill="%23000" opacity="0.05"/%3E%3Crect x="4" y="4" width="2" height="2" fill="%23000" opacity="0.08"/%3E%3C/svg%3E'
  },
  {
    id: 'dots',
    name: 'Pontos Geométricos',
    type: 'geometric',
    pattern: 'data:image/svg+xml,%3Csvg width="30" height="30" viewBox="0 0 30 30" xmlns="http://www.w3.org/2000/svg"%3E%3Ccircle cx="15" cy="15" r="1" fill="%23000" opacity="0.1"/%3E%3C/svg%3E'
  },
  {
    id: 'grid',
    name: 'Grade Sutil',
    type: 'minimal',
    pattern: 'data:image/svg+xml,%3Csvg width="40" height="40" viewBox="0 0 40 40" xmlns="http://www.w3.org/2000/svg"%3E%3Cpath d="M0 0h40v1H0zM0 0v40h1V0z" fill="%23000" opacity="0.05"/%3E%3C/svg%3E'
  }
];

const profilePhotos = [
  'https://images.unsplash.com/photo-1472099645785-5658abf4ff4e?w=150&h=150&fit=crop&crop=face',
  'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=150&h=150&fit=crop&crop=face',
  'https://images.unsplash.com/photo-1500648767791-00dcc994a43e?w=150&h=150&fit=crop&crop=face',
  'https://images.unsplash.com/photo-1519244703995-f4e0f30006d5?w=150&h=150&fit=crop&crop=face'
];

function EditableField({ value, onSave, isEditing, type = 'text', className = '', placeholder, isDarkTheme }: EditableFieldProps) {
  const [editValue, setEditValue] = useState(value);
  const [isFieldEditing, setIsFieldEditing] = useState(false);

  const handleSave = () => {
    onSave(editValue);
    setIsFieldEditing(false);
  };

  const handleCancel = () => {
    setEditValue(value);
    setIsFieldEditing(false);
  };

  const handleKeyDown = (e: React.KeyboardEvent) => {
    if (e.key === 'Enter' && type !== 'textarea') {
      handleSave();
    }
    if (e.key === 'Escape') {
      handleCancel();
    }
  };

  if (isEditing && isFieldEditing) {
    return (
      <div className="relative group">
        {type === 'textarea' ? (
          <textarea
            value={editValue}
            onChange={(e) => setEditValue(e.target.value)}
            onKeyDown={handleKeyDown}
            className={`${className} border-2 rounded px-2 py-1 w-full resize-none ${
              isDarkTheme 
                ? 'border-yellow-500 bg-gray-800 text-white' 
                : 'border-yellow-300 bg-white text-gray-900'
            }`}
            placeholder={placeholder}
            rows={3}
            autoFocus
          />
        ) : (
          <input
            type={type}
            value={editValue}
            onChange={(e) => setEditValue(e.target.value)}
            onKeyDown={handleKeyDown}
            className={`${className} border-2 rounded px-2 py-1 w-full ${
              isDarkTheme 
                ? 'border-yellow-500 bg-gray-800 text-white' 
                : 'border-yellow-300 bg-white text-gray-900'
            }`}
            placeholder={placeholder}
            autoFocus
          />
        )}
        <div className="absolute right-0 top-0 -mt-8 flex space-x-1">
          <button
            onClick={handleSave}
            className="p-1 bg-green-500 text-white rounded-full hover:bg-green-600 transition-colors"
            title="Salvar"
          >
            <Check size={12} />
          </button>
          <button
            onClick={handleCancel}
            className="p-1 bg-red-500 text-white rounded-full hover:bg-red-600 transition-colors"
            title="Cancelar"
          >
            <X size={12} />
          </button>
        </div>
      </div>
    );
  }

  return (
    <div
      className={`${className} ${isEditing ? `cursor-pointer relative group rounded px-2 py-1 transition-all ${
        isDarkTheme 
          ? 'hover:bg-gray-700 hover:border hover:border-yellow-500' 
          : 'hover:bg-yellow-50 hover:border hover:border-yellow-300'
      }` : ''}`}
      onClick={() => isEditing && setIsFieldEditing(true)}
    >
      {value || (isEditing ? placeholder : '')}
      {isEditing && (
        <Edit3 size={12} className="absolute right-1 top-1 opacity-0 group-hover:opacity-50 transition-opacity" />
      )}
    </div>
  );
}

export default function ResumeViewer({ resume, isDarkTheme = false, isEditing = false, onFieldChange }: ResumeViewerProps) {
  const { personalInfo, experiences, education, skills, projects } = resume;
  const containerRef = useRef<HTMLDivElement>(null);
  const [marginBottom, setMarginBottom] = useState(0);
  
  // Estados locais para edição
  const [localResume, setLocalResume] = useState<Resume>(resume);
  const [selectedTheme, setSelectedTheme] = useState<Theme>(themes[0]);
  const [selectedWallpaper, setSelectedWallpaper] = useState<Wallpaper>(wallpapers[0]);
  const [profilePhoto, setProfilePhoto] = useState<string>('');
  const [showThemePalette, setShowThemePalette] = useState(false);
  const [showWallpaperSelector, setShowWallpaperSelector] = useState(false);
  const [showProfileSelector, setShowProfileSelector] = useState(false);

  // Sincronizar com prop quando não estiver editando
  useLayoutEffect(() => {
    if (!isEditing) {
      setLocalResume(resume);
    }
  }, [resume, isEditing]);

  /**
   * Calcula o fator de escala baseado na largura da viewport
   * Breakpoints correspondentes aos definidos no CSS do debug panel
   */
  function getScale(): number {
    if (typeof window === 'undefined') return 1;
    if (window.innerWidth <= 420) return 0.4;
    if (window.innerWidth <= 520) return 0.45;
    if (window.innerWidth <= 639) return 0.55;
    if (window.innerWidth <= 767) return 0.65;
    if (window.innerWidth <= 899) return 0.75;
    if (window.innerWidth <= 1023) return 0.85;
    return 1;
  }

  /**
   * Calcula e aplica margin-bottom negativo para compensar 
   * o espaço extra deixado pelo transform: scale()
   */
  useLayoutEffect(() => {
    function updateMargin() {
      const scale = getScale();
      if (containerRef.current) {
        const realHeight = containerRef.current.offsetHeight;
        const scaledHeight = realHeight * scale;
        const marginCompensation = -(realHeight - scaledHeight);
        
        // Debug: log dos valores para verificar
        console.log('Scale:', scale, 'Real Height:', realHeight, 'Scaled Height:', scaledHeight, 'Margin:', marginCompensation);
        
        setMarginBottom(marginCompensation);
      }
    }

    // Aguardar renderização completa antes de calcular
    const timeoutId = setTimeout(updateMargin, 100);
    
    window.addEventListener("resize", updateMargin);
    window.addEventListener("orientationchange", updateMargin);
    
    return () => {
      clearTimeout(timeoutId);
      window.removeEventListener("resize", updateMargin);
      window.removeEventListener("orientationchange", updateMargin);
    };
  }, [localResume, isEditing]); // Recalcular quando dados mudarem

  const handleFieldUpdate = (section: string, field: string, value: any) => {
    const updatedResume = { ...localResume };
    
    if (section === 'personalInfo') {
      updatedResume.personalInfo = { ...updatedResume.personalInfo, [field]: value };
    }
    // Adicionar outros handlers conforme necessário
    
    setLocalResume(updatedResume);
    onFieldChange?.();
  };

  const handleProfilePhotoUpload = (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    if (file) {
      const reader = new FileReader();
      reader.onload = (e) => {
        setProfilePhoto(e.target?.result as string);
        onFieldChange?.();
      };
      reader.readAsDataURL(file);
    }
  };

  const currentData = isEditing ? localResume : resume;

  const getWallpaperStyle = () => {
    if (selectedWallpaper.id === 'none') return {};
    
    return {
      backgroundImage: `url("${selectedWallpaper.pattern}")`,
      backgroundRepeat: 'repeat',
      backgroundPosition: 'bottom right',
      backgroundSize: selectedWallpaper.type === 'pixels' ? '20px 20px' : '30px 30px'
    };
  };

  return (
    <>
      {/* Painel de Edição Avançada */}
      {isEditing && (
        <div className={`mb-4 p-4 rounded-lg border ${
          isDarkTheme ? 'bg-gray-800 border-gray-700' : 'bg-white border-gray-200'
        }`}>
          <h3 className={`text-lg font-semibold mb-4 ${isDarkTheme ? 'text-white' : 'text-gray-900'}`}>
            Personalização do Currículo
          </h3>
          
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            {/* Foto de Perfil */}
            <div>
              <label className={`block text-sm font-medium mb-2 ${isDarkTheme ? 'text-gray-300' : 'text-gray-700'}`}>
                Foto de Perfil
              </label>
              <div className="flex items-center space-x-3">
                <div className="w-16 h-16 rounded-full overflow-hidden bg-gray-200 flex items-center justify-center">
                  {profilePhoto ? (
                    <img src={profilePhoto} alt="Profile" className="w-full h-full object-cover" />
                  ) : (
                    <User size={24} className="text-gray-400" />
                  )}
                </div>
                <div className="space-y-2">
                  <button
                    onClick={() => setShowProfileSelector(!showProfileSelector)}
                    className={`px-3 py-1 text-xs rounded transition-colors ${
                      isDarkTheme 
                        ? 'bg-gray-700 hover:bg-gray-600 text-white' 
                        : 'bg-gray-100 hover:bg-gray-200 text-gray-900'
                    }`}
                  >
                    <Image size={14} className="inline mr-1" />
                    Galeria
                  </button>
                  <label className={`block cursor-pointer px-3 py-1 text-xs rounded transition-colors ${
                    isDarkTheme 
                      ? 'bg-blue-600 hover:bg-blue-700 text-white' 
                      : 'bg-blue-500 hover:bg-blue-600 text-white'
                  }`}>
                    <Upload size={14} className="inline mr-1" />
                    Upload
                    <input
                      type="file"
                      accept="image/*"
                      onChange={handleProfilePhotoUpload}
                      className="hidden"
                    />
                  </label>
                </div>
              </div>
              
              {/* Seletor de Fotos */}
              {showProfileSelector && (
                <div className={`mt-3 p-3 rounded border ${
                  isDarkTheme ? 'border-gray-700 bg-gray-750' : 'border-gray-200 bg-gray-50'
                }`}>
                  <div className="grid grid-cols-4 gap-2">
                    {profilePhotos.map((photo, index) => (
                      <img
                        key={index}
                        src={photo}
                        alt={`Opção ${index + 1}`}
                        className="w-12 h-12 rounded-full object-cover cursor-pointer hover:ring-2 hover:ring-blue-500 transition-all"
                        onClick={() => {
                          setProfilePhoto(photo);
                          setShowProfileSelector(false);
                          onFieldChange?.();
                        }}
                      />
                    ))}
                  </div>
                </div>
              )}
            </div>

            {/* Paleta de Cores */}
            <div>
              <label className={`block text-sm font-medium mb-2 ${isDarkTheme ? 'text-gray-300' : 'text-gray-700'}`}>
                Tema de Cores
              </label>
              <button
                onClick={() => setShowThemePalette(!showThemePalette)}
                className={`w-full flex items-center justify-between p-3 rounded border transition-colors ${
                  isDarkTheme 
                    ? 'border-gray-700 bg-gray-700 hover:bg-gray-600 text-white' 
                    : 'border-gray-200 bg-white hover:bg-gray-50 text-gray-900'
                }`}
              >
                <div className="flex items-center space-x-2">
                  <div 
                    className="w-4 h-4 rounded-full" 
                    style={{ backgroundColor: selectedTheme.colors.primary }}
                  ></div>
                  <span>{selectedTheme.name}</span>
                </div>
                <Palette size={16} />
              </button>
              
              {showThemePalette && (
                <div className={`mt-2 p-3 rounded border space-y-2 ${
                  isDarkTheme ? 'border-gray-700 bg-gray-750' : 'border-gray-200 bg-gray-50'
                }`}>
                  {themes.map((theme) => (
                    <button
                      key={theme.id}
                      onClick={() => {
                        setSelectedTheme(theme);
                        setShowThemePalette(false);
                        onFieldChange?.();
                      }}
                      className={`w-full flex items-center space-x-3 p-2 rounded transition-colors ${
                        selectedTheme.id === theme.id 
                          ? (isDarkTheme ? 'bg-gray-600' : 'bg-gray-200')
                          : (isDarkTheme ? 'hover:bg-gray-600' : 'hover:bg-gray-100')
                      }`}
                    >
                      <div className="flex space-x-1">
                        <div className="w-3 h-3 rounded-full" style={{ backgroundColor: theme.colors.primary }}></div>
                        <div className="w-3 h-3 rounded-full" style={{ backgroundColor: theme.colors.secondary }}></div>
                        <div className="w-3 h-3 rounded-full" style={{ backgroundColor: theme.colors.accent }}></div>
                      </div>
                      <span className="text-sm">{theme.name}</span>
                    </button>
                  ))}
                </div>
              )}
            </div>

            {/* Wallpaper */}
            <div>
              <label className={`block text-sm font-medium mb-2 ${isDarkTheme ? 'text-gray-300' : 'text-gray-700'}`}>
                Wallpaper
              </label>
              <button
                onClick={() => setShowWallpaperSelector(!showWallpaperSelector)}
                className={`w-full flex items-center justify-between p-3 rounded border transition-colors ${
                  isDarkTheme 
                    ? 'border-gray-700 bg-gray-700 hover:bg-gray-600 text-white' 
                    : 'border-gray-200 bg-white hover:bg-gray-50 text-gray-900'
                }`}
              >
                <span>{selectedWallpaper.name}</span>
                <Image size={16} />
              </button>
              
              {showWallpaperSelector && (
                <div className={`mt-2 p-3 rounded border space-y-2 ${
                  isDarkTheme ? 'border-gray-700 bg-gray-750' : 'border-gray-200 bg-gray-50'
                }`}>
                  {wallpapers.map((wallpaper) => (
                    <button
                      key={wallpaper.id}
                      onClick={() => {
                        setSelectedWallpaper(wallpaper);
                        setShowWallpaperSelector(false);
                        onFieldChange?.();
                      }}
                      className={`w-full flex items-center justify-between p-2 rounded transition-colors ${
                        selectedWallpaper.id === wallpaper.id 
                          ? (isDarkTheme ? 'bg-gray-600' : 'bg-gray-200')
                          : (isDarkTheme ? 'hover:bg-gray-600' : 'hover:bg-gray-100')
                      }`}
                    >
                      <span className="text-sm">{wallpaper.name}</span>
                      {wallpaper.pattern && (
                        <div 
                          className="w-8 h-8 rounded border"
                          style={{
                            backgroundImage: `url("${wallpaper.pattern}")`,
                            backgroundRepeat: 'repeat',
                            backgroundSize: '10px 10px'
                          }}
                        ></div>
                      )}
                    </button>
                  ))}
                </div>
              )}
            </div>
          </div>
        </div>
      )}

      {/* Currículo */}
      <div
        className="resume-container"
        style={{
          transform: `scale(${getScale()})`,
          transformOrigin: "top center",
          marginBottom: `${marginBottom}px`,
          transition: "transform 0.3s ease-in-out, margin-bottom 0.3s ease-in-out"
        }}
        ref={containerRef}
      >
        <div className="space-y-4">
          {/* Primeira Página */}
                     <div 
             className={`resume-paper min-h-[297mm] p-8 mx-auto shadow-2xl print:shadow-none print:min-h-[297mm] relative ${
               isDarkTheme 
                 ? 'bg-gray-900 text-white border-gray-700 print:bg-white print:text-black print:border-gray-200' 
                 : 'bg-white text-gray-900 border-gray-200'
             }`}
             style={{
               ...getWallpaperStyle(),
               ...({
                 '--theme-primary': selectedTheme.colors.primary,
                 '--theme-secondary': selectedTheme.colors.secondary,
                 '--theme-accent': selectedTheme.colors.accent,
                 '--theme-border': selectedTheme.colors.border,
                 '--theme-background': selectedTheme.colors.background,
               } as any)
             } as React.CSSProperties}
          >
            {/* Foto de Perfil */}
            <div className="absolute top-8 left-8 w-24 h-24 rounded-full overflow-hidden bg-gray-200 flex items-center justify-center border-4" 
                 style={{ borderColor: selectedTheme.colors.primary }}>
              {profilePhoto ? (
                <img src={profilePhoto} alt="Profile" className="w-full h-full object-cover" />
              ) : (
                <User size={32} className="text-gray-400" />
              )}
            </div>

            {/* Cabeçalho */}
            <header className="mb-8 text-center border-b-2 pb-6 ml-32" style={{ borderColor: selectedTheme.colors.border }}>
              <EditableField
                value={currentData.personalInfo.name}
                onSave={(value) => handleFieldUpdate('personalInfo', 'name', value)}
                isEditing={isEditing}
                isDarkTheme={isDarkTheme}
                className={`text-4xl font-bold mb-2 ${isDarkTheme ? 'text-white print:text-gray-900' : 'text-gray-900'}`}
                placeholder="Seu nome completo"
              />
              <EditableField
                value={currentData.personalInfo.title}
                onSave={(value) => handleFieldUpdate('personalInfo', 'title', value)}
                isEditing={isEditing}
                isDarkTheme={isDarkTheme}
                className={`text-xl ${isDarkTheme ? 'text-gray-300 print:text-gray-600' : 'text-gray-600'}`}
                placeholder="Seu título profissional"
              />
              
              {/* Informações de Contato */}
              <div className="flex flex-wrap justify-center gap-4 mt-4 text-sm">
                <div className="flex items-center gap-2">
                  <Mail size={16} style={{ color: selectedTheme.colors.primary }} />
                  <EditableField
                    value={currentData.personalInfo.email}
                    onSave={(value) => handleFieldUpdate('personalInfo', 'email', value)}
                    isEditing={isEditing}
                    isDarkTheme={isDarkTheme}
                    type="email"
                    className={isDarkTheme ? 'text-gray-300 print:text-gray-700' : 'text-gray-700'}
                    placeholder="seu@email.com"
                  />
                </div>
                <div className="flex items-center gap-2">
                  <Phone size={16} style={{ color: selectedTheme.colors.primary }} />
                  <EditableField
                    value={currentData.personalInfo.phone}
                    onSave={(value) => handleFieldUpdate('personalInfo', 'phone', value)}
                    isEditing={isEditing}
                    isDarkTheme={isDarkTheme}
                    type="tel"
                    className={isDarkTheme ? 'text-gray-300 print:text-gray-700' : 'text-gray-700'}
                    placeholder="+55 (11) 99999-9999"
                  />
                </div>
                <div className="flex items-center gap-2">
                  <MapPin size={16} style={{ color: selectedTheme.colors.primary }} />
                  <EditableField
                    value={currentData.personalInfo.location}
                    onSave={(value) => handleFieldUpdate('personalInfo', 'location', value)}
                    isEditing={isEditing}
                    isDarkTheme={isDarkTheme}
                    className={isDarkTheme ? 'text-gray-300 print:text-gray-700' : 'text-gray-700'}
                    placeholder="Cidade, Estado"
                  />
                </div>
                <div className="flex items-center gap-2">
                  <Github size={16} style={{ color: selectedTheme.colors.primary }} />
                  <EditableField
                    value={currentData.personalInfo.githubUrl}
                    onSave={(value) => handleFieldUpdate('personalInfo', 'githubUrl', value)}
                    isEditing={isEditing}
                    isDarkTheme={isDarkTheme}
                    className={isDarkTheme ? 'text-gray-300 print:text-gray-700' : 'text-gray-700'}
                    placeholder="https://github.com/seuusuario"
                  />
                </div>
              </div>
            </header>

            {/* Resumo Profissional */}
            <section className="mb-8">
              <h2 className={`text-2xl font-bold mb-4 border-b-2 pb-2 ${
                isDarkTheme ? 'text-white print:text-gray-900' : 'text-gray-900'
              }`} style={{ borderColor: selectedTheme.colors.primary }}>
                Resumo Profissional
              </h2>
              <EditableField
                value={currentData.personalInfo.summary}
                onSave={(value) => handleFieldUpdate('personalInfo', 'summary', value)}
                isEditing={isEditing}
                isDarkTheme={isDarkTheme}
                type="textarea"
                className={`text-justify leading-relaxed ${isDarkTheme ? 'text-gray-300 print:text-gray-700' : 'text-gray-700'}`}
                placeholder="Descreva sua experiência profissional, habilidades principais e objetivos de carreira..."
              />
            </section>

            {/* Experiência Profissional */}
            <section className="mb-8">
              <h2 className={`text-2xl font-bold mb-4 border-b-2 pb-2 ${
                isDarkTheme ? 'text-white print:text-gray-900' : 'text-gray-900'
              }`} style={{ borderColor: selectedTheme.colors.primary }}>
                Experiência Profissional
              </h2>
              <div className="space-y-6">
                {currentData.experiences.map((exp, index) => (
                  <div key={index} className="border-l-4 pl-6" style={{ borderColor: selectedTheme.colors.accent }}>
                    <div className="flex justify-between items-start mb-2">
                      <div>
                        <h3 className={`text-xl font-semibold ${isDarkTheme ? 'text-white print:text-gray-900' : 'text-gray-900'}`}>
                          {exp.position}
                        </h3>
                        <p className="text-lg" style={{ color: selectedTheme.colors.primary }}>
                          {exp.company}
                        </p>
                        <p className={`text-sm ${isDarkTheme ? 'text-gray-400 print:text-gray-600' : 'text-gray-600'}`}>
                          {exp.location}
                        </p>
                      </div>
                      <span className={`text-sm font-medium ${isDarkTheme ? 'text-gray-400 print:text-gray-600' : 'text-gray-600'}`}>
                        {exp.startDate} - {exp.endDate || 'Presente'}
                      </span>
                    </div>
                    <p className={`text-justify mb-3 leading-relaxed ${isDarkTheme ? 'text-gray-300 print:text-gray-700' : 'text-gray-700'}`}>
                      {exp.description}
                    </p>
                    <div className="flex flex-wrap gap-2">
                      {exp.technologies.map((tech, techIndex) => (
                        <span
                          key={techIndex}
                          className={`px-3 py-1 text-xs font-medium rounded-full ${
                            isDarkTheme 
                              ? 'text-white print:text-black' 
                              : 'text-black'
                          }`}
                          style={{ 
                            backgroundColor: selectedTheme.colors.background,
                            color: selectedTheme.colors.secondary 
                          }}
                        >
                          {tech}
                        </span>
                      ))}
                    </div>
                  </div>
                ))}
              </div>
            </section>

            {/* Educação */}
            <section className="mb-8">
              <h2 className={`text-2xl font-bold mb-4 border-b-2 pb-2 ${
                isDarkTheme ? 'text-white print:text-gray-900' : 'text-gray-900'
              }`} style={{ borderColor: selectedTheme.colors.primary }}>
                Formação Acadêmica
              </h2>
              <div className="space-y-4">
                {currentData.education.map((edu, index) => (
                  <div key={index} className="border-l-4 pl-6" style={{ borderColor: selectedTheme.colors.accent }}>
                    <div className="flex justify-between items-start mb-2">
                      <div>
                        <h3 className={`text-xl font-semibold ${isDarkTheme ? 'text-white print:text-gray-900' : 'text-gray-900'}`}>
                          {edu.degree}
                        </h3>
                        <p className="text-lg" style={{ color: selectedTheme.colors.primary }}>
                          {edu.institution}
                        </p>
                        <p className={`text-sm ${isDarkTheme ? 'text-gray-400 print:text-gray-600' : 'text-gray-600'}`}>
                          {edu.fieldOfStudy}
                        </p>
                        {edu.gpa && (
                          <p className={`text-sm ${isDarkTheme ? 'text-gray-400 print:text-gray-600' : 'text-gray-600'}`}>
                            CRA: {edu.gpa}
                          </p>
                        )}
                      </div>
                      <span className={`text-sm font-medium ${isDarkTheme ? 'text-gray-400 print:text-gray-600' : 'text-gray-600'}`}>
                        {edu.startDate} - {edu.endDate || 'Presente'}
                      </span>
                    </div>
                    {edu.description && (
                      <p className={`text-justify leading-relaxed ${isDarkTheme ? 'text-gray-300 print:text-gray-700' : 'text-gray-700'}`}>
                        {edu.description}
                      </p>
                    )}
                  </div>
                ))}
              </div>
            </section>
          </div>

          {/* Segunda Página */}
          <div 
            className={`resume-paper min-h-[297mm] p-8 mx-auto shadow-2xl print:shadow-none print:break-before-page print:min-h-[297mm] relative ${
              isDarkTheme 
                ? 'bg-gray-900 text-white border-gray-700 print:bg-white print:text-black print:border-gray-200' 
                : 'bg-white text-gray-900 border-gray-200'
            }`}
            style={getWallpaperStyle()}
          >
            {/* Habilidades Técnicas */}
            <section className="mb-8">
              <h2 className={`text-2xl font-bold mb-4 border-b-2 pb-2 ${
                isDarkTheme ? 'text-white print:text-gray-900' : 'text-gray-900'
              }`} style={{ borderColor: selectedTheme.colors.primary }}>
                Habilidades Técnicas
              </h2>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                {currentData.skills.map((skillGroup, index) => (
                  <div key={index}>
                    <h3 className={`text-lg font-semibold mb-3 ${isDarkTheme ? 'text-white print:text-gray-900' : 'text-gray-900'}`}>
                      {skillGroup.category}
                    </h3>
                    <div className="flex flex-wrap gap-2">
                      {skillGroup.items.map((skill, skillIndex) => (
                        <span
                          key={skillIndex}
                          className={`px-3 py-1 text-sm font-medium rounded-full ${
                            isDarkTheme 
                              ? 'bg-gray-600 text-white print:text-gray-800' 
                              : 'text-gray-800'
                          }`}
                          style={{ 
                            backgroundColor: selectedTheme.colors.background,
                            color: selectedTheme.colors.secondary 
                          }}
                        >
                          {skill}
                        </span>
                      ))}
                    </div>
                  </div>
                ))}
              </div>
            </section>

            {/* Projetos */}
            <section className="mb-8">
              <h2 className={`text-2xl font-bold mb-4 border-b-2 pb-2 ${
                isDarkTheme ? 'text-white print:text-gray-900' : 'text-gray-900'
              }`} style={{ borderColor: selectedTheme.colors.primary }}>
                Projetos em Destaque
              </h2>
              <div className="space-y-6">
                {currentData.projects.map((project, index) => (
                  <div key={index} className="border-l-4 pl-6" style={{ borderColor: selectedTheme.colors.accent }}>
                    <div className="flex justify-between items-start mb-2">
                      <h3 className={`text-xl font-semibold ${isDarkTheme ? 'text-white print:text-gray-900' : 'text-gray-900'}`}>
                        {project.name}
                      </h3>
                      <div className="flex space-x-2">
                        {project.githubUrl && (
                          <a
                            href={project.githubUrl}
                            target="_blank"
                            rel="noopener noreferrer"
                            className="p-1 rounded transition-colors"
                            style={{ color: selectedTheme.colors.primary }}
                          >
                            <Github size={16} />
                          </a>
                        )}
                        {project.demoUrl && (
                          <a
                            href={project.demoUrl}
                            target="_blank"
                            rel="noopener noreferrer"
                            className="p-1 rounded transition-colors"
                            style={{ color: selectedTheme.colors.primary }}
                          >
                            <Globe size={16} />
                          </a>
                        )}
                      </div>
                    </div>
                    <p className={`text-justify mb-3 leading-relaxed ${isDarkTheme ? 'text-gray-300 print:text-gray-700' : 'text-gray-700'}`}>
                      {project.description}
                    </p>
                    <div className="flex flex-wrap gap-2">
                      {project.technologies.map((tech, techIndex) => (
                        <span
                          key={techIndex}
                          className={`px-3 py-1 text-xs font-medium rounded-full ${
                            isDarkTheme 
                              ? 'text-white print:text-black' 
                              : 'text-black'
                          }`}
                          style={{ 
                            backgroundColor: selectedTheme.colors.background,
                            color: selectedTheme.colors.secondary 
                          }}
                        >
                          {tech}
                        </span>
                      ))}
                    </div>
                  </div>
                ))}
              </div>
            </section>
          </div>
        </div>
      </div>
    </>
  );
} 