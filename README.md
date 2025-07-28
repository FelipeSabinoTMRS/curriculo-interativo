# Currículo Desenvolvido do Zero 💙

Um sistema interativo de currículo desenvolvido com tecnologias modernas para demonstrar competências técnicas aos recrutadores.

## 🚀 Sobre o Projeto

Este projeto foi criado para mostrar aos recrutadores que o currículo não é apenas um PDF estático, mas sim uma aplicação web completa desenvolvida do zero. O sistema permite:

- ✨ Visualização interativa do currículo
- 🖼️ Gerenciamento de imagens de perfil e fundo (em desenvolvimento)
- 🎨 Interface moderna com design inspirado em IA
- 🖨️ Impressão otimizada para PDF
- 🔧 Painel de debug para mostrar integração com banco de dados
- 📱 Design responsivo

## 🛠️ Tecnologias Utilizadas

- **Frontend**: [React Router](https://reactrouter.com/) v7 + TypeScript
- **Styling**: [Tailwind CSS](https://tailwindcss.com/)
- **Database**: [Cloudflare D1](https://developers.cloudflare.com/d1/) (configuração pendente)
- **Storage**: [Cloudflare R2](https://developers.cloudflare.com/r2/) (configuração pendente)
- **Deploy**: [Cloudflare Pages](https://pages.cloudflare.com/)
- **Icons**: [Lucide React](https://lucide.dev/)

## 🎨 Design

O design utiliza um esquema de cores azul inspirado em inteligência artificial, com:
- Gradientes suaves
- Transparências e blur effects
- Animações fluidas
- Layout responsivo com currículo centralizado
- Painéis laterais para controles e gerenciamento

## 📋 Funcionalidades

### ✅ Implementadas
- Layout responsivo com design IA
- Visualização de currículo estilo papel A4
- Painel de controles laterais
- Debug panel para status do sistema
- Impressão otimizada (Ctrl+P)
- TypeScript completo
- Tailwind CSS com tema personalizado

### 🚧 Em Desenvolvimento
- Integração com Cloudflare D1
- Sistema de upload de imagens com R2
- Modo de edição do currículo
- Persistência de dados

## 🚦 Como Executar

### Pré-requisitos
- Node.js 18+
- npm ou yarn

### Instalação

1. Clone o repositório:
```bash
git clone https://github.com/FelipeSabinoTMRS/curriculo_dev.git
cd curriculo_dev
```

2. Instale as dependências:
```bash
npm install
```

3. Execute em desenvolvimento:
```bash
npm run dev
```

### Build para produção

```bash
npm run build
```

### Deploy para Cloudflare Pages

```bash
npm run deploy
```

## 📊 Estrutura do Projeto

```
curriculo-interativo/
├── app/
│   ├── components/          # Componentes React
│   │   ├── ResumeViewer.tsx
│   │   ├── ControlPanel.tsx
│   │   └── DebugPanel.tsx
│   ├── routes/              # Rotas do React Router
│   │   └── _index.tsx
│   ├── styles/              # Estilos CSS
│   │   └── globals.css
│   ├── types/               # Tipos TypeScript
│   │   └── index.ts
│   └── root.tsx
├── functions/               # Cloudflare Functions
├── public/                  # Arquivos estáticos
└── package.json
```

## 💡 Conceito

Este projeto demonstra:

1. **Competência Técnica**: Uso de tecnologias modernas e melhores práticas
2. **Experiência do Usuário**: Interface intuitiva e design atrativo
3. **Arquitetura**: Estrutura de código bem organizada e escalável
4. **Evolução Tecnológica**: Migração do Remix para React Router v7
5. **Atenção aos Detalhes**: Funcionalidade de impressão, responsividade, etc.

## 🔄 Versões

- **v1.0**: Implementação inicial com Remix
- **v2.0**: Migração para React Router v7 + Cloudflare Workers template

## 🔒 Privacidade

- As alterações feitas pelos recrutadores são apenas locais
- O estado original sempre é preservado
- Dados sensíveis não são expostos

## 📞 Contato

Felipe Sabino - [GitHub](https://github.com/FelipeSabinoTMRS)

---

*Este projeto foi desenvolvido como parte de uma estratégia inovadora para demonstrar habilidades técnicas de forma prática e interativa aos recrutadores.* 