/**
 * Serviço para interagir com Cloudflare D1 Database
 */

import type { 
  Resume, 
  PersonalInfo, 
  Experience, 
  Education, 
  Skill, 
  Project,
  ApiResponse,
  EditChange,
  D1Database,
  D1Result
} from '~/types';

export class DatabaseService {
  private db: D1Database;

  constructor(database: D1Database) {
    this.db = database;
  }

  /**
   * Buscar todas as informações do currículo
   */
  async getResume(): Promise<ApiResponse<Resume>> {
    try {
      const [personalInfo, experiences, education, skills, projects] = await Promise.all([
        this.getPersonalInfo(),
        this.getExperiences(),
        this.getEducation(),
        this.getSkills(),
        this.getProjects()
      ]);

      if (!personalInfo.success || !experiences.success || !education.success || 
          !skills.success || !projects.success) {
        throw new Error('Erro ao carregar dados do currículo');
      }

      const resume: Resume = {
        personalInfo: personalInfo.data!,
        experiences: experiences.data!,
        education: education.data!,
        skills: skills.data!,
        projects: projects.data!
      };

      return {
        success: true,
        data: resume,
        message: 'Currículo carregado com sucesso'
      };
    } catch (error) {
      return {
        success: false,
        error: error instanceof Error ? error.message : 'Erro desconhecido'
      };
    }
  }

  /**
   * Buscar informações pessoais
   */
  async getPersonalInfo(): Promise<ApiResponse<PersonalInfo>> {
    try {
      const result = await this.db
        .prepare('SELECT * FROM personal_info WHERE id = 1')
        .first();

      if (!result) {
        throw new Error('Informações pessoais não encontradas');
      }

      const personalInfo: PersonalInfo = {
        name: result.name,
        title: result.title,
        email: result.email,
        phone: result.phone || '',
        location: result.location || '',
        githubUrl: result.github_url || '',
        linkedinUrl: result.linkedin_url || '',
        summary: result.summary || ''
      };

      return {
        success: true,
        data: personalInfo
      };
    } catch (error) {
      return {
        success: false,
        error: error instanceof Error ? error.message : 'Erro ao buscar informações pessoais'
      };
    }
  }

  /**
   * Buscar experiências profissionais
   */
  async getExperiences(): Promise<ApiResponse<Experience[]>> {
    try {
      const result = await this.db
        .prepare('SELECT * FROM experiences ORDER BY order_index, start_date DESC')
        .all();

      const experiences: Experience[] = result.results?.map(row => ({
        company: row.company,
        position: row.position,
        startDate: row.start_date,
        endDate: row.end_date || undefined,
        location: row.location || '',
        description: row.description || '',
        technologies: row.technologies ? JSON.parse(row.technologies) : []
      })) || [];

      return {
        success: true,
        data: experiences
      };
    } catch (error) {
      return {
        success: false,
        error: error instanceof Error ? error.message : 'Erro ao buscar experiências'
      };
    }
  }

  /**
   * Buscar educação
   */
  async getEducation(): Promise<ApiResponse<Education[]>> {
    try {
      const result = await this.db
        .prepare('SELECT * FROM education ORDER BY order_index, start_date DESC')
        .all();

      const education: Education[] = result.results?.map(row => ({
        institution: row.institution,
        degree: row.degree,
        fieldOfStudy: row.field_of_study || '',
        startDate: row.start_date,
        endDate: row.end_date || undefined,
        gpa: row.gpa || undefined,
        description: row.description || undefined
      })) || [];

      return {
        success: true,
        data: education
      };
    } catch (error) {
      return {
        success: false,
        error: error instanceof Error ? error.message : 'Erro ao buscar educação'
      };
    }
  }

  /**
   * Buscar habilidades
   */
  async getSkills(): Promise<ApiResponse<Skill[]>> {
    try {
      const result = await this.db
        .prepare('SELECT * FROM skills ORDER BY category, order_index')
        .all();

      // Agrupar habilidades por categoria
      const skillsMap = new Map<string, string[]>();
      
      result.results?.forEach(row => {
        const category = row.category;
        const skillName = row.skill_name;
        
        if (!skillsMap.has(category)) {
          skillsMap.set(category, []);
        }
        skillsMap.get(category)!.push(skillName);
      });

      const skills: Skill[] = Array.from(skillsMap.entries()).map(([category, items]) => ({
        category,
        items
      }));

      return {
        success: true,
        data: skills
      };
    } catch (error) {
      return {
        success: false,
        error: error instanceof Error ? error.message : 'Erro ao buscar habilidades'
      };
    }
  }

  /**
   * Buscar projetos
   */
  async getProjects(): Promise<ApiResponse<Project[]>> {
    try {
      const result = await this.db
        .prepare('SELECT * FROM projects ORDER BY order_index, start_date DESC')
        .all();

      const projects: Project[] = result.results?.map(row => ({
        name: row.name,
        description: row.description || '',
        technologies: row.technologies ? JSON.parse(row.technologies) : [],
        githubUrl: row.github_url || undefined,
        demoUrl: row.demo_url || undefined,
        imageUrl: row.image_url || undefined
      })) || [];

      return {
        success: true,
        data: projects
      };
    } catch (error) {
      return {
        success: false,
        error: error instanceof Error ? error.message : 'Erro ao buscar projetos'
      };
    }
  }

  /**
   * Salvar alterações no banco
   */
  async saveChanges(changes: EditChange[], password?: string): Promise<ApiResponse<void>> {
    try {
      // Verificar senha se fornecida
      if (password) {
        const isValidPassword = await this.verifyAdminPassword(password);
        if (!isValidPassword) {
          return {
            success: false,
            error: 'Senha de administrador incorreta'
          };
        }
      }

      // Executar mudanças em transação
      const statements: any[] = [];
      
      for (const change of changes) {
        const statement = this.buildUpdateStatement(change);
        if (statement) {
          statements.push(statement);
        }
      }

      if (statements.length > 0) {
        await this.db.batch(statements);
      }

      return {
        success: true,
        message: `${changes.length} alterações salvas com sucesso`
      };
    } catch (error) {
      return {
        success: false,
        error: error instanceof Error ? error.message : 'Erro ao salvar alterações'
      };
    }
  }

  /**
   * Verificar senha de administrador
   */
  private async verifyAdminPassword(password: string): Promise<boolean> {
    try {
      const result = await this.db
        .prepare('SELECT value FROM settings WHERE key = ?')
        .bind('admin_password_hash')
        .first();

      // Por enquanto, comparação simples. Em produção, use hash seguro
      return result?.value === password;
    } catch (error) {
      return false;
    }
  }

  /**
   * Construir statement SQL para mudança
   */
  private buildUpdateStatement(change: EditChange): any | null {
    const { type, action, newValue } = change;

    switch (type) {
      case 'personal_info':
        return this.db.prepare(`
          UPDATE personal_info 
          SET name = ?, title = ?, email = ?, phone = ?, location = ?, 
              github_url = ?, linkedin_url = ?, summary = ?, updated_at = CURRENT_TIMESTAMP
          WHERE id = 1
        `).bind(
          newValue.name,
          newValue.title,
          newValue.email,
          newValue.phone,
          newValue.location,
          newValue.githubUrl,
          newValue.linkedinUrl,
          newValue.summary
        );

      // Adicionar cases para outros tipos conforme necessário
      default:
        return null;
    }
  }

  /**
   * Verificar conexão com o banco
   */
  async testConnection(): Promise<ApiResponse<{ timestamp: Date; version: string }>> {
    try {
      const result = await this.db
        .prepare('SELECT datetime("now") as timestamp, sqlite_version() as version')
        .first();

      return {
        success: true,
        data: {
          timestamp: new Date(),
          version: result?.version || 'unknown'
        },
        message: 'Conexão com D1 estabelecida'
      };
    } catch (error) {
      return {
        success: false,
        error: error instanceof Error ? error.message : 'Erro na conexão com D1'
      };
    }
  }
}