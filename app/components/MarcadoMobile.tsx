'use client'

import { useState, useEffect, useRef } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import {
  MapPin,
  Camera,
  Play,
  Pause,
  RotateCcw,
  CheckCircle,
  AlertCircle,
  Wifi,
  WifiOff,
  LineChart,
  Square,
  Circle,
  Gauge
} from 'lucide-react'
import { useAppStore } from '../../stores/useAppStore'
import { PuntoGPS, LineaMarcado } from '../../types'
import CameraTools from './CameraTools'
import { useLanguage } from '../contexts/LanguageContext'

interface MarcadoMobileProps {
  isRecording?: boolean
  onRecordingChange?: (recording: boolean) => void
}

export default function MarcadoMobile({ isRecording, onRecordingChange }: MarcadoMobileProps) {
  const { t } = useLanguage()
  const {
    lineasMarcado: lineasGlobales,
    setLineasMarcado: setLineasGlobales,
    campoActivo,
    gestorCampos,
    actualizarCampo
  } = useAppStore()

  // Estados principales
  const [isMarking, setIsMarking] = useState(false)
  const [isCameraActive, setIsCameraActive] = useState(false)
  const [currentPosition, setCurrentPosition] = useState<PuntoGPS | null>(null)
  const [puntosMarcado, setPuntosMarcado] = useState<PuntoGPS[]>([])
  const [lineasMarcado, setLineasMarcado] = useState<LineaMarcado[]>(lineasGlobales)
  const [campoSeleccionado, setCampoSeleccionado] = useState<string | null>(campoActivo?.id || null)
  const [modoMarcado, setModoMarcado] = useState<'gps' | 'camara'>('gps')
  const [tipoLinea, setTipoLinea] = useState<'horizontal' | 'vertical' | 'circular' | 'rectangular'>('horizontal')
  
  // Estados de UI
  const [mensaje, setMensaje] = useState('Toca "Iniciar" para comenzar el marcado')
  const [error, setError] = useState<string | null>(null)
  const [showFieldSelector, setShowFieldSelector] = useState(false)
  const [isOnline, setIsOnline] = useState(true)
  
  // Estados de herramientas de cámara
  const [activeTools, setActiveTools] = useState<string[]>([])
  const [walkingPath, setWalkingPath] = useState<Array<{ x: number; y: number; timestamp: number }>>([])
  const [totalDistance, setTotalDistance] = useState(0)


  // Referencias
  const videoRef = useRef<HTMLVideoElement>(null)
  const streamRef = useRef<MediaStream | null>(null)
  const watchIdRef = useRef<number | null>(null)

  // Verificar conexión
  useEffect(() => {
    const handleOnline = () => setIsOnline(true)
    const handleOffline = () => setIsOnline(false)
    
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
    if (isRecording !== undefined && isRecording !== isMarking) {
      if (isRecording) {
        iniciarMarcado()
      } else {
        detenerMarcado()
      }
    }
  }, [isRecording, isMarking])

  // Inicializar líneas predeterminadas
  useEffect(() => {
    if (lineasGlobales.length === 0) {
      const lineasPredeterminadas: LineaMarcado[] = [
            { id: 1, nombre: t('marking.line.goal.north'), tipo: 'horizontal', distancia: 0, completada: false, progreso: 0, posicion: 'top' },
    { id: 2, nombre: t('marking.line.goal.south'), tipo: 'horizontal', distancia: 0, completada: false, progreso: 0, posicion: 'bottom' },
    { id: 3, nombre: t('marking.line.side.left'), tipo: 'vertical', distancia: 0, completada: false, progreso: 0, posicion: 'left' },
    { id: 4, nombre: t('marking.line.side.right'), tipo: 'vertical', distancia: 0, completada: false, progreso: 0, posicion: 'right' },
    { id: 5, nombre: t('marking.circle.center'), tipo: 'circular', distancia: 0, completada: false, progreso: 0, posicion: 'center' }
      ]
      setLineasGlobales(lineasPredeterminadas)
      setLineasMarcado(lineasPredeterminadas)
    }
  }, [lineasGlobales.length, setLineasGlobales])

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
      setMensaje(t('marking.camera.activating'))
      
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
      setMensaje(t('marking.camera.active'))
      vibrar(50) // Feedback táctil
    } catch (error) {
      console.error('Error al iniciar cámara:', error)
      setError(t('marking.camera.error'))
      setMensaje(t('marking.camera.error.init'))
      vibrar([100, 50, 100]) // Patrón de vibración para error
    }
  }

  const detenerCamara = () => {
    if (streamRef.current) {
      streamRef.current.getTracks().forEach(track => track.stop())
      streamRef.current = null
    }
    setIsCameraActive(false)
    setMensaje(t('marking.camera.stopped'))
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

      navigator.geolocation.getCurrentPosition(
        (position) => {
          const punto: PuntoGPS = {
            lat: position.coords.latitude,
            lng: position.coords.longitude,
            timestamp: position.timestamp
          }
          resolve(punto)
        },
        (error) => {
          reject(error)
        },
        {
          enableHighAccuracy: true,
          timeout: 10000,
          maximumAge: 0
        }
      )
    })
  }

  // Funciones de marcado
  const iniciarMarcado = async () => {
    try {
      setIsMarking(true)
      setPuntosMarcado([])
      setError(null)
      
      if (onRecordingChange) {
        onRecordingChange(true)
      }

      if (modoMarcado === 'gps') {
        setMensaje(t('marking.gps.getting'))
        const posicion = await obtenerPosicionGPS()
        setCurrentPosition(posicion)
        setPuntosMarcado([posicion])
        setMensaje(t('marking.gps.active'))
        
        // Iniciar seguimiento GPS
        watchIdRef.current = navigator.geolocation.watchPosition(
          (position) => {
            const nuevoPunto: PuntoGPS = {
              lat: position.coords.latitude,
              lng: position.coords.longitude,
              timestamp: position.timestamp
            }
            setPuntosMarcado(prev => [...prev, nuevoPunto])
            setCurrentPosition(nuevoPunto)
          },
          (error) => {
            console.error('Error en seguimiento GPS:', error)
            setError('Error en seguimiento GPS')
          },
          {
            enableHighAccuracy: true,
            timeout: 10000,
            maximumAge: 0
          }
        )
      } else {
        await iniciarCamara()
      }
    } catch (error) {
      console.error('Error al iniciar marcado:', error)
      setError('Error al iniciar marcado')
      setIsMarking(false)
      if (onRecordingChange) {
        onRecordingChange(false)
      }
    }
  }

  const detenerMarcado = () => {
    setIsMarking(false)
    
    if (onRecordingChange) {
      onRecordingChange(false)
    }

    if (watchIdRef.current) {
      navigator.geolocation.clearWatch(watchIdRef.current)
      watchIdRef.current = null
    }

    if (modoMarcado === 'camara') {
      detenerCamara()
    }

    if (puntosMarcado.length >= 2) {
      completarLinea()
    }

    setMensaje('Marcado detenido.')
  }

  const completarLinea = () => {
    if (puntosMarcado.length < 2) return

    const lineaCompletada: LineaMarcado = {
      id: Date.now(),
      nombre: `Línea ${lineasMarcado.length + 1}`,
      tipo: tipoLinea,
      distancia: puntosMarcado.length * 10, // Simular distancia
      completada: true,
      progreso: 100,
      posicion: 'center'
    }

    const lineasActualizadas = [...lineasMarcado, lineaCompletada]
    setLineasMarcado(lineasActualizadas)
    setLineasGlobales(lineasActualizadas)

    // Actualizar estadísticas del campo seleccionado
    if (campoSeleccionado && gestorCampos) {
      const campo = gestorCampos.campos.find(c => c.id === campoSeleccionado)
      if (campo) {
        const estadisticasActualizadas = {
          ...campo.estadisticas,
          totalMarcados: campo.estadisticas.totalMarcados + 1,
          ultimoMarcado: new Date()
        }
        
        actualizarCampo(campoSeleccionado, {
          ...campo,
          estadisticas: estadisticasActualizadas
        })
      }
    }

    setPuntosMarcado([])
    setMensaje(`Línea completada: ${lineaCompletada.nombre}`)
  }

  const reiniciarMarcado = () => {
    setPuntosMarcado([])
    setLineasMarcado(lineasMarcado.map(l => ({ ...l, completada: false })))
    setMensaje('Marcado reiniciado.')
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
      lat: (currentPosition?.lat || 51.2993) + (y / 100000), // Lissewege, Brugge
      lng: (currentPosition?.lng || 3.2218) + (x / 100000),
      accuracy: 3,
      timestamp: Date.now()
    }

    setPuntosMarcado(prev => [...prev, puntoSimulado])
    setMensaje(`Punto ${puntosMarcado.length + 1} marcado`)
    vibrar(30) // Feedback táctil
  }

  const camposDisponibles = gestorCampos?.campos || []

  return (
    <div className="space-y-4">
      {/* Header móvil */}
      <div className="bg-white/10 backdrop-blur-sm rounded-2xl p-4 border border-white/20">
        <div className="flex items-center justify-between mb-3">
          <div className="flex items-center space-x-3">
            <div className="w-10 h-10 bg-blue-500 rounded-xl flex items-center justify-center">
              <MapPin className="w-5 h-5 text-white" />
            </div>
            <div>
              <h2 className="text-white font-bold text-lg">Marcado Móvil</h2>
              <p className="text-white/70 text-sm">Marcado optimizado para móvil</p>
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
        <div className="flex space-x-2 mb-3">
          <button
            onClick={() => setModoMarcado('gps')}
            className={`flex-1 py-2 px-3 rounded-lg text-sm font-medium transition-colors ${
              modoMarcado === 'gps' 
                ? 'bg-green-500 text-white' 
                : 'bg-white/10 text-white/70'
            }`}
          >
            GPS
          </button>
          <button
            onClick={() => setModoMarcado('camara')}
            className={`flex-1 py-2 px-3 rounded-lg text-sm font-medium transition-colors ${
              modoMarcado === 'camara' 
                ? 'bg-blue-500 text-white' 
                : 'bg-white/10 text-white/70'
            }`}
          >
            Cámara
          </button>
        </div>

        {/* Selector de tipo de línea */}
        <div className="flex space-x-2">
          <button
            onClick={() => setTipoLinea('horizontal')}
            className={`flex-1 py-2 px-3 rounded-lg text-sm font-medium transition-colors ${
              tipoLinea === 'horizontal' 
                ? 'bg-purple-500 text-white' 
                : 'bg-white/10 text-white/70'
            }`}
          >
            <LineChart className="w-4 h-4 inline mr-1" />
            Horizontal
          </button>
          <button
            onClick={() => setTipoLinea('vertical')}
            className={`flex-1 py-2 px-3 rounded-lg text-sm font-medium transition-colors ${
              tipoLinea === 'vertical' 
                ? 'bg-purple-500 text-white' 
                : 'bg-white/10 text-white/70'
            }`}
          >
            <Square className="w-4 h-4 inline mr-1" />
            Vertical
          </button>
          <button
            onClick={() => setTipoLinea('circular')}
            className={`flex-1 py-2 px-3 rounded-lg text-sm font-medium transition-colors ${
              tipoLinea === 'circular' 
                ? 'bg-purple-500 text-white' 
                : 'bg-white/10 text-white/70'
            }`}
          >
            <Circle className="w-4 h-4 inline mr-1" />
            Circular
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
                      ? 'bg-blue-500 text-white'
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

      {/* Controles de marcado */}
      <div className="bg-white/10 backdrop-blur-sm rounded-2xl p-4 border border-white/20">
        <div className="flex items-center justify-between mb-4">
          <h3 className="text-white font-semibold">Controles</h3>
          <div className={`w-3 h-3 rounded-full ${isMarking ? 'bg-red-500 animate-pulse' : 'bg-gray-400'}`} />
        </div>

        <div className="flex space-x-3">
          <motion.button
            onClick={isMarking ? detenerMarcado : iniciarMarcado}
            className={`flex-1 flex items-center justify-center space-x-2 py-4 rounded-xl font-semibold ${
              isMarking 
                ? 'bg-red-500 text-white' 
                : 'bg-blue-500 text-white'
            }`}
            whileHover={{ scale: 1.02 }}
            whileTap={{ scale: 0.98 }}
          >
            {isMarking ? <Pause className="w-5 h-5" /> : <Play className="w-5 h-5" />}
            <span>{isMarking ? 'Detener' : 'Iniciar'}</span>
          </motion.button>

          <motion.button
            onClick={reiniciarMarcado}
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
            <div className={`w-2 h-2 rounded-full ${isMarking ? 'bg-green-500' : 'bg-gray-400'}`} />
            <span className="text-white text-sm font-medium">
              {isMarking ? 'Marcando...' : 'Listo'}
            </span>
          </div>
          <p className="text-white/70 text-xs">{mensaje}</p>
          {totalDistance > 0 && (
            <div className="flex items-center space-x-2 mt-2 text-blue-400 text-xs">
              <Gauge className="w-3 h-3" />
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
      {modoMarcado === 'camara' && (
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
                Toca para marcar
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
      {puntosMarcado.length > 0 && (
        <div className="bg-white/10 backdrop-blur-sm rounded-2xl p-4 border border-white/20">
          <h3 className="text-white font-semibold mb-3">Puntos Marcados</h3>
          <div className="space-y-2">
            <div className="flex justify-between text-sm">
              <span className="text-white/70">Total de puntos:</span>
              <span className="text-white font-medium">{puntosMarcado.length}</span>
            </div>
            <div className="flex justify-between text-sm">
              <span className="text-white/70">Tipo de línea:</span>
              <span className="text-white font-medium capitalize">{tipoLinea}</span>
            </div>
          </div>
        </div>
      )}

      {/* Líneas completadas */}
      {lineasMarcado.filter(l => l.completada).length > 0 && (
        <div className="bg-white/10 backdrop-blur-sm rounded-2xl p-4 border border-white/20">
          <h3 className="text-white font-semibold mb-3">Líneas Completadas</h3>
          <div className="space-y-2">
            {lineasMarcado.filter(l => l.completada).map(linea => (
              <div key={linea.id} className="flex items-center justify-between p-2 bg-white/5 rounded-lg">
                <span className="text-white text-sm">{linea.nombre}</span>
                <div className="flex items-center space-x-2">
                  <span className="text-white/70 text-xs capitalize">{linea.tipo}</span>
                  <CheckCircle className="w-4 h-4 text-green-500" />
                </div>
              </div>
            ))}
          </div>
        </div>
      )}
    </div>
  )
} 