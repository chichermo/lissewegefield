Write-Host "Iniciando servidor de desarrollo..." -ForegroundColor Green
Write-Host "Puerto: 8080" -ForegroundColor Yellow
Write-Host "URL: http://localhost:8080" -ForegroundColor Cyan
Write-Host ""

# Intentar iniciar el servidor
try {
    npm run dev
} catch {
    Write-Host "Error al iniciar el servidor: $($_.Exception.Message)" -ForegroundColor Red
    Write-Host "Intentando con npx..." -ForegroundColor Yellow
    try {
        npx next dev --port 8080
    } catch {
        Write-Host "Error con npx: $($_.Exception.Message)" -ForegroundColor Red
    }
} 