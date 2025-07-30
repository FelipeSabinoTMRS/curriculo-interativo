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
    { rel: "icon", href: "/favicon.ico" },
  ];
};

// Dados do currículo (mock data)
const mockResume: Resume = {
  personalInfo: {
    name: "Felipe Sabino da Silva",
    title: "Desenvolvedor Full Stack e Futuro Técnico em IA pela FIAP",
    email: "felipe@sabinoseg.com.br",
    phone: "+55 (55) 99719-7937",
    location: "Três de Maio, RS",
          githubUrl: "Acesse Agora https://curriculo-interativo.felipe-ac1.workers.dev/",
    acceptingOffers: true,
    salary: "Expectativa Salarial R$ X.000,00",
    cpf: "000.000.000-00",
    showCpf: false,
    summary: "De acordo com o Predictive Index possuo o perfil Especialista (mais detalhes na Página 3), apaixonado por tecnologia com experiência em desenvolvimento web moderno usando React, TypeScript e Node.js. Especializado em soluções full-stack escaláveis e arquiteturas cloud-native. Tudo isso combinado com o verdadeiro conhecimento técnico em Inteligência Artificial."
  },
  experiences: [
    {
      company: "SABINOSEG Corretora de Seguros",
      position: "Sistema Sabinoseg de Produção",
      startDate: "Janeiro de 2020",
      endDate: "Atual",
      location: "Três de Maio, RS",
      description: "Desenvolvi, de forma autônoma e do zero até a implantação em nuvem, um sistema inovador para a corretora, utilizando tecnologias modernas como banco de dados NoSQL, processamento de dados em tempo real e integração de Inteligência Artificial (IA) com Large Language Models (LLM) e modelos treinados personalizados nos fluxos operacionais. O sistema já está em produção, sendo utilizado pela equipe interna.",
      technologies: ["React", "TypeScript", "Node.js", "Cloudflare Full Stack", "JavaScript", "API", "Machine Learning", "IA", "Google Cloud", "Google Workspace Admin"]
    },
    {
      company: "www.sabinoseg.com.br",
      position: "Desenvolvedor Frontend",
      startDate: "Janeiro de 2020",
      endDate: "Atual",
      location: "Três de Maio, RS",
      description: "Site otimizado para desktop, tablet e mobile, com tempos de carregamentos extremamente rápidos graças ao pré-processamento de imagens. Tempo de carregamento médio de 1 segundo para cada 300 visitantes. Protótipo desenvolvido no Figma.",
      technologies: ["React", "Styled Components", "Git", "Figma", "Cloudflare Workers", "TypeScript", "Tailwind CSS"]
    }
  ],
  education: [
    {
      institution: "FIAP - Faculdade de Informática e Administração Paulista",
      degree: "Graduação em Técnico em Inteligência Artificial",
      fieldOfStudy: "1° Sem. Concluído com Nota 9.83/10 - FIAP Certified Machine Learning Professional",
      startDate: "Janeiro de 2025",
      endDate: "Dezembro de 2026",
      gpa: "2° Sem. em Andamento",
      description: "Foco em liderar equipes de implantação e desenvolvimento de soluções utilizando todas as vertentes da inteligência artificial, tais como: Machine Learning, Deep Learning, Chat Bot, processamento de linguagem natural e Reinforcement Learning."
    }
  ],
  skills: [
    {
      category: "Frontend",
      items: ["React", "TypeScript", "Tailwind CSS", "Figma", "UI e UX", "HTML", "JavaScript", "API"]
    },
    {
      category: "Backend",
      items: ["Node.js", "Python", "TypeScript", "JavaScript", "API", "IA", "Machine Learning"]
    },
    {
      category: "DevOps",
      items: ["GitHub Actions", "Cloudflare Full Stack", "Git"]
    },
    {
      category: "Ferramentas",
      items: ["Git", "VS Code", "Figma", "Cursor", "Cloudflare"]
    }
  ],
  projects: [
    {
      name: "Currículo Interativo",
      description: "Sistema que permite criar currículos, desenvolvido com Typescript, Remix, implementado no Cloudflare Workers. As edições são salvas localmente com cookies do navegador.",
      technologies: ["TypeScript", "Cloudflare Workers", "Tailwind CSS"],
      githubUrl: "https://github.com/FelipeSabinoTMRS/curriculo-interativo"
    }
  ],
  selectedWallpaper: 'pixels', // Wallpaper padrão
  profilePhoto: '/foto_perfil_felipe.jpg', // Foto de perfil padrão
  secondaryDocument: {
    enabled: false,
    file: undefined,
    fileName: undefined
  }
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
      
      // Carregar dados salvos do currículo ou usar mockResume como padrão
      const savedResume = getCookie(RESUME_DATA_COOKIE);
      console.log('Cookie encontrado:', savedResume ? 'sim' : 'não');
      if (savedResume) {
        try {
          const parsedData = JSON.parse(savedResume);
          console.log('Dados parseados:', parsedData);
          if (parsedData && typeof parsedData === 'object') {
            // Mesclar dados salvos com valores atualizados do mockResume
            // Apenas a expectativa salarial não é persistente
            const mergedData = {
              ...mockResume,
              ...parsedData,
              personalInfo: {
                ...mockResume.personalInfo,
                ...parsedData.personalInfo,
                // Forçar apenas a expectativa salarial para sempre usar o valor do código
                salary: mockResume.personalInfo.salary,
              }
            };
            console.log('Dados mesclados:', mergedData);
            setResumeData(mergedData);
          } else {
            console.log('Usando mockResume (dados inválidos)');
            setResumeData(mockResume);
          }
        } catch (e) {
          console.error('Erro ao carregar dados do currículo:', e);
          setResumeData(mockResume);
        }
      } else {
        // Se não há dados salvos, usar mockResume
        console.log('Usando mockResume (sem cookie)');
        setResumeData(mockResume);
      }
    }
  }, [isDarkTheme]);

  // Salvar dados em cookie ou localStorage como fallback
  const saveResumeToCookie = (data: Resume) => {
    if (typeof window !== 'undefined') {
      try {
        const jsonData = JSON.stringify(data);
        console.log('Salvando dados:', jsonData.substring(0, 100) + '...');
        
        // Tentar salvar no cookie primeiro
        setCookie(RESUME_DATA_COOKIE, jsonData, COOKIE_MAX_AGE);
        
        // Como fallback, também salvar no localStorage
        localStorage.setItem(RESUME_DATA_COOKIE, jsonData);
        console.log('Dados salvos no localStorage como fallback');
      } catch (e) {
        console.error('Erro ao salvar dados do currículo:', e);
      }
    }
  };

  // Funções para manipular cookies
  const setCookie = (name: string, value: string, maxAgeSeconds: number) => {
    // Tentar diferentes configurações de cookie
    const cookieOptions = [
      `${name}=${encodeURIComponent(value)}; max-age=${maxAgeSeconds}; path=/`,
      `${name}=${encodeURIComponent(value)}; path=/`,
      `${name}=${encodeURIComponent(value)}; max-age=${maxAgeSeconds}`,
      `${name}=${encodeURIComponent(value)}`
    ];
    
    console.log('Tentando salvar cookie com diferentes configurações...');
    
    for (let i = 0; i < cookieOptions.length; i++) {
      const cookieString = cookieOptions[i];
      console.log(`Tentativa ${i + 1}:`, cookieString.substring(0, 100) + '...');
      document.cookie = cookieString;
      
      // Verificar se funcionou
      const savedCookie = getCookie(name);
      if (savedCookie) {
        console.log(`Cookie salvo com sucesso na tentativa ${i + 1}!`);
        return;
      }
    }
    
    console.error('ERRO: Cookie não foi salvo com nenhuma configuração!');
  };

  const getCookie = (name: string) => {
    console.log('Buscando dados:', name);
    
    // Primeiro tentar buscar no cookie
    console.log('Todos os cookies:', document.cookie);
    const cookies = document.cookie.split(';');
    for (let cookie of cookies) {
      const [cookieName, cookieValue] = cookie.trim().split('=');
      console.log('Verificando cookie:', cookieName, '=', cookieValue ? 'encontrado' : 'não encontrado');
      if (cookieName === name) {
        const value = decodeURIComponent(cookieValue);
        console.log('Cookie encontrado:', name, '=', value.substring(0, 100) + '...');
        return value;
      }
    }
    
    // Se não encontrou no cookie, tentar no localStorage
    const localStorageValue = localStorage.getItem(name);
    if (localStorageValue) {
      console.log('Dados encontrados no localStorage:', name, '=', localStorageValue.substring(0, 100) + '...');
      return localStorageValue;
    }
    
    console.log('Dados não encontrados em cookie nem localStorage:', name);
    return null;
  };

  const handleThemeToggle = () => {
    setIsDarkTheme(!isDarkTheme);
  };

  // Função para limpar dados salvos (usada pelo botão "Limpar Dados Salvos")
  const handleResetData = () => {
    if (typeof window !== 'undefined') {
      // Limpar cookie
      document.cookie = `${RESUME_DATA_COOKIE}=; expires=Thu, 01 Jan 1970 00:00:00 UTC; path=/;`;
      
      // Limpar localStorage
      localStorage.removeItem(RESUME_DATA_COOKIE);
      
      // Resetar para dados padrão
      setResumeData(mockResume);
      
      dialog.showSuccess(
        "Dados Limpos!",
        "Todos os dados salvos foram removidos. A página será recarregada em 2 segundos.",
        2000
      );
      
      // Recarregar a página após 2 segundos
      setTimeout(() => {
        window.location.reload();
      }, 2000);
    }
  };

  const handleEditToggle = () => {
    console.log('handleEditToggle chamado, isEditing atual:', isEditing);
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
            "Alterações salvas e mantidas na próxima visita.\n\n💡 Expectativa Salarial voltará para 'R$ X.000,00 ao atualizar'.",
            4000
          );
          
          setIsEditing(false);
          setEditSession(null);
        }
      );
    } else {
      console.log('Ativando modo de edição');
      setIsEditing(true);
      setEditSession(`session_${Date.now()}`);
      dialog.showWarning(
        "Modo de edição ativado",
        "Edite todos os campos do currículo. Finalize para salvar como PDF.",
        6000
      );
    }
  };

  const handleDownloadPDF = async () => {
    try {
      // Detectar se é dispositivo móvel
      const isMobile = /Android|webOS|iPhone|iPad|iPod|BlackBerry|IEMobile|Opera Mini/i.test(navigator.userAgent);
      
      // Mostrar mensagem de carregamento
      dialog.showInfo(
        "Gerando PDF...",
        isMobile 
          ? "Por favor, aguarde. Em dispositivos móveis, o PDF será aberto em uma nova aba."
          : "Por favor, aguarde enquanto o PDF está sendo gerado.",
        2000
      );

      // Esperar um pouco para garantir que o dialog apareça
      await new Promise(resolve => setTimeout(resolve, 100));

      // Encontrar o container do currículo
      const resumeContainer = document.querySelector('.resume-viewer') as HTMLElement;
      
      if (!resumeContainer) {
        throw new Error('Elemento do currículo não encontrado');
      }

      // Encontrar as duas páginas do currículo
      const resumePages = resumeContainer.querySelectorAll('.resume-paper');
      
      if (resumePages.length === 0) {
        throw new Error('Páginas do currículo não encontradas');
      }

      // Adicionar classe para renderização específica do PDF
      resumeContainer.classList.add('pdf-render');

      // Salvar estilos originais
      const originalTransform = resumeContainer.style.transform;
      const originalMarginBottom = resumeContainer.style.marginBottom;
      const originalTransition = resumeContainer.style.transition;
      
      // Salvar estado do tema para restaurar depois
      const originalTheme = isDarkTheme;
      
      // Temporariamente forçar o tema claro para geração do PDF
      if (isDarkTheme) {
        // Aplicar tema claro a todo o container
        resumeContainer.classList.remove('dark-theme');
        resumeContainer.querySelectorAll('.bg-gray-900, .bg-gray-800, .bg-gray-700, .text-white, .text-gray-300')
          .forEach(element => {
        const el = element as HTMLElement;
            el.dataset.originalClasses = el.className;
            
            // Substituir classes escuras por claras
            el.className = el.className
              .replace('bg-gray-900', 'bg-white')
              .replace('bg-gray-800', 'bg-white')
              .replace('bg-gray-700', 'bg-gray-100')
              .replace('text-white', 'text-gray-900')
              .replace('text-gray-300', 'text-gray-700');
          });
      }

      // Remover transform e margin para capturar em tamanho real
      resumeContainer.style.transform = 'none';
      resumeContainer.style.marginBottom = '0px';
      resumeContainer.style.transition = 'none';

      // Aguardar a aplicação dos estilos
      await new Promise(resolve => setTimeout(resolve, 150));

      // Criar PDF com dimensões A4
      const pdf = new jsPDF({
        orientation: 'portrait',
        unit: 'mm',
        format: 'a4',
        compress: true
      });

      // Verificar se o PDF foi criado corretamente
      if (!pdf) {
        throw new Error('Falha ao criar o objeto PDF');
      }

      // Dimensões A4: 210mm x 297mm
      const pdfWidth = 210;
      const pdfHeight = 297;
      
      // Margens pequenas para aproveitar máximo da folha
      const margin = 5;
      const availableWidth = pdfWidth - (2 * margin);
      const availableHeight = pdfHeight - (2 * margin);

      // Processar cada página separadamente
      for (let i = 0; i < resumePages.length; i++) {
        const page = resumePages[i] as HTMLElement;
        
        // Aplicar estilos temporários para remover bordas e garantir proporções corretas
        const originalBorder = page.style.border;
        const originalBorderRadius = page.style.borderRadius;
        const originalBoxShadow = page.style.boxShadow;
        
        // Remover bordas visíveis
        page.style.border = 'none';
        page.style.borderRadius = '0';
        page.style.boxShadow = 'none';
        
        // Pré-processar elementos para melhorar renderização
        const iconElements = page.querySelectorAll('.lucide');
        const originalIconStyles: { [key: string]: {[key: string]: string} } = {};
        
        // Ajustar ícones para garantir alinhamento correto
        iconElements.forEach((icon, idx) => {
          const iconEl = icon as HTMLElement;
          const id = `icon-${idx}`;
          iconEl.setAttribute('data-icon-id', id);
          
          originalIconStyles[id] = {
            position: iconEl.style.position,
            margin: iconEl.style.margin,
            verticalAlign: iconEl.style.verticalAlign,
            transform: iconEl.style.transform,
            display: iconEl.style.display
          };
          
          // Melhoria no posicionamento dos ícones - ajuste mais significativo
          iconEl.style.position = 'relative';
          iconEl.style.margin = '0';
          iconEl.style.verticalAlign = 'middle';
          iconEl.style.transform = 'translateY(-2px)';
          iconEl.style.display = 'inline-flex';
        });
        
        // Processar capsulas (skills e technologies tags)
        const capsules = page.querySelectorAll('.rounded-full');
        const originalCapsuleStyles: { [key: string]: {[key: string]: string} } = {};
        
        capsules.forEach((capsule, idx) => {
          const capsuleEl = capsule as HTMLElement;
          const id = `capsule-${idx}`;
          capsuleEl.setAttribute('data-capsule-id', id);
          
          originalCapsuleStyles[id] = {
            padding: capsuleEl.style.padding,
            margin: capsuleEl.style.margin,
            display: capsuleEl.style.display,
            lineHeight: capsuleEl.style.lineHeight,
            alignItems: capsuleEl.style.alignItems,
            justifyContent: capsuleEl.style.justifyContent,
            textAlign: capsuleEl.style.textAlign,
            verticalAlign: capsuleEl.style.verticalAlign
          };
          
          // Normalizar a aparência das cápsulas com mais precisão
          capsuleEl.style.padding = '0.35rem 0.75rem';
          capsuleEl.style.margin = '0.15rem';
          capsuleEl.style.display = 'inline-flex';
          capsuleEl.style.lineHeight = '1.2';
          capsuleEl.style.alignItems = 'center';
          capsuleEl.style.justifyContent = 'center';
          capsuleEl.style.textAlign = 'center';
          capsuleEl.style.verticalAlign = 'middle';
        });
        
        // Encontrar e corrigir a foto de perfil, se presente
        const profilePhoto = i === 0 ? page.querySelector('.w-24.h-24.rounded-full') : null;
        let originalPhotoStyles = {};
        
        if (profilePhoto) {
          originalPhotoStyles = {
            borderRadius: (profilePhoto as HTMLElement).style.borderRadius,
            border: (profilePhoto as HTMLElement).style.border,
            overflow: (profilePhoto as HTMLElement).style.overflow,
            width: (profilePhoto as HTMLElement).style.width,
            height: (profilePhoto as HTMLElement).style.height,
            display: (profilePhoto as HTMLElement).style.display,
            alignItems: (profilePhoto as HTMLElement).style.alignItems,
            justifyContent: (profilePhoto as HTMLElement).style.justifyContent
          };
          
          // Garantir proporções corretas da foto
          (profilePhoto as HTMLElement).style.borderRadius = '50%';
          (profilePhoto as HTMLElement).style.border = 'none';
          (profilePhoto as HTMLElement).style.overflow = 'hidden';
          (profilePhoto as HTMLElement).style.width = '144px';
          (profilePhoto as HTMLElement).style.height = '144px';
          (profilePhoto as HTMLElement).style.display = 'flex';
          (profilePhoto as HTMLElement).style.alignItems = 'center';
          (profilePhoto as HTMLElement).style.justifyContent = 'center';
          
          // Garantir que a imagem dentro da div tenha aspect ratio 1:1
          const profileImg = profilePhoto.querySelector('img');
          if (profileImg) {
            const originalImgStyles = {
              objectFit: (profileImg as HTMLElement).style.objectFit,
              width: (profileImg as HTMLElement).style.width,
              height: (profileImg as HTMLElement).style.height,
              display: (profileImg as HTMLElement).style.display,
              borderRadius: (profileImg as HTMLElement).style.borderRadius,
              maxWidth: (profileImg as HTMLElement).style.maxWidth,
              maxHeight: (profileImg as HTMLElement).style.maxHeight,
              position: (profileImg as HTMLElement).style.position
            };
            
            (profileImg as HTMLElement).style.objectFit = 'cover';
            (profileImg as HTMLElement).style.width = '100%';
            (profileImg as HTMLElement).style.height = '100%';
            (profileImg as HTMLElement).style.display = 'block';
            (profileImg as HTMLElement).style.borderRadius = '50%';
            (profileImg as HTMLElement).style.maxWidth = '100%';
            (profileImg as HTMLElement).style.maxHeight = '100%';
            (profileImg as HTMLElement).style.position = 'relative';
            
            // Restaurar depois da captura
            setTimeout(() => {
              if (profileImg) {
                (profileImg as HTMLElement).style.objectFit = originalImgStyles.objectFit;
                (profileImg as HTMLElement).style.width = originalImgStyles.width;
                (profileImg as HTMLElement).style.height = originalImgStyles.height;
                (profileImg as HTMLElement).style.display = originalImgStyles.display;
                (profileImg as HTMLElement).style.borderRadius = originalImgStyles.borderRadius;
                (profileImg as HTMLElement).style.maxWidth = originalImgStyles.maxWidth;
                (profileImg as HTMLElement).style.maxHeight = originalImgStyles.maxHeight;
                (profileImg as HTMLElement).style.position = originalImgStyles.position;
              }
            }, 500);
          }
        }
        
        // Se não for a primeira página, adicione uma nova página ao PDF
        if (i > 0) {
          pdf.addPage();
        }

        // Capturar a página atual com configurações otimizadas
        const canvas = await html2canvas(page, {
          scale: isMobile ? 2 : 4, // Reduzir escala em mobile para melhor performance
          useCORS: true,
          allowTaint: true,
          backgroundColor: '#ffffff',
          logging: false,
          windowWidth: 210 * 3.78, // Aproximadamente 210mm em pixels
          windowHeight: 297 * 3.78, // Aproximadamente 297mm em pixels
          // Configurações adicionais para mobile
          foreignObjectRendering: isMobile ? false : true, // Desabilitar em mobile para melhor compatibilidade
          removeContainer: true, // Remover container temporário
          imageTimeout: isMobile ? 15000 : 5000, // Timeout maior para mobile
          ignoreElements: (element) => {
            return element.classList?.contains('debug-element') || 
                   element.classList?.contains('mobile-menu') ||
                   element.classList?.contains('mobile-menu-overlay') || 
                   false;
            },
            onclone: (clonedDoc) => {
              // Estilos adicionais para o documento clonado
              const clonedPage = clonedDoc.querySelector('.resume-paper');
              if (clonedPage) {
                (clonedPage as HTMLElement).style.boxShadow = 'none';
                (clonedPage as HTMLElement).style.border = 'none';
                (clonedPage as HTMLElement).style.borderRadius = '0';
              }
              
              // Melhorias específicas para mobile no clone
              if (isMobile) {
                const allElements = clonedDoc.querySelectorAll('*');
                allElements.forEach((el) => {
                  const element = el as HTMLElement;
                  // Garantir que elementos tenham dimensões explícitas
                  if (element.offsetWidth === 0 || element.offsetHeight === 0) {
                    element.style.display = 'block';
                    element.style.visibility = 'visible';
                  }
                });
              }
            }
        });
        
        // Restaurar estilos originais da página
        page.style.border = originalBorder;
        page.style.borderRadius = originalBorderRadius;
        page.style.boxShadow = originalBoxShadow;
        
        // Restaurar estilos dos ícones
        iconElements.forEach((icon) => {
          const iconEl = icon as HTMLElement;
          const id = iconEl.getAttribute('data-icon-id');
          if (id && originalIconStyles[id]) {
            iconEl.style.position = originalIconStyles[id].position;
            iconEl.style.margin = originalIconStyles[id].margin;
            iconEl.style.verticalAlign = originalIconStyles[id].verticalAlign;
            iconEl.style.transform = originalIconStyles[id].transform;
            iconEl.style.display = originalIconStyles[id].display;
            iconEl.removeAttribute('data-icon-id');
          }
        });
        
        // Restaurar estilos das cápsulas
        capsules.forEach((capsule) => {
          const capsuleEl = capsule as HTMLElement;
          const id = capsuleEl.getAttribute('data-capsule-id');
          if (id && originalCapsuleStyles[id]) {
            capsuleEl.style.padding = originalCapsuleStyles[id].padding;
            capsuleEl.style.margin = originalCapsuleStyles[id].margin;
            capsuleEl.style.display = originalCapsuleStyles[id].display;
            capsuleEl.style.lineHeight = originalCapsuleStyles[id].lineHeight;
            capsuleEl.style.alignItems = originalCapsuleStyles[id].alignItems;
            capsuleEl.style.justifyContent = originalCapsuleStyles[id].justifyContent;
            capsuleEl.style.textAlign = originalCapsuleStyles[id].textAlign;
            capsuleEl.style.verticalAlign = originalCapsuleStyles[id].verticalAlign;
            capsuleEl.removeAttribute('data-capsule-id');
          }
        });
        
        // Restaurar estilos originais da foto de perfil
        if (profilePhoto) {
          const photoStyles = originalPhotoStyles as {[key: string]: string};
          (profilePhoto as HTMLElement).style.borderRadius = photoStyles.borderRadius || '';
          (profilePhoto as HTMLElement).style.border = photoStyles.border || '';
          (profilePhoto as HTMLElement).style.overflow = photoStyles.overflow || '';
          (profilePhoto as HTMLElement).style.width = photoStyles.width || '';
          (profilePhoto as HTMLElement).style.height = photoStyles.height || '';
          (profilePhoto as HTMLElement).style.display = photoStyles.display || '';
          (profilePhoto as HTMLElement).style.alignItems = photoStyles.alignItems || '';
          (profilePhoto as HTMLElement).style.justifyContent = photoStyles.justifyContent || '';
        }

        // Converter para imagem
        const imgData = canvas.toDataURL('image/png', 1.0);

        // Calcular dimensões - usar a página inteira para evitar bordas
        const imgWidth = availableWidth;
        const imgHeight = availableHeight;
        const x = margin;
        const y = margin;

        // Adicionar a imagem na página atual do PDF
        pdf.addImage(imgData, 'PNG', x, y, imgWidth, imgHeight, undefined, 'FAST');
      }
      
      // Restaurar tema original se necessário
      if (originalTheme) {
        resumeContainer.classList.add('dark-theme');
        resumeContainer.querySelectorAll('[data-original-classes]')
          .forEach(element => {
            const el = element as HTMLElement;
            if (el.dataset.originalClasses) {
              el.className = el.dataset.originalClasses;
              delete el.dataset.originalClasses;
            }
          });
      }

      // Restaurar estilos originais
      resumeContainer.style.transform = originalTransform;
      resumeContainer.style.marginBottom = originalMarginBottom;
      resumeContainer.style.transition = originalTransition;
      resumeContainer.classList.remove('pdf-render');

      // Gerar nome do arquivo com data/hora
      const now = new Date();
      const timestamp = now.toISOString().slice(0, 16).replace(/[T:]/g, '-');

      // Verificar se há documento secundário para mesclar
      if (resumeData.secondaryDocument?.enabled && resumeData.secondaryDocument?.file) {
        try {
          // Importar dinamicamente pdf-lib
          const { PDFDocument } = await import('pdf-lib');
          
          // Obter o PDF principal como ArrayBuffer
          const mainPdfBytes = pdf.output('arraybuffer');
          const mainPdfDoc = await PDFDocument.load(mainPdfBytes);
          
          // Converter o PDF secundário de base64 para Uint8Array
          const secondaryPdfBase64 = resumeData.secondaryDocument.file;
          const secondaryPdfBytes = Uint8Array.from(atob(secondaryPdfBase64.split(',')[1]), c => c.charCodeAt(0));
          const secondaryPdfDoc = await PDFDocument.load(secondaryPdfBytes);
          
          // Copiar todas as páginas do secundário para o principal
          const secondaryPages = await mainPdfDoc.copyPages(secondaryPdfDoc, secondaryPdfDoc.getPageIndices());
          secondaryPages.forEach((page) => mainPdfDoc.addPage(page));
          
          // Salvar o PDF final
          const finalPdfBytes = await mainPdfDoc.save();
          
          // Criar blob e fazer download
          const blob = new Blob([finalPdfBytes], { type: 'application/pdf' });
          const url = URL.createObjectURL(blob);
          const link = document.createElement('a');
          link.href = url;
          link.download = `curriculo-felipe-sabino-${timestamp}.pdf`;
          
          if (isMobile) {
            // Em dispositivos móveis, abrir em nova aba
            link.target = '_blank';
            link.rel = 'noopener noreferrer';
            document.body.appendChild(link);
            link.click();
            document.body.removeChild(link);
            URL.revokeObjectURL(url);
            
            // Mostrar mensagem de sucesso
            dialog.showSuccess(
              "PDF gerado com sucesso!",
              "O PDF foi aberto em uma nova aba. Use o botão de compartilhar do seu navegador para salvar.",
              4000
            );
          } else {
            // Em desktop, fazer download direto
            document.body.appendChild(link);
            link.click();
            document.body.removeChild(link);
            URL.revokeObjectURL(url);
            
            // Mostrar mensagem de sucesso
            dialog.showSuccess(
              "PDF gerado com sucesso!",
              `O arquivo "${link.download}" foi salvo na pasta de downloads com o documento adicional.`,
              3000
            );
          }
          return;
        } catch (mergeError) {
          console.error("Erro ao mesclar PDFs:", mergeError);
          // Se falhar a mesclagem, continuar com o PDF normal
        }
      }

      const fileName = `curriculo-felipe-sabino-${timestamp}.pdf`;

      if (isMobile) {
        // Em dispositivos móveis, usar data URI para abrir em nova aba
        const pdfDataUri = pdf.output('datauristring');
        const link = document.createElement('a');
        link.href = pdfDataUri;
        link.target = '_blank';
        link.rel = 'noopener noreferrer';
        document.body.appendChild(link);
        link.click();
        document.body.removeChild(link);
        
        // Mostrar mensagem de sucesso
        dialog.showSuccess(
          "PDF gerado com sucesso!",
          "O PDF foi aberto em uma nova aba. Use o botão de compartilhar do seu navegador para salvar.",
          4000
        );
      } else {
        // Em desktop, fazer download direto
        pdf.save(fileName);
        
        // Mostrar mensagem de sucesso
        dialog.showSuccess(
          "PDF gerado com sucesso!",
          `O arquivo "${fileName}" foi salvo na pasta de downloads.`,
          3000
        );
      }
    } catch (error) {
      console.error("Erro ao gerar PDF:", error);
      
      // Detectar se é dispositivo móvel para mensagem específica
      const isMobile = /Android|webOS|iPhone|iPad|iPod|BlackBerry|IEMobile|Opera Mini/i.test(navigator.userAgent);
      
      if (isMobile) {
        dialog.showError(
          "Erro ao gerar PDF",
          "Não foi possível gerar o PDF no dispositivo móvel. Tente:\n\n1. Usar um navegador diferente\n2. Verificar se há espaço suficiente\n3. Tentar novamente em alguns segundos"
        );
      } else {
        dialog.showError(
          "Erro ao gerar PDF",
          "Não foi possível criar o arquivo PDF. Por favor, tente novamente."
        );
      }
    }
  };

  const handleFieldChange = (updatedResume: Resume) => {
    console.log('handleFieldChange chamado:', updatedResume);
    // Atualiza o estado com o currículo modificado
    setResumeData(updatedResume);
    // Salva automaticamente no cookie
    saveResumeToCookie(updatedResume);
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
            onEdit={handleEditToggle}
            onDownloadPDF={handleDownloadPDF}
            onResetData={handleResetData}
            isEditing={isEditing}
            isDarkTheme={isDarkTheme}
            onThemeToggle={handleThemeToggle}
            hasSecondaryDocument={!!resumeData.secondaryDocument?.enabled && !!resumeData.secondaryDocument?.file}
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