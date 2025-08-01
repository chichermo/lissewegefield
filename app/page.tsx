'use client'

import { motion } from 'framer-motion'
import { useState, useEffect } from 'react'
import Header from './components/Header'
import Navigation from './components/Navigation'
import MedicionAvanzada from './components/MedicionAvanzada'
import MapaVisual from './components/MapaVisual'
import HistorialMediciones from './components/HistorialMediciones'
import CalendarioMarcado from './components/CalendarioMarcado'
import GestionProductos from './components/GestionProductos'
import GPSAvanzado from './components/GPSAvanzado'
import PlantillasFIFA from './components/PlantillasFIFA'
import ReportesAvanzados from './components/ReportesAvanzados'
import GuiaVisual from './components/GuiaVisual'
import GestorCampos from './components/GestorCampos'
import PWAInstaller from './components/PWAInstaller'
import MobileApp from './components/MobileApp'
import MedicionMobile from './components/MedicionMobile'
import MarcadoMobile from './components/MarcadoMobile'
import HomeMobile from './components/HomeMobile'
import { LanguageProvider } from './contexts/LanguageContext'


export default function Home() {
  const [seccionActiva, setSeccionActiva] = useState('inicio')
  const [modoAvanzado, setModoAvanzado] = useState(false)
  const [plantillaSeleccionada, setPlantillaSeleccionada] = useState<any>(null)
  const [isRecording, setIsRecording] = useState(false)

  // Registrar Service Worker
  useEffect(() => {
    if ('serviceWorker' in navigator) {
      navigator.serviceWorker
        .register('/sw.js')
        .then((registration) => {
          console.log('SW registrado:', registration)
        })
        .catch((error) => {
          console.log('SW error:', error)
        })
    }
  }, [])


  const handleStartRecording = () => {
    setIsRecording(true)
    console.log('Iniciando grabación...')
  }

  const handleStopRecording = () => {
    setIsRecording(false)
    console.log('Deteniendo grabación...')
  }

  const renderizarSeccion = () => {
    switch (seccionActiva) {
      case 'inicio':
        return <HomeMobile onNavigate={setSeccionActiva} />

      case 'medicion':
        return (
          <MedicionMobile 
            isRecording={isRecording}
            onRecordingChange={setIsRecording}
          />
        )
      
      case 'medicion-avanzada':
        return <MedicionAvanzada />
      
      case 'marcado':
        return (
          <MarcadoMobile 
            isRecording={isRecording}
            onRecordingChange={setIsRecording}
          />
        )
      
      case 'mapa':
        return <MapaVisual />
      
      case 'historial':
        return <HistorialMediciones />
      
      case 'calendario':
        return <CalendarioMarcado />
      
      case 'productos':
        return <GestionProductos />
      
      case 'campos':
        return <GestorCampos />
      
      case 'gps-avanzado':
        return (
          <GPSAvanzado
            onPosicionObtenida={(posicion) => console.log('Posición obtenida:', posicion)}
            onPrecisionChange={(precision) => console.log('Precisión:', precision)}
            modoProfesional={modoAvanzado}
          />
        )
      
      case 'plantillas':
        return (
          <PlantillasFIFA
            onPlantillaSeleccionada={setPlantillaSeleccionada}
            plantillaActual={plantillaSeleccionada}
          />
        )
      
             case 'reportes':
         return (
           <ReportesAvanzados
             onExportarReporte={(formato) => console.log('Exportando:', formato)}
           />
         )
      
             case 'guia':
         return (
           <GuiaVisual
             onPasoCompletado={(pasoId) => console.log('Paso completado:', pasoId)}
             onGuiaCompletada={() => console.log('Guía completada')}
           />
         )
      
      default:
        return <div>Sección no encontrada</div>
    }
  }

  return (
    <LanguageProvider>
      <div className="min-h-screen bg-gradient-to-br from-green-900 via-green-800 to-green-700">
      {/* Versión móvil */}
      <div className="lg:hidden">
        <MobileApp 
          onNavigate={setSeccionActiva} 
          activeSection={seccionActiva}
          onStartRecording={handleStartRecording}
          onStopRecording={handleStopRecording}
          isRecording={isRecording}
        />
        <div className="pt-24 pb-20 px-4">
          {renderizarSeccion()}
        </div>
      </div>

      {/* Versión desktop */}
      <div className="hidden lg:block">
        <Header onNavigate={setSeccionActiva} activeSection={seccionActiva} />
        
        <div className="container mx-auto px-4 py-8">
          <div className="flex flex-col lg:flex-row gap-8">
            {/* Navegación */}
            <div className="lg:w-64">
              <Navigation
                onNavigate={setSeccionActiva}
                activeSection={seccionActiva}
              />
              
              {/* Modo Avanzado */}
              <motion.div
                className="futbol-card mt-4"
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
              >
                <div className="flex items-center justify-between">
                  <span className="text-white font-medium">Modo Avanzado</span>
                  <motion.button
                    onClick={() => setModoAvanzado(!modoAvanzado)}
                    className={`w-12 h-6 rounded-full transition-colors ${
                      modoAvanzado ? 'bg-blue-500' : 'bg-white/20'
                    }`}
                    whileTap={{ scale: 0.95 }}
                  >
                    <motion.div
                      className="w-4 h-4 bg-white rounded-full"
                      animate={{ x: modoAvanzado ? 24 : 2 }}
                      transition={{ type: "spring", stiffness: 500, damping: 30 }}
                    />
                  </motion.button>
                </div>
                {modoAvanzado && (
                  <p className="text-xs text-white/70 mt-2">
                    Funciones profesionales habilitadas
                  </p>
                )}
              </motion.div>
            </div>

            {/* Contenido Principal */}
            <div className="flex-1">
              {renderizarSeccion()}
            </div>
          </div>
        </div>
      </div>
      
      {/* PWA Installer */}
      <PWAInstaller />
      </div>
    </LanguageProvider>
  )
}
