# 🚀 Guia Completo de Deploy - Currículo Interativo

Este guia detalha todos os passos para configurar e fazer deploy do sistema completo na Cloudflare.

## 📋 Pré-requisitos

### 1. **Conta Cloudflare**
- Crie uma conta gratuita em [cloudflare.com](https://cloudflare.com)
- Acesse o [Cloudflare Dashboard](https://dash.cloudflare.com)

### 2. **Wrangler CLI**
```bash
# Instalar globalmente
npm install -g wrangler

# Verificar instalação
wrangler --version
```

### 3. **Node.js e Git**
- Node.js 18+ [nodejs.org](https://nodejs.org)
- Git [git-scm.com](https://git-scm.com)

## 🔧 Setup Inicial

### 1. **Clonar e Configurar**
```bash
# Clonar repositório
git clone https://github.com/FelipeSabinoTMRS/curriculo-interativo.git
cd curriculo-interativo

# Instalar dependências
npm install

# Login no Cloudflare
wrangler login
```

### 2. **Executar Setup Automático**
```bash
# Linux/Mac
npm run setup:cloudflare

# Windows (manual)
wrangler d1 create curriculo-db
wrangler r2 bucket create curriculo-images
wrangler d1 execute curriculo-db --file=database/schema.sql
```

## 🗄️ Configuração do Banco D1

### 1. **Criar e Configurar**
```bash
# Criar banco
wrangler d1 create curriculo-db

# Executar migrações
wrangler d1 execute curriculo-db --file=database/schema.sql

# Verificar criação
wrangler d1 info curriculo-db
```

### 2. **Atualizar wrangler.toml**
Após criar o banco, copie o `database_id` retornado e atualize em `wrangler.toml`:
```toml
[[d1_databases]]
binding = "DB"
database_name = "curriculo-db"
database_id = "seu-database-id-aqui"  # ← Atualizar esta linha
```

### 3. **Testar Banco**
```bash
# Consultar dados
wrangler d1 execute curriculo-db --command="SELECT * FROM personal_info"

# Ver estrutura
wrangler d1 execute curriculo-db --command="SELECT name FROM sqlite_master WHERE type='table'"
```

## 📁 Configuração do R2 Storage

### 1. **Criar Bucket**
```bash
# Criar bucket
wrangler r2 bucket create curriculo-images

# Verificar criação
wrangler r2 bucket list
```

### 2. **Configurar Domínio Público (Opcional)**
No Cloudflare Dashboard:
1. R2 Object Storage → `curriculo-images`
2. Settings → Custom Domains
3. Connect Domain → `curriculo-images.r2.dev`

### 3. **Testar R2**
```bash
# Upload de teste
echo "teste" > teste.txt
wrangler r2 object put curriculo-images/teste.txt --file=teste.txt

# Listar arquivos
wrangler r2 object list curriculo-images

# Remover teste
rm teste.txt
wrangler r2 object delete curriculo-images/teste.txt
```

## 🚀 Deploy do Worker

### 1. **Build da Aplicação**
```bash
# Build para produção
npm run build
```

### 2. **Deploy**
```bash
# Deploy principal
wrangler deploy

# Ou deploy de preview
wrangler deploy --env preview
```

### 3. **Verificar Deploy**
```bash
# Ver informações do Worker
wrangler deployment list

# Monitorar logs
wrangler tail
```

## 🌐 Configuração do Pages (Opcional)

Para servir assets estáticos via Cloudflare Pages:

### 1. **Conectar Repository**
1. Cloudflare Dashboard → Pages
2. Create a project → Connect to Git
3. Selecionar repositório `curriculo-interativo`

### 2. **Configurar Build**
- **Build command**: `npm run build`
- **Build output directory**: `build/client`
- **Root directory**: `/`

### 3. **Variáveis de Ambiente**
Adicionar no Pages:
- `NODE_VERSION`: `18`
- `ENVIRONMENT`: `production`

## 🔐 Configuração de Segurança

### 1. **Atualizar Senha Admin**
Editar `database/schema.sql` antes do deploy:
```sql
INSERT OR REPLACE INTO settings (key, value, description) VALUES 
('admin_password_hash', 'sua_senha_forte_aqui', 'Hash da senha de administrador');
```

### 2. **Aplicar Alterações**
```bash
wrangler d1 execute curriculo-db --file=database/schema.sql
```

### 3. **Configurar CORS (Se necessário)**
Em `functions/[[path]].ts`, ajustar origins permitidas:
```typescript
app.use('*', cors({
  origin: ['https://seu-dominio.com', 'https://curriculo-interativo.pages.dev'],
  // ...
}));
```

## 📊 Monitoramento e Manutenção

### 1. **Logs em Tempo Real**
```bash
# Ver logs do Worker
wrangler tail

# Filtrar por erro
wrangler tail --format=pretty --status=error
```

### 2. **Métricas**
- Cloudflare Dashboard → Workers → seu-worker → Analytics
- Cloudflare Dashboard → R2 → curriculo-images → Analytics
- Cloudflare Dashboard → D1 → curriculo-db → Analytics

### 3. **Backup do Banco**
```bash
# Backup manual
wrangler d1 backup create curriculo-db

# Script automático (adicionar ao cron)
wrangler d1 backup list curriculo-db
```

## 🧪 Testes de Produção

### 1. **Testar APIs**
```bash
# Testar saúde do Worker
curl https://seu-worker.workers.dev/api/health

# Testar conexão D1
curl https://seu-worker.workers.dev/api/d1/test

# Testar conexão R2
curl https://seu-worker.workers.dev/api/r2/test
```

### 2. **Testar Interface**
1. Acesse a URL do seu Worker
2. Teste modo edição
3. Teste salvamento com senha
4. Teste impressão
5. Teste tema escuro

## 🚨 Troubleshooting

### **Erro: "Database not found"**
```bash
# Verificar se banco existe
wrangler d1 list

# Recriar se necessário
wrangler d1 create curriculo-db
```

### **Erro: "Bucket not found"**
```bash
# Verificar buckets
wrangler r2 bucket list

# Recriar se necessário
wrangler r2 bucket create curriculo-images
```

### **Erro: "Module not found"**
```bash
# Limpar e reinstalar
rm -rf node_modules package-lock.json
npm install
npm run build
```

### **Erro de CORS**
Adicionar domínio permitido em `functions/[[path]].ts`:
```typescript
app.use('*', cors({
  origin: ['https://seu-novo-dominio.com'],
  // ...
}));
```

## 📈 Otimizações de Performance

### 1. **Cache Headers**
Já configurados no Worker para:
- Assets estáticos: 1 ano
- API responses: 5 minutos
- Health check: 1 minuto

### 2. **Compressão**
Cloudflare aplica automaticamente:
- Gzip para texto
- Brotli quando suportado
- Minificação de CSS/JS

### 3. **CDN Global**
- Distribuição automática em 200+ cidades
- Edge caching inteligente
- Anycast network

## 💰 Custos Esperados

### **Cloudflare Free Tier:**
- ✅ Workers: 100.000 requests/dia
- ✅ D1: 5GB storage, 25M reads/mês
- ✅ R2: 10GB storage, 1M operations/mês
- ✅ Pages: Unlimited sites

### **Estimativa para Currículo:**
- **Desenvolvimento**: R$ 0/mês (Free tier)
- **Produção baixo volume**: R$ 0-15/mês
- **Produção alto volume**: R$ 50-200/mês

## 🎯 Próximos Passos

1. **Domínio Personalizado**
   - Comprar domínio
   - Configurar DNS no Cloudflare
   - Habilitar SSL

2. **Monitoramento Avançado**
   - Configurar alertas
   - Integrar com Sentry
   - Setup de uptime monitoring

3. **Backup Automático**
   - Script de backup diário
   - Versionamento de dados
   - Recuperação de desastres

---

## 📞 Suporte

**Documentação:**
- [Cloudflare Workers](https://developers.cloudflare.com/workers/)
- [Cloudflare D1](https://developers.cloudflare.com/d1/)
- [Cloudflare R2](https://developers.cloudflare.com/r2/)

**Issues:**
- [GitHub Issues](https://github.com/FelipeSabinoTMRS/curriculo-interativo/issues)

**Contato:**
- Felipe Sabino - [GitHub](https://github.com/FelipeSabinoTMRS)

---

✨ **Parabéns! Seu currículo interativo está pronto para impressionar recrutadores!** 🚀