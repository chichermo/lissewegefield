'use client'

import { useState, useEffect } from 'react'
import { motion } from 'framer-motion'
import {
  Target,
  MapPin,
  Grid3X3,
  History,
  Trophy,
  Camera,
  Gauge,
  Users
} from 'lucide-react'
import { useAppStore } from '../../stores/useAppStore'
import { useLanguage } from '../contexts/LanguageContext'

interface HomeMobileProps {
  onNavigate: (section: string) => void
}

export default function HomeMobile({ onNavigate }: HomeMobileProps) {
  const { campoActivo, gestorCampos } = useAppStore()
  const { t } = useLanguage()
  const [isClient, setIsClient] = useState(false)

  useEffect(() => {
    setIsClient(true)
  }, [])

  const quickActions = [
    {
      id: 'medicion',
      label: t('home.measurement'),
      description: t('home.measurement.desc'),
      icon: Target,
      color: 'bg-green-500',
      gradient: 'from-green-500 to-green-600'
    },
    {
      id: 'marcado',
      label: t('home.marking'),
      description: t('home.marking.desc'),
      icon: MapPin,
      color: 'bg-blue-500',
      gradient: 'from-blue-500 to-blue-600'
    },
    {
      id: 'campos',
      label: t('home.fields'),
      description: t('home.fields.desc'),
      icon: Grid3X3,
      color: 'bg-purple-500',
      gradient: 'from-purple-500 to-purple-600'
    },
    {
      id: 'historial',
      label: t('home.history'),
      description: t('home.history.desc'),
      icon: History,
      color: 'bg-yellow-500',
      gradient: 'from-yellow-500 to-yellow-600'
    }
  ]

  const stats = [
    {
      label: t('home.fields'),
      value: gestorCampos?.campos.length || 0,
      icon: Grid3X3,
      color: 'text-blue-400'
    },
    {
      label: t('nav.measurement'),
      value: gestorCampos?.campos.reduce((total, campo) => total + campo.estadisticas.totalMediciones, 0) || 0,
      icon: Target,
      color: 'text-green-400'
    },
    {
      label: t('nav.marking'),
      value: gestorCampos?.campos.reduce((total, campo) => total + campo.estadisticas.totalMarcados, 0) || 0,
      icon: MapPin,
      color: 'text-purple-400'
    }
  ]

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="bg-white/10 backdrop-blur-sm rounded-2xl p-6 border border-white/20">
        <div className="text-center">
          <div className="w-16 h-16 bg-gradient-to-r from-blue-600 to-blue-800 rounded-2xl flex items-center justify-center mx-auto mb-4">
            {isClient && <Trophy className="w-8 h-8 text-white" />}
          </div>
          <h1 className="text-2xl font-bold text-white mb-2">{t('home.title')}</h1>
          <p className="text-blue-200 text-sm font-medium mb-1">R.F.C. Lissewege - 4718</p>
          <p className="text-white/60 text-xs">
            Pol Dhondtstraat 70, 8380 Lissewege, Brugge
          </p>
          <p className="text-white/50 text-xs mt-2">
            {t('home.subtitle')}
          </p>
        </div>
      </div>

      {/* Campo activo */}
      {campoActivo && (
        <div className="bg-white/10 backdrop-blur-sm rounded-2xl p-4 border border-white/20">
          <div className="flex items-center space-x-3">
            <div className="w-10 h-10 bg-green-500 rounded-xl flex items-center justify-center">
              <Grid3X3 className="w-5 h-5 text-white" />
            </div>
            <div className="flex-1">
              <h3 className="text-white font-semibold">Campo Activo</h3>
              <p className="text-white/70 text-sm">{campoActivo.nombre}</p>
            </div>
            <div className="text-right">
              <p className="text-white/70 text-xs">{campoActivo.tipo}</p>
              <p className="text-white font-medium text-sm">{campoActivo.estado}</p>
            </div>
          </div>
        </div>
      )}

      {/* Estadísticas rápidas */}
      <div className="grid grid-cols-3 gap-3">
        {stats.map((stat, index) => (
          <motion.div
            key={stat.label}
            className="bg-white/10 backdrop-blur-sm rounded-xl p-4 border border-white/20 text-center"
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: index * 0.1 }}
          >
            <stat.icon className={`w-6 h-6 mx-auto mb-2 ${stat.color}`} />
            <p className="text-white font-bold text-lg">{stat.value}</p>
            <p className="text-white/70 text-xs">{stat.label}</p>
          </motion.div>
        ))}
      </div>

      {/* Acciones rápidas */}
      <div className="space-y-3">
        <h2 className="text-white font-semibold text-lg">Acciones Rápidas</h2>
        {quickActions.map((action, index) => (
          <motion.button
            key={action.id}
            onClick={() => onNavigate(action.id)}
            className="w-full bg-white/10 backdrop-blur-sm rounded-2xl p-4 border border-white/20 text-left transition-all hover:bg-white/20 active:scale-95"
            initial={{ opacity: 0, x: -20 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ delay: index * 0.1 }}
            whileHover={{ scale: 1.02 }}
            whileTap={{ scale: 0.98 }}
          >
            <div className="flex items-center space-x-4">
              <div className={`w-12 h-12 rounded-xl flex items-center justify-center bg-gradient-to-r ${action.gradient}`}>
                {isClient && <action.icon className="w-6 h-6 text-white" />}
              </div>
              <div className="flex-1">
                <h3 className="text-white font-semibold">{action.label}</h3>
                <p className="text-white/70 text-sm">{action.description}</p>
              </div>
            </div>
          </motion.button>
        ))}
      </div>

      {/* Características destacadas */}
      <div className="bg-white/10 backdrop-blur-sm rounded-2xl p-4 border border-white/20">
        <h3 className="text-white font-semibold mb-3">{t('home.features')}</h3>
        <div className="space-y-2">
          <div className="flex items-center space-x-3">
            {isClient && <Camera className="w-4 h-4 text-green-400" />}
            <span className="text-white/70 text-sm">{t('home.camera')}</span>
          </div>
          <div className="flex items-center space-x-3">
            {isClient && <Gauge className="w-4 h-4 text-blue-400" />}
            <span className="text-white/70 text-sm">{t('home.gps')}</span>
          </div>
          <div className="flex items-center space-x-3">
            {isClient && <Trophy className="w-4 h-4 text-yellow-400" />}
            <span className="text-white/70 text-sm">{t('home.fifa')}</span>
          </div>
          <div className="flex items-center space-x-3">
            {isClient && <Users className="w-4 h-4 text-purple-400" />}
            <span className="text-white/70 text-sm">{t('home.multiple')}</span>
          </div>
        </div>
      </div>
    </div>
  )
} 