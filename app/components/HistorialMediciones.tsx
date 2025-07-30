'use client'

import { useState, useEffect } from 'react'
import { motion } from 'framer-motion'
import { Calendar, MapPin, Target, Award, Download, Filter, Search, Eye, Trash2 } from 'lucide-react'
import { useAppStore } from '@/stores/useAppStore'

interface HistorialItem {
  id: string
  fecha: string
  hora: string
  tipo: 'medicion' | 'marcado'
  nombre: string
  distancia: number
  cumpleFIFA: boolean
  estado: 'completada' | 'en_progreso' | 'cancelada'
  observaciones: string
}

export default function HistorialMediciones() {
  const { mediciones, lineasMarcado, exportarDatos } = useAppStore()
  const [historial, setHistorial] = useState<HistorialItem[]>([])
  const [filtroEstado, setFiltroEstado] = useState<string>('todos')
  const [filtroFecha, setFiltroFecha] = useState<string>('')
  const [busqueda, setBusqueda] = useState('')
  const [mostrarDetalles, setMostrarDetalles] = useState<string | null>(null)
  const [estadisticas, setEstadisticas] = useState({
    totalMediciones: 0,
    promedioCumplimiento: 0,
    totalDistancia: 0
  })

  // Convertir datos del store a formato de historial
  useEffect(() => {
    const historialMediciones: HistorialItem[] = mediciones
      .filter(m => m.distancia > 0)
      .map(m => ({
        id: m.id,
        fecha: (m.fecha.toISOString().split('T')[0] || new Date().toISOString().split('T')[0] || '') as string,
        hora: m.fecha.toLocaleTimeString(),
        tipo: 'medicion' as const,
        nombre: m.nombre,
        distancia: m.distancia,
        cumpleFIFA: m.cumpleFIFA,
        estado: m.cumpleFIFA ? 'completada' : 'en_progreso',
        observaciones: `Medición de ${m.nombre}: ${m.distancia.toFixed(2)}m`
      }))

    const historialMarcados: HistorialItem[] = lineasMarcado
      .filter(l => l.completada)
      .map(l => ({
        id: l.id.toString(),
        fecha: (new Date().toISOString().split('T')[0] || '') as string,
        hora: new Date().toLocaleTimeString(),
        tipo: 'marcado' as const,
        nombre: l.nombre,
        distancia: l.distancia,
        cumpleFIFA: l.completada,
        estado: l.completada ? 'completada' : 'en_progreso',
        observaciones: `Marcado de ${l.nombre}: ${l.distancia.toFixed(2)}m`
      }))

    const historialCompleto = [...historialMediciones, ...historialMarcados]
    setHistorial(historialCompleto)

    // Calcular estadísticas
    const total = historialCompleto.length
    const promedio = historialCompleto.reduce((sum, item) => sum + (item.cumpleFIFA ? 100 : 85), 0) / total || 0
    const totalDist = historialCompleto.reduce((sum, item) => sum + item.distancia, 0)

    setEstadisticas({
      totalMediciones: total,
      promedioCumplimiento: promedio,
      totalDistancia: totalDist
    })
  }, [mediciones, lineasMarcado])

  const filtrarHistorial = () => {
    return historial.filter(item => {
      const cumpleEstado = filtroEstado === 'todos' || item.estado === filtroEstado
      const cumpleFecha = !filtroFecha || item.fecha.includes(filtroFecha)
      const cumpleBusqueda = !busqueda ||
        item.observaciones.toLowerCase().includes(busqueda.toLowerCase()) ||
        item.nombre.toLowerCase().includes(busqueda.toLowerCase())

      return cumpleEstado && cumpleFecha && cumpleBusqueda
    })
  }

  const obtenerIconoEstado = (estado: string) => {
    switch (estado) {
      case 'completada': return <Award className="w-5 h-5 text-green-400" />
      case 'en_progreso': return <Target className="w-5 h-5 text-yellow-400" />
      case 'cancelada': return <Trash2 className="w-5 h-5 text-red-400" />
      default: return <MapPin className="w-5 h-5 text-blue-400" />
    }
  }

  const obtenerColorEstado = (estado: string) => {
    switch (estado) {
      case 'completada': return 'text-green-400'
      case 'en_progreso': return 'text-yellow-400'
      case 'cancelada': return 'text-red-400'
      default: return 'text-blue-400'
    }
  }

  return (
    <div className="futbol-container">
      <div className="futbol-section">
        <div className="futbol-section-header">
          <div>
            <h2 className="futbol-section-title">
              <Award className="w-6 h-6" />
              Historial de Mediciones y Marcados
            </h2>
            <p className="futbol-section-subtitle">
              Registro completo de todas las mediciones y marcados realizados
            </p>
          </div>
        </div>

        {/* Estadísticas */}
        <div className="futbol-stats">
          <div className="futbol-stat-card">
            <div className="futbol-stat-icon">
              <Award className="w-6 h-6" />
            </div>
            <div className="futbol-stat-value">{estadisticas.totalMediciones}</div>
            <div className="futbol-stat-label">Total Registros</div>
          </div>

          <div className="futbol-stat-card">
            <div className="futbol-stat-icon">
              <Award className="w-6 h-6" />
            </div>
            <div className="futbol-stat-value">{estadisticas.promedioCumplimiento.toFixed(1)}%</div>
            <div className="futbol-stat-label">Cumplimiento Promedio</div>
          </div>

          <div className="futbol-stat-card">
            <div className="futbol-stat-icon">
              <Award className="w-6 h-6" />
            </div>
            <div className="futbol-stat-value">{estadisticas.totalDistancia.toFixed(1)}m</div>
            <div className="futbol-stat-label">Distancia Total</div>
          </div>
        </div>

        {/* Filtros */}
        <div className="mb-6 flex flex-wrap gap-4">
          <div className="flex items-center space-x-2">
            <Filter className="w-5 h-5 text-white/60" />
            <select
              value={filtroEstado}
              onChange={(e) => setFiltroEstado(e.target.value)}
              className="futbol-select"
            >
              <option value="todos">Todos los estados</option>
              <option value="completada">Completada</option>
              <option value="en_progreso">En progreso</option>
              <option value="cancelada">Cancelada</option>
            </select>
          </div>

          <div className="flex items-center space-x-2">
            <Calendar className="w-5 h-5 text-white/60" />
            <input
              type="date"
              value={filtroFecha}
              onChange={(e) => setFiltroFecha(e.target.value)}
              className="futbol-input"
            />
          </div>

          <div className="flex items-center space-x-2">
            <Search className="w-5 h-5 text-white/60" />
            <input
              type="text"
              placeholder="Buscar..."
              value={busqueda}
              onChange={(e) => setBusqueda(e.target.value)}
              className="futbol-input"
            />
          </div>

          <motion.button
            onClick={exportarDatos}
            className="futbol-btn futbol-btn-success"
            whileHover={{ scale: 1.02 }}
            whileTap={{ scale: 0.98 }}
          >
            <Download className="w-5 h-5" />
            Exportar Datos
          </motion.button>
        </div>

        {/* Lista de historial */}
        <div className="space-y-4">
          {filtrarHistorial().length === 0 ? (
            <motion.div
              className="text-center py-12"
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
            >
              <Award className="w-16 h-16 text-white/40 mx-auto mb-4" />
              <h3 className="text-xl font-bold text-white mb-2">No se encontraron registros</h3>
              <p className="text-white/60">Realiza mediciones o marcados para ver el historial</p>
            </motion.div>
          ) : (
            filtrarHistorial().map((item, index) => (
              <motion.div
                key={item.id}
                className="futbol-card"
                initial={{ opacity: 0, x: -20 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ delay: index * 0.1 }}
              >
                <div className="flex items-center justify-between">
                  <div className="flex items-center space-x-4">
                    {obtenerIconoEstado(item.estado)}
                    <div>
                      <h3 className="text-lg font-semibold text-white">{item.nombre}</h3>
                      <p className="text-white/60">{item.observaciones}</p>
                      <div className="flex items-center space-x-4 mt-2 text-sm">
                        <span className="text-white/60">{item.fecha}</span>
                        <span className="text-white/60">{item.hora}</span>
                        <span className={`font-semibold ${obtenerColorEstado(item.estado)}`}>
                          {item.tipo === 'medicion' ? '📏 Medición' : '🎯 Marcado'}
                        </span>
                        <span className="text-white/60">{item.distancia.toFixed(2)}m</span>
                      </div>
                    </div>
                  </div>
                  
                  <div className="flex items-center space-x-2">
                    <motion.button
                      onClick={() => setMostrarDetalles(mostrarDetalles === item.id ? null : item.id)}
                      className="futbol-btn futbol-btn-secondary"
                      whileHover={{ scale: 1.05 }}
                      whileTap={{ scale: 0.95 }}
                    >
                      <Eye className="w-4 h-4" />
                      Detalles
                    </motion.button>
                  </div>
                </div>

                {mostrarDetalles === item.id && (
                  <motion.div
                    className="mt-4 pt-4 border-t border-white/10"
                    initial={{ opacity: 0, height: 0 }}
                    animate={{ opacity: 1, height: 'auto' }}
                  >
                    <div className="grid grid-cols-2 gap-4 text-sm">
                      <div>
                        <span className="text-white/60">Estado:</span>
                        <span className={`ml-2 font-semibold ${obtenerColorEstado(item.estado)}`}>
                          {item.estado}
                        </span>
                      </div>
                      <div>
                        <span className="text-white/60">Cumple FIFA:</span>
                        <span className={`ml-2 font-semibold ${item.cumpleFIFA ? 'text-green-400' : 'text-red-400'}`}>
                          {item.cumpleFIFA ? '✅ Sí' : '❌ No'}
                        </span>
                      </div>
                      <div>
                        <span className="text-white/60">Distancia:</span>
                        <span className="ml-2 font-semibold text-white">{item.distancia.toFixed(2)}m</span>
                      </div>
                      <div>
                        <span className="text-white/60">Tipo:</span>
                        <span className="ml-2 font-semibold text-white">
                          {item.tipo === 'medicion' ? 'Medición' : 'Marcado'}
                        </span>
                      </div>
                    </div>
                  </motion.div>
                )}
              </motion.div>
            ))
          )}
        </div>
      </div>
    </div>
  )
}
