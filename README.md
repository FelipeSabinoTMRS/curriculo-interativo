# 📄 Currículo Interativo

Um sistema de currículo moderno, responsivo e interativo desenvolvido com **Remix**, **Cloudflare Workers**, **D1 Database** e **R2 Storage**.

## ✨ Funcionalidades

### 🎨 **Interface e Experiência**
- ✅ **Responsive Design** - Adaptação automática para diferentes tamanhos de tela
- ✅ **Tema Claro/Escuro** - Chave animada moderna estilo IA
- ✅ **Impressão Otimizada** - Layout A4 perfeito para impressão
- ✅ **Escalamento Inteligente** - Zoom automático baseado na largura da tela
- ✅ **Debug Panel Fixo** - Painel de debug que não rola com a página

### 📝 **Sistema de Edição**
- ✅ **Edição Local** - Edite textos diretamente na interface
- ✅ **Campos Editáveis** - Clique para editar qualquer campo
- ✅ **Indicador de Alterações** - Visual feedback para alterações não salvas
- ✅ **Dialogs Flutuantes** - Sistema moderno de notificações
- ✅ **Salvamento com Senha** - Proteção para alterações permanentes

### ☁️ **Infraestrutura Cloudflare**
- ✅ **D1 Database** - Banco SQL serverless para dados do currículo
- ✅ **R2 Storage** - Armazenamento de imagens e arquivos
- ✅ **Workers** - API serverless com alta performance
- ✅ **Pages Deploy** - Deploy automático e CDN global

### 🔧 **Recursos Técnicos**
- ✅ **TypeScript** - Tipagem completa e robusta
- ✅ **Tailwind CSS** - Estilização utilitária e responsiva
- ✅ **React Hooks** - Estado e efeitos modernos
- ✅ **API RESTful** - Endpoints organizados para todas as funcionalidades

## 🚀 Deploy Rápido

### 1. **Configuração Cloudflare**
```bash
# Instalar Wrangler (se não tiver)
npm install -g wrangler

# Login no Cloudflare
npm run cf:login

# Configurar recursos automaticamente
npm run setup:cloudflare
```

### 2. **Banco de Dados**
```bash
# Criar banco D1
npm run db:create

# Executar migrações
npm run db:migrate

# Verificar dados
npm run db:studio
```

### 3. **Deploy**
```bash
# Build e deploy
npm run build
npm run deploy

# Ou preview
npm run deploy:preview
```

## 🛠️ Desenvolvimento Local

### **Pré-requisitos**
- Node.js 18+
- Conta Cloudflare (gratuita)
- Wrangler CLI

### **Instalação**
```bash
# Clonar repositório
git clone https://github.com/FelipeSabinoTMRS/curriculo-interativo.git
cd curriculo-interativo

# Instalar dependências
npm install

# Configurar Cloudflare
npm run setup:cloudflare

# Executar desenvolvimento
npm run dev
```

### **Estrutura do Projeto**
```
curriculo-interativo/
├── app/                     # Aplicação Remix
│   ├── components/         # Componentes React
│   │   ├── ResumeViewer.tsx   # Visualizador editável
│   │   ├── TopBar.tsx         # Barra superior
│   │   ├── DebugPanel.tsx     # Painel de debug
│   │   └── Dialog.tsx         # Sistema de dialogs
│   ├── services/           # Serviços de integração
│   │   ├── database.ts        # Serviço D1
│   │   └── storage.ts         # Serviço R2
│   ├── hooks/              # Hooks customizados
│   │   └── useDialog.ts       # Hook para dialogs
│   └── types/              # Definições TypeScript
├── functions/              # Cloudflare Workers
│   └── [[path]].ts           # Worker principal
├── database/               # Scripts de banco
│   ├── schema.sql            # Schema D1
│   └── migrate.js            # Script de migração
├── scripts/                # Scripts de automação
│   └── setup-cloudflare.sh   # Setup automático
└── wrangler.toml           # Configuração Cloudflare
```

## 📋 Scripts Disponíveis

### **Desenvolvimento**
```bash
npm run dev          # Servidor de desenvolvimento
npm run build        # Build para produção
npm run typecheck    # Verificação TypeScript
```

### **Cloudflare**
```bash
npm run deploy       # Deploy para produção
npm run logs         # Ver logs do Worker
npm run cf:whoami    # Verificar conta logada
```

### **Banco D1**
```bash
npm run db:create    # Criar banco
npm run db:migrate   # Executar migrações
npm run db:studio    # Abrir interface do banco
npm run db:backup    # Fazer backup
```

### **Storage R2**
```bash
npm run r2:create    # Criar bucket
npm run r2:list      # Listar buckets
```

## 🎯 Como Usar

### **1. Modo Visualização**
- Acesse o currículo em modo somente leitura
- Use a chave tema para alternar claro/escuro
- Clique em "Imprimir" para gerar PDF

### **2. Modo Edição Local**
- Clique em "Editar Localmente"
- Clique em qualquer texto para editar
- Alterações ficam apenas no navegador
- Use "Finalizar Edição" para descartar

### **3. Salvamento Permanente**
- Após editar, clique em "Salvar Padrão"
- Digite a senha de administrador: `teste`
- Alterações são salvas no banco D1

### **4. Debug Panel**
- Painel fixo no canto superior direito
- Monitora conexões D1 e R2
- Botões para conectar/desconectar serviços
- Informações de status em tempo real

## 🔧 Configurações Avançadas

### **Personalizar Senha Admin**
Edite em `database/schema.sql`:
```sql
INSERT OR REPLACE INTO settings (key, value, description) VALUES 
('admin_password_hash', 'sua_senha_aqui', 'Hash da senha de administrador');
```

### **Configurar R2 Público**
No Cloudflare Dashboard:
1. Vá para R2 → seu bucket
2. Configurar → Domínio personalizado
3. Adicionar `curriculo-images.r2.dev`

### **Variáveis de Ambiente**
Edite em `wrangler.toml`:
```toml
[vars]
ENVIRONMENT = "production"
ADMIN_EMAIL = "seu@email.com"
```

## 📊 APIs Disponíveis

### **Currículo**
- `GET /api/resume` - Buscar currículo completo
- `GET /api/resume/personal` - Informações pessoais
- `POST /api/resume/save` - Salvar alterações

### **Storage**
- `GET /api/r2/stats` - Estatísticas do R2
- `POST /api/r2/upload/profile` - Upload de foto
- `GET /api/r2/files` - Listar arquivos

### **Debug**
- `GET /api/debug/status` - Status dos serviços
- `GET /api/health` - Saúde do Worker

## 🤝 Contribuição

1. Fork o projeto
2. Crie uma branch: `git checkout -b feature/nova-funcionalidade`
3. Commit: `git commit -m 'Adiciona nova funcionalidade'`
4. Push: `git push origin feature/nova-funcionalidade`
5. Abra um Pull Request

## 📄 Licença

Este projeto está sob a licença MIT. Veja o arquivo `LICENSE` para mais detalhes.

## 🎯 Roadmap

- [ ] **Autenticação OAuth** - Login com GitHub/Google
- [ ] **Templates** - Múltiplos layouts de currículo
- [ ] **Exportação** - PDF, Word, LinkedIn
- [ ] **Analytics** - Métricas de visualização
- [ ] **Comentários** - Sistema de feedback
- [ ] **Versionamento** - Histórico de alterações

---

**Desenvolvido com ❤️ por [Felipe Sabino](https://github.com/FelipeSabinoTMRS)**

🌟 **Se este projeto foi útil, deixe uma estrela!** 