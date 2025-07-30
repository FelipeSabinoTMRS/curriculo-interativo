import React, { useRef, useLayoutEffect, useState, useEffect } from "react";
import type { Resume, Experience, Education, Project, Skill } from '~/types';
import { Github, Mail, Phone, MapPin, Globe, Palette, Image, Upload, User, DollarSign, CheckCircle, MousePointer } from 'lucide-react';
import EditableField from "./EditableField";

// Hook que usa useLayoutEffect no cliente e useEffect no servidor
const useIsomorphicLayoutEffect = typeof window !== 'undefined' ? useLayoutEffect : useEffect;

interface ResumeViewerProps {
  resume: Resume;
  isDarkTheme?: boolean;
  isEditing?: boolean;
  onFieldChange?: (updatedResume: Resume) => void;
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
    name: 'Sem Fundo',
    type: 'minimal',
    pattern: ''
  },
  {
    id: 'dots',
    name: 'Pontos Simples',
    type: 'geometric',
    pattern: 'dots'
  },
  {
    id: 'grid',
    name: 'Grade Simples',
    type: 'minimal',
    pattern: 'grid'
  },
  {
    id: 'circles',
    name: 'Círculos',
    type: 'geometric',
    pattern: 'circles'
  },
  {
    id: 'squares',
    name: 'Quadrados',
    type: 'geometric',
    pattern: 'squares'
  },
  {
    id: 'pixels',
    name: 'Pixels',
    type: 'pixels',
    pattern: 'pixels'
  }
];

const profilePhotos = [
  'https://images.unsplash.com/photo-1472099645785-5658abf4ff4e?w=150&h=150&fit=crop&crop=face',
  'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=150&h=150&fit=crop&crop=face',
  'https://images.unsplash.com/photo-1500648767791-00dcc994a43e?w=150&h=150&fit=crop&crop=face',
  'https://images.unsplash.com/photo-1519244703995-f4e0f30006d5?w=150&h=150&fit=crop&crop=face'
];

export default function ResumeViewer({ resume, isDarkTheme = false, isEditing = false, onFieldChange }: ResumeViewerProps) {
  const { personalInfo, experiences, education, skills, projects } = resume;
  const containerRef = useRef<HTMLDivElement>(null);
  const [marginBottom, setMarginBottom] = useState(0);
  
  // Estados locais para edição
  const [localResume, setLocalResume] = useState<Resume>(resume);
  const [selectedTheme, setSelectedTheme] = useState<Theme>(themes[0]);
  const [selectedWallpaper, setSelectedWallpaper] = useState<Wallpaper>(() => {
    // Inicializar com o wallpaper salvo ou o primeiro disponível
    const savedWallpaperId = resume.selectedWallpaper;
    if (savedWallpaperId) {
      const savedWallpaper = wallpapers.find(w => w.id === savedWallpaperId);
      return savedWallpaper || wallpapers[0];
    }
    return wallpapers[0];
  });
  const [profilePhoto, setProfilePhoto] = useState<string>(resume.profilePhoto || '');
  const [showThemePalette, setShowThemePalette] = useState(false);
  const [showWallpaperSelector, setShowWallpaperSelector] = useState(false);
  const [showProfileSelector, setShowProfileSelector] = useState(false);
  const [isInitialized, setIsInitialized] = useState(false);
  const [currentScale, setCurrentScale] = useState(1); // Escala controlada por estado

  // Sincronizar com prop quando não estiver editando
  useEffect(() => {
    if (!isEditing) {
      setLocalResume(resume);
      
      // Sincronizar wallpaper selecionado
      const savedWallpaperId = resume.selectedWallpaper;
      if (savedWallpaperId) {
        const savedWallpaper = wallpapers.find(w => w.id === savedWallpaperId);
        if (savedWallpaper) {
          setSelectedWallpaper(savedWallpaper);
        }
      }
      
      // Sincronizar foto de perfil
      if (resume.profilePhoto) {
        setProfilePhoto(resume.profilePhoto);
      }
    }
  }, [resume, isEditing]);

  // Inicialização e cálculo de escala inicial
  useEffect(() => {
    function initializeScale() {
      const scale = getScale();
      setCurrentScale(scale);
      setIsInitialized(true);
    }
    
    // Inicializar imediatamente
    initializeScale();
    
    // E também em resize
    const handleResize = () => {
      const newScale = getScale();
      setCurrentScale(newScale);
    };
    
    window.addEventListener('resize', handleResize);
    window.addEventListener('orientationchange', handleResize);
    
    return () => {
      window.removeEventListener('resize', handleResize);
      window.removeEventListener('orientationchange', handleResize);
    };
  }, []);

  /**
   * Calcula o fator de escala baseado na largura da viewport
   * Breakpoints correspondentes aos definidos no CSS do debug panel
   */
  function getScale(): number {
    if (typeof window === 'undefined') return 1;
    
    const width = window.innerWidth;
    
    // Escala adaptada para telas estreitas
    if (width <= 420) return 0.45;
    if (width <= 520) return 0.52;
    if (width <= 639) return 0.6;
    if (width <= 767) return 0.7;
    if (width <= 899) return 0.8;
    if (width <= 1023) return 0.9;
    return 1;
  }

  /**
   * Calcula e aplica margin-bottom negativo para compensar 
   * o espaço extra deixado pelo transform: scale()
   */
  useIsomorphicLayoutEffect(() => {
    // Aguardar inicialização para evitar cálculos com DOM incompleto
    if (!isInitialized || !containerRef.current) return;
    
    let timeoutIds: any[] = [];
    let isActive = true;
    
    function updateMargin() {
      if (!isActive || !containerRef.current) return;
      
      const realHeight = containerRef.current.offsetHeight;
      
      // Aguardar se o elemento ainda não tem altura real
      if (realHeight === 0) {
        if (isActive) {
          timeoutIds.push(setTimeout(updateMargin, 50));
        }
        return;
      }
      
      const scaledHeight = realHeight * currentScale;
      const marginCompensation = -(realHeight - scaledHeight);
      
      if (isActive) {
        setMarginBottom(marginCompensation);
      }
    }

    // Calcular imediatamente e com retry se necessário
    updateMargin();
    
    timeoutIds.push(
      setTimeout(() => isActive && updateMargin(), 16),
      setTimeout(() => isActive && updateMargin(), 100)
    );
    
    return () => {
      isActive = false;
      timeoutIds.forEach(id => clearTimeout(id as any));
    };
  }, [currentScale, isInitialized, localResume, isEditing]);

  const handleFieldUpdate = (section: string, field: string, value: any) => {
    console.log('ResumeViewer handleFieldUpdate chamado:', { section, field, value });
    const updatedResume = { ...localResume };
    
    if (section === 'personalInfo') {
      updatedResume.personalInfo = { ...updatedResume.personalInfo, [field]: value };
    } else if (section === 'experiences') {
      // Suporte à edição de experiências
      const [index, subfield] = field.split('.');
      const idx = parseInt(index);
      
      if (!isNaN(idx) && idx >= 0 && idx < updatedResume.experiences.length) {
        if (subfield === 'technologies') {
          // Caso especial para o array de tecnologias
          if (Array.isArray(value)) {
            // Quando recebemos diretamente um array (para adicionar/remover)
            updatedResume.experiences[idx].technologies = value;
          } else {
            // Caso tradicional de string separada por vírgula
            updatedResume.experiences[idx].technologies = value.split(',').map((t: string) => t.trim());
          }
        } else {
          updatedResume.experiences[idx] = { 
            ...updatedResume.experiences[idx], 
            [subfield]: value 
          };
        }
      }
    } else if (section === 'education') {
      // Suporte à edição de educação
      const [index, subfield] = field.split('.');
      const idx = parseInt(index);
      
      if (!isNaN(idx) && idx >= 0 && idx < updatedResume.education.length) {
        updatedResume.education[idx] = { 
          ...updatedResume.education[idx], 
          [subfield]: value 
        };
      }
    } else if (section === 'skills') {
      // Suporte à edição de habilidades
      const [categoryIndex, itemIndex] = field.split('.');
      const catIdx = parseInt(categoryIndex);
      const itemIdx = parseInt(itemIndex);
      
      if (!isNaN(catIdx) && catIdx >= 0 && catIdx < updatedResume.skills.length) {
        if (itemIndex === 'items') {
          // Atualização do array de items completo
          updatedResume.skills[catIdx].items = value;
        } else if (itemIdx === -1) {
          // Edição do nome da categoria
          updatedResume.skills[catIdx].category = value;
        } else if (!isNaN(itemIdx) && itemIdx >= 0 && itemIdx < updatedResume.skills[catIdx].items.length) {
          // Edição de um item específico
          const newItems = [...updatedResume.skills[catIdx].items];
          newItems[itemIdx] = value;
          updatedResume.skills[catIdx].items = newItems;
        }
      }
    } else if (section === 'projects') {
      // Suporte à edição de projetos
      const [index, subfield] = field.split('.');
      const idx = parseInt(index);
      
      if (!isNaN(idx) && idx >= 0 && idx < updatedResume.projects.length) {
        if (subfield === 'technologies') {
          // Caso especial para o array de tecnologias
          if (Array.isArray(value)) {
            // Quando recebemos diretamente um array (para adicionar/remover)
            updatedResume.projects[idx].technologies = value;
          } else {
            // Caso tradicional de string separada por vírgula
            updatedResume.projects[idx].technologies = value.split(',').map((t: string) => t.trim());
          }
        } else {
          updatedResume.projects[idx] = { 
            ...updatedResume.projects[idx], 
            [subfield]: value 
          };
        }
      }
    }
    
    setLocalResume(updatedResume);
    console.log('ResumeViewer chamando onFieldChange com:', updatedResume);
    onFieldChange?.(updatedResume);
  };

  const handleProfilePhotoUpload = (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    if (file) {
      const reader = new FileReader();
              reader.onload = (e) => {
          const photoData = e.target?.result as string;
          setProfilePhoto(photoData);
          
          // Atualizar o currículo com a foto de perfil carregada
          const updatedResume = {
            ...localResume,
            profilePhoto: photoData
          };
          setLocalResume(updatedResume);
          onFieldChange?.(updatedResume);
        };
      reader.readAsDataURL(file);
    }
  };

  const currentData = isEditing ? localResume : resume;

  const getWallpaperStyle = () => {
    if (selectedWallpaper.id === 'none') return {};
    
    // Para pontos simples - usar imagem base64 para compatibilidade com PDF
    if (selectedWallpaper.id === 'dots') {
      return {
        backgroundImage: 'url("data:image/svg+xml;base64,PHN2ZyB3aWR0aD0iNDAiIGhlaWdodD0iNDAiIHZpZXdCb3g9IjAgMCA0MCA0MCIgeG1sbnM9Imh0dHA6Ly93d3cudzMub3JnLzIwMDAvc3ZnIj48Y2lyY2xlIGN4PSIyMCIgY3k9IjIwIiByPSIyIiBmaWxsPSIjZmYwMDAwIiBvcGFjaXR5PSIwLjgiLz48L3N2Zz4=")',
        backgroundSize: '40px 40px',
        backgroundRepeat: 'repeat'
      };
    }
    
    // Para grade simples - usar imagem base64 para compatibilidade com PDF
    if (selectedWallpaper.id === 'grid') {
      return {
        backgroundImage: 'url("data:image/svg+xml;base64,PHN2ZyB3aWR0aD0iNTAiIGhlaWdodD0iNTAiIHZpZXdCb3g9IjAgMCA1MCA1MCIgeG1sbnM9Imh0dHA6Ly93d3cudzMub3JnLzIwMDAvc3ZnIj48cGF0aCBkPSJNMCAwaDUwdjNIMHpNMCAwdjUwaDNIMHoiIGZpbGw9IiMwMGZmMDAiIG9wYWNpdHk9IjAuNiIvPjwvc3ZnPg==")',
        backgroundSize: '50px 50px',
        backgroundRepeat: 'repeat'
      };
    }
    
    // Para círculos - usar imagem base64 para compatibilidade com PDF
    if (selectedWallpaper.id === 'circles') {
      return {
        backgroundImage: 'url("data:image/svg+xml;base64,PHN2ZyB3aWR0aD0iNjAiIGhlaWdodD0iNjAiIHZpZXdCb3g9IjAgMCA2MCA2MCIgeG1sbnM9Imh0dHA6Ly93d3cudzMub3JnLzIwMDAvc3ZnIj48Y2lyY2xlIGN4PSIzMCIgY3k9IjMwIiByPSI2IiBmaWxsPSJub25lIiBzdHJva2U9IiMwMDAwZmYiIHN0cm9rZS13aWR0aD0iMiIgb3BhY2l0eT0iMC43Ii8+PC9zdmc+")',
        backgroundSize: '60px 60px',
        backgroundRepeat: 'repeat'
      };
    }
    
    // Para quadrados - usar imagem base64 para compatibilidade com PDF
    if (selectedWallpaper.id === 'squares') {
      return {
        backgroundImage: 'url("data:image/svg+xml;base64,PHN2ZyB3aWR0aD0iNDAiIGhlaWdodD0iNDAiIHZpZXdCb3g9IjAgMCA0MCA0MCIgeG1sbnM9Imh0dHA6Ly93d3cudzMub3JnLzIwMDAvc3ZnIj48cmVjdCB4PSIxMCIgeT0iMTAiIHdpZHRoPSIyMCIgaGVpZ2h0PSIyMCIgZmlsbD0ibm9uZSIgc3Ryb2tlPSIjZmY2NjAwIiBzdHJva2Utd2lkdGg9IjIiIG9wYWNpdHk9IjAuOCIvPjwvc3ZnPg==")',
        backgroundSize: '40px 40px',
        backgroundRepeat: 'repeat'
      };
    }
    
    // Para pixels - usar imagem base64 para compatibilidade com PDF
    if (selectedWallpaper.id === 'pixels') {
      return {
        backgroundImage: 'url("data:image/svg+xml;base64,PHN2ZyB3aWR0aD0iMTIwIiBoZWlnaHQ9IjEyMCIgdmlld0JveD0iMCAwIDEyMCAxMjAiIHhtbG5zPSJodHRwOi8vd3d3LnczLm9yZy8yMDAwL3N2ZyI+PHJlY3QgeD0iMCIgeT0iMCIgd2lkdGg9IjEyMCIgaGVpZ2h0PSIxMjAiIGZpbGw9InRyYW5zcGFyZW50Ii8+PHJlY3QgeD0iMTAiIHk9IjEwIiB3aWR0aD0iNCIgaGVpZ2h0PSI0IiBmaWxsPSIjZGRkZGRkIiBvcGFjaXR5PSIwLjYiLz48cmVjdCB4PSIyMCIgeT0iMjAiIHdpZHRoPSI0IiBoZWlnaHQ9IjQiIGZpbGw9IiNhZGQ4ZmYiIG9wYWNpdHk9IjAuNyIvPjxyZWN0IHg9IjMwIiB5PSIzMCIgd2lkdGg9IjQiIGhlaWdodD0iNCIgZmlsbD0iI2RkZGRkZCIgb3BhY2l0eT0iMC42Ii8+PHJlY3QgeD0iODAiIHk9IjgwIiB3aWR0aD0iNCIgaGVpZ2h0PSI0IiBmaWxsPSIjYWRkOGZmIiBvcGFjaXR5PSIwLjciLz48cmVjdCB4PSI5MCIgeT0iOTAiIHdpZHRoPSI0IiBoZWlnaHQ9IjQiIGZpbGw9IiNkZGRkZGQiIG9wYWNpdHk9IjAuNiIvPjxyZWN0IHg9IjEwMCIgeT0iMTAwIiB3aWR0aD0iNCIgaGVpZ2h0PSI0IiBmaWxsPSIjYWRkOGZmIiBvcGFjaXR5PSIwLjciLz48cmVjdCB4PSIxMCIgeT0iMTAwIiB3aWR0aD0iNCIgaGVpZ2h0PSI0IiBmaWxsPSIjZGRkZGRkIiBvcGFjaXR5PSIwLjYiLz48cmVjdCB4PSIyMCIgeT0iMTEwIiB3aWR0aD0iNCIgaGVpZ2h0PSI0IiBmaWxsPSIjYWRkOGZmIiBvcGFjaXR5PSIwLjciLz48cmVjdCB4PSIxMDAiIHk9IjEwIiB3aWR0aD0iNCIgaGVpZ2h0PSI0IiBmaWxsPSIjZGRkZGRkIiBvcGFjaXR5PSIwLjYiLz48cmVjdCB4PSIxMTAiIHk9IjIwIiB3aWR0aD0iNCIgaGVpZ2h0PSI0IiBmaWxsPSIjYWRkOGZmIiBvcGFjaXR5PSIwLjciLz48L3N2Zz4=")',
        backgroundSize: '120px 120px',
        backgroundRepeat: 'repeat'
      };
    }
    
    return {};
  };

  // Renderiza a seção de experiências com suporte à edição completa
  const renderExperiences = () => {
    return currentData.experiences.map((exp, index) => (
      <div key={index} className="border-l-4 pl-6" style={{ borderColor: selectedTheme.colors.accent }}>
        <div className="flex justify-between items-start mb-2">
          <div>
            <EditableField
              value={exp.position}
              onSave={(value) => handleFieldUpdate('experiences', `${index}.position`, value)}
              isEditing={isEditing}
              isDarkTheme={isDarkTheme}
              className={`text-xl font-semibold ${isDarkTheme ? 'text-white print:text-gray-900' : 'text-gray-900'}`}
              placeholder="Cargo/Posição"
            />
            <EditableField
              value={exp.company}
              onSave={(value) => handleFieldUpdate('experiences', `${index}.company`, value)}
              isEditing={isEditing}
              isDarkTheme={isDarkTheme}
              className="text-lg"
              placeholder="Nome da Empresa"
              style={{ color: selectedTheme.colors.primary }}
            />
            <EditableField
              value={exp.location}
              onSave={(value) => handleFieldUpdate('experiences', `${index}.location`, value)}
              isEditing={isEditing}
              isDarkTheme={isDarkTheme}
              className={`text-sm ${isDarkTheme ? 'text-gray-400 print:text-gray-600' : 'text-gray-600'}`}
              placeholder="Localização"
            />
          </div>
          <div className="flex space-x-2">
            <EditableField
              value={exp.startDate}
              onSave={(value) => handleFieldUpdate('experiences', `${index}.startDate`, value)}
              isEditing={isEditing}
              isDarkTheme={isDarkTheme}
              type="date"
              className={`text-sm font-medium ${isDarkTheme ? 'text-gray-400 print:text-gray-600' : 'text-gray-600'}`}
              placeholder="AAAA-MM"
            />
            <span className={`text-sm font-medium ${isDarkTheme ? 'text-gray-400 print:text-gray-600' : 'text-gray-600'}`}>
              -
            </span>
            <EditableField
              value={exp.endDate || ''}
              onSave={(value) => handleFieldUpdate('experiences', `${index}.endDate`, value || undefined)}
              isEditing={isEditing}
              isDarkTheme={isDarkTheme}
              type="date"
              className={`text-sm font-medium ${isDarkTheme ? 'text-gray-400 print:text-gray-600' : 'text-gray-600'}`}
              placeholder="AAAA-MM ou atual"
            />
          </div>
        </div>
        <EditableField
          value={exp.description}
          onSave={(value) => handleFieldUpdate('experiences', `${index}.description`, value)}
          isEditing={isEditing}
          isDarkTheme={isDarkTheme}
          type="textarea"
          className={`text-justify mb-3 leading-relaxed ${isDarkTheme ? 'text-gray-300 print:text-gray-700' : 'text-gray-700'}`}
          placeholder="Descrição das atividades e responsabilidades"
        />
        <div className="flex flex-wrap gap-2">
          {exp.technologies.map((tech, techIndex) => (
            <div key={techIndex} className="flex items-center group relative">
              <EditableField
                key={techIndex}
                value={tech}
                onSave={(value) => {
                  const updatedTechnologies = [...exp.technologies];
                  updatedTechnologies[techIndex] = value;
                  handleFieldUpdate('experiences', `${index}.technologies`, updatedTechnologies);
                }}
                isEditing={isEditing}
                isDarkTheme={isDarkTheme}
                className={`px-3 py-1 text-xs font-medium rounded-full overflow-hidden whitespace-normal break-words max-w-full ${
                  isDarkTheme ? 'text-white print:text-black' : 'text-black'
                }`}
                style={{ 
                  backgroundColor: selectedTheme.colors.background,
                  color: selectedTheme.colors.secondary,
                  padding: '0.35rem 0.75rem',
                  lineHeight: '1.2'
                }}
                placeholder={`Tecnologia ${techIndex + 1}`}
              />
              {isEditing && (
                <button
                  onClick={() => {
                    const updatedTechnologies = [...exp.technologies];
                    updatedTechnologies.splice(techIndex, 1);
                    handleFieldUpdate('experiences', `${index}.technologies`, updatedTechnologies);
                  }}
                  className="absolute -right-2 -top-2 bg-red-500 text-white rounded-full w-5 h-5 flex items-center justify-center text-xs hover:bg-red-700 opacity-0 group-hover:opacity-100 transition-opacity"
                  title="Remover tecnologia"
                >
                  ×
                </button>
              )}
            </div>
          ))}
          {isEditing && (
            <button 
              onClick={() => {
                const updatedTechnologies = [...exp.technologies, "Nova Tecnologia"];
                handleFieldUpdate('experiences', `${index}.technologies`, updatedTechnologies);
              }}
              className={`px-3 py-1 text-xs font-medium rounded-full ${
                isDarkTheme ? 'bg-gray-700 text-white' : 'bg-gray-200 text-gray-700'
              }`}
            >
              + Adicionar
            </button>
          )}
        </div>
      </div>
    ));
  };

  // Renderiza a seção de educação com suporte à edição completa
  const renderEducation = () => {
    return currentData.education.map((edu, index) => (
      <div key={index} className="border-l-4 pl-6" style={{ borderColor: selectedTheme.colors.accent }}>
        <div className="flex justify-between items-start mb-2">
          <div>
            <EditableField
              value={edu.degree}
              onSave={(value) => handleFieldUpdate('education', `${index}.degree`, value)}
              isEditing={isEditing}
              isDarkTheme={isDarkTheme}
              className={`text-xl font-semibold ${isDarkTheme ? 'text-white print:text-gray-900' : 'text-gray-900'}`}
              placeholder="Grau/Título"
            />
            <EditableField
              value={edu.institution}
              onSave={(value) => handleFieldUpdate('education', `${index}.institution`, value)}
              isEditing={isEditing}
              isDarkTheme={isDarkTheme}
              className="text-lg"
              placeholder="Instituição"
              style={{ color: selectedTheme.colors.primary }}
            />
            <EditableField
              value={edu.fieldOfStudy}
              onSave={(value) => handleFieldUpdate('education', `${index}.fieldOfStudy`, value)}
              isEditing={isEditing}
              isDarkTheme={isDarkTheme}
              className={`text-sm ${isDarkTheme ? 'text-gray-400 print:text-gray-600' : 'text-gray-600'}`}
              placeholder="Área de Estudo"
            />
            {edu.gpa && (
              <EditableField
                value={edu.gpa}
                onSave={(value) => handleFieldUpdate('education', `${index}.gpa`, value)}
                isEditing={isEditing}
                isDarkTheme={isDarkTheme}
                className={`text-sm ${isDarkTheme ? 'text-gray-400 print:text-gray-600' : 'text-gray-600'}`}
                placeholder="CRA/Nota"
              />
            )}
          </div>
          <div className="flex space-x-2">
            <EditableField
              value={edu.startDate}
              onSave={(value) => handleFieldUpdate('education', `${index}.startDate`, value)}
              isEditing={isEditing}
              isDarkTheme={isDarkTheme}
              type="date"
              className={`text-sm font-medium ${isDarkTheme ? 'text-gray-400 print:text-gray-600' : 'text-gray-600'}`}
              placeholder="AAAA-MM"
            />
            <span className={`text-sm font-medium ${isDarkTheme ? 'text-gray-400 print:text-gray-600' : 'text-gray-600'}`}>
              -
            </span>
            <EditableField
              value={edu.endDate || ''}
              onSave={(value) => handleFieldUpdate('education', `${index}.endDate`, value || undefined)}
              isEditing={isEditing}
              isDarkTheme={isDarkTheme}
              type="date"
              className={`text-sm font-medium ${isDarkTheme ? 'text-gray-400 print:text-gray-600' : 'text-gray-600'}`}
              placeholder="AAAA-MM ou atual"
            />
          </div>
        </div>
        {(edu.description || isEditing) && (
          <EditableField
            value={edu.description || ''}
            onSave={(value) => handleFieldUpdate('education', `${index}.description`, value || undefined)}
            isEditing={isEditing}
            isDarkTheme={isDarkTheme}
            type="textarea"
            className={`text-justify leading-relaxed ${isDarkTheme ? 'text-gray-300 print:text-gray-700' : 'text-gray-700'}`}
            placeholder="Descrição do curso e atividades"
          />
        )}
      </div>
    ));
  };

  // Renderiza a seção de habilidades com suporte à edição completa
  const renderSkills = () => {
    return currentData.skills.map((skillGroup, index) => (
      <div key={index}>
        <EditableField
          value={skillGroup.category}
          onSave={(value) => handleFieldUpdate('skills', `${index}.-1`, value)}
          isEditing={isEditing}
          isDarkTheme={isDarkTheme}
          className={`text-lg font-semibold mb-3 ${isDarkTheme ? 'text-white print:text-gray-900' : 'text-gray-900'}`}
          placeholder="Nome da Categoria"
        />
        <div className="flex flex-wrap gap-2">
          {skillGroup.items.map((skill, skillIndex) => (
            <div key={skillIndex} className="flex items-center group relative">
              <EditableField
                value={skill}
                onSave={(value) => handleFieldUpdate('skills', `${index}.${skillIndex}`, value)}
                isEditing={isEditing}
                isDarkTheme={isDarkTheme}
                className={`px-3 py-1 text-sm font-medium rounded-full overflow-hidden whitespace-normal break-words max-w-full ${
                  isDarkTheme ? 'bg-gray-600 text-white print:text-gray-800' : 'text-gray-800'
                }`}
                style={{ 
                  backgroundColor: selectedTheme.colors.background,
                  color: selectedTheme.colors.secondary,
                  padding: '0.35rem 0.75rem',
                  lineHeight: '1.2',
                  display: 'inline-block',
                  verticalAlign: 'middle',
                  textAlign: 'center'
                }}
                placeholder={`Habilidade ${skillIndex + 1}`}
              />
              {isEditing && (
                <button
                  onClick={() => {
                    const updatedItems = [...skillGroup.items];
                    updatedItems.splice(skillIndex, 1);
                    handleFieldUpdate('skills', `${index}.items`, updatedItems);
                  }}
                  className="absolute -right-2 -top-2 bg-red-500 text-white rounded-full w-5 h-5 flex items-center justify-center text-xs hover:bg-red-700 opacity-0 group-hover:opacity-100 transition-opacity"
                  title="Remover habilidade"
                >
                  ×
                </button>
              )}
            </div>
          ))}
          {isEditing && (
            <button 
              onClick={() => {
                const updatedItems = [...skillGroup.items, "Nova Habilidade"];
                const updatedSkills = [...currentData.skills];
                updatedSkills[index] = {
                  ...updatedSkills[index],
                  items: updatedItems
                };
                handleFieldUpdate('skills', `${index}.items`, updatedItems);
              }}
              className={`px-3 py-1 text-xs font-medium rounded-full ${
                isDarkTheme ? 'bg-gray-700 text-white' : 'bg-gray-200 text-gray-700'
              }`}
            >
              + Adicionar
            </button>
          )}
        </div>
      </div>
    ));
  };

  // Renderiza a seção de projetos com suporte à edição completa
  const renderProjects = () => {
    return currentData.projects.map((project, index) => (
      <div key={index} className="border-l-4 pl-6" style={{ borderColor: selectedTheme.colors.accent }}>
        <div className="flex justify-between items-start mb-2">
          <EditableField
            value={project.name}
            onSave={(value) => handleFieldUpdate('projects', `${index}.name`, value)}
            isEditing={isEditing}
            isDarkTheme={isDarkTheme}
            className={`text-xl font-semibold ${isDarkTheme ? 'text-white print:text-gray-900' : 'text-gray-900'}`}
            placeholder="Nome do Projeto"
          />
          <div className="flex space-x-2">
            {isEditing ? (
              <>
                <EditableField
                  value={project.githubUrl || ''}
                  onSave={(value) => handleFieldUpdate('projects', `${index}.githubUrl`, value || undefined)}
                  isEditing={isEditing}
                  isDarkTheme={isDarkTheme}
                  className="p-1 rounded transition-colors"
                  placeholder="URL do GitHub"
                />
              </>
            ) : (
              <>
                {project.githubUrl && (
                  <a
                    href={project.githubUrl}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="flex items-center space-x-2 p-1 rounded transition-colors"
                    style={{ color: selectedTheme.colors.primary }}
                  >
                    <Github size={16} />
                    <span className="text-sm hover:underline">{project.githubUrl.replace('https://github.com/', '')}</span>
                  </a>
                )}
              </>
            )}
          </div>
        </div>
        <EditableField
          value={project.description}
          onSave={(value) => handleFieldUpdate('projects', `${index}.description`, value)}
          isEditing={isEditing}
          isDarkTheme={isDarkTheme}
          type="textarea"
          className={`text-justify mb-3 leading-relaxed ${isDarkTheme ? 'text-gray-300 print:text-gray-700' : 'text-gray-700'}`}
          placeholder="Descrição do projeto"
        />
        <div className="flex flex-wrap gap-2">
          {project.technologies.map((tech, techIndex) => (
            <div key={techIndex} className="flex items-center group relative">
              <EditableField
                key={techIndex}
                value={tech}
                onSave={(value) => {
                  const updatedTechnologies = [...project.technologies];
                  updatedTechnologies[techIndex] = value;
                  handleFieldUpdate('projects', `${index}.technologies`, updatedTechnologies);
                }}
                isEditing={isEditing}
                isDarkTheme={isDarkTheme}
                className={`px-3 py-1 text-xs font-medium rounded-full overflow-hidden whitespace-normal break-words max-w-full ${
                  isDarkTheme ? 'text-white print:text-black' : 'text-black'
                }`}
                style={{ 
                  backgroundColor: selectedTheme.colors.background,
                  color: selectedTheme.colors.secondary,
                  padding: '0.35rem 0.75rem',
                  lineHeight: '1.2'
                }}
                placeholder={`Tecnologia ${techIndex + 1}`}
              />
              {isEditing && (
                <button
                  onClick={() => {
                    const updatedTechnologies = [...project.technologies];
                    updatedTechnologies.splice(techIndex, 1);
                    handleFieldUpdate('projects', `${index}.technologies`, updatedTechnologies);
                  }}
                  className="absolute -right-2 -top-2 bg-red-500 text-white rounded-full w-5 h-5 flex items-center justify-center text-xs hover:bg-red-700 opacity-0 group-hover:opacity-100 transition-opacity"
                  title="Remover tecnologia"
                >
                  ×
                </button>
              )}
            </div>
          ))}
          {isEditing && (
            <button 
              onClick={() => {
                const updatedTechnologies = [...project.technologies, "Nova Tecnologia"];
                handleFieldUpdate('projects', `${index}.technologies`, updatedTechnologies);
              }}
              className={`px-3 py-1 text-xs font-medium rounded-full ${
                isDarkTheme ? 'bg-gray-700 text-white' : 'bg-gray-200 text-gray-700'
              }`}
            >
              + Adicionar
            </button>
          )}
        </div>
      </div>
    ));
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
                    <img src={profilePhoto} alt="Profile" className="w-full h-full object-cover object-center scale-110" />
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
                        className="w-12 h-12 rounded-full object-cover object-center scale-110 cursor-pointer hover:ring-2 hover:ring-blue-500 transition-all"
                        onClick={() => {
                          setProfilePhoto(photo);
                          setShowProfileSelector(false);
                          
                          // Atualizar o currículo com a foto de perfil selecionada
                          const updatedResume = {
                            ...localResume,
                            profilePhoto: photo
                          };
                          setLocalResume(updatedResume);
                          onFieldChange?.(updatedResume);
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
                        onFieldChange?.(localResume);
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
                          
                          // Atualizar o currículo com o wallpaper selecionado
                          const updatedResume = {
                            ...localResume,
                            selectedWallpaper: wallpaper.id
                          };
                          setLocalResume(updatedResume);
                          onFieldChange?.(updatedResume);
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

      {/* Container com ajuste automático de altura */}
      <div 
        className="w-full flex flex-col relative" 
        style={{ 
          height: `calc(100% * ${currentScale})`,
          minHeight: `calc(594mm * ${currentScale})`,
          overflow: 'hidden'
        }}
      >
        {/* Currículo */}
        <div
          className="resume-container resume-viewer"
          style={{
            transform: `scale(${currentScale})`,
            transformOrigin: "top center",
            marginBottom: `${marginBottom}px`,
            transition: "transform 0.3s ease-in-out, margin-bottom 0.3s ease-in-out",
            width: "210mm",  // Largura exata A4
            maxWidth: "100%",
            margin: "0 auto"
          }}
          ref={containerRef}
        >
          <div className={`space-y-${isEditing ? 40 : 4} transition-all duration-300`}>
            {/* Primeira Página */}
            <div 
              className={`resume-paper min-h-[297mm] p-8 mx-auto print:shadow-none print:min-h-[297mm] relative ${
                isDarkTheme 
                  ? 'text-white border-gray-700 print:bg-white print:text-black print:border-gray-200 shadow-[0_4px_30px_rgba(200,200,255,0.15)]' 
                  : 'text-gray-900 border-gray-200 shadow-2xl'
              }`}
              style={{
                backgroundColor: selectedWallpaper.id === 'none' 
                  ? (isDarkTheme ? '#111827' : '#ffffff') 
                  : (isDarkTheme ? '#1f2937' : '#f9fafb'),
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
              <div className="absolute top-8 left-8 w-36 h-36 rounded-full overflow-hidden bg-gray-200 flex items-center justify-center border-4" 
                   style={{ borderColor: selectedTheme.colors.primary }}>
                {profilePhoto ? (
                  <img src={profilePhoto} alt="Profile" className="w-full h-full object-cover object-center scale-110" />
                ) : (
                  <User size={48} className="text-gray-400" />
                )}
              </div>

              {/* Cabeçalho */}
              <header className="mb-8 text-center border-b-2 pb-6 ml-40" style={{ borderColor: selectedTheme.colors.border }}>
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
                    <Mail size={16} className="flex-shrink-0 translate-y-[0px] inline-block align-middle" style={{ color: selectedTheme.colors.primary }} />
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
                    <Phone size={16} className="flex-shrink-0 translate-y-[0px] inline-block align-middle" style={{ color: selectedTheme.colors.primary }} />
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
                    <MapPin size={16} className="flex-shrink-0 translate-y-[0px] inline-block align-middle" style={{ color: selectedTheme.colors.primary }} />
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
                    <div className="flex items-center gap-2">
                      <span className="inline-flex items-center px-2 py-1 rounded-full text-xs font-medium bg-blue-100 text-blue-800 border border-blue-200">
                        Acesse Agora
                      </span>
                      <EditableField
                        value={currentData.personalInfo.githubUrl.replace('Acesse Agora ', '')}
                        onSave={(value) => handleFieldUpdate('personalInfo', 'githubUrl', `Acesse Agora ${value}`)}
                        isEditing={isEditing}
                        isDarkTheme={isDarkTheme}
                        className={isDarkTheme ? 'text-gray-300 print:text-gray-700' : 'text-gray-700'}
                        placeholder="https://seu-site.com"
                      />
                    </div>
                    <MousePointer size={16} className="flex-shrink-0 translate-y-[0px] inline-block align-middle" style={{ color: selectedTheme.colors.primary }} />
                  </div>
                </div>
                
                <div className="flex flex-wrap justify-center items-center gap-4 mt-4">
                  <div className="flex items-center gap-2">
                    <DollarSign size={16} className="flex-shrink-0 translate-y-[0px] inline-block align-middle" style={{ color: selectedTheme.colors.primary }} />
                    <EditableField
                      value={currentData.personalInfo.salary || ''}
                      onSave={(value) => handleFieldUpdate('personalInfo', 'salary', value || undefined)}
                      isEditing={isEditing}
                      isDarkTheme={isDarkTheme}
                      className={`${isDarkTheme ? 'text-gray-300 print:text-gray-700' : 'text-gray-700'}`}
                      placeholder="Expectativa Salarial"
                    />
                  </div>
                  <div className="flex items-center gap-2">
                    <CheckCircle 
                      size={16} 
                      className="flex-shrink-0 translate-y-[0px] inline-block align-middle"
                      style={{ 
                        color: currentData.personalInfo.acceptingOffers 
                          ? selectedTheme.colors.primary 
                          : isDarkTheme ? '#4B5563' : '#9CA3AF'
                      }} 
                    />
                    <div className="flex items-center gap-2">
                      <span className={`text-sm ${isDarkTheme ? 'text-gray-300 print:text-gray-700' : 'text-gray-700'}`}>
                        Aceito Propostas
                      </span>
                      <div className="flex items-center gap-3">
                        <div className="flex items-center gap-1">
                          <input 
                            type="radio" 
                            id="acceptYes" 
                            name="acceptingOffers" 
                            checked={!!currentData.personalInfo.acceptingOffers}
                            onChange={isEditing ? () => handleFieldUpdate('personalInfo', 'acceptingOffers', true) : undefined}
                            disabled={!isEditing}
                            className={`h-4 w-4 ${isEditing ? 'cursor-pointer' : 'cursor-default opacity-60'}`}
                            style={{ 
                              accentColor: selectedTheme.colors.primary,
                              '--tw-accent-color': selectedTheme.colors.primary
                            } as React.CSSProperties}
                          />
                          <label htmlFor="acceptYes" className={`text-sm ${isEditing ? 'cursor-pointer' : 'cursor-default'} ${isDarkTheme ? 'text-gray-300' : 'text-gray-700'}`}>
                            Sim
                          </label>
                        </div>
                        <div className="flex items-center gap-1">
                          <input 
                            type="radio" 
                            id="acceptNo" 
                            name="acceptingOffers" 
                            checked={!currentData.personalInfo.acceptingOffers}
                            onChange={isEditing ? () => handleFieldUpdate('personalInfo', 'acceptingOffers', false) : undefined}
                            disabled={!isEditing}
                            className={`h-4 w-4 ${isEditing ? 'cursor-pointer' : 'cursor-default opacity-60'}`}
                            style={{ 
                              accentColor: selectedTheme.colors.primary,
                              '--tw-accent-color': selectedTheme.colors.primary
                            } as React.CSSProperties}
                          />
                          <label htmlFor="acceptNo" className={`text-sm ${isEditing ? 'cursor-pointer' : 'cursor-default'} ${isDarkTheme ? 'text-gray-300' : 'text-gray-700'}`}>
                            Não
                          </label>
                        </div>
                      </div>
                    </div>
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
                  {renderExperiences()}
                </div>
              </section>
            </div>

            {/* Segunda Página */}
            <div 
              className={`resume-paper min-h-[297mm] p-8 mx-auto print:shadow-none print:break-before-page print:min-h-[297mm] relative ${
                isDarkTheme 
                  ? 'bg-gray-900 text-white border-gray-700 print:bg-white print:text-black print:border-gray-200 shadow-[0_4px_30px_rgba(200,200,255,0.15)]' 
                  : 'bg-white text-gray-900 border-gray-200 shadow-2xl'
              }`}
              style={getWallpaperStyle()}
            >
              {/* Educação */}
              <section className="mb-8">
                <h2 className={`text-2xl font-bold mb-4 border-b-2 pb-2 ${
                  isDarkTheme ? 'text-white print:text-gray-900' : 'text-gray-900'
                }`} style={{ borderColor: selectedTheme.colors.primary }}>
                  Formação Acadêmica
                </h2>
                <div className="space-y-4">
                  {renderEducation()}
                </div>
              </section>
              
              {/* Habilidades Técnicas */}
              <section className="mb-8">
                <h2 className={`text-2xl font-bold mb-4 border-b-2 pb-2 ${
                  isDarkTheme ? 'text-white print:text-gray-900' : 'text-gray-900'
                }`} style={{ borderColor: selectedTheme.colors.primary }}>
                  Habilidades Técnicas
                </h2>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  {renderSkills()}
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
                  {renderProjects()}
                </div>
              </section>
            </div>
          </div>
        </div>
      </div>
    </>
  );
}