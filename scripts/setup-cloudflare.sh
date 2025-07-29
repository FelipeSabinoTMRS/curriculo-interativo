#!/bin/bash

# Script para configurar Cloudflare D1, R2 e Workers
# Uso: ./scripts/setup-cloudflare.sh

set -e

echo "🚀 Configurando ambiente Cloudflare..."

# Cores para output
RED='\033[0;31m'
GREEN='\033[0;32m'
YELLOW='\033[1;33m'
BLUE='\033[0;34m'
NC='\033[0m' # No Color

# Função para imprimir com cores
print_status() {
    echo -e "${BLUE}[INFO]${NC} $1"
}

print_success() {
    echo -e "${GREEN}[SUCCESS]${NC} $1"
}

print_warning() {
    echo -e "${YELLOW}[WARNING]${NC} $1"
}

print_error() {
    echo -e "${RED}[ERROR]${NC} $1"
}

# Verificar se wrangler está instalado
if ! command -v wrangler &> /dev/null; then
    print_error "Wrangler CLI não está instalado!"
    echo "Instale com: npm install -g wrangler"
    exit 1
fi

print_success "Wrangler CLI encontrado"

# Verificar se está logado
print_status "Verificando autenticação..."
if ! wrangler whoami &> /dev/null; then
    print_warning "Não autenticado no Cloudflare"
    print_status "Iniciando processo de login..."
    wrangler login
fi

print_success "Autenticado no Cloudflare"

# Criar banco D1
print_status "Criando banco de dados D1..."
if wrangler d1 create curriculo-db; then
    print_success "Banco D1 'curriculo-db' criado com sucesso"
else
    print_warning "Banco D1 pode já existir, continuando..."
fi

# Criar bucket R2
print_status "Criando bucket R2..."
if wrangler r2 bucket create curriculo-images; then
    print_success "Bucket R2 'curriculo-images' criado com sucesso"
else
    print_warning "Bucket R2 pode já existir, continuando..."
fi

# Executar migrações do banco
print_status "Executando migrações do banco..."
if [ -f "database/schema.sql" ]; then
    wrangler d1 execute curriculo-db --file=database/schema.sql
    print_success "Migrações executadas com sucesso"
else
    print_error "Arquivo de schema não encontrado!"
    exit 1
fi

# Obter informações dos recursos criados
print_status "Obtendo informações dos recursos..."

echo ""
echo "=== INFORMAÇÕES DOS RECURSOS ==="
echo ""

print_status "Banco D1:"
wrangler d1 info curriculo-db

echo ""
print_status "Bucket R2:"
wrangler r2 bucket list | grep curriculo-images || echo "Bucket curriculo-images criado"

echo ""
print_success "Configuração concluída!"

echo ""
echo "📋 PRÓXIMOS PASSOS:"
echo ""
echo "1. 🔧 Atualize o wrangler.toml com o database_id correto"
echo "2. 📦 Execute: npm run build"
echo "3. 🚀 Execute: npm run deploy"
echo "4. 🌐 Acesse sua aplicação na URL fornecida pelo Worker"
echo ""
echo "💡 COMANDOS ÚTEIS:"
echo "   - Ver dados: wrangler d1 execute curriculo-db --command='SELECT * FROM personal_info'"
echo "   - Listar buckets: wrangler r2 bucket list"
echo "   - Deploy: wrangler deploy"
echo "   - Logs: wrangler tail"
echo ""