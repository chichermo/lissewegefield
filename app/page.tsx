'use client'

import { motion } from 'framer-motion'
import { useState } from 'react'
import Header from './components/Header'
import Navigation from './components/Navigation'
import MedicionCancha from './components/MedicionCancha'
import MedicionAvanzada from './components/MedicionAvanzada'
import MarcadoInteligente from './components/MarcadoInteligente'
import MapaVisual from './components/MapaVisual'
import HistorialMediciones from './components/HistorialMediciones'
import CalendarioMarcado from './components/CalendarioMarcado'
import GestionProductos from './components/GestionProductos'
import GPSAvanzado from './components/GPSAvanzado'
import PlantillasFIFA from './components/PlantillasFIFA'
import ReportesAvanzados from './components/ReportesAvanzados'
import GuiaVisual from './components/GuiaVisual'
import GestorCampos from './components/GestorCampos'


export default function Home() {
  const [seccionActiva, setSeccionActiva] = useState('inicio')
  const [modoAvanzado, setModoAvanzado] = useState(false)
  const [plantillaSeleccionada, setPlantillaSeleccionada] = useState<any>(null)



  const renderizarSeccion = () => {
    switch (seccionActiva) {
      case 'inicio':
        return (
          <motion.div
            className="space-y-6"
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
          >
            <div className="futbol-card text-center">
              <h1 className="text-4xl font-bold text-white mb-4">
                Cancha Inteligente Pro
              </h1>
              <p className="text-xl text-white/70 mb-6">
                Sistema profesional de medición y marcado de canchas FIFA
              </p>
              <div className="flex justify-center gap-4">
                <motion.button
                  onClick={() => setSeccionActiva('medicion')}
                  className="futbol-btn futbol-btn-primary"
                  whileHover={{ scale: 1.05 }}
                  whileTap={{ scale: 0.95 }}
                >
                  Iniciar Medición
                </motion.button>
                <motion.button
                  onClick={() => setSeccionActiva('plantillas')}
                  className="futbol-btn futbol-btn-success"
                  whileHover={{ scale: 1.05 }}
                  whileTap={{ scale: 0.95 }}
                >
                  Ver Plantillas FIFA
                </motion.button>
              </div>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
              <motion.div
                className="futbol-card"
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.1 }}
              >
                <h3 className="text-lg font-bold text-white mb-3">🎯 Precisión FIFA</h3>
                <p className="text-white/70">
                  Medición con precisión milimétrica según estándares oficiales FIFA
                </p>
              </motion.div>

              <motion.div
                className="futbol-card"
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.2 }}
              >
                <h3 className="text-lg font-bold text-white mb-3">🛰️ GPS RTK</h3>
                <p className="text-white/70">
                  GPS de alta precisión con tecnología RTK para mediciones profesionales
                </p>
              </motion.div>

              <motion.div
                className="futbol-card"
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.3 }}
              >
                <h3 className="text-lg font-bold text-white mb-3">📊 Reportes Avanzados</h3>
                <p className="text-white/70">
                  Generación automática de reportes con análisis detallado
                </p>
              </motion.div>
            </div>
          </motion.div>
        )

      case 'medicion':
        return <MedicionCancha />
      

      
      case 'medicion-avanzada':
        return <MedicionAvanzada />
      
      case 'marcado':
        return <MarcadoInteligente />
      
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
    <div className="min-h-screen bg-gradient-to-br from-green-900 via-green-800 to-green-700">
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
  )
}
