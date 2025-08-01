'use client'

import { useState, useEffect } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import {
  CheckCircle,
  AlertCircle,
  Info,
  X,
  Wifi,
  WifiOff,
  Camera,
  MapPin
} from 'lucide-react'

export interface NotificationData {
  id: string
  type: 'success' | 'error' | 'info' | 'warning'
  title: string
  message: string
  duration?: number
  icon?: React.ComponentType<any>
}

interface MobileNotificationsProps {
  notifications: NotificationData[]
  onRemove: (id: string) => void
}

export default function MobileNotifications({ notifications, onRemove }: MobileNotificationsProps) {
  const getIcon = (notification: NotificationData) => {
    if (notification.icon) {
      return notification.icon
    }

    switch (notification.type) {
      case 'success':
        return CheckCircle
      case 'error':
        return AlertCircle
      case 'info':
        return Info
      case 'warning':
        return AlertCircle
      default:
        return Info
    }
  }

  const getColors = (type: string) => {
    switch (type) {
      case 'success':
        return {
          bg: 'bg-green-500',
          border: 'border-green-400',
          text: 'text-white',
          icon: 'text-white'
        }
      case 'error':
        return {
          bg: 'bg-red-500',
          border: 'border-red-400',
          text: 'text-white',
          icon: 'text-white'
        }
      case 'warning':
        return {
          bg: 'bg-yellow-500',
          border: 'border-yellow-400',
          text: 'text-white',
          icon: 'text-white'
        }
      case 'info':
      default:
        return {
          bg: 'bg-blue-500',
          border: 'border-blue-400',
          text: 'text-white',
          icon: 'text-white'
        }
    }
  }

  // Auto-remove notifications after duration
  useEffect(() => {
    const timers: NodeJS.Timeout[] = []
    
    notifications.forEach(notification => {
      if (notification.duration && notification.duration > 0) {
        const timer = setTimeout(() => {
          onRemove(notification.id)
        }, notification.duration)
        timers.push(timer)
      }
    })

    return () => {
      timers.forEach(timer => clearTimeout(timer))
    }
  }, [notifications, onRemove])

  return (
    <div className="fixed top-20 left-4 right-4 z-50 space-y-2">
      <AnimatePresence>
        {notifications.map((notification) => {
          const Icon = getIcon(notification)
          const colors = getColors(notification.type)
          
          return (
            <motion.div
              key={notification.id}
              initial={{ opacity: 0, y: -50, scale: 0.9 }}
              animate={{ opacity: 1, y: 0, scale: 1 }}
              exit={{ opacity: 0, y: -50, scale: 0.9 }}
              transition={{ type: 'spring', damping: 20, stiffness: 300 }}
              className={`${colors.bg} ${colors.border} border rounded-xl p-4 shadow-lg backdrop-blur-sm`}
            >
              <div className="flex items-start space-x-3">
                <Icon className={`w-5 h-5 ${colors.icon} flex-shrink-0 mt-0.5`} />
                <div className="flex-1 min-w-0">
                  <h4 className={`font-semibold ${colors.text} text-sm`}>
                    {notification.title}
                  </h4>
                  <p className={`${colors.text} text-xs opacity-90 mt-1`}>
                    {notification.message}
                  </p>
                </div>
                <button
                  onClick={() => onRemove(notification.id)}
                  className={`${colors.text} opacity-70 hover:opacity-100 transition-opacity`}
                >
                  <X className="w-4 h-4" />
                </button>
              </div>
            </motion.div>
          )
        })}
      </AnimatePresence>
    </div>
  )
}

// Hook personalizado para manejar notificaciones
export function useNotifications() {
  const [notifications, setNotifications] = useState<NotificationData[]>([])

  const addNotification = (notification: Omit<NotificationData, 'id'>) => {
    const id = Date.now().toString()
    const newNotification: NotificationData = {
      id,
      duration: 5000, // 5 segundos por defecto
      ...notification
    }
    
    setNotifications(prev => [...prev, newNotification])
    
    // Vibrar según el tipo
    if ('vibrate' in navigator) {
      switch (notification.type) {
        case 'success':
          navigator.vibrate([50, 50, 50])
          break
        case 'error':
          navigator.vibrate([100, 50, 100, 50, 100])
          break
        case 'warning':
          navigator.vibrate([100, 100])
          break
        case 'info':
        default:
          navigator.vibrate(50)
          break
      }
    }
    
    return id
  }

  const removeNotification = (id: string) => {
    setNotifications(prev => prev.filter(n => n.id !== id))
  }

  const clearAll = () => {
    setNotifications([])
  }

  // Notificaciones específicas para facilitar el uso
  const notifySuccess = (title: string, message: string, options?: Partial<NotificationData>) => {
    return addNotification({ type: 'success', title, message, ...options })
  }

  const notifyError = (title: string, message: string, options?: Partial<NotificationData>) => {
    return addNotification({ type: 'error', title, message, ...options })
  }

  const notifyInfo = (title: string, message: string, options?: Partial<NotificationData>) => {
    return addNotification({ type: 'info', title, message, ...options })
  }

  const notifyWarning = (title: string, message: string, options?: Partial<NotificationData>) => {
    return addNotification({ type: 'warning', title, message, ...options })
  }

  // Notificaciones específicas para la app
  const notifyGPSStatus = (isActive: boolean, accuracy?: number) => {
    if (isActive) {
      return notifySuccess(
        'GPS Activo',
        accuracy ? `Precisión: ±${accuracy.toFixed(1)}m` : 'Localización obtenida',
        { icon: MapPin, duration: 3000 }
      )
    } else {
      return notifyError(
        'GPS Inactivo',
        'No se pudo obtener la ubicación',
        { icon: MapPin, duration: 5000 }
      )
    }
  }

  const notifyCameraStatus = (isActive: boolean) => {
    if (isActive) {
      return notifySuccess(
        'Cámara Activa',
        'Toca la pantalla para capturar puntos',
        { icon: Camera, duration: 3000 }
      )
    } else {
      return notifyError(
        'Error de Cámara',
        'No se pudo acceder a la cámara',
        { icon: Camera, duration: 5000 }
      )
    }
  }

  const notifyConnectionStatus = (isOnline: boolean) => {
    if (isOnline) {
      return notifySuccess(
        'Conexión Restaurada',
        'Vuelves a estar en línea',
        { icon: Wifi, duration: 2000 }
      )
    } else {
      return notifyWarning(
        'Sin Conexión',
        'Trabajando en modo offline',
        { icon: WifiOff, duration: 4000 }
      )
    }
  }

  const notifyMeasurementComplete = (distance: number, pointCount: number) => {
    return notifySuccess(
      'Medición Completada',
      `${distance.toFixed(2)}m con ${pointCount} puntos`,
      { icon: CheckCircle, duration: 4000 }
    )
  }

  const notifyMarkingComplete = (lineCount: number) => {
    return notifySuccess(
      'Marcado Completado',
      `${lineCount} líneas marcadas exitosamente`,
      { icon: CheckCircle, duration: 4000 }
    )
  }

  return {
    notifications,
    addNotification,
    removeNotification,
    clearAll,
    notifySuccess,
    notifyError,
    notifyInfo,
    notifyWarning,
    notifyGPSStatus,
    notifyCameraStatus,
    notifyConnectionStatus,
    notifyMeasurementComplete,
    notifyMarkingComplete
  }
}