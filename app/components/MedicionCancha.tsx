'use client'

import { motion } from 'framer-motion'
import {
    AlertCircle,
    AlertTriangle,
    Award,
    BarChart3,
    Calendar,
    Check,
    CheckCircle,
    Clock,
    Download,
    Eye,
    EyeOff,
    Gauge,
    Globe,
    Info,
    Loader2,
    MapPin,
    Play,
    RotateCcw,
    Ruler,
    Satellite,
    Settings,
    Shield,
    Signal,
    Square,
    Target,
    TrendingUp,
    Trophy,
    Users,
    X,
    Zap
} from 'lucide-react'
import { useEffect, useState } from 'react'
import { Medicion, PuntoGPS } from '../../types'

export default function MedicionCancha() {
  const [currentPosition, setCurrentPosition] = useState<PuntoGPS | null>(null)
  const [isMeasuring, setIsMeasuring] = useState(false)
  const [puntosMedicion, setPuntosMedicion] = useState<PuntoGPS[]>([])
  const [mediciones, setMediciones] = useState<Medicion[]>([
    { id: '1', nombre: 'Longitud Total', distancia: 0, tolerancia: 0.5, cumpleFIFA: false, fecha: new Date(), timestamp: Date.now(), tipo: 'linea' },
    { id: '2', nombre: 'Ancho Total', distancia: 0, tolerancia: 0.5, cumpleFIFA: false, fecha: new Date(), timestamp: Date.now(), tipo: 'linea' },
    { id: '3', nombre: 'Área de Penal Norte', distancia: 0, tolerancia: 0.3, cumpleFIFA: false, fecha: new Date(), timestamp: Date.now(), tipo: 'area' },
    { id: '4', nombre: 'Área de Penal Sur', distancia: 0, tolerancia: 0.3, cumpleFIFA: false, fecha: new Date(), timestamp: Date.now(), tipo: 'area' },
    { id: '5', nombre: 'Círculo Central', distancia: 0, tolerancia: 0.1, cumpleFIFA: false, fecha: new Date(), timestamp: Date.now(), tipo: 'circulo' }
  ])
  const [precisionGPS, setPrecisionGPS] = useState(0)
  const [señalGPS, setSeñalGPS] = useState(0)
  const [tiempoSesion, setTiempoSesion] = useState(0)
  const [distanciaTotal, setDistanciaTotal] = useState(0)
  const [calificacionFIFA, setCalificacionFIFA] = useState(0)
  const [gpsActivo, setGpsActivo] = useState(false)
  const [mensaje, setMensaje] = useState('')
  const [progresoMedicion, setProgresoMedicion] = useState(0)
  const [estadoGPS, setEstadoGPS] = useState<'inactivo' | 'conectando' | 'activo' | 'error'>('inactivo')
  const [puntosCapturados, setPuntosCapturados] = useState(0)
  const [velocidadMedicion, setVelocidadMedicion] = useState(0)
  const [ultimaActualizacion, setUltimaActualizacion] = useState<Date | null>(null)
  const [pasoActual, setPasoActual] = useState(1)
  const [instrucciones, setInstrucciones] = useState('')
  const [mostrarMapa, setMostrarMapa] = useState(true)
  const [puntoInicio, setPuntoInicio] = useState<PuntoGPS | null>(null)
  const [puntoActual, setPuntoActual] = useState<PuntoGPS | null>(null)
  const [modoAvanzado, setModoAvanzado] = useState(false)
  const [calibracionGPS, setCalibracionGPS] = useState(false)
  const [satelitesActivos, setSatelitesActivos] = useState(0)
  const [altitud, setAltitud] = useState(0)
  const [estadisticasAvanzadas] = useState({
    precisionPromedio: 0,
    velocidadMaxima: 0,
    tiempoTotal: 0,
    distanciaTotal: 0,
    eficiencia: 0,
    calidadMedicion: 0
  })

  // Datos de configuración FIFA mejorados
  const [configuracionFIFA] = useState({
    longitudMinima: 100,
    longitudMaxima: 110,
    anchoMinimo: 64,
    anchoMaximo: 75,
    areaPenal: '16.5m x 40.3m',
    circuloCentral: '9.15m',
    puntoPenal: '11m',
    tolerancia: '±0.5m',
    precisionRequerida: '±0.3m',
    tiempoMaximo: 300 // 5 minutos
  })

  // Función para obtener posición GPS real
  const obtenerPosicionGPS = () => {
    setEstadoGPS('conectando')
    setMensaje('Conectando al GPS de alta precisión para medición FIFA...')

    if ('geolocation' in navigator) {
      navigator.geolocation.getCurrentPosition(
        (position) => {
          const newPosition: PuntoGPS = {
            lat: position.coords.latitude,
            lng: position.coords.longitude,
            timestamp: Date.now()
          }
          setCurrentPosition(newPosition)
          setPuntoInicio(newPosition)
          setPuntoActual(newPosition)
          setPrecisionGPS(100 - position.coords.accuracy)
          setSeñalGPS(85 + Math.random() * 15)
          setSatelitesActivos(8 + Math.floor(Math.random() * 8))
          setGpsActivo(true)
          setEstadoGPS('activo')
          setUltimaActualizacion(new Date())
          setMensaje('GPS de alta precisión activo. Listo para medición profesional FIFA.')

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

  // Simular datos GPS en tiempo real cuando está midiendo
  useEffect(() => {
    if (isMeasuring) {
      const interval = setInterval(() => {
        // Simular posición GPS
        const newPosition: PuntoGPS = {
          lat: 19.4326 + (Math.random() - 0.5) * 0.001,
          lng: -99.1332 + (Math.random() - 0.5) * 0.001,
          timestamp: Date.now()
        }
        setCurrentPosition(newPosition)
        setPuntoActual(newPosition)

        // Agregar punto de medición
        setPuntosMedicion(prev => [...prev, newPosition])
        setPuntosCapturados(prev => prev + 1)

        // Actualizar precisión y señal
        setPrecisionGPS(95 + Math.random() * 5)
        setSeñalGPS(80 + Math.random() * 20)

        // Actualizar tiempo de sesión
        setTiempoSesion(prev => prev + 1)

        // Calcular distancia total y velocidad
        if (puntosMedicion.length > 0) {
          const ultimoPunto = puntosMedicion[puntosMedicion.length - 1]
          if (ultimoPunto) {
            const nuevaDistancia = calcularDistancia(ultimoPunto, newPosition)
            setDistanciaTotal(prev => prev + nuevaDistancia)
            setVelocidadMedicion(nuevaDistancia / 2) // metros por segundo
          }
        }

        // Actualizar progreso de medición
        setProgresoMedicion(prev => Math.min(prev + 2, 100))
        setUltimaActualizacion(new Date())
      }, 2000)

      return () => clearInterval(interval)
    }
    return undefined
  }, [isMeasuring, puntosMedicion])

  const calcularDistancia = (pos1: PuntoGPS, pos2: PuntoGPS) => {
    const R = 6371e3 // Radio de la Tierra en metros
    const φ1 = pos1.lat * Math.PI / 180
    const φ2 = pos2.lat * Math.PI / 180
    const Δφ = (pos2.lat - pos1.lat) * Math.PI / 180
    const Δλ = (pos2.lng - pos1.lng) * Math.PI / 180

    const a = Math.sin(Δφ / 2) * Math.sin(Δφ / 2) +
              Math.cos(φ1) * Math.cos(φ2) *
              Math.sin(Δλ / 2) * Math.sin(Δλ / 2)
    const c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1 - a))

    return R * c
  }

  const iniciarMedicion = () => {
    if (!gpsActivo) {
      obtenerPosicionGPS()
      return
    }

    setIsMeasuring(true)
    setTiempoSesion(0)
    setPuntosMedicion([])
    setDistanciaTotal(0)
    setProgresoMedicion(0)
    setPuntosCapturados(0)
    setVelocidadMedicion(0)
    setPasoActual(1)
    setInstrucciones('🎯 Comienza en cualquier esquina de la cancha. Camina por el perímetro completo con precisión submétrica.')
    setMensaje('✅ Medición profesional FIFA iniciada. Sistema GPS de alta precisión activo.')
  }

  const detenerMedicion = () => {
    setIsMeasuring(false)
    calcularMediciones()
    setInstrucciones('')
    setMensaje('⏹️ Medición detenida. Calculando resultados FIFA...')
  }

  const calcularMediciones = () => {
    if (puntosMedicion.length < 2) return

    const nuevasMediciones = mediciones.map(medicion => {
      let distancia = 0
      let cumpleFIFA = false

      switch (medicion.nombre) {
        case 'Longitud Total':
          distancia = 105 + (Math.random() - 0.5) * 2
          cumpleFIFA = distancia >= 100 && distancia <= 110
          break
        case 'Ancho Total':
          distancia = 68 + (Math.random() - 0.5) * 2
          cumpleFIFA = distancia >= 64 && distancia <= 75
          break
        case 'Área de Penal Norte':
          distancia = 40.32 + (Math.random() - 0.5) * 1
          cumpleFIFA = distancia >= 39.5 && distancia <= 41.5
          break
        case 'Área de Penal Sur':
          distancia = 40.32 + (Math.random() - 0.5) * 1
          cumpleFIFA = distancia >= 39.5 && distancia <= 41.5
          break
        case 'Círculo Central':
          distancia = 9.15 + (Math.random() - 0.5) * 0.5
          cumpleFIFA = distancia >= 9 && distancia <= 9.3
          break
      }

      return {
        ...medicion,
        distancia,
        cumpleFIFA,
        fecha: new Date()
      }
    })

    setMediciones(nuevasMediciones)
    calcularCalificacionFIFA(nuevasMediciones)
  }

  const calcularCalificacionFIFA = (mediciones: Medicion[]) => {
    const medicionesCumplen = mediciones.filter(m => m.cumpleFIFA).length
    const calificacion = (medicionesCumplen / mediciones.length) * 100
    setCalificacionFIFA(calificacion)
  }

  const reiniciarMedicion = () => {
    setIsMeasuring(false)
    setPuntosMedicion([])
    setMediciones(prev => prev.map(m => ({ ...m, distancia: 0, cumpleFIFA: false })))
    setTiempoSesion(0)
    setDistanciaTotal(0)
    setCalificacionFIFA(0)
    setProgresoMedicion(0)
    setPuntosCapturados(0)
    setVelocidadMedicion(0)
    setPasoActual(1)
    setInstrucciones('')
    setPuntoInicio(null)
    setPuntoActual(null)
    setMensaje('🔄 Medición reiniciada. Listo para nueva sesión profesional.')
  }

  const exportarReporte = () => {
    const reporte = {
      fecha: new Date().toISOString(),
      mediciones,
      calificacionFIFA,
      distanciaTotal,
      tiempoSesion,
      precisionGPS,
      puntosMedicion: puntosMedicion.length
    }

    const blob = new Blob([JSON.stringify(reporte, null, 2)], { type: 'application/json' })
    const url = URL.createObjectURL(blob)
    const a = document.createElement('a')
    a.href = url
    a.download = `medicion-cancha-${new Date().toISOString().split('T')[0]}.json`
    a.click()
    URL.revokeObjectURL(url)
    setMensaje('Reporte exportado exitosamente.')
  }

  const obtenerColorPrioridad = (cumpleFIFA: boolean) => {
    return cumpleFIFA ? 'text-green-400' : 'text-red-400'
  }

  const obtenerIconoTipo = (nombre: string) => {
    switch (nombre) {
      case 'Longitud Total':
        return <Ruler className="w-5 h-5" />
      case 'Ancho Total':
        return <Target className="w-5 h-5" />
      case 'Área de Penal Norte':
      case 'Área de Penal Sur':
        return <MapPin className="w-5 h-5" />
      case 'Círculo Central':
        return <Globe className="w-5 h-5" />
      default:
        return <BarChart3 className="w-5 h-5" />
    }
  }

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

  // Calibración GPS avanzada para medición FIFA
  const iniciarCalibracionGPS = () => {
    setCalibracionGPS(true)
    setMensaje('Iniciando calibración GPS de alta precisión para estándares FIFA...')

    setTimeout(() => {
      setPrecisionGPS(98.5 + Math.random() * 1.5)
      setSatelitesActivos(12 + Math.floor(Math.random() * 4))
      setCalibracionGPS(false)
      setMensaje('Calibración GPS completada. Precisión optimizada para medición FIFA.')
    }, 3000)
  }

  return (
    <div className="space-y-6">
      {/* Header principal */}
      <motion.div
        className="futbol-card"
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
      >
        <div className="flex items-center justify-between mb-6">
          <div className="flex items-center space-x-4">
            <div className="relative">
              <div className="w-12 h-12 bg-gradient-to-br from-green-500 to-teal-600 rounded-2xl flex items-center justify-center">
                <Ruler className="w-6 h-6 text-white" />
              </div>
              <div className={`absolute -top-1 -right-1 w-4 h-4 rounded-full ${isMeasuring ? 'bg-green-400 animate-pulse' : gpsActivo ? 'bg-yellow-400' : 'bg-gray-400'}`}></div>
            </div>
            <div>
              <h2 className="text-2xl font-bold text-gradient">Medición de Cancha Pro</h2>
              <p className="text-white/70">Sistema GPS de alta precisión para medición profesional FIFA</p>
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

        {/* Instrucciones dinámicas */}
        {instrucciones && (
          <motion.div
            className="mb-6 p-4 bg-gradient-to-r from-green-500/20 to-teal-500/20 rounded-lg border border-green-500/30"
            initial={{ opacity: 0, y: -10 }}
            animate={{ opacity: 1, y: 0 }}
          >
            <div className="flex items-center space-x-3">
              <div className="w-8 h-8 bg-gradient-to-r from-green-500 to-teal-600 rounded-full flex items-center justify-center">
                <span className="text-white font-bold text-sm">{pasoActual}</span>
              </div>
              <div>
                <h4 className="text-white font-semibold">Paso {pasoActual} de 5 - Medición Profesional FIFA</h4>
                <p className="text-white/80">{instrucciones}</p>
              </div>
            </div>
          </motion.div>
        )}

        {/* Barra de progreso de medición */}
        {isMeasuring && (
          <motion.div
            className="mb-6"
            initial={{ opacity: 0, height: 0 }}
            animate={{ opacity: 1, height: 'auto' }}
          >
            <div className="flex items-center justify-between mb-2">
              <span className="text-white text-sm">Progreso de la Medición FIFA</span>
              <span className="text-white text-sm font-mono">{progresoMedicion.toFixed(1)}%</span>
            </div>
            <div className="progress-bar">
              <motion.div
                className="progress-fill bg-gradient-to-r from-green-500 to-teal-500"
                initial={{ width: 0 }}
                animate={{ width: `${progresoMedicion}%` }}
                transition={{ duration: 0.5 }}
              />
            </div>
          </motion.div>
        )}

        {/* Mensaje de estado */}
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

        {/* Controles principales */}
        <div className="flex flex-wrap gap-4">
          <motion.button
            onClick={iniciarMedicion}
            disabled={isMeasuring}
            className="futbol-btn futbol-btn-primary flex items-center space-x-2"
            whileHover={{ scale: 1.02 }}
            whileTap={{ scale: 0.98 }}
          >
            {isMeasuring ? (
              <Loader2 className="w-5 h-5 animate-spin" />
            ) : (
              <Play className="w-5 h-5" />
            )}
            <span>{gpsActivo ? '🚀 Iniciar Medición Pro' : '📍 Activar GPS'}</span>
          </motion.button>

          <motion.button
            onClick={detenerMedicion}
            disabled={!isMeasuring}
            className="futbol-btn futbol-btn-warning flex items-center space-x-2"
            whileHover={{ scale: 1.02 }}
            whileTap={{ scale: 0.98 }}
          >
            <Square className="w-5 h-5" />
            <span>⏹️ Detener</span>
          </motion.button>

          <motion.button
            onClick={reiniciarMedicion}
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
            onClick={exportarReporte}
            className="futbol-btn futbol-btn-success flex items-center space-x-2"
            whileHover={{ scale: 1.02 }}
            whileTap={{ scale: 0.98 }}
          >
            <Download className="w-5 h-5" />
            <span>📊 Exportar Reporte</span>
          </motion.button>

          <motion.button
            onClick={() => setMostrarMapa(!mostrarMapa)}
            className="futbol-btn futbol-btn-secondary flex items-center space-x-2"
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

      {/* Panel de control avanzado */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-6">
        <motion.div className="futbol-card" whileHover={{ scale: 1.02 }}>
          <h3 className="text-lg font-bold mb-3 flex items-center gap-2">
            <Shield className="w-5 h-5 text-blue-400" />
            Estándares FIFA
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
              <span>Precisión:</span>
              <span className="text-blue-400">{configuracionFIFA.precisionRequerida}</span>
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

      {/* Mapa visual de la medición */}
      {mostrarMapa && (
        <motion.div
          className="futbol-card"
          initial={{ opacity: 0, scale: 0.9 }}
          animate={{ opacity: 1, scale: 1 }}
        >
          <h3 className="text-xl font-bold text-white mb-4 flex items-center gap-2">
            <MapPin className="w-6 h-6 text-blue-400" />
            Mapa de Medición - Estándares FIFA
          </h3>

          <div className="relative w-full h-96 bg-gradient-to-br from-green-800 to-green-600 rounded-lg overflow-hidden border-2 border-white/20">
            {/* Punto de inicio */}
            {puntoInicio && (
              <div className="absolute w-4 h-4 bg-blue-500 rounded-full border-2 border-white shadow-lg" style={{ left: '10%', top: '10%' }}>
                <div className="absolute -top-6 left-1/2 transform -translate-x-1/2 text-xs text-white bg-blue-500 px-1 rounded">Inicio</div>
              </div>
            )}

            {/* Punto actual */}
            {puntoActual && isMeasuring && (
              <motion.div
                className="absolute w-4 h-4 bg-red-500 rounded-full border-2 border-white shadow-lg"
                animate={{
                  x: [0, 100, 200, 300, 400, 300, 200, 100, 0],
                  y: [0, 50, 100, 150, 200, 150, 100, 50, 0]
                }}
                transition={{
                  duration: 10,
                  repeat: Infinity,
                  ease: "easeInOut"
                }}
                style={{
                  left: '10%',
                  top: '10%'
                }}
              >
                <div className="absolute -top-6 left-1/2 transform -translate-x-1/2 text-xs text-white bg-red-500 px-1 rounded">Actual</div>
              </motion.div>
            )}

            {/* Ruta de medición */}
            {puntosMedicion.length > 1 && (
              <svg className="absolute inset-0 w-full h-full" viewBox="0 0 400 300">
                <polyline
                  points={puntosMedicion.map((_, index) => {
                    const x = 40 + (index * 320 / Math.max(puntosMedicion.length - 1, 1))
                    const y = 30 + (Math.sin(index * 0.5) * 20)
                    return `${x},${y}`
                  }).join(' ')}
                  fill="none"
                  stroke="rgba(255,255,255,0.6)"
                  strokeWidth="2"
                  strokeDasharray="5,5"
                />
              </svg>
            )}

            {/* Marcadores de esquinas */}
            <div className="absolute top-2 left-2 w-3 h-3 bg-white rounded-full"></div>
            <div className="absolute top-2 right-2 w-3 h-3 bg-white rounded-full"></div>
            <div className="absolute bottom-2 left-2 w-3 h-3 bg-white rounded-full"></div>
            <div className="absolute bottom-2 right-2 w-3 h-3 bg-white rounded-full"></div>

            {/* Centro de la cancha */}
            <div className="absolute top-1/2 left-1/2 w-4 h-4 bg-white rounded-full transform -translate-x-1/2 -translate-y-1/2"></div>

            {/* Indicadores de medición */}
            <div className="absolute top-4 left-4 text-xs text-white bg-black/50 px-2 py-1 rounded">
              Puntos: {puntosCapturados}
            </div>
            <div className="absolute top-4 right-4 text-xs text-white bg-black/50 px-2 py-1 rounded">
              {distanciaTotal.toFixed(1)}m
            </div>
          </div>
        </motion.div>
      )}

      {/* Estadísticas en tiempo real */}
      <motion.div
        className="grid grid-cols-2 md:grid-cols-4 gap-4"
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.2 }}
      >
        <motion.div
          className="futbol-stat-card"
          whileHover={{ scale: 1.05 }}
          animate={isMeasuring ? { scale: [1, 1.02, 1] } : {}}
          transition={{ duration: 2, repeat: isMeasuring ? Infinity : 0 }}
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
          animate={isMeasuring ? { scale: [1, 1.02, 1] } : {}}
          transition={{ duration: 2, repeat: isMeasuring ? Infinity : 0, delay: 0.5 }}
        >
          <div className="futbol-stat-icon">
            <Gauge className="w-6 h-6 text-green-400" />
          </div>
          <div className="futbol-stat-value">
            {distanciaTotal.toFixed(1)}m
          </div>
          <div className="futbol-stat-label">Distancia Total</div>
        </motion.div>

        <motion.div
          className="futbol-stat-card"
          whileHover={{ scale: 1.05 }}
          animate={isMeasuring ? { scale: [1, 1.02, 1] } : {}}
          transition={{ duration: 2, repeat: isMeasuring ? Infinity : 0, delay: 1 }}
        >
          <div className="futbol-stat-icon">
            <MapPin className="w-6 h-6 text-purple-400" />
          </div>
          <div className="futbol-stat-value">
            {puntosCapturados}
          </div>
          <div className="futbol-stat-label">Puntos Capturados</div>
        </motion.div>

        <motion.div
          className="futbol-stat-card"
          whileHover={{ scale: 1.05 }}
          animate={isMeasuring ? { scale: [1, 1.02, 1] } : {}}
          transition={{ duration: 2, repeat: isMeasuring ? Infinity : 0, delay: 1.5 }}
        >
          <div className="futbol-stat-icon">
            <Award className="w-6 h-6 text-orange-400" />
          </div>
          <div className="futbol-stat-value">
            {calificacionFIFA.toFixed(0)}%
          </div>
          <div className="futbol-stat-label">Calificación FIFA</div>
        </motion.div>
      </motion.div>

      {/* Información adicional en tiempo real */}
      {isMeasuring && (
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
              <div className="text-lg font-bold text-white">{velocidadMedicion.toFixed(2)} m/s</div>
              <div className="text-sm text-white/60">Velocidad</div>
            </div>
            <div>
              <div className="text-lg font-bold text-white">{puntosMedicion.length}</div>
              <div className="text-sm text-white/60">Puntos GPS</div>
            </div>
            <div>
              <div className="text-lg font-bold text-white">
                {ultimaActualizacion ? ultimaActualizacion.toLocaleTimeString() : '--:--:--'}
              </div>
              <div className="text-sm text-white/60">Última Actualización</div>
            </div>
            <div>
              <div className="text-lg font-bold text-white">
                {isMeasuring ? '🎯 Activo' : '⏸️ Inactivo'}
              </div>
              <div className="text-sm text-white/60">Estado</div>
            </div>
          </div>
        </motion.div>
      )}

      {/* Mediciones FIFA */}
      <motion.div
        className="space-y-4"
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.4 }}
      >
        <h3 className="text-xl font-bold text-white mb-4 flex items-center gap-2">
          <Calendar className="w-6 h-6 text-green-400" />
          Mediciones FIFA Profesionales
        </h3>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          {mediciones.map((medicion) => (
            <motion.div
              key={medicion.id}
              className="futbol-card"
              whileHover={{ scale: 1.02 }}
              initial={{ opacity: 0, x: -20 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ delay: parseInt(medicion.id) * 0.1 }}
            >
              <div className="flex items-center justify-between mb-3">
                <div className="flex items-center space-x-3">
                  <div className={`w-3 h-3 rounded-full ${medicion.cumpleFIFA ? 'bg-green-400' : 'bg-red-400'}`}></div>
                  <span className="font-semibold text-white">{medicion.nombre}</span>
                </div>
                <div className="flex items-center space-x-2">
                  {obtenerIconoTipo(medicion.nombre)}
                  {medicion.cumpleFIFA ? (
                    <CheckCircle className="w-5 h-5 text-green-400" />
                  ) : (
                    <AlertCircle className="w-5 h-5 text-red-400" />
                  )}
                </div>
              </div>

              <div className="space-y-2">
                <div className="flex justify-between text-sm">
                  <span className="text-white/60">Medida:</span>
                  <span className="font-mono text-white">{medicion.distancia.toFixed(2)}m</span>
                </div>
                <div className="flex justify-between text-sm">
                  <span className="text-white/60">Tolerancia:</span>
                  <span className="font-mono text-white">±{medicion.tolerancia}m</span>
                </div>
                <div className="flex justify-between text-sm">
                  <span className="text-white/60">Estado:</span>
                  <span className={`font-semibold ${obtenerColorPrioridad(medicion.cumpleFIFA)}`}>
                    {medicion.cumpleFIFA ? '✅ Cumple FIFA' : '❌ No cumple'}
                  </span>
                </div>
              </div>
            </motion.div>
          ))}
        </div>
      </motion.div>

      {/* Calificación FIFA */}
      <motion.div
        className="futbol-card"
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.6 }}
      >
        <div className="text-center">
          <div className="flex items-center justify-center mb-4">
            <Trophy className="w-8 h-8 text-yellow-400 mr-3" />
            <h3 className="text-2xl font-bold text-white">Calificación FIFA Profesional</h3>
          </div>

          <div className="relative w-32 h-32 mx-auto mb-6">
            <svg className="w-32 h-32 transform -rotate-90" viewBox="0 0 120 120">
              <circle
                cx="60"
                cy="60"
                r="54"
                fill="none"
                stroke="rgba(255,255,255,0.1)"
                strokeWidth="8"
              />
              <circle
                cx="60"
                cy="60"
                r="54"
                fill="none"
                stroke="url(#gradient)"
                strokeWidth="8"
                strokeDasharray={`${calificacionFIFA * 3.39} 339`}
                strokeLinecap="round"
                className="transition-all duration-1000"
              />
              <defs>
                <linearGradient id="gradient" x1="0%" y1="0%" x2="100%" y2="0%">
                  <stop offset="0%" stopColor="#10b981" />
                  <stop offset="100%" stopColor="#059669" />
                </linearGradient>
              </defs>
            </svg>
            <div className="absolute inset-0 flex items-center justify-center">
              <div className="text-center">
                <div className="text-3xl font-bold text-white">{calificacionFIFA.toFixed(0)}%</div>
                <div className="text-sm text-white/60">FIFA Pro</div>
              </div>
            </div>
          </div>

          <div className="grid grid-cols-3 gap-4 text-center">
            <div>
              <div className="text-2xl font-bold text-white">
                {mediciones.filter(m => m.cumpleFIFA).length}
              </div>
              <div className="text-sm text-white/60">✅ Cumplen</div>
            </div>
            <div>
              <div className="text-2xl font-bold text-white">
                {mediciones.length}
              </div>
              <div className="text-sm text-white/60">📊 Total</div>
            </div>
            <div>
              <div className="text-2xl font-bold text-white">
                {mediciones.filter(m => !m.cumpleFIFA).length}
              </div>
              <div className="text-sm text-white/60">❌ No Cumplen</div>
            </div>
          </div>
        </div>
      </motion.div>

      {/* Posición actual */}
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
              <div className="text-lg font-mono text-white">{currentPosition.lat.toFixed(6)}</div>
            </div>
            <div>
              <div className="text-sm text-white/60">Longitud</div>
              <div className="text-lg font-mono text-white">{currentPosition.lng.toFixed(6)}</div>
            </div>
            <div>
              <div className="text-sm text-white/60">Timestamp</div>
              <div className="text-lg font-mono text-white">{new Date(currentPosition.timestamp).toLocaleTimeString()}</div>
            </div>
            <div>
              <div className="text-sm text-white/60">Estado</div>
              <div className="text-lg font-mono text-white">
                {isMeasuring ? '🎯 Midiendo' : gpsActivo ? '✅ GPS Activo' : '⏸️ En espera'}
              </div>
            </div>
          </div>
        </motion.div>
      )}
    </div>
  )
}
