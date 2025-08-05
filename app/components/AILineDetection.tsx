'use client'

import { useEffect, useRef, useState } from 'react'
import { motion } from 'framer-motion'
import { Brain } from 'lucide-react'
import { useLanguage } from '../contexts/LanguageContext'

interface DetectedLine {
  id: string
  type: 'boundary' | 'goal' | 'penalty' | 'center' | 'corner'
  confidence: number
  points: { x: number; y: number }[]
  length?: number
  angle?: number
}

interface AILineDetectionProps {
  videoElement: HTMLVideoElement | null
  isActive: boolean
  onLineDetected: (line: DetectedLine) => void
  onConfidenceChange: (confidence: number) => void
}

export default function AILineDetection({
  videoElement,
  isActive,
  onLineDetected,
  onConfidenceChange
}: AILineDetectionProps) {
  const { t } = useLanguage()
  const canvasRef = useRef<HTMLCanvasElement>(null)
  const [isDetecting, setIsDetecting] = useState(false)
  const [detectedLines, setDetectedLines] = useState<DetectedLine[]>([])
  const [processingFPS, setProcessingFPS] = useState(0)
  const [confidence, setConfidence] = useState(0)

  // Simulación de detección de líneas con IA
  const detectLines = () => {
    if (!videoElement || !canvasRef.current || !isActive) return

    const canvas = canvasRef.current
    const ctx = canvas.getContext('2d')
    if (!ctx) return

    // Obtener frame del video
    canvas.width = videoElement.videoWidth
    canvas.height = videoElement.videoHeight
    ctx.drawImage(videoElement, 0, 0)

    // Simular procesamiento de IA
    const imageData = ctx.getImageData(0, 0, canvas.width, canvas.height)
    
    // Algoritmo simulado de detección de líneas
    const lines = simulateLineDetection(imageData, canvas.width, canvas.height)
    
    setDetectedLines(lines)
    
    // Calcular confianza promedio
    const avgConfidence = lines.length > 0 
      ? lines.reduce((sum, line) => sum + line.confidence, 0) / lines.length 
      : 0
    
    setConfidence(avgConfidence)
    onConfidenceChange(avgConfidence)

    // Notificar líneas detectadas
    lines.forEach(line => {
      if (line.confidence > 0.7) {
        onLineDetected(line)
      }
    })
  }

    // Simulación del algoritmo de detección de líneas
  const simulateLineDetection = (
    _imageData: ImageData,
    width: number,
    height: number
  ): DetectedLine[] => {
    const lines: DetectedLine[] = []
    
    // Simular detección de líneas horizontales (líneas de fondo/laterales)
    for (let y = height * 0.2; y < height * 0.8; y += height * 0.1) {
      if (Math.random() > 0.6) { // 40% probabilidad de detectar línea
        lines.push({
          id: `horizontal-${y}`,
          type: Math.random() > 0.5 ? 'boundary' : 'penalty',
          confidence: 0.6 + Math.random() * 0.4,
          points: [
            { x: width * 0.1, y },
            { x: width * 0.9, y }
          ],
          length: width * 0.8,
          angle: 0
        })
      }
    }

    // Simular detección de líneas verticales
    for (let x = width * 0.2; x < width * 0.8; x += width * 0.15) {
      if (Math.random() > 0.7) { // 30% probabilidad
        lines.push({
          id: `vertical-${x}`,
          type: Math.random() > 0.7 ? 'goal' : 'boundary',
          confidence: 0.5 + Math.random() * 0.5,
          points: [
            { x, y: height * 0.2 },
            { x, y: height * 0.8 }
          ],
          length: height * 0.6,
          angle: 90
        })
      }
    }

    // Detectar línea central (si está en el centro)
    if (Math.random() > 0.5) {
      lines.push({
        id: 'center-line',
        type: 'center',
        confidence: 0.8 + Math.random() * 0.2,
        points: [
          { x: width * 0.1, y: height * 0.5 },
          { x: width * 0.9, y: height * 0.5 }
        ],
        length: width * 0.8,
        angle: 0
      })
    }

    return lines
  }

  // Dibujar overlay de líneas detectadas
  const drawDetectionOverlay = () => {
    if (!canvasRef.current) return

    const canvas = canvasRef.current
    const ctx = canvas.getContext('2d')
    if (!ctx) return

    // Limpiar canvas
    ctx.clearRect(0, 0, canvas.width, canvas.height)

    // Dibujar líneas detectadas
    detectedLines.forEach(line => {
      const alpha = Math.min(line.confidence, 1)
      
      // Color según el tipo de línea
      let color = 'rgba(59, 130, 246, ' + alpha + ')' // azul por defecto
      switch (line.type) {
        case 'boundary':
          color = 'rgba(34, 197, 94, ' + alpha + ')' // verde
          break
        case 'goal':
          color = 'rgba(239, 68, 68, ' + alpha + ')' // rojo
          break
        case 'penalty':
          color = 'rgba(245, 158, 11, ' + alpha + ')' // amarillo
          break
        case 'center':
          color = 'rgba(147, 51, 234, ' + alpha + ')' // púrpura
          break
        case 'corner':
          color = 'rgba(236, 72, 153, ' + alpha + ')' // rosa
          break
      }

      ctx.strokeStyle = color
      ctx.lineWidth = 3
      ctx.lineCap = 'round'

      // Dibujar línea
      if (line.points.length >= 2 && line.points[0] && line.points[line.points.length - 1]) {
        ctx.beginPath()
        ctx.moveTo(line.points[0].x, line.points[0].y)
        for (let i = 1; i < line.points.length; i++) {
          const point = line.points[i]
          if (point) {
            ctx.lineTo(point.x, point.y)
          }
        }
        ctx.stroke()

        // Dibujar etiqueta de confianza
        const firstPoint = line.points[0]!
        const lastPoint = line.points[line.points.length - 1]!
        const midX = (firstPoint.x + lastPoint.x) / 2
        const midY = (firstPoint.y + lastPoint.y) / 2
        
        ctx.fillStyle = color
        ctx.font = '12px Arial'
        ctx.fillText(
          `${line.type.toUpperCase()} ${(line.confidence * 100).toFixed(0)}%`,
          midX - 30,
          midY - 10
        )
      }
    })
  }

  // Iniciar/detener detección
  useEffect(() => {
    if (!isActive) {
      setIsDetecting(false)
      setDetectedLines([])
      setConfidence(0)
      return
    }

    setIsDetecting(true)
    
    const interval = setInterval(() => {
      detectLines()
      drawDetectionOverlay()
      setProcessingFPS(prev => prev + 1)
    }, 200) // 5 FPS para simulación

    const fpsInterval = setInterval(() => {
      setProcessingFPS(0)
    }, 1000)

    return () => {
      clearInterval(interval)
      clearInterval(fpsInterval)
    }
  }, [isActive, videoElement])

  // Dibujar overlay cuando cambian las líneas
  useEffect(() => {
    drawDetectionOverlay()
  }, [detectedLines])

  if (!isActive) return null

  return (
    <div className="absolute inset-0 pointer-events-none">
      {/* Canvas para overlay de detección */}
      <canvas
        ref={canvasRef}
        className="absolute inset-0 w-full h-full"
        style={{ mixBlendMode: 'multiply' }}
      />

      {/* Panel de estado de IA */}
      <motion.div
        className="absolute top-4 right-4 bg-black/70 backdrop-blur-sm rounded-xl p-3 pointer-events-auto"
        initial={{ opacity: 0, x: 100 }}
        animate={{ opacity: 1, x: 0 }}
        transition={{ duration: 0.3 }}
      >
        <div className="flex items-center space-x-2 mb-2">
          <Brain className={`w-4 h-4 ${isDetecting ? 'text-purple-400 animate-pulse' : 'text-gray-400'}`} />
          <span className="text-white text-xs font-medium">
            {t('ai.detection.active')}
          </span>
        </div>

        <div className="space-y-1 text-xs">
          <div className="flex justify-between text-white/70">
            <span>{t('ai.confidence')}:</span>
            <span className={`font-medium ${confidence > 0.7 ? 'text-green-400' : confidence > 0.4 ? 'text-yellow-400' : 'text-red-400'}`}>
              {(confidence * 100).toFixed(0)}%
            </span>
          </div>
          
          <div className="flex justify-between text-white/70">
            <span>{t('ai.lines.detected')}:</span>
            <span className="text-blue-400 font-medium">{detectedLines.length}</span>
          </div>
          
          <div className="flex justify-between text-white/70">
            <span>FPS:</span>
            <span className="text-cyan-400 font-medium">{processingFPS}</span>
          </div>
        </div>

        {/* Barra de confianza */}
        <div className="mt-2">
          <div className="w-full h-1 bg-white/20 rounded-full overflow-hidden">
            <motion.div
              className={`h-full ${
                confidence > 0.7 ? 'bg-green-400' : 
                confidence > 0.4 ? 'bg-yellow-400' : 'bg-red-400'
              }`}
              style={{ width: `${confidence * 100}%` }}
              animate={{ width: `${confidence * 100}%` }}
              transition={{ duration: 0.3 }}
            />
          </div>
        </div>
      </motion.div>

      {/* Leyenda de colores */}
      <motion.div
        className="absolute bottom-4 left-4 bg-black/70 backdrop-blur-sm rounded-xl p-3 pointer-events-auto"
        initial={{ opacity: 0, y: 100 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.3, delay: 0.2 }}
      >
        <div className="text-white text-xs font-medium mb-2">
          {t('ai.legend')}
        </div>
        <div className="space-y-1 text-xs">
          <div className="flex items-center space-x-2">
            <div className="w-3 h-1 bg-green-400 rounded"></div>
            <span className="text-white/70">{t('ai.boundary.lines')}</span>
          </div>
          <div className="flex items-center space-x-2">
            <div className="w-3 h-1 bg-red-400 rounded"></div>
            <span className="text-white/70">{t('ai.goal.lines')}</span>
          </div>
          <div className="flex items-center space-x-2">
            <div className="w-3 h-1 bg-yellow-400 rounded"></div>
            <span className="text-white/70">{t('ai.penalty.lines')}</span>
          </div>
          <div className="flex items-center space-x-2">
            <div className="w-3 h-1 bg-purple-400 rounded"></div>
            <span className="text-white/70">{t('ai.center.line')}</span>
          </div>
        </div>
      </motion.div>
    </div>
  )
}