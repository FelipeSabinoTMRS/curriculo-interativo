import type { MetaFunction } from "@remix-run/cloudflare";
import { useState } from "react";
import TopBar from "~/components/TopBar";
import ResumeViewer from "~/components/ResumeViewer";
import DebugPanel from "~/components/DebugPanel";
import Dialog from "~/components/Dialog";
import { useDialog } from "~/hooks/useDialog";
import type { Resume } from "~/types";

export const meta: MetaFunction = () => {
  return [
    { title: "Currículo Interativo - Felipe Sabino" },
    { name: "description", content: "Currículo interativo e responsivo desenvolvido com Remix e Cloudflare" },
  ];
};

export default function Index() {
  const [isDarkTheme, setIsDarkTheme] = useState(false);
  const [isEditing, setIsEditing] = useState(false);
  const [hasUnsavedChanges, setHasUnsavedChanges] = useState(false);
  const [editSession, setEditSession] = useState<string | null>(null);
  
  // Dialog system
  const dialog = useDialog();

  // Dados do currículo (posteriormente virão do banco D1)
  const resumeData: Resume = {
    personalInfo: {
      name: "Felipe Sabino",
      title: "Desenvolvedor Full Stack",
      email: "felipe@exemplo.com",
      phone: "+55 (11) 99999-9999",
      location: "São Paulo, SP",
      githubUrl: "https://github.com/FelipeSabinoTMRS/curriculo-interativo",
      linkedinUrl: "https://linkedin.com/in/felipe-sabino",
      summary: "Desenvolvedor apaixonado por tecnologia com experiência em desenvolvimento web moderno usando React, TypeScript e Node.js. Especializado em soluções full-stack escaláveis e arquiteturas cloud-native."
    },
    experiences: [
      {
        company: "Tech Solutions Inc.",
        position: "Desenvolvedor Full Stack Sênior",
        startDate: "2022-01",
        endDate: undefined,
        location: "São Paulo, SP",
        description: "Liderança técnica em projetos de grande escala, desenvolvimento de APIs RESTful e interfaces responsivas. Implementação de arquiteturas serverless e CI/CD pipelines.",
        technologies: ["React", "TypeScript", "Node.js", "AWS", "PostgreSQL", "Docker"]
      },
      {
        company: "StartupXYZ",
        position: "Desenvolvedor Frontend",
        startDate: "2020-06",
        endDate: "2021-12",
        location: "São Paulo, SP",
        description: "Desenvolvimento de aplicações web modernas e responsivas. Colaboração em equipe ágil para entrega de produtos inovadores.",
        technologies: ["React", "JavaScript", "Styled Components", "REST APIs", "Git"]
      }
    ],
    education: [
      {
        institution: "Universidade de São Paulo",
        degree: "Bacharelado em Ciência da Computação",
        fieldOfStudy: "Ciência da Computação",
        startDate: "2018-02",
        endDate: "2021-12",
        gpa: "8.5",
        description: "Foco em desenvolvimento de software, algoritmos e estruturas de dados."
      }
    ],
    skills: [
      {
        category: "Frontend",
        items: ["React", "TypeScript", "Next.js", "Tailwind CSS", "Vue.js"]
      },
      {
        category: "Backend",
        items: ["Node.js", "Python", "Express", "FastAPI", "PostgreSQL", "MongoDB"]
      },
      {
        category: "DevOps",
        items: ["Docker", "AWS", "GitHub Actions", "Terraform", "Kubernetes"]
      },
      {
        category: "Ferramentas",
        items: ["Git", "VS Code", "Figma", "Postman", "Linux"]
      }
    ],
    projects: [
      {
        name: "Currículo Interativo",
        description: "Sistema de currículo responsivo e interativo desenvolvido com Remix, Cloudflare Workers, D1 e R2. Funcionalidades incluem edição em tempo real, impressão otimizada e deploy automatizado.",
        technologies: ["Remix", "TypeScript", "Cloudflare Workers", "D1", "R2", "Tailwind CSS"],
        githubUrl: "https://github.com/FelipeSabinoTMRS/curriculo-interativo",
        demoUrl: "https://curriculo-interativo.pages.dev"
      }
    ]
  };

  const handleThemeToggle = () => {
    setIsDarkTheme(!isDarkTheme);
  };

  const handlePrint = () => {
    window.print();
  };

  const handleEditToggle = () => {
    if (isEditing) {
      // Finalizando edição
      if (hasUnsavedChanges) {
        dialog.showConfirm(
          "Alterações não salvas",
          "Você tem alterações não salvas. Deseja descartar as alterações?",
          () => {
            setIsEditing(false);
            setHasUnsavedChanges(false);
            setEditSession(null);
            dialog.showInfo("Edição finalizada", "As alterações locais foram descartadas.");
          },
          () => {
            // Cancelar, continuar editando
          }
        );
      } else {
        setIsEditing(false);
        setEditSession(null);
        dialog.showSuccess("Edição finalizada", "Modo de edição desabilitado.");
      }
    } else {
      // Iniciando edição local
      setIsEditing(true);
      setEditSession(`session_${Date.now()}`);
      dialog.showInfo(
        "Modo de edição ativado",
        "Agora você pode editar os textos do currículo. As alterações serão apenas locais até que você clique em 'Salvar Padrão'.",
        5000
      );
    }
  };

  const handleSaveDefault = () => {
    if (!hasUnsavedChanges) {
      dialog.showWarning("Nenhuma alteração", "Não há alterações para salvar.");
      return;
    }

    // Solicitar senha de administrador
    dialog.showConfirm(
      "Salvar Currículo Padrão",
      "Você está tentando salvar as alterações como currículo padrão. Esta ação requer a senha de administrador. Deseja continuar?",
      () => {
        // Simular salvamento (posteriormente integrará com D1)
        dialog.showSuccess(
          "Alterações salvas!",
          "As alterações foram salvas como padrão no banco de dados.",
          3000
        );
        setHasUnsavedChanges(false);
      }
    );
  };

  const handleFieldChange = () => {
    setHasUnsavedChanges(true);
  };

  return (
    <div className={`min-h-screen transition-colors duration-300 ${
      isDarkTheme ? 'bg-gray-900' : 'bg-gray-200'
    }`}>
      {/* Animated background layers - only for dark theme */}
      {isDarkTheme && (
        <>
          <div className="absolute inset-0 bg-gradient-to-tr from-gray-800/50 to-gray-700/50 animate-pulse"></div>
          <div className="absolute inset-0 bg-gradient-to-bl from-gray-700/30 to-gray-600/30 animate-pulse delay-1000"></div>
        </>
      )}
      
      {/* Content overlay */}
      <div className={`relative z-10 ${isDarkTheme ? 'bg-gray-900/95' : 'bg-gray-200'} backdrop-blur-sm min-h-screen`}>
        <div className="px-1 py-0 sm:py-1 md:py-1 lg:py-2 sm:px-1.5 md:px-2">
          <TopBar 
            onPrint={handlePrint} 
            onEdit={handleEditToggle}
            onSave={handleSaveDefault}
            isEditing={isEditing}
            hasUnsavedChanges={hasUnsavedChanges}
            isDarkTheme={isDarkTheme}
            onThemeToggle={handleThemeToggle}
          />
          <ResumeViewer 
            resume={resumeData} 
            isDarkTheme={isDarkTheme}
            isEditing={isEditing}
            onFieldChange={handleFieldChange}
          />
          {/* Remover o segundo debug panel que aparecia aqui */}
        </div>
      </div>

      {/* Dialog System */}
      {dialog.config && (
        <Dialog
          config={dialog.config}
          isOpen={dialog.isOpen}
          onClose={dialog.closeDialog}
        />
      )}
    </div>
  );
} 