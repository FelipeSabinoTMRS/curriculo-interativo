# Configuração Cloudflare - Currículo Interativo

## 🔧 Setup Inicial

### 1. Banco de Dados D1

1. **Criar Database**:
   ```bash
   npx wrangler d1 create curriculo-api
   ```

2. **Anotar o Database ID** que será retornado e atualizar `wrangler.toml`

3. **Criar as Tabelas**:
   ```bash
   npx wrangler d1 execute curriculo-api --file=./schema.sql
   ```

### 2. Storage R2

1. **Criar Bucket**:
   ```bash
   npx wrangler r2 bucket create curriculo-images
   ```

2. **Configurar CORS** (se necessário para acesso público):
   ```bash
   npx wrangler r2 bucket cors put curriculo-images --file=cors.json
   ```

## 📋 Arquivos de Configuração

### wrangler.toml
```toml
name = "curriculo-interativo"
compatibility_date = "2024-01-01"
pages_build_output_dir = "./build/client"

[env.development]
name = "curriculo-interativo-dev"

[[env.development.d1_databases]]
binding = "DB"
database_name = "curriculo-api"
database_id = "SEU-DATABASE-ID-DEV"

[[env.development.r2_buckets]]
binding = "R2"
bucket_name = "curriculo-images-dev"

[env.production]
name = "curriculo-interativo"

[[env.production.d1_databases]]
binding = "DB"
database_name = "curriculo-api"
database_id = "SEU-DATABASE-ID-PROD"

[[env.production.r2_buckets]]
binding = "R2"
bucket_name = "curriculo-images"
```

### schema.sql
```sql
CREATE TABLE IF NOT EXISTS personal_info (
  id INTEGER PRIMARY KEY AUTOINCREMENT,
  name TEXT NOT NULL,
  title TEXT NOT NULL,
  email TEXT NOT NULL,
  phone TEXT NOT NULL,
  location TEXT NOT NULL,
  profile_image TEXT,
  background_image TEXT,
  summary TEXT NOT NULL,
  github_url TEXT,
  created_at DATETIME DEFAULT CURRENT_TIMESTAMP,
  updated_at DATETIME DEFAULT CURRENT_TIMESTAMP
);

CREATE TABLE IF NOT EXISTS experiences (
  id INTEGER PRIMARY KEY AUTOINCREMENT,
  company TEXT NOT NULL,
  position TEXT NOT NULL,
  start_date TEXT NOT NULL,
  end_date TEXT,
  description TEXT NOT NULL,
  technologies TEXT NOT NULL,
  created_at DATETIME DEFAULT CURRENT_TIMESTAMP
);

CREATE TABLE IF NOT EXISTS education (
  id INTEGER PRIMARY KEY AUTOINCREMENT,
  institution TEXT NOT NULL,
  degree TEXT NOT NULL,
  field TEXT NOT NULL,
  start_date TEXT NOT NULL,
  end_date TEXT,
  description TEXT,
  created_at DATETIME DEFAULT CURRENT_TIMESTAMP
);

CREATE TABLE IF NOT EXISTS skills (
  id INTEGER PRIMARY KEY AUTOINCREMENT,
  name TEXT NOT NULL,
  category TEXT NOT NULL,
  level INTEGER NOT NULL,
  created_at DATETIME DEFAULT CURRENT_TIMESTAMP
);

CREATE TABLE IF NOT EXISTS projects (
  id INTEGER PRIMARY KEY AUTOINCREMENT,
  name TEXT NOT NULL,
  description TEXT NOT NULL,
  technologies TEXT NOT NULL,
  url TEXT,
  github_url TEXT,
  created_at DATETIME DEFAULT CURRENT_TIMESTAMP
);
```

### cors.json (para R2)
```json
{
  "cors": [
    {
      "allowedOrigins": ["*"],
      "allowedMethods": ["GET", "POST", "PUT", "DELETE"],
      "allowedHeaders": ["*"],
      "exposeHeaders": ["*"],
      "maxAgeSeconds": 3600
    }
  ]
}
```

## 🚀 Deploy

### 1. Deploy Inicial
```bash
npm run build
npx wrangler pages deploy ./build/client
```

### 2. Configurar Variáveis
No dashboard do Cloudflare Pages, configure:
- Database binding: `DB` → seu database D1
- R2 binding: `R2` → seu bucket R2

### 3. Configurar Domínio (Opcional)
1. Vá para Pages → seu projeto → Custom domains
2. Adicione seu domínio personalizado

## 🔍 Teste Local com Cloudflare

### Desenvolvimento Local
```bash
npx wrangler pages dev ./build/client --d1=DB:curriculo-api --r2=R2:curriculo-images
```

### Teste D1
```bash
npx wrangler d1 execute curriculo-api --command="SELECT * FROM personal_info"
```

### Teste R2
```bash
npx wrangler r2 object list curriculo-images
```

## 🛠️ Comandos Úteis

### D1 Database
```bash
# Executar consulta
npx wrangler d1 execute curriculo-api --command="SELECT COUNT(*) FROM personal_info"

# Backup
npx wrangler d1 export curriculo-api --output=backup.sql

# Importar dados
npx wrangler d1 execute curriculo-api --file=dados.sql
```

### R2 Storage
```bash
# Listar objetos
npx wrangler r2 object list curriculo-images

# Upload arquivo
npx wrangler r2 object put curriculo-images/test.jpg --file=./test.jpg

# Download arquivo
npx wrangler r2 object get curriculo-images/test.jpg --file=./downloaded.jpg

# Deletar arquivo
npx wrangler r2 object delete curriculo-images/test.jpg
```

## 🔐 Segurança

### D1
- Dados são privados por padrão
- Acesso apenas via Workers/Functions
- Backup automático

### R2
- Configure CORS se necessário
- Use signed URLs para uploads
- Configure TTL para cache

## 📊 Monitoramento

### Analytics
- Vá para Cloudflare Dashboard → Analytics
- Monitore requests, performance, erros

### Logs
```bash
npx wrangler pages deployment tail
```

## 🚨 Troubleshooting

### Erro: Database não encontrada
- Verifique o database ID no wrangler.toml
- Confirme se o database foi criado
- Teste com `npx wrangler d1 list`

### Erro: R2 bucket não encontrado
- Verifique o nome do bucket
- Confirme as permissões
- Teste com `npx wrangler r2 bucket list`

### Erro: Build falha
- Execute `npm run build` localmente
- Verifique logs de deploy
- Confirme todas as dependências

---

*Para mais informações, consulte a [documentação oficial do Cloudflare](https://developers.cloudflare.com/)* 