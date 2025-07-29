import { useState, useEffect, useCallback } from 'react'
import { Position } from '@/types'

interface GPSState {
  position: Position | null
  accuracy: number
  signal: number
  isActive: boolean
  error: string | null
  isLoading: boolean
}

interface GPSOptions {
  enableHighAccuracy?: boolean
  timeout?: number
  maximumAge?: number
}

const useGPS = (options: GPSOptions = {}) => {
  const [state, setState] = useState<GPSState>({
    position: null,
    accuracy: 0,
    signal: 0,
    isActive: false,
    error: null,
    isLoading: false,
  })

  const [watchId, setWatchId] = useState<number | null>(null)

  const startGPS = useCallback(() => {
    if (!navigator.geolocation) {
      setState(prev => ({
        ...prev,
        error: 'GPS no disponible en este dispositivo',
        isLoading: false,
      }))
      return
    }

    setState(prev => ({ ...prev, isLoading: true, error: null }))

    const defaultOptions = {
      enableHighAccuracy: true,
      timeout: 10000,
      maximumAge: 0,
      ...options,
    }

    const successCallback = (position: GeolocationPosition) => {
      const newPosition: Position = {
        latitude: position.coords.latitude,
        longitude: position.coords.longitude,
        accuracy: position.coords.accuracy,
      }

      setState(prev => ({
        ...prev,
        position: newPosition,
        accuracy: position.coords.accuracy,
        signal: Math.max(0, 100 - position.coords.accuracy),
        isActive: true,
        isLoading: false,
        error: null,
      }))
    }

    const errorCallback = (error: GeolocationPositionError) => {
      let errorMessage = 'Error desconocido al obtener ubicación'
      
      switch (error.code) {
        case error.PERMISSION_DENIED:
          errorMessage = 'Permiso de ubicación denegado'
          break
        case error.POSITION_UNAVAILABLE:
          errorMessage = 'Información de ubicación no disponible'
          break
        case error.TIMEOUT:
          errorMessage = 'Tiempo de espera agotado'
          break
      }

      setState(prev => ({
        ...prev,
        error: errorMessage,
        isLoading: false,
        isActive: false,
      }))
    }

    try {
      const id = navigator.geolocation.watchPosition(
        successCallback,
        errorCallback,
        defaultOptions
      )
      setWatchId(id)
    } catch (error) {
      setState(prev => ({
        ...prev,
        error: 'Error al iniciar GPS',
        isLoading: false,
      }))
    }
  }, [options])

  const stopGPS = useCallback(() => {
    if (watchId !== null) {
      navigator.geolocation.clearWatch(watchId)
      setWatchId(null)
    }

    setState(prev => ({
      ...prev,
      isActive: false,
      isLoading: false,
    }))
  }, [watchId])

  const getCurrentPosition = useCallback(() => {
    if (!navigator.geolocation) {
      setState(prev => ({
        ...prev,
        error: 'GPS no disponible en este dispositivo',
      }))
      return Promise.reject(new Error('GPS no disponible'))
    }

    setState(prev => ({ ...prev, isLoading: true, error: null }))

    const defaultOptions = {
      enableHighAccuracy: true,
      timeout: 10000,
      maximumAge: 0,
      ...options,
    }

    return new Promise<Position>((resolve, reject) => {
      navigator.geolocation.getCurrentPosition(
        (position) => {
          const newPosition: Position = {
            latitude: position.coords.latitude,
            longitude: position.coords.longitude,
            accuracy: position.coords.accuracy,
          }

          setState(prev => ({
            ...prev,
            position: newPosition,
            accuracy: position.coords.accuracy,
            signal: Math.max(0, 100 - position.coords.accuracy),
            isActive: true,
            isLoading: false,
            error: null,
          }))

          resolve(newPosition)
        },
        (error) => {
          let errorMessage = 'Error desconocido al obtener ubicación'
          
          switch (error.code) {
            case error.PERMISSION_DENIED:
              errorMessage = 'Permiso de ubicación denegado'
              break
            case error.POSITION_UNAVAILABLE:
              errorMessage = 'Información de ubicación no disponible'
              break
            case error.TIMEOUT:
              errorMessage = 'Tiempo de espera agotado'
              break
          }

          setState(prev => ({
            ...prev,
            error: errorMessage,
            isLoading: false,
            isActive: false,
          }))

          reject(error)
        },
        defaultOptions
      )
    })
  }, [options])

  // Limpiar al desmontar
  useEffect(() => {
    return () => {
      if (watchId !== null) {
        navigator.geolocation.clearWatch(watchId)
      }
    }
  }, [watchId])

  return {
    ...state,
    startGPS,
    stopGPS,
    getCurrentPosition,
  }
}

export default useGPS 