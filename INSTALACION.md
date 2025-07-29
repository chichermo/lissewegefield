# 📦 Guía de Instalación - Cancha Inteligente

## 🔧 Prerrequisitos

### 1. Instalar Node.js
Descarga e instala Node.js desde: https://nodejs.org/

**Versión recomendada:** 18.x o superior

**Para verificar la instalación:**
```bash
node --version
npm --version
```

### 2. Instalar Git (opcional)
Descarga Git desde: https://git-scm.com/

## 🚀 Instalación del Proyecto

### Paso 1: Abrir Terminal
- **Windows**: Presiona `Win + R`, escribe `cmd` y presiona Enter
- **Mac**: Abre Terminal desde Aplicaciones > Utilidades
- **Linux**: Abre tu terminal preferida

### Paso 2: Navegar al Directorio
```bash
cd "C:\Users\guill\OneDrive\Documentos\cancha"
```

### Paso 3: Instalar Dependencias
```bash
npm install
```

### Paso 4: Ejecutar el Proyecto
```bash
npm run dev
```

### Paso 5: Abrir en el Navegador
Ve a: http://localhost:3000

## 📱 Configuración del Dispositivo

### Permisos de Ubicación
1. **Abre el navegador** (Chrome, Firefox, Safari)
2. **Ve a Configuración** > Privacidad y Seguridad
3. **Habilita** "Permitir acceso a ubicación"
4. **Permite** cuando el sitio lo solicite

### Optimización GPS
- **Usa el dispositivo** al aire libre
- **Evita edificios** altos cercanos
- **Mantén el dispositivo** estable
- **Espera 10-15 segundos** para estabilizar la señal

## 🎯 Primeros Pasos

### 1. Marcado Inteligente
1. **Selecciona** "Marcado Inteligente"
2. **Activa** el GPS en tu dispositivo
3. **Presiona** "Iniciar" para comenzar
4. **Sigue** la guía visual en pantalla
5. **Completa** cada línea una por una

### 2. Medición de Cancha
1. **Ve a** "Medición de Cancha"
2. **Inicia** desde una esquina de la cancha
3. **Camina** por el perímetro completo
4. **Detén** cuando hayas terminado
5. **Revisa** los resultados y exporta

### 3. Gestión de Productos
1. **Explora** los productos disponibles
2. **Filtra** por categoría y temporada
3. **Revisa** las tareas pendientes
4. **Sigue** el calendario de mantenimiento

## 🔧 Solución de Problemas

### Error: "npm no se reconoce"
**Solución:**
1. **Reinstala Node.js** desde nodejs.org
2. **Reinicia** la terminal/CMD
3. **Verifica** con `node --version`

### Error: "Puerto 3000 en uso"
**Solución:**
```bash
# Encuentra el proceso
netstat -ano | findstr :3000

# Mata el proceso (reemplaza XXXX con el PID)
taskkill /PID XXXX /F

# O usa otro puerto
npm run dev -- -p 3001
```

### GPS No Funciona
**Solución:**
1. **Verifica permisos** de ubicación
2. **Asegúrate** de estar al aire libre
3. **Espera** 10-15 segundos
4. **Reinicia** la aplicación

### Página No Carga
**Solución:**
1. **Verifica** que el servidor esté corriendo
2. **Revisa** la consola del navegador (F12)
3. **Intenta** http://localhost:3000
4. **Reinicia** el servidor con Ctrl+C y `npm run dev`

## 📞 Soporte Técnico

### Contacto Inmediato
- **WhatsApp**: +54 9 11 1234-5678
- **Email**: soporte@cancha-inteligente.com
- **Teléfono**: +54 11 1234-5678

### Información Necesaria
Cuando contactes soporte, ten lista esta información:
- **Sistema operativo**: Windows/Mac/Linux
- **Versión de Node.js**: `node --version`
- **Navegador usado**: Chrome/Firefox/Safari
- **Error específico**: Captura de pantalla o texto
- **Pasos realizados**: Qué intentaste hacer

## 🎉 ¡Listo para Usar!

Una vez que hayas completado la instalación:

1. **Prueba** el marcado en una cancha pequeña
2. **Familiarízate** con la interfaz
3. **Lee** el README.md completo
4. **Contacta** soporte si tienes dudas

**¡Disfruta marcando canchas con precisión profesional!** ⚽ 