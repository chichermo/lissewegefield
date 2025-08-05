'use client'

import { useState, useEffect } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import {
  Home,
  MapPin,
  Target,
  Grid3X3,
  History,
  Menu,
  X,
  Play,
  Pause,
  RotateCcw,
  CheckCircle,
  Settings,
  Smartphone,
  Wifi,
  WifiOff
} from 'lucide-react'
import { useAppStore } from '@/stores/useAppStore'
import { useLanguage } from '../contexts/LanguageContext'
import LanguageSelector from './LanguageSelector'

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
  const [isClient, setIsClient] = useState(false)
  const { campoActivo } = useAppStore()
  const { t } = useLanguage()

  // Verificar si estamos en el cliente
  useEffect(() => {
    setIsClient(true)
  }, [])

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
      label: isClient ? t('nav.home') : 'Inicio',
      icon: Home,
      color: 'bg-blue-500',
      description: isClient ? t('home.subtitle') : 'Panel principal'
    },
    {
      id: 'marcado',
      label: isClient ? t('nav.marking') : 'Marcado',
      icon: MapPin,
      color: 'bg-green-500',
      description: isClient ? t('home.marking.desc') : 'Marcar líneas del campo'
    },
    {
      id: 'medicion',
      label: isClient ? t('nav.measurement') : 'Medición',
      icon: Target,
      color: 'bg-purple-500',
      description: isClient ? t('home.measurement.desc') : 'Medir dimensiones'
    },
    {
      id: 'campos',
      label: isClient ? t('nav.fields') : 'Campos',
      icon: Grid3X3,
      color: 'bg-indigo-500',
      description: isClient ? t('home.fields.desc') : 'Gestionar campos'
    },
    {
      id: 'historial',
      label: isClient ? t('nav.history') : 'Historial',
      icon: History,
      color: 'bg-yellow-500',
      description: isClient ? t('home.history.desc') : 'Ver mediciones'
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
      {/* Header móvil fijo con diseño moderno */}
      <motion.div 
        className="fixed top-0 left-0 right-0 z-40 modern-card border-b-0 rounded-b-3xl animate-gradient"
        style={{ background: 'var(--gradient-fifa)' }}
        initial={{ y: -100 }}
        animate={{ y: 0 }}
        transition={{ type: "spring", stiffness: 300, damping: 30 }}
      >
        <div className="flex items-center justify-between p-6">
          <motion.div 
            className="flex items-center space-x-4"
            initial={{ opacity: 0, x: -20 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ delay: 0.2 }}
          >
            <motion.div 
              className="w-12 h-12 bg-white/20 rounded-2xl flex items-center justify-center fifa-glow"
              whileHover={{ scale: 1.1, rotate: 10 }}
              transition={{ type: "spring", stiffness: 400 }}
            >
              <Smartphone className="w-6 h-6 text-white icon-fifa" />
            </motion.div>
            <div>
              <motion.h1 
                className="text-white font-bold text-xl"
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                transition={{ delay: 0.4 }}
              >
                {isClient ? 'Lissewege Fields' : 'CanchaPro'}
              </motion.h1>
              <motion.p 
                className="text-white/90 text-sm"
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                transition={{ delay: 0.6 }}
              >
                <span className="fifa-badge mr-2">FIFA</span>
                {isClient ? (
                  campoActivo ? `${t('nav.fields')}: ${campoActivo.nombre}` : t('status.inactive')
                ) : (
                  campoActivo ? `Campo: ${campoActivo.nombre}` : 'Sin campo seleccionado'
                )}
              </motion.p>
            </div>
          </motion.div>
          
          <motion.div 
            className="flex items-center space-x-3"
            initial={{ opacity: 0, x: 20 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ delay: 0.3 }}
          >
            {/* Selector de idiomas */}
            {isClient && (
              <motion.div 
                className="relative z-50"
                whileHover={{ scale: 1.05 }}
              >
                <LanguageSelector variant="compact" position="top-right" />
              </motion.div>
            )}
            
            {/* Indicador de conexión moderno */}
            <motion.div 
              className={`p-3 rounded-xl backdrop-blur-md ${isOnline ? 'bg-green-500/30 border border-green-500/50' : 'bg-red-500/30 border border-red-500/50'}`}
              whileHover={{ scale: 1.1 }}
              animate={isOnline ? { 
                boxShadow: "0 0 20px rgba(34, 197, 94, 0.4)",
                borderColor: "rgba(34, 197, 94, 0.6)"
              } : {}}
            >
              {isOnline ? <Wifi className="w-5 h-5 text-white" /> : <WifiOff className="w-5 h-5 text-white" />}
            </motion.div>
            
            {/* Botón de menú moderno */}
            <motion.button
              onClick={() => setIsMenuOpen(true)}
              className="p-3 bg-white/20 rounded-xl text-white backdrop-blur-md border border-white/30 hover:bg-white/30 transition-all duration-300"
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
            >
              <Menu className="w-5 h-5" />
            </motion.button>
          </motion.div>
        </div>
      </motion.div>

      {/* Contenido principal con padding para header */}
      <div className="pt-24 pb-20 px-4">
        {/* Sección actual con diseño moderno */}
        <motion.div 
          className="mb-6"
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6 }}
        >
          <div className="modern-card animate-slide-up p-6">
            <div className="flex items-center space-x-4">
              {(() => {
                const currentItem = navItems.find(item => item.id === activeSection)
                if (!currentItem) return null
                
                return (
                  <>
                    <motion.div 
                      className={`w-16 h-16 rounded-2xl flex items-center justify-center ${currentItem.color} icon-fifa animate-float`}
                      whileHover={{ scale: 1.1, rotate: 5 }}
                      transition={{ type: "spring", stiffness: 300 }}
                    >
                      <currentItem.icon className="w-8 h-8 text-white" />
                    </motion.div>
                    <div className="flex-1">
                      <motion.h2 
                        className="text-white font-bold text-2xl text-gradient mb-1"
                        initial={{ opacity: 0 }}
                        animate={{ opacity: 1 }}
                        transition={{ delay: 0.3 }}
                      >
                        {currentItem.label}
                      </motion.h2>
                      <motion.p 
                        className="text-white/80 text-base leading-relaxed"
                        initial={{ opacity: 0 }}
                        animate={{ opacity: 1 }}
                        transition={{ delay: 0.5 }}
                      >
                        {currentItem.description}
                      </motion.p>
                    </div>
                  </>
                )
              })()}
            </div>
          </div>
        </motion.div>

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