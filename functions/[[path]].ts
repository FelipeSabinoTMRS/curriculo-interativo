/**
 * Cloudflare Worker para o Currículo Interativo
 * Gerencia APIs para D1, R2 e funcionalidades do sistema
 */

import { Hono } from 'hono';
import { cors } from 'hono/cors';
import { DatabaseService } from '../app/services/database';
import { StorageService } from '../app/services/storage';
import type { WorkerEnv, ApiResponse, EditChange } from '../app/types';

type Variables = {
  dbService: DatabaseService;
  storageService: StorageService;
};

const app = new Hono<{ Bindings: WorkerEnv; Variables: Variables }>();

// CORS middleware
app.use('*', cors({
  origin: ['http://localhost:3000', 'https://*.pages.dev'],
  allowHeaders: ['Content-Type', 'Authorization'],
  allowMethods: ['GET', 'POST', 'PUT', 'DELETE', 'OPTIONS'],
}));

// Middleware para inicializar serviços
app.use('*', async (c, next) => {
  const dbService = new DatabaseService(c.env.DB);
  const storageService = new StorageService(c.env.R2, 'curriculo-images');
  
  c.set('dbService', dbService);
  c.set('storageService', storageService);
  
  await next();
});

// === ROTAS DE SAÚDE ===

app.get('/api/health', async (c) => {
  return c.json({
    success: true,
    message: 'Worker online',
    timestamp: new Date().toISOString(),
    environment: c.env.ENVIRONMENT || 'development'
  });
});

// === ROTAS DO BANCO D1 ===

// Testar conexão D1
app.get('/api/d1/test', async (c) => {
  const dbService = c.get('dbService');
  const result = await dbService.testConnection();
  return c.json(result);
});

// Buscar currículo completo
app.get('/api/resume', async (c) => {
  const dbService = c.get('dbService');
  const result = await dbService.getResume();
  return c.json(result);
});

// Buscar informações pessoais
app.get('/api/resume/personal', async (c) => {
  const dbService = c.get('dbService');
  const result = await dbService.getPersonalInfo();
  return c.json(result);
});

// Buscar experiências
app.get('/api/resume/experiences', async (c) => {
  const dbService = c.get('dbService');
  const result = await dbService.getExperiences();
  return c.json(result);
});

// Buscar educação
app.get('/api/resume/education', async (c) => {
  const dbService = c.get('dbService');
  const result = await dbService.getEducation();
  return c.json(result);
});

// Buscar habilidades
app.get('/api/resume/skills', async (c) => {
  const dbService = c.get('dbService');
  const result = await dbService.getSkills();
  return c.json(result);
});

// Buscar projetos
app.get('/api/resume/projects', async (c) => {
  const dbService = c.get('dbService');
  const result = await dbService.getProjects();
  return c.json(result);
});

// Salvar alterações (requer senha)
app.post('/api/resume/save', async (c) => {
  try {
    const body = await c.req.json();
    const { changes, password } = body;
    
    if (!changes || !Array.isArray(changes)) {
      return c.json({
        success: false,
        error: 'Changes array é obrigatório'
      }, 400);
    }

    const dbService = c.get('dbService');
    const result = await dbService.saveChanges(changes, password);
    
    return c.json(result);
  } catch (error) {
    return c.json({
      success: false,
      error: 'Erro ao processar requisição'
    }, 500);
  }
});

// === ROTAS DO R2 STORAGE ===

// Testar conexão R2
app.get('/api/r2/test', async (c) => {
  const storageService = c.get('storageService');
  const result = await storageService.testConnection();
  return c.json(result);
});

// Estatísticas do R2
app.get('/api/r2/stats', async (c) => {
  const storageService = c.get('storageService');
  const result = await storageService.getBucketStats();
  return c.json(result);
});

// Listar arquivos
app.get('/api/r2/files', async (c) => {
  const prefix = c.req.query('prefix');
  const limit = parseInt(c.req.query('limit') || '100');
  
  const storageService = c.get('storageService');
  const result = await storageService.listFiles(prefix, limit);
  return c.json(result);
});

// Upload de imagem de perfil
app.post('/api/r2/upload/profile', async (c) => {
  try {
    const formData = await c.req.formData();
    const file = formData.get('file') as File;
    
    if (!file) {
      return c.json({
        success: false,
        error: 'Arquivo não encontrado'
      }, 400);
    }

    const storageService = c.get('storageService');
    const result = await storageService.uploadProfileImage(file);
    
    return c.json(result);
  } catch (error) {
    return c.json({
      success: false,
      error: 'Erro no upload da imagem'
    }, 500);
  }
});

// Upload de imagem de projeto
app.post('/api/r2/upload/project/:projectId', async (c) => {
  try {
    const projectId = c.req.param('projectId');
    const formData = await c.req.formData();
    const file = formData.get('file') as File;
    
    if (!file) {
      return c.json({
        success: false,
        error: 'Arquivo não encontrado'
      }, 400);
    }

    const storageService = c.get('storageService');
    const result = await storageService.uploadProjectImage(file, projectId);
    
    return c.json(result);
  } catch (error) {
    return c.json({
      success: false,
      error: 'Erro no upload da imagem'
    }, 500);
  }
});

// Download de arquivo
app.get('/api/r2/file/:key', async (c) => {
  try {
    const key = c.req.param('key');
    const storageService = c.get('storageService');
    const result = await storageService.getFile(key);
    
    if (!result.success) {
      return c.json(result, 404);
    }

    const object = result.data!;
    
    return new Response(object.body, {
      headers: {
        'Content-Type': object.httpMetadata?.contentType || 'application/octet-stream',
        'Content-Length': object.size.toString(),
        'ETag': object.etag,
        'Last-Modified': object.uploaded.toUTCString(),
      },
    });
  } catch (error) {
    return c.json({
      success: false,
      error: 'Erro ao buscar arquivo'
    }, 500);
  }
});

// Deletar arquivo
app.delete('/api/r2/file/:key', async (c) => {
  try {
    const key = c.req.param('key');
    const storageService = c.get('storageService');
    const result = await storageService.deleteFile(key);
    
    return c.json(result);
  } catch (error) {
    return c.json({
      success: false,
      error: 'Erro ao deletar arquivo'
    }, 500);
  }
});

// === ROTAS DE AUTENTICAÇÃO E SESSÃO ===

// Validar senha de administrador
app.post('/api/auth/validate', async (c) => {
  try {
    const body = await c.req.json();
    const { password } = body;
    
    if (!password) {
      return c.json({
        success: false,
        error: 'Senha é obrigatória'
      }, 400);
    }

    // Por enquanto, verificação simples
    const isValid = password === 'teste';
    
    return c.json({
      success: true,
      data: {
        valid: isValid,
        token: isValid ? `token_${Date.now()}` : null
      },
      message: isValid ? 'Senha válida' : 'Senha incorreta'
    });
  } catch (error) {
    return c.json({
      success: false,
      error: 'Erro na validação'
    }, 500);
  }
});

// === ROTAS DE DEBUG ===

// Informações do ambiente
app.get('/api/debug/info', async (c) => {
  return c.json({
    success: true,
    data: {
      environment: c.env.ENVIRONMENT || 'development',
      timestamp: new Date().toISOString(),
      userAgent: c.req.header('User-Agent'),
      cf: c.req.raw.cf || 'Not available',
    }
  });
});

// Status dos serviços
app.get('/api/debug/status', async (c) => {
  const dbService = c.get('dbService');
  const storageService = c.get('storageService');
  
  const [dbStatus, r2Status] = await Promise.all([
    dbService.testConnection(),
    storageService.testConnection()
  ]);
  
  return c.json({
    success: true,
    data: {
      d1: {
        connected: dbStatus.success,
        error: dbStatus.error
      },
      r2: {
        connected: r2Status.success,
        error: r2Status.error
      },
      timestamp: new Date().toISOString()
    }
  });
});

// === TRATAMENTO DE ERROS ===

app.onError((err, c) => {
  console.error('Worker Error:', err);
  
  return c.json({
    success: false,
    error: 'Erro interno do servidor',
    timestamp: new Date().toISOString()
  }, 500);
});

// === ROTAS NÃO ENCONTRADAS ===

app.notFound((c) => {
  return c.json({
    success: false,
    error: 'Rota não encontrada',
    path: c.req.path,
    method: c.req.method
  }, 404);
});

export default app;
