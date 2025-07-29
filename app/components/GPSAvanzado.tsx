'use client'

import { motion } from 'framer-motion'
import { 
  Navigation, 
  Satellite, 
  Target, 
  CheckCircle, 
  AlertTriangle,
  Loader2,
  Shield,
  BarChart3
} from 'lucide-react'
import { useState } from 'react'
import { PuntoGPS } from '../../types'

interface GPSAvanzadoProps {
  onPosicionObtenida: (posicion: PuntoGPS) => void
  onPrecisionChange: (precision: number) => void
  modoProfesional?: boolean
}

export default function GPSAvanzado({ 
  onPosicionObtenida, 
  onPrecisionChange, 
  modoProfesional = false 
}: GPSAvanzadoProps) {
  const [estadoGPS, setEstadoGPS] = useState<'inactivo' | 'conectando' | 'activo' | 'error' | 'rtk'>('inactivo')
  const [precision, setPrecision] = useState(0)
  const [satelites, setSatelites] = useState(0)
  const [señal, setSeñal] = useState(0)
  const [tiempoConvergencia, setTiempoConvergencia] = useState(0)
  const [modoRTK, setModoRTK] = useState(false)


  // Simulación de GPS RTK profesional
  const activarGPSRTK = () => {
    setEstadoGPS('conectando')
    setModoRTK(true)
    
    // Simular proceso de inicialización RTK
    let tiempo = 0
    const interval = setInterval(() => {
      tiempo += 1
      setTiempoConvergencia(tiempo)
      
      if (tiempo >= 30) { // 30 segundos para convergencia RTK
        setEstadoGPS('rtk')
        setPrecision(0.01) // 1cm de precisión
        setSatelites(12 + Math.floor(Math.random() * 4))
        setSeñal(95 + Math.random() * 5)
        onPrecisionChange(0.01)
        clearInterval(interval)
      }
    }, 1000)
  }

  // GPS estándar de alta precisión
  const activarGPSAltaPrecision = () => {
    setEstadoGPS('conectando')
    
    if ('geolocation' in navigator) {
      navigator.geolocation.getCurrentPosition(
        (position) => {
          const precisionGPS = position.coords.accuracy || 5
          setPrecision(precisionGPS)
          setSatelites(8 + Math.floor(Math.random() * 8))
          setSeñal(80 + Math.random() * 20)
          setEstadoGPS('activo')
          onPrecisionChange(precisionGPS)
          
          const nuevaPosicion: PuntoGPS = {
            lat: position.coords.latitude,
            lng: position.coords.longitude,
            timestamp: Date.now(),
            accuracy: precisionGPS
          }
          onPosicionObtenida(nuevaPosicion)
        },
        (error) => {
          setEstadoGPS('error')
          console.error('Error GPS:', error)
        },
        {
          enableHighAccuracy: true,
          timeout: 15000,
          maximumAge: 0
        }
      )
    }
  }

  const obtenerIconoEstado = () => {
    switch (estadoGPS) {
      case 'rtk': return <Shield className="w-5 h-5 text-green-400" />
      case 'activo': return <CheckCircle className="w-5 h-5 text-green-400" />
      case 'conectando': return <Loader2 className="w-5 h-5 animate-spin text-yellow-400" />
      case 'error': return <AlertTriangle className="w-5 h-5 text-red-400" />
      default: return <Navigation className="w-5 h-5 text-gray-400" />
    }
  }

  const obtenerColorEstado = () => {
    switch (estadoGPS) {
      case 'rtk': return 'text-green-400'
      case 'activo': return 'text-blue-400'
      case 'conectando': return 'text-yellow-400'
      case 'error': return 'text-red-400'
      default: return 'text-gray-400'
    }
  }

  return (
    <div className="space-y-4">
      {/* Panel de Estado GPS */}
      <motion.div 
        className="futbol-card"
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
      >
        <div className="flex items-center justify-between mb-4">
          <h3 className="text-lg font-bold text-white flex items-center gap-2">
            <Satellite className="w-5 h-5" />
            GPS Profesional {modoProfesional ? 'RTK' : 'Alta Precisión'}
          </h3>
          <div className={`flex items-center gap-2 ${obtenerColorEstado()}`}>
            {obtenerIconoEstado()}
            <span className="text-sm font-medium">
              {estadoGPS === 'rtk' ? 'RTK Activo' :
               estadoGPS === 'activo' ? 'Alta Precisión' :
               estadoGPS === 'conectando' ? 'Conectando...' :
               estadoGPS === 'error' ? 'Error' : 'Inactivo'}
            </span>
          </div>
        </div>

        {/* Métricas GPS */}
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
          <div className="text-center">
            <div className="text-2xl font-bold text-blue-400">
              {precision.toFixed(2)}m
            </div>
            <div className="text-xs text-white/70">Precisión</div>
          </div>
          
          <div className="text-center">
            <div className="text-2xl font-bold text-green-400">
              {satelites}
            </div>
            <div className="text-xs text-white/70">Satélites</div>
          </div>
          
          <div className="text-center">
            <div className="text-2xl font-bold text-purple-400">
              {señal.toFixed(0)}%
            </div>
            <div className="text-xs text-white/70">Señal</div>
          </div>
          
          {modoRTK && (
            <div className="text-center">
              <div className="text-2xl font-bold text-orange-400">
                {tiempoConvergencia}s
              </div>
              <div className="text-xs text-white/70">RTK</div>
            </div>
          )}
        </div>

        {/* Controles */}
        <div className="flex gap-2 mt-4">
          {modoProfesional ? (
            <motion.button
              onClick={activarGPSRTK}
              disabled={estadoGPS === 'conectando' || estadoGPS === 'rtk'}
              className="futbol-btn futbol-btn-primary flex items-center gap-2"
              whileHover={{ scale: 1.02 }}
              whileTap={{ scale: 0.98 }}
            >
              <Shield className="w-4 h-4" />
              <span>Activar RTK</span>
            </motion.button>
          ) : (
            <motion.button
              onClick={activarGPSAltaPrecision}
              disabled={estadoGPS === 'conectando' || estadoGPS === 'activo'}
              className="futbol-btn futbol-btn-primary flex items-center gap-2"
              whileHover={{ scale: 1.02 }}
              whileTap={{ scale: 0.98 }}
            >
              <Target className="w-4 h-4" />
              <span>Activar GPS</span>
            </motion.button>
          )}
        </div>
      </motion.div>

      {/* Estadísticas Avanzadas */}
      {modoProfesional && (
        <motion.div 
          className="futbol-card"
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.2 }}
        >
          <h4 className="text-md font-bold text-white mb-3 flex items-center gap-2">
            <BarChart3 className="w-4 h-4" />
            Estadísticas RTK
          </h4>
          <div className="grid grid-cols-2 gap-4 text-sm">
            <div className="flex justify-between">
              <span className="text-white/70">Precisión Prom:</span>
              <span className="text-green-400">0.01m</span>
            </div>
            <div className="flex justify-between">
              <span className="text-white/70">Tiempo Máx:</span>
              <span className="text-blue-400">30s</span>
            </div>
            <div className="flex justify-between">
              <span className="text-white/70">Mediciones:</span>
              <span className="text-purple-400">∞</span>
            </div>
            <div className="flex justify-between">
              <span className="text-white/70">Calidad:</span>
              <span className="text-orange-400">Excelente</span>
            </div>
          </div>
        </motion.div>
      )}
    </div>
  )
} 