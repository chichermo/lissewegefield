'use client'

import { motion } from 'framer-motion'
import {
    AlertTriangle,
    Check,
    Eye, EyeOff,
    Loader2,
    Navigation,
    Target,
    X
} from 'lucide-react'
import { useEffect, useState } from 'react'
import { ElementoCancha, MedicionElemento, PuntoGPS } from '../../types'

export default function MedicionAvanzada() {
  // Estados principales
  const [isMeasuring, setIsMeasuring] = useState(false)
  const [gpsActivo, setGpsActivo] = useState(false)
  const [currentPosition, setCurrentPosition] = useState<PuntoGPS | null>(null)
  const [estadoGPS, setEstadoGPS] = useState<'inactivo' | 'conectando' | 'activo' | 'error'>('inactivo')

  // Estados de medición avanzada
  const [elementosCancha] = useState<ElementoCancha[]>([
    {
      id: 1,
      nombre: 'Línea Lateral',
      tipo: 'linea_lateral',
      descripcion: 'Medir la longitud de las líneas laterales con precisión submétrica',
      medicionFIFA: { largo: 100 },
      instrucciones: ['Posicionarse en un extremo', 'Caminar hasta el otro extremo', 'Registrar la distancia'],
      color: '#3B82F6',
      icono: 'Ruler'
    },
    {
      id: 2,
      nombre: 'Línea de Fondo',
      tipo: 'linea_fondo',
      descripcion: 'Medir la longitud de las líneas de fondo con verificación FIFA',
      medicionFIFA: { largo: 68 },
      instrucciones: ['Posicionarse en una esquina', 'Caminar hasta la esquina opuesta', 'Registrar la distancia'],
      color: '#10B981',
      icono: 'Ruler'
    },
    {
      id: 3,
      nombre: 'Línea Central',
      tipo: 'linea_central',
      descripcion: 'Medir la línea central que divide la cancha con precisión milimétrica',
      medicionFIFA: { largo: 68 },
      instrucciones: ['Posicionarse en un lateral', 'Caminar hasta el lateral opuesto', 'Registrar la distancia'],
      color: '#F59E0B',
      icono: 'Ruler'
    },
    {
      id: 4,
      nombre: 'Área Penal',
      tipo: 'area_penal',
      descripcion: 'Medir el área penal (rectángulo) con estándares FIFA',
      medicionFIFA: { largo: 16.5, ancho: 40.32 },
      instrucciones: ['Medir el largo del área', 'Medir el ancho del área', 'Calcular el área total'],
      color: '#EF4444',
      icono: 'Square'
    },
    {
      id: 5,
      nombre: 'Área de Meta',
      tipo: 'area_meta',
      descripcion: 'Medir el área de meta (rectángulo pequeño) con precisión profesional',
      medicionFIFA: { largo: 5.5, ancho: 18.32 },
      instrucciones: ['Medir el largo del área', 'Medir el ancho del área', 'Calcular el área total'],
      color: '#8B5CF6',
      icono: 'Square'
    },
    {
      id: 6,
      nombre: 'Círculo Central',
      tipo: 'circulo_central',
      descripcion: 'Medir el radio del círculo central con precisión submétrica',
      medicionFIFA: { radio: 9.15 },
      instrucciones: ['Posicionarse en el centro', 'Caminar hasta el borde del círculo', 'Registrar el radio'],
      color: '#06B6D4',
      icono: 'Circle'
    },
    {
      id: 7,
      nombre: 'Arco Penal',
      tipo: 'arco_penal',
      descripcion: 'Medir el arco del área penal con estándares FIFA',
      medicionFIFA: { radio: 9.15 },
      instrucciones: ['Posicionarse en el punto penal', 'Medir el arco desde el poste', 'Registrar el radio'],
      color: '#F97316',
      icono: 'Circle'
    },
    {
      id: 8,
      nombre: 'Línea de Meta',
      tipo: 'linea_meta',
      descripcion: 'Medir la línea de meta (entre los postes) con precisión profesional',
      medicionFIFA: { largo: 7.32 },
      instrucciones: ['Posicionarse en un poste', 'Medir hasta el poste opuesto', 'Registrar la distancia'],
      color: '#EC4899',
      icono: 'Ruler'
    }
  ])


  const [puntosMedicion, setPuntosMedicion] = useState<PuntoGPS[]>([])
  const [elementoActual, setElementoActual] = useState<ElementoCancha | null>(null)
  const [pasoActual, setPasoActual] = useState(0)
  const [puntosCapturados, setPuntosCapturados] = useState(0)
    

  const [elementosMedicion, setElementosMedicion] = useState<MedicionElemento[]>([])
  const [progresoTotal] = useState(0)
  const [mostrarMapa, setMostrarMapa] = useState(false)
  const [instrucciones, setInstrucciones] = useState('')

  // Función para obtener posición GPS
  const obtenerPosicionGPS = () => {
    setEstadoGPS('conectando')


    if ('geolocation' in navigator) {
      navigator.geolocation.getCurrentPosition(
        (position) => {
          const newPosition: PuntoGPS = {
            lat: position.coords.latitude,
            lng: position.coords.longitude,
            timestamp: Date.now()
          }
          setCurrentPosition(newPosition)
          setGpsActivo(true)
          setEstadoGPS('activo')


          // Simular datos ambientales
        },
        (error) => {
          console.error('Error obteniendo posición:', error)
          setEstadoGPS('error')

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

      setGpsActivo(false)
    }
  }



  const iniciarMedicionElemento = (elemento: ElementoCancha) => {
    if (!gpsActivo) {
      obtenerPosicionGPS()
      return
    }

    setIsMeasuring(true)
    setElementoActual(elemento)
    setPuntosMedicion([])
    setPasoActual(0)
    setInstrucciones(elemento.instrucciones[0] || '')

  }

  // Función para capturar punto
  const capturarPunto = () => {
    if (!currentPosition || !elementoActual) return

    const nuevosPuntos = [...puntosMedicion, currentPosition]
    setPuntosMedicion(nuevosPuntos)
    setPuntosCapturados(prev => prev + 1)

    // Actualizar instrucciones según el progreso
    if (nuevosPuntos.length < elementoActual.instrucciones.length) {
      setInstrucciones(elementoActual.instrucciones[nuevosPuntos.length] || '')
    }

    // Calcular distancia si hay suficientes puntos
    if (nuevosPuntos.length >= 2) {
      const distancia = calcularDistancia(nuevosPuntos)


      // Verificar si la medición está completa
      if (nuevosPuntos.length >= 3) {
        const medicionCompletada: MedicionElemento = {
          id: Date.now(),
          nombre: elementoActual.nombre,
          tipo: elementoActual.tipo.includes('area') ? 'area' :
                elementoActual.tipo.includes('circulo') ? 'circulo' :
                elementoActual.tipo.includes('arco') ? 'arco' : 'linea',
          puntos: nuevosPuntos,
          distancia,
          completada: true,
          progreso: 100,
          color: elementoActual.color
        }

        setElementosMedicion(prev => [...prev, medicionCompletada])

        setIsMeasuring(false)
        setElementoActual(null)
        setPuntosMedicion([])
        setPasoActual(0)
        setInstrucciones('')
      }
    }
  }

  // Función para calcular distancia
  const calcularDistancia = (puntos: PuntoGPS[]): number => {
    if (puntos.length < 2) return 0

    let distancia = 0
    for (let i = 1; i < puntos.length; i++) {
      const p1 = puntos[i-1]
      const p2 = puntos[i]
      if (p1 && p2) {
        const lat1 = p1.lat
        const lng1 = p1.lng
        const lat2 = p2.lat
        const lng2 = p2.lng

        const R = 6371e3 // Radio de la Tierra en metros
        const φ1 = lat1 * Math.PI / 180
        const φ2 = lat2 * Math.PI / 180
        const Δφ = (lat2 - lat1) * Math.PI / 180
        const Δλ = (lng2 - lng1) * Math.PI / 180

        const a = Math.sin(Δφ / 2) * Math.sin(Δφ / 2) +
                  Math.cos(φ1) * Math.cos(φ2) *
                  Math.sin(Δλ / 2) * Math.sin(Δλ / 2)
        const c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1 - a))

        distancia += R * c
      }
    }
    return distancia
  }



  // Función para verificar cumplimiento FIFA
  const verificarFIFA = (elemento: MedicionElemento, elementoCancha: ElementoCancha) => {
    const medicionFIFA = elementoCancha.medicionFIFA
    const tolerancia = 0.5 // 50cm de tolerancia

    if (elemento.tipo === 'linea' && medicionFIFA.largo) {
      return Math.abs(elemento.distancia - medicionFIFA.largo) <= tolerancia
    } else if (elemento.tipo === 'circulo' && medicionFIFA.radio) {
      return Math.abs(elemento.radio! - medicionFIFA.radio) <= tolerancia
    }

    return true
  }

  // Función para obtener icono de estado GPS
  const obtenerIconoEstadoGPS = () => {
    switch (estadoGPS) {
      case 'activo': return <Check className="w-4 h-4 text-green-400" />
      case 'conectando': return <Loader2 className="w-4 h-4 animate-spin text-yellow-400" />
      case 'error': return <X className="w-4 h-4 text-red-400" />
      default: return <AlertTriangle className="w-4 h-4 text-gray-400" />
    }
  }

  // Eliminar la función obtenerColorElemento
  // const obtenerColorElemento = (elemento: ElementoCancha) => {
  //   return elemento.color
  // }

  // Simulación de medición en tiempo real
  useEffect(() => {
    if (isMeasuring && elementoActual) {
      const interval = setInterval(() => {
        // Simular movimiento GPS
        if (currentPosition) {
          const nuevaLat = currentPosition.lat + (Math.random() - 0.5) * 0.0001
          const nuevaLng = currentPosition.lng + (Math.random() - 0.5) * 0.0001
          setCurrentPosition({
            lat: nuevaLat,
            lng: nuevaLng,
            timestamp: Date.now()
          })
        }
      }, 1000)

      return () => clearInterval(interval)
    }
    return undefined
  }, [isMeasuring, elementoActual])

  return (
    <div className="space-y-6">
      {/* Header con estado GPS */}
      <motion.div className="glass-card p-6" initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }}>
        <div className="flex items-center justify-between mb-6">
          <div>
            <h2 className="text-2xl font-bold text-white mb-2">Medición Avanzada de Cancha</h2>
            <p className="text-white/80">Medición completa de todos los elementos según estándares FIFA</p>
          </div>
          <div className="flex items-center space-x-3">
            <div className="flex items-center space-x-2">
              {obtenerIconoEstadoGPS()}
              <span className="text-white text-sm">
                GPS: {estadoGPS === 'activo' ? 'Conectado' :
                      estadoGPS === 'conectando' ? 'Conectando...' :
                      estadoGPS === 'error' ? 'Error' : 'Inactivo'}
              </span>
            </div>
            <motion.button
              onClick={obtenerPosicionGPS}
              className="btn-primary flex items-center space-x-2"
              whileHover={{ scale: 1.02 }}
              whileTap={{ scale: 0.98 }}
            >
              <Navigation className="w-4 h-4" />
              <span>Activar GPS</span>
            </motion.button>
          </div>
        </div>

        {/* Instrucciones dinámicas */}
        {instrucciones && (
          <motion.div
            className="mb-6 p-4 bg-gradient-to-r from-blue-500/20 to-purple-500/20 rounded-lg border border-blue-500/30"
            initial={{ opacity: 0, y: -10 }}
            animate={{ opacity: 1, y: 0 }}
          >
            <div className="flex items-center space-x-3">
              <div className="w-8 h-8 bg-blue-500 rounded-full flex items-center justify-center">
                <span className="text-white font-bold text-sm">{pasoActual}</span>
              </div>
              <div>
                <h4 className="text-white font-semibold">Paso {pasoActual}</h4>
                <p className="text-white/80">{instrucciones}</p>
              </div>
            </div>
          </motion.div>
        )}

        {/* Barra de progreso total */}
        <div className="mb-6">
          <div className="flex justify-between text-white text-sm mb-2">
            <span>Progreso Total</span>
            <span>{progresoTotal.toFixed(1)}%</span>
          </div>
          <div className="progress-bar">
            <motion.div
              className="progress-fill bg-gradient-to-r from-blue-500 to-purple-500"
              initial={{ width: 0 }}
              animate={{ width: `${progresoTotal}%` }}
              transition={{ duration: 0.5 }}
            />
          </div>
        </div>

        {/* Controles */}
        <div className="flex flex-wrap gap-4">
          {elementoActual ? (
            <>
              <motion.button
                onClick={capturarPunto}
                disabled={!gpsActivo}
                className="btn-success flex items-center space-x-2"
                whileHover={{ scale: 1.02 }}
                whileTap={{ scale: 0.98 }}
              >
                <Target className="w-4 h-4" />
                <span>Capturar Punto ({puntosCapturados})</span>
              </motion.button>
              <motion.button
                onClick={() => {
                  setElementoActual(null)
                  setIsMeasuring(false)
                  setPasoActual(1)
                  setInstrucciones('')
                }}
                className="btn-warning flex items-center space-x-2"
                whileHover={{ scale: 1.02 }}
                whileTap={{ scale: 0.98 }}
              >
                <X className="w-4 h-4" />
                <span>Cancelar</span>
              </motion.button>
            </>
          ) : (
            <motion.button
              onClick={() => setMostrarMapa(!mostrarMapa)}
              className="btn-secondary flex items-center space-x-2"
              whileHover={{ scale: 1.02 }}
              whileTap={{ scale: 0.98 }}
            >
              {mostrarMapa ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
              <span>{mostrarMapa ? 'Ocultar Mapa' : 'Mostrar Mapa'}</span>
            </motion.button>
          )}
        </div>
      </motion.div>

      {/* Mapa visual */}
      {mostrarMapa && (
        <motion.div
          className="glass-card p-6"
          initial={{ opacity: 0, scale: 0.9 }}
          animate={{ opacity: 1, scale: 1 }}
        >
          <h3 className="text-xl font-bold text-white mb-4">Mapa de Elementos</h3>
          <div className="relative w-full h-96 bg-gradient-to-br from-green-800 to-green-600 rounded-lg overflow-hidden border-2 border-white/20">
            {/* Elementos de la cancha */}
            {elementosCancha.map((elemento) => (
              <div
                key={elemento.id}
                className={`absolute cursor-pointer transition-all duration-300 hover:scale-110 ${
                  elementoActual?.id === elemento.id ? 'ring-2 ring-yellow-400' : ''
                }`}
                style={{
                  left: `${10 + (elemento.id % 5) * 18}%`,
                  top: `${10 + Math.floor(elemento.id / 5) * 20}%`,
                  backgroundColor: elemento.color,
                  width: '12%',
                  height: '12%',
                  borderRadius: elemento.tipo.includes('circulo') ? '50%' : '4px'
                }}
                onClick={() => !isMeasuring && iniciarMedicionElemento(elemento)}
                title={elemento.descripcion}
              />
            ))}

            {/* Información del mapa */}
            <div className="absolute top-4 left-4 text-xs text-white bg-black/50 px-2 py-1 rounded">
              Elementos: {elementosCancha.length}
            </div>
            <div className="absolute top-4 right-4 text-xs text-white bg-black/50 px-2 py-1 rounded">
              Completados: {elementosMedicion.filter(e => e.completada).length}
            </div>
          </div>
        </motion.div>
      )}

      {/* Lista de elementos */}
      <motion.div className="space-y-4" initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }}>
        <h3 className="text-xl font-bold text-white mb-4">Elementos de la Cancha</h3>
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
          {elementosCancha.map((elemento) => {
            const medicion = elementosMedicion.find(e => e.nombre === elemento.nombre)
            const completada = medicion?.completada || false
            const progreso = medicion?.progreso || 0

            return (
              <motion.div
                key={elemento.id}
                className={`glass-card p-4 cursor-pointer transition-all duration-300 ${
                  completada ? 'border-2 border-green-500/50' : ''
                } ${elementoActual?.id === elemento.id ? 'ring-2 ring-yellow-400' : ''}`}
                whileHover={{ scale: 1.02 }}
                initial={{ opacity: 0, x: -20 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ delay: elemento.id * 0.1 }}
                onClick={() => !isMeasuring && iniciarMedicionElemento(elemento)}
              >
                <div className="flex items-center justify-between mb-3">
                  <div className="flex items-center space-x-3">
                    <div
                      className="w-8 h-8 rounded-full flex items-center justify-center"
                      style={{ backgroundColor: elemento.color }}
                    >
                      <span className="text-white text-xs font-bold">{elemento.id}</span>
                    </div>
                    <div>
                      <h4 className="font-semibold text-white">{elemento.nombre}</h4>
                      <p className="text-xs text-white/60">{elemento.descripcion}</p>
                    </div>
                  </div>
                  <div className="flex items-center space-x-2">
                    {completada ? (
                      <Check className="w-5 h-5 text-green-400" />
                    ) : (
                      <div className="w-5 h-5 border-2 border-white/30 rounded-full"></div>
                    )}
                  </div>
                </div>

                {/* Barra de progreso */}
                <div className="progress-bar mb-3">
                  <motion.div
                    className="progress-fill"
                    style={{
                      background: `linear-gradient(to right, ${elemento.color}, ${elemento.color}80)`
                    }}
                    initial={{ width: 0 }}
                    animate={{ width: `${progreso}%` }}
                    transition={{ duration: 0.5 }}
                  />
                </div>

                {/* Información de medición */}
                <div className="flex items-center justify-between text-xs">
                  <span className="text-white/60">{progreso.toFixed(1)}% completado</span>
                  {medicion && (
                    <span className="text-white/80">
                      {medicion.distancia > 0 ? `${(medicion.distancia).toFixed(1)}m` : 'Pendiente'}
                    </span>
                  )}
                </div>

                {/* Estándares FIFA */}
                {medicion && medicion.distancia > 0 && (
                  <div className="mt-2 text-xs">
                    <span className={`px-2 py-1 rounded ${
                      verificarFIFA(medicion, elemento)
                        ? 'bg-green-500/20 text-green-400'
                        : 'bg-red-500/20 text-red-400'
                    }`}>
                      {verificarFIFA(medicion, elemento) ? '✓ FIFA' : '✗ FIFA'}
                    </span>
                  </div>
                )}
              </motion.div>
            )
          })}
        </div>
      </motion.div>

      {/* Resultados FIFA */}
      {elementosMedicion.length > 0 && (
        <motion.div className="glass-card p-6" initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }}>
          <h3 className="text-xl font-bold text-white mb-4">Resultados FIFA</h3>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
            {elementosMedicion.filter(e => e.completada).map((medicion) => {
              const elementoCancha = elementosCancha.find(ec => ec.nombre === medicion.nombre)
              const cumpleFIFA = elementoCancha ? verificarFIFA(medicion, elementoCancha) : false

              return (
                <div key={medicion.id} className="bg-white/10 rounded-lg p-4">
                  <div className="flex items-center justify-between mb-2">
                    <h4 className="font-semibold text-white">{medicion.nombre}</h4>
                    <div className={`w-3 h-3 rounded-full ${cumpleFIFA ? 'bg-green-400' : 'bg-red-400'}`}></div>
                  </div>
                  <div className="space-y-1 text-sm">
                    <div className="flex justify-between">
                      <span className="text-white/60">Medido:</span>
                      <span className="text-white">{(medicion.distancia).toFixed(1)}m</span>
                    </div>
                    {elementoCancha?.medicionFIFA.largo && (
                      <div className="flex justify-between">
                        <span className="text-white/60">FIFA:</span>
                        <span className="text-white">{elementoCancha.medicionFIFA.largo}m</span>
                      </div>
                    )}
                    <div className="flex justify-between">
                      <span className="text-white/60">Estado:</span>
                      <span className={cumpleFIFA ? 'text-green-400' : 'text-red-400'}>
                        {cumpleFIFA ? 'Cumple' : 'No cumple'}
                      </span>
                    </div>
                  </div>
                </div>
              )
            })}
          </div>
        </motion.div>
      )}

      {/* Posición actual */}
      {currentPosition && (
        <motion.div className="glass-card p-4" initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }}>
          <h4 className="text-lg font-semibold text-white mb-2">Posición Actual</h4>
          <div className="grid grid-cols-2 gap-4 text-sm">
            <div>
              <span className="text-white/60">Latitud:</span>
              <span className="text-white ml-2">{currentPosition.lat.toFixed(6)}</span>
            </div>
            <div>
              <span className="text-white/60">Longitud:</span>
              <span className="text-white ml-2">{currentPosition.lng.toFixed(6)}</span>
            </div>
            <div>
              <span className="text-white/60">Precisión:</span>
              <span className="text-white ml-2">Alta</span>
            </div>
            <div>
              <span className="text-white/60">Última actualización:</span>
              <span className="text-white ml-2">
                {new Date(currentPosition.timestamp).toLocaleTimeString()}
              </span>
            </div>
          </div>
        </motion.div>
      )}
    </div>
  )
}
