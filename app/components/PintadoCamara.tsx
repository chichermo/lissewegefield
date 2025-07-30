import { useState, useRef, useEffect } from 'react'
import { motion } from 'framer-motion'
import {
  Camera,
  CameraOff,
  Paintbrush,
  Palette,
  Download,
  RotateCcw,

  AlertTriangle,
  Play,
  Pause,
  Square,
  Circle,
  Ruler,
  Target
} from 'lucide-react'

interface PintadoCamaraProps {
  onPintadoCompletado: (pintado: any) => void
}

interface LineaPintada {
  id: string
  puntos: { x: number; y: number }[]
  color: string
  grosor: number
  tipo: 'linea' | 'area' | 'circulo'
  timestamp: number
}

export default function PintadoCamara({ onPintadoCompletado }: PintadoCamaraProps) {
  const [isCameraActive, setIsCameraActive] = useState(false)
  const [isPintando, setIsPintando] = useState(false)
  const [lineasPintadas, setLineasPintadas] = useState<LineaPintada[]>([])
  const [lineaActual, setLineaActual] = useState<LineaPintada | null>(null)
  const [colorSeleccionado, setColorSeleccionado] = useState('#FF0000')
  const [grosorSeleccionado, setGrosorSeleccionado] = useState(3)
  const [tipoLinea, setTipoLinea] = useState<'linea' | 'area' | 'circulo'>('linea')
  const [error, setError] = useState<string | null>(null)
  const [mensaje, setMensaje] = useState('')
  
  const videoRef = useRef<HTMLVideoElement>(null)

  const streamRef = useRef<MediaStream | null>(null)

  const coloresDisponibles = [
    '#FF0000', '#00FF00', '#0000FF', '#FFFF00', 
    '#FF00FF', '#00FFFF', '#FFFFFF', '#000000'
  ]

  const grosoresDisponibles = [1, 2, 3, 5, 8, 12]

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
          setMensaje('Cámara activa - Toca para pintar líneas')
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

  // Iniciar pintado
  const iniciarPintado = () => {
    setIsPintando(true)
    setMensaje('Pintado iniciado - Toca para dibujar')
  }

  // Detener pintado
  const detenerPintado = () => {
    setIsPintando(false)
    if (lineaActual) {
      setLineasPintadas(prev => [...prev, lineaActual])
      setLineaActual(null)
    }
    setMensaje('Pintado detenido')
  }

  // Capturar punto de pintado
  const capturarPuntoPintado = (event: React.MouseEvent<HTMLDivElement>) => {
    if (!isCameraActive || !isPintando) return

    const rect = event.currentTarget.getBoundingClientRect()
    const x = event.clientX - rect.left
    const y = event.clientY - rect.top
    
    const nuevoPunto = { x, y }

    if (!lineaActual) {
      // Crear nueva línea
      const nuevaLinea: LineaPintada = {
        id: `linea_${Date.now()}`,
        puntos: [nuevoPunto],
        color: colorSeleccionado,
        grosor: grosorSeleccionado,
        tipo: tipoLinea,
        timestamp: Date.now()
      }
      setLineaActual(nuevaLinea)
    } else {
      // Agregar punto a línea existente
      setLineaActual(prev => prev ? {
        ...prev,
        puntos: [...prev.puntos, nuevoPunto]
      } : null)
    }

    setMensaje(`Punto agregado a ${tipoLinea}`)
  }

  // Limpiar todo
  const limpiarPintado = () => {
    setLineasPintadas([])
    setLineaActual(null)
    setMensaje('Pintado limpiado')
  }

  // Exportar pintado
  const exportarPintado = () => {
    const pintado = {
      lineas: lineasPintadas,
      fecha: new Date().toISOString(),
      timestamp: Date.now()
    }
    
    onPintadoCompletado(pintado)
    setMensaje('Pintado exportado')
  }

  // Eliminar última línea
  const eliminarUltimaLinea = () => {
    if (lineasPintadas.length > 0) {
      setLineasPintadas(prev => prev.slice(0, -1))
      setMensaje('Última línea eliminada')
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
        <h2 className="text-2xl font-bold text-white">Pintado con Cámara</h2>
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

      {/* Controles de pintado */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-6">
        {/* Tipo de línea */}
        <div>
          <h3 className="text-lg font-semibold text-white mb-3">Tipo de Línea</h3>
          <div className="flex gap-2">
            {[
              { id: 'linea', icon: Ruler, label: 'Línea' },
              { id: 'area', icon: Square, label: 'Área' },
              { id: 'circulo', icon: Circle, label: 'Círculo' }
            ].map(({ id, icon: Icon, label }) => (
              <motion.button
                key={id}
                onClick={() => setTipoLinea(id as any)}
                className={`futbol-btn ${tipoLinea === id ? 'futbol-btn-success' : 'futbol-btn-secondary'}`}
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
              >
                <Icon className="w-4 h-4" />
                {label}
              </motion.button>
            ))}
          </div>
        </div>

        {/* Selector de color */}
        <div>
          <h3 className="text-lg font-semibold text-white mb-3">Color</h3>
          <div className="flex gap-2 flex-wrap">
            {coloresDisponibles.map(color => (
              <motion.button
                key={color}
                onClick={() => setColorSeleccionado(color)}
                className={`w-8 h-8 rounded-full border-2 ${colorSeleccionado === color ? 'border-white' : 'border-gray-400'}`}
                style={{ backgroundColor: color }}
                whileHover={{ scale: 1.1 }}
                whileTap={{ scale: 0.9 }}
              />
            ))}
          </div>
        </div>

        {/* Selector de grosor */}
        <div>
          <h3 className="text-lg font-semibold text-white mb-3">Grosor</h3>
          <div className="flex gap-2">
            {grosoresDisponibles.map(grosor => (
              <motion.button
                key={grosor}
                onClick={() => setGrosorSeleccionado(grosor)}
                className={`futbol-btn ${grosorSeleccionado === grosor ? 'futbol-btn-success' : 'futbol-btn-secondary'}`}
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
              >
                <div 
                  className="w-4 h-4 rounded-full"
                  style={{ 
                    backgroundColor: colorSeleccionado,
                    width: `${grosor}px`,
                    height: `${grosor}px`
                  }}
                />
              </motion.button>
            ))}
          </div>
        </div>
      </div>

      {/* Contenedor de cámara */}
      <div className="relative mb-6">
        <div 
          className="relative w-full h-64 bg-black rounded-lg overflow-hidden cursor-crosshair"
          onClick={capturarPuntoPintado}
        >
          <video
            ref={videoRef}
            autoPlay
            playsInline
            muted
            className="w-full h-full object-cover"
          />
          
          {/* Overlay con líneas pintadas */}
          <div className="absolute inset-0 pointer-events-none">
            <svg className="w-full h-full">
              {/* Líneas completadas */}
              {lineasPintadas.map(linea => (
                <g key={linea.id}>
                  {linea.puntos.length > 1 && (
                    <polyline
                      points={linea.puntos.map(p => `${p.x},${p.y}`).join(' ')}
                      fill="none"
                      stroke={linea.color}
                      strokeWidth={linea.grosor}
                    />
                  )}
                  {linea.puntos.map((punto, index) => (
                    <circle
                      key={index}
                      cx={punto.x}
                      cy={punto.y}
                      r={linea.grosor / 2}
                      fill={linea.color}
                    />
                  ))}
                </g>
              ))}
              
              {/* Línea actual */}
              {lineaActual && lineaActual.puntos.length > 1 && (
                <polyline
                  points={lineaActual.puntos.map(p => `${p.x},${p.y}`).join(' ')}
                  fill="none"
                  stroke={lineaActual.color}
                  strokeWidth={lineaActual.grosor}
                />
              )}
              {lineaActual && lineaActual.puntos.map((punto, index) => (
                <circle
                  key={index}
                  cx={punto.x}
                  cy={punto.y}
                  r={lineaActual.grosor / 2}
                  fill={lineaActual.color}
                />
              ))}
            </svg>
          </div>

          {/* Mensaje de estado */}
          {mensaje && (
            <div className="absolute bottom-4 left-4 right-4 bg-black/70 text-white p-2 rounded text-sm">
              {mensaje}
            </div>
          )}
        </div>
      </div>

      {/* Controles de pintado */}
      <div className="flex gap-3 mb-6">
        <motion.button
          onClick={isPintando ? detenerPintado : iniciarPintado}
          className={`futbol-btn ${isPintando ? 'futbol-btn-danger' : 'futbol-btn-success'}`}
          whileHover={{ scale: 1.05 }}
          whileTap={{ scale: 0.95 }}
        >
          {isPintando ? <Pause className="w-5 h-5" /> : <Play className="w-5 h-5" />}
          {isPintando ? 'Detener' : 'Iniciar'} Pintado
        </motion.button>

        <motion.button
          onClick={limpiarPintado}
          className="futbol-btn futbol-btn-secondary"
          whileHover={{ scale: 1.05 }}
          whileTap={{ scale: 0.95 }}
        >
          <RotateCcw className="w-5 h-5" />
          Limpiar Todo
        </motion.button>

        <motion.button
          onClick={eliminarUltimaLinea}
          disabled={lineasPintadas.length === 0}
          className="futbol-btn futbol-btn-warning disabled:opacity-50"
          whileHover={{ scale: 1.05 }}
          whileTap={{ scale: 0.95 }}
        >
          <Square className="w-5 h-5" />
          Eliminar Última
        </motion.button>

        <motion.button
          onClick={exportarPintado}
          disabled={lineasPintadas.length === 0}
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
            <Paintbrush className="w-5 h-5 text-blue-400" />
            <span className="text-white font-semibold">Líneas Pintadas</span>
          </div>
          <p className="text-2xl font-bold text-white">{lineasPintadas.length}</p>
        </div>

        <div className="futbol-card">
          <div className="flex items-center gap-2 mb-2">
            <Target className="w-5 h-5 text-green-400" />
            <span className="text-white font-semibold">Puntos Totales</span>
          </div>
          <p className="text-2xl font-bold text-white">
            {lineasPintadas.reduce((total, linea) => total + linea.puntos.length, 0)}
          </p>
        </div>

        <div className="futbol-card">
          <div className="flex items-center gap-2 mb-2">
            <Palette className="w-5 h-5 text-purple-400" />
            <span className="text-white font-semibold">Color Actual</span>
          </div>
          <div className="flex items-center gap-2">
            <div 
              className="w-6 h-6 rounded-full border-2 border-white"
              style={{ backgroundColor: colorSeleccionado }}
            />
            <span className="text-white">{colorSeleccionado}</span>
          </div>
        </div>
      </div>

      {/* Información del modo */}
      <div className="mt-6 p-4 bg-blue-900/20 rounded-lg">
        <h4 className="text-lg font-semibold text-white mb-2">
          Modo: {tipoLinea === 'linea' ? 'Línea' : tipoLinea === 'area' ? 'Área' : 'Círculo'}
        </h4>
        <p className="text-white/70 text-sm">
          {tipoLinea === 'linea' && 'Toca la pantalla para dibujar líneas continuas.'}
          {tipoLinea === 'area' && 'Toca la pantalla para dibujar áreas cerradas.'}
          {tipoLinea === 'circulo' && 'Toca el centro y luego el borde para dibujar círculos.'}
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