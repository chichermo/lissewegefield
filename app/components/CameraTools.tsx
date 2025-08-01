'use client'

import { useState, useRef, useEffect } from 'react'
import { motion } from 'framer-motion'
import {
  Target,
  Move,
  Ruler,
  Route,
  Settings,
  Minus
} from 'lucide-react'
import { useLanguage } from '../contexts/LanguageContext'

interface CameraToolsProps {
  isActive: boolean
  onToggleTool: (tool: string) => void
  activTools: string[]
  onMeasurementUpdate: (measurement: number) => void
  walkingPath: Array<{ x: number; y: number; timestamp: number }>
}

interface ToolConfig {
  id: string
  name: string
  description: string
  icon: any
  color: string
  overlay: boolean
}

// Mover CAMERA_TOOLS dentro del componente para acceder a t()
function getCameraTools(t: (key: string) => string): ToolConfig[] {
  return [
    {
      id: 'tracking-point',
      name: t('camera.tracking'),
      description: t('camera.tracking.desc'),
      icon: Target,
      color: 'bg-red-500',
      overlay: true
    },
    {
      id: 'guide-lines',
      name: t('camera.guidelines'),
      description: t('camera.guidelines.desc'),
      icon: Minus,
      color: 'bg-blue-500',
      overlay: true
    },
    {
      id: 'live-measurement',
      name: t('camera.measurement'),
      description: t('camera.measurement.desc'),
      icon: Ruler,
      color: 'bg-green-500',
      overlay: true
    },
    {
      id: 'path-tracker',
      name: t('camera.tracker'),
      description: t('camera.tracker.desc'),
      icon: Route,
      color: 'bg-purple-500',
      overlay: true
    },
    {
      id: 'straightness-checker',
      name: t('camera.straightness'),
      description: t('camera.straightness.desc'),
      icon: Move,
      color: 'bg-yellow-500',
      overlay: false
    }
  ]
}

export default function CameraTools({ 
  isActive, 
  onToggleTool, 
  activTools, 
  onMeasurementUpdate,
  walkingPath 
}: CameraToolsProps) {
  const { t } = useLanguage()
  const [showSettings, setShowSettings] = useState(false)
  const [guideLineWidth, setGuideLineWidth] = useState(15) // centímetros
  const [canvasSize, setCanvasSize] = useState({ width: 0, height: 0 })
  const [isClient, setIsClient] = useState(false)
  const pathCanvasRef = useRef<HTMLCanvasElement>(null)

  // Obtener herramientas con traducciones
  const CAMERA_TOOLS = getCameraTools(t)

  // Detectar lado del cliente para evitar errores de hidratación
  useEffect(() => {
    setIsClient(true)
  }, [])

  // Calcular rectitud del camino
  const calculateStraightness = () => {
    if (walkingPath.length < 3) return 100

    const start = walkingPath[0]
    const end = walkingPath[walkingPath.length - 1]
    
    if (!start || !end) return 100

    const totalDistance = Math.sqrt(
      Math.pow(end.x - start.x, 2) + Math.pow(end.y - start.y, 2)
    )

    let actualDistance = 0
    for (let i = 1; i < walkingPath.length; i++) {
      const prev = walkingPath[i - 1]
      const curr = walkingPath[i]
      
      if (!prev || !curr) continue
      
      actualDistance += Math.sqrt(
        Math.pow(curr.x - prev.x, 2) + Math.pow(curr.y - prev.y, 2)
      )
    }

    const straightness = (totalDistance / actualDistance) * 100
    return Math.min(100, Math.max(0, straightness))
  }

  // Configurar dimensiones del canvas
  useEffect(() => {
    const updateCanvasSize = () => {
      setCanvasSize({
        width: window.innerWidth,
        height: window.innerHeight
      })
    }

    if (typeof window !== 'undefined') {
      updateCanvasSize()
      window.addEventListener('resize', updateCanvasSize)
      return () => window.removeEventListener('resize', updateCanvasSize)
    }
    
    return undefined
  }, [])

  // Actualizar medición cuando cambia el camino
  useEffect(() => {
    if (walkingPath.length > 1) {
      let totalDistance = 0
      for (let i = 1; i < walkingPath.length; i++) {
        const prev = walkingPath[i - 1]
        const curr = walkingPath[i]
        
        if (!prev || !curr) continue
        
        const distance = Math.sqrt(
          Math.pow(curr.x - prev.x, 2) + Math.pow(curr.y - prev.y, 2)
        )
        totalDistance += distance * 0.001 // Convertir a metros
      }
      onMeasurementUpdate(totalDistance)
    }
  }, [walkingPath, onMeasurementUpdate])

  // Dibujar ruta en canvas
  useEffect(() => {
    if (!activTools.includes('path-tracker') || !pathCanvasRef.current) return

    const canvas = pathCanvasRef.current
    const ctx = canvas.getContext('2d')
    if (!ctx) return

    ctx.clearRect(0, 0, canvas.width, canvas.height)
    
    if (walkingPath.length > 1) {
      const firstPoint = walkingPath[0]
      const lastPoint = walkingPath[walkingPath.length - 1]
      
      if (!firstPoint || !lastPoint) return
      
      ctx.strokeStyle = '#3b82f6'
      ctx.lineWidth = 3
      ctx.lineCap = 'round'
      ctx.lineJoin = 'round'

      ctx.beginPath()
      ctx.moveTo(firstPoint.x, firstPoint.y)
      
      for (let i = 1; i < walkingPath.length; i++) {
        const point = walkingPath[i]
        if (point) {
          ctx.lineTo(point.x, point.y)
        }
      }
      
      ctx.stroke()

      // Punto de inicio (verde)
      ctx.fillStyle = '#22c55e'
      ctx.beginPath()
      ctx.arc(firstPoint.x, firstPoint.y, 6, 0, 2 * Math.PI)
      ctx.fill()

      // Punto actual (rojo)
      ctx.fillStyle = '#ef4444'
      ctx.beginPath()
      ctx.arc(lastPoint.x, lastPoint.y, 6, 0, 2 * Math.PI)
      ctx.fill()
    }
  }, [walkingPath, activTools])

  const straightness = calculateStraightness()

  // Debug: Mostrar siempre para probar
  console.log('CameraTools isActive:', isActive, 'activTools:', activTools)

  if (!isActive) return null

  return (
    <div className="absolute inset-0 pointer-events-none">
      {/* Overlays de herramientas */}
      <div className="relative w-full h-full">
        {/* Punto de seguimiento central */}
        {activTools.includes('tracking-point') && (
          <div className="absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 pointer-events-none">
            <motion.div
              className="w-8 h-8 border-4 border-red-500 rounded-full bg-red-500/20"
              animate={{
                scale: [1, 1.2, 1],
                opacity: [0.8, 1, 0.8]
              }}
              transition={{
                duration: 2,
                repeat: Infinity,
                ease: "easeInOut"
              }}
            >
              <div className="absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 w-2 h-2 bg-red-500 rounded-full" />
            </motion.div>
          </div>
        )}

        {/* Líneas guía paralelas */}
        {activTools.includes('guide-lines') && (
          <div className="absolute inset-0 pointer-events-none">
            <div 
              className="absolute top-0 bottom-0 border-l-2 border-blue-500 border-dashed opacity-70"
              style={{ left: `calc(50% - ${guideLineWidth/2}px)` }}
            />
            <div 
              className="absolute top-0 bottom-0 border-r-2 border-blue-500 border-dashed opacity-70"
              style={{ right: `calc(50% - ${guideLineWidth/2}px)` }}
            />
            <div className="absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2">
              <div className="bg-blue-500/80 text-white px-2 py-1 rounded text-xs">
                {guideLineWidth}cm
              </div>
            </div>
          </div>
        )}

        {/* Medición en vivo */}
        {activTools.includes('live-measurement') && walkingPath.length > 1 && (
          <div className="absolute top-4 left-4 bg-green-500/90 text-white px-4 py-2 rounded-lg">
            <div className="text-xs opacity-80">{t('camera.distance')}</div>
            <div className="text-lg font-bold">
              {walkingPath.reduce((total, point, index) => {
                if (index === 0) return 0
                const prev = walkingPath[index - 1]
                if (!prev || !point) return total
                const distance = Math.sqrt(
                  Math.pow(point.x - prev.x, 2) + Math.pow(point.y - prev.y, 2)
                )
                return total + (distance * 0.001)
              }, 0).toFixed(2)}m
            </div>
          </div>
        )}

        {/* Canvas para rastreador de ruta */}
        {activTools.includes('path-tracker') && canvasSize.width > 0 && (
          <canvas
            ref={pathCanvasRef}
            width={canvasSize.width}
            height={canvasSize.height}
            className="absolute inset-0 pointer-events-none"
            style={{ width: '100%', height: '100%' }}
          />
        )}

        {/* Verificador de rectitud */}
        {activTools.includes('straightness-checker') && walkingPath.length > 2 && (
          <div className="absolute top-4 right-4 bg-yellow-500/90 text-white px-4 py-2 rounded-lg">
            <div className="text-xs opacity-80">{t('camera.rectitude')}</div>
            <div className="text-lg font-bold flex items-center">
              {straightness.toFixed(1)}%
              <div className={`ml-2 w-3 h-3 rounded-full ${
                straightness > 90 ? 'bg-green-400' : 
                straightness > 70 ? 'bg-yellow-400' : 'bg-red-400'
              }`} />
            </div>
          </div>
        )}
      </div>

      {/* Panel de control de herramientas - Flotante y colapsable */}
      <div className="absolute top-4 left-4 pointer-events-auto max-w-xs">
        <motion.div
          className={`bg-black/70 backdrop-blur-sm rounded-2xl border border-white/20 transition-all duration-300 ${
            showSettings ? 'p-4' : 'p-2'
          }`}
          initial={{ x: -100, opacity: 0 }}
          animate={{ x: 0, opacity: 1 }}
          transition={{ duration: 0.3 }}
        >
          {/* Header del panel - Siempre visible */}
          <div className="flex items-center justify-between">
            <h3 className={`text-white font-semibold text-sm ${!showSettings && 'hidden'}`}>
              {t('camera.tools')}
            </h3>
            <button
              onClick={() => setShowSettings(!showSettings)}
              className="p-2 bg-white/10 rounded-lg hover:bg-white/20 transition-colors"
              title={showSettings ? 'Contraer' : 'Expandir'}
            >
              {isClient && <Settings className="w-4 h-4 text-white" />}
            </button>
          </div>

          {/* Herramientas - Solo visibles cuando expandido */}
          {showSettings && (
            <div className="mt-3">
              <div className="grid grid-cols-1 gap-2 mb-3">
            {CAMERA_TOOLS.map((tool) => (
              <button
                key={tool.id}
                onClick={() => onToggleTool(tool.id)}
                className={`p-3 rounded-xl border transition-all ${
                  activTools.includes(tool.id)
                    ? `${tool.color} border-white/30 shadow-lg`
                    : 'bg-white/10 border-white/20 hover:bg-white/20'
                }`}
              >
                <div className="flex items-center space-x-2">
                  {isClient && <tool.icon className="w-4 h-4 text-white" />}
                  <span className="text-white text-sm font-medium">{tool.name}</span>
                </div>
                <div className="text-xs text-white/70 mt-1">{tool.description}</div>
              </button>
            ))}
              </div>

              {/* Configuraciones */}
              <div className="bg-white/5 rounded-xl p-3 border-t border-white/10 mt-2">
                <div className="space-y-3">
                  <div>
                    <label className="text-white text-sm mb-1 block">
                      {t('camera.width')}: {guideLineWidth}cm
                    </label>
                    <input
                      type="range"
                      min="5"
                      max="50"
                      value={guideLineWidth}
                      onChange={(e) => setGuideLineWidth(parseInt(e.target.value))}
                      className="w-full h-2 bg-white/20 rounded-lg appearance-none cursor-pointer"
                    />
                  </div>
                </div>
              </div>
            </div>
          )}
        </motion.div>
      </div>
    </div>
  )
}