import type { MetaFunction } from "@remix-run/cloudflare";
import { useState, useEffect } from "react";
import TopBar from "~/components/TopBar";
import ResumeViewer from "~/components/ResumeViewer";
import Dialog from "~/components/Dialog";
import { useDialog } from "~/hooks/useDialog";
import type { Resume } from "~/types";
import html2canvas from 'html2canvas';
import jsPDF from 'jspdf';

export const meta: MetaFunction = () => {
  return [
    { title: "Currículo Interativo - Felipe Sabino" },
    { name: "description", content: "Currículo interativo e responsivo desenvolvido com Remix e Cloudflare" },
  ];
};

// Dados do currículo (mock data)
const mockResume: Resume = {
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
      description: "Sistema de currículo responsivo e interativo desenvolvido com Remix, Cloudflare Workers. Funcionalidades incluem edição em tempo real, impressão otimizada e deploy automatizado.",
      technologies: ["Remix", "TypeScript", "Cloudflare Workers", "Tailwind CSS"],
      githubUrl: "https://github.com/FelipeSabinoTMRS/curriculo-interativo",
      demoUrl: "https://curriculo-interativo.pages.dev"
    }
  ]
};

// Cookie constants
const RESUME_DATA_COOKIE = 'curriculo_dados';
const COOKIE_MAX_AGE = 30 * 24 * 60 * 60; // 30 dias

export default function Index() {
  const [resumeData, setResumeData] = useState<Resume>(mockResume);
  const [isDarkTheme, setIsDarkTheme] = useState(() => {
    if (typeof window !== 'undefined') {
      const saved = localStorage.getItem('theme');
      return saved === 'dark';
    }
    return false;
  });
  const [isEditing, setIsEditing] = useState(false);
  const [editSession, setEditSession] = useState<string | null>(null);
  const dialog = useDialog();

  // Carregar tema e dados do currículo
  useEffect(() => {
    if (typeof window !== 'undefined') {
      // Carregar tema
      localStorage.setItem('theme', isDarkTheme ? 'dark' : 'light');
      
      // Carregar dados salvos do currículo
      const savedResume = getCookie(RESUME_DATA_COOKIE);
      if (savedResume) {
        try {
          const parsedData = JSON.parse(savedResume);
          if (parsedData && typeof parsedData === 'object') {
            setResumeData(parsedData);
          }
        } catch (e) {
          console.error('Erro ao carregar dados do currículo:', e);
        }
      }
    }
  }, []);

  // Salvar dados em cookie
  const saveResumeToCookie = (data: Resume) => {
    if (typeof window !== 'undefined') {
      try {
        const jsonData = JSON.stringify(data);
        setCookie(RESUME_DATA_COOKIE, jsonData, COOKIE_MAX_AGE);
      } catch (e) {
        console.error('Erro ao salvar dados do currículo:', e);
      }
    }
  };

  // Funções para manipular cookies
  const setCookie = (name: string, value: string, maxAgeSeconds: number) => {
    document.cookie = `${name}=${encodeURIComponent(value)}; max-age=${maxAgeSeconds}; path=/; samesite=lax`;
  };

  const getCookie = (name: string) => {
    const cookies = document.cookie.split(';');
    for (let cookie of cookies) {
      const [cookieName, cookieValue] = cookie.trim().split('=');
      if (cookieName === name) {
        return decodeURIComponent(cookieValue);
      }
    }
    return null;
  };

  const handleThemeToggle = () => {
    setIsDarkTheme(!isDarkTheme);
  };

  const handlePrint = () => {
    // Configurações especiais para impressão com fundo sempre claro
    const printStyles = `
      @media print {
        body { margin: 0; padding: 0; background-color: white !important; }
        .no-print { display: none !important; }
        .print-only { display: block !important; }
        
        /* Garantir que todo texto e fundo sejam em cores apropriadas para impressão */
        * {
          color: black !important;
          background-color: transparent !important;
          print-color-adjust: exact !important;
          -webkit-print-color-adjust: exact !important;
        }
        
        /* Remover elementos de UI que não devem ser impressos */
        header, nav, button, .hamburger, .mobile-menu, .mobile-menu-overlay,
        .theme-toggle, .edit-toggle { display: none !important; }
        
        /* Forçar o fundo a ser branco para as páginas do currículo */
        .resume-paper {
          background-color: white !important;
          box-shadow: none !important;
          border: 1px solid #eee !important;
          color: black !important;
        }
        
        /* Garantir que a escala esteja em 100% */
        .resume-container {
          transform: none !important;
          margin-bottom: 0 !important;
        }
      }
    `;
    
    const styleSheet = document.createElement('style');
    styleSheet.textContent = printStyles;
    document.head.appendChild(styleSheet);
    
    // Mostrar diálogo de impressão
    dialog.showInfo(
      "Preparando impressão",
      "O currículo será impresso em fundo claro, independente do tema atual.",
      2000
    );
    
    // Aguardar um pouco para o diálogo aparecer antes de imprimir
    setTimeout(() => {
      window.print();
      
      // Remover estilos de impressão após imprimir
      setTimeout(() => {
        document.head.removeChild(styleSheet);
      }, 1000);
    }, 1000);
  };

  const handleEditToggle = () => {
    if (isEditing) {
      dialog.showConfirm(
        "Finalizar Edição", 
        "Deseja sair do modo de edição? As alterações serão salvas automaticamente.", 
        () => {
          // Salvar o estado atual em cookie antes de sair do modo de edição
          saveResumeToCookie(resumeData);
          
          // Mostrar confirmação ao usuário
          dialog.showSuccess(
            "Dados Salvos!",
            "As alterações foram salvas e serão mantidas na próxima visita.",
            3000
          );
          
          setIsEditing(false);
          setEditSession(null);
        }
      );
    } else {
      setIsEditing(true);
      setEditSession(`session_${Date.now()}`);
      dialog.showInfo(
        "Modo de edição ativado",
        "Agora você pode editar todos os campos do currículo, incluindo títulos, datas e habilidades. Use 'Salvar como PDF' para fazer o download.",
        5000
      );
    }
  };

  const handleDownloadPDF = async () => {
    try {
      // Mostrar mensagem de carregamento
      dialog.showInfo(
        "Gerando PDF...",
        "Por favor, aguarde enquanto o PDF está sendo gerado.",
        2000
      );

      // Esperar um pouco para garantir que o dialog apareça
      await new Promise(resolve => setTimeout(resolve, 100));

      // Encontrar o elemento do currículo (exclui o TopBar)
      const resumeElement = document.querySelector('.resume-viewer') as HTMLElement;
      
      if (!resumeElement) {
        throw new Error('Elemento do currículo não encontrado');
      }

      // Salvar o estilo original 
      const originalTransform = resumeElement.style.transform;
      const originalMarginBottom = resumeElement.style.marginBottom;
      const originalTransition = resumeElement.style.transition;
      
      // Aplicar estilos para renderização com fundo claro para o PDF
      const originalDarkElements = document.querySelectorAll('.bg-gray-900, .bg-gray-800, .text-white');
      const originalStyles = new Map();
      
      // Salvar estilos originais e aplicar estilos claros para captura
      originalDarkElements.forEach((element, i) => {
        const el = element as HTMLElement;
        originalStyles.set(i, {
          backgroundColor: el.style.backgroundColor,
          color: el.style.color
        });
        
        // Temporariamente converter para estilo claro para captura
        if (el.classList.contains('bg-gray-900') || el.classList.contains('bg-gray-800')) {
          el.style.backgroundColor = '#ffffff';
        }
        if (el.classList.contains('text-white')) {
          el.style.color = '#000000';
        }
      });

      // Remover transform e margin para capturar em tamanho real
      resumeElement.style.transform = 'none';
      resumeElement.style.marginBottom = '0px';
      resumeElement.style.transition = 'none';

      // Aguardar a aplicação dos estilos (efeito visual que o usuário gostou)
      await new Promise(resolve => setTimeout(resolve, 150));

      // Configurações para máxima qualidade e melhor dimensionamento
      const canvas = await html2canvas(resumeElement, {
        scale: 3, // Escala muito alta para melhor qualidade
        useCORS: true,
        allowTaint: true,
        backgroundColor: '#ffffff', // Sempre usar fundo branco independente do tema
        width: resumeElement.scrollWidth,
        height: resumeElement.scrollHeight,
        scrollX: 0,
        scrollY: 0,
        logging: false,
        ignoreElements: (element) => {
          // Ignorar elementos de debug ou overlay
          return element.classList?.contains('debug-element') || 
                 element.classList?.contains('mobile-menu') ||
                 element.classList?.contains('mobile-menu-overlay') || 
                 false;
        }
      });

      // Restaurar estilos originais
      resumeElement.style.transform = originalTransform;
      resumeElement.style.marginBottom = originalMarginBottom;
      resumeElement.style.transition = originalTransition;
      
      // Restaurar cores originais dos elementos
      originalDarkElements.forEach((element, i) => {
        const el = element as HTMLElement;
        const styles = originalStyles.get(i);
        if (styles) {
          el.style.backgroundColor = styles.backgroundColor;
          el.style.color = styles.color;
        }
      });

      // Criar PDF com dimensões otimizadas
      const imgData = canvas.toDataURL('image/png', 1.0);
      const pdf = new jsPDF({
        orientation: 'portrait',
        unit: 'mm',
        format: 'a4',
        compress: true
      });

      // Dimensões A4: 210mm x 297mm
      const pdfWidth = 210;
      const pdfHeight = 297;
      
      // Margens muito pequenas para aproveitar máximo da folha
      const margin = 5; // Apenas 5mm de margem
      const availableWidth = pdfWidth - (2 * margin);
      const availableHeight = pdfHeight - (2 * margin);

      // Calcular dimensões proporcionais
      const canvasRatio = canvas.height / canvas.width;
      const pageRatio = availableHeight / availableWidth;

      let imgWidth, imgHeight, x, y;
      
      if (canvasRatio > pageRatio) {
        // Conteúdo é mais alto - ajustar pela altura disponível
        imgHeight = availableHeight;
        imgWidth = imgHeight / canvasRatio;
        x = margin + (availableWidth - imgWidth) / 2;
        y = margin;
      } else {
        // Conteúdo é mais largo - ajustar pela largura disponível
        imgWidth = availableWidth;
        imgHeight = imgWidth * canvasRatio;
        x = margin;
        y = margin + (availableHeight - imgHeight) / 2;
      }

      // Se ainda assim o conteúdo for muito grande, forçar para ocupar toda a área
      if (imgWidth < availableWidth * 0.9 && imgHeight < availableHeight * 0.9) {
        const scaleUpFactor = Math.min(
          (availableWidth * 0.95) / imgWidth,
          (availableHeight * 0.95) / imgHeight
        );
        imgWidth *= scaleUpFactor;
        imgHeight *= scaleUpFactor;
        x = margin + (availableWidth - imgWidth) / 2;
        y = margin + (availableHeight - imgHeight) / 2;
      }

      // Adicionar a imagem ocupando o máximo possível da página
      pdf.addImage(imgData, 'PNG', x, y, imgWidth, imgHeight, undefined, 'FAST');

      // Gerar nome do arquivo com data/hora
      const now = new Date();
      const timestamp = now.toISOString().slice(0, 16).replace(/[T:]/g, '-');
      const fileName = `curriculo-felipe-sabino-${timestamp}.pdf`;

      // Fazer download do PDF
      pdf.save(fileName);

      // Mostrar sucesso
      dialog.showSuccess(
        "PDF Gerado!",
        `O arquivo "${fileName}" foi baixado com sucesso. O PDF está em formato A4 com fundo branco profissional.`,
        3000
      );

    } catch (error) {
      console.error('Erro ao gerar PDF:', error);
      dialog.showError(
        "Erro ao Gerar PDF",
        "Ocorreu um erro ao gerar o PDF. Tente novamente."
      );
    }
  };

  const handleFieldChange = (updatedResume: Resume) => {
    // Atualiza o estado com o currículo modificado
    setResumeData(updatedResume);
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
        <div className="px-1 py-0 sm:py-1 md:py-1 lg:py-2 sm:px-1.5 md:px-2 no-print">
          <TopBar 
            onPrint={handlePrint} 
            onEdit={handleEditToggle}
            onDownloadPDF={handleDownloadPDF}
            isEditing={isEditing}
            isDarkTheme={isDarkTheme}
            onThemeToggle={handleThemeToggle}
          />
          <ResumeViewer 
            resume={resumeData} 
            isDarkTheme={isDarkTheme}
            isEditing={isEditing}
            onFieldChange={handleFieldChange}
          />
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