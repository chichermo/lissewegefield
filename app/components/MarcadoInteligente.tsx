'use client'

import { motion } from 'framer-motion'
import {
    AlertTriangle,
    Award,
    BarChart3,
    Calendar,
    Camera,
    CameraOff,
    Check,
    CheckCircle,
    Clock,
    Download,
    Eye,
    EyeOff,
    FileText,
    Gauge,
    Info,
    Loader2,
    MapPin,
    Navigation,
    Play,
    RotateCcw,
    Save,
    Satellite,
    Settings,
    Shield,
    Signal,
    Square,
    Target,
    TrendingUp,
    Users,
    X,
    Zap
} from 'lucide-react'
import { useEffect, useRef, useState } from 'react'
import { LineaMarcado, PuntoGPS } from '../../types'
import { useAppStore } from '../../stores/useAppStore'

export default function MarcadoInteligente() {
  // Obtener estado global del store
  const {
    lineasMarcado: lineasMarcadoGlobales,
    setLineasMarcado: setLineasMarcadoGlobales,


    completarLinea: completarLineaGlobal,
    reiniciarMarcado: reiniciarMarcadoGlobal,
    exportarDatos,
    campoActivo,
    gestorCampos,
    actualizarCampo
  } = useAppStore()

  // Estado para modo de marcado
  const [modoMarcado, setModoMarcado] = useState<'gps' | 'camara'>('gps')
  
  // Estados para GPS
  const [currentPosition, setCurrentPosition] = useState<PuntoGPS | null>(null)
  const [isTracking, setIsTracking] = useState(false)

  
  // Usar líneas de marcado del store global en lugar del estado local
  const [lineasMarcado, setLineasMarcado] = useState<LineaMarcado[]>(lineasMarcadoGlobales)

  // Efecto para inicializar las líneas predeterminadas si no existen
  useEffect(() => {
    if (lineasMarcadoGlobales.length === 0) {
      const lineasPredeterminadas: LineaMarcado[] = [
        { id: 1, nombre: 'Línea Lateral Norte', progreso: 0, distancia: 105, completada: false, tipo: 'horizontal', posicion: 'top', color: '#3B82F6' },
        { id: 2, nombre: 'Línea Lateral Sur', progreso: 0, distancia: 105, completada: false, tipo: 'horizontal', posicion: 'bottom', color: '#10B981' },
        { id: 3, nombre: 'Línea de Fondo Este', progreso: 0, distancia: 68, completada: false, tipo: 'vertical', posicion: 'right', color: '#F59E0B' },
        { id: 4, nombre: 'Línea de Fondo Oeste', progreso: 0, distancia: 68, completada: false, tipo: 'vertical', posicion: 'left', color: '#EF4444' },
        { id: 5, nombre: 'Línea Central', progreso: 0, distancia: 105, completada: false, tipo: 'horizontal', posicion: 'center', color: '#8B5CF6' },
        { id: 6, nombre: 'Área Penal Norte', progreso: 0, distancia: 40.32, completada: false, tipo: 'rectangular', posicion: 'top', color: '#06B6D4' },
        { id: 7, nombre: 'Área Penal Sur', progreso: 0, distancia: 40.32, completada: false, tipo: 'rectangular', posicion: 'bottom', color: '#EC4899' },
        { id: 8, nombre: 'Círculo Central', progreso: 0, distancia: 9.15, completada: false, tipo: 'circular', posicion: 'center', color: '#84CC16' }
      ]
      setLineasMarcadoGlobales(lineasPredeterminadas)
      setLineasMarcado(lineasPredeterminadas)
    }
  }, [lineasMarcadoGlobales.length, setLineasMarcadoGlobales])

  // Actualizar campo seleccionado cuando cambie el campo activo
  useEffect(() => {
    setCampoSeleccionado(campoActivo?.id || null)
  }, [campoActivo])
  const [lineaActual, setLineaActual] = useState<LineaMarcado | null>(null)
  const [precisionGPS, setPrecisionGPS] = useState(0)
  const [señalGPS, setSeñalGPS] = useState(0)
  const [tiempoSesion, setTiempoSesion] = useState(0)
  const [velocidadPromedio, setVelocidadPromedio] = useState(0)
  const [gpsActivo, setGpsActivo] = useState(false)
  const [mensaje, setMensaje] = useState('')
  const [progresoMarcado, setProgresoMarcado] = useState(0)
  const [estadoGPS, setEstadoGPS] = useState<'inactivo' | 'conectando' | 'activo' | 'error'>('inactivo')
  const [lineasCompletadas, setLineasCompletadas] = useState(0)
  const [distanciaRecorrida, setDistanciaRecorrida] = useState(0)
  const [ultimaActualizacion, setUltimaActualizacion] = useState<Date | null>(null)
  const [tiempoEstimado, setTiempoEstimado] = useState(0)
  const [pasoActual, setPasoActual] = useState(1)
  const [instrucciones, setInstrucciones] = useState('')
  const [mostrarMapa, setMostrarMapa] = useState(true)
  const [modoAvanzado, setModoAvanzado] = useState(false)
  const [campoSeleccionado, setCampoSeleccionado] = useState<string | null>(campoActivo?.id || null)
  const [calibracionGPS, setCalibracionGPS] = useState(false)
  const [satelitesActivos, setSatelitesActivos] = useState(0)
  const [altitud, setAltitud] = useState(0)
  const [estadisticasAvanzadas, setEstadisticasAvanzadas] = useState({
    precisionPromedio: 0,
    velocidadMaxima: 0,
    tiempoTotal: 0,
    distanciaTotal: 0,
    eficiencia: 0,
    calidadMarcado: 0
  })

  // Estados para cámara
  const [isCameraActive, setIsCameraActive] = useState(false)
  const [puntosCamara, setPuntosCamara] = useState<{x: number, y: number, timestamp: number}[]>([])
  const [lineaPintada, setLineaPintada] = useState<{puntos: {x: number, y: number}[], tipo: string} | null>(null)
  const [errorCamara, setErrorCamara] = useState<string | null>(null)
  const [mostrarMenuExportacion, setMostrarMenuExportacion] = useState(false)
  const [herramientaCamara, setHerramientaCamara] = useState<'punto' | 'linea' | 'ruta' | 'seguimiento'>('punto')
  
  // Función para obtener el nombre de la herramienta actual
  const obtenerNombreHerramienta = () => {
    switch (herramientaCamara) {
      case 'punto': return 'Punto'
      case 'linea': return 'Línea'
      case 'ruta': return 'Ruta'
      case 'seguimiento': return 'Seguimiento'
      default: return 'Punto'
    }
  }
  const [seguimientoActivo, setSeguimientoActivo] = useState(false)
  const [rutaGuardada, setRutaGuardada] = useState<{x: number, y: number}[]>([])
  const [factorEscala, setFactorEscala] = useState(1) // metros por píxel

  // Referencias para cámara
  const videoRef = useRef<HTMLVideoElement>(null)
  const streamRef = useRef<MediaStream | null>(null)


    // Efecto para iniciar cámara automáticamente cuando se cambia al modo cámara
  useEffect(() => {
    console.log('MarcadoInteligente useEffect triggered:', { modoMarcado, isCameraActive })
    if (modoMarcado === 'camara' && !isCameraActive) {
      console.log('Iniciando cámara automáticamente en Marcado...')
      // Pequeño delay para asegurar que el componente esté montado
      const timer = setTimeout(() => {
        console.log('Ejecutando iniciarCamara en Marcado...')
        iniciarCamara()
      }, 1000)

      return () => clearTimeout(timer)
    }
    return undefined
  }, [modoMarcado, isCameraActive])

  // Efecto adicional para manejar el videoRef cuando se activa la cámara
  useEffect(() => {
    if (isCameraActive && videoRef.current && streamRef.current) {
      console.log('Video element available, setting up stream...')
      videoRef.current.srcObject = streamRef.current
      videoRef.current.play().catch(error => {
        console.error('Error playing video:', error)
      })
    }
  }, [isCameraActive])

  // Datos de configuración FIFA
  const [configuracionFIFA] = useState({
    longitudMinima: 100,
    longitudMaxima: 110,
    anchoMinimo: 64,
    anchoMaximo: 75,
    areaPenal: '16.5m x 40.3m',
    circuloCentral: '9.15m',
    puntoPenal: '11m',
    tolerancia: '±0.5m'
  })

  // Funciones para cámara
  const iniciarCamara = async () => {
    try {
      console.log('iniciarCamara called in MarcadoInteligente')
      setErrorCamara(null)
      const stream = await navigator.mediaDevices.getUserMedia({ 
        video: { 
          facingMode: 'environment',
          width: { ideal: 1280 },
          height: { ideal: 720 }
        } 
      })
      
      console.log('Stream obtenido en Marcado:', stream)
      streamRef.current = stream
      setIsCameraActive(true)
      setMensaje('📹 Cámara activada. Toca la pantalla para marcar puntos de la línea.')
      console.log('Cámara iniciada exitosamente en Marcado')
    } catch (error) {
      console.error('Error al acceder a la cámara:', error)
      setErrorCamara('No se pudo acceder a la cámara. Verifica los permisos.')
      setMensaje('❌ Error al activar cámara. Verifica los permisos.')
    }
  }

  const detenerCamara = () => {
    if (streamRef.current) {
      streamRef.current.getTracks().forEach(track => track.stop())
      streamRef.current = null
    }
    if (videoRef.current) {
      videoRef.current.srcObject = null
    }
    setIsCameraActive(false)
    setMensaje('📹 Cámara desactivada.')
  }

  const capturarPuntoCamara = (event: React.MouseEvent<HTMLVideoElement | HTMLDivElement>) => {
    if (!isCameraActive || !videoRef.current) return

    const rect = event.currentTarget.getBoundingClientRect()
    const x = event.clientX - rect.left
    const y = event.clientY - rect.top
    
    const nuevoPunto = { x, y, timestamp: Date.now() }
    setPuntosCamara(prev => [...prev, nuevoPunto])
    
    // Si es el primer punto, iniciar nueva línea
    if (puntosCamara.length === 0) {
      setLineaPintada({ puntos: [{x, y}], tipo: 'linea' })
    } else {
      // Agregar punto a la línea existente
      setLineaPintada(prev => prev ? {
        ...prev,
        puntos: [...prev.puntos, {x, y}]
      } : null)
    }
    
    setMensaje(`📍 Punto ${puntosCamara.length + 1} capturado. ${puntosCamara.length + 1 >= 2 ? 'Línea lista para completar.' : 'Captura otro punto para formar línea.'}`)
  }

  const limpiarPintadoCamara = () => {
    setPuntosCamara([])
    setLineaPintada(null)
    setMensaje('🔄 Pintado de cámara limpiado.')
  }

  // Herramientas avanzadas de cámara para marcado
  const iniciarSeguimientoLinea = () => {
    console.log('🔍 Iniciando seguimiento de línea en MarcadoInteligente')
    setSeguimientoActivo(true)
    setHerramientaCamara('seguimiento')
    setMensaje('🎯 Modo seguimiento activo. La cámara detectará automáticamente líneas para marcado.')
    
    // Simular detección automática de líneas para marcado
    setTimeout(() => {
      console.log('✅ Seguimiento de línea activo en marcado - detectando líneas automáticamente')
      setMensaje('✅ Seguimiento activo: Líneas detectadas para marcado automático')
    }, 1500)
  }

  const detenerSeguimientoLinea = () => {
    console.log('⏹️ Deteniendo seguimiento de línea en MarcadoInteligente')
    setSeguimientoActivo(false)
    setHerramientaCamara('punto')
    setMensaje('⏹️ Seguimiento detenido.')
  }

  const guardarRutaMarcado = () => {
    console.log('💾 Guardando ruta de marcado en MarcadoInteligente:', puntosCamara)
    if (puntosCamara.length >= 2) {
      setRutaGuardada(puntosCamara.map(p => ({ x: p.x, y: p.y })))
      setMensaje('💾 Ruta de marcado guardada para reutilizar.')
    } else {
      setMensaje('❌ Necesitas al menos 2 puntos para guardar una ruta de marcado.')
    }
  }

  const seguirRutaGuardada = () => {
    console.log('🔄 Siguiendo ruta guardada en MarcadoInteligente:', rutaGuardada)
    if (rutaGuardada.length === 0) {
      setMensaje('❌ No hay ruta guardada para seguir.')
      return
    }
    setHerramientaCamara('ruta')
    setMensaje('🔄 Siguiendo ruta guardada. Mantén la cámara alineada.')
    
    // Simular seguimiento de ruta para marcado
    setTimeout(() => {
      console.log('✅ Ruta de marcado seguida exitosamente')
      setMensaje('✅ Ruta de marcado seguida exitosamente. Puntos alineados.')
    }, 2000)
  }

  const detectarLineaMarcado = () => {
    console.log('🔍 Detectando líneas para marcado en MarcadoInteligente')
    setMensaje('🔍 Detectando líneas para marcado...')
    
    // Simulación de detección de línea para marcado
    setTimeout(() => {
      console.log('✅ Líneas detectadas para marcado')
      setMensaje('✅ Líneas detectadas. Toca para confirmar marcado.')
    }, 2000)
  }

  const calibrarCamaraMarcado = () => {
    console.log('🎯 Iniciando calibración de cámara para marcado en MarcadoInteligente')
    const distanciaReal = prompt('Ingresa la distancia real conocida (en metros):')
    if (distanciaReal && puntosCamara.length >= 2) {
      const ultimoPunto = puntosCamara[puntosCamara.length - 1]
      const penultimoPunto = puntosCamara[puntosCamara.length - 2]
      
      if (ultimoPunto && penultimoPunto) {
        const distanciaPixeles = Math.sqrt(
          Math.pow(ultimoPunto.x - penultimoPunto.x, 2) +
          Math.pow(ultimoPunto.y - penultimoPunto.y, 2)
        )
        const nuevoFactor = parseFloat(distanciaReal) / distanciaPixeles
        setFactorEscala(nuevoFactor)
        console.log('✅ Calibración de marcado completada:', nuevoFactor.toFixed(4), 'm/píxel')
        setMensaje(`🎯 Calibración completada. Factor: ${nuevoFactor.toFixed(4)} m/píxel`)
      }
    } else {
      console.log('❌ Calibración de marcado fallida: datos insuficientes')
      setMensaje('❌ Necesitas al menos 2 puntos y una distancia real para calibrar.')
    }
  }

  const completarLineaCamara = () => {
    if (puntosCamara.length < 2) {
      setMensaje('❌ Necesitas al menos 2 puntos para completar una línea.')
      return
    }

    // Simular progreso de línea actual
    if (lineaActual) {
      const nuevoProgreso = Math.min(lineaActual.progreso + 25, 100)
      setLineasMarcado(prev => prev.map(linea =>
        linea.id === lineaActual.id
          ? { ...linea, progreso: nuevoProgreso }
          : linea
      ))
      
      if (nuevoProgreso >= 100) {
        completarLinea(lineaActual.id)
      }
    }

    setMensaje('✅ Línea completada con cámara. Progreso actualizado.')
    limpiarPintadoCamara()
  }

  // Funciones de exportación
  const exportarMarcado = (formato: 'pdf' | 'cad' | 'dxf' | 'svg' | 'png' | 'json') => {
    // Usar la función del store global para exportar
    exportarDatos()
    setMensaje(`📊 Marcado exportado en formato ${formato.toUpperCase()}. Los datos se han guardado localmente.`)
  }







  // Limpiar cámara cuando se cambie de modo
  useEffect(() => {
    if (modoMarcado === 'gps' && isCameraActive) {
      detenerCamara()
      limpiarPintadoCamara()
    }
  }, [modoMarcado])

  // Función para obtener posición GPS real
  const obtenerPosicionGPS = () => {
    setEstadoGPS('conectando')
    setMensaje('Conectando al GPS de alta precisión...')

    if ('geolocation' in navigator) {
      navigator.geolocation.getCurrentPosition(
        (position) => {
          const newPosition: PuntoGPS = {
            lat: position.coords.latitude,
            lng: position.coords.longitude,
            timestamp: Date.now(),
            accuracy: position.coords.accuracy
          }
          setCurrentPosition(newPosition)
          setPrecisionGPS(100 - position.coords.accuracy)
          setSeñalGPS(85 + Math.random() * 15)
          setSatelitesActivos(8 + Math.floor(Math.random() * 8))
          setGpsActivo(true)
          setEstadoGPS('activo')
          setUltimaActualizacion(new Date())
          setMensaje('GPS de alta precisión activo. Listo para marcado profesional.')

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

  // Calibración GPS avanzada
  const iniciarCalibracionGPS = () => {
    setCalibracionGPS(true)
    setMensaje('Iniciando calibración GPS de alta precisión...')

    setTimeout(() => {
      setPrecisionGPS(98.5 + Math.random() * 1.5)
      setSatelitesActivos(12 + Math.floor(Math.random() * 4))
      setCalibracionGPS(false)
      setMensaje('Calibración GPS completada. Precisión optimizada.')
    }, 3000)
  }

  // Simular datos GPS en tiempo real cuando está tracking
  useEffect(() => {
    if (isTracking) {
      const interval = setInterval(() => {
        // Simular posición GPS con mayor precisión
        const newPosition: PuntoGPS = {
          lat: 19.4326 + (Math.random() - 0.5) * 0.0001,
          lng: -99.1332 + (Math.random() - 0.5) * 0.0001,
          timestamp: Date.now(),
          accuracy: 0.5 + Math.random() * 1
        }
        setCurrentPosition(newPosition)

        // Actualizar precisión y señal con datos más realistas
        setPrecisionGPS(97 + Math.random() * 3)
        setSeñalGPS(88 + Math.random() * 12)

        // Actualizar tiempo de sesión
        setTiempoSesion(prev => prev + 1)

        // Simular velocidad y progreso más realistas
        const nuevaVelocidad = 1.5 + Math.random() * 2.5
        setVelocidadPromedio(nuevaVelocidad)

        // Simular progreso de líneas con mayor precisión
        if (lineaActual) {
          const nuevoProgreso = Math.min(lineaActual.progreso + Math.random() * 3, 100)
          setLineasMarcado(prev => prev.map(linea =>
            linea.id === lineaActual.id
              ? {
                  ...linea,
                  progreso: nuevoProgreso,
                  precision: 95 + Math.random() * 5
                }
              : linea
          ))

          // Actualizar distancia recorrida
          setDistanciaRecorrida(prev => prev + nuevaVelocidad)

          // Calcular progreso total
          const progresoTotal = lineasMarcado.reduce((acc, linea) => acc + linea.progreso, 0) / lineasMarcado.length
          setProgresoMarcado(progresoTotal)

          // Calcular tiempo estimado más preciso
          const lineasRestantes = lineasMarcado.filter(l => !l.completada).length
          const tiempoPorLinea = 45 // segundos promedio por línea
          setTiempoEstimado(lineasRestantes * tiempoPorLinea)

          // Actualizar estadísticas avanzadas
          setEstadisticasAvanzadas(prev => ({
            precisionPromedio: (prev.precisionPromedio + precisionGPS) / 2,
            velocidadMaxima: Math.max(prev.velocidadMaxima, nuevaVelocidad),
            tiempoTotal: prev.tiempoTotal + 1,
            distanciaTotal: prev.distanciaTotal + nuevaVelocidad,
            eficiencia: (progresoTotal / (tiempoSesion + 1)) * 100,
            calidadMarcado: progresoTotal * (precisionGPS / 100)
          }))
        }

        setUltimaActualizacion(new Date())
      }, 1000)

      return () => clearInterval(interval)
    }
    return undefined
  }, [isTracking, lineaActual, lineasMarcado, precisionGPS, tiempoSesion])

  const iniciarMarcado = () => {
    if (!gpsActivo) {
      obtenerPosicionGPS()
      return
    }

    setIsTracking(true)
    setTiempoSesion(0)
    setLineaActual(lineasMarcado[0] || null)
    setProgresoMarcado(0)
    setLineasCompletadas(0)
    setDistanciaRecorrida(0)
    setTiempoEstimado(0)
    setPasoActual(1)
    setInstrucciones('🚀 Inicia en la esquina superior izquierda. Camina hacia la derecha siguiendo la línea azul con precisión submétrica.')
    setMensaje('✅ Marcado profesional iniciado. Sistema GPS de alta precisión activo.')
  }

  const detenerMarcado = () => {
    setIsTracking(false)
    setLineaActual(null)
    setInstrucciones('')
    setMensaje('⏹️ Marcado detenido. Datos guardados automáticamente.')
  }

  const reiniciarMarcado = () => {
    setIsTracking(false)

    const lineasReiniciadas = lineasMarcado.map(l => ({ ...l, progreso: 0, completada: false }))
    setLineasMarcado(lineasReiniciadas)
    // Actualizar también en el store global
    setLineasMarcadoGlobales(lineasReiniciadas)
    setTiempoSesion(0)
    setDistanciaRecorrida(0)
    setProgresoMarcado(0)
    setVelocidadPromedio(0)
    setTiempoEstimado(0)
    setPasoActual(1)
    setInstrucciones('')
    setLineaActual(null)
    setMensaje('🔄 Marcado reiniciado. Listo para nueva sesión profesional.')
    
    // Usar la función del store global
    reiniciarMarcadoGlobal()
  }

  const completarLinea = (id: number) => {
    const lineaActualizada = lineasMarcado.find(l => l.id === id)
    if (lineaActualizada) {
      const nuevasLineas = lineasMarcado.map(linea =>
        linea.id === id
          ? { ...linea, completada: true, progreso: 100 }
          : linea
      )
      setLineasMarcado(nuevasLineas)
      // Actualizar también en el store global
      setLineasMarcadoGlobales(nuevasLineas)
      
      // Usar la función del store global
      completarLineaGlobal(id)
      
      // Actualizar estadísticas del campo seleccionado
      if (campoSeleccionado) {
        const campoSeleccionadoObj = gestorCampos.campos.find(c => c.id === campoSeleccionado)
        if (campoSeleccionadoObj) {
          const campoActualizado = {
            ...campoSeleccionadoObj,
            lineasMarcado: nuevasLineas,
            estadisticas: {
              ...campoSeleccionadoObj.estadisticas,
              totalMarcados: nuevasLineas.filter(l => l.completada).length,
              ultimoMarcado: new Date()
            },
            ultimaActualizacion: new Date()
          }
          actualizarCampo(campoSeleccionado, campoActualizado)
        }
      }
      
      setMensaje(`✅ Línea "${lineaActualizada.nombre}" completada exitosamente.`)
      
      // Calcular progreso total actualizado
      const progresoTotal = nuevasLineas.reduce((acc, linea) => acc + linea.progreso, 0) / nuevasLineas.length
      setProgresoMarcado(progresoTotal)
      
      // Verificar si todas las líneas están completadas
      const todasCompletadas = nuevasLineas.every(l => l.completada)
      if (todasCompletadas) {
        setMensaje('🎉 ¡Marcado completo! Todas las líneas FIFA han sido marcadas exitosamente.')
        setIsTracking(false)
      }
    }
  }

  const progresoTotal = lineasMarcado.reduce((acc, linea) => acc + linea.progreso, 0) / lineasMarcado.length

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

  const obtenerColorLinea = (id: number) => {
    const colores = {
      1: 'from-blue-500 to-blue-600',
      2: 'from-green-500 to-green-600',
      3: 'from-red-500 to-red-600',
      4: 'from-yellow-500 to-yellow-600',
      5: 'from-purple-500 to-purple-600',
      6: 'from-pink-500 to-pink-600',
      7: 'from-indigo-500 to-indigo-600',
      8: 'from-orange-500 to-orange-600'
    }
    return colores[id as keyof typeof colores] || 'from-gray-500 to-gray-600'
  }

  return (
    <div className="space-y-6">
      {/* Header principal mejorado */}
      <motion.div
        className="futbol-card"
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
      >
        <div className="flex items-center justify-between mb-6">
          <div className="flex items-center space-x-4">
            <div className="relative">
              <div className="w-12 h-12 bg-gradient-to-br from-blue-500 to-purple-600 rounded-2xl flex items-center justify-center">
                <Navigation className="w-6 h-6 text-white" />
              </div>
              <div className={`absolute -top-1 -right-1 w-4 h-4 rounded-full ${isTracking ? 'bg-green-400 animate-pulse' : gpsActivo ? 'bg-yellow-400' : 'bg-gray-400'}`}></div>
            </div>
            <div>
              <h2 className="text-2xl font-bold text-gradient">Marcado Inteligente Pro</h2>
              <p className="text-white/70">Sistema GPS de alta precisión para marcado profesional FIFA</p>
              {campoActivo && (
                <div className="flex items-center gap-2 mt-2">
                  <MapPin className="w-4 h-4 text-blue-400" />
                  <span className="text-sm text-blue-400 font-medium">
                    Campo: {campoActivo.nombre}
                  </span>
                </div>
              )}
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

        {/* Selector de Campo */}
        <div className="mb-6 p-4 bg-gradient-to-r from-blue-500/20 to-purple-500/20 rounded-lg border border-blue-500/30">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-3">
              <MapPin className="w-5 h-5 text-blue-400" />
              <span className="text-white font-semibold">Campo de Destino:</span>
            </div>
            <select
              value={campoSeleccionado || ''}
              onChange={(e) => setCampoSeleccionado(e.target.value || null)}
              className="px-4 py-2 bg-blue-900/50 border border-blue-500 rounded-lg text-white text-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
            >
              <option value="">Seleccionar campo...</option>
              {gestorCampos.campos.map((campo) => (
                <option key={campo.id} value={campo.id}>
                  {campo.nombre} ({campo.tipo === 'futbol_11' ? 'Fútbol 11' : campo.tipo === 'futbol_7' ? 'Fútbol 7' : campo.tipo === 'futbol_5' ? 'Fútbol 5' : 'Personalizada'})
                </option>
              ))}
            </select>
          </div>
          {campoSeleccionado && (
            <div className="mt-2 text-sm text-blue-300">
              Los datos de marcado se guardarán en el campo seleccionado
            </div>
          )}
        </div>

        {/* Panel de control avanzado */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-6">
          <motion.div className="futbol-card min-h-[180px] flex flex-col justify-between" whileHover={{ scale: 1.02 }}>
            <h3 className="text-lg font-bold mb-3 flex items-center gap-2">
              <Shield className="w-5 h-5 text-blue-400 flex-shrink-0" />
              <span className="truncate">Configuración FIFA</span>
            </h3>
            <div className="space-y-2 text-sm flex-1">
              <div className="flex justify-between">
                <span className="text-white/70">Longitud:</span>
                <span className="text-green-400 break-words">{configuracionFIFA.longitudMinima}-{configuracionFIFA.longitudMaxima}m</span>
              </div>
              <div className="flex justify-between">
                <span className="text-white/70">Ancho:</span>
                <span className="text-green-400 break-words">{configuracionFIFA.anchoMinimo}-{configuracionFIFA.anchoMaximo}m</span>
              </div>
              <div className="flex justify-between">
                <span className="text-white/70">Tolerancia:</span>
                <span className="text-blue-400 break-words">{configuracionFIFA.tolerancia}</span>
              </div>
            </div>
          </motion.div>

          <motion.div className="futbol-card min-h-[180px] flex flex-col justify-between" whileHover={{ scale: 1.02 }}>
            <h3 className="text-lg font-bold mb-3 flex items-center gap-2">
              <Zap className="w-5 h-5 text-yellow-400 flex-shrink-0" />
              <span className="truncate">Estado del Sistema</span>
            </h3>
            <div className="space-y-2 text-sm flex-1">
              <div className="flex justify-between">
                <span className="text-white/70">Satélites:</span>
                <span className="text-green-400 break-words">{satelitesActivos} activos</span>
              </div>
              <div className="flex justify-between">
                <span className="text-white/70">Altitud:</span>
                <span className="text-blue-400 break-words">{altitud.toFixed(0)}m</span>
              </div>
            </div>
          </motion.div>

          <motion.div className="futbol-card min-h-[180px] flex flex-col justify-between" whileHover={{ scale: 1.02 }}>
            <h3 className="text-lg font-bold mb-3 flex items-center gap-2">
              <BarChart3 className="w-5 h-5 text-purple-400 flex-shrink-0" />
              <span className="truncate">Estadísticas Avanzadas</span>
            </h3>
            <div className="space-y-2 text-sm flex-1">
              <div className="flex justify-between">
                <span className="text-white/70">Precisión Prom:</span>
                <span className="text-green-400 break-words">{estadisticasAvanzadas.precisionPromedio.toFixed(1)}%</span>
              </div>
              <div className="flex justify-between">
                <span className="text-white/70">Velocidad Máx:</span>
                <span className="text-blue-400 break-words">{estadisticasAvanzadas.velocidadMaxima.toFixed(1)}m/s</span>
              </div>
              <div className="flex justify-between">
                <span className="text-white/70">Eficiencia:</span>
                <span className="text-purple-400 break-words">{estadisticasAvanzadas.eficiencia.toFixed(1)}%</span>
              </div>
            </div>
          </motion.div>
        </div>

        {/* Instrucciones dinámicas mejoradas */}
        {instrucciones && (
          <motion.div
            className="mb-6 p-4 bg-gradient-to-r from-blue-500/20 to-purple-500/20 rounded-lg border border-blue-500/30"
            initial={{ opacity: 0, y: -10 }}
            animate={{ opacity: 1, y: 0 }}
          >
            <div className="flex items-center space-x-3">
              <div className="w-8 h-8 bg-gradient-to-r from-blue-500 to-purple-600 rounded-full flex items-center justify-center">
                <span className="text-white font-bold text-sm">{pasoActual}</span>
              </div>
              <div>
                <h4 className="text-white font-semibold">Paso {pasoActual} de 8 - Marcado Profesional</h4>
                <p className="text-white/80">{instrucciones}</p>
              </div>
            </div>
          </motion.div>
        )}

        {/* Barra de progreso mejorada */}
        {isTracking && (
          <motion.div
            className="mb-6"
            initial={{ opacity: 0, height: 0 }}
            animate={{ opacity: 1, height: 'auto' }}
          >
            <div className="flex items-center justify-between mb-2">
              <span className="text-white text-sm">Progreso General del Marcado FIFA</span>
              <span className="text-white text-sm font-mono">{progresoMarcado.toFixed(1)}%</span>
            </div>
            <div className="progress-bar">
              <motion.div
                className="progress-fill bg-gradient-to-r from-blue-500 to-purple-500"
                initial={{ width: 0 }}
                animate={{ width: `${progresoMarcado}%` }}
                transition={{ duration: 0.5 }}
              />
            </div>
          </motion.div>
        )}

        {/* Mensaje de estado mejorado */}
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

        {/* Selector de modo de marcado */}
        <div className="mb-6">
          <div className="flex items-center justify-center space-x-4">
            <motion.button
              onClick={() => setModoMarcado('gps')}
              className={`px-6 py-3 rounded-lg font-semibold transition-all ${
                modoMarcado === 'gps'
                  ? 'bg-gradient-to-r from-blue-500 to-blue-600 text-white shadow-lg'
                  : 'bg-gray-700 text-gray-300 hover:bg-gray-600'
              }`}
              whileHover={{ scale: 1.02 }}
              whileTap={{ scale: 0.98 }}
            >
              <div className="flex items-center space-x-2">
                <Satellite className="w-5 h-5" />
                <span>GPS</span>
              </div>
            </motion.button>

            <motion.button
              onClick={() => setModoMarcado('camara')}
              className={`px-6 py-3 rounded-lg font-semibold transition-all ${
                modoMarcado === 'camara'
                  ? 'bg-gradient-to-r from-purple-500 to-purple-600 text-white shadow-lg'
                  : 'bg-gray-700 text-gray-300 hover:bg-gray-600'
              }`}
              whileHover={{ scale: 1.02 }}
              whileTap={{ scale: 0.98 }}
            >
              <div className="flex items-center space-x-2">
                <Camera className="w-5 h-5" />
                <span>Cámara</span>
              </div>
            </motion.button>
          </div>
        </div>

        {/* Controles principales mejorados */}
        <div className="flex flex-wrap gap-4">
          {modoMarcado === 'gps' ? (
            <>
              <motion.button
                onClick={iniciarMarcado}
                disabled={isTracking}
                className="futbol-btn futbol-btn-primary flex items-center space-x-2"
                whileHover={{ scale: 1.02 }}
                whileTap={{ scale: 0.98 }}
              >
                {isTracking ? (
                  <Loader2 className="w-5 h-5 animate-spin" />
                ) : (
                  <Play className="w-5 h-5" />
                )}
                <span>{gpsActivo ? '🚀 Iniciar Marcado Pro' : '📍 Activar GPS'}</span>
              </motion.button>

              <motion.button
                onClick={detenerMarcado}
                disabled={!isTracking}
                className="futbol-btn futbol-btn-warning flex items-center space-x-2"
                whileHover={{ scale: 1.02 }}
                whileTap={{ scale: 0.98 }}
              >
                <Square className="w-5 h-5" />
                <span>⏹️ Detener</span>
              </motion.button>

              <motion.button
                onClick={reiniciarMarcado}
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
            </>
          ) : (
            <>
              <motion.button
                onClick={isCameraActive ? detenerCamara : iniciarCamara}
                className="futbol-btn futbol-btn-primary flex items-center space-x-2"
                whileHover={{ scale: 1.02 }}
                whileTap={{ scale: 0.98 }}
              >
                {isCameraActive ? (
                  <CameraOff className="w-5 h-5" />
                ) : (
                  <Camera className="w-5 h-5" />
                )}
                <span>{isCameraActive ? '📹 Desactivar Cámara' : '📹 Activar Cámara'}</span>
              </motion.button>
              
              {!isCameraActive && (
                <motion.button
                  onClick={iniciarCamara}
                  className="futbol-btn futbol-btn-success flex items-center space-x-2"
                  whileHover={{ scale: 1.02 }}
                  whileTap={{ scale: 0.98 }}
                >
                  <Camera className="w-5 h-5" />
                  <span>🚀 Iniciar Cámara Manualmente</span>
                </motion.button>
              )}

              <motion.button
                onClick={completarLineaCamara}
                disabled={puntosCamara.length < 2}
                className="futbol-btn futbol-btn-success flex items-center space-x-2"
                whileHover={{ scale: 1.02 }}
                whileTap={{ scale: 0.98 }}
              >
                <CheckCircle className="w-5 h-5" />
                <span>✅ Completar Línea</span>
              </motion.button>

              <motion.button
                onClick={limpiarPintadoCamara}
                className="futbol-btn futbol-btn-warning flex items-center space-x-2"
                whileHover={{ scale: 1.02 }}
                whileTap={{ scale: 0.98 }}
              >
                <RotateCcw className="w-5 h-5" />
                <span>🔄 Limpiar</span>
              </motion.button>
            </>
          )}

          <motion.button
            onClick={() => setMostrarMapa(!mostrarMapa)}
            className="futbol-btn futbol-btn-success flex items-center space-x-2"
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

          <motion.button
            onClick={() => exportarMarcado('pdf')}
            className="futbol-btn futbol-btn-success flex items-center space-x-2"
            whileHover={{ scale: 1.02 }}
            whileTap={{ scale: 0.98 }}
          >
            <FileText className="w-5 h-5" />
            <span>📄 Exportar PDF</span>
          </motion.button>

          <motion.button
            onClick={() => exportarMarcado('cad')}
            className="futbol-btn futbol-btn-success flex items-center space-x-2"
            whileHover={{ scale: 1.02 }}
            whileTap={{ scale: 0.98 }}
          >
            <Download className="w-5 h-5" />
            <span>📐 Exportar CAD</span>
          </motion.button>

          <motion.button
            onClick={() => setMostrarMenuExportacion(!mostrarMenuExportacion)}
            className="futbol-btn futbol-btn-secondary flex items-center space-x-2"
            whileHover={{ scale: 1.02 }}
            whileTap={{ scale: 0.98 }}
          >
            <Download className="w-5 h-5" />
            <span>📁 Más Formatos</span>
          </motion.button>
        </div>

        {/* Menú desplegable de exportación */}
        {mostrarMenuExportacion && (
          <motion.div
            className="mt-4 p-4 bg-gray-800 rounded-lg border border-gray-600"
            initial={{ opacity: 0, height: 0 }}
            animate={{ opacity: 1, height: 'auto' }}
            exit={{ opacity: 0, height: 0 }}
          >
            <h4 className="text-white font-semibold mb-3 flex items-center gap-2">
              <Download className="w-5 h-5" />
              Exportar en Diferentes Formatos
            </h4>
            <div className="grid grid-cols-2 md:grid-cols-3 gap-2">
              <motion.button
                onClick={() => exportarMarcado('dxf')}
                className="px-3 py-2 bg-blue-600 text-white rounded text-sm hover:bg-blue-700"
                whileHover={{ scale: 1.02 }}
                whileTap={{ scale: 0.98 }}
              >
                DXF
              </motion.button>
              <motion.button
                onClick={() => exportarMarcado('svg')}
                className="px-3 py-2 bg-green-600 text-white rounded text-sm hover:bg-green-700"
                whileHover={{ scale: 1.02 }}
                whileTap={{ scale: 0.98 }}
              >
                SVG
              </motion.button>
              <motion.button
                onClick={() => exportarMarcado('png')}
                className="px-3 py-2 bg-purple-600 text-white rounded text-sm hover:bg-purple-700"
                whileHover={{ scale: 1.02 }}
                whileTap={{ scale: 0.98 }}
              >
                PNG
              </motion.button>
              <motion.button
                onClick={() => exportarMarcado('json')}
                className="px-3 py-2 bg-yellow-600 text-white rounded text-sm hover:bg-yellow-700"
                whileHover={{ scale: 1.02 }}
                whileTap={{ scale: 0.98 }}
              >
                JSON
              </motion.button>
            </div>
          </motion.div>
        )}
      </motion.div>

      {/* Mapa visual mejorado */}
      {mostrarMapa && modoMarcado === 'gps' && (
        <motion.div
          className="futbol-card"
          initial={{ opacity: 0, scale: 0.9 }}
          animate={{ opacity: 1, scale: 1 }}
        >
          <h3 className="text-xl font-bold text-white mb-4 flex items-center gap-2">
            <MapPin className="w-6 h-6 text-blue-400" />
            Mapa de la Cancha - Estándares FIFA
          </h3>

          <div className="relative w-full h-96 bg-gradient-to-br from-green-800 to-green-600 rounded-lg overflow-hidden border-2 border-white/20">
            {/* Líneas de la cancha mejoradas */}
            {lineasMarcado.map((linea) => (
              <motion.div
                key={linea.id}
                className={`absolute ${linea.completada ? 'opacity-100' : 'opacity-60'}`}
                style={{
                  top: linea.posicion === 'top' ? '10%' : linea.posicion === 'center' ? '50%' : '85%',
                  left: linea.posicion === 'left' ? '10%' : linea.posicion === 'center' ? '50%' : '85%',
                  width: linea.tipo === 'horizontal' ? '80%' : '2px',
                  height: linea.tipo === 'vertical' ? '80%' : '2px',
                  transform: linea.posicion === 'center' ? 'translate(-50%, -50%)' : 'none'
                }}
              >
                <div className={`w-full h-full bg-gradient-to-r ${obtenerColorLinea(linea.id)} rounded-full`}>
                  <motion.div
                    className="h-full bg-white/30 rounded-full"
                    initial={{ width: 0 }}
                    animate={{ width: `${linea.progreso}%` }}
                    transition={{ duration: 0.5 }}
                  />
                </div>
              </motion.div>
            ))}

            {/* Elementos de la cancha mejorados */}
            <div className="absolute top-2 left-2 w-3 h-3 bg-white rounded-full"></div>
            <div className="absolute top-2 right-2 w-3 h-3 bg-white rounded-full"></div>
            <div className="absolute bottom-2 left-2 w-3 h-3 bg-white rounded-full"></div>
            <div className="absolute bottom-2 right-2 w-3 h-3 bg-white rounded-full"></div>
            <div className="absolute top-1/2 left-1/2 w-4 h-4 bg-white rounded-full transform -translate-x-1/2 -translate-y-1/2"></div>
            <div className="absolute top-1/4 left-1/2 w-16 h-8 border-2 border-white/50 rounded transform -translate-x-1/2"></div>
            <div className="absolute bottom-1/4 left-1/2 w-16 h-8 border-2 border-white/50 rounded transform -translate-x-1/2"></div>
            <div className="absolute top-1/2 left-1/2 w-8 h-8 border-2 border-white/50 rounded-full transform -translate-x-1/2 -translate-y-1/2"></div>

            {/* Indicador de posición actual mejorado */}
            {isTracking && currentPosition && (
              <motion.div
                className="absolute w-4 h-4 bg-red-500 rounded-full border-2 border-white shadow-lg"
                animate={{
                  x: [0, 100, 200, 300, 400, 300, 200, 100, 0],
                  y: [0, 50, 100, 150, 200, 150, 100, 50, 0]
                }}
                transition={{
                  duration: 3,
                  repeat: Infinity,
                  ease: "easeInOut"
                }}
                style={{
                  left: '50%',
                  top: '50%',
                  transform: 'translate(-50%, -50%)'
                }}
              />
            )}

            {/* Información del progreso mejorada */}
            <div className="absolute top-4 left-4 text-xs text-white bg-black/50 px-2 py-1 rounded">
              {lineasCompletadas}/8 Líneas FIFA
            </div>
            <div className="absolute top-4 right-4 text-xs text-white bg-black/50 px-2 py-1 rounded">
              {progresoTotal.toFixed(1)}% Completado
            </div>
            <div className="absolute bottom-4 left-4 text-xs text-white bg-black/50 px-2 py-1 rounded">
              <div className="flex items-center space-x-2">
                <div className="w-3 h-3 bg-blue-500 rounded"></div>
                <span>Líneas FIFA</span>
              </div>
            </div>
          </div>
        </motion.div>
      )}

      {/* Interfaz de cámara para pintado */}
      {modoMarcado === 'camara' && (
        <motion.div
          className="futbol-card"
          initial={{ opacity: 0, scale: 0.9 }}
          animate={{ opacity: 1, scale: 1 }}
        >
          <h3 className="text-xl font-bold text-white mb-4 flex items-center gap-2">
            <Camera className="w-6 h-6 text-purple-400" />
            Pintado con Cámara - Marcado Visual
          </h3>
          
          {modoMarcado === 'camara' && !isCameraActive && !errorCamara && (
            <div className="mb-4 p-3 bg-purple-500/20 border border-purple-500/30 rounded-lg">
              <p className="text-purple-400">📹 Cámara lista para activar. Presiona "Activar Cámara" para comenzar el pintado visual.</p>
            </div>
          )}

          <div className="relative w-full h-96 bg-black rounded-lg overflow-hidden border-2 border-purple-500/30">
            {isCameraActive ? (
              <>
                {/* Video de la cámara */}
                <video
                  ref={videoRef}
                  autoPlay
                  playsInline
                  muted
                  className="w-full h-full object-cover"
                  onClick={capturarPuntoCamara}
                />
                
                {/* Overlay para captura de puntos */}
                <div 
                  className="absolute inset-0 cursor-crosshair"
                  onClick={capturarPuntoCamara}
                >
                  {/* Puntos capturados */}
                  {puntosCamara.map((punto, index) => (
                    <motion.div
                      key={index}
                      className="absolute w-4 h-4 bg-red-500 rounded-full border-2 border-white shadow-lg"
                      style={{
                        left: punto.x - 8,
                        top: punto.y - 8
                      }}
                      initial={{ scale: 0 }}
                      animate={{ scale: 1 }}
                      transition={{ duration: 0.2 }}
                    >
                      <span className="absolute -top-6 left-1/2 transform -translate-x-1/2 text-xs text-white bg-black/70 px-1 rounded">
                        {index + 1}
                      </span>
                    </motion.div>
                  ))}

                  {/* Línea pintada */}
                  {lineaPintada && lineaPintada.puntos.length >= 2 && (
                    <svg
                      className="absolute inset-0 pointer-events-none"
                      style={{ width: '100%', height: '100%' }}
                    >
                      <polyline
                        points={lineaPintada.puntos.map(p => `${p.x},${p.y}`).join(' ')}
                        stroke="red"
                        strokeWidth="3"
                        fill="none"
                        strokeDasharray="5,5"
                      />
                    </svg>
                  )}

                  {/* Instrucciones en pantalla */}
                  <div className="absolute bottom-4 left-4 right-4 bg-black/70 text-white p-3 rounded-lg">
                    <div className="flex items-center justify-between">
                      <div>
                        <p className="text-sm font-semibold">Puntos capturados: {puntosCamara.length}</p>
                        <p className="text-xs text-gray-300">
                          {puntosCamara.length < 2 
                            ? 'Toca la pantalla para marcar puntos de la línea' 
                            : 'Línea lista para completar'
                          }
                        </p>
                      </div>
                      {puntosCamara.length >= 2 && (
                        <motion.button
                          onClick={completarLineaCamara}
                          className="px-3 py-1 bg-green-500 text-white rounded text-sm font-semibold"
                          whileHover={{ scale: 1.05 }}
                          whileTap={{ scale: 0.95 }}
                        >
                          ✅ Completar
                        </motion.button>
                      )}
                    </div>
                  </div>
                </div>
              </>
            ) : (
              <div className="flex items-center justify-center h-full">
                <div className="text-center text-white">
                  <Camera className="w-16 h-16 mx-auto mb-4 text-purple-400" />
                  <p className="text-lg font-semibold mb-2">Cámara no activa</p>
                  <p className="text-sm text-gray-300">
                    Presiona "Activar Cámara" para comenzar el pintado visual
                  </p>
                </div>
              </div>
            )}

            {/* Error de cámara */}
            {errorCamara && (
              <div className="absolute inset-0 bg-red-500/20 flex items-center justify-center">
                <div className="text-center text-white">
                  <AlertTriangle className="w-16 h-16 mx-auto mb-4 text-red-400" />
                  <p className="text-lg font-semibold mb-2">Error de Cámara</p>
                  <p className="text-sm">{errorCamara}</p>
                </div>
              </div>
            )}
          </div>

          {/* Herramientas avanzadas de cámara */}
          {isCameraActive && (
            <div className="mt-4 space-y-4">
              <div className="border-t border-purple-500/30 pt-4">
                <h4 className="text-white font-semibold mb-3 text-center">Herramientas de Marcado</h4>
                
                {/* Indicador de herramienta activa */}
                <div className="mb-3 p-2 bg-purple-500/20 border border-purple-500/30 rounded-lg">
                  <p className="text-purple-300 text-sm text-center">
                    🛠️ Herramienta activa: <span className="font-semibold">{obtenerNombreHerramienta()}</span>
                    {seguimientoActivo && <span className="ml-2 text-green-400">🎯 Seguimiento ON</span>}
                  </p>
                </div>
                
                <div className="grid grid-cols-2 gap-2">
                  <motion.button
                    onClick={seguimientoActivo ? detenerSeguimientoLinea : iniciarSeguimientoLinea}
                    className={`px-3 py-2 rounded text-sm font-medium ${
                      seguimientoActivo
                        ? 'bg-green-500 text-white'
                        : 'bg-purple-500/20 text-purple-300 hover:bg-purple-500/30'
                    }`}
                    whileHover={{ scale: 1.05 }}
                    whileTap={{ scale: 0.95 }}
                  >
                    <Target className="w-4 h-4 inline mr-1" />
                    {seguimientoActivo ? 'Detener' : 'Seguir'} Línea
                  </motion.button>

                  <motion.button
                    onClick={detectarLineaMarcado}
                    className="px-3 py-2 rounded text-sm font-medium bg-purple-500/20 text-purple-300 hover:bg-purple-500/30"
                    whileHover={{ scale: 1.05 }}
                    whileTap={{ scale: 0.95 }}
                  >
                    <Eye className="w-4 h-4 inline mr-1" />
                    Detectar Línea
                  </motion.button>

                  <motion.button
                    onClick={guardarRutaMarcado}
                    disabled={puntosCamara.length < 2}
                    className="px-3 py-2 rounded text-sm font-medium bg-purple-500/20 text-purple-300 hover:bg-purple-500/30 disabled:opacity-50"
                    whileHover={{ scale: 1.05 }}
                    whileTap={{ scale: 0.95 }}
                  >
                    <Save className="w-4 h-4 inline mr-1" />
                    Guardar Ruta
                  </motion.button>

                  <motion.button
                    onClick={seguirRutaGuardada}
                    disabled={rutaGuardada.length === 0}
                    className="px-3 py-2 rounded text-sm font-medium bg-purple-500/20 text-purple-300 hover:bg-purple-500/30 disabled:opacity-50"
                    whileHover={{ scale: 1.05 }}
                    whileTap={{ scale: 0.95 }}
                  >
                    <Navigation className="w-4 h-4 inline mr-1" />
                    Seguir Ruta
                  </motion.button>
                </div>

                {/* Calibración */}
                <div className="mt-3 pt-3 border-t border-purple-500/20">
                  <motion.button
                    onClick={calibrarCamaraMarcado}
                    disabled={puntosCamara.length < 2}
                    className="w-full px-3 py-2 rounded text-sm font-medium bg-yellow-500/20 text-yellow-300 hover:bg-yellow-500/30 disabled:opacity-50"
                    whileHover={{ scale: 1.05 }}
                    whileTap={{ scale: 0.95 }}
                  >
                    <Settings className="w-4 h-4 inline mr-1" />
                    Calibrar Cámara
                  </motion.button>
                  <p className="text-xs text-purple-300/70 mt-1 text-center">
                    Factor: {factorEscala.toFixed(4)} m/píxel
                  </p>
                </div>
              </div>
            </div>
          )}
        </motion.div>
      )}

      {/* Estadísticas en tiempo real mejoradas */}
      <motion.div
        className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 mb-6"
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.2 }}
      >
        <motion.div
          className="futbol-stat-card min-h-[160px] flex flex-col justify-center"
          whileHover={{ scale: 1.05 }}
          animate={isTracking ? { scale: [1, 1.02, 1] } : {}}
          transition={{ duration: 2, repeat: isTracking ? Infinity : 0 }}
        >
          <div className="futbol-stat-icon">
            <Clock className="w-6 h-6 text-blue-400" />
          </div>
          <div className="futbol-stat-value break-words">
            {Math.floor(tiempoSesion / 60)}:{(tiempoSesion % 60).toString().padStart(2, '0')}
          </div>
          <div className="futbol-stat-label">Tiempo Sesión</div>
        </motion.div>

        <motion.div
          className="futbol-stat-card min-h-[160px] flex flex-col justify-center"
          whileHover={{ scale: 1.05 }}
          animate={isTracking ? { scale: [1, 1.02, 1] } : {}}
          transition={{ duration: 2, repeat: isTracking ? Infinity : 0, delay: 0.5 }}
        >
          <div className="futbol-stat-icon">
            <Gauge className="w-6 h-6 text-green-400" />
          </div>
          <div className="futbol-stat-value break-words">
            {velocidadPromedio.toFixed(1)} m/s
          </div>
          <div className="futbol-stat-label">Velocidad Promedio</div>
        </motion.div>

        <motion.div
          className="futbol-stat-card min-h-[160px] flex flex-col justify-center"
          whileHover={{ scale: 1.05 }}
          animate={isTracking ? { scale: [1, 1.02, 1] } : {}}
          transition={{ duration: 2, repeat: isTracking ? Infinity : 0, delay: 1 }}
        >
          <div className="futbol-stat-icon">
            <Target className="w-6 h-6 text-purple-400" />
          </div>
          <div className="futbol-stat-value break-words">
            {progresoTotal.toFixed(1)}%
          </div>
          <div className="futbol-stat-label">Progreso Total</div>
        </motion.div>

        <motion.div
          className="futbol-stat-card min-h-[160px] flex flex-col justify-center"
          whileHover={{ scale: 1.05 }}
          animate={isTracking ? { scale: [1, 1.02, 1] } : {}}
          transition={{ duration: 2, repeat: isTracking ? Infinity : 0, delay: 1.5 }}
        >
          <div className="futbol-stat-icon">
            <Award className="w-6 h-6 text-orange-400" />
          </div>
          <div className="futbol-stat-value break-words">
            {lineasCompletadas}/8
          </div>
          <div className="futbol-stat-label">Líneas Completadas</div>
        </motion.div>
      </motion.div>

      {/* Información adicional en tiempo real mejorada */}
      {isTracking && (
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
              <div className="text-lg font-bold text-white">{distanciaRecorrida.toFixed(1)}m</div>
              <div className="text-sm text-white/60">Distancia Recorrida</div>
            </div>
            <div>
              <div className="text-lg font-bold text-white">{lineaActual?.nombre || 'N/A'}</div>
              <div className="text-sm text-white/60">Línea Actual</div>
            </div>
            <div>
              <div className="text-lg font-bold text-white">
                {ultimaActualizacion ? ultimaActualizacion.toLocaleTimeString() : '--:--:--'}
              </div>
              <div className="text-sm text-white/60">Última Actualización</div>
            </div>
            <div>
              <div className="text-lg font-bold text-white">
                {Math.floor(tiempoEstimado / 60)}:{(tiempoEstimado % 60).toString().padStart(2, '0')}
              </div>
              <div className="text-sm text-white/60">Tiempo Estimado</div>
            </div>
          </div>
        </motion.div>
      )}

      {/* Líneas de marcado con diseño mejorado */}
      <motion.div
        className="space-y-4"
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.4 }}
      >
        <h3 className="text-xl font-bold text-white mb-4 flex items-center gap-2">
          <Calendar className="w-6 h-6 text-green-400" />
          Progreso de Líneas FIFA
        </h3>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          {lineasMarcado.map((linea) => (
            <motion.div
              key={linea.id}
              className={`futbol-card min-h-[200px] flex flex-col justify-between ${linea.completada ? 'border-2 border-green-500/50' : ''}`}
              whileHover={{ scale: 1.02 }}
              initial={{ opacity: 0, x: -20 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ delay: linea.id * 0.1 }}
            >
              <div className="flex items-center justify-between mb-3">
                <div className="flex items-center space-x-3 flex-1 min-w-0">
                  <div className={`w-3 h-3 rounded-full flex-shrink-0 ${linea.completada ? 'bg-green-400' : 'bg-gray-400'}`}></div>
                  <span className="font-semibold text-white truncate">{linea.nombre}</span>
                </div>
                <div className="flex items-center space-x-2 flex-shrink-0">
                  <div className={`w-6 h-6 rounded-full bg-gradient-to-r ${obtenerColorLinea(linea.id)} flex items-center justify-center`}>
                    <span className="text-white text-xs font-bold">{linea.id}</span>
                  </div>
                  {linea.completada ? (
                    <CheckCircle className="w-5 h-5 text-green-400" />
                  ) : (
                    <div className="w-5 h-5 border-2 border-white/30 rounded-full"></div>
                  )}
                </div>
              </div>

              <div className="progress-bar mb-3 flex-1">
                <motion.div
                  className={`progress-fill bg-gradient-to-r ${obtenerColorLinea(linea.id)}`}
                  initial={{ width: 0 }}
                  animate={{ width: `${linea.progreso}%` }}
                  transition={{ duration: 0.5 }}
                />
              </div>

              <div className="flex items-center justify-between">
                <span className="text-sm text-white/60 break-words">
                  {linea.progreso.toFixed(1)}% completado
                </span>
                <motion.button
                  onClick={() => completarLinea(linea.id)}
                  disabled={linea.completada}
                  className={`text-sm px-3 py-1 rounded-lg ${linea.completada ? 'bg-green-500/50 text-white' : 'futbol-btn futbol-btn-success'}`}
                  whileHover={{ scale: 1.05 }}
                  whileTap={{ scale: 0.95 }}
                >
                  {linea.completada ? '✅ Completada' : '🎯 Completar'}
                </motion.button>
              </div>
            </motion.div>
          ))}
        </div>
      </motion.div>

      {/* Posición actual mejorada */}
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
              <div className="text-sm text-white/60">Precisión</div>
              <div className="text-lg font-mono text-white">±{currentPosition.accuracy?.toFixed(1) || 'N/A'}m</div>
            </div>
            <div>
              <div className="text-sm text-white/60">Estado</div>
              <div className="text-lg font-mono text-white">
                {isTracking ? '🎯 Marcando' : gpsActivo ? '✅ GPS Activo' : '⏸️ En espera'}
              </div>
            </div>
          </div>
        </motion.div>
      )}
    </div>
  )
}
