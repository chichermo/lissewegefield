'use client'

import { motion, AnimatePresence } from 'framer-motion'
import { useState } from 'react'
import {
  Settings,
  Eye,
  Target,
  Zap,
  Brain,
  TrendingUp,
  Camera,
  MapPin,
  X
} from 'lucide-react'
import { useLanguage } from '../contexts/LanguageContext'

interface AdvancedModeManagerProps {
  isAdvanced: boolean
  onToggleMode: (enabled: boolean) => void
  currentComponent: string
}

interface AdvancedFeature {
  id: string
  name: string
  description: string
  icon: any
  enabled: boolean
  category: 'camera' | 'gps' | 'ai' | 'analytics' | 'ui'
  color: string
  dependencies?: string[]
}

export default function AdvancedModeManager({ 
  isAdvanced, 
  onToggleMode, 
  currentComponent: _ 
}: AdvancedModeManagerProps) {
  const { t } = useLanguage()
  const [showConfig, setShowConfig] = useState(false)
  const [features, setFeatures] = useState<AdvancedFeature[]>([
    {
      id: 'camera-ai',
      name: t('advanced.camera.ai'),
      description: t('advanced.camera.ai.desc'),
      icon: Brain,
      enabled: false,
      category: 'ai',
      color: 'text-purple-400'
    },
    {
      id: 'line-detection',
      name: t('advanced.line.detection'),
      description: t('advanced.line.detection.desc'),
      icon: Eye,
      enabled: false,
      category: 'ai',
      color: 'text-blue-400'
    },
    {
      id: 'precision-tracking',
      name: t('advanced.precision.tracking'),
      description: t('advanced.precision.tracking.desc'),
      icon: Target,
      enabled: true,
      category: 'gps',
      color: 'text-green-400'
    },
    {
      id: 'real-time-analytics',
      name: t('advanced.analytics.realtime'),
      description: t('advanced.analytics.realtime.desc'),
      icon: TrendingUp,
      enabled: true,
      category: 'analytics',
      color: 'text-yellow-400'
    },
    {
      id: 'advanced-camera',
      name: t('advanced.camera.tools'),
      description: t('advanced.camera.tools.desc'),
      icon: Camera,
      enabled: true,
      category: 'camera',
      color: 'text-cyan-400'
    },
    {
      id: 'gps-professional',
      name: t('advanced.gps.professional'),
      description: t('advanced.gps.professional.desc'),
      icon: MapPin,
      enabled: true,
      category: 'gps',
      color: 'text-emerald-400'
    }
  ])

  const toggleFeature = (featureId: string) => {
    setFeatures(prev => prev.map(feature => 
      feature.id === featureId 
        ? { ...feature, enabled: !feature.enabled }
        : feature
    ))
  }

  const getEnabledFeatures = () => features.filter(f => f.enabled)
  const getFeaturesByCategory = (category: string) => features.filter(f => f.category === category)

  return (
    <>
      {/* Toggle principal del modo avanzado */}
      <motion.div className="flex items-center space-x-3">
        <motion.button
          onClick={() => onToggleMode(!isAdvanced)}
          className={`relative w-12 h-6 rounded-full transition-colors duration-300 ${
            isAdvanced ? 'bg-blue-500' : 'bg-white/20'
          }`}
          whileTap={{ scale: 0.95 }}
        >
          <motion.div
            className="absolute top-0.5 left-0.5 w-5 h-5 bg-white rounded-full shadow-lg"
            animate={{ x: isAdvanced ? 24 : 2 }}
            transition={{ type: 'spring', stiffness: 500, damping: 30 }}
          />
        </motion.button>
        
        <span className="text-white text-sm font-medium">
          {isAdvanced ? t('advanced.mode.on') : t('advanced.mode.off')}
        </span>

        {isAdvanced && (
          <motion.button
            onClick={() => setShowConfig(!showConfig)}
            className="p-2 bg-white/10 rounded-lg text-white hover:bg-white/20"
            whileHover={{ scale: 1.05 }}
            whileTap={{ scale: 0.95 }}
            initial={{ opacity: 0, scale: 0 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ delay: 0.2 }}
          >
            <Settings className="w-4 h-4" />
          </motion.button>
        )}
      </motion.div>

      {/* Indicadores de características activas */}
      {isAdvanced && (
        <motion.div 
          className="flex flex-wrap gap-2 mt-2"
          initial={{ opacity: 0, y: -10 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.3 }}
        >
          {getEnabledFeatures().slice(0, 3).map(feature => (
            <motion.div
              key={feature.id}
              className="flex items-center space-x-1 px-2 py-1 bg-white/10 rounded-md"
              initial={{ opacity: 0, scale: 0 }}
              animate={{ opacity: 1, scale: 1 }}
              transition={{ delay: 0.4 }}
            >
              <feature.icon className={`w-3 h-3 ${feature.color}`} />
              <span className="text-xs text-white/80">{feature.name}</span>
            </motion.div>
          ))}
          {getEnabledFeatures().length > 3 && (
            <motion.div className="px-2 py-1 bg-white/10 rounded-md">
              <span className="text-xs text-white/60">
                +{getEnabledFeatures().length - 3} {t('advanced.more')}
              </span>
            </motion.div>
          )}
        </motion.div>
      )}

      {/* Panel de configuración avanzada */}
      <AnimatePresence>
        {showConfig && (
          <motion.div
            className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/50 backdrop-blur-sm"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            onClick={() => setShowConfig(false)}
          >
            <motion.div
              className="bg-gray-900 rounded-2xl p-6 max-w-md w-full max-h-[80vh] overflow-y-auto"
              initial={{ scale: 0.9, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              exit={{ scale: 0.9, opacity: 0 }}
              onClick={(e) => e.stopPropagation()}
            >
              <div className="flex items-center justify-between mb-6">
                <h2 className="text-xl font-bold text-white flex items-center space-x-2">
                  <Zap className="w-6 h-6 text-blue-400" />
                  <span>{t('advanced.configuration')}</span>
                </h2>
                <button
                  onClick={() => setShowConfig(false)}
                  className="p-2 hover:bg-white/10 rounded-lg text-white/60"
                >
                  <X className="w-5 h-5" />
                </button>
              </div>

              <div className="space-y-6">
                {/* Categorías de características */}
                {['camera', 'gps', 'ai', 'analytics'].map(category => (
                  <div key={category} className="space-y-3">
                    <h3 className="text-sm font-semibold text-white/80 uppercase tracking-wide">
                      {t(`advanced.category.${category}`)}
                    </h3>
                    
                    <div className="space-y-2">
                      {getFeaturesByCategory(category).map(feature => (
                        <motion.div
                          key={feature.id}
                          className="flex items-center justify-between p-3 bg-white/5 rounded-lg hover:bg-white/10 transition-colors"
                          whileHover={{ scale: 1.02 }}
                        >
                          <div className="flex items-center space-x-3">
                            <feature.icon className={`w-5 h-5 ${feature.color}`} />
                            <div>
                              <div className="text-white text-sm font-medium">
                                {feature.name}
                              </div>
                              <div className="text-white/60 text-xs">
                                {feature.description}
                              </div>
                            </div>
                          </div>
                          
                          <motion.button
                            onClick={() => toggleFeature(feature.id)}
                            className={`w-8 h-5 rounded-full transition-colors ${
                              feature.enabled ? 'bg-green-500' : 'bg-gray-600'
                            }`}
                            whileTap={{ scale: 0.95 }}
                          >
                            <motion.div
                              className="w-3 h-3 bg-white rounded-full"
                              animate={{ x: feature.enabled ? 18 : 2, y: 1 }}
                              transition={{ type: 'spring', stiffness: 500, damping: 30 }}
                            />
                          </motion.button>
                        </motion.div>
                      ))}
                    </div>
                  </div>
                ))}
              </div>

              <div className="mt-6 pt-4 border-t border-white/10">
                <div className="flex items-center justify-between text-sm">
                  <span className="text-white/60">{t('advanced.features.enabled')}</span>
                  <span className="text-green-400 font-medium">
                    {getEnabledFeatures().length}/{features.length}
                  </span>
                </div>
              </div>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>
    </>
  )
}