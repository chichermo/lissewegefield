# Script para solucionar problemas de Node.js y ejecutar Next.js
Write-Host "🔧 Configurando Node.js..." -ForegroundColor Green

# Configurar variables de entorno
$env:NODE_OPTIONS = "--max-old-space-size=4096 --no-warnings --no-deprecation --no-experimental-fetch --no-experimental-vm-modules --no-experimental-repl-await"
$env:NODE_ENV = "development"
$env:NPM_CONFIG_PREFIX = "$env:APPDATA\npm"
$env:NPM_CONFIG_CACHE = "$env:APPDATA\npm-cache"
$env:NODE_PATH = ""
$env:PATH += ";C:\Program Files\nodejs"

# Verificar Node.js
Write-Host "📋 Verificando Node.js..." -ForegroundColor Yellow
node --version
npm --version

# Limpiar cache de npm
Write-Host "🧹 Limpiando cache..." -ForegroundColor Yellow
npm cache clean --force

# Instalar dependencias
Write-Host "📦 Instalando dependencias..." -ForegroundColor Yellow
npm install

# Ejecutar servidor
Write-Host "🚀 Iniciando servidor Next.js..." -ForegroundColor Green
Write-Host "📍 Puerto: 8080" -ForegroundColor Cyan
Write-Host "🌐 URL: http://localhost:8080" -ForegroundColor Cyan

npm run dev 