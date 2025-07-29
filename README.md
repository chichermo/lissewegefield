# 🏟️ Cancha Inteligente - Sistema de Marcado Avanzado

Un sistema tecnológico completo para el marcado, medición y gestión de canchas de fútbol con GPS de alta precisión.

## 🚀 Características Principales

### 📍 Marcado Inteligente
- **GPS de alta precisión** para guiar el marcado
- **Seguimiento en tiempo real** de las líneas de la cancha
- **Progreso visual** de cada línea de marcado
- **Alertas de desviación** cuando te sales de la ruta
- **Interfaz intuitiva** para controlar el proceso

### 📏 Medición de Cancha
- **Medición GPS precisa** de dimensiones
- **Verificación automática** de estándares FIFA
- **Calificación de calidad** de la cancha
- **Exportación de reportes** en formato JSON
- **Tolerancias aceptadas** según normativas oficiales

### 🌱 Gestión de Productos
- **Base de datos inteligente** de productos para el pasto
- **Recomendaciones por temporada** y tipo de pasto
- **Calendario de mantenimiento** automático
- **Seguimiento de tareas** pendientes y completadas
- **Estadísticas de eficiencia** del mantenimiento

## 🛠️ Tecnologías Utilizadas

- **Next.js 14.1** - Framework de React con App Router
- **TypeScript 5.3** - Tipado estático avanzado
- **Tailwind CSS 3.4** - Estilos modernos y responsive
- **Framer Motion 11** - Animaciones fluidas
- **Lucide React 0.320** - Iconografía moderna
- **Zustand 4.4** - Gestión de estado
- **GPS Geolocation API** - Posicionamiento preciso
- **Leaflet** - Mapas interactivos

## 📦 Instalación

### Prerrequisitos
- Node.js 18+ 
- npm 9+ o yarn

### Pasos de Instalación

1. **Clonar el repositorio**
```bash
git clone <tu-repositorio>
cd cancha-inteligente
```

2. **Instalar dependencias**
```bash
npm install
# o
yarn install
```

3. **Configurar variables de entorno**
```bash
cp config.env .env.local
# Editar .env.local con tus configuraciones
```

4. **Ejecutar en modo desarrollo**
```bash
npm run dev
# o
yarn dev
```

5. **Abrir en el navegador**
```
http://localhost:8080
```

## 🎯 Scripts Disponibles

```bash
# Desarrollo
npm run dev              # Inicia servidor de desarrollo
npm run build            # Construye para producción
npm run start            # Inicia servidor de producción

# Calidad de código
npm run lint             # Ejecuta ESLint
npm run lint:fix         # Corrige errores de ESLint
npm run type-check       # Verifica tipos TypeScript
npm run format           # Formatea código con Prettier
npm run format:check     # Verifica formato

# Testing
npm run test             # Ejecuta pruebas
npm run test:watch       # Ejecuta pruebas en modo watch

# Análisis
npm run analyze          # Analiza bundle size
```

## 🎯 Cómo Usar

### 1. Marcado Inteligente
1. **Selecciona la línea** que quieres marcar
2. **Activa el GPS** en tu dispositivo
3. **Presiona "Iniciar"** para comenzar el seguimiento
4. **Sigue la guía visual** en la pantalla
5. **Completa cada línea** una por una

### 2. Medición de Cancha
1. **Inicia la medición** desde una esquina
2. **Camina por el perímetro** de la cancha
3. **Captura puntos clave** (esquinas, centros)
4. **Detén la medición** cuando hayas completado
5. **Revisa los resultados** y exporta el reporte

### 3. Gestión de Productos
1. **Explora los productos** disponibles
2. **Filtra por categoría** y temporada
3. **Revisa las tareas** pendientes
4. **Sigue el calendario** de mantenimiento
5. **Completa las tareas** según el cronograma

## 📱 Funcionalidades GPS

### Precisión Requerida
- **GPS de alta precisión** (mínimo 3 metros)
- **Conexión estable** a internet
- **Permisos de ubicación** habilitados

### Optimización de Señal
- **Aire libre** sin obstáculos
- **Evitar edificios** altos cercanos
- **Mantener el dispositivo** estable durante el uso

## 🏆 Estándares FIFA

### Dimensiones Oficiales
- **Longitud**: 100-110 metros
- **Ancho**: 64-75 metros
- **Área de Penal**: 40.32 x 16.5 metros
- **Círculo Central**: 9.15 metros de radio

### Tolerancias Aceptadas
- **Dimensiones principales**: ±5 metros
- **Área total**: ±500 m²
- **Círculo central**: ±0.5 metros

## 🌿 Productos Recomendados

### Fertilización
- **NPK 20-10-10**: Crecimiento vigoroso
- **Fósforo 0-46-0**: Desarrollo radicular
- **Aplicación**: Cada 4-8 semanas

### Control de Malezas
- **Herbicida selectivo**: Sin dañar el pasto
- **Aplicación**: Según necesidad
- **Temporada**: Primavera, Verano, Otoño

### Control de Enfermedades
- **Fungicida preventivo**: Protección contra hongos
- **Aplicación**: Cada 2-3 semanas
- **Temporada**: Primavera, Otoño

## 📊 Reportes y Exportación

### Formato de Datos
```json
{
  "fecha": "2024-01-15T10:30:00Z",
  "mediciones": [...],
  "puntosGPS": [...],
  "cumpleEstándaresFIFA": true
}
```

### Métricas Incluidas
- **Dimensiones exactas** de la cancha
- **Calificación FIFA** automática
- **Puntos GPS** capturados
- **Tolerancias** verificadas

## 🔧 Configuración Avanzada

### Variables de Entorno
```env
NEXT_PUBLIC_GOOGLE_MAPS_API_KEY=tu_api_key
NEXT_PUBLIC_GPS_ACCURACY=3
NEXT_PUBLIC_FIFA_TOLERANCE=5
```

### Personalización
- **Dimensiones personalizadas** de cancha
- **Tolerancias ajustables** según necesidades
- **Productos específicos** por región
- **Calendario adaptado** al clima local

## 📈 Beneficios del Sistema

### Para el Club
- **Ahorro de tiempo** en marcado manual
- **Precisión profesional** en las líneas
- **Cumplimiento FIFA** garantizado
- **Mantenimiento optimizado** del pasto

### Para el Operador
- **Interfaz intuitiva** y fácil de usar
- **Guía visual** en tiempo real
- **Alertas automáticas** de desviación
- **Reportes detallados** de trabajo

## 🚨 Solución de Problemas

### GPS No Funciona
1. **Verifica permisos** de ubicación
2. **Asegúrate** de estar al aire libre
3. **Espera** 10-15 segundos para estabilizar
4. **Reinicia** la aplicación si es necesario

### Medición Imprecisa
1. **Camina más lento** durante la medición
2. **Captura más puntos** en las esquinas
3. **Evita obstáculos** que bloqueen la señal
4. **Usa un dispositivo** con GPS de alta precisión

### Productos No Cargados
1. **Verifica conexión** a internet
2. **Revisa los filtros** aplicados
3. **Actualiza la página** si es necesario
4. **Contacta soporte** si persiste el problema

## 🧪 Testing

### Ejecutar Pruebas
```bash
npm run test              # Ejecuta todas las pruebas
npm run test:watch        # Modo watch para desarrollo
```

### Cobertura de Código
```bash
npm run test -- --coverage
```

## 📞 Soporte

### Contacto
- **Email**: soporte@cancha-inteligente.com
- **Teléfono**: +54 11 1234-5678
- **WhatsApp**: +54 9 11 1234-5678

### Horarios
- **Lunes a Viernes**: 9:00 - 18:00
- **Sábados**: 9:00 - 13:00
- **Emergencias**: 24/7

## 📄 Licencia

Este proyecto está bajo la Licencia MIT. Ver el archivo `LICENSE` para más detalles.

## 🤝 Contribuciones

Las contribuciones son bienvenidas. Por favor:

1. **Fork** el proyecto
2. **Crea una rama** para tu feature
3. **Commit** tus cambios
4. **Push** a la rama
5. **Abre un Pull Request**

## 📝 Changelog

### v1.1.0 (2024-01-15)
- ✅ Mejoras en TypeScript y configuración
- ✅ Hook personalizado para GPS
- ✅ Store global con Zustand
- ✅ Utilidades mejoradas
- ✅ Configuración de testing
- ✅ Optimizaciones de rendimiento

### v1.0.0 (2024-01-10)
- ✅ Sistema de marcado GPS
- ✅ Medición de cancha con verificación FIFA
- ✅ Gestión de productos para pasto
- ✅ Interfaz moderna y responsive
- ✅ Exportación de reportes

---

**¡Disfruta marcando canchas con precisión profesional!** ⚽ 