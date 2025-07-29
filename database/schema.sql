-- Esquema do banco de dados para o currículo interativo
-- Cloudflare D1 Database

-- Tabela para informações pessoais
CREATE TABLE IF NOT EXISTS personal_info (
    id INTEGER PRIMARY KEY AUTOINCREMENT,
    name TEXT NOT NULL,
    title TEXT NOT NULL,
    email TEXT NOT NULL,
    phone TEXT,
    location TEXT,
    github_url TEXT,
    linkedin_url TEXT,
    website_url TEXT,
    summary TEXT,
    created_at DATETIME DEFAULT CURRENT_TIMESTAMP,
    updated_at DATETIME DEFAULT CURRENT_TIMESTAMP
);

-- Tabela para experiências profissionais
CREATE TABLE IF NOT EXISTS experiences (
    id INTEGER PRIMARY KEY AUTOINCREMENT,
    company TEXT NOT NULL,
    position TEXT NOT NULL,
    start_date TEXT NOT NULL,
    end_date TEXT,
    location TEXT,
    description TEXT,
    technologies TEXT, -- JSON array as text
    order_index INTEGER DEFAULT 0,
    created_at DATETIME DEFAULT CURRENT_TIMESTAMP,
    updated_at DATETIME DEFAULT CURRENT_TIMESTAMP
);

-- Tabela para educação
CREATE TABLE IF NOT EXISTS education (
    id INTEGER PRIMARY KEY AUTOINCREMENT,
    institution TEXT NOT NULL,
    degree TEXT NOT NULL,
    field_of_study TEXT,
    start_date TEXT NOT NULL,
    end_date TEXT,
    gpa TEXT,
    description TEXT,
    order_index INTEGER DEFAULT 0,
    created_at DATETIME DEFAULT CURRENT_TIMESTAMP,
    updated_at DATETIME DEFAULT CURRENT_TIMESTAMP
);

-- Tabela para habilidades
CREATE TABLE IF NOT EXISTS skills (
    id INTEGER PRIMARY KEY AUTOINCREMENT,
    category TEXT NOT NULL,
    skill_name TEXT NOT NULL,
    proficiency_level INTEGER DEFAULT 1, -- 1-5 scale
    order_index INTEGER DEFAULT 0,
    created_at DATETIME DEFAULT CURRENT_TIMESTAMP,
    updated_at DATETIME DEFAULT CURRENT_TIMESTAMP
);

-- Tabela para projetos
CREATE TABLE IF NOT EXISTS projects (
    id INTEGER PRIMARY KEY AUTOINCREMENT,
    name TEXT NOT NULL,
    description TEXT,
    technologies TEXT, -- JSON array as text
    github_url TEXT,
    demo_url TEXT,
    image_url TEXT,
    start_date TEXT,
    end_date TEXT,
    status TEXT DEFAULT 'completed', -- completed, in_progress, planned
    order_index INTEGER DEFAULT 0,
    created_at DATETIME DEFAULT CURRENT_TIMESTAMP,
    updated_at DATETIME DEFAULT CURRENT_TIMESTAMP
);

-- Tabela para configurações do sistema
CREATE TABLE IF NOT EXISTS settings (
    id INTEGER PRIMARY KEY AUTOINCREMENT,
    key TEXT UNIQUE NOT NULL,
    value TEXT,
    description TEXT,
    created_at DATETIME DEFAULT CURRENT_TIMESTAMP,
    updated_at DATETIME DEFAULT CURRENT_TIMESTAMP
);

-- Tabela para sessões de edição (controle de acesso)
CREATE TABLE IF NOT EXISTS edit_sessions (
    id INTEGER PRIMARY KEY AUTOINCREMENT,
    session_token TEXT UNIQUE NOT NULL,
    ip_address TEXT,
    user_agent TEXT,
    expires_at DATETIME NOT NULL,
    created_at DATETIME DEFAULT CURRENT_TIMESTAMP
);

-- Inserir dados padrão
INSERT OR REPLACE INTO personal_info (id, name, title, email, phone, location, github_url, linkedin_url, summary) VALUES 
(1, 'Felipe Sabino', 'Desenvolvedor Full Stack', 'felipe@exemplo.com', '+55 (11) 99999-9999', 'São Paulo, SP', 'https://github.com/FelipeSabinoTMRS', 'https://linkedin.com/in/felipe-sabino', 'Desenvolvedor apaixonado por tecnologia com experiência em desenvolvimento web moderno.');

-- Inserir configurações padrão
INSERT OR REPLACE INTO settings (key, value, description) VALUES 
('admin_password_hash', 'teste', 'Hash da senha de administrador'),
('theme_default', 'light', 'Tema padrão da aplicação'),
('editable_mode', 'false', 'Modo de edição habilitado por padrão'),
('backup_interval', '24', 'Intervalo de backup em horas');

-- Índices para performance
CREATE INDEX IF NOT EXISTS idx_experiences_order ON experiences(order_index);
CREATE INDEX IF NOT EXISTS idx_education_order ON education(order_index);
CREATE INDEX IF NOT EXISTS idx_skills_category ON skills(category);
CREATE INDEX IF NOT EXISTS idx_projects_status ON projects(status);
CREATE INDEX IF NOT EXISTS idx_projects_order ON projects(order_index);
CREATE INDEX IF NOT EXISTS idx_settings_key ON settings(key);
CREATE INDEX IF NOT EXISTS idx_edit_sessions_token ON edit_sessions(session_token);
CREATE INDEX IF NOT EXISTS idx_edit_sessions_expires ON edit_sessions(expires_at);