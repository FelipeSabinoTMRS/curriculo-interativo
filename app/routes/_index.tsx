import type { MetaFunction } from "@remix-run/cloudflare";
import { useState } from "react";

import ResumeViewer from "~/components/ResumeViewer";
import TopBar from "~/components/TopBar";
import DebugPanel from "~/components/DebugPanel";
import type { Resume, DatabaseConnection } from "~/types";

export const meta: MetaFunction = () => {
  return [
    { title: "Currículo Desenvolvido do Zero - Felipe Sabino" },
    { name: "description", content: "Sistema de currículo desenvolvido com React Router, TypeScript e Cloudflare" },
  ];
};

// Mock data for development
const mockResume: Resume = {
  personalInfo: {
    name: "Felipe Sabino",
    title: "Desenvolvedor Full Stack",
    email: "felipe@exemplo.com",
    phone: "(11) 99999-9999",
    location: "São Paulo, SP",
    summary: "Desenvolvedor apaixonado por tecnologia com experiência em desenvolvimento full stack. Especializado em TypeScript, React, Node.js e soluções cloud. Sempre em busca de desafios que permitam criar soluções inovadoras e impactantes.",
    githubUrl: "https://github.com/FelipeSabinoTMRS/curriculo-interativo",
  },
  experiences: [
    {
      id: "1",
      company: "Tech Company",
      position: "Desenvolvedor Full Stack Sênior",
      startDate: "2023-01",
      description: "Desenvolvimento de aplicações web utilizando React, TypeScript e Node.js. Implementação de arquiteturas escaláveis e integração com serviços cloud.",
      technologies: ["TypeScript", "React", "Node.js", "Cloudflare", "PostgreSQL"]
    },
    {
      id: "2",
      company: "Startup Inovadora",
      position: "Desenvolvedor Frontend",
      startDate: "2022-01",
      endDate: "2022-12",
      description: "Criação de interfaces modernas e responsivas, focando em UX/UI e performance. Trabalho em equipe ágil com metodologias Scrum.",
      technologies: ["React", "Tailwind CSS", "Next.js", "Vercel"]
    }
  ],
  education: [
    {
      id: "1",
      institution: "Universidade Tecnológica",
      degree: "Bacharelado",
      field: "Ciência da Computação",
      startDate: "2019-01",
      endDate: "2022-12",
      description: "Foco em desenvolvimento de software, algoritmos e estruturas de dados."
    }
  ],
  skills: [
    { id: "1", name: "TypeScript", category: "Linguagens", level: 5 },
    { id: "2", name: "JavaScript", category: "Linguagens", level: 5 },
    { id: "3", name: "React", category: "Frontend", level: 5 },
    { id: "4", name: "Node.js", category: "Backend", level: 4 },
    { id: "5", name: "Tailwind CSS", category: "Frontend", level: 4 },
    { id: "6", name: "PostgreSQL", category: "Banco de Dados", level: 4 },
    { id: "7", name: "Cloudflare", category: "Cloud", level: 4 },
    { id: "8", name: "Git", category: "Ferramentas", level: 5 },
    { id: "9", name: "React Router", category: "Frontend", level: 5 },
    { id: "10", name: "Vite", category: "Ferramentas", level: 4 },
  ],
  projects: [
    {
      id: "1",
      name: "Sistema de Currículo Interativo",
      description: "Aplicação desenvolvida do zero para demonstrar habilidades técnicas aos recrutadores. Utiliza React Router, TypeScript, Cloudflare D1 e R2 com design moderno inspirado em IA.",
      technologies: ["React Router", "TypeScript", "Cloudflare", "Tailwind CSS", "D1", "R2"],
      githubUrl: "https://github.com/FelipeSabinoTMRS/curriculo-interativo"
    }
  ]
};

export default function Index() {
  const [resume, setResume] = useState<Resume>(mockResume);
  const [isEditing, setIsEditing] = useState(false);
  const [isSaving, setIsSaving] = useState(false);
  const [isDarkTheme, setIsDarkTheme] = useState(false);
  
  // Mock connection status
  const [connectionStatus, setConnectionStatus] = useState<DatabaseConnection>({
    connected: false,
    lastCheck: new Date().toISOString(),
    error: "Banco D1 não configurado em ambiente de desenvolvimento"
  });

  const handlePrint = () => {
    // Configurações para garantir impressão sem bordas
    const printStyles = `
      @media print {
        @page { 
          margin: 0 !important;
          padding: 0 !important;
          border: none !important;
          size: A4;
        }
      }
    `;
    
    // Adiciona estilos temporários para impressão
    const styleElement = document.createElement('style');
    styleElement.textContent = printStyles;
    document.head.appendChild(styleElement);
    
    // Chama a impressão diretamente
    setTimeout(() => {
      window.print();
      // Remove os estilos temporários após a impressão
      setTimeout(() => {
        if (styleElement.parentNode) {
          styleElement.parentNode.removeChild(styleElement);
        }
      }, 1000);
    }, 100);
  };

  const handleEdit = () => {
    setIsEditing(!isEditing);
  };

  const handleSave = async () => {
    setIsSaving(true);
    // Simulate save operation
    await new Promise(resolve => setTimeout(resolve, 1500));
    setIsSaving(false);
    alert("Alterações salvas com sucesso! (simulação)");
  };

  const handleRefresh = () => {
    window.location.reload();
  };

  const handleRefreshConnection = async () => {
    // Simulate connection check
    await new Promise(resolve => setTimeout(resolve, 1000));
    setConnectionStatus({
      connected: Math.random() > 0.5, // Random success/failure for demo
      lastCheck: new Date().toISOString(),
      error: Math.random() > 0.5 ? undefined : "Falha na conexão com D1"
    });
  };

  const handleImageUpload = () => {
    alert("Upload de imagens em desenvolvimento! 🚧\n\nEsta funcionalidade será integrada com Cloudflare R2 para armazenamento de imagens.");
  };

  const handleThemeToggle = () => {
    setIsDarkTheme(!isDarkTheme);
  };

  return (
    <div className={`min-h-screen transition-all duration-500 relative overflow-hidden ${isDarkTheme ? 'bg-gray-900' : 'bg-ai-complex animate-gradient-flow'}`}>
      {/* Animated background layers - only show in light theme */}
      {!isDarkTheme && (
        <>
          <div className="absolute inset-0 bg-ai-mesh animate-bg-shift opacity-70"></div>
          <div className="absolute inset-0 bg-gradient-to-br from-transparent via-blue-900/10 to-indigo-900/20"></div>
          
          {/* Floating orbs for extra visual interest */}
          <div className="absolute top-1/4 left-1/4 w-64 h-64 bg-blue-400/10 rounded-full blur-3xl animate-pulse"></div>
          <div className="absolute bottom-1/4 right-1/4 w-96 h-96 bg-indigo-400/10 rounded-full blur-3xl animate-pulse delay-1000"></div>
          <div className="absolute top-3/4 left-3/4 w-48 h-48 bg-cyan-400/10 rounded-full blur-3xl animate-pulse delay-500"></div>
        </>
      )}

      {/* Dark theme background */}
      {isDarkTheme && (
        <div className="absolute inset-0 bg-gradient-to-br from-gray-900 via-gray-800 to-gray-900"></div>
      )}

      {/* Top Bar */}
      <TopBar
        onPrint={handlePrint}
        onEdit={handleEdit}
        onSave={handleSave}
        onImageUpload={handleImageUpload}
        onThemeToggle={handleThemeToggle}
        isEditing={isEditing}
        isSaving={isSaving}
        isDarkTheme={isDarkTheme}
      />

      {/* Content overlay */}
      <div className={`absolute inset-0 transition-all duration-500 ${isDarkTheme ? 'bg-gray-800/20' : 'bg-gray-100/40 backdrop-blur-[1px]'}`}></div>
      
      {/* Debug Panel - Fixed position */}
      <DebugPanel
        connectionStatus={connectionStatus}
        onRefreshConnection={handleRefreshConnection}
        isDarkTheme={isDarkTheme}
      />

      {/* Main container */}
      <div className="relative z-10 container mx-auto px-2 py-0 sm:px-3 sm:py-1 md:px-4 md:py-1 lg:py-2">
        {/* Main layout */}
        <div className="flex justify-center items-start max-w-7xl mx-auto">
          {/* Center - Resume viewer */}
          <div className="w-full max-w-4xl">
            <ResumeViewer resume={resume} isDarkTheme={isDarkTheme} />
          </div>
        </div>
      </div>
    </div>
  );
} 