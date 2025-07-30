// Tipos para el sistema de cancha inteligente

export interface Position {
  latitude: number
  longitude: number
  accuracy?: number
}

export interface PuntoGPS {
  lat: number
  lng: number
  timestamp: number
  accuracy?: number
}

// Función helper para convertir entre tipos
export const positionToPuntoGPS = (position: Position): PuntoGPS => ({
  lat: position.latitude,
  lng: position.longitude,
  timestamp: Date.now(),
  ...(position.accuracy !== undefined ? { accuracy: position.accuracy } : {})
})

export const puntoGPSToPosition = (punto: PuntoGPS): Position => ({
  latitude: punto.lat,
  longitude: punto.lng,
  ...(punto.accuracy !== undefined ? { accuracy: punto.accuracy } : {})
})

export interface LineaMarcado {
  id: number
  nombre: string
  progreso: number
  distancia: number
  completada: boolean
  tipo: 'horizontal' | 'vertical' | 'circular' | 'rectangular'
  posicion: 'top' | 'bottom' | 'left' | 'right' | 'center'
  color?: string
}

export interface Medicion {
  id: string
  nombre: string
  distancia: number
  timestamp: number
  tipo: 'linea' | 'circulo' | 'semicirculo' | 'area' | 'arco'
  tolerancia: number
  cumpleFIFA: boolean
  fecha: Date
}

export interface Producto {
  id: number
  nombre: string
  categoria: string
  descripcion: string
  precio: number
  stock: number
  unidad: string
  fechaVencimiento: Date
  proveedor: string
  estado: 'disponible' | 'bajo_stock' | 'agotado'
  prioridad: 'baja' | 'media' | 'alta'
}

export interface Tarea {
  id: number
  titulo: string
  descripcion: string
  fecha: Date
  estado: 'pendiente' | 'en_progreso' | 'completada'
  prioridad: 'baja' | 'media' | 'alta'
  responsable: string
  categoria?: string
  completada?: boolean
}

export interface Punto {
  x: number
  y: number
}

export interface Linea {
  inicio: Punto
  fin: Punto
  distancia: number
}

export interface LineaDibujo {
  id: number
  puntos: Punto[]
  tipo: 'libre' | 'linea' | 'rectangulo' | 'circulo'
  color: string
  grosor: number
}

export interface ConfiguracionGPS {
  precision: number
  intervalo: number
  timeout: number
}

export interface ConfiguracionFIFA {
  largoMinimo: number
  largoMaximo: number
  anchoMinimo: number
  anchoMaximo: number
  areaPenalLargo: number
  areaPenalAncho: number
  areaMetaLargo: number
  areaMetaAncho: number
  radioCirculoCentral: number
  radioArcoPenal: number
}

export interface ConfiguracionCancha {
  nombre: string
  tipo: 'futbol_11' | 'futbol_7' | 'futbol_5' | 'personalizada'
  configuracionFIFA: ConfiguracionFIFA
}

// Nuevos tipos para medición avanzada
export interface MedicionElemento {
  id: number
  nombre: string
  tipo: 'linea' | 'circulo' | 'semicirculo' | 'area' | 'arco' | 'rectangulo'
  puntos: PuntoGPS[]
  distancia: number
  area?: number
  radio?: number
  angulo?: number
  completada: boolean
  progreso: number
  color: string
}

export interface MedicionAvanzada {
  id: number
  nombre: string
  elementos: MedicionElemento[]
  fecha: Date
  estado: 'pendiente' | 'en_progreso' | 'completada'
  progresoTotal: number
  distanciaTotal: number
  areaTotal: number
}

export interface ElementoCancha {
  id: number
  nombre: string
  tipo: 'linea_lateral' | 'linea_fondo' | 'linea_central' | 'area_penal' | 'area_meta' | 'circulo_central' | 'arco_penal' | 'arco_corner' | 'linea_meta' | 'punto_penal' | 'punto_corner'
  descripcion: string
  medicionFIFA: {
    largo?: number
    ancho?: number
    radio?: number
    area?: number
  }
  instrucciones: string[]
  color: string
  icono: string
}

// Tipos para estadísticas y reportes
export interface EstadisticasGPS {
  precision: number
  señal: number
  bateria: number
  tiempoSesion: number
  distanciaRecorrida: number
  velocidadPromedio: number
}

export interface ReporteMedicion {
  id: string
  fecha: Date
  mediciones: Medicion[]
  estadisticasGPS: EstadisticasGPS
  cumpleEstándaresFIFA: boolean
  calificacion: number
  observaciones: string
}

// Tipos para configuración del sistema
export interface ConfiguracionSistema {
  gps: ConfiguracionGPS
  fifa: ConfiguracionFIFA
  cancha: ConfiguracionCancha
  reportes: {
    formato: 'json' | 'pdf' | 'csv'
    incluirGPS: boolean
    incluirEstadisticas: boolean
  }
}

// Tipo para eventos del calendario
export interface EventoMarcado {
  id: string
  titulo: string
  descripcion: string
  fecha: string
  hora: string
  tipo: 'marcado' | 'mantenimiento' | 'revision'
  estado: 'pendiente' | 'en_progreso' | 'completado'
  responsable: string
}

// Tipos para múltiples campos deportivos
export interface CampoDeportivo {
  id: string
  nombre: string
  descripcion: string
  tipo: 'futbol_11' | 'futbol_7' | 'futbol_5' | 'personalizada'
  estado: 'activo' | 'inactivo' | 'mantenimiento'
  fechaCreacion: Date
  ultimaActualizacion: Date
  configuracionFIFA: ConfiguracionFIFA
  mediciones: Medicion[]
  lineasMarcado: LineaMarcado[]
  estadisticas: {
    totalMediciones: number
    totalMarcados: number
    ultimaMedicion: Date | null
    ultimoMarcado: Date | null
  }
}

export interface GestorCampos {
  campos: CampoDeportivo[]
  campoActivo: string | null
  campoSeleccionado: string | null
}
