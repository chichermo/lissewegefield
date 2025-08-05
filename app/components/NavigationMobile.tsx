import { useState } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import { useLanguage } from '../contexts/LanguageContext'
import {
  Home,
  MapPin,
  Download,
  Globe,
  History,
  Calendar,
  Package,
  Menu,
  X,
  Settings,
  Target,
  Grid3X3
} from 'lucide-react'

interface NavigationMobileProps {
  onNavigate: (section: string) => void
  activeSection: string
}

export default function NavigationMobile({ onNavigate, activeSection }: NavigationMobileProps) {
  const [isMenuOpen, setIsMenuOpen] = useState(false)
  const { t } = useLanguage()

  const navItems = [
    {
      id: 'inicio',
      label: t('nav.home'),
      icon: Home,
      color: 'bg-blue-500'
    },
    {
      id: 'marcado',
      label: t('nav.marking'),
      icon: MapPin,
      color: 'bg-green-500'
    },
    {
      id: 'medicion',
      label: t('nav.measurement'),
      icon: Target,
      color: 'bg-purple-500'
    },
    {
      id: 'campos',
      label: t('nav.fields'),
      icon: Grid3X3,
      color: 'bg-indigo-500'
    },
    {
      id: 'exportador',
      label: t('nav.export'),
      icon: Download,
      color: 'bg-orange-500'
    },
    {
      id: 'mapa',
      label: t('nav.map'),
      icon: Globe,
      color: 'bg-teal-500'
    },
    {
      id: 'historial',
      label: t('nav.history'),
      icon: History,
      color: 'bg-yellow-500'
    },
    {
      id: 'calendario',
      label: t('nav.calendar'),
      icon: Calendar,
      color: 'bg-red-500'
    },
    {
      id: 'productos',
      label: t('nav.products'),
      icon: Package,
      color: 'bg-gray-500'
    }
  ]

  const handleNavigation = (section: string) => {
    onNavigate(section)
    setIsMenuOpen(false)
  }

  return (
    <>
      {/* Botón de menú flotante */}
      <motion.button
        onClick={() => setIsMenuOpen(!isMenuOpen)}
        className="fixed bottom-6 right-6 z-50 w-14 h-14 bg-green-600 rounded-full shadow-lg flex items-center justify-center text-white"
        whileHover={{ scale: 1.1 }}
        whileTap={{ scale: 0.9 }}
      >
        <AnimatePresence mode="wait">
          {isMenuOpen ? (
            <motion.div
              key="close"
              initial={{ rotate: -90, opacity: 0 }}
              animate={{ rotate: 0, opacity: 1 }}
              exit={{ rotate: 90, opacity: 0 }}
              transition={{ duration: 0.2 }}
            >
              <X className="w-6 h-6" />
            </motion.div>
          ) : (
            <motion.div
              key="menu"
              initial={{ rotate: 90, opacity: 0 }}
              animate={{ rotate: 0, opacity: 1 }}
              exit={{ rotate: -90, opacity: 0 }}
              transition={{ duration: 0.2 }}
            >
              <Menu className="w-6 h-6" />
            </motion.div>
          )}
        </AnimatePresence>
      </motion.button>

      {/* Menú desplegable */}
      <AnimatePresence>
        {isMenuOpen && (
          <motion.div
            initial={{ opacity: 0, scale: 0.8 }}
            animate={{ opacity: 1, scale: 1 }}
            exit={{ opacity: 0, scale: 0.8 }}
            transition={{ duration: 0.3 }}
            className="fixed inset-0 z-40 bg-black/50 backdrop-blur-sm"
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
              {/* Header */}
              <div className="p-6 border-b border-gray-700">
                <h2 className="text-xl font-bold text-white">Cancha Inteligente Pro</h2>
                <p className="text-sm text-gray-400 mt-1">Navegación móvil</p>
              </div>

              {/* Lista de navegación */}
              <div className="p-4 space-y-2">
                {navItems.map((item, index) => (
                  <motion.button
                    key={item.id}
                    onClick={() => handleNavigation(item.id)}
                    className={`w-full flex items-center space-x-4 p-4 rounded-lg transition-colors ${
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
                    <div className={`w-10 h-10 rounded-lg flex items-center justify-center ${item.color}`}>
                      <item.icon className="w-5 h-5 text-white" />
                    </div>
                    <span className="font-medium">{item.label}</span>
                  </motion.button>
                ))}
              </div>

              {/* Footer */}
              <div className="absolute bottom-0 left-0 right-0 p-4 border-t border-gray-700">
                <button className="w-full flex items-center justify-center space-x-2 p-3 bg-gray-800 rounded-lg text-gray-300 hover:bg-gray-700 transition-colors">
                  <Settings className="w-5 h-5" />
                  <span>Configuración</span>
                </button>
              </div>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>

      {/* Indicador de sección actual */}
      <div className="fixed top-4 left-4 right-4 z-30">
        <div className="bg-gray-900/80 backdrop-blur-sm rounded-lg p-3">
          <div className="flex items-center justify-between">
            <div className="flex items-center space-x-3">
              {(() => {
                const currentItem = navItems.find(item => item.id === activeSection)
                if (!currentItem) return null
                
                return (
                  <>
                    <div className={`w-8 h-8 rounded-lg flex items-center justify-center ${currentItem.color}`}>
                      <currentItem.icon className="w-4 h-4 text-white" />
                    </div>
                    <div>
                      <p className="text-white font-medium">{currentItem.label}</p>
                      <p className="text-xs text-gray-400">Sección activa</p>
                    </div>
                  </>
                )
              })()}
            </div>
            
            <motion.button
              onClick={() => setIsMenuOpen(true)}
              className="p-2 bg-gray-800 rounded-lg text-gray-300 hover:bg-gray-700 transition-colors"
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
            >
              <Menu className="w-5 h-5" />
            </motion.button>
          </div>
        </div>
      </div>
    </>
  )
} 