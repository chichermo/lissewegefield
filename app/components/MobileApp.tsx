'use client'

import { useState, useEffect } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import {
  Home,
  MapPin,
  Target,
  Grid3X3,
  Download,
  Globe,
  History,
  Calendar,
  Package,
  Menu,
  X,
  Camera,
  Play,
  Pause,
  RotateCcw,
  CheckCircle,
  AlertCircle,
  Settings,
  Smartphone,
  Wifi,
  WifiOff
} from 'lucide-react'
import { useAppStore } from '@/stores/useAppStore'

interface MobileAppProps {
  onNavigate: (section: string) => void
  activeSection: string
  onStartRecording?: () => void
  onStopRecording?: () => void
  isRecording?: boolean
}

export default function MobileApp({ 
  onNavigate, 
  activeSection, 
  onStartRecording,
  onStopRecording,
  isRecording = false
}: MobileAppProps) {
  const [isMenuOpen, setIsMenuOpen] = useState(false)
  const [isOnline, setIsOnline] = useState(true)
  const [showStatus, setShowStatus] = useState(false)
  const { gestorCampos, campoActivo } = useAppStore()

  // Verificar estado de conexión
  useEffect(() => {
    const handleOnline = () => setIsOnline(true)
    const handleOffline = () => setIsOnline(false)
    
    window.addEventListener('online', handleOnline)
    window.addEventListener('offline', handleOffline)
    
    return () => {
      window.removeEventListener('online', handleOnline)
      window.removeEventListener('offline', handleOffline)
    }
  }, [])

  const navItems = [
    {
      id: 'inicio',
      label: 'Inicio',
      icon: Home,
      color: 'bg-blue-500',
      description: 'Panel principal'
    },
    {
      id: 'marcado',
      label: 'Marcado',
      icon: MapPin,
      color: 'bg-green-500',
      description: 'Marcar líneas del campo'
    },
    {
      id: 'medicion',
      label: 'Medición',
      icon: Target,
      color: 'bg-purple-500',
      description: 'Medir dimensiones'
    },
    {
      id: 'campos',
      label: 'Campos',
      icon: Grid3X3,
      color: 'bg-indigo-500',
      description: 'Gestionar campos'
    },
    {
      id: 'historial',
      label: 'Historial',
      icon: History,
      color: 'bg-yellow-500',
      description: 'Ver mediciones'
    }
  ]

  const handleNavigation = (section: string) => {
    onNavigate(section)
    setIsMenuOpen(false)
  }

  const handleStartRecording = () => {
    if (onStartRecording) {
      onStartRecording()
      setShowStatus(true)
      setTimeout(() => setShowStatus(false), 3000)
    }
  }

  const handleStopRecording = () => {
    if (onStopRecording) {
      onStopRecording()
      setShowStatus(true)
      setTimeout(() => setShowStatus(false), 3000)
    }
  }

  return (
    <>
      {/* Header móvil fijo */}
      <div className="fixed top-0 left-0 right-0 z-40 bg-gradient-to-r from-green-600 to-blue-600 p-4 shadow-lg">
        <div className="flex items-center justify-between">
          <div className="flex items-center space-x-3">
            <div className="w-10 h-10 bg-white/20 rounded-lg flex items-center justify-center">
              <Smartphone className="w-5 h-5 text-white" />
            </div>
            <div>
              <h1 className="text-white font-bold text-lg">CanchaPro</h1>
              <p className="text-white/80 text-xs">
                {campoActivo ? `Campo: ${campoActivo.nombre}` : 'Sin campo seleccionado'}
              </p>
            </div>
          </div>
          
          <div className="flex items-center space-x-2">
            {/* Indicador de conexión */}
            <div className={`p-2 rounded-lg ${isOnline ? 'bg-green-500/20' : 'bg-red-500/20'}`}>
              {isOnline ? <Wifi className="w-4 h-4 text-green-400" /> : <WifiOff className="w-4 h-4 text-red-400" />}
            </div>
            
            {/* Botón de menú */}
            <motion.button
              onClick={() => setIsMenuOpen(true)}
              className="p-2 bg-white/20 rounded-lg text-white"
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
            >
              <Menu className="w-5 h-5" />
            </motion.button>
          </div>
        </div>
      </div>

      {/* Contenido principal con padding para header */}
      <div className="pt-24 pb-20 px-4">
        {/* Sección actual */}
        <div className="mb-6">
          <div className="bg-white/10 backdrop-blur-sm rounded-2xl p-4 border border-white/20">
            <div className="flex items-center space-x-3">
              {(() => {
                const currentItem = navItems.find(item => item.id === activeSection)
                if (!currentItem) return null
                
                return (
                  <>
                    <div className={`w-12 h-12 rounded-xl flex items-center justify-center ${currentItem.color}`}>
                      <currentItem.icon className="w-6 h-6 text-white" />
                    </div>
                    <div className="flex-1">
                      <h2 className="text-white font-bold text-xl">{currentItem.label}</h2>
                      <p className="text-white/70 text-sm">{currentItem.description}</p>
                    </div>
                  </>
                )
              })()}
            </div>
          </div>
        </div>

        {/* Controles de acción rápida */}
        {activeSection === 'marcado' || activeSection === 'medicion' ? (
          <div className="mb-6">
            <div className="bg-gradient-to-r from-green-500/20 to-blue-500/20 rounded-2xl p-4 border border-green-500/30">
              <div className="flex items-center justify-between mb-3">
                <h3 className="text-white font-semibold">Controles de Grabación</h3>
                <div className={`w-3 h-3 rounded-full ${isRecording ? 'bg-red-500 animate-pulse' : 'bg-gray-400'}`} />
              </div>
              
              <div className="flex space-x-3">
                <motion.button
                  onClick={isRecording ? handleStopRecording : handleStartRecording}
                  className={`flex-1 flex items-center justify-center space-x-2 py-3 rounded-xl font-semibold ${
                    isRecording 
                      ? 'bg-red-500 text-white' 
                      : 'bg-green-500 text-white'
                  }`}
                  whileHover={{ scale: 1.02 }}
                  whileTap={{ scale: 0.98 }}
                >
                  {isRecording ? <Pause className="w-5 h-5" /> : <Play className="w-5 h-5" />}
                  <span>{isRecording ? 'Detener' : 'Iniciar'} {activeSection === 'medicion' ? 'Medición' : 'Marcado'}</span>
                </motion.button>
                
                <motion.button
                  className="px-4 py-3 bg-white/20 text-white rounded-xl"
                  whileHover={{ scale: 1.02 }}
                  whileTap={{ scale: 0.98 }}
                >
                  <RotateCcw className="w-5 h-5" />
                </motion.button>
              </div>
              
              <div className="mt-3 text-xs text-white/70">
                {isRecording ? (
                  <div className="flex items-center space-x-2">
                    <div className="w-2 h-2 bg-red-500 rounded-full animate-pulse"></div>
                    <span>Grabando... Mueve el dispositivo para registrar puntos</span>
                  </div>
                ) : (
                  <div className="flex items-center space-x-2">
                    <div className="w-2 h-2 bg-gray-400 rounded-full"></div>
                    <span>Listo para {activeSection === 'medicion' ? 'medir' : 'marcar'}</span>
                  </div>
                )}
              </div>
            </div>
          </div>
        ) : null}

        {/* Indicador de estado */}
        <AnimatePresence>
          {showStatus && (
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: 20 }}
              className="fixed top-20 left-4 right-4 z-50"
            >
              <div className="bg-green-500 text-white p-4 rounded-xl shadow-lg flex items-center space-x-3">
                <CheckCircle className="w-5 h-5" />
                <span className="font-semibold">
                  {isRecording ? 'Grabación iniciada' : 'Grabación detenida'}
                </span>
              </div>
            </motion.div>
          )}
        </AnimatePresence>
      </div>

      {/* Menú lateral móvil */}
      <AnimatePresence>
        {isMenuOpen && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 z-50 bg-black/50 backdrop-blur-sm"
            onClick={() => setIsMenuOpen(false)}
          >
            <motion.div
              initial={{ x: '100%' }}
              animate={{ x: 0 }}
              exit={{ x: '100%' }}
              transition={{ type: 'spring', damping: 25, stiffness: 200 }}
              className="absolute right-0 top-0 h-full w-80 bg-gray-900 shadow-xl"
              onClick={(e) => e.stopPropagation()}
            >
              {/* Header del menú */}
              <div className="p-6 border-b border-gray-700">
                <div className="flex items-center justify-between">
                  <h2 className="text-xl font-bold text-white">CanchaPro</h2>
                  <button
                    onClick={() => setIsMenuOpen(false)}
                    className="p-2 text-gray-400 hover:text-white"
                  >
                    <X className="w-5 h-5" />
                  </button>
                </div>
                <p className="text-sm text-gray-400 mt-1">Navegación móvil</p>
              </div>

              {/* Lista de navegación */}
              <div className="p-4 space-y-2">
                {navItems.map((item, index) => (
                  <motion.button
                    key={item.id}
                    onClick={() => handleNavigation(item.id)}
                    className={`w-full flex items-center space-x-4 p-4 rounded-xl transition-colors ${
                      activeSection === item.id
                        ? 'bg-green-600 text-white'
                        : 'bg-gray-800 text-gray-300 hover:bg-gray-700'
                    }`}
                    whileHover={{ scale: 1.02 }}
                    whileTap={{ scale: 0.98 }}
                    initial={{ opacity: 0, x: 20 }}
                    animate={{ opacity: 1, x: 0 }}
                    transition={{ delay: index * 0.05 }}
                  >
                    <div className={`w-12 h-12 rounded-xl flex items-center justify-center ${item.color}`}>
                      <item.icon className="w-6 h-6 text-white" />
                    </div>
                    <div className="flex-1 text-left">
                      <span className="font-semibold">{item.label}</span>
                      <p className="text-xs opacity-70">{item.description}</p>
                    </div>
                  </motion.button>
                ))}
              </div>

              {/* Footer del menú */}
              <div className="absolute bottom-0 left-0 right-0 p-4 border-t border-gray-700">
                <div className="space-y-2">
                  <div className="flex items-center justify-between text-sm">
                    <span className="text-gray-400">Estado:</span>
                    <span className={`font-semibold ${isOnline ? 'text-green-400' : 'text-red-400'}`}>
                      {isOnline ? 'En línea' : 'Sin conexión'}
                    </span>
                  </div>
                  <button className="w-full flex items-center justify-center space-x-2 p-3 bg-gray-800 rounded-xl text-gray-300 hover:bg-gray-700 transition-colors">
                    <Settings className="w-5 h-5" />
                    <span>Configuración</span>
                  </button>
                </div>
              </div>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>
    </>
  )
} 