#!/bin/bash

# Script para configurar Cloudflare Workers
# Uso: ./scripts/setup-cloudflare.sh

set -e

echo "🚀 Configurando ambiente Cloudflare Workers..."

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

echo ""
print_success "Configuração concluída!"

echo ""
echo "📋 PRÓXIMOS PASSOS:"
echo ""
echo "1. 📦 Execute: npm run build"
echo "2. 🚀 Execute: npm run deploy"
echo "3. 🌐 Acesse sua aplicação na URL fornecida pelo Worker"
echo ""
echo "💡 COMANDOS ÚTEIS:"
echo "   - Deploy: wrangler deploy"
echo "   - Logs: wrangler tail"
echo "   - Whoami: wrangler whoami"
echo ""