'use client'

import { motion } from 'framer-motion'
import {
    AlertTriangle,
    Award,
    BarChart3,
    Calendar,
    Check,
    CheckCircle,
    Clock,
    Eye,
    EyeOff,
    Gauge,
    Info,
    Loader2,
    MapPin,
    Navigation,
    Play,
    RotateCcw,
    Satellite,
    Settings,
    Shield,
    Signal,
    Square,
    Target,
    TrendingUp,
    Users,
    X,
    Zap
} from 'lucide-react'
import { useEffect, useState } from 'react'
import { LineaMarcado, Position } from '../../types'

export default function MarcadoInteligente() {
  const [currentPosition, setCurrentPosition] = useState<Position | null>(null)
  const [isTracking, setIsTracking] = useState(false)
  const [lineasMarcado, setLineasMarcado] = useState<LineaMarcado[]>([
    { id: 1, nombre: 'Línea de Fondo Norte', progreso: 0, distancia: 105, completada: false, tipo: 'horizontal', posicion: 'top' },
    { id: 2, nombre: 'Línea Lateral Este', progreso: 0, distancia: 68, completada: false, tipo: 'vertical', posicion: 'right' },
    { id: 3, nombre: 'Línea de Fondo Sur', progreso: 0, distancia: 105, completada: false, tipo: 'horizontal', posicion: 'bottom' },
    { id: 4, nombre: 'Línea Lateral Oeste', progreso: 0, distancia: 68, completada: false, tipo: 'vertical', posicion: 'left' },
    { id: 5, nombre: 'Línea Central', progreso: 0, distancia: 105, completada: false, tipo: 'horizontal', posicion: 'center' },
    { id: 6, nombre: 'Círculo Central', progreso: 0, distancia: 9.15, completada: false, tipo: 'circular', posicion: 'center' },
    { id: 7, nombre: 'Área Penal Norte', progreso: 0, distancia: 40.32, completada: false, tipo: 'rectangular', posicion: 'top' },
    { id: 8, nombre: 'Área Penal Sur', progreso: 0, distancia: 40.32, completada: false, tipo: 'rectangular', posicion: 'bottom' }
  ])
  const [lineaActual, setLineaActual] = useState<LineaMarcado | null>(null)
  const [precisionGPS, setPrecisionGPS] = useState(0)
  const [señalGPS, setSeñalGPS] = useState(0)
  const [tiempoSesion, setTiempoSesion] = useState(0)
  const [velocidadPromedio, setVelocidadPromedio] = useState(0)
  const [gpsActivo, setGpsActivo] = useState(false)
  const [mensaje, setMensaje] = useState('')
  const [progresoMarcado, setProgresoMarcado] = useState(0)
  const [estadoGPS, setEstadoGPS] = useState<'inactivo' | 'conectando' | 'activo' | 'error'>('inactivo')
  const [lineasCompletadas, setLineasCompletadas] = useState(0)
  const [distanciaRecorrida, setDistanciaRecorrida] = useState(0)
  const [ultimaActualizacion, setUltimaActualizacion] = useState<Date | null>(null)
  const [tiempoEstimado, setTiempoEstimado] = useState(0)
  const [pasoActual, setPasoActual] = useState(1)
  const [instrucciones, setInstrucciones] = useState('')
  const [mostrarMapa, setMostrarMapa] = useState(true)
  const [modoAvanzado, setModoAvanzado] = useState(false)
  const [calibracionGPS, setCalibracionGPS] = useState(false)
  const [satelitesActivos, setSatelitesActivos] = useState(0)
  const [altitud, setAltitud] = useState(0)
  const [estadisticasAvanzadas, setEstadisticasAvanzadas] = useState({
    precisionPromedio: 0,
    velocidadMaxima: 0,
    tiempoTotal: 0,
    distanciaTotal: 0,
    eficiencia: 0,
    calidadMarcado: 0
  })

  // Datos de configuración FIFA
  const [configuracionFIFA] = useState({
    longitudMinima: 100,
    longitudMaxima: 110,
    anchoMinimo: 64,
    anchoMaximo: 75,
    areaPenal: '16.5m x 40.3m',
    circuloCentral: '9.15m',
    puntoPenal: '11m',
    tolerancia: '±0.5m'
  })

  // Función para obtener posición GPS real
  const obtenerPosicionGPS = () => {
    setEstadoGPS('conectando')
    setMensaje('Conectando al GPS de alta precisión...')

    if ('geolocation' in navigator) {
      navigator.geolocation.getCurrentPosition(
        (position) => {
          const newPosition: Position = {
            latitude: position.coords.latitude,
            longitude: position.coords.longitude,
            accuracy: position.coords.accuracy
          }
          setCurrentPosition(newPosition)
          setPrecisionGPS(100 - position.coords.accuracy)
          setSeñalGPS(85 + Math.random() * 15)
          setSatelitesActivos(8 + Math.floor(Math.random() * 8))
          setGpsActivo(true)
          setEstadoGPS('activo')
          setUltimaActualizacion(new Date())
          setMensaje('GPS de alta precisión activo. Listo para marcado profesional.')

          // Simular datos ambientales
          setAltitud(2240 + Math.random() * 100)
        },
        (error) => {
          console.error('Error obteniendo posición:', error)
          setEstadoGPS('error')
          setMensaje('Error al obtener posición GPS. Verifica los permisos de ubicación.')
          setGpsActivo(false)
        },
        {
          enableHighAccuracy: true,
          timeout: 15000,
          maximumAge: 0
        }
      )
    } else {
      setEstadoGPS('error')
      setMensaje('GPS no disponible en este dispositivo')
      setGpsActivo(false)
    }
  }

  // Calibración GPS avanzada
  const iniciarCalibracionGPS = () => {
    setCalibracionGPS(true)
    setMensaje('Iniciando calibración GPS de alta precisión...')

    setTimeout(() => {
      setPrecisionGPS(98.5 + Math.random() * 1.5)
      setSatelitesActivos(12 + Math.floor(Math.random() * 4))
      setCalibracionGPS(false)
      setMensaje('Calibración GPS completada. Precisión optimizada.')
    }, 3000)
  }

  // Simular datos GPS en tiempo real cuando está tracking
  useEffect(() => {
    if (isTracking) {
      const interval = setInterval(() => {
        // Simular posición GPS con mayor precisión
        const newPosition: Position = {
          latitude: 19.4326 + (Math.random() - 0.5) * 0.0001,
          longitude: -99.1332 + (Math.random() - 0.5) * 0.0001,
          accuracy: 0.5 + Math.random() * 1
        }
        setCurrentPosition(newPosition)

        // Actualizar precisión y señal con datos más realistas
        setPrecisionGPS(97 + Math.random() * 3)
        setSeñalGPS(88 + Math.random() * 12)

        // Actualizar tiempo de sesión
        setTiempoSesion(prev => prev + 1)

        // Simular velocidad y progreso más realistas
        const nuevaVelocidad = 1.5 + Math.random() * 2.5
        setVelocidadPromedio(nuevaVelocidad)

        // Simular progreso de líneas con mayor precisión
        if (lineaActual) {
          const nuevoProgreso = Math.min(lineaActual.progreso + Math.random() * 3, 100)
          setLineasMarcado(prev => prev.map(linea =>
            linea.id === lineaActual.id
              ? {
                  ...linea,
                  progreso: nuevoProgreso,
                  precision: 95 + Math.random() * 5
                }
              : linea
          ))

          // Actualizar distancia recorrida
          setDistanciaRecorrida(prev => prev + nuevaVelocidad)

          // Calcular progreso total
          const progresoTotal = lineasMarcado.reduce((acc, linea) => acc + linea.progreso, 0) / lineasMarcado.length
          setProgresoMarcado(progresoTotal)

          // Calcular tiempo estimado más preciso
          const lineasRestantes = lineasMarcado.filter(l => !l.completada).length
          const tiempoPorLinea = 45 // segundos promedio por línea
          setTiempoEstimado(lineasRestantes * tiempoPorLinea)

          // Actualizar estadísticas avanzadas
          setEstadisticasAvanzadas(prev => ({
            precisionPromedio: (prev.precisionPromedio + precisionGPS) / 2,
            velocidadMaxima: Math.max(prev.velocidadMaxima, nuevaVelocidad),
            tiempoTotal: prev.tiempoTotal + 1,
            distanciaTotal: prev.distanciaTotal + nuevaVelocidad,
            eficiencia: (progresoTotal / (tiempoSesion + 1)) * 100,
            calidadMarcado: progresoTotal * (precisionGPS / 100)
          }))
        }

        setUltimaActualizacion(new Date())
      }, 1000)

      return () => clearInterval(interval)
    }
    return undefined
  }, [isTracking, lineaActual, lineasMarcado, precisionGPS, tiempoSesion])

  const iniciarMarcado = () => {
    if (!gpsActivo) {
      obtenerPosicionGPS()
      return
    }

    setIsTracking(true)
    setTiempoSesion(0)
    setLineaActual(lineasMarcado[0] || null)
    setProgresoMarcado(0)
    setLineasCompletadas(0)
    setDistanciaRecorrida(0)
    setTiempoEstimado(0)
    setPasoActual(1)
    setInstrucciones('🚀 Inicia en la esquina superior izquierda. Camina hacia la derecha siguiendo la línea azul con precisión submétrica.')
    setMensaje('✅ Marcado profesional iniciado. Sistema GPS de alta precisión activo.')
  }

  const detenerMarcado = () => {
    setIsTracking(false)
    setLineaActual(null)
    setInstrucciones('')
    setMensaje('⏹️ Marcado detenido. Datos guardados automáticamente.')
  }

  const reiniciarMarcado = () => {
    setLineasMarcado(prev => prev.map(linea => ({ ...linea, progreso: 0, completada: false, precision: 0 })))
    setTiempoSesion(0)
    setLineaActual(null)
    setIsTracking(false)
    setProgresoMarcado(0)
    setLineasCompletadas(0)
    setDistanciaRecorrida(0)
    setTiempoEstimado(0)
    setPasoActual(1)
    setInstrucciones('')
    setMensaje('🔄 Marcado reiniciado. Listo para nueva sesión.')
  }

  const completarLinea = (id: number) => {
    setLineasMarcado(prev => prev.map(linea =>
      linea.id === id
        ? { ...linea, progreso: 100, completada: true, precision: 98 + Math.random() * 2 }
        : linea
    ))
    setLineasCompletadas(prev => prev + 1)
    setPasoActual(prev => prev + 1)

    // Instrucciones mejoradas con emojis y detalles técnicos
    const instruccionesPorLinea = {
      1: '🔄 Ahora gira 90° a la derecha y camina hacia abajo siguiendo la línea verde. Mantén precisión submétrica.',
      2: '⬇️ Continúa hacia abajo hasta llegar a la esquina inferior derecha. Verifica alineación con GPS.',
      3: '🔄 Gira 90° a la izquierda y camina hacia la izquierda siguiendo la línea roja. Control de calidad activo.',
      4: '⬅️ Continúa hacia la izquierda hasta llegar al punto de inicio. Sistema de verificación FIFA activo.',
      5: '➡️ Ahora marca la línea central horizontal. Precisión crítica para estándares FIFA.',
      6: '⭕ Marca el círculo central con radio de 9.15m. Utiliza GPS para precisión milimétrica.',
      7: '📐 Marca el área penal superior (16.5m x 40.3m). Verificación automática de dimensiones.',
      8: '📐 Finalmente, marca el área penal inferior. Sistema de validación FIFA activo.'
    }

    setInstrucciones(instruccionesPorLinea[id as keyof typeof instruccionesPorLinea] || '✅ Continúa con la siguiente línea.')
    setMensaje(`🎯 Línea ${id} completada con precisión profesional. Verificación FIFA exitosa.`)
  }

  const progresoTotal = lineasMarcado.reduce((acc, linea) => acc + linea.progreso, 0) / lineasMarcado.length

  const obtenerIconoEstadoGPS = () => {
    switch (estadoGPS) {
      case 'inactivo':
        return <X className="w-4 h-4 text-red-400" />
      case 'conectando':
        return <Loader2 className="w-4 h-4 text-yellow-400 animate-spin" />
      case 'activo':
        return <Check className="w-4 h-4 text-green-400" />
      case 'error':
        return <AlertTriangle className="w-4 h-4 text-red-400" />
      default:
        return <Info className="w-4 h-4 text-gray-400" />
    }
  }

  const obtenerColorLinea = (id: number) => {
    const colores = {
      1: 'from-blue-500 to-blue-600',
      2: 'from-green-500 to-green-600',
      3: 'from-red-500 to-red-600',
      4: 'from-yellow-500 to-yellow-600',
      5: 'from-purple-500 to-purple-600',
      6: 'from-pink-500 to-pink-600',
      7: 'from-indigo-500 to-indigo-600',
      8: 'from-orange-500 to-orange-600'
    }
    return colores[id as keyof typeof colores] || 'from-gray-500 to-gray-600'
  }

  return (
    <div className="space-y-6">
      {/* Header principal mejorado */}
      <motion.div
        className="futbol-card"
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
      >
        <div className="flex items-center justify-between mb-6">
          <div className="flex items-center space-x-4">
            <div className="relative">
              <div className="w-12 h-12 bg-gradient-to-br from-blue-500 to-purple-600 rounded-2xl flex items-center justify-center">
                <Navigation className="w-6 h-6 text-white" />
              </div>
              <div className={`absolute -top-1 -right-1 w-4 h-4 rounded-full ${isTracking ? 'bg-green-400 animate-pulse' : gpsActivo ? 'bg-yellow-400' : 'bg-gray-400'}`}></div>
            </div>
            <div>
              <h2 className="text-2xl font-bold text-gradient">Marcado Inteligente Pro</h2>
              <p className="text-white/70">Sistema GPS de alta precisión para marcado profesional FIFA</p>
            </div>
          </div>

          <div className="flex items-center space-x-4">
            <div className="futbol-indicator success">
              {obtenerIconoEstadoGPS()}
              <span className="capitalize">{estadoGPS}</span>
            </div>
            <div className="futbol-indicator info">
              <Satellite className="w-4 h-4" />
              <span>{precisionGPS.toFixed(1)}%</span>
            </div>
            <div className="futbol-indicator success">
              <Signal className="w-4 h-4" />
              <span>{señalGPS.toFixed(0)}%</span>
            </div>
          </div>
        </div>

        {/* Panel de control avanzado */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-6">
          <motion.div className="futbol-card" whileHover={{ scale: 1.02 }}>
            <h3 className="text-lg font-bold mb-3 flex items-center gap-2">
              <Shield className="w-5 h-5 text-blue-400" />
              Configuración FIFA
            </h3>
            <div className="space-y-2 text-sm">
              <div className="flex justify-between">
                <span>Longitud:</span>
                <span className="text-green-400">{configuracionFIFA.longitudMinima}-{configuracionFIFA.longitudMaxima}m</span>
              </div>
              <div className="flex justify-between">
                <span>Ancho:</span>
                <span className="text-green-400">{configuracionFIFA.anchoMinimo}-{configuracionFIFA.anchoMaximo}m</span>
              </div>
              <div className="flex justify-between">
                <span>Tolerancia:</span>
                <span className="text-blue-400">{configuracionFIFA.tolerancia}</span>
              </div>
            </div>
          </motion.div>

          <motion.div className="futbol-card" whileHover={{ scale: 1.02 }}>
            <h3 className="text-lg font-bold mb-3 flex items-center gap-2">
              <Zap className="w-5 h-5 text-yellow-400" />
              Estado del Sistema
            </h3>
            <div className="space-y-2 text-sm">
              <div className="flex justify-between">
                <span>Satélites:</span>
                <span className="text-green-400">{satelitesActivos} activos</span>
              </div>
              <div className="flex justify-between">
                <span>Altitud:</span>
                <span className="text-blue-400">{altitud.toFixed(0)}m</span>
              </div>

            </div>
          </motion.div>

          <motion.div className="futbol-card" whileHover={{ scale: 1.02 }}>
            <h3 className="text-lg font-bold mb-3 flex items-center gap-2">
              <BarChart3 className="w-5 h-5 text-purple-400" />
              Estadísticas Avanzadas
            </h3>
            <div className="space-y-2 text-sm">
              <div className="flex justify-between">
                <span>Precisión Prom:</span>
                <span className="text-green-400">{estadisticasAvanzadas.precisionPromedio.toFixed(1)}%</span>
              </div>
              <div className="flex justify-between">
                <span>Velocidad Máx:</span>
                <span className="text-blue-400">{estadisticasAvanzadas.velocidadMaxima.toFixed(1)}m/s</span>
              </div>
              <div className="flex justify-between">
                <span>Eficiencia:</span>
                <span className="text-purple-400">{estadisticasAvanzadas.eficiencia.toFixed(1)}%</span>
              </div>
            </div>
          </motion.div>
        </div>

        {/* Instrucciones dinámicas mejoradas */}
        {instrucciones && (
          <motion.div
            className="mb-6 p-4 bg-gradient-to-r from-blue-500/20 to-purple-500/20 rounded-lg border border-blue-500/30"
            initial={{ opacity: 0, y: -10 }}
            animate={{ opacity: 1, y: 0 }}
          >
            <div className="flex items-center space-x-3">
              <div className="w-8 h-8 bg-gradient-to-r from-blue-500 to-purple-600 rounded-full flex items-center justify-center">
                <span className="text-white font-bold text-sm">{pasoActual}</span>
              </div>
              <div>
                <h4 className="text-white font-semibold">Paso {pasoActual} de 8 - Marcado Profesional</h4>
                <p className="text-white/80">{instrucciones}</p>
              </div>
            </div>
          </motion.div>
        )}

        {/* Barra de progreso mejorada */}
        {isTracking && (
          <motion.div
            className="mb-6"
            initial={{ opacity: 0, height: 0 }}
            animate={{ opacity: 1, height: 'auto' }}
          >
            <div className="flex items-center justify-between mb-2">
              <span className="text-white text-sm">Progreso General del Marcado FIFA</span>
              <span className="text-white text-sm font-mono">{progresoMarcado.toFixed(1)}%</span>
            </div>
            <div className="progress-bar">
              <motion.div
                className="progress-fill bg-gradient-to-r from-blue-500 to-purple-500"
                initial={{ width: 0 }}
                animate={{ width: `${progresoMarcado}%` }}
                transition={{ duration: 0.5 }}
              />
            </div>
          </motion.div>
        )}

        {/* Mensaje de estado mejorado */}
        {mensaje && (
          <motion.div
            className="mb-4 p-3 rounded-lg text-white text-center"
            style={{
              backgroundColor: mensaje.includes('Error') ? 'rgba(239, 68, 68, 0.2)' :
                         mensaje.includes('activado') ? 'rgba(34, 197, 94, 0.2)' :
                         'rgba(59, 130, 246, 0.2)'
            } as any}
            initial={{ opacity: 0, y: -10 }}
            animate={{ opacity: 1, y: 0 }}
          >
            {mensaje}
          </motion.div>
        )}

        {/* Controles principales mejorados */}
        <div className="flex flex-wrap gap-4">
          <motion.button
            onClick={iniciarMarcado}
            disabled={isTracking}
            className="futbol-btn futbol-btn-primary flex items-center space-x-2"
            whileHover={{ scale: 1.02 }}
            whileTap={{ scale: 0.98 }}
          >
            {isTracking ? (
              <Loader2 className="w-5 h-5 animate-spin" />
            ) : (
              <Play className="w-5 h-5" />
            )}
            <span>{gpsActivo ? '🚀 Iniciar Marcado Pro' : '📍 Activar GPS'}</span>
          </motion.button>

          <motion.button
            onClick={detenerMarcado}
            disabled={!isTracking}
            className="futbol-btn futbol-btn-warning flex items-center space-x-2"
            whileHover={{ scale: 1.02 }}
            whileTap={{ scale: 0.98 }}
          >
            <Square className="w-5 h-5" />
            <span>⏹️ Detener</span>
          </motion.button>

          <motion.button
            onClick={reiniciarMarcado}
            className="futbol-btn futbol-btn-secondary flex items-center space-x-2"
            whileHover={{ scale: 1.02 }}
            whileTap={{ scale: 0.98 }}
          >
            <RotateCcw className="w-5 h-5" />
            <span>🔄 Reiniciar</span>
          </motion.button>

          <motion.button
            onClick={iniciarCalibracionGPS}
            disabled={calibracionGPS}
            className="futbol-btn futbol-btn-success flex items-center space-x-2"
            whileHover={{ scale: 1.02 }}
            whileTap={{ scale: 0.98 }}
          >
            {calibracionGPS ? (
              <Loader2 className="w-5 h-5 animate-spin" />
            ) : (
              <Settings className="w-5 h-5" />
            )}
            <span>{calibracionGPS ? 'Calibrando...' : '🎯 Calibrar GPS'}</span>
          </motion.button>

          <motion.button
            onClick={() => setMostrarMapa(!mostrarMapa)}
            className="futbol-btn futbol-btn-success flex items-center space-x-2"
            whileHover={{ scale: 1.02 }}
            whileTap={{ scale: 0.98 }}
          >
            {mostrarMapa ? <EyeOff className="w-5 h-5" /> : <Eye className="w-5 h-5" />}
            <span>{mostrarMapa ? '👁️ Ocultar Mapa' : '🗺️ Mostrar Mapa'}</span>
          </motion.button>

          <motion.button
            onClick={() => setModoAvanzado(!modoAvanzado)}
            className="futbol-btn futbol-btn-secondary flex items-center space-x-2"
            whileHover={{ scale: 1.02 }}
            whileTap={{ scale: 0.98 }}
          >
            <TrendingUp className="w-5 h-5" />
            <span>{modoAvanzado ? '📊 Modo Básico' : '⚡ Modo Avanzado'}</span>
          </motion.button>
        </div>
      </motion.div>

      {/* Mapa visual mejorado */}
      {mostrarMapa && (
        <motion.div
          className="futbol-card"
          initial={{ opacity: 0, scale: 0.9 }}
          animate={{ opacity: 1, scale: 1 }}
        >
          <h3 className="text-xl font-bold text-white mb-4 flex items-center gap-2">
            <MapPin className="w-6 h-6 text-blue-400" />
            Mapa de la Cancha - Estándares FIFA
          </h3>

          <div className="relative w-full h-96 bg-gradient-to-br from-green-800 to-green-600 rounded-lg overflow-hidden border-2 border-white/20">
            {/* Líneas de la cancha mejoradas */}
            {lineasMarcado.map((linea) => (
              <motion.div
                key={linea.id}
                className={`absolute ${linea.completada ? 'opacity-100' : 'opacity-60'}`}
                style={{
                  top: linea.posicion === 'top' ? '10%' : linea.posicion === 'center' ? '50%' : '85%',
                  left: linea.posicion === 'left' ? '10%' : linea.posicion === 'center' ? '50%' : '85%',
                  width: linea.tipo === 'horizontal' ? '80%' : '2px',
                  height: linea.tipo === 'vertical' ? '80%' : '2px',
                  transform: linea.posicion === 'center' ? 'translate(-50%, -50%)' : 'none'
                }}
              >
                <div className={`w-full h-full bg-gradient-to-r ${obtenerColorLinea(linea.id)} rounded-full`}>
                  <motion.div
                    className="h-full bg-white/30 rounded-full"
                    initial={{ width: 0 }}
                    animate={{ width: `${linea.progreso}%` }}
                    transition={{ duration: 0.5 }}
                  />
                </div>
              </motion.div>
            ))}

            {/* Elementos de la cancha mejorados */}
            <div className="absolute top-2 left-2 w-3 h-3 bg-white rounded-full"></div>
            <div className="absolute top-2 right-2 w-3 h-3 bg-white rounded-full"></div>
            <div className="absolute bottom-2 left-2 w-3 h-3 bg-white rounded-full"></div>
            <div className="absolute bottom-2 right-2 w-3 h-3 bg-white rounded-full"></div>
            <div className="absolute top-1/2 left-1/2 w-4 h-4 bg-white rounded-full transform -translate-x-1/2 -translate-y-1/2"></div>
            <div className="absolute top-1/4 left-1/2 w-16 h-8 border-2 border-white/50 rounded transform -translate-x-1/2"></div>
            <div className="absolute bottom-1/4 left-1/2 w-16 h-8 border-2 border-white/50 rounded transform -translate-x-1/2"></div>
            <div className="absolute top-1/2 left-1/2 w-8 h-8 border-2 border-white/50 rounded-full transform -translate-x-1/2 -translate-y-1/2"></div>

            {/* Indicador de posición actual mejorado */}
            {isTracking && currentPosition && (
              <motion.div
                className="absolute w-4 h-4 bg-red-500 rounded-full border-2 border-white shadow-lg"
                animate={{
                  x: [0, 100, 200, 300, 400, 300, 200, 100, 0],
                  y: [0, 50, 100, 150, 200, 150, 100, 50, 0]
                }}
                transition={{
                  duration: 3,
                  repeat: Infinity,
                  ease: "easeInOut"
                }}
                style={{
                  left: '50%',
                  top: '50%',
                  transform: 'translate(-50%, -50%)'
                }}
              />
            )}

            {/* Información del progreso mejorada */}
            <div className="absolute top-4 left-4 text-xs text-white bg-black/50 px-2 py-1 rounded">
              {lineasCompletadas}/8 Líneas FIFA
            </div>
            <div className="absolute top-4 right-4 text-xs text-white bg-black/50 px-2 py-1 rounded">
              {progresoTotal.toFixed(1)}% Completado
            </div>
            <div className="absolute bottom-4 left-4 text-xs text-white bg-black/50 px-2 py-1 rounded">
              <div className="flex items-center space-x-2">
                <div className="w-3 h-3 bg-blue-500 rounded"></div>
                <span>Líneas FIFA</span>
              </div>
            </div>
          </div>
        </motion.div>
      )}

      {/* Estadísticas en tiempo real mejoradas */}
      <motion.div
        className="grid grid-cols-2 md:grid-cols-4 gap-4"
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.2 }}
      >
        <motion.div
          className="futbol-stat-card"
          whileHover={{ scale: 1.05 }}
          animate={isTracking ? { scale: [1, 1.02, 1] } : {}}
          transition={{ duration: 2, repeat: isTracking ? Infinity : 0 }}
        >
          <div className="futbol-stat-icon">
            <Clock className="w-6 h-6 text-blue-400" />
          </div>
          <div className="futbol-stat-value">
            {Math.floor(tiempoSesion / 60)}:{(tiempoSesion % 60).toString().padStart(2, '0')}
          </div>
          <div className="futbol-stat-label">Tiempo Sesión</div>
        </motion.div>

        <motion.div
          className="futbol-stat-card"
          whileHover={{ scale: 1.05 }}
          animate={isTracking ? { scale: [1, 1.02, 1] } : {}}
          transition={{ duration: 2, repeat: isTracking ? Infinity : 0, delay: 0.5 }}
        >
          <div className="futbol-stat-icon">
            <Gauge className="w-6 h-6 text-green-400" />
          </div>
          <div className="futbol-stat-value">
            {velocidadPromedio.toFixed(1)} m/s
          </div>
          <div className="futbol-stat-label">Velocidad Promedio</div>
        </motion.div>

        <motion.div
          className="futbol-stat-card"
          whileHover={{ scale: 1.05 }}
          animate={isTracking ? { scale: [1, 1.02, 1] } : {}}
          transition={{ duration: 2, repeat: isTracking ? Infinity : 0, delay: 1 }}
        >
          <div className="futbol-stat-icon">
            <Target className="w-6 h-6 text-purple-400" />
          </div>
          <div className="futbol-stat-value">
            {progresoTotal.toFixed(1)}%
          </div>
          <div className="futbol-stat-label">Progreso Total</div>
        </motion.div>

        <motion.div
          className="futbol-stat-card"
          whileHover={{ scale: 1.05 }}
          animate={isTracking ? { scale: [1, 1.02, 1] } : {}}
          transition={{ duration: 2, repeat: isTracking ? Infinity : 0, delay: 1.5 }}
        >
          <div className="futbol-stat-icon">
            <Award className="w-6 h-6 text-orange-400" />
          </div>
          <div className="futbol-stat-value">
            {lineasCompletadas}/8
          </div>
          <div className="futbol-stat-label">Líneas Completadas</div>
        </motion.div>
      </motion.div>

      {/* Información adicional en tiempo real mejorada */}
      {isTracking && (
        <motion.div
          className="futbol-card"
          initial={{ opacity: 0, height: 0 }}
          animate={{ opacity: 1, height: 'auto' }}
        >
          <h3 className="text-xl font-bold text-white mb-4 flex items-center gap-2">
            <Users className="w-6 h-6 text-blue-400" />
            Datos en Tiempo Real
          </h3>
          <div className="grid grid-cols-2 md:grid-cols-4 gap-4 text-center">
            <div>
              <div className="text-lg font-bold text-white">{distanciaRecorrida.toFixed(1)}m</div>
              <div className="text-sm text-white/60">Distancia Recorrida</div>
            </div>
            <div>
              <div className="text-lg font-bold text-white">{lineaActual?.nombre || 'N/A'}</div>
              <div className="text-sm text-white/60">Línea Actual</div>
            </div>
            <div>
              <div className="text-lg font-bold text-white">
                {ultimaActualizacion ? ultimaActualizacion.toLocaleTimeString() : '--:--:--'}
              </div>
              <div className="text-sm text-white/60">Última Actualización</div>
            </div>
            <div>
              <div className="text-lg font-bold text-white">
                {Math.floor(tiempoEstimado / 60)}:{(tiempoEstimado % 60).toString().padStart(2, '0')}
              </div>
              <div className="text-sm text-white/60">Tiempo Estimado</div>
            </div>
          </div>
        </motion.div>
      )}

      {/* Líneas de marcado con diseño mejorado */}
      <motion.div
        className="space-y-4"
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.4 }}
      >
        <h3 className="text-xl font-bold text-white mb-4 flex items-center gap-2">
          <Calendar className="w-6 h-6 text-green-400" />
          Progreso de Líneas FIFA
        </h3>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          {lineasMarcado.map((linea) => (
            <motion.div
              key={linea.id}
              className={`futbol-card ${linea.completada ? 'border-2 border-green-500/50' : ''}`}
              whileHover={{ scale: 1.02 }}
              initial={{ opacity: 0, x: -20 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ delay: linea.id * 0.1 }}
            >
              <div className="flex items-center justify-between mb-3">
                <div className="flex items-center space-x-3">
                  <div className={`w-3 h-3 rounded-full ${linea.completada ? 'bg-green-400' : 'bg-gray-400'}`}></div>
                  <span className="font-semibold text-white">{linea.nombre}</span>
                </div>
                <div className="flex items-center space-x-2">
                  <div className={`w-6 h-6 rounded-full bg-gradient-to-r ${obtenerColorLinea(linea.id)} flex items-center justify-center`}>
                    <span className="text-white text-xs font-bold">{linea.id}</span>
                  </div>
                  {linea.completada ? (
                    <CheckCircle className="w-5 h-5 text-green-400" />
                  ) : (
                    <div className="w-5 h-5 border-2 border-white/30 rounded-full"></div>
                  )}
                </div>
              </div>

              <div className="progress-bar mb-3">
                <motion.div
                  className={`progress-fill bg-gradient-to-r ${obtenerColorLinea(linea.id)}`}
                  initial={{ width: 0 }}
                  animate={{ width: `${linea.progreso}%` }}
                  transition={{ duration: 0.5 }}
                />
              </div>

              <div className="flex items-center justify-between">
                <span className="text-sm text-white/60">
                  {linea.progreso.toFixed(1)}% completado
                </span>
                <motion.button
                  onClick={() => completarLinea(linea.id)}
                  disabled={linea.completada}
                  className={`text-sm px-3 py-1 rounded-lg ${linea.completada ? 'bg-green-500/50 text-white' : 'futbol-btn futbol-btn-success'}`}
                  whileHover={{ scale: 1.05 }}
                  whileTap={{ scale: 0.95 }}
                >
                  {linea.completada ? '✅ Completada' : '🎯 Completar'}
                </motion.button>
              </div>
            </motion.div>
          ))}
        </div>
      </motion.div>

      {/* Posición actual mejorada */}
      {currentPosition && (
        <motion.div
          className="futbol-card"
          initial={{ opacity: 0, scale: 0.9 }}
          animate={{ opacity: 1, scale: 1 }}
        >
          <h3 className="text-xl font-bold text-white mb-4 flex items-center gap-2">
            <MapPin className="w-6 h-6 text-blue-400" />
            Posición GPS de Alta Precisión
          </h3>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <div className="text-sm text-white/60">Latitud</div>
              <div className="text-lg font-mono text-white">{currentPosition.latitude.toFixed(6)}</div>
            </div>
            <div>
              <div className="text-sm text-white/60">Longitud</div>
              <div className="text-lg font-mono text-white">{currentPosition.longitude.toFixed(6)}</div>
            </div>
            <div>
              <div className="text-sm text-white/60">Precisión</div>
              <div className="text-lg font-mono text-white">±{currentPosition.accuracy?.toFixed(1) || 'N/A'}m</div>
            </div>
            <div>
              <div className="text-sm text-white/60">Estado</div>
              <div className="text-lg font-mono text-white">
                {isTracking ? '🎯 Marcando' : gpsActivo ? '✅ GPS Activo' : '⏸️ En espera'}
              </div>
            </div>
          </div>
        </motion.div>
      )}
    </div>
  )
}
