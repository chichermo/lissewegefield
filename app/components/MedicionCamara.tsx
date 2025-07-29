import { useState, useRef, useEffect } from 'react'
import { motion } from 'framer-motion'
import {
  Camera,
  CameraOff,
  Target,
  Ruler,
  Download,
  RotateCcw,
  CheckCircle,
  AlertTriangle,
  Play,
  Pause,
  Square,
  Circle
} from 'lucide-react'
import { PuntoGPS } from '../../types'

interface MedicionCamaraProps {
  onMedicionCompletada: (medicion: any) => void
}

interface PuntoCamara {
  x: number
  y: number
  lat?: number
  lng?: number
  timestamp: number
}

export default function MedicionCamara({ onMedicionCompletada }: MedicionCamaraProps) {
  const [isCameraActive, setIsCameraActive] = useState(false)
  const [isRecording, setIsRecording] = useState(false)
  const [puntosCapturados, setPuntosCapturados] = useState<PuntoCamara[]>([])
  const [modoMedicion, setModoMedicion] = useState<'linea' | 'area' | 'circulo'>('linea')
  const [distanciaTotal, setDistanciaTotal] = useState(0)
  const [areaCalculada, setAreaCalculada] = useState(0)
  const [error, setError] = useState<string | null>(null)
  const [mensaje, setMensaje] = useState('')
  
  const videoRef = useRef<HTMLVideoElement>(null)
  const canvasRef = useRef<HTMLCanvasElement>(null)
  const streamRef = useRef<MediaStream | null>(null)

  // Iniciar cámara
  const iniciarCamara = async () => {
    try {
      setError(null)
      setMensaje('Iniciando cámara...')
      
      const stream = await navigator.mediaDevices.getUserMedia({
        video: {
          facingMode: 'environment',
          width: { ideal: 1920 },
          height: { ideal: 1080 }
        }
      })
      
      streamRef.current = stream
      
      if (videoRef.current) {
        videoRef.current.srcObject = stream
        videoRef.current.onloadedmetadata = () => {
          setIsCameraActive(true)
          setMensaje('Cámara activa - Toca la pantalla para capturar puntos')
        }
      }
    } catch (err) {
      setError('Error al acceder a la cámara. Verifica los permisos.')
      console.error('Error cámara:', err)
    }
  }

  // Detener cámara
  const detenerCamara = () => {
    if (streamRef.current) {
      streamRef.current.getTracks().forEach(track => track.stop())
      streamRef.current = null
    }
    setIsCameraActive(false)
    setMensaje('Cámara detenida')
  }

  // Capturar punto desde la cámara
  const capturarPunto = (event: React.MouseEvent<HTMLDivElement>) => {
    if (!isCameraActive || !videoRef.current) return

    const rect = event.currentTarget.getBoundingClientRect()
    const x = event.clientX - rect.left
    const y = event.clientY - rect.top
    
    const nuevoPunto: PuntoCamara = {
      x,
      y,
      timestamp: Date.now()
    }

    setPuntosCapturados(prev => [...prev, nuevoPunto])
    setMensaje(`Punto ${puntosCapturados.length + 1} capturado`)
    
    // Calcular distancia si hay más de un punto
    if (puntosCapturados.length > 0) {
      const puntoAnterior = puntosCapturados[puntosCapturados.length - 1]
      if (puntoAnterior) {
        const distancia = calcularDistancia(puntoAnterior, nuevoPunto)
        setDistanciaTotal(prev => prev + distancia)
      }
    }
  }

  // Calcular distancia entre dos puntos
  const calcularDistancia = (punto1: PuntoCamara, punto2: PuntoCamara): number => {
    const dx = punto2.x - punto1.x
    const dy = punto2.y - punto1.y
    return Math.sqrt(dx * dx + dy * dy)
  }

  // Calcular área
  const calcularArea = () => {
    if (puntosCapturados.length < 3) return 0
    
    let area = 0
    for (let i = 0; i < puntosCapturados.length; i++) {
      const j = (i + 1) % puntosCapturados.length
      const puntoI = puntosCapturados[i]
      const puntoJ = puntosCapturados[j]
      if (puntoI && puntoJ) {
        area += puntoI.x * puntoJ.y
        area -= puntoJ.x * puntoI.y
      }
    }
    
    return Math.abs(area) / 2
  }

  // Iniciar grabación
  const iniciarGrabacion = () => {
    setIsRecording(true)
    setPuntosCapturados([])
    setDistanciaTotal(0)
    setAreaCalculada(0)
    setMensaje('Grabación iniciada - Toca para capturar puntos')
  }

  // Detener grabación
  const detenerGrabacion = () => {
    setIsRecording(false)
    if (modoMedicion === 'area') {
      const area = calcularArea()
      setAreaCalculada(area)
    }
    setMensaje('Grabación detenida')
  }

  // Limpiar medición
  const limpiarMedicion = () => {
    setPuntosCapturados([])
    setDistanciaTotal(0)
    setAreaCalculada(0)
    setMensaje('Medición limpiada')
  }

  // Exportar medición
  const exportarMedicion = () => {
    const medicion = {
      tipo: modoMedicion,
      puntos: puntosCapturados,
      distancia: distanciaTotal,
      area: areaCalculada,
      fecha: new Date().toISOString(),
      timestamp: Date.now()
    }
    
    onMedicionCompletada(medicion)
    setMensaje('Medición exportada')
  }

  // Convertir coordenadas de pantalla a GPS (simulado)
  const convertirAGPS = (x: number, y: number): PuntoGPS => {
    // En una implementación real, usarías algoritmos de computer vision
    // para convertir coordenadas de pantalla a coordenadas GPS
    return {
      lat: -34.6037 + (y / 1000), // Simulado
      lng: -58.3816 + (x / 1000), // Simulado
      timestamp: Date.now()
    }
  }

  useEffect(() => {
    return () => {
      detenerCamara()
    }
  }, [])

  return (
    <div className="futbol-card">
      <div className="flex items-center justify-between mb-6">
        <h2 className="text-2xl font-bold text-white">Medición con Cámara</h2>
        <div className="flex gap-2">
          <motion.button
            onClick={isCameraActive ? detenerCamara : iniciarCamara}
            className={`futbol-btn ${isCameraActive ? 'futbol-btn-danger' : 'futbol-btn-primary'}`}
            whileHover={{ scale: 1.05 }}
            whileTap={{ scale: 0.95 }}
          >
            {isCameraActive ? <CameraOff className="w-5 h-5" /> : <Camera className="w-5 h-5" />}
            {isCameraActive ? 'Detener' : 'Iniciar'} Cámara
          </motion.button>
        </div>
      </div>

      {/* Selector de modo */}
      <div className="mb-6">
        <h3 className="text-lg font-semibold text-white mb-3">Modo de Medición</h3>
        <div className="flex gap-3">
          {[
            { id: 'linea', icon: Ruler, label: 'Línea' },
            { id: 'area', icon: Square, label: 'Área' },
            { id: 'circulo', icon: Circle, label: 'Círculo' }
          ].map(({ id, icon: Icon, label }) => (
            <motion.button
              key={id}
              onClick={() => setModoMedicion(id as any)}
              className={`futbol-btn ${modoMedicion === id ? 'futbol-btn-success' : 'futbol-btn-secondary'}`}
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
            >
              <Icon className="w-4 h-4" />
              {label}
            </motion.button>
          ))}
        </div>
      </div>

      {/* Contenedor de cámara */}
      <div className="relative mb-6">
        <div 
          className="relative w-full h-64 bg-black rounded-lg overflow-hidden cursor-crosshair"
          onClick={capturarPunto}
        >
          <video
            ref={videoRef}
            autoPlay
            playsInline
            muted
            className="w-full h-full object-cover"
          />
          
          {/* Overlay con puntos capturados */}
          <div className="absolute inset-0 pointer-events-none">
            {puntosCapturados.map((punto, index) => (
              <div
                key={index}
                className="absolute w-4 h-4 bg-red-500 rounded-full border-2 border-white transform -translate-x-2 -translate-y-2"
                style={{ left: punto.x, top: punto.y }}
              >
                <span className="absolute -top-6 left-1/2 transform -translate-x-1/2 text-xs text-white bg-black px-1 rounded">
                  {index + 1}
                </span>
              </div>
            ))}
            
            {/* Líneas conectando puntos */}
            {puntosCapturados.length > 1 && (
              <svg className="absolute inset-0 w-full h-full">
                <polyline
                  points={puntosCapturados.map(p => `${p.x},${p.y}`).join(' ')}
                  fill="none"
                  stroke="red"
                  strokeWidth="2"
                />
              </svg>
            )}
          </div>

          {/* Mensaje de estado */}
          {mensaje && (
            <div className="absolute bottom-4 left-4 right-4 bg-black/70 text-white p-2 rounded text-sm">
              {mensaje}
            </div>
          )}
        </div>
      </div>

      {/* Controles de grabación */}
      <div className="flex gap-3 mb-6">
        <motion.button
          onClick={isRecording ? detenerGrabacion : iniciarGrabacion}
          className={`futbol-btn ${isRecording ? 'futbol-btn-danger' : 'futbol-btn-success'}`}
          whileHover={{ scale: 1.05 }}
          whileTap={{ scale: 0.95 }}
        >
          {isRecording ? <Pause className="w-5 h-5" /> : <Play className="w-5 h-5" />}
          {isRecording ? 'Detener' : 'Iniciar'} Grabación
        </motion.button>

        <motion.button
          onClick={limpiarMedicion}
          className="futbol-btn futbol-btn-secondary"
          whileHover={{ scale: 1.05 }}
          whileTap={{ scale: 0.95 }}
        >
          <RotateCcw className="w-5 h-5" />
          Limpiar
        </motion.button>

        <motion.button
          onClick={exportarMedicion}
          disabled={puntosCapturados.length === 0}
          className="futbol-btn futbol-btn-primary disabled:opacity-50"
          whileHover={{ scale: 1.05 }}
          whileTap={{ scale: 0.95 }}
        >
          <Download className="w-5 h-5" />
          Exportar
        </motion.button>
      </div>

      {/* Estadísticas */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        <div className="futbol-card">
          <div className="flex items-center gap-2 mb-2">
            <Target className="w-5 h-5 text-blue-400" />
            <span className="text-white font-semibold">Puntos Capturados</span>
          </div>
          <p className="text-2xl font-bold text-white">{puntosCapturados.length}</p>
        </div>

        <div className="futbol-card">
          <div className="flex items-center gap-2 mb-2">
            <Ruler className="w-5 h-5 text-green-400" />
            <span className="text-white font-semibold">Distancia Total</span>
          </div>
          <p className="text-2xl font-bold text-white">{distanciaTotal.toFixed(2)} px</p>
        </div>

        {modoMedicion === 'area' && (
          <div className="futbol-card">
            <div className="flex items-center gap-2 mb-2">
              <Square className="w-5 h-5 text-purple-400" />
              <span className="text-white font-semibold">Área Calculada</span>
            </div>
            <p className="text-2xl font-bold text-white">{areaCalculada.toFixed(2)} px²</p>
          </div>
        )}
      </div>

      {/* Información del modo */}
      <div className="mt-6 p-4 bg-blue-900/20 rounded-lg">
        <h4 className="text-lg font-semibold text-white mb-2">
          Modo: {modoMedicion === 'linea' ? 'Línea' : modoMedicion === 'area' ? 'Área' : 'Círculo'}
        </h4>
        <p className="text-white/70 text-sm">
          {modoMedicion === 'linea' && 'Toca la pantalla para marcar puntos de la línea. Se calcula la distancia total.'}
          {modoMedicion === 'area' && 'Toca la pantalla para marcar los vértices del área. Se calcula el área total.'}
          {modoMedicion === 'circulo' && 'Toca el centro y luego el borde del círculo. Se calcula el radio y área.'}
        </p>
      </div>

      {/* Error */}
      {error && (
        <div className="mt-4 p-4 bg-red-900/20 border border-red-500 rounded-lg">
          <div className="flex items-center gap-2">
            <AlertTriangle className="w-5 h-5 text-red-400" />
            <span className="text-red-400 font-semibold">Error</span>
          </div>
          <p className="text-red-300 mt-2">{error}</p>
        </div>
      )}
    </div>
  )
} 