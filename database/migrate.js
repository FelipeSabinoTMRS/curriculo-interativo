#!/usr/bin/env node

/**
 * Script para executar migrações no Cloudflare D1
 * Uso: node database/migrate.js
 */

const fs = require('fs');
const path = require('path');
const { exec } = require('child_process');

const SCHEMA_FILE = path.join(__dirname, 'schema.sql');

async function executeMigration() {
  try {
    console.log('🚀 Iniciando migração do banco D1...');
    
    // Verificar se o arquivo de schema existe
    if (!fs.existsSync(SCHEMA_FILE)) {
      throw new Error(`Arquivo de schema não encontrado: ${SCHEMA_FILE}`);
    }
    
    // Ler o schema SQL
    const schema = fs.readFileSync(SCHEMA_FILE, 'utf8');
    console.log('📖 Schema carregado com sucesso');
    
    // Executar migração usando wrangler
    const command = `wrangler d1 execute curriculo-db --file=${SCHEMA_FILE}`;
    
    console.log('⚡ Executando migração...');
    console.log(`Comando: ${command}`);
    
    exec(command, (error, stdout, stderr) => {
      if (error) {
        console.error('❌ Erro ao executar migração:', error);
        return;
      }
      
      if (stderr) {
        console.warn('⚠️ Avisos:', stderr);
      }
      
      console.log('✅ Migração executada com sucesso!');
      console.log('📄 Output:', stdout);
      
      console.log('\n🎯 Próximos passos:');
      console.log('1. Verifique se o banco foi criado: wrangler d1 info curriculo-db');
      console.log('2. Execute consultas de teste: wrangler d1 execute curriculo-db --command="SELECT * FROM personal_info"');
      console.log('3. Atualize o wrangler.toml com o database_id correto');
    });
    
  } catch (error) {
    console.error('❌ Erro durante a migração:', error);
    process.exit(1);
  }
}

// Verificar se wrangler está instalado
exec('wrangler --version', (error) => {
  if (error) {
    console.error('❌ Wrangler CLI não está instalado!');
    console.log('📦 Instale com: npm install -g wrangler');
    process.exit(1);
  }
  
  executeMigration();
});