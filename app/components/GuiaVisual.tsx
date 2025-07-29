'use client'

import { motion } from 'framer-motion'
import { 
  Play, 
  Pause, 
  CheckCircle,
  AlertTriangle,
  Target,
  MapPin,
  Ruler,
  Circle,
  Square,
  ArrowRight,
  ArrowLeft,
  Eye,
  EyeOff
} from 'lucide-react'
import { useState, useEffect } from 'react'

interface PasoGuia {
  id: number
  titulo: string
  descripcion: string
  instrucciones: string[]
  elemento: string
  duracion: number
  icono: string
  color: string
  completado: boolean
  critico: boolean
}

interface GuiaVisualProps {
  onPasoCompletado: (pasoId: number) => void
  onGuiaCompletada: () => void
}

export default function GuiaVisual({ 
  onPasoCompletado, 
  onGuiaCompletada 
}: GuiaVisualProps) {
  const [pasoActual, setPasoActual] = useState(0)
  const [isPlaying, setIsPlaying] = useState(false)
  const [tiempoRestante, setTiempoRestante] = useState(0)
  const [mostrarDetalles, setMostrarDetalles] = useState(false)


  // Guía paso a paso para medición FIFA
  const pasosGuia: PasoGuia[] = [
    {
      id: 1,
      titulo: 'Preparación GPS',
      descripcion: 'Activar GPS de alta precisión y calibración',
      instrucciones: [
        'Posicionarse en el centro de la cancha',
        'Activar GPS de alta precisión',
        'Esperar calibración completa (30 segundos)',
        'Verificar precisión mínima de 0.5m'
      ],
      elemento: 'GPS',
      duracion: 30,
      icono: 'Target',
      color: '#3B82F6',
      completado: false,
      critico: true
    },
    {
      id: 2,
      titulo: 'Línea de Fondo Norte',
      descripcion: 'Medir la línea de fondo norte con precisión FIFA',
      instrucciones: [
        'Posicionarse en la esquina noroeste',
        'Caminar en línea recta hacia el noreste',
        'Mantener velocidad constante',
        'Registrar puntos cada 5 metros'
      ],
      elemento: 'Línea de Fondo',
      duracion: 45,
      icono: 'Ruler',
      color: '#10B981',
      completado: false,
      critico: true
    },
    {
      id: 3,
      titulo: 'Línea Lateral Este',
      descripcion: 'Medir la línea lateral este con estándares FIFA',
      instrucciones: [
        'Posicionarse en la esquina noreste',
        'Caminar hacia el sureste',
        'Mantener línea recta perfecta',
        'Verificar perpendicularidad'
      ],
      elemento: 'Línea Lateral',
      duracion: 40,
      icono: 'Ruler',
      color: '#F59E0B',
      completado: false,
      critico: true
    },
    {
      id: 4,
      titulo: 'Línea de Fondo Sur',
      descripcion: 'Medir la línea de fondo sur paralela a la norte',
      instrucciones: [
        'Posicionarse en la esquina sureste',
        'Caminar hacia el suroeste',
        'Mantener paralelismo con línea norte',
        'Verificar distancia correcta'
      ],
      elemento: 'Línea de Fondo',
      duracion: 45,
      icono: 'Ruler',
      color: '#EF4444',
      completado: false,
      critico: true
    },
    {
      id: 5,
      titulo: 'Línea Lateral Oeste',
      descripcion: 'Completar el rectángulo con la línea oeste',
      instrucciones: [
        'Posicionarse en la esquina suroeste',
        'Caminar hacia el noroeste',
        'Cerrar el rectángulo perfectamente',
        'Verificar ángulos de 90°'
      ],
      elemento: 'Línea Lateral',
      duracion: 40,
      icono: 'Ruler',
      color: '#8B5CF6',
      completado: false,
      critico: true
    },
    {
      id: 6,
      titulo: 'Línea Central',
      descripcion: 'Medir la línea central que divide la cancha',
      instrucciones: [
        'Posicionarse en el punto medio del lateral oeste',
        'Caminar hacia el lateral este',
        'Mantener línea perfectamente central',
        'Verificar división equitativa'
      ],
      elemento: 'Línea Central',
      duracion: 35,
      icono: 'Ruler',
      color: '#06B6D4',
      completado: false,
      critico: false
    },
    {
      id: 7,
      titulo: 'Círculo Central',
      descripcion: 'Medir el radio del círculo central',
      instrucciones: [
        'Posicionarse en el centro de la cancha',
        'Medir radio de 9.15m en todas las direcciones',
        'Verificar circularidad perfecta',
        'Marcar puntos de referencia'
      ],
      elemento: 'Círculo Central',
      duracion: 60,
      icono: 'Circle',
      color: '#EC4899',
      completado: false,
      critico: false
    },
    {
      id: 8,
      titulo: 'Áreas Penales',
      descripcion: 'Medir las áreas penales norte y sur',
      instrucciones: [
        'Medir área penal norte (16.5m x 40.32m)',
        'Medir área penal sur (16.5m x 40.32m)',
        'Verificar simetría perfecta',
        'Marcar puntos penales'
      ],
      elemento: 'Área Penal',
      duracion: 90,
      icono: 'Square',
      color: '#F97316',
      completado: false,
      critico: true
    }
  ]

  const pasoActualData = pasosGuia[pasoActual]
  
  // Si no hay paso actual, mostrar mensaje de error
  if (!pasoActualData) {
    return (
      <div className="futbol-card">
        <h3 className="text-lg font-bold text-white mb-4">Error en la Guía</h3>
        <p className="text-white/70">No se pudo cargar el paso actual.</p>
      </div>
    )
  }

  useEffect(() => {
    if (isPlaying) {
      const timer = setTimeout(() => {
        if (tiempoRestante > 0) {
          setTiempoRestante(tiempoRestante - 1)
        } else {
          completarPaso()
        }
      }, 1000)
      return () => clearTimeout(timer)
    }
    return undefined
  }, [isPlaying, tiempoRestante])

  const iniciarPaso = () => {
    setIsPlaying(true)
    if (pasoActualData) {
      setTiempoRestante(pasoActualData.duracion)
    }
  }

  const pausarPaso = () => {
    setIsPlaying(false)
  }

  const completarPaso = () => {
    const nuevosPasos = [...pasosGuia]
    if (nuevosPasos[pasoActual]) {
      nuevosPasos[pasoActual].completado = true
    }
    onPasoCompletado(pasoActualData.id)
    
    if (pasoActual < pasosGuia.length - 1) {
      setPasoActual(pasoActual + 1)
      const siguientePaso = pasosGuia[pasoActual + 1]
      if (siguientePaso) {
        setTiempoRestante(siguientePaso.duracion)
      }
    } else {
      onGuiaCompletada()
    }
  }

  const siguientePaso = () => {
    if (pasoActual < pasosGuia.length - 1) {
      setPasoActual(pasoActual + 1)
      const siguientePaso = pasosGuia[pasoActual + 1]
      if (siguientePaso) {
        setTiempoRestante(siguientePaso.duracion)
      }
      setIsPlaying(false)
    }
  }

  const pasoAnterior = () => {
    if (pasoActual > 0) {
      setPasoActual(pasoActual - 1)
      const pasoAnterior = pasosGuia[pasoActual - 1]
      if (pasoAnterior) {
        setTiempoRestante(pasoAnterior.duracion)
      }
      setIsPlaying(false)
    }
  }

  const obtenerIcono = (icono: string) => {
    switch (icono) {
      case 'Target': return <Target className="w-5 h-5" />
      case 'Ruler': return <Ruler className="w-5 h-5" />
      case 'Circle': return <Circle className="w-5 h-5" />
      case 'Square': return <Square className="w-5 h-5" />
      default: return <MapPin className="w-5 h-5" />
    }
  }

  const pasosCompletados = pasosGuia.filter(paso => paso.completado).length
  const progreso = (pasosCompletados / pasosGuia.length) * 100

  return (
    <div className="space-y-6">
      {/* Header */}
      <motion.div 
        className="futbol-card"
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
      >
        <div className="flex items-center justify-between mb-6">
          <div>
            <h2 className="text-2xl font-bold text-white mb-2">Guía Visual FIFA</h2>
            <p className="text-white/70">Sigue las instrucciones paso a paso para medición profesional</p>
          </div>
          <div className="flex items-center gap-2">
            <motion.button
              onClick={() => setMostrarDetalles(!mostrarDetalles)}
              className="futbol-btn futbol-btn-secondary p-2"
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
            >
              {mostrarDetalles ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
            </motion.button>
          </div>
        </div>

        {/* Barra de Progreso */}
        <div className="mb-6">
          <div className="flex justify-between text-sm text-white mb-2">
            <span>Progreso: {pasosCompletados}/{pasosGuia.length}</span>
            <span>{progreso.toFixed(0)}%</span>
          </div>
          <div className="w-full bg-white/10 rounded-full h-3">
            <motion.div 
              className="bg-gradient-to-r from-blue-500 to-green-500 h-3 rounded-full"
              initial={{ width: 0 }}
              animate={{ width: `${progreso}%` }}
              transition={{ duration: 0.5 }}
            />
          </div>
        </div>
      </motion.div>

      {/* Paso Actual */}
      <motion.div 
        className="futbol-card"
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.2 }}
      >
        <div className="flex items-start justify-between mb-6">
          <div className="flex items-center gap-4">
            <div 
              className="w-16 h-16 rounded-lg flex items-center justify-center"
              style={{ backgroundColor: pasoActualData.color }}
            >
              {obtenerIcono(pasoActualData.icono)}
            </div>
            <div>
              <h3 className="text-xl font-bold text-white mb-2">
                Paso {pasoActual + 1}: {pasoActualData.titulo}
              </h3>
              <p className="text-white/70">{pasoActualData.descripcion}</p>
              {pasoActualData.critico && (
                <div className="flex items-center gap-2 mt-2">
                  <AlertTriangle className="w-4 h-4 text-red-400" />
                  <span className="text-red-400 text-sm">Crítico para certificación FIFA</span>
                </div>
              )}
            </div>
          </div>
          <div className="text-right">
            <div className="text-2xl font-bold text-blue-400">
              {Math.floor(tiempoRestante / 60)}:{(tiempoRestante % 60).toString().padStart(2, '0')}
            </div>
            <div className="text-xs text-white/70">Tiempo restante</div>
          </div>
        </div>

        {/* Instrucciones */}
        <div className="mb-6">
          <h4 className="text-white font-semibold mb-3">Instrucciones:</h4>
          <div className="space-y-2">
            {pasoActualData.instrucciones.map((instruccion, index) => (
              <motion.div
                key={index}
                className="flex items-center gap-3 p-3 bg-white/5 rounded-lg"
                initial={{ opacity: 0, x: -20 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ delay: index * 0.1 }}
              >
                <div className="w-6 h-6 bg-blue-500 rounded-full flex items-center justify-center">
                  <span className="text-white text-xs font-bold">{index + 1}</span>
                </div>
                <span className="text-white">{instruccion}</span>
              </motion.div>
            ))}
          </div>
        </div>

        {/* Controles */}
        <div className="flex items-center justify-between">
          <div className="flex gap-2">
            <motion.button
              onClick={pasoAnterior}
              disabled={pasoActual === 0}
              className="futbol-btn futbol-btn-secondary p-2"
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
            >
              <ArrowLeft className="w-4 h-4" />
            </motion.button>
            
            {isPlaying ? (
              <motion.button
                onClick={pausarPaso}
                className="futbol-btn futbol-btn-warning flex items-center gap-2"
                whileHover={{ scale: 1.02 }}
                whileTap={{ scale: 0.98 }}
              >
                <Pause className="w-4 h-4" />
                <span>Pausar</span>
              </motion.button>
            ) : (
              <motion.button
                onClick={iniciarPaso}
                className="futbol-btn futbol-btn-primary flex items-center gap-2"
                whileHover={{ scale: 1.02 }}
                whileTap={{ scale: 0.98 }}
              >
                <Play className="w-4 h-4" />
                <span>Iniciar</span>
              </motion.button>
            )}
            
            <motion.button
              onClick={siguientePaso}
              disabled={pasoActual === pasosGuia.length - 1}
              className="futbol-btn futbol-btn-secondary p-2"
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
            >
              <ArrowRight className="w-4 h-4" />
            </motion.button>
          </div>

          <motion.button
            onClick={completarPaso}
            className="futbol-btn futbol-btn-success flex items-center gap-2"
            whileHover={{ scale: 1.02 }}
            whileTap={{ scale: 0.98 }}
          >
            <CheckCircle className="w-4 h-4" />
            <span>Completar Paso</span>
          </motion.button>
        </div>
      </motion.div>

      {/* Lista de Pasos */}
      {mostrarDetalles && (
        <motion.div 
          className="futbol-card"
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.3 }}
        >
          <h3 className="text-lg font-bold text-white mb-4">Todos los Pasos</h3>
          <div className="space-y-3">
            {pasosGuia.map((paso, index) => (
              <motion.div
                key={paso.id}
                className={`p-4 rounded-lg border transition-all ${
                  index === pasoActual 
                    ? 'border-blue-400 bg-blue-500/10' 
                    : paso.completado 
                    ? 'border-green-400 bg-green-500/10' 
                    : 'border-white/20 bg-white/5'
                }`}
                whileHover={{ scale: 1.02 }}
              >
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-3">
                    <div className={`w-8 h-8 rounded-full flex items-center justify-center ${
                      paso.completado 
                        ? 'bg-green-500' 
                        : index === pasoActual 
                        ? 'bg-blue-500' 
                        : 'bg-white/20'
                    }`}>
                      {paso.completado ? (
                        <CheckCircle className="w-4 h-4 text-white" />
                      ) : (
                        <span className="text-white text-sm font-bold">{index + 1}</span>
                      )}
                    </div>
                    <div>
                      <h4 className="text-white font-semibold">{paso.titulo}</h4>
                      <p className="text-white/70 text-sm">{paso.descripcion}</p>
                    </div>
                  </div>
                  <div className="text-right">
                    <div className="text-sm text-white/70">{paso.duracion}s</div>
                    {paso.critico && (
                      <div className="text-xs text-red-400">Crítico</div>
                    )}
                  </div>
                </div>
              </motion.div>
            ))}
          </div>
        </motion.div>
      )}
    </div>
  )
} 