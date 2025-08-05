'use client'

import { createContext, useContext, useState, useEffect, ReactNode } from 'react'

export type Language = 'es' | 'nl' | 'en'

interface LanguageContextType {
  language: Language
  setLanguage: (lang: Language) => void
  t: (key: string) => string
}

const LanguageContext = createContext<LanguageContextType | undefined>(undefined)

const translations = {
  es: {
    // Navegación
    'nav.home': 'Inicio',
    'nav.measurement': 'Medición',
    'nav.marking': 'Marcado',
    'nav.fields': 'Campos',
    'nav.history': 'Historial',
    'nav.export': 'Exportar',
    'nav.map': 'Mapa',
    'nav.calendar': 'Calendario',
    'nav.products': 'Productos',
    
    // Home
    'home.title': 'Lissewege Fields - R.F.C. Lissewege',
    'home.subtitle': 'Sistema inteligente para medición y marcado de campos',
    'home.measurement': 'Medición',
    'home.measurement.desc': 'Medir dimensiones del campo',
    'home.marking': 'Marcado',
    'home.marking.desc': 'Marcar líneas del campo',
    'home.fields': 'Campos',
    'home.fields.desc': 'Gestionar campos deportivos',
    'home.history': 'Historial',
    'home.history.desc': 'Ver mediciones anteriores',
    'home.features': 'Características',
    'home.camera': 'Cámara integrada para medición',
    'home.gps': 'GPS de alta precisión',
    'home.fifa': 'Estándares FIFA',
    'home.multiple': 'Múltiples campos',
    
    // Herramientas de cámara
    'camera.tools': 'Herramientas de Cámara',
    'camera.tracking': 'Punto de Seguimiento',
    'camera.tracking.desc': 'Punto central para seguir al caminar',
    'camera.guidelines': 'Líneas Guía',
    'camera.guidelines.desc': 'Líneas paralelas para mantener rectitud',
    'camera.measurement': 'Metraje en Vivo',
    'camera.measurement.desc': 'Medición en tiempo real en pantalla',
    'camera.tracker': 'Rastreador de Ruta',
    'camera.tracker.desc': 'Visualizar camino recorrido',
    'camera.straightness': 'Verificador de Rectitud',
    'camera.straightness.desc': 'Analizar si la línea está derecha',
    'camera.width': 'Ancho líneas guía',
    'camera.distance': 'Distancia recorrida',
    'camera.rectitude': 'Rectitud',
    
    // Medición
    'measurement.title': 'Medición Móvil',
    'measurement.start': 'Iniciar Medición',
    'measurement.stop': 'Detener Medición',
    'measurement.camera.start': 'Activar Cámara',
    'measurement.camera.stop': 'Desactivar Cámara',
    'measurement.gps.start': 'Activar GPS',
    'measurement.gps.stop': 'Desactivar GPS',
    'measurement.capture': 'Capturar Punto',
    'measurement.clear': 'Limpiar',
    'measurement.points': 'puntos',
    'measurement.distance.estimated': 'Distancia estimada',
    'measurement.advanced': 'Modo Avanzado',
    'measurement.tap.capture': 'Toca para capturar',
    'measurement.tap.start': 'Toca "Iniciar" para comenzar la medición',
    'measurement.camera.inactive': 'Cámara no activa',
    'measurement.camera.activating': 'Activando cámara...',
    'measurement.camera.active': 'Cámara activa. Toca la pantalla para capturar puntos.',
    'measurement.camera.error': 'No se pudo acceder a la cámara. Verifica los permisos.',
    'measurement.camera.error.init': 'Error al iniciar cámara.',
    'measurement.camera.stopped': 'Cámara detenida.',
    'measurement.gps.getting': 'Obteniendo posición GPS...',
    'measurement.stopped': 'Medición detenida. Se necesitan al menos 2 puntos.',
    'measurement.reset': 'Medición reiniciada.',
    'measurement.web.penalty.north': 'Área de Penal Norte',
    'measurement.web.penalty.south': 'Área de Penal Sur',
    'measurement.web.center.circle': 'Círculo Central',
    'measurement.web.type.line': 'Línea',
    'measurement.web.camera.starting': 'Iniciando cámara para medición...',
    'measurement.web.camera.ready': 'Cámara activa. Toca la pantalla para capturar puntos de medición.',
    'measurement.web.camera.error': 'No se pudo acceder a la cámara. Verifica los permisos.',
    'measurement.web.gps.connecting': 'Conectando al GPS de alta precisión para medición FIFA...',
    'measurement.web.gps.active': 'GPS de alta precisión activo. Listo para medición profesional FIFA.',
    'measurement.web.gps.error': 'Error al obtener posición GPS. Verifica los permisos de ubicación.',
    'measurement.web.fifa.start': 'Medición profesional FIFA iniciada. Sistema GPS de alta precisión activo.',
    'measurement.web.fifa.stopped': 'Medición detenida. Calculando resultados FIFA...',
    'measurement.web.tracking.active': 'Modo seguimiento activo. La cámara detectará automáticamente líneas.',
    'measurement.web.mode.basic': 'Modo Básico',
    'measurement.web.mode.advanced': 'Modo Avanzado',
    'measurement.web.activate.gps': 'Activar GPS',
    'measurement.web.start.pro': 'Iniciar Medición Pro',
    'measurement.web.activate.camera': 'Activar Cámara',
    'measurement.web.stop.camera': 'Detener Cámara',
    'measurement.length.total': 'Longitud Total',
    'measurement.width.total': 'Ancho Total',
    'measurement.distance.walked': 'Distancia Recorrida',
    'measurement.recording': 'Grabando...',
    'measurement.ready': 'Listo',
    
    // Marcado
    'marking.title': 'Marcado Móvil',
    'marking.line.center': 'Línea Central',
    'marking.line.penalty': 'Área Penal',
    'marking.line.corner': 'Círculo Esquina',
    'marking.line.goal': 'Área de Meta',
    'marking.progress': 'Progreso',
    'marking.complete': 'Completar Línea',
    'marking.reset': 'Reiniciar Marcado',
    'marking.line.goal.north': 'Línea de Meta Norte',
    'marking.line.goal.south': 'Línea de Meta Sur',
    'marking.line.side.left': 'Línea Lateral Izquierda',
    'marking.line.side.right': 'Línea Lateral Derecha',
    'marking.circle.center': 'Círculo Central',
    'marking.camera.activating': 'Activando cámara...',
    'marking.camera.active': 'Cámara activa. Toca la pantalla para marcar puntos.',
    'marking.camera.error': 'No se pudo acceder a la cámara. Verifica los permisos.',
    'marking.camera.error.init': 'Error al iniciar cámara.',
    'marking.camera.stopped': 'Cámara detenida.',
    'marking.gps.getting': 'Obteniendo posición GPS...',
    'marking.gps.active': 'GPS activo. Mueve el dispositivo para marcar líneas.',
    
    // Configuración
    'settings.language': 'Idioma',
    'settings.spanish': 'Español',
    'settings.dutch': 'Holandés',
    'settings.english': 'Inglés',
    
    // Estados
    'status.online': 'En línea',
    'status.offline': 'Sin conexión',
    'status.connecting': 'Conectando...',
    'status.active': 'Activo',
    'status.inactive': 'Inactivo',
    'status.measuring': 'Midiendo...',
    'status.marking': 'Marcando...',
    'status.gps': 'GPS Activo',
    
    // Botones generales
    'btn.start': 'Iniciar',
    'btn.stop': 'Detener',
    'btn.continue': 'Continuar',
    'btn.complete': 'Completar',
    'btn.cancel': 'Cancelar',
    'btn.save': 'Guardar',
    'btn.clear': 'Limpiar',
    'btn.reset': 'Reiniciar'
  },
  
  nl: {
    // Navigatie
    'nav.home': 'Home',
    'nav.measurement': 'Meting',
    'nav.marking': 'Markering',
    'nav.fields': 'Velden',
    'nav.history': 'Geschiedenis',
    'nav.export': 'Exporteren',
    'nav.map': 'Kaart',
    'nav.calendar': 'Kalender',
    'nav.products': 'Producten',
    
    // Home
    'home.title': 'Lissewege Fields - R.F.C. Lissewege',
    'home.subtitle': 'Intelligent systeem voor veldmeting en -markering',
    'home.measurement': 'Meting',
    'home.measurement.desc': 'Veldafmetingen meten',
    'home.marking': 'Markering',
    'home.marking.desc': 'Veldlijnen markeren',
    'home.fields': 'Velden',
    'home.fields.desc': 'Sportvelden beheren',
    'home.history': 'Geschiedenis',
    'home.history.desc': 'Vorige metingen bekijken',
    'home.features': 'Kenmerken',
    'home.camera': 'Geïntegreerde camera voor meting',
    'home.gps': 'Hoge precisie GPS',
    'home.fifa': 'FIFA-standaarden',
    'home.multiple': 'Meerdere velden',
    
    // Camera tools
    'camera.tools': 'Camera Gereedschappen',
    'camera.tracking': 'Volgpunt',
    'camera.tracking.desc': 'Centraal punt om te volgen tijdens het lopen',
    'camera.guidelines': 'Gidslijnen',
    'camera.guidelines.desc': 'Parallelle lijnen voor rechtheid',
    'camera.measurement': 'Live Meting',
    'camera.measurement.desc': 'Real-time meting op scherm',
    'camera.tracker': 'Route Tracker',
    'camera.tracker.desc': 'Gelopen pad visualiseren',
    'camera.straightness': 'Rechtheid Checker',
    'camera.straightness.desc': 'Analyseren of lijn recht is',
    'camera.width': 'Breedte gidslijnen',
    'camera.distance': 'Afgelegde afstand',
    'camera.rectitude': 'Rechtheid',
    
    // Meting
    'measurement.title': 'Mobiele Meting',
    'measurement.start': 'Meting Starten',
    'measurement.stop': 'Meting Stoppen',
    'measurement.camera.start': 'Camera Activeren',
    'measurement.camera.stop': 'Camera Deactiveren',
    'measurement.gps.start': 'GPS Activeren',
    'measurement.gps.stop': 'GPS Deactiveren',
    'measurement.capture': 'Punt Vastleggen',
    'measurement.clear': 'Wissen',
    'measurement.points': 'punten',
    'measurement.distance.estimated': 'Geschatte afstand',
    'measurement.advanced': 'Geavanceerde Modus',
    'measurement.tap.capture': 'Tik om vast te leggen',
    'measurement.tap.start': 'Tik "Starten" om meting te beginnen',
    'measurement.camera.inactive': 'Camera niet actief',
    'measurement.camera.activating': 'Camera activeren...',
    'measurement.camera.active': 'Camera actief. Tik op scherm om punten vast te leggen.',
    'measurement.camera.error': 'Geen toegang tot camera. Controleer toestemmingen.',
    'measurement.camera.error.init': 'Fout bij opstarten camera.',
    'measurement.camera.stopped': 'Camera gestopt.',
    'measurement.gps.getting': 'GPS-positie ophalen...',
    'measurement.stopped': 'Meting gestopt. Minimaal 2 punten nodig.',
    'measurement.reset': 'Meting herstart.',
    'measurement.web.penalty.north': 'Strafschopgebied Noord',
    'measurement.web.penalty.south': 'Strafschopgebied Zuid',
    'measurement.web.center.circle': 'Middencirkel',
    'measurement.web.type.line': 'Lijn',
    'measurement.web.camera.starting': 'Camera starten voor meting...',
    'measurement.web.camera.ready': 'Camera actief. Tik op scherm om meetpunten vast te leggen.',
    'measurement.web.camera.error': 'Geen toegang tot camera. Controleer toestemmingen.',
    'measurement.web.gps.connecting': 'Verbinding maken met hoge precisie GPS voor FIFA meting...',
    'measurement.web.gps.active': 'Hoge precisie GPS actief. Klaar voor professionele FIFA meting.',
    'measurement.web.gps.error': 'Fout bij ophalen GPS-positie. Controleer locatietoestemmingen.',
    'measurement.web.fifa.start': 'Professionele FIFA meting gestart. Hoge precisie GPS-systeem actief.',
    'measurement.web.fifa.stopped': 'Meting gestopt. FIFA resultaten berekenen...',
    'measurement.web.tracking.active': 'Volg modus actief. Camera detecteert automatisch lijnen.',
    'measurement.web.mode.basic': 'Basis Modus',
    'measurement.web.mode.advanced': 'Geavanceerde Modus',
    'measurement.web.activate.gps': 'GPS Activeren',
    'measurement.web.start.pro': 'Start Pro Meting',
    'measurement.web.activate.camera': 'Camera Activeren',
    'measurement.web.stop.camera': 'Camera Stoppen',
    'measurement.length.total': 'Totale Lengte',
    'measurement.width.total': 'Totale Breedte',
    'measurement.distance.walked': 'Gelopen Afstand',
    'measurement.recording': 'Opnemen...',
    'measurement.ready': 'Klaar',
    
    // Markering
    'marking.title': 'Mobiele Markering',
    'marking.line.center': 'Middenlijn',
    'marking.line.penalty': 'Strafschopgebied',
    'marking.line.corner': 'Hoekschop Cirkel',
    'marking.line.goal': 'Doelgebied',
    'marking.progress': 'Voortgang',
    'marking.complete': 'Lijn Voltooien',
    'marking.reset': 'Markering Herstellen',
    'marking.line.goal.north': 'Doellijn Noord',
    'marking.line.goal.south': 'Doellijn Zuid',
    'marking.line.side.left': 'Zijlijn Links',
    'marking.line.side.right': 'Zijlijn Rechts',
    'marking.circle.center': 'Middencirkel',
    'marking.camera.activating': 'Camera activeren...',
    'marking.camera.active': 'Camera actief. Tik op scherm om punten te markeren.',
    'marking.camera.error': 'Geen toegang tot camera. Controleer toestemmingen.',
    'marking.camera.error.init': 'Fout bij opstarten camera.',
    'marking.camera.stopped': 'Camera gestopt.',
    'marking.gps.getting': 'GPS-positie ophalen...',
    'marking.gps.active': 'GPS actief. Beweeg apparaat om lijnen te markeren.',
    
    // Instellingen
    'settings.language': 'Taal',
    'settings.spanish': 'Spaans',
    'settings.dutch': 'Nederlands',
    'settings.english': 'Engels',
    
    // Status
    'status.online': 'Online',
    'status.offline': 'Offline',
    'status.connecting': 'Verbinden...',
    'status.active': 'Actief',
    'status.inactive': 'Inactief',
    'status.measuring': 'Aan het meten...',
    'status.marking': 'Aan het markeren...',
    'status.gps': 'GPS Actief',
    
    // Algemene knoppen
    'btn.start': 'Starten',
    'btn.stop': 'Stoppen',
    'btn.continue': 'Doorgaan',
    'btn.complete': 'Voltooien',
    'btn.cancel': 'Annuleren',
    'btn.save': 'Opslaan',
    'btn.clear': 'Wissen',
    'btn.reset': 'Herstellen'
  },
  
  en: {
    // Navigation
    'nav.home': 'Home',
    'nav.measurement': 'Measurement',
    'nav.marking': 'Marking',
    'nav.fields': 'Fields',
    'nav.history': 'History',
    'nav.export': 'Export',
    'nav.map': 'Map',
    'nav.calendar': 'Calendar',
    'nav.products': 'Products',
    
    // Home
    'home.title': 'Lissewege Fields - R.F.C. Lissewege',
    'home.subtitle': 'Intelligent system for field measurement and marking',
    'home.measurement': 'Measurement',
    'home.measurement.desc': 'Measure field dimensions',
    'home.marking': 'Marking',
    'home.marking.desc': 'Mark field lines',
    'home.fields': 'Fields',
    'home.fields.desc': 'Manage sports fields',
    'home.history': 'History',
    'home.history.desc': 'View previous measurements',
    'home.features': 'Features',
    'home.camera': 'Integrated camera for measurement',
    'home.gps': 'High precision GPS',
    'home.fifa': 'FIFA standards',
    'home.multiple': 'Multiple fields',
    
    // Camera tools
    'camera.tools': 'Camera Tools',
    'camera.tracking': 'Tracking Point',
    'camera.tracking.desc': 'Central point to follow while walking',
    'camera.guidelines': 'Guide Lines',
    'camera.guidelines.desc': 'Parallel lines to maintain straightness',
    'camera.measurement': 'Live Measurement',
    'camera.measurement.desc': 'Real-time measurement on screen',
    'camera.tracker': 'Path Tracker',
    'camera.tracker.desc': 'Visualize walked path',
    'camera.straightness': 'Straightness Checker',
    'camera.straightness.desc': 'Analyze if line is straight',
    'camera.width': 'Guide lines width',
    'camera.distance': 'Distance covered',
    'camera.rectitude': 'Straightness',
    
    // Measurement
    'measurement.title': 'Mobile Measurement',
    'measurement.start': 'Start Measurement',
    'measurement.stop': 'Stop Measurement',
    'measurement.camera.start': 'Activate Camera',
    'measurement.camera.stop': 'Deactivate Camera',
    'measurement.gps.start': 'Activate GPS',
    'measurement.gps.stop': 'Deactivate GPS',
    'measurement.capture': 'Capture Point',
    'measurement.clear': 'Clear',
    'measurement.points': 'points',
    'measurement.distance.estimated': 'Estimated distance',
    'measurement.advanced': 'Advanced Mode',
    'measurement.tap.capture': 'Tap to capture',
    'measurement.tap.start': 'Tap "Start" to begin measurement',
    'measurement.camera.inactive': 'Camera not active',
    'measurement.camera.activating': 'Activating camera...',
    'measurement.camera.active': 'Camera active. Tap screen to capture points.',
    'measurement.camera.error': 'Could not access camera. Check permissions.',
    'measurement.camera.error.init': 'Error starting camera.',
    'measurement.camera.stopped': 'Camera stopped.',
    'measurement.gps.getting': 'Getting GPS position...',
    'measurement.stopped': 'Measurement stopped. At least 2 points needed.',
    'measurement.reset': 'Measurement reset.',
    'measurement.web.penalty.north': 'North Penalty Area',
    'measurement.web.penalty.south': 'South Penalty Area',
    'measurement.web.center.circle': 'Center Circle',
    'measurement.web.type.line': 'Line',
    'measurement.web.camera.starting': 'Starting camera for measurement...',
    'measurement.web.camera.ready': 'Camera active. Tap screen to capture measurement points.',
    'measurement.web.camera.error': 'Could not access camera. Check permissions.',
    'measurement.web.gps.connecting': 'Connecting to high precision GPS for FIFA measurement...',
    'measurement.web.gps.active': 'High precision GPS active. Ready for professional FIFA measurement.',
    'measurement.web.gps.error': 'Error getting GPS position. Check location permissions.',
    'measurement.web.fifa.start': 'Professional FIFA measurement started. High precision GPS system active.',
    'measurement.web.fifa.stopped': 'Measurement stopped. Calculating FIFA results...',
    'measurement.web.tracking.active': 'Tracking mode active. Camera will automatically detect lines.',
    'measurement.web.mode.basic': 'Basic Mode',
    'measurement.web.mode.advanced': 'Advanced Mode',
    'measurement.web.activate.gps': 'Activate GPS',
    'measurement.web.start.pro': 'Start Pro Measurement',
    'measurement.web.activate.camera': 'Activate Camera',
    'measurement.web.stop.camera': 'Stop Camera',
    'measurement.length.total': 'Total Length',
    'measurement.width.total': 'Total Width',
    'measurement.distance.walked': 'Distance Walked',
    'measurement.recording': 'Recording...',
    'measurement.ready': 'Ready',
    
    // Marking
    'marking.title': 'Mobile Marking',
    'marking.line.center': 'Center Line',
    'marking.line.penalty': 'Penalty Area',
    'marking.line.corner': 'Corner Circle',
    'marking.line.goal': 'Goal Area',
    'marking.progress': 'Progress',
    'marking.complete': 'Complete Line',
    'marking.reset': 'Reset Marking',
    'marking.line.goal.north': 'North Goal Line',
    'marking.line.goal.south': 'South Goal Line',
    'marking.line.side.left': 'Left Side Line',
    'marking.line.side.right': 'Right Side Line',
    'marking.circle.center': 'Center Circle',
    'marking.camera.activating': 'Activating camera...',
    'marking.camera.active': 'Camera active. Tap screen to mark points.',
    'marking.camera.error': 'Could not access camera. Check permissions.',
    'marking.camera.error.init': 'Error starting camera.',
    'marking.camera.stopped': 'Camera stopped.',
    'marking.gps.getting': 'Getting GPS position...',
    'marking.gps.active': 'GPS active. Move device to mark lines.',
    
    // Settings
    'settings.language': 'Language',
    'settings.spanish': 'Spanish',
    'settings.dutch': 'Dutch',
    'settings.english': 'English',
    
    // Status
    'status.online': 'Online',
    'status.offline': 'Offline',
    'status.connecting': 'Connecting...',
    'status.active': 'Active',
    'status.inactive': 'Inactive',
    'status.measuring': 'Measuring...',
    'status.marking': 'Marking...',
    'status.gps': 'GPS Active',
    
    // General buttons
    'btn.start': 'Start',
    'btn.stop': 'Stop',
    'btn.continue': 'Continue',
    'btn.complete': 'Complete',
    'btn.cancel': 'Cancel',
    'btn.save': 'Save',
    'btn.clear': 'Clear',
    'btn.reset': 'Reset'
  }
}

interface LanguageProviderProps {
  children: ReactNode
}

export function LanguageProvider({ children }: LanguageProviderProps) {
  const [language, setLanguageState] = useState<Language>('es')

  useEffect(() => {
    const savedLanguage = localStorage.getItem('lissewege-language') as Language
    if (savedLanguage && ['es', 'nl', 'en'].includes(savedLanguage)) {
      setLanguageState(savedLanguage)
    }
  }, [])

  const setLanguage = (lang: Language) => {
    setLanguageState(lang)
    localStorage.setItem('lissewege-language', lang)
  }

  const t = (key: string): string => {
    return (translations[language] as any)[key] || key
  }

  return (
    <LanguageContext.Provider value={{ language, setLanguage, t }}>
      {children}
    </LanguageContext.Provider>
  )
}

export function useLanguage() {
  const context = useContext(LanguageContext)
  if (context === undefined) {
    throw new Error('useLanguage must be used within a LanguageProvider')
  }
  return context
}