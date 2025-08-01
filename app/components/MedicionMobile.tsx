'use client'

import { useState, useEffect, useRef } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import {
  Camera,
  Play,
  Pause,
  RotateCcw,
  AlertCircle,
  Target,
  MapPin,
  Wifi,
  WifiOff
} from 'lucide-react'
import { useAppStore } from '../../stores/useAppStore'
import { Medicion, PuntoGPS } from '../../types'
import CameraTools from './CameraTools'
// import MobileNotifications, { useNotifications } from './MobileNotifications'

interface MedicionMobileProps {
  isRecording?: boolean
  onRecordingChange?: (recording: boolean) => void
}

export default function MedicionMobile({ isRecording, onRecordingChange }: MedicionMobileProps) {
  const {
    mediciones: medicionesGlobales,
    setMediciones: setMedicionesGlobales,
    campoActivo,
    gestorCampos,
    actualizarCampo
  } = useAppStore()

  // Estados principales
  const [isMeasuring, setIsMeasuring] = useState(false)
  const [isCameraActive, setIsCameraActive] = useState(false)
  const [currentPosition, setCurrentPosition] = useState<PuntoGPS | null>(null)
  const [puntosMedicion, setPuntosMedicion] = useState<PuntoGPS[]>([])
  const [mediciones, setMediciones] = useState<Medicion[]>(medicionesGlobales)
  const [campoSeleccionado, setCampoSeleccionado] = useState<string | null>(campoActivo?.id || null)
  const [modoMedicion, setModoMedicion] = useState<'gps' | 'camara'>('gps')
  
  // Estados de UI
  const [mensaje, setMensaje] = useState('Toca "Iniciar" para comenzar la medición')
  const [error, setError] = useState<string | null>(null)
  const [showFieldSelector, setShowFieldSelector] = useState(false)
  const [isOnline, setIsOnline] = useState(true)
  const [modoAvanzado, setModoAvanzado] = useState(false)
  
  // Estados de herramientas de cámara
  const [activeTools, setActiveTools] = useState<string[]>([])
  const [walkingPath, setWalkingPath] = useState<Array<{ x: number; y: number; timestamp: number }>>([])
  const [totalDistance, setTotalDistance] = useState(0)

  // Referencias
  const videoRef = useRef<HTMLVideoElement>(null)
  const streamRef = useRef<MediaStream | null>(null)
  const watchIdRef = useRef<number | null>(null)

  // Sistema de notificaciones (temporalmente deshabilitado)
  // const {
  //   notifications,
  //   removeNotification,
  //   notifySuccess,
  //   notifyError,
  //   notifyGPSStatus,
  //   notifyCameraStatus,
  //   notifyConnectionStatus,
  //   notifyMeasurementComplete
  // } = useNotifications()

  // Verificar conexión
  useEffect(() => {
    const handleOnline = () => {
      setIsOnline(true)
      // notifyConnectionStatus(true)
    }
    const handleOffline = () => {
      setIsOnline(false)
      // notifyConnectionStatus(false)
    }
    
    window.addEventListener('online', handleOnline)
    window.addEventListener('offline', handleOffline)
    
    return () => {
      window.removeEventListener('online', handleOnline)
      window.removeEventListener('offline', handleOffline)
    }
  }, [])

  // Sincronizar con campo activo
  useEffect(() => {
    setCampoSeleccionado(campoActivo?.id || null)
  }, [campoActivo])

  // Sincronizar grabación desde padre
  useEffect(() => {
    if (isRecording !== undefined && isRecording !== isMeasuring) {
      if (isRecording) {
        iniciarMedicion()
      } else {
        detenerMedicion()
      }
    }
  }, [isRecording, isMeasuring])

  // Inicializar mediciones predeterminadas
  useEffect(() => {
    if (medicionesGlobales.length === 0) {
      const medicionesPredeterminadas: Medicion[] = [
        { id: '1', nombre: 'Longitud Total', distancia: 0, tolerancia: 0.5, cumpleFIFA: false, fecha: new Date(), timestamp: Date.now(), tipo: 'linea' },
        { id: '2', nombre: 'Ancho Total', distancia: 0, tolerancia: 0.5, cumpleFIFA: false, fecha: new Date(), timestamp: Date.now(), tipo: 'linea' },
        { id: '3', nombre: 'Área de Penal Norte', distancia: 0, tolerancia: 0.3, cumpleFIFA: false, fecha: new Date(), timestamp: Date.now(), tipo: 'area' },
        { id: '4', nombre: 'Área de Penal Sur', distancia: 0, tolerancia: 0.3, cumpleFIFA: false, fecha: new Date(), timestamp: Date.now(), tipo: 'area' },
        { id: '5', nombre: 'Círculo Central', distancia: 0, tolerancia: 0.1, cumpleFIFA: false, fecha: new Date(), timestamp: Date.now(), tipo: 'circulo' }
      ]
      setMedicionesGlobales(medicionesPredeterminadas)
      setMediciones(medicionesPredeterminadas)
    }
  }, [medicionesGlobales.length, setMedicionesGlobales])

  // Función para vibración táctil
  const vibrar = (duracion: number | number[] = 100) => {
    if ('vibrate' in navigator) {
      navigator.vibrate(duracion)
    }
  }

  // Funciones para herramientas de cámara
  const toggleCameraTool = (tool: string) => {
    setActiveTools(prev => 
      prev.includes(tool) 
        ? prev.filter(t => t !== tool)
        : [...prev, tool]
    )
    vibrar(50)
  }

  const updateWalkingPath = (x: number, y: number) => {
    const newPoint = { x, y, timestamp: Date.now() }
    setWalkingPath(prev => [...prev, newPoint])
    
    // Calcular distancia total si hay puntos anteriores
    if (walkingPath.length > 0) {
      const lastPoint = walkingPath[walkingPath.length - 1]
      if (lastPoint) {
        const distance = Math.sqrt(
          Math.pow(x - lastPoint.x, 2) + Math.pow(y - lastPoint.y, 2)
        )
        // Convertir píxeles a metros (aproximación)
        const meterDistance = distance * 0.001 // Ajustar factor según calibración
        setTotalDistance(prev => prev + meterDistance)
      }
    }
  }

  // Funciones de cámara
  const iniciarCamara = async () => {
    try {
      setError(null)
      setMensaje('Activando cámara...')
      
      // Intentar con diferentes configuraciones para mayor compatibilidad
      const constraints = [
        { video: { facingMode: 'environment', width: { ideal: 1280 }, height: { ideal: 720 } } },
        { video: { facingMode: 'environment', width: { ideal: 1920 }, height: { ideal: 1080 } } },
        { video: { facingMode: 'environment' } },
        { video: true }
      ]

      let stream = null
      for (const constraint of constraints) {
        try {
          stream = await navigator.mediaDevices.getUserMedia(constraint)
          break
        } catch (err) {
          console.log('Intentando siguiente configuración de cámara...')
        }
      }

      if (!stream) {
        throw new Error('No se pudo acceder a la cámara')
      }
      
      streamRef.current = stream
      setIsCameraActive(true)
      setMensaje('Cámara activa. Toca la pantalla para capturar puntos.')
      vibrar(50) // Feedback táctil
      // notifyCameraStatus(true)
    } catch (error) {
      console.error('Error al iniciar cámara:', error)
      setError('No se pudo acceder a la cámara. Verifica los permisos.')
      setMensaje('Error al iniciar cámara.')
      vibrar([100, 50, 100]) // Patrón de vibración para error
      // notifyCameraStatus(false)
    }
  }

  const detenerCamara = () => {
    if (streamRef.current) {
      streamRef.current.getTracks().forEach(track => track.stop())
      streamRef.current = null
    }
    setIsCameraActive(false)
    setMensaje('Cámara detenida.')
  }

  // Efecto para asignar stream al video
  useEffect(() => {
    if (isCameraActive && videoRef.current && streamRef.current) {
      videoRef.current.srcObject = streamRef.current
      videoRef.current.play().catch(console.error)
    }
  }, [isCameraActive])

  // Funciones de GPS
  const obtenerPosicionGPS = (): Promise<PuntoGPS> => {
    return new Promise((resolve, reject) => {
      if (!navigator.geolocation) {
        reject(new Error('Geolocalización no disponible'))
        return
      }

      // Intentar múltiples configuraciones para mejor compatibilidad
      const opciones = [
        { enableHighAccuracy: true, timeout: 15000, maximumAge: 0 },
        { enableHighAccuracy: true, timeout: 30000, maximumAge: 5000 },
        { enableHighAccuracy: false, timeout: 10000, maximumAge: 10000 }
      ]

      let intentoActual = 0

      const intentarPosicion = () => {
        if (intentoActual >= opciones.length) {
          reject(new Error('No se pudo obtener la posición GPS después de varios intentos'))
          return
        }

        navigator.geolocation.getCurrentPosition(
          (position) => {
            const punto: PuntoGPS = {
              lat: position.coords.latitude,
              lng: position.coords.longitude,
              timestamp: position.timestamp,
              accuracy: position.coords.accuracy
            }
            resolve(punto)
          },
          (error) => {
            console.log(`Intento ${intentoActual + 1} fallido:`, error.message)
            intentoActual++
            setTimeout(intentarPosicion, 1000) // Esperar 1 segundo antes del siguiente intento
          },
          opciones[intentoActual]
        )
      }

      intentarPosicion()
    })
  }

  const calcularDistancia = (pos1: PuntoGPS, pos2: PuntoGPS): number => {
    const R = 6371e3 // Radio de la Tierra en metros
    const φ1 = (pos1.lat * Math.PI) / 180
    const φ2 = (pos2.lat * Math.PI) / 180
    const Δφ = ((pos2.lat - pos1.lat) * Math.PI) / 180
    const Δλ = ((pos2.lng - pos1.lng) * Math.PI) / 180

    const a = Math.sin(Δφ / 2) * Math.sin(Δφ / 2) +
              Math.cos(φ1) * Math.cos(φ2) *
              Math.sin(Δλ / 2) * Math.sin(Δλ / 2)
    const c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1 - a))

    return R * c
  }

  // Funciones de medición
  const iniciarMedicion = async () => {
    try {
      setIsMeasuring(true)
      setPuntosMedicion([])
      setError(null)
      vibrar(50) // Feedback al iniciar
      
      if (onRecordingChange) {
        onRecordingChange(true)
      }

      if (modoMedicion === 'gps') {
        setMensaje('Obteniendo posición GPS...')
        const posicion = await obtenerPosicionGPS()
        setCurrentPosition(posicion)
        setPuntosMedicion([posicion])
        setMensaje(`GPS activo. Precisión: ${posicion.accuracy?.toFixed(1)}m`)
        vibrar(100) // Confirmación de GPS activo
        // notifyGPSStatus(true, posicion.accuracy)
        
        // Iniciar seguimiento GPS con mejores opciones
        watchIdRef.current = navigator.geolocation.watchPosition(
          (position) => {
            const nuevoPunto: PuntoGPS = {
              lat: position.coords.latitude,
              lng: position.coords.longitude,
              timestamp: position.timestamp,
              accuracy: position.coords.accuracy
            }
            setPuntosMedicion(prev => [...prev, nuevoPunto])
            setCurrentPosition(nuevoPunto)
            
            // Actualizar mensaje con precisión actual
            setMensaje(`GPS activo. Precisión: ${position.coords.accuracy.toFixed(1)}m - ${puntosMedicion.length + 1} puntos`)
          },
          (error) => {
            console.error('Error en seguimiento GPS:', error)
            setError(`Error en seguimiento GPS: ${error.message}`)
            vibrar([100, 50, 100]) // Patrón de error
          },
          {
            enableHighAccuracy: true,
            timeout: 15000,
            maximumAge: 1000
          }
        )
      } else {
        await iniciarCamara()
      }
    } catch (error) {
      console.error('Error al iniciar medición:', error)
      setError(`Error al iniciar medición: ${error instanceof Error ? error.message : 'Error desconocido'}`)
      setIsMeasuring(false)
      vibrar([100, 50, 100, 50, 100]) // Patrón de error largo
      if (onRecordingChange) {
        onRecordingChange(false)
      }
    }
  }

  const detenerMedicion = () => {
    setIsMeasuring(false)
    vibrar(200) // Feedback táctil al detener
    
    if (onRecordingChange) {
      onRecordingChange(false)
    }

    if (watchIdRef.current) {
      navigator.geolocation.clearWatch(watchIdRef.current)
      watchIdRef.current = null
    }

    if (modoMedicion === 'camara') {
      detenerCamara()
    }

    if (puntosMedicion.length >= 2) {
      calcularMediciones()
      vibrar([50, 50, 50]) // Patrón de éxito
    } else {
      setMensaje('Medición detenida. Se necesitan al menos 2 puntos.')
    }
  }

  const calcularMediciones = () => {
    if (puntosMedicion.length < 2) return

    const distanciaTotal = puntosMedicion.reduce((total, punto, index) => {
      if (index === 0) return 0
      const puntoAnterior = puntosMedicion[index - 1]
      if (!puntoAnterior) return total
      return total + calcularDistancia(puntoAnterior, punto)
    }, 0)

    const medicionesActualizadas = mediciones.map(medicion => ({
      ...medicion,
      distancia: distanciaTotal,
      cumpleFIFA: distanciaTotal >= medicion.tolerancia,
      fecha: new Date(),
      timestamp: Date.now()
    }))

    setMediciones(medicionesActualizadas)
    setMedicionesGlobales(medicionesActualizadas)

    // Actualizar estadísticas del campo seleccionado
    if (campoSeleccionado && gestorCampos) {
      const campo = gestorCampos.campos.find(c => c.id === campoSeleccionado)
      if (campo) {
        const estadisticasActualizadas = {
          ...campo.estadisticas,
          totalMediciones: campo.estadisticas.totalMediciones + 1,
          ultimaMedicion: new Date()
        }
        
        actualizarCampo(campoSeleccionado, {
          ...campo,
          estadisticas: estadisticasActualizadas
        })
      }
    }

    setMensaje(`Medición completada: ${distanciaTotal.toFixed(2)}m`)
    // notifyMeasurementComplete(distanciaTotal, puntosMedicion.length)
  }

  const reiniciarMedicion = () => {
    setPuntosMedicion([])
    setMediciones(mediciones.map(m => ({ ...m, distancia: 0, cumpleFIFA: false })))
    setMensaje('Medición reiniciada.')
  }

  const capturarPuntoCamara = (event: React.MouseEvent<HTMLDivElement>) => {
    if (!isCameraActive || !videoRef.current) return

    const rect = event.currentTarget.getBoundingClientRect()
    const x = event.clientX - rect.left
    const y = event.clientY - rect.top

    // Actualizar camino de caminata para herramientas
    updateWalkingPath(x, y)

    // Simular punto GPS basado en posición de pantalla (coordenadas de Lissewege)
    const puntoSimulado: PuntoGPS = {
      lat: 51.2993 + (y / 100000), // Lissewege, Brugge
      lng: 3.2218 + (x / 100000),
      accuracy: 3,
      timestamp: Date.now()
    }

    setPuntosMedicion(prev => [...prev, puntoSimulado])
    setMensaje(`Punto ${puntosMedicion.length + 1} capturado`)
    vibrar(30) // Feedback táctil suave al capturar punto
  }

  const camposDisponibles = gestorCampos?.campos || []

  return (
    <>
      {/* <MobileNotifications 
        notifications={notifications}
        onRemove={removeNotification}
      /> */}
      <div className="space-y-4">
      {/* Header móvil */}
      <div className="bg-white/10 backdrop-blur-sm rounded-2xl p-4 border border-white/20">
        <div className="flex items-center justify-between mb-3">
          <div className="flex items-center space-x-3">
            <div className="w-10 h-10 bg-green-500 rounded-xl flex items-center justify-center">
              <Target className="w-5 h-5 text-white" />
            </div>
            <div>
              <h2 className="text-white font-bold text-lg">Medición Móvil</h2>
              <p className="text-white/70 text-sm">Medición optimizada para móvil</p>
            </div>
          </div>
          
          <div className={`p-2 rounded-lg ${isOnline ? 'bg-green-500/20' : 'bg-red-500/20'}`}>
            {isOnline ? <Wifi className="w-4 h-4 text-green-400" /> : <WifiOff className="w-4 h-4 text-red-400" />}
          </div>
        </div>

        {/* Selector de campo */}
        <div className="mb-3">
          <button
            onClick={() => setShowFieldSelector(!showFieldSelector)}
            className="w-full flex items-center justify-between p-3 bg-white/10 rounded-xl text-white"
          >
            <span className="text-sm">
              Campo: {campoSeleccionado ? camposDisponibles.find(c => c.id === campoSeleccionado)?.nombre : 'Seleccionar'}
            </span>
            <MapPin className="w-4 h-4" />
          </button>
        </div>

        {/* Selector de modo */}
        <div className="flex space-x-2">
          <button
            onClick={() => setModoMedicion('gps')}
            className={`flex-1 py-2 px-3 rounded-lg text-sm font-medium transition-colors ${
              modoMedicion === 'gps' 
                ? 'bg-green-500 text-white' 
                : 'bg-white/10 text-white/70'
            }`}
          >
            GPS
          </button>
          <button
            onClick={() => setModoMedicion('camara')}
            className={`flex-1 py-2 px-3 rounded-lg text-sm font-medium transition-colors ${
              modoMedicion === 'camara' 
                ? 'bg-blue-500 text-white' 
                : 'bg-white/10 text-white/70'
            }`}
          >
            Cámara
          </button>
        </div>
      </div>

      {/* Selector de campos */}
      <AnimatePresence>
        {showFieldSelector && (
          <motion.div
            initial={{ opacity: 0, y: -20 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -20 }}
            className="bg-white/10 backdrop-blur-sm rounded-2xl p-4 border border-white/20"
          >
            <h3 className="text-white font-semibold mb-3">Seleccionar Campo</h3>
            <div className="space-y-2">
              {camposDisponibles.map(campo => (
                <button
                  key={campo.id}
                  onClick={() => {
                    setCampoSeleccionado(campo.id)
                    setShowFieldSelector(false)
                  }}
                  className={`w-full p-3 rounded-xl text-left transition-colors ${
                    campoSeleccionado === campo.id
                      ? 'bg-green-500 text-white'
                      : 'bg-white/10 text-white hover:bg-white/20'
                  }`}
                >
                  <div className="font-medium">{campo.nombre}</div>
                  <div className="text-xs opacity-70">{campo.tipo}</div>
                </button>
              ))}
            </div>
          </motion.div>
        )}
      </AnimatePresence>

      {/* Controles de medición */}
      <div className="bg-white/10 backdrop-blur-sm rounded-2xl p-4 border border-white/20">
        <div className="flex items-center justify-between mb-4">
          <h3 className="text-white font-semibold">Controles</h3>
          <div className="flex items-center space-x-3">
            {/* Toggle Modo Avanzado */}
            <button
              onClick={() => setModoAvanzado(!modoAvanzado)}
              className={`px-3 py-1 rounded-lg text-xs font-medium transition-colors ${
                modoAvanzado ? 'bg-blue-500 text-white' : 'bg-white/20 text-white/70'
              }`}
            >
              Avanzado
            </button>
            <div className={`w-3 h-3 rounded-full ${isMeasuring ? 'bg-red-500 animate-pulse' : 'bg-gray-400'}`} />
          </div>
        </div>

        <div className="flex space-x-3">
          <motion.button
            onClick={isMeasuring ? detenerMedicion : iniciarMedicion}
            className={`flex-1 flex items-center justify-center space-x-2 py-4 rounded-xl font-semibold ${
              isMeasuring 
                ? 'bg-red-500 text-white' 
                : 'bg-green-500 text-white'
            }`}
            whileHover={{ scale: 1.02 }}
            whileTap={{ scale: 0.98 }}
          >
            {isMeasuring ? <Pause className="w-5 h-5" /> : <Play className="w-5 h-5" />}
            <span>{isMeasuring ? 'Detener' : 'Iniciar'}</span>
          </motion.button>

          <motion.button
            onClick={reiniciarMedicion}
            className="px-4 py-4 bg-white/20 text-white rounded-xl"
            whileHover={{ scale: 1.02 }}
            whileTap={{ scale: 0.98 }}
          >
            <RotateCcw className="w-5 h-5" />
          </motion.button>
        </div>

        {/* Estado actual */}
        <div className="mt-4 p-3 bg-white/5 rounded-lg">
          <div className="flex items-center space-x-2 mb-2">
            <div className={`w-2 h-2 rounded-full ${isMeasuring ? 'bg-green-500' : 'bg-gray-400'}`} />
            <span className="text-white text-sm font-medium">
              {isMeasuring ? 'Grabando...' : 'Listo'}
            </span>
          </div>
          <p className="text-white/70 text-xs">{mensaje}</p>
          {totalDistance > 0 && (
            <div className="flex items-center space-x-2 mt-2 text-blue-400 text-xs">
              <Target className="w-3 h-3" />
              <span>Distancia: {totalDistance.toFixed(2)}m</span>
            </div>
          )}
          {error && (
            <div className="flex items-center space-x-2 mt-2 text-red-400 text-xs">
              <AlertCircle className="w-3 h-3" />
              <span>{error}</span>
            </div>
          )}
        </div>
      </div>

      {/* Cámara */}
      {modoMedicion === 'camara' && (
        <div className="bg-white/10 backdrop-blur-sm rounded-2xl p-4 border border-white/20">
          <h3 className="text-white font-semibold mb-3">Cámara</h3>
          
          {isCameraActive ? (
            <div className="relative">
              <video
                ref={videoRef}
                className="w-full h-48 object-cover rounded-lg"
                autoPlay
                playsInline
                muted
              />
              <div 
                className="absolute inset-0 cursor-crosshair"
                onClick={capturarPuntoCamara}
              />
              <div className="absolute top-2 right-2 bg-black/50 text-white text-xs px-2 py-1 rounded">
                Toca para capturar
              </div>
              
              {/* Herramientas de cámara */}
              <CameraTools
                isActive={isCameraActive}
                onToggleTool={toggleCameraTool}
                activTools={activeTools}
                onMeasurementUpdate={setTotalDistance}
                walkingPath={walkingPath}
              />
            </div>
          ) : (
            <div className="h-48 bg-white/5 rounded-lg flex items-center justify-center">
              <div className="text-center">
                <Camera className="w-12 h-12 text-white/50 mx-auto mb-2" />
                <p className="text-white/70 text-sm">Cámara no activa</p>
              </div>
            </div>
          )}
        </div>
      )}

      {/* Información de puntos */}
      {puntosMedicion.length > 0 && (
        <div className="bg-white/10 backdrop-blur-sm rounded-2xl p-4 border border-white/20">
          <h3 className="text-white font-semibold mb-3">Puntos Registrados</h3>
          <div className="space-y-2">
            <div className="flex justify-between text-sm">
              <span className="text-white/70">Total de puntos:</span>
              <span className="text-white font-medium">{puntosMedicion.length}</span>
            </div>
            
            {currentPosition?.accuracy && (
              <div className="flex justify-between text-sm">
                <span className="text-white/70">Precisión GPS:</span>
                <span className={`font-medium ${
                  currentPosition.accuracy < 5 ? 'text-green-400' : 
                  currentPosition.accuracy < 10 ? 'text-yellow-400' : 'text-red-400'
                }`}>
                  ±{currentPosition.accuracy.toFixed(1)}m
                </span>
              </div>
            )}
            
            {puntosMedicion.length >= 2 && (
              <div className="flex justify-between text-sm">
                <span className="text-white/70">Distancia estimada:</span>
                <span className="text-white font-medium">
                  {puntosMedicion.reduce((total, punto, index) => {
                    if (index === 0) return 0
                    const puntoAnterior = puntosMedicion[index - 1]
                    if (!puntoAnterior) return total
                    return total + calcularDistancia(puntoAnterior, punto)
                  }, 0).toFixed(2)}m
                </span>
              </div>
            )}
            
            {modoMedicion === 'gps' && currentPosition && (
              <div className="mt-3 p-2 bg-white/5 rounded-lg">
                <div className="text-xs text-white/70">
                  <div>Lat: {currentPosition.lat.toFixed(6)}</div>
                  <div>Lng: {currentPosition.lng.toFixed(6)}</div>
                </div>
              </div>
            )}
          </div>
        </div>
      )}

      {/* Resultados de medición */}
      {mediciones.some(m => m.distancia > 0) && (
        <div className="bg-white/10 backdrop-blur-sm rounded-2xl p-4 border border-white/20">
          <h3 className="text-white font-semibold mb-3">Resultados</h3>
          <div className="space-y-2">
            {mediciones.filter(m => m.distancia > 0).map(medicion => (
              <div key={medicion.id} className="flex items-center justify-between p-2 bg-white/5 rounded-lg">
                <span className="text-white text-sm">{medicion.nombre}</span>
                <div className="flex items-center space-x-2">
                  <span className="text-white font-medium">{medicion.distancia.toFixed(2)}m</span>
                  <div className={`w-2 h-2 rounded-full ${medicion.cumpleFIFA ? 'bg-green-500' : 'bg-red-500'}`} />
                </div>
              </div>
            ))}
          </div>
        </div>
      )}
      </div>
    </>
  )
} 