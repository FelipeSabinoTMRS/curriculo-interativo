export interface PersonalInfo {
  id?: string;
  name: string;
  title: string;
  email: string;
  phone: string;
  location: string;
  profileImage?: string;
  backgroundImage?: string;
  summary: string;
  githubUrl?: string;
}

export interface Experience {
  id?: string;
  company: string;
  position: string;
  startDate: string;
  endDate?: string;
  description: string;
  technologies: string[];
}

export interface Education {
  id?: string;
  institution: string;
  degree: string;
  field: string;
  startDate: string;
  endDate?: string;
  description?: string;
}

export interface Skill {
  id?: string;
  name: string;
  category: string;
  level: number; // 1-5
}

export interface Project {
  id?: string;
  name: string;
  description: string;
  technologies: string[];
  url?: string;
  githubUrl?: string;
}

export interface Resume {
  personalInfo: PersonalInfo;
  experiences: Experience[];
  education: Education[];
  skills: Skill[];
  projects: Project[];
}

export interface Image {
  id: string;
  name: string;
  url: string;
  type: 'profile' | 'background';
  uploadedAt: string;
}

export interface DatabaseConnection {
  connected: boolean;
  lastCheck: string;
  error?: string;
} 