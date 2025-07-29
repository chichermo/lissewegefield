'use client'

import {
    Circle,
    Download,
    Eye,
    EyeOff,
    Map,
    MousePointer,
    Navigation,
    RotateCcw,
    Ruler,
    Square,
    Target,
    ZoomIn,
    ZoomOut
} from 'lucide-react'
import React, { useEffect, useRef, useState } from 'react'

interface Punto {
  x: number
  y: number
}

interface Linea {
  id: string
  puntos: Punto[]
  tipo: 'linea' | 'circulo' | 'rectangulo'
  color: string
  grosor: number
  completada: boolean
}

interface MapaVisualProps {}

const MapaVisual: React.FC<MapaVisualProps> = () => {
  const [gpsActivo, setGpsActivo] = useState(false)
  const [currentPosition, setCurrentPosition] = useState<{ lat: number; lng: number } | null>(null)
  const [zoom, setZoom] = useState(15)
  const [mostrarMapa, setMostrarMapa] = useState(true)
  const [herramientaActiva, setHerramientaActiva] = useState<'seleccion' | 'linea' | 'circulo' | 'rectangulo'>('seleccion')
  const [lineas, setLineas] = useState<Linea[]>([])
  const [lineaActual, setLineaActual] = useState<Linea | null>(null)
  const [isDrawing, setIsDrawing] = useState(false)
  const [mensaje, setMensaje] = useState('')
  const [estadoGPS, setEstadoGPS] = useState('inactivo')
  const [precisionGPS, setPrecisionGPS] = useState(0)
  const [distanciaTotal, setDistanciaTotal] = useState(0)
  const [areaTotal, setAreaTotal] = useState(0)
  const [mostrarGuia, setMostrarGuia] = useState(true)
  const [mostrarMediciones, setMostrarMediciones] = useState(true)
  const [mostrarElementosFIFA, setMostrarElementosFIFA] = useState(true)



  const canvasRef = useRef<HTMLCanvasElement>(null)

  // Elementos FIFA predefinidos
  const elementosFIFA = [
    { id: 'linea-fondo-norte', nombre: 'Línea de Fondo Norte', tipo: 'linea' as const, color: '#3B82F6', x: 10, y: 10, ancho: 80, alto: 2 },
    { id: 'linea-lateral-este', nombre: 'Línea Lateral Este', tipo: 'linea' as const, color: '#10B981', x: 90, y: 10, ancho: 2, alto: 80 },
    { id: 'linea-fondo-sur', nombre: 'Línea de Fondo Sur', tipo: 'linea' as const, color: '#EF4444', x: 10, y: 90, ancho: 80, alto: 2 },
    { id: 'linea-lateral-oeste', nombre: 'Línea Lateral Oeste', tipo: 'linea' as const, color: '#F59E0B', x: 10, y: 10, ancho: 2, alto: 80 },
    { id: 'linea-central', nombre: 'Línea Central', tipo: 'linea' as const, color: '#8B5CF6', x: 50, y: 10, ancho: 2, alto: 80 },
    { id: 'circulo-central', nombre: 'Círculo Central', tipo: 'circulo' as const, color: '#EC4899', x: 50, y: 50, radio: 9.15 },
    { id: 'area-penal-norte', nombre: 'Área Penal Norte', tipo: 'rectangulo' as const, color: '#6366F1', x: 35, y: 10, ancho: 30, alto: 16.5 },
    { id: 'area-penal-sur', nombre: 'Área Penal Sur', tipo: 'rectangulo' as const, color: '#F97316', x: 35, y: 73.5, ancho: 30, alto: 16.5 }
  ]

  // Obtener posición GPS
  const obtenerPosicionGPS = () => {
    if (!navigator.geolocation) {
      setMensaje('Geolocalización no soportada en este navegador.')
      return
    }

    setEstadoGPS('obteniendo')
    setMensaje('Conectando al GPS de alta precisión para visualización profesional...')

    navigator.geolocation.getCurrentPosition(
      (position) => {
        setCurrentPosition({
          lat: position.coords.latitude,
          lng: position.coords.longitude
        })
        setGpsActivo(true)
        setEstadoGPS('activo')
        setPrecisionGPS(position.coords.accuracy || 0)
        setMensaje(`✅ GPS de alta precisión activo - Precisión: ${position.coords.accuracy?.toFixed(1)}m`)

        // Simular datos ambientales
      },
      (error) => {
        setEstadoGPS('error')
        setMensaje(`❌ Error GPS: ${error.message}`)
      },
      {
        enableHighAccuracy: true,
        timeout: 15000,
        maximumAge: 0
      }
    )
  }

  // Activar GPS
  const activarGPS = () => {
    obtenerPosicionGPS()
  }

  // Desactivar GPS
  const desactivarGPS = () => {
    setGpsActivo(false)
    setEstadoGPS('inactivo')
    setMensaje('GPS desactivado')
  }



  // Cambiar zoom
  const cambiarZoom = (delta: number) => {
    setZoom((prev) => Math.max(10, Math.min(20, prev + delta)))
  }

  // Centrar en GPS
  const centrarEnGPS = () => {
    if (currentPosition) {
      setMensaje('Mapa centrado en tu posición.')
    } else {
      setMensaje('No hay posición GPS disponible.')
    }
  }

  // Iniciar dibujo
  const iniciarDibujo = (tipo: 'linea' | 'circulo' | 'rectangulo') => {
    setHerramientaActiva(tipo)
    setIsDrawing(true)
    setMensaje(`Herramienta ${tipo} activada`)
  }

  // Limpiar mapa
  const limpiarMapa = () => {
    setLineas([])
    setLineaActual(null)
    setMensaje('Mapa limpiado')
  }

  // Exportar mapa
  const exportarMapa = () => {
    const canvas = canvasRef.current
    if (canvas) {
      const link = document.createElement('a')
      link.download = 'mapa-cancha.png'
      link.href = canvas.toDataURL()
      link.click()
      setMensaje('Mapa exportado')
    }
  }

  // Calcular distancia entre dos puntos
  const calcularDistancia = (punto1: Punto, punto2: Punto): number => {
    const dx = punto2.x - punto1.x
    const dy = punto2.y - punto1.y
    return Math.sqrt(dx * dx + dy * dy)
  }

  // Calcular área de un polígono
  const calcularArea = (puntos: Punto[]): number => {
    if (puntos.length < 3) return 0

    let area = 0
    for (let i = 0; i < puntos.length; i++) {
      const j = (i + 1) % puntos.length
      const pi = puntos[i]
      const pj = puntos[j]
      if (pi && pj) {
        area += pi.x * pj.y
        area -= pj.x * pi.y
      }
    }
    return Math.abs(area) / 2
  }

  // Actualizar estadísticas
  useEffect(() => {
    let distancia = 0
    let area = 0

    lineas.forEach((linea) => {
      if (linea.puntos.length > 1) {
        for (let i = 1; i < linea.puntos.length; i++) {
          const p1 = linea.puntos[i-1]
          const p2 = linea.puntos[i]
          if (p1 && p2) {
            distancia += calcularDistancia(p1, p2)
          }
        }
        if (linea.tipo === 'rectangulo' || linea.tipo === 'circulo') {
          area += calcularArea(linea.puntos)
        }
      }
    })

    setDistanciaTotal(distancia)
    setAreaTotal(area)
  }, [lineas])

  // Dibujar en el canvas
  useEffect(() => {
    const canvas = canvasRef.current
    if (!canvas) return

    const ctx = canvas.getContext('2d')
    if (!ctx) return

    // Limpiar canvas
    ctx.clearRect(0, 0, canvas.width, canvas.height)

    // Dibujar fondo de cancha
    ctx.fillStyle = '#166534'
    ctx.fillRect(0, 0, canvas.width, canvas.height)

    // Dibujar líneas de la cancha
    ctx.strokeStyle = '#ffffff'
    ctx.lineWidth = 2
    ctx.setLineDash([])

    // Líneas principales
    ctx.beginPath()
    ctx.rect(50, 50, canvas.width - 100, canvas.height - 100)
    ctx.stroke()

    // Línea central
    ctx.beginPath()
    ctx.moveTo(canvas.width / 2, 50)
    ctx.lineTo(canvas.width / 2, canvas.height - 50)
    ctx.stroke()

    // Círculo central
    ctx.beginPath()
    ctx.arc(canvas.width / 2, canvas.height / 2, 30, 0, 2 * Math.PI)
    ctx.stroke()

    // Áreas penales
    ctx.beginPath()
    ctx.rect(50, 50, 100, 200)
    ctx.stroke()

    ctx.beginPath()
    ctx.rect(canvas.width - 150, 50, 100, 200)
    ctx.stroke()

    // Dibujar elementos FIFA
    if (mostrarElementosFIFA) {
      elementosFIFA.forEach((elemento) => {
        ctx.strokeStyle = elemento.color
        ctx.lineWidth = 3

        if (elemento.tipo === 'linea') {
          ctx.beginPath()
          ctx.moveTo(elemento.x * canvas.width / 100, elemento.y * canvas.height / 100)
          ctx.lineTo((elemento.x + (elemento.ancho || 0)) * canvas.width / 100, (elemento.y + (elemento.alto || 0)) * canvas.height / 100)
          ctx.stroke()
        } else if (elemento.tipo === 'circulo') {
          ctx.beginPath()
          ctx.arc(elemento.x * canvas.width / 100, elemento.y * canvas.height / 100, (elemento.radio || 0) * canvas.width / 100, 0, 2 * Math.PI)
          ctx.stroke()
        } else if (elemento.tipo === 'rectangulo') {
          ctx.beginPath()
          ctx.rect(elemento.x * canvas.width / 100, elemento.y * canvas.height / 100, (elemento.ancho || 0) * canvas.width / 100, (elemento.alto || 0) * canvas.height / 100)
          ctx.stroke()
        }
      })
    }

    // Dibujar líneas del usuario
    lineas.forEach((linea) => {
      ctx.strokeStyle = linea.color
      ctx.lineWidth = linea.grosor
      ctx.setLineDash(linea.completada ? [] : [5, 5])

      if (linea.tipo === 'linea' && linea.puntos.length > 1) {
        ctx.beginPath()
        const p0 = linea.puntos[0]
        if (p0) {
          ctx.moveTo(p0.x, p0.y)
          linea.puntos.forEach((punto) => {
            ctx.lineTo(punto.x, punto.y)
          })
        }
        ctx.stroke()
      } else if (linea.tipo === 'circulo' && linea.puntos.length >= 2) {
        const centro = linea.puntos[0]
        const borde = linea.puntos[1]
        if (centro && borde) {
          const radio = calcularDistancia(centro, borde)
          ctx.beginPath()
          ctx.arc(centro.x, centro.y, radio, 0, 2 * Math.PI)
          ctx.stroke()
        }
      } else if (linea.tipo === 'rectangulo' && linea.puntos.length >= 2) {
        const inicio = linea.puntos[0]
        const fin = linea.puntos[1]
        if (inicio && fin) {
          ctx.beginPath()
          ctx.rect(inicio.x, inicio.y, fin.x - inicio.x, fin.y - inicio.y)
          ctx.stroke()
        }
      }
    })

    // Dibujar posición GPS
    if (currentPosition && gpsActivo) {
      ctx.fillStyle = '#ef4444'
      ctx.beginPath()
      ctx.arc(canvas.width / 2, canvas.height / 2, 8, 0, 2 * Math.PI)
      ctx.fill()

      ctx.strokeStyle = '#ef4444'
      ctx.lineWidth = 2
      ctx.setLineDash([5, 5])
      ctx.beginPath()
      ctx.arc(canvas.width / 2, canvas.height / 2, 20, 0, 2 * Math.PI)
      ctx.stroke()
    }
  }, [lineas, currentPosition, gpsActivo, mostrarElementosFIFA, zoom])

  // Eventos del mouse para dibujo
  const handleMouseDown = (e: React.MouseEvent<HTMLCanvasElement>) => {
    if (herramientaActiva === 'seleccion') return

    const canvas = canvasRef.current
    if (!canvas) return

    const rect = canvas.getBoundingClientRect()
    const x = e.clientX - rect.left
    const y = e.clientY - rect.top

    const nuevaLinea: Linea = {
      id: Date.now().toString(),
      puntos: [{ x, y }],
      tipo: herramientaActiva,
      color: herramientaActiva === 'linea' ? '#3B82F6' :
             herramientaActiva === 'circulo' ? '#EC4899' : '#10B981',
      grosor: 3,
      completada: false
    }

    setLineaActual(nuevaLinea)
    setIsDrawing(true)
  }

  const handleMouseMove = (e: React.MouseEvent<HTMLCanvasElement>) => {
    if (!isDrawing || !lineaActual) return

    const canvas = canvasRef.current
    if (!canvas) return

    const rect = canvas.getBoundingClientRect()
    const x = e.clientX - rect.left
    const y = e.clientY - rect.top

    setLineaActual({
      ...lineaActual,
      puntos: [...lineaActual.puntos, { x, y }]
    })
  }

  const handleMouseUp = () => {
    if (lineaActual) {
      setLineas((prev) => [...prev, lineaActual])
      setLineaActual(null)
    }
    setIsDrawing(false)
  }

  return (
    <div className="space-y-6">
      {/* Header con controles */}
      <div className="futbol-card p-6">
        <div className="flex items-center justify-between mb-6">
          <div className="flex items-center space-x-4">
            <div className="relative">
              <div className="w-12 h-12 bg-gradient-to-br from-blue-500 to-purple-600 rounded-2xl flex items-center justify-center">
                <Map className="w-6 h-6 text-white" />
              </div>
              <div className={`absolute -top-1 -right-1 w-4 h-4 rounded-full ${gpsActivo ? 'bg-green-400' : 'bg-gray-400'}`}></div>
            </div>
            <div>
              <h2 className="text-2xl font-bold text-white">Mapa Visual</h2>
              <p className="text-white/70">Herramientas de dibujo y medición para canchas</p>
            </div>
          </div>
          <div className="flex items-center space-x-4">
            <div className="gps-indicator">
              <Navigation className="w-4 h-4" />
              <span>{estadoGPS}</span>
            </div>
            <div className="gps-indicator">
              <Target className="w-4 h-4" />
              <span>{precisionGPS.toFixed(1)}m</span>
            </div>
            <div className="gps-indicator">
              <Ruler className="w-4 h-4" />
              <span>{distanciaTotal.toFixed(1)}m</span>
            </div>
          </div>
        </div>

        {/* Controles principales */}
        <div className="flex flex-wrap gap-4 mb-6">
          <button
            onClick={activarGPS}
            className="futbol-btn futbol-btn-primary flex items-center space-x-2"
          >
            <Navigation className="w-5 h-5" />
            <span>Activar GPS</span>
          </button>
          <button
            onClick={desactivarGPS}
            disabled={!gpsActivo}
            className="futbol-btn futbol-btn-warning flex items-center space-x-2"
          >
            <Target className="w-5 h-5" />
            <span>Desactivar GPS</span>
          </button>
          <button
            onClick={centrarEnGPS}
            className="futbol-btn futbol-btn-secondary flex items-center space-x-2"
          >
            <Navigation className="w-5 h-5" />
            <span>Centrar GPS</span>
          </button>
          <button
            onClick={() => setMostrarMapa(!mostrarMapa)}
            className="futbol-btn futbol-btn-success flex items-center space-x-2"
          >
            {mostrarMapa ? <EyeOff className="w-5 h-5" /> : <Eye className="w-5 h-5" />}
            <span>{mostrarMapa ? 'Ocultar' : 'Mostrar'} Mapa</span>
          </button>
        </div>

        {/* Herramientas de dibujo */}
        <div className="flex flex-wrap gap-4 mb-6">
          <button
            onClick={() => setHerramientaActiva('seleccion')}
            className={`futbol-btn ${herramientaActiva === 'seleccion' ? 'futbol-btn-primary' : 'futbol-btn-secondary'} flex items-center space-x-2`}
          >
            <MousePointer className="w-5 h-5" />
            <span>Selección</span>
          </button>
          <button
            onClick={() => iniciarDibujo('linea')}
            className={`futbol-btn ${herramientaActiva === 'linea' ? 'futbol-btn-primary' : 'futbol-btn-secondary'} flex items-center space-x-2`}
          >
            <Ruler className="w-5 h-5" />
            <span>Línea</span>
          </button>
          <button
            onClick={() => iniciarDibujo('circulo')}
            className={`futbol-btn ${herramientaActiva === 'circulo' ? 'futbol-btn-primary' : 'futbol-btn-secondary'} flex items-center space-x-2`}
          >
            <Circle className="w-5 h-5" />
            <span>Círculo</span>
          </button>
          <button
            onClick={() => iniciarDibujo('rectangulo')}
            className={`futbol-btn ${herramientaActiva === 'rectangulo' ? 'futbol-btn-primary' : 'futbol-btn-secondary'} flex items-center space-x-2`}
          >
            <Square className="w-5 h-5" />
            <span>Rectángulo</span>
          </button>
        </div>

        {/* Controles de zoom */}
        <div className="flex items-center space-x-4 mb-6">
          <button
            onClick={() => cambiarZoom(-1)}
            className="futbol-btn futbol-btn-secondary"
          >
            <ZoomOut className="w-5 h-5" />
          </button>
          <span className="text-white font-semibold">{zoom}x</span>
          <button
            onClick={() => cambiarZoom(1)}
            className="futbol-btn futbol-btn-secondary"
          >
            <ZoomIn className="w-5 h-5" />
          </button>
          <button
            onClick={limpiarMapa}
            className="futbol-btn futbol-btn-warning flex items-center space-x-2"
          >
            <RotateCcw className="w-5 h-5" />
            <span>Limpiar</span>
          </button>
          <button
            onClick={exportarMapa}
            className="futbol-btn futbol-btn-success flex items-center space-x-2"
          >
            <Download className="w-5 h-5" />
            <span>Exportar</span>
          </button>
        </div>

        {/* Controles de visualización */}
        <div className="flex items-center space-x-4 mb-6">
          <label className="flex items-center space-x-2 text-white">
            <input
              type="checkbox"
              checked={mostrarGuia}
              onChange={(e) => setMostrarGuia(e.target.checked)}
              className="rounded"
            />
            <span>Mostrar Guía</span>
          </label>
          <label className="flex items-center space-x-2 text-white">
            <input
              type="checkbox"
              checked={mostrarMediciones}
              onChange={(e) => setMostrarMediciones(e.target.checked)}
              className="rounded"
            />
            <span>Mostrar Mediciones</span>
          </label>
          <label className="flex items-center space-x-2 text-white">
            <input
              type="checkbox"
              checked={mostrarElementosFIFA}
              onChange={(e) => setMostrarElementosFIFA(e.target.checked)}
              className="rounded"
            />
            <span>Elementos FIFA</span>
          </label>
        </div>
      </div>

      {/* Mapa de la cancha */}
      {mostrarMapa && (
        <div className="futbol-card p-6">
          <h3 className="text-xl font-bold text-white mb-4">Mapa de la Cancha</h3>
          <div className="relative w-full h-96 bg-gradient-to-br from-green-800 to-green-600 rounded-lg overflow-hidden border-2 border-white/20">
            <canvas
              ref={canvasRef}
              className="w-full h-full"
              width={800}
              height={600}
              onMouseDown={handleMouseDown}
              onMouseMove={handleMouseMove}
              onMouseUp={handleMouseUp}
            />

            {/* Indicadores de posición */}
            {currentPosition && (
              <div className="absolute top-4 left-4 text-xs text-white bg-black/50 px-2 py-1 rounded">
                GPS: {currentPosition.lat.toFixed(6)}, {currentPosition.lng.toFixed(6)}
              </div>
            )}

            {/* Estadísticas del mapa */}
            <div className="absolute top-4 right-4 text-xs text-white bg-black/50 px-2 py-1 rounded">
              {lineas.length} elementos
            </div>

            {/* Leyenda */}
            <div className="absolute bottom-4 left-4 text-xs text-white bg-black/50 px-2 py-1 rounded">
              <div className="flex items-center space-x-2">
                <div className="w-3 h-3 bg-blue-500 rounded"></div>
                <span>Líneas</span>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* Estadísticas */}
      <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
        <div className="futbol-stat-card">
          <div className="flex items-center justify-center mb-2">
            <Ruler className="w-6 h-6 text-blue-400" />
          </div>
          <div className="text-2xl font-bold text-white">{distanciaTotal.toFixed(1)}m</div>
          <div className="text-sm text-white/60">Distancia Total</div>
        </div>
        <div className="futbol-stat-card">
          <div className="flex items-center justify-center mb-2">
            <Square className="w-6 h-6 text-green-400" />
          </div>
          <div className="text-2xl font-bold text-white">{areaTotal.toFixed(1)}m²</div>
          <div className="text-sm text-white/60">Área Total</div>
        </div>
        <div className="futbol-stat-card">
          <div className="flex items-center justify-center mb-2">
            <Circle className="w-6 h-6 text-purple-400" />
          </div>
          <div className="text-2xl font-bold text-white">{lineas.length}</div>
          <div className="text-sm text-white/60">Elementos</div>
        </div>
        <div className="futbol-stat-card">
          <div className="flex items-center justify-center mb-2">
            <Target className="w-6 h-6 text-orange-400" />
          </div>
          <div className="text-2xl font-bold text-white">{precisionGPS.toFixed(1)}m</div>
          <div className="text-sm text-white/60">Precisión GPS</div>
        </div>
      </div>

      {/* Elementos FIFA */}
      {mostrarElementosFIFA && (
        <div className="space-y-4">
          <h3 className="text-xl font-bold text-white mb-4">Elementos FIFA</h3>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {elementosFIFA.map((elemento) => (
              <div key={elemento.id} className="futbol-card p-4">
                <div className="flex items-center justify-between mb-3">
                  <div className="flex items-center space-x-3">
                    <div className="w-3 h-3 rounded-full bg-gray-400"></div>
                    <span className="font-semibold text-white">{elemento.nombre}</span>
                  </div>
                  <div className="flex items-center space-x-2">
                    <div
                      className="w-6 h-6 rounded-full flex items-center justify-center"
                      style={{ backgroundColor: elemento.color }}
                    >
                      <span className="text-white text-xs font-bold">
                        {elemento.tipo === 'linea' ? 'L' : elemento.tipo === 'circulo' ? 'C' : 'R'}
                      </span>
                    </div>
                    <div className="w-5 h-5 border-2 border-white/30 rounded-full"></div>
                  </div>
                </div>
                <div className="progress-bar mb-3">
                  <div
                    className="progress-fill"
                    style={{
                      width: '0px',
                      background: `linear-gradient(to right, ${elemento.color}, ${elemento.color}dd)`
                    }}
                  ></div>
                </div>
                <div className="flex items-center justify-between">
                  <span className="text-sm text-white/60">0.0% completado</span>
                  <button className="text-sm px-3 py-1 rounded-lg futbol-btn futbol-btn-success">
                    Completar
                  </button>
                </div>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* Mensaje de estado */}
      {mensaje && (
        <div className="futbol-card p-4">
          <p className="text-white">{mensaje}</p>
        </div>
      )}
    </div>
  )
}

export default MapaVisual
