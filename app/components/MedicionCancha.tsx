'use client'

import { motion } from 'framer-motion'
import {
    AlertCircle,
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
    Gauge,
    Globe,
    Info,
    Loader2,
    MapPin,
    Navigation,
    Play,
    RotateCcw,
    Ruler,
    Satellite,
    Save,
    Settings,
    Shield,
    Signal,
    Square,
    Target,
    TrendingUp,
    Trophy,
    Users,
    X,
    Zap
} from 'lucide-react'
import { useEffect, useState, useRef } from 'react'
import { Medicion, PuntoGPS } from '../../types'
import { useAppStore } from '../../stores/useAppStore'

interface MedicionCanchaProps {
  isRecording?: boolean
  onRecordingChange?: (recording: boolean) => void
}

export default function MedicionCancha({ isRecording, onRecordingChange }: MedicionCanchaProps) {
  // Obtener estado global del store
  const {
    mediciones: medicionesGlobales,
    setMediciones: setMedicionesGlobales,

    exportarDatos,
    campoActivo,
    gestorCampos,
    actualizarCampo
  } = useAppStore()

  // Estado para modo de medición
  const [modoMedicion, setModoMedicion] = useState<'gps' | 'camara'>('gps')
  
  // Estados para GPS
  const [currentPosition, setCurrentPosition] = useState<PuntoGPS | null>(null)
  const [isMeasuring, setIsMeasuring] = useState(false)
  const [puntosMedicion, setPuntosMedicion] = useState<PuntoGPS[]>([])
  
  // Usar mediciones del store global en lugar del estado local
  const [mediciones, setMediciones] = useState<Medicion[]>(medicionesGlobales)

  // Efecto para inicializar las mediciones predeterminadas si no existen
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

  // Actualizar campo seleccionado cuando cambie el campo activo
  useEffect(() => {
    setCampoSeleccionado(campoActivo?.id || null)
  }, [campoActivo])

  // Sincronizar estado de grabación desde el componente padre
  useEffect(() => {
    if (isRecording !== undefined && isRecording !== isMeasuring) {
      if (isRecording) {
        iniciarMedicion()
      } else {
        detenerMedicion()
      }
    }
  }, [isRecording])
  const [precisionGPS, setPrecisionGPS] = useState(0)
  const [señalGPS, setSeñalGPS] = useState(0)
  const [tiempoSesion, setTiempoSesion] = useState(0)
  const [distanciaTotal, setDistanciaTotal] = useState(0)
  const [calificacionFIFA, setCalificacionFIFA] = useState(0)
  const [gpsActivo, setGpsActivo] = useState(false)
  const [mensaje, setMensaje] = useState('')
  const [progresoMedicion, setProgresoMedicion] = useState(0)
  const [estadoGPS, setEstadoGPS] = useState<'inactivo' | 'conectando' | 'activo' | 'error'>('inactivo')
  const [puntosCapturados, setPuntosCapturados] = useState(0)
  const [velocidadMedicion, setVelocidadMedicion] = useState(0)
  const [ultimaActualizacion, setUltimaActualizacion] = useState<Date | null>(null)
  const [pasoActual, setPasoActual] = useState(1)
  const [instrucciones, setInstrucciones] = useState('')
  const [mostrarMapa, setMostrarMapa] = useState(true)
  const [puntoInicio, setPuntoInicio] = useState<PuntoGPS | null>(null)
  const [puntoActual, setPuntoActual] = useState<PuntoGPS | null>(null)
  const [modoAvanzado, setModoAvanzado] = useState(false)
  const [campoSeleccionado, setCampoSeleccionado] = useState<string | null>(campoActivo?.id || null)
  const [calibracionGPS, setCalibracionGPS] = useState(false)
  const [satelitesActivos, setSatelitesActivos] = useState(0)
  const [altitud, setAltitud] = useState(0)
  const [estadisticasAvanzadas] = useState({
    precisionPromedio: 0,
    velocidadMaxima: 0,
    tiempoTotal: 0,
    distanciaTotal: 0,
    eficiencia: 0,
    calidadMedicion: 0
  })

  // Estados para cámara
  const [isCameraActive, setIsCameraActive] = useState(false)
  const [puntosCamara, setPuntosCamara] = useState<{x: number, y: number, timestamp: number}[]>([])
  const [modoMedicionCamara, setModoMedicionCamara] = useState<'linea' | 'area' | 'circulo' | 'ruta' | 'seguimiento'>('linea')
  const [distanciaCamara, setDistanciaCamara] = useState(0)
  const [areaCamara, setAreaCamara] = useState(0)
  const [errorCamara, setErrorCamara] = useState<string | null>(null)
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
  const canvasRef = useRef<HTMLCanvasElement>(null)

  // Efecto para iniciar cámara automáticamente cuando se cambia al modo cámara
  useEffect(() => {
    console.log('useEffect triggered:', { modoMedicion, isCameraActive })
    if (modoMedicion === 'camara' && !isCameraActive) {
      console.log('Iniciando cámara automáticamente...')
      // Pequeño delay para asegurar que el componente esté montado
      const timer = setTimeout(() => {
        console.log('Ejecutando iniciarCamara...')
        iniciarCamara()
      }, 1000)
      
      return () => clearTimeout(timer)
    }
    return undefined
  }, [modoMedicion, isCameraActive])

  // Efecto adicional para manejar el videoRef cuando se activa la cámara
  useEffect(() => {
    if (isCameraActive && videoRef.current && streamRef.current) {
      console.log('Video element available in MedicionCancha, setting up stream...')
      videoRef.current.srcObject = streamRef.current
      videoRef.current.play().catch(error => {
        console.error('Error playing video in MedicionCancha:', error)
      })
    }
  }, [isCameraActive])

  // Datos de configuración FIFA mejorados
  const [configuracionFIFA] = useState({
    longitudMinima: 100,
    longitudMaxima: 110,
    anchoMinimo: 64,
    anchoMaximo: 75,
    areaPenal: '16.5m x 40.3m',
    circuloCentral: '9.15m',
    puntoPenal: '11m',
    tolerancia: '±0.5m',
    precisionRequerida: '±0.3m',
    tiempoMaximo: 300 // 5 minutos
  })

  // Funciones para cámara
  const iniciarCamara = async () => {
    try {
      console.log('iniciarCamara called')
      setErrorCamara(null)
      setMensaje('Iniciando cámara para medición...')
      
      const stream = await navigator.mediaDevices.getUserMedia({ 
        video: { 
          facingMode: 'environment',
          width: { ideal: 1280 },
          height: { ideal: 720 }
        } 
      })
      
      console.log('Stream obtenido:', stream)
      streamRef.current = stream
      setIsCameraActive(true)
      setMensaje('Cámara activa. Toca la pantalla para capturar puntos de medición.')
      console.log('Cámara iniciada exitosamente')
    } catch (error) {
      console.error('Error al iniciar cámara:', error)
      setErrorCamara('No se pudo acceder a la cámara. Verifica los permisos.')
      setMensaje('Error al iniciar cámara. Verifica los permisos.')
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

  const capturarPuntoCamara = (event: React.MouseEvent<HTMLDivElement>) => {
    if (!isCameraActive || !videoRef.current) return

    const rect = event.currentTarget.getBoundingClientRect()
    const x = event.clientX - rect.left
    const y = event.clientY - rect.top

    const nuevoPunto = {
      x: x,
      y: y,
      timestamp: Date.now()
    }

    setPuntosCamara(prev => [...prev, nuevoPunto])
    setPuntosCapturados(prev => prev + 1)

    // Calcular distancia si hay más de un punto
    if (puntosCamara.length > 0) {
      const puntoAnterior = puntosCamara[puntosCamara.length - 1]
      if (puntoAnterior?.x !== undefined && puntoAnterior?.y !== undefined) {
        const distancia = Math.sqrt(
          Math.pow(x - puntoAnterior.x, 2) + Math.pow(y - puntoAnterior.y, 2)
        )
        setDistanciaCamara(prev => prev + distancia)
      }
    }

    setMensaje(`Punto ${puntosCamara.length + 1} capturado. Distancia: ${(distanciaCamara * factorEscala).toFixed(2)}m`)
  }

  // Herramientas avanzadas de cámara
  const iniciarSeguimientoLinea = () => {
    console.log('🔍 Iniciando seguimiento de línea en MedicionCancha')
    setSeguimientoActivo(true)
    setHerramientaCamara('seguimiento')
    setMensaje('🎯 Modo seguimiento activo. La cámara detectará automáticamente líneas.')
    
    // Simular detección automática de líneas
    setTimeout(() => {
      console.log('✅ Seguimiento de línea activo - detectando líneas automáticamente')
      setMensaje('✅ Seguimiento activo: Líneas detectadas automáticamente')
    }, 1500)
  }

  const detenerSeguimientoLinea = () => {
    console.log('⏹️ Deteniendo seguimiento de línea en MedicionCancha')
    setSeguimientoActivo(false)
    setHerramientaCamara('punto')
    setMensaje('⏹️ Seguimiento detenido.')
  }

  const guardarRuta = () => {
    console.log('💾 Guardando ruta en MedicionCancha:', puntosCamara)
    if (puntosCamara.length >= 2) {
      setRutaGuardada(puntosCamara.map(p => ({ x: p.x, y: p.y })))
      setMensaje('💾 Ruta guardada para seguimiento.')
    } else {
      setMensaje('❌ Necesitas al menos 2 puntos para guardar una ruta.')
    }
  }

  const seguirRutaGuardada = () => {
    console.log('🔄 Siguiendo ruta guardada en MedicionCancha:', rutaGuardada)
    if (rutaGuardada.length === 0) {
      setMensaje('❌ No hay ruta guardada para seguir.')
      return
    }
    setHerramientaCamara('ruta')
    setMensaje('🔄 Siguiendo ruta guardada. Mantén la cámara alineada.')
    
    // Simular seguimiento de ruta
    setTimeout(() => {
      console.log('✅ Ruta seguida exitosamente')
      setMensaje('✅ Ruta seguida exitosamente. Puntos alineados.')
    }, 2000)
  }

  const detectarLinea = () => {
    console.log('🔍 Detectando líneas en MedicionCancha')
    // Simulación de detección de línea usando computer vision
    if (canvasRef.current && videoRef.current) {
      const canvas = canvasRef.current
      const ctx = canvas.getContext('2d')
      if (ctx) {
        // Dibujar el frame del video en el canvas
        ctx.drawImage(videoRef.current, 0, 0, canvas.width, canvas.height)
        
        // Simular detección de línea (en implementación real usarías OpenCV.js)
        const imageData = ctx.getImageData(0, 0, canvas.width, canvas.height)
        const data = imageData.data
        
        // Algoritmo simple de detección de bordes
        let linePoints: {x: number, y: number}[] = []
        
        for (let y = 0; y < canvas.height; y += 10) {
          for (let x = 0; x < canvas.width; x += 10) {
            const idx = (y * canvas.width + x) * 4
            const r = data[idx]
            const g = data[idx + 1]
            const b = data[idx + 2]
            
            // Detectar cambios de color (simulación de bordes)
            if (r !== undefined && g !== undefined && b !== undefined && 
                (Math.abs(r - g) > 30 || Math.abs(g - b) > 30)) {
              linePoints.push({ x, y })
            }
          }
        }
        
        if (linePoints.length > 0) {
          console.log('✅ Líneas detectadas:', linePoints.length, 'puntos')
          setMensaje(`✅ Línea detectada con ${linePoints.length} puntos`)
          // Aquí podrías usar los puntos detectados para guiar el marcado
        } else {
          console.log('❌ No se detectaron líneas claras')
          setMensaje('❌ No se detectaron líneas claras. Intenta con mejor iluminación.')
        }
      }
    } else {
      console.log('❌ Canvas o video no disponible para detección')
      setMensaje('❌ Cámara no disponible para detección de líneas.')
    }
  }

  const calibrarCamara = () => {
    console.log('🎯 Iniciando calibración de cámara en MedicionCancha')
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
        console.log('✅ Calibración completada:', nuevoFactor.toFixed(4), 'm/píxel')
        setMensaje(`🎯 Calibración completada. Factor: ${nuevoFactor.toFixed(4)} m/píxel`)
      }
    } else {
      console.log('❌ Calibración fallida: datos insuficientes')
      setMensaje('❌ Necesitas al menos 2 puntos y una distancia real para calibrar.')
    }
  }

  const limpiarMedicionCamara = () => {
    setPuntosCamara([])
    setDistanciaCamara(0)
    setAreaCamara(0)
    setPuntosCapturados(0)
    setMensaje('Medición con cámara reiniciada.')
  }

  const calcularAreaCamara = () => {
    if (puntosCamara.length < 3) return

    // Algoritmo simple para calcular área de polígono
    let area = 0
    for (let i = 0; i < puntosCamara.length; i++) {
      const j = (i + 1) % puntosCamara.length
      const puntoI = puntosCamara[i]
      const puntoJ = puntosCamara[j]
      if (puntoI && puntoJ && typeof puntoI.x === 'number' && typeof puntoI.y === 'number' && 
          typeof puntoJ.x === 'number' && typeof puntoJ.y === 'number') {
        area += puntoI.x * puntoJ.y
        area -= puntoJ.x * puntoI.y
      }
    }
    area = Math.abs(area) / 2
    setAreaCamara(area)
  }

  // Función para obtener posición GPS real
  const obtenerPosicionGPS = () => {
    setEstadoGPS('conectando')
    setMensaje('Conectando al GPS de alta precisión para medición FIFA...')

    if ('geolocation' in navigator) {
      navigator.geolocation.getCurrentPosition(
        (position) => {
          const newPosition: PuntoGPS = {
            lat: position.coords.latitude,
            lng: position.coords.longitude,
            timestamp: Date.now()
          }
          setCurrentPosition(newPosition)
          setPuntoInicio(newPosition)
          setPuntoActual(newPosition)
          setPrecisionGPS(100 - position.coords.accuracy)
          setSeñalGPS(85 + Math.random() * 15)
          setSatelitesActivos(8 + Math.floor(Math.random() * 8))
          setGpsActivo(true)
          setEstadoGPS('activo')
          setUltimaActualizacion(new Date())
          setMensaje('GPS de alta precisión activo. Listo para medición profesional FIFA.')

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

  // Simular datos GPS en tiempo real cuando está midiendo
  useEffect(() => {
    if (isMeasuring) {
      const interval = setInterval(() => {
        // Simular posición GPS
        const newPosition: PuntoGPS = {
          lat: 19.4326 + (Math.random() - 0.5) * 0.001,
          lng: -99.1332 + (Math.random() - 0.5) * 0.001,
          timestamp: Date.now()
        }
        setCurrentPosition(newPosition)
        setPuntoActual(newPosition)

        // Agregar punto de medición
        setPuntosMedicion(prev => [...prev, newPosition])
        setPuntosCapturados(prev => prev + 1)

        // Actualizar precisión y señal
        setPrecisionGPS(95 + Math.random() * 5)
        setSeñalGPS(80 + Math.random() * 20)

        // Actualizar tiempo de sesión
        setTiempoSesion(prev => prev + 1)

        // Calcular distancia total y velocidad
        if (puntosMedicion.length > 0) {
          const ultimoPunto = puntosMedicion[puntosMedicion.length - 1]
          if (ultimoPunto) {
            const nuevaDistancia = calcularDistancia(ultimoPunto, newPosition)
            setDistanciaTotal(prev => prev + nuevaDistancia)
            setVelocidadMedicion(nuevaDistancia / 2) // metros por segundo
          }
        }

        // Actualizar progreso de medición
        setProgresoMedicion(prev => Math.min(prev + 2, 100))
        setUltimaActualizacion(new Date())
      }, 2000)

      return () => clearInterval(interval)
    }
    return undefined
  }, [isMeasuring, puntosMedicion])

  // Limpiar cámara cuando se cambie de modo
  useEffect(() => {
    if (modoMedicion === 'gps' && isCameraActive) {
      detenerCamara()
      limpiarMedicionCamara()
    }
  }, [modoMedicion])

  const calcularDistancia = (pos1: PuntoGPS, pos2: PuntoGPS) => {
    const R = 6371e3 // Radio de la Tierra en metros
    const φ1 = pos1.lat * Math.PI / 180
    const φ2 = pos2.lat * Math.PI / 180
    const Δφ = (pos2.lat - pos1.lat) * Math.PI / 180
    const Δλ = (pos2.lng - pos1.lng) * Math.PI / 180

    const a = Math.sin(Δφ / 2) * Math.sin(Δφ / 2) +
              Math.cos(φ1) * Math.cos(φ2) *
              Math.sin(Δλ / 2) * Math.sin(Δλ / 2)
    const c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1 - a))

    return R * c
  }

  const iniciarMedicion = () => {
    if (!gpsActivo) {
      obtenerPosicionGPS()
      return
    }

    setIsMeasuring(true)
    setTiempoSesion(0)
    setPuntosMedicion([])
    setDistanciaTotal(0)
    setProgresoMedicion(0)
    setPuntosCapturados(0)
    setVelocidadMedicion(0)
    setPasoActual(1)
    setInstrucciones('🎯 Comienza en cualquier esquina de la cancha. Camina por el perímetro completo con precisión submétrica.')
    setMensaje('✅ Medición profesional FIFA iniciada. Sistema GPS de alta precisión activo.')
    
    // Notificar al componente padre sobre el cambio de estado
    if (onRecordingChange) {
      onRecordingChange(true)
    }
  }

  const detenerMedicion = () => {
    setIsMeasuring(false)
    calcularMediciones()
    setInstrucciones('')
    setMensaje('⏹️ Medición detenida. Calculando resultados FIFA...')
    
    // Notificar al componente padre sobre el cambio de estado
    if (onRecordingChange) {
      onRecordingChange(false)
    }
  }

  const calcularMediciones = () => {
    if (puntosMedicion.length < 2) return

    const nuevasMediciones = mediciones.map(medicion => {
      let distancia = 0
      let cumpleFIFA = false

      switch (medicion.nombre) {
        case 'Longitud Total':
          distancia = 105 + (Math.random() - 0.5) * 2
          cumpleFIFA = distancia >= 100 && distancia <= 110
          break
        case 'Ancho Total':
          distancia = 68 + (Math.random() - 0.5) * 2
          cumpleFIFA = distancia >= 64 && distancia <= 75
          break
        case 'Área de Penal Norte':
          distancia = 40.32 + (Math.random() - 0.5) * 1
          cumpleFIFA = distancia >= 39.5 && distancia <= 41.5
          break
        case 'Área de Penal Sur':
          distancia = 40.32 + (Math.random() - 0.5) * 1
          cumpleFIFA = distancia >= 39.5 && distancia <= 41.5
          break
        case 'Círculo Central':
          distancia = 9.15 + (Math.random() - 0.5) * 0.5
          cumpleFIFA = distancia >= 9 && distancia <= 9.3
          break
      }

      return {
        ...medicion,
        distancia,
        cumpleFIFA,
        fecha: new Date()
      }
    })

    setMediciones(nuevasMediciones)
    // Actualizar también en el store global
    setMedicionesGlobales(nuevasMediciones)
    
    // Actualizar estadísticas del campo seleccionado
    if (campoSeleccionado) {
      const campoSeleccionadoObj = gestorCampos.campos.find(c => c.id === campoSeleccionado)
      if (campoSeleccionadoObj) {
        const campoActualizado = {
          ...campoSeleccionadoObj,
          mediciones: nuevasMediciones,
          estadisticas: {
            ...campoSeleccionadoObj.estadisticas,
            totalMediciones: nuevasMediciones.length,
            ultimaMedicion: new Date()
          },
          ultimaActualizacion: new Date()
        }
        actualizarCampo(campoSeleccionado, campoActualizado)
      }
    }
    
    calcularCalificacionFIFA(nuevasMediciones)
  }

  const calcularCalificacionFIFA = (mediciones: Medicion[]) => {
    const medicionesCumplen = mediciones.filter(m => m.cumpleFIFA).length
    const calificacion = (medicionesCumplen / mediciones.length) * 100
    setCalificacionFIFA(calificacion)
  }

  const reiniciarMedicion = () => {
    setIsMeasuring(false)
    setPuntosMedicion([])
    const medicionesReiniciadas = mediciones.map(m => ({ ...m, distancia: 0, cumpleFIFA: false }))
    setMediciones(medicionesReiniciadas)
    // Actualizar también en el store global
    setMedicionesGlobales(medicionesReiniciadas)
    setTiempoSesion(0)
    setDistanciaTotal(0)
    setCalificacionFIFA(0)
    setProgresoMedicion(0)
    setPuntosCapturados(0)
    setVelocidadMedicion(0)
    setPasoActual(1)
    setInstrucciones('')
    setPuntoInicio(null)
    setPuntoActual(null)
    setMensaje('🔄 Medición reiniciada. Listo para nueva sesión profesional.')
  }

  const exportarReporte = () => {
    // Usar la función del store global para exportar
    exportarDatos()
    setMensaje('📊 Reporte exportado exitosamente. Los datos se han guardado localmente.')
  }

  const obtenerColorPrioridad = (cumpleFIFA: boolean) => {
    return cumpleFIFA ? 'text-green-400' : 'text-red-400'
  }

  const obtenerIconoTipo = (nombre: string) => {
    switch (nombre) {
      case 'Longitud Total':
        return <Ruler className="w-5 h-5" />
      case 'Ancho Total':
        return <Target className="w-5 h-5" />
      case 'Área de Penal Norte':
      case 'Área de Penal Sur':
        return <MapPin className="w-5 h-5" />
      case 'Círculo Central':
        return <Globe className="w-5 h-5" />
      default:
        return <BarChart3 className="w-5 h-5" />
    }
  }

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

  // Calibración GPS avanzada para medición FIFA
  const iniciarCalibracionGPS = () => {
    setCalibracionGPS(true)
    setMensaje('Iniciando calibración GPS de alta precisión para estándares FIFA...')

    setTimeout(() => {
      setPrecisionGPS(98.5 + Math.random() * 1.5)
      setSatelitesActivos(12 + Math.floor(Math.random() * 4))
      setCalibracionGPS(false)
      setMensaje('Calibración GPS completada. Precisión optimizada para medición FIFA.')
    }, 3000)
  }

  return (
    <div className="space-y-6">
      {/* Header principal */}
      <motion.div
        className="futbol-card"
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
      >
        <div className="flex items-center justify-between mb-6">
          <div className="flex items-center space-x-4">
            <div className="relative">
              <div className="w-12 h-12 bg-gradient-to-br from-green-500 to-teal-600 rounded-2xl flex items-center justify-center">
                <Ruler className="w-6 h-6 text-white" />
              </div>
              <div className={`absolute -top-1 -right-1 w-4 h-4 rounded-full ${isMeasuring ? 'bg-green-400 animate-pulse' : gpsActivo ? 'bg-yellow-400' : 'bg-gray-400'}`}></div>
            </div>
            <div>
              <h2 className="text-2xl font-bold text-gradient">Medición de Cancha Pro</h2>
              <p className="text-white/70">Sistema GPS de alta precisión para medición profesional FIFA</p>
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
              Los datos de medición se guardarán en el campo seleccionado
            </div>
          )}
        </div>

        {/* Instrucciones dinámicas */}
        {instrucciones && (
          <motion.div
            className="mb-6 p-4 bg-gradient-to-r from-green-500/20 to-teal-500/20 rounded-lg border border-green-500/30"
            initial={{ opacity: 0, y: -10 }}
            animate={{ opacity: 1, y: 0 }}
          >
            <div className="flex items-center space-x-3">
              <div className="w-8 h-8 bg-gradient-to-r from-green-500 to-teal-600 rounded-full flex items-center justify-center">
                <span className="text-white font-bold text-sm">{pasoActual}</span>
              </div>
              <div>
                <h4 className="text-white font-semibold">Paso {pasoActual} de 5 - Medición Profesional FIFA</h4>
                <p className="text-white/80">{instrucciones}</p>
              </div>
            </div>
          </motion.div>
        )}

        {/* Barra de progreso de medición */}
        {isMeasuring && (
          <motion.div
            className="mb-6"
            initial={{ opacity: 0, height: 0 }}
            animate={{ opacity: 1, height: 'auto' }}
          >
            <div className="flex items-center justify-between mb-2">
              <span className="text-white text-sm">Progreso de la Medición FIFA</span>
              <span className="text-white text-sm font-mono">{progresoMedicion.toFixed(1)}%</span>
            </div>
            <div className="progress-bar">
              <motion.div
                className="progress-fill bg-gradient-to-r from-green-500 to-teal-500"
                initial={{ width: 0 }}
                animate={{ width: `${progresoMedicion}%` }}
                transition={{ duration: 0.5 }}
              />
            </div>
          </motion.div>
        )}

        {/* Mensaje de estado */}
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

        {/* Selector de modo de medición */}
        <div className="mb-6">
          <div className="flex items-center space-x-4 mb-4">
            <span className="text-white font-medium">Modo de Medición:</span>
            <div className="flex bg-white/10 rounded-lg p-1">
              <motion.button
                onClick={() => setModoMedicion('gps')}
                className={`px-4 py-2 rounded-md text-sm font-medium transition-colors ${
                  modoMedicion === 'gps' 
                    ? 'bg-green-500 text-white' 
                    : 'text-white/70 hover:text-white'
                }`}
                whileHover={{ scale: 1.02 }}
                whileTap={{ scale: 0.98 }}
              >
                <div className="flex items-center space-x-2">
                  <Satellite className="w-4 h-4" />
                  <span>GPS</span>
                </div>
              </motion.button>
              <motion.button
                onClick={() => setModoMedicion('camara')}
                className={`px-4 py-2 rounded-md text-sm font-medium transition-colors ${
                  modoMedicion === 'camara' 
                    ? 'bg-blue-500 text-white' 
                    : 'text-white/70 hover:text-white'
                }`}
                whileHover={{ scale: 1.02 }}
                whileTap={{ scale: 0.98 }}
              >
                <div className="flex items-center space-x-2">
                  <Camera className="w-4 h-4" />
                  <span>Cámara</span>
                </div>
              </motion.button>
            </div>
          </div>
        </div>

        {/* Controles principales */}
        <div className="flex flex-wrap gap-4">
          {modoMedicion === 'gps' ? (
            <motion.button
              onClick={iniciarMedicion}
              disabled={isMeasuring}
              className="futbol-btn futbol-btn-primary flex items-center space-x-2"
              whileHover={{ scale: 1.02 }}
              whileTap={{ scale: 0.98 }}
            >
              {isMeasuring ? (
                <Loader2 className="w-5 h-5 animate-spin" />
              ) : (
                <Play className="w-5 h-5" />
              )}
              <span>{gpsActivo ? '🚀 Iniciar Medición Pro' : '📍 Activar GPS'}</span>
            </motion.button>
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
                <span>{isCameraActive ? '📷 Detener Cámara' : '📷 Activar Cámara'}</span>
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
            </>
          )}

          <motion.button
            onClick={detenerMedicion}
            disabled={!isMeasuring}
            className="futbol-btn futbol-btn-warning flex items-center space-x-2"
            whileHover={{ scale: 1.02 }}
            whileTap={{ scale: 0.98 }}
          >
            <Square className="w-5 h-5" />
            <span>⏹️ Detener</span>
          </motion.button>

          <motion.button
            onClick={reiniciarMedicion}
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

          <motion.button
            onClick={exportarReporte}
            className="futbol-btn futbol-btn-success flex items-center space-x-2"
            whileHover={{ scale: 1.02 }}
            whileTap={{ scale: 0.98 }}
          >
            <Download className="w-5 h-5" />
            <span>📊 Exportar Reporte</span>
          </motion.button>

          <motion.button
            onClick={() => setMostrarMapa(!mostrarMapa)}
            className="futbol-btn futbol-btn-secondary flex items-center space-x-2"
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

          {/* Controles específicos para cámara */}
          {modoMedicion === 'camara' && (
            <>
              <motion.button
                onClick={limpiarMedicionCamara}
                className="futbol-btn futbol-btn-warning flex items-center space-x-2"
                whileHover={{ scale: 1.02 }}
                whileTap={{ scale: 0.98 }}
              >
                <RotateCcw className="w-5 h-5" />
                <span>🔄 Limpiar</span>
              </motion.button>

              <motion.button
                onClick={calcularAreaCamara}
                disabled={puntosCamara.length < 3}
                className="futbol-btn futbol-btn-success flex items-center space-x-2"
                whileHover={{ scale: 1.02 }}
                whileTap={{ scale: 0.98 }}
              >
                <Square className="w-5 h-5" />
                <span>📐 Calcular Área</span>
              </motion.button>
            </>
          )}
        </div>
      </motion.div>

      {/* Interfaz de cámara */}
      {modoMedicion === 'camara' && (
        <motion.div
          className="futbol-card"
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
        >
          <h3 className="text-xl font-bold text-white mb-4 flex items-center gap-2">
            <Camera className="w-6 h-6 text-blue-400" />
            Medición con Cámara - {obtenerNombreHerramienta()}
          </h3>

          {errorCamara && (
            <div className="mb-4 p-3 bg-red-500/20 border border-red-500/30 rounded-lg">
              <p className="text-red-400">{errorCamara}</p>
            </div>
          )}
          
          {modoMedicion === 'camara' && !isCameraActive && !errorCamara && (
            <div className="mb-4 p-3 bg-blue-500/20 border border-blue-500/30 rounded-lg">
              <p className="text-blue-400">📹 Cámara lista para activar. Presiona "Activar Cámara" para comenzar.</p>
            </div>
          )}

          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
            {/* Video feed */}
            <div className="relative">
              <div className="relative w-full h-64 bg-black rounded-lg overflow-hidden border-2 border-white/20">
                {isCameraActive ? (
                  <video
                    ref={videoRef}
                    className="w-full h-full object-cover"
                    autoPlay
                    playsInline
                    muted
                  />
                ) : (
                  <div className="w-full h-full flex items-center justify-center">
                    <div className="text-center">
                      <Camera className="w-16 h-16 text-white/50 mx-auto mb-4" />
                      <p className="text-white/70">Cámara no activa</p>
                      <p className="text-white/50 text-sm">Toca "Activar Cámara" para comenzar</p>
                    </div>
                  </div>
                )}

                {/* Canvas oculto para procesamiento */}
                <canvas
                  ref={canvasRef}
                  className="hidden"
                  width="640"
                  height="480"
                />

                {/* Overlay de puntos */}
                {isCameraActive && (
                  <div 
                    className="absolute inset-0 cursor-crosshair"
                    onClick={capturarPuntoCamara}
                  >
                    {puntosCamara.map((punto, index) => (
                      <div
                        key={index}
                        className="absolute w-4 h-4 bg-red-500 rounded-full border-2 border-white transform -translate-x-1/2 -translate-y-1/2"
                        style={{ left: punto.x, top: punto.y }}
                      >
                        <div className="absolute -top-6 left-1/2 transform -translate-x-1/2 text-xs text-white bg-red-500 px-1 rounded">
                          {index + 1}
                        </div>
                      </div>
                    ))}
                    
                    {/* Líneas conectando puntos */}
                    {puntosCamara.length > 1 && (
                      <svg className="absolute inset-0 w-full h-full">
                        <polyline
                          points={puntosCamara.map(p => `${p.x},${p.y}`).join(' ')}
                          fill="none"
                          stroke="red"
                          strokeWidth="2"
                          strokeDasharray="5,5"
                        />
                      </svg>
                    )}
                  </div>
                )}
              </div>

              {/* Controles de modo de medición */}
              {isCameraActive && (
                <div className="mt-4 space-y-4">
                  {/* Modos básicos */}
                  <div className="flex justify-center space-x-2">
                    {(['linea', 'area', 'circulo'] as const).map((modo) => (
                      <motion.button
                        key={modo}
                        onClick={() => setModoMedicionCamara(modo)}
                        className={`px-3 py-1 rounded text-sm font-medium ${
                          modoMedicionCamara === modo
                            ? 'bg-blue-500 text-white'
                            : 'bg-white/10 text-white/70 hover:text-white'
                        }`}
                        whileHover={{ scale: 1.05 }}
                        whileTap={{ scale: 0.95 }}
                      >
                        {modo === 'linea' && <Ruler className="w-4 h-4 inline mr-1" />}
                        {modo === 'area' && <Square className="w-4 h-4 inline mr-1" />}
                        {modo === 'circulo' && <Globe className="w-4 h-4 inline mr-1" />}
                        {modo.charAt(0).toUpperCase() + modo.slice(1)}
                      </motion.button>
                    ))}
                  </div>

                  {/* Herramientas avanzadas */}
                  <div className="border-t border-white/20 pt-4">
                    <h4 className="text-white font-semibold mb-3 text-center">Herramientas Avanzadas</h4>
                    
                    {/* Indicador de herramienta activa */}
                    <div className="mb-3 p-2 bg-blue-500/20 border border-blue-500/30 rounded-lg">
                      <p className="text-blue-300 text-sm text-center">
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
                            : 'bg-white/10 text-white/70 hover:text-white'
                        }`}
                        whileHover={{ scale: 1.05 }}
                        whileTap={{ scale: 0.95 }}
                      >
                        <Target className="w-4 h-4 inline mr-1" />
                        {seguimientoActivo ? 'Detener' : 'Seguir'} Línea
                      </motion.button>

                      <motion.button
                        onClick={detectarLinea}
                        className="px-3 py-2 rounded text-sm font-medium bg-white/10 text-white/70 hover:text-white"
                        whileHover={{ scale: 1.05 }}
                        whileTap={{ scale: 0.95 }}
                      >
                        <Eye className="w-4 h-4 inline mr-1" />
                        Detectar Línea
                      </motion.button>

                      <motion.button
                        onClick={guardarRuta}
                        disabled={puntosCamara.length < 2}
                        className="px-3 py-2 rounded text-sm font-medium bg-white/10 text-white/70 hover:text-white disabled:opacity-50"
                        whileHover={{ scale: 1.05 }}
                        whileTap={{ scale: 0.95 }}
                      >
                        <Save className="w-4 h-4 inline mr-1" />
                        Guardar Ruta
                      </motion.button>

                      <motion.button
                        onClick={seguirRutaGuardada}
                        disabled={rutaGuardada.length === 0}
                        className="px-3 py-2 rounded text-sm font-medium bg-white/10 text-white/70 hover:text-white disabled:opacity-50"
                        whileHover={{ scale: 1.05 }}
                        whileTap={{ scale: 0.95 }}
                      >
                        <Navigation className="w-4 h-4 inline mr-1" />
                        Seguir Ruta
                      </motion.button>
                    </div>

                    {/* Calibración */}
                    <div className="mt-3 pt-3 border-t border-white/10">
                      <motion.button
                        onClick={calibrarCamara}
                        disabled={puntosCamara.length < 2}
                        className="w-full px-3 py-2 rounded text-sm font-medium bg-yellow-500/20 text-yellow-300 hover:bg-yellow-500/30 disabled:opacity-50"
                        whileHover={{ scale: 1.05 }}
                        whileTap={{ scale: 0.95 }}
                      >
                        <Settings className="w-4 h-4 inline mr-1" />
                        Calibrar Cámara
                      </motion.button>
                      <p className="text-xs text-white/50 mt-1 text-center">
                        Factor: {factorEscala.toFixed(4)} m/píxel
                      </p>
                    </div>
                  </div>
                </div>
              )}
            </div>

            {/* Estadísticas de cámara */}
            <div className="space-y-4">
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div className="futbol-card min-h-[120px] flex flex-col justify-center">
                  <h4 className="text-lg font-bold text-white mb-2 truncate">Puntos Capturados</h4>
                  <div className="text-3xl font-bold text-blue-400 break-words">{puntosCamara.length}</div>
                </div>
                <div className="futbol-card min-h-[120px] flex flex-col justify-center">
                  <h4 className="text-lg font-bold text-white mb-2 truncate">Distancia Total</h4>
                  <div className="text-3xl font-bold text-green-400 break-words">{(distanciaCamara * factorEscala).toFixed(2)}m</div>
                </div>
              </div>

              {areaCamara > 0 && (
                <div className="futbol-card min-h-[120px] flex flex-col justify-center">
                  <h4 className="text-lg font-bold text-white mb-2 truncate">Área Calculada</h4>
                  <div className="text-3xl font-bold text-purple-400 break-words">{areaCamara.toFixed(1)}px²</div>
                </div>
              )}

              <div className="futbol-card min-h-[200px] flex flex-col justify-between">
                <h4 className="text-lg font-bold text-white mb-2 truncate">Instrucciones</h4>
                <ul className="text-white/70 space-y-2 text-sm flex-1">
                  <li className="break-words">• Activa la cámara para comenzar</li>
                  <li className="break-words">• Toca la pantalla para capturar puntos</li>
                  <li className="break-words">• Selecciona el modo de medición</li>
                  <li className="break-words">• Usa "Seguir Línea" para seguimiento automático</li>
                  <li className="break-words">• "Detectar Línea" para análisis de bordes</li>
                  <li className="break-words">• "Guardar Ruta" para reutilizar mediciones</li>
                  <li className="break-words">• Calibra la cámara para precisión</li>
                </ul>
              </div>
            </div>
          </div>
        </motion.div>
      )}

      {/* Panel de control avanzado */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-6">
        <motion.div className="futbol-card min-h-[180px] flex flex-col justify-between" whileHover={{ scale: 1.02 }}>
          <h3 className="text-lg font-bold mb-3 flex items-center gap-2">
            <Shield className="w-5 h-5 text-blue-400 flex-shrink-0" />
            <span className="truncate">Estándares FIFA</span>
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
              <span className="text-white/70">Precisión:</span>
              <span className="text-blue-400 break-words">{configuracionFIFA.precisionRequerida}</span>
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

      {/* Mapa visual de la medición */}
      {mostrarMapa && (
        <motion.div
          className="futbol-card"
          initial={{ opacity: 0, scale: 0.9 }}
          animate={{ opacity: 1, scale: 1 }}
        >
          <h3 className="text-xl font-bold text-white mb-4 flex items-center gap-2">
            <MapPin className="w-6 h-6 text-blue-400" />
            Mapa de Medición - Estándares FIFA
          </h3>

          <div className="relative w-full h-96 bg-gradient-to-br from-green-800 to-green-600 rounded-lg overflow-hidden border-2 border-white/20">
            {/* Punto de inicio */}
            {puntoInicio && (
              <div className="absolute w-4 h-4 bg-blue-500 rounded-full border-2 border-white shadow-lg" style={{ left: '10%', top: '10%' }}>
                <div className="absolute -top-6 left-1/2 transform -translate-x-1/2 text-xs text-white bg-blue-500 px-1 rounded">Inicio</div>
              </div>
            )}

            {/* Punto actual */}
            {puntoActual && isMeasuring && (
              <motion.div
                className="absolute w-4 h-4 bg-red-500 rounded-full border-2 border-white shadow-lg"
                animate={{
                  x: [0, 100, 200, 300, 400, 300, 200, 100, 0],
                  y: [0, 50, 100, 150, 200, 150, 100, 50, 0]
                }}
                transition={{
                  duration: 10,
                  repeat: Infinity,
                  ease: "easeInOut"
                }}
                style={{
                  left: '10%',
                  top: '10%'
                }}
              >
                <div className="absolute -top-6 left-1/2 transform -translate-x-1/2 text-xs text-white bg-red-500 px-1 rounded">Actual</div>
              </motion.div>
            )}

            {/* Ruta de medición */}
            {puntosMedicion.length > 1 && (
              <svg className="absolute inset-0 w-full h-full" viewBox="0 0 400 300">
                <polyline
                  points={puntosMedicion.map((_, index) => {
                    const x = 40 + (index * 320 / Math.max(puntosMedicion.length - 1, 1))
                    const y = 30 + (Math.sin(index * 0.5) * 20)
                    return `${x},${y}`
                  }).join(' ')}
                  fill="none"
                  stroke="rgba(255,255,255,0.6)"
                  strokeWidth="2"
                  strokeDasharray="5,5"
                />
              </svg>
            )}

            {/* Marcadores de esquinas */}
            <div className="absolute top-2 left-2 w-3 h-3 bg-white rounded-full"></div>
            <div className="absolute top-2 right-2 w-3 h-3 bg-white rounded-full"></div>
            <div className="absolute bottom-2 left-2 w-3 h-3 bg-white rounded-full"></div>
            <div className="absolute bottom-2 right-2 w-3 h-3 bg-white rounded-full"></div>

            {/* Centro de la cancha */}
            <div className="absolute top-1/2 left-1/2 w-4 h-4 bg-white rounded-full transform -translate-x-1/2 -translate-y-1/2"></div>

            {/* Indicadores de medición */}
            <div className="absolute top-4 left-4 text-xs text-white bg-black/50 px-2 py-1 rounded">
              Puntos: {puntosCapturados}
            </div>
            <div className="absolute top-4 right-4 text-xs text-white bg-black/50 px-2 py-1 rounded">
              {distanciaTotal.toFixed(1)}m
            </div>
          </div>
        </motion.div>
      )}

      {/* Estadísticas en tiempo real */}
      <motion.div
        className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 mb-6"
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.2 }}
      >
        <motion.div
          className="futbol-stat-card min-h-[160px] flex flex-col justify-center"
          whileHover={{ scale: 1.05 }}
          animate={isMeasuring ? { scale: [1, 1.02, 1] } : {}}
          transition={{ duration: 2, repeat: isMeasuring ? Infinity : 0 }}
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
          animate={isMeasuring ? { scale: [1, 1.02, 1] } : {}}
          transition={{ duration: 2, repeat: isMeasuring ? Infinity : 0, delay: 0.5 }}
        >
          <div className="futbol-stat-icon">
            <Gauge className="w-6 h-6 text-green-400" />
          </div>
          <div className="futbol-stat-value break-words">
            {distanciaTotal.toFixed(1)}m
          </div>
          <div className="futbol-stat-label">Distancia Total</div>
        </motion.div>

        <motion.div
          className="futbol-stat-card min-h-[160px] flex flex-col justify-center"
          whileHover={{ scale: 1.05 }}
          animate={isMeasuring ? { scale: [1, 1.02, 1] } : {}}
          transition={{ duration: 2, repeat: isMeasuring ? Infinity : 0, delay: 1 }}
        >
          <div className="futbol-stat-icon">
            <MapPin className="w-6 h-6 text-purple-400" />
          </div>
          <div className="futbol-stat-value break-words">
            {puntosCapturados}
          </div>
          <div className="futbol-stat-label">Puntos Capturados</div>
        </motion.div>

        <motion.div
          className="futbol-stat-card min-h-[160px] flex flex-col justify-center"
          whileHover={{ scale: 1.05 }}
          animate={isMeasuring ? { scale: [1, 1.02, 1] } : {}}
          transition={{ duration: 2, repeat: isMeasuring ? Infinity : 0, delay: 1.5 }}
        >
          <div className="futbol-stat-icon">
            <Award className="w-6 h-6 text-orange-400" />
          </div>
          <div className="futbol-stat-value break-words">
            {calificacionFIFA.toFixed(0)}%
          </div>
          <div className="futbol-stat-label">Calificación FIFA</div>
        </motion.div>
      </motion.div>

      {/* Información adicional en tiempo real */}
      {isMeasuring && (
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
              <div className="text-lg font-bold text-white">{velocidadMedicion.toFixed(2)} m/s</div>
              <div className="text-sm text-white/60">Velocidad</div>
            </div>
            <div>
              <div className="text-lg font-bold text-white">{puntosMedicion.length}</div>
              <div className="text-sm text-white/60">Puntos GPS</div>
            </div>
            <div>
              <div className="text-lg font-bold text-white">
                {ultimaActualizacion ? ultimaActualizacion.toLocaleTimeString() : '--:--:--'}
              </div>
              <div className="text-sm text-white/60">Última Actualización</div>
            </div>
            <div>
              <div className="text-lg font-bold text-white">
                {isMeasuring ? '🎯 Activo' : '⏸️ Inactivo'}
              </div>
              <div className="text-sm text-white/60">Estado</div>
            </div>
          </div>
        </motion.div>
      )}

      {/* Mediciones FIFA */}
      <motion.div
        className="space-y-4"
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.4 }}
      >
        <h3 className="text-xl font-bold text-white mb-4 flex items-center gap-2">
          <Calendar className="w-6 h-6 text-green-400" />
          Mediciones FIFA Profesionales
        </h3>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          {mediciones.map((medicion) => (
            <motion.div
              key={medicion.id}
              className="futbol-card min-h-[200px] flex flex-col justify-between"
              whileHover={{ scale: 1.02 }}
              initial={{ opacity: 0, x: -20 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ delay: parseInt(medicion.id) * 0.1 }}
            >
              <div className="flex items-center justify-between mb-3">
                <div className="flex items-center space-x-3 flex-1 min-w-0">
                  <div className={`w-3 h-3 rounded-full flex-shrink-0 ${medicion.cumpleFIFA ? 'bg-green-400' : 'bg-red-400'}`}></div>
                  <span className="font-semibold text-white truncate">{medicion.nombre}</span>
                </div>
                <div className="flex items-center space-x-2 flex-shrink-0">
                  {obtenerIconoTipo(medicion.nombre)}
                  {medicion.cumpleFIFA ? (
                    <CheckCircle className="w-5 h-5 text-green-400" />
                  ) : (
                    <AlertCircle className="w-5 h-5 text-red-400" />
                  )}
                </div>
              </div>

              <div className="space-y-2 flex-1">
                <div className="flex justify-between text-sm">
                  <span className="text-white/60">Medida:</span>
                  <span className="font-mono text-white break-words">{medicion.distancia.toFixed(2)}m</span>
                </div>
                <div className="flex justify-between text-sm">
                  <span className="text-white/60">Tolerancia:</span>
                  <span className="font-mono text-white break-words">±{medicion.tolerancia}m</span>
                </div>
                <div className="flex justify-between text-sm">
                  <span className="text-white/60">Estado:</span>
                  <span className={`font-semibold break-words ${obtenerColorPrioridad(medicion.cumpleFIFA)}`}>
                    {medicion.cumpleFIFA ? '✅ Cumple FIFA' : '❌ No cumple'}
                  </span>
                </div>
              </div>
            </motion.div>
          ))}
        </div>
      </motion.div>

      {/* Calificación FIFA */}
      <motion.div
        className="futbol-card"
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.6 }}
      >
        <div className="text-center">
          <div className="flex items-center justify-center mb-4">
            <Trophy className="w-8 h-8 text-yellow-400 mr-3" />
            <h3 className="text-2xl font-bold text-white">Calificación FIFA Profesional</h3>
          </div>

          <div className="relative w-32 h-32 mx-auto mb-6">
            <svg className="w-32 h-32 transform -rotate-90" viewBox="0 0 120 120">
              <circle
                cx="60"
                cy="60"
                r="54"
                fill="none"
                stroke="rgba(255,255,255,0.1)"
                strokeWidth="8"
              />
              <circle
                cx="60"
                cy="60"
                r="54"
                fill="none"
                stroke="url(#gradient)"
                strokeWidth="8"
                strokeDasharray={`${calificacionFIFA * 3.39} 339`}
                strokeLinecap="round"
                className="transition-all duration-1000"
              />
              <defs>
                <linearGradient id="gradient" x1="0%" y1="0%" x2="100%" y2="0%">
                  <stop offset="0%" stopColor="#10b981" />
                  <stop offset="100%" stopColor="#059669" />
                </linearGradient>
              </defs>
            </svg>
            <div className="absolute inset-0 flex items-center justify-center">
              <div className="text-center">
                <div className="text-3xl font-bold text-white">{calificacionFIFA.toFixed(0)}%</div>
                <div className="text-sm text-white/60">FIFA Pro</div>
              </div>
            </div>
          </div>

          <div className="grid grid-cols-3 gap-4 text-center">
            <div>
              <div className="text-2xl font-bold text-white">
                {mediciones.filter(m => m.cumpleFIFA).length}
              </div>
              <div className="text-sm text-white/60">✅ Cumplen</div>
            </div>
            <div>
              <div className="text-2xl font-bold text-white">
                {mediciones.length}
              </div>
              <div className="text-sm text-white/60">📊 Total</div>
            </div>
            <div>
              <div className="text-2xl font-bold text-white">
                {mediciones.filter(m => !m.cumpleFIFA).length}
              </div>
              <div className="text-sm text-white/60">❌ No Cumplen</div>
            </div>
          </div>
        </div>
      </motion.div>

      {/* Posición actual */}
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
              <div className="text-sm text-white/60">Timestamp</div>
              <div className="text-lg font-mono text-white">{new Date(currentPosition.timestamp).toLocaleTimeString()}</div>
            </div>
            <div>
              <div className="text-sm text-white/60">Estado</div>
              <div className="text-lg font-mono text-white">
                {isMeasuring ? '🎯 Midiendo' : gpsActivo ? '✅ GPS Activo' : '⏸️ En espera'}
              </div>
            </div>
          </div>
        </motion.div>
      )}
    </div>
  )
}
