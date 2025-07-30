import { useState, useRef, useEffect } from 'react'
import { motion } from 'framer-motion'
import {
  Camera,
  CameraOff,
  Target,
  Ruler,
  Download,
  RotateCcw,
  AlertTriangle,
  Play,
  Pause,
  Square,
  Circle,
  Settings,
  X
} from 'lucide-react'


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
  const [isLoading, setIsLoading] = useState(false)
  const [calibracion, setCalibracion] = useState(false)
  const [factorEscala, setFactorEscala] = useState(1) // metros por píxel
  
  const videoRef = useRef<HTMLVideoElement>(null)
  const streamRef = useRef<MediaStream | null>(null)

  // Iniciar cámara con mejor manejo de errores
  const iniciarCamara = async () => {
    try {
      setIsLoading(true)
      setError(null)
      setMensaje('Iniciando cámara...')
      
      // Verificar si el navegador soporta getUserMedia
      if (!navigator.mediaDevices || !navigator.mediaDevices.getUserMedia) {
        throw new Error('Tu navegador no soporta acceso a la cámara')
      }

      const stream = await navigator.mediaDevices.getUserMedia({
        video: {
          facingMode: 'environment', // Usar cámara trasera si está disponible
          width: { ideal: 1920, min: 640 },
          height: { ideal: 1080, min: 480 },
          aspectRatio: { ideal: 16/9 }
        }
      })
      
      streamRef.current = stream
      
      if (videoRef.current) {
        videoRef.current.srcObject = stream
        videoRef.current.onloadedmetadata = () => {
          setIsCameraActive(true)
          setIsLoading(false)
          setMensaje('Cámara activa - Toca la pantalla para capturar puntos')
        }
        
        videoRef.current.onerror = () => {
          throw new Error('Error al cargar el video de la cámara')
        }
      }
    } catch (err: any) {
      setIsLoading(false)
      setError(err.message || 'Error al acceder a la cámara. Verifica los permisos.')
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

  // Capturar punto desde la cámara con mejor precisión
  const capturarPunto = (event: React.MouseEvent<HTMLDivElement>) => {
    if (!isCameraActive || !videoRef.current) return

    const rect = event.currentTarget.getBoundingClientRect()
    const x = event.clientX - rect.left
    const y = event.clientY - rect.top
    
    // Verificar que el punto esté dentro del área del video
    if (x < 0 || x > rect.width || y < 0 || y > rect.height) return
    
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

  // Calcular área usando el algoritmo del polígono
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

  // Calcular radio del círculo
  const calcularRadio = () => {
    if (puntosCapturados.length < 2) return 0
    
    const centro = puntosCapturados[0]
    const borde = puntosCapturados[1]
    
    if (!centro || !borde) return 0
    
    return calcularDistancia(centro, borde)
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
    } else if (modoMedicion === 'circulo') {
      const radio = calcularRadio()
      const area = Math.PI * radio * radio
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

  // Calibrar medición
  const calibrarMedicion = () => {
    setCalibracion(true)
    setMensaje('Modo calibración - Captura dos puntos conocidos')
  }

  // Actualizar factor de escala
  const actualizarFactorEscala = (nuevoFactor: number) => {
    setFactorEscala(nuevoFactor)
    setMensaje(`Factor de escala actualizado: ${nuevoFactor.toFixed(3)} m/píxel`)
  }

  // Exportar medición
  const exportarMedicion = () => {
    const medicion = {
      tipo: modoMedicion,
      puntos: puntosCapturados,
      distancia: distanciaTotal * factorEscala,
      area: areaCalculada * factorEscala * factorEscala,
      factorEscala,
      fecha: new Date().toISOString(),
      timestamp: Date.now()
    }
    
    onMedicionCompletada(medicion)
    setMensaje('Medición exportada')
  }



  // Limpiar al desmontar
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
            disabled={isLoading}
            className={`futbol-btn ${isCameraActive ? 'futbol-btn-danger' : 'futbol-btn-primary'} ${isLoading ? 'opacity-50' : ''}`}
            whileHover={{ scale: 1.05 }}
            whileTap={{ scale: 0.95 }}
          >
            {isLoading ? (
              <div className="animate-spin rounded-full h-5 w-5 border-b-2 border-white"></div>
            ) : isCameraActive ? (
              <CameraOff className="w-5 h-5" />
            ) : (
              <Camera className="w-5 h-5" />
            )}
            {isLoading ? 'Iniciando...' : isCameraActive ? 'Detener' : 'Iniciar'} Cámara
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
          {!isCameraActive && (
            <div className="absolute inset-0 flex items-center justify-center">
              <div className="text-center text-white/70">
                <Camera className="w-16 h-16 mx-auto mb-4 opacity-50" />
                <p>Inicia la cámara para comenzar la medición</p>
              </div>
            </div>
          )}
          
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
                className="absolute w-4 h-4 bg-red-500 rounded-full border-2 border-white transform -translate-x-2 -translate-y-2 animate-pulse"
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
                  strokeDasharray="5,5"
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
      <div className="flex gap-3 mb-6 flex-wrap">
        <motion.button
          onClick={isRecording ? detenerGrabacion : iniciarGrabacion}
          disabled={!isCameraActive}
          className={`futbol-btn ${isRecording ? 'futbol-btn-danger' : 'futbol-btn-success'} ${!isCameraActive ? 'opacity-50' : ''}`}
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
          onClick={calibrarMedicion}
          className="futbol-btn futbol-btn-secondary"
          whileHover={{ scale: 1.05 }}
          whileTap={{ scale: 0.95 }}
        >
          <Settings className="w-5 h-5" />
          Calibrar
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
          <p className="text-2xl font-bold text-white">{(distanciaTotal * factorEscala).toFixed(2)} m</p>
        </div>

        {(modoMedicion === 'area' || modoMedicion === 'circulo') && (
          <div className="futbol-card">
            <div className="flex items-center gap-2 mb-2">
              <Square className="w-5 h-5 text-purple-400" />
              <span className="text-white font-semibold">Área Calculada</span>
            </div>
            <p className="text-2xl font-bold text-white">{(areaCalculada * factorEscala * factorEscala).toFixed(2)} m²</p>
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
        <div className="mt-2 text-xs text-white/50">
          Factor de escala: {factorEscala.toFixed(3)} m/píxel
        </div>
      </div>

      {/* Error */}
      {error && (
        <div className="mt-4 p-4 bg-red-900/20 border border-red-500 rounded-lg">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-2">
              <AlertTriangle className="w-5 h-5 text-red-400" />
              <span className="text-red-400 font-semibold">Error</span>
            </div>
            <button
              onClick={() => setError(null)}
              className="text-red-400 hover:text-red-300"
            >
              <X className="w-4 h-4" />
            </button>
          </div>
          <p className="text-red-300 mt-2">{error}</p>
        </div>
      )}

      {/* Calibración */}
      {calibracion && (
        <div className="mt-4 p-4 bg-yellow-900/20 border border-yellow-500 rounded-lg">
          <div className="flex items-center gap-2 mb-2">
            <Settings className="w-5 h-5 text-yellow-400" />
            <span className="text-yellow-400 font-semibold">Modo Calibración</span>
          </div>
          <p className="text-yellow-300 text-sm">
            Captura dos puntos conocidos para calibrar la medición. 
            Ingresa la distancia real entre los puntos para establecer el factor de escala.
          </p>
          <div className="mt-3 flex items-center gap-2">
            <label className="text-yellow-300 text-sm">Factor de escala (m/píxel):</label>
            <input
              type="number"
              step="0.001"
              min="0.001"
              value={factorEscala}
              onChange={(e) => actualizarFactorEscala(parseFloat(e.target.value) || 1)}
              className="px-2 py-1 bg-blue-900/50 border border-blue-500 rounded text-white text-sm w-24"
            />
          </div>
        </div>
      )}
    </div>
  )
} 