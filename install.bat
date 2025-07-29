@echo off
echo ========================================
echo    INSTALADOR CANCHA INTELIGENTE
echo ========================================
echo.

echo Verificando Node.js...
node --version >nul 2>&1
if %errorlevel% neq 0 (
    echo Node.js no esta instalado.
    echo.
    echo Descargando Node.js...
    echo Por favor, descarga Node.js desde: https://nodejs.org/
    echo Instala la version LTS (18.x o superior)
    echo.
    pause
    exit /b 1
)

echo Node.js encontrado!
echo.

echo Instalando dependencias...
npm install

if %errorlevel% neq 0 (
    echo Error al instalar dependencias.
    echo Verifica tu conexion a internet.
    pause
    exit /b 1
)

echo.
echo ========================================
echo    INSTALACION COMPLETADA
echo ========================================
echo.
echo Para iniciar el sistema:
echo 1. Ejecuta: npm run dev
echo 2. Abre: http://localhost:8080
echo.
echo Presiona cualquier tecla para iniciar...
pause

echo Iniciando el sistema en puerto 8080...
npm run dev 