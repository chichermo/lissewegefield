// Utilidades para el sistema de cancha inteligente

import { Position, PuntoGPS, puntoGPSToPosition } from '@/types'

/**
 * Calcula la distancia entre dos puntos GPS usando la fórmula de Haversine
 */
export const calcularDistanciaGPS = (pos1: Position | PuntoGPS, pos2: Position | PuntoGPS): number => {
  // Normalizar a Position para el cálculo
  const pos1Normalized = 'latitude' in pos1 ? pos1 : puntoGPSToPosition(pos1)
  const pos2Normalized = 'latitude' in pos2 ? pos2 : puntoGPSToPosition(pos2)

  const R = 6371e3 // Radio de la Tierra en metros
  const φ1 = pos1Normalized.latitude * Math.PI / 180
  const φ2 = pos2Normalized.latitude * Math.PI / 180
  const Δφ = (pos2Normalized.latitude - pos1Normalized.latitude) * Math.PI / 180
  const Δλ = (pos2Normalized.longitude - pos1Normalized.longitude) * Math.PI / 180

  const a = Math.sin(Δφ / 2) * Math.sin(Δφ / 2) +
            Math.cos(φ1) * Math.cos(φ2) *
            Math.sin(Δλ / 2) * Math.sin(Δλ / 2)
  const c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1 - a))

  return R * c
}

/**
 * Convierte grados a radianes
 */
export const gradosARadianes = (grados: number): number => {
  return grados * Math.PI / 180
}

/**
 * Convierte radianes a grados
 */
export const radianesAGrados = (radianes: number): number => {
  return radianes * 180 / Math.PI
}

/**
 * Formatea un número como distancia en metros
 */
export const formatearDistancia = (metros: number): string => {
  if (metros < 1000) {
    return `${metros.toFixed(1)}m`
  } else {
    return `${(metros / 1000).toFixed(2)}km`
  }
}

/**
 * Formatea un tiempo en segundos a formato MM:SS
 */
export const formatearTiempo = (segundos: number): string => {
  const minutos = Math.floor(segundos / 60)
  const segs = segundos % 60
  return `${minutos.toString().padStart(2, '0')}:${segs.toString().padStart(2, '0')}`
}

/**
 * Calcula la precisión GPS basada en la accuracy
 */
export const calcularPrecisionGPS = (accuracy: number): number => {
  return Math.max(0, 100 - accuracy)
}

/**
 * Verifica si una medición cumple con los estándares FIFA
 */
export const verificarEstándaresFIFA = (
  largo: number,
  ancho: number,
  tolerancia: number = 5
): boolean => {
  const largoMinimo = 100 - tolerancia
  const largoMaximo = 110 + tolerancia
  const anchoMinimo = 64 - tolerancia
  const anchoMaximo = 75 + tolerancia

  return largo >= largoMinimo && largo <= largoMaximo &&
         ancho >= anchoMinimo && ancho <= anchoMaximo
}

/**
 * Calcula el área de una cancha
 */
export const calcularAreaCancha = (largo: number, ancho: number): number => {
  return largo * ancho
}

/**
 * Genera un ID único
 */
export const generarId = (): string => {
  return Date.now().toString(36) + Math.random().toString(36).substr(2)
}

/**
 * Valida una dirección de email
 */
export const validarEmail = (email: string): boolean => {
  const regex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/
  return regex.test(email)
}

/**
 * Valida un número de teléfono
 */
export const validarTelefono = (telefono: string): boolean => {
  const regex = /^[\+]?[1-9][\d]{0,15}$/
  return regex.test(telefono.replace(/\s/g, ''))
}

/**
 * Formatea una fecha para mostrar
 */
export const formatearFecha = (fecha: Date): string => {
  return fecha.toLocaleDateString('es-ES', {
    year: 'numeric',
    month: 'long',
    day: 'numeric',
    hour: '2-digit',
    minute: '2-digit'
  })
}

/**
 * Formatea una fecha relativa (hace X tiempo)
 */
export const formatearFechaRelativa = (fecha: Date): string => {
  const ahora = new Date()
  const diferencia = ahora.getTime() - fecha.getTime()
  const segundos = Math.floor(diferencia / 1000)
  const minutos = Math.floor(segundos / 60)
  const horas = Math.floor(minutos / 60)
  const dias = Math.floor(horas / 24)

  if (dias > 0) {
    return `hace ${dias} día${dias > 1 ? 's' : ''}`
  } else if (horas > 0) {
    return `hace ${horas} hora${horas > 1 ? 's' : ''}`
  } else if (minutos > 0) {
    return `hace ${minutos} minuto${minutos > 1 ? 's' : ''}`
  } else {
    return 'ahora mismo'
  }
}

/**
 * Clona un objeto profundamente
 */
export const clonarObjeto = <T>(obj: T): T => {
  return JSON.parse(JSON.stringify(obj))
}

/**
 * Debounce function para optimizar llamadas
 */
export const debounce = <T extends (...args: any[]) => any>(
  func: T,
  wait: number
): ((...args: Parameters<T>) => void) => {
  let timeout: NodeJS.Timeout
  return (...args: Parameters<T>) => {
    clearTimeout(timeout)
    timeout = setTimeout(() => func(...args), wait)
  }
}

/**
 * Throttle function para limitar la frecuencia de llamadas
 */
export const throttle = <T extends (...args: any[]) => any>(
  func: T,
  limit: number
): ((...args: Parameters<T>) => void) => {
  let inThrottle: boolean
  return (...args: Parameters<T>) => {
    if (!inThrottle) {
      func(...args)
      inThrottle = true
      setTimeout(() => inThrottle = false, limit)
    }
  }
}

/**
 * Genera un color aleatorio para las líneas
 */
export const generarColorAleatorio = (): string => {
  const colores = [
    '#22c55e', // verde
    '#3b82f6', // azul
    '#f97316', // naranja
    '#8b5cf6', // púrpura
    '#ef4444', // rojo
    '#eab308', // amarillo
    '#06b6d4', // cyan
    '#f43f5e', // rosa
  ]
  return colores[Math.floor(Math.random() * colores.length)] || '#22c55e'
}

/**
 * Calcula el progreso basado en valores actuales y totales
 */
export const calcularProgreso = (actual: number, total: number): number => {
  if (total === 0) return 0
  return Math.min((actual / total) * 100, 100)
}

/**
 * Interpola entre dos valores
 */
export const interpolar = (inicio: number, fin: number, progreso: number): number => {
  return inicio + (fin - inicio) * progreso
}

/**
 * Convierte coordenadas GPS a píxeles en un canvas
 */
export const gpsAPixeles = (
  lat: number,
  lng: number,
  latMin: number,
  latMax: number,
  lngMin: number,
  lngMax: number,
  ancho: number,
  alto: number
): { x: number; y: number } => {
  const x = ((lng - lngMin) / (lngMax - lngMin)) * ancho
  const y = ((latMax - lat) / (latMax - latMin)) * alto
  return { x, y }
}

/**
 * Convierte píxeles a coordenadas GPS
 */
export const pixelesAGPS = (
  x: number,
  y: number,
  latMin: number,
  latMax: number,
  lngMin: number,
  lngMax: number,
  ancho: number,
  alto: number
): { lat: number; lng: number } => {
  const lng = lngMin + (x / ancho) * (lngMax - lngMin)
  const lat = latMax - (y / alto) * (latMax - latMin)
  return { lat, lng }
}
