export interface PersonalInfo {
  name: string;
  title: string;
  email: string;
  phone: string;
  location: string;
  githubUrl: string;

  summary: string;
  salary?: string;
  acceptingOffers?: boolean;
  cpf?: string;
  showCpf?: boolean;
}

export interface Experience {
  company: string;
  position: string;
  startDate: string;
  endDate?: string;
  location: string;
  description: string;
  technologies: string[];
}

export interface Education {
  institution: string;
  degree: string;
  fieldOfStudy: string;
  startDate: string;
  endDate?: string;
  gpa?: string;
  description?: string;
}

export interface Skill {
  category: string;
  items: string[];
}

export interface Project {
  name: string;
  description: string;
  technologies: string[];
  githubUrl?: string;
  demoUrl?: string;
  imageUrl?: string;
}

export interface Resume {
  personalInfo: PersonalInfo;
  experiences: Experience[];
  education: Education[];
  skills: Skill[];
  projects: Project[];
  selectedWallpaper?: string; // ID do wallpaper selecionado
  selectedTheme?: string; // ID do tema selecionado
  profilePhoto?: string; // URL da imagem de perfil (base64 ou URL)
  secondaryDocument?: {
    enabled: boolean;
    file?: string; // base64 do PDF
    fileName?: string;
  };
}

export interface ApiResponse<T = any> {
  success: boolean;
  data?: T;
  error?: string;
  message?: string;
}

export interface DialogConfig {
  type: 'success' | 'error' | 'warning' | 'info' | 'confirm';
  title: string;
  message: string;
  confirmText?: string;
  cancelText?: string;
  onConfirm?: () => void;
  onCancel?: () => void;
  autoClose?: number; // milliseconds
}

export interface ToastNotification {
  id: string;
  type: 'success' | 'error' | 'warning' | 'info';
  title: string;
  message?: string;
  duration?: number;
  timestamp: Date;
}