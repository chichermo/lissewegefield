'use client'

import { AnimatePresence, motion } from 'framer-motion'
import {
    AlertTriangle,
    BarChart3,
    Calendar,
    CheckCircle,
    Cloud, CloudRain,
    Cloudy,
    Download,
    Edit,
    Eye, EyeOff,
    History,
    Info,
    MapPin,
    Search,
    Share2,
    Snowflake, Sun,
    Trash2,
    XCircle
} from 'lucide-react'
import { useEffect, useState } from 'react'
import { ElementoCancha } from '../../types'

interface HistorialMedicion {
  id: number
  fecha: string
  hora: string
  elementos: ElementoCancha[]
  progresoTotal: number
  distanciaTotal: number
  areaTotal: number
  cumplimientoFIFA: number
  estado: 'completada' | 'en_progreso' | 'cancelada'
  observaciones: string
  condicionesClima: {
    temperatura: number
    humedad: number
    precipitacion: number
    descripcion: string
    icono: string
  }
}

export default function HistorialMediciones() {
  const [historial, setHistorial] = useState<HistorialMedicion[]>([])
  const [filtroEstado, setFiltroEstado] = useState<string>('todos')
  const [filtroFecha, setFiltroFecha] = useState<string>('')
  const [busqueda, setBusqueda] = useState('')
  const [mostrarDetalles, setMostrarDetalles] = useState<number | null>(null)
  const [estadisticas, setEstadisticas] = useState({
    totalMediciones: 0,
    promedioCumplimiento: 0,
    totalDistancia: 0,
    totalArea: 0
  })

  // Simular datos de historial
  useEffect(() => {
    const datosSimulados: HistorialMedicion[] = [
      {
        id: 1,
        fecha: '2024-01-15',
        hora: '10:30',
        elementos: [
          { id: 1, nombre: 'Línea Lateral', tipo: 'linea_lateral', descripcion: 'Medición completa', medicionFIFA: { largo: 100 }, instrucciones: [], color: '#3B82F6', icono: 'Ruler' },
          { id: 2, nombre: 'Línea de Fondo', tipo: 'linea_fondo', descripcion: 'Medición completa', medicionFIFA: { largo: 68 }, instrucciones: [], color: '#10B981', icono: 'Ruler' },
          { id: 3, nombre: 'Círculo Central', tipo: 'circulo_central', descripcion: 'Medición completa', medicionFIFA: { radio: 9.15 }, instrucciones: [], color: '#06B6D4', icono: 'Circle' }
        ],
        progresoTotal: 100,
        distanciaTotal: 268,
        areaTotal: 6800,
        cumplimientoFIFA: 98.5,
        estado: 'completada',
        observaciones: 'Medición exitosa. Todas las líneas cumplen estándares FIFA.',
        condicionesClima: {
          temperatura: 22,
          humedad: 65,
          precipitacion: 0,
          descripcion: 'Soleado',
          icono: 'Sun'
        }
      },
      {
        id: 2,
        fecha: '2024-01-08',
        hora: '09:45',
        elementos: [
          { id: 1, nombre: 'Línea Lateral', tipo: 'linea_lateral', descripcion: 'Medición completa', medicionFIFA: { largo: 100 }, instrucciones: [], color: '#3B82F6', icono: 'Ruler' },
          { id: 4, nombre: 'Área Penal', tipo: 'area_penal', descripcion: 'Medición completa', medicionFIFA: { largo: 16.5, ancho: 40.32 }, instrucciones: [], color: '#EF4444', icono: 'Square' }
        ],
        progresoTotal: 85,
        distanciaTotal: 200,
        areaTotal: 665,
        cumplimientoFIFA: 92.3,
        estado: 'completada',
        observaciones: 'Medición parcial debido a lluvia. Área penal requiere reajuste.',
        condicionesClima: {
          temperatura: 18,
          humedad: 85,
          precipitacion: 15,
          descripcion: 'Lluvia ligera',
          icono: 'CloudRain'
        }
      },
      {
        id: 3,
        fecha: '2024-01-01',
        hora: '10:15',
        elementos: [
          { id: 1, nombre: 'Línea Lateral', tipo: 'linea_lateral', descripcion: 'Medición completa', medicionFIFA: { largo: 100 }, instrucciones: [], color: '#3B82F6', icono: 'Ruler' },
          { id: 2, nombre: 'Línea de Fondo', tipo: 'linea_fondo', descripcion: 'Medición completa', medicionFIFA: { largo: 68 }, instrucciones: [], color: '#10B981', icono: 'Ruler' },
          { id: 3, nombre: 'Círculo Central', tipo: 'circulo_central', descripcion: 'Medición completa', medicionFIFA: { radio: 9.15 }, instrucciones: [], color: '#06B6D4', icono: 'Circle' },
          { id: 4, nombre: 'Área Penal', tipo: 'area_penal', descripcion: 'Medición completa', medicionFIFA: { largo: 16.5, ancho: 40.32 }, instrucciones: [], color: '#EF4444', icono: 'Square' },
          { id: 5, nombre: 'Área de Meta', tipo: 'area_meta', descripcion: 'Medición completa', medicionFIFA: { largo: 5.5, ancho: 18.32 }, instrucciones: [], color: '#8B5CF6', icono: 'Square' }
        ],
        progresoTotal: 100,
        distanciaTotal: 268,
        areaTotal: 6800,
        cumplimientoFIFA: 99.1,
        estado: 'completada',
        observaciones: 'Medición completa exitosa. Cancha en excelentes condiciones.',
        condicionesClima: {
          temperatura: 25,
          humedad: 55,
          precipitacion: 0,
          descripcion: 'Soleado',
          icono: 'Sun'
        }
      },
      {
        id: 4,
        fecha: '2023-12-25',
        hora: '08:30',
        elementos: [
          { id: 1, nombre: 'Línea Lateral', tipo: 'linea_lateral', descripcion: 'Medición parcial', medicionFIFA: { largo: 100 }, instrucciones: [], color: '#3B82F6', icono: 'Ruler' }
        ],
        progresoTotal: 25,
        distanciaTotal: 100,
        areaTotal: 0,
        cumplimientoFIFA: 85.2,
        estado: 'cancelada',
        observaciones: 'Medición cancelada debido a nieve. Condiciones no aptas.',
        condicionesClima: {
          temperatura: -2,
          humedad: 90,
          precipitacion: 25,
          descripcion: 'Nieve',
          icono: 'Snowflake'
        }
      }
    ]

    setHistorial(datosSimulados)

    // Calcular estadísticas
    const total = datosSimulados.length
    const promedio = datosSimulados.reduce((sum, item) => sum + item.cumplimientoFIFA, 0) / total
    const totalDist = datosSimulados.reduce((sum, item) => sum + item.distanciaTotal, 0)
    const totalArea = datosSimulados.reduce((sum, item) => sum + item.areaTotal, 0)

    setEstadisticas({
      totalMediciones: total,
      promedioCumplimiento: promedio,
      totalDistancia: totalDist,
      totalArea: totalArea
    })
  }, [])

  const filtrarHistorial = () => {
    return historial.filter(item => {
      const cumpleEstado = filtroEstado === 'todos' || item.estado === filtroEstado
      const cumpleFecha = !filtroFecha || item.fecha.includes(filtroFecha)
      const cumpleBusqueda = !busqueda ||
        item.observaciones.toLowerCase().includes(busqueda.toLowerCase()) ||
        item.elementos.some(el => el.nombre.toLowerCase().includes(busqueda.toLowerCase()))

      return cumpleEstado && cumpleFecha && cumpleBusqueda
    })
  }

  const obtenerIconoEstado = (estado: string) => {
    switch (estado) {
      case 'completada': return <CheckCircle className="w-5 h-5 futbol-status-success" />
      case 'en_progreso': return <AlertTriangle className="w-5 h-5 futbol-status-warning" />
      case 'cancelada': return <XCircle className="w-5 h-5 futbol-status-danger" />
      default: return <Info className="w-5 h-5 futbol-status-info" />
    }
  }

  const obtenerIconoClima = (icono: string) => {
    switch (icono) {
      case 'Sun': return <Sun className="w-4 h-4" />
      case 'Cloud': return <Cloud className="w-4 h-4" />
      case 'CloudRain': return <CloudRain className="w-4 h-4" />
      case 'Snowflake': return <Snowflake className="w-4 h-4" />
      case 'Cloudy': return <Cloudy className="w-4 h-4" />
      default: return <Sun className="w-4 h-4" />
    }
  }

  const exportarHistorial = () => {
    const datos = filtrarHistorial()
    const csv = [
      ['Fecha', 'Hora', 'Estado', 'Progreso', 'Distancia', 'Área', 'Cumplimiento FIFA', 'Observaciones'],
      ...datos.map(item => [
        item.fecha,
        item.hora,
        item.estado,
        `${item.progresoTotal}%`,
        `${item.distanciaTotal}m`,
        `${item.areaTotal}m²`,
        `${item.cumplimientoFIFA}%`,
        item.observaciones
      ])
    ].map(row => row.join(',')).join('\n')

    const blob = new Blob([csv], { type: 'text/csv' })
    const url = window.URL.createObjectURL(blob)
    const a = document.createElement('a')
    a.href = url
    a.download = `historial-mediciones-${new Date().toISOString().split('T')[0]}.csv`
    a.click()
  }

  const historialFiltrado = filtrarHistorial()

  return (
    <div className="space-y-6">
      {/* Header */}
      <motion.div className="futbol-section" initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }}>
        <div className="futbol-section-header">
          <div>
            <h2 className="futbol-section-title">
              <History className="w-6 h-6" />
              Historial de Mediciones
            </h2>
            <p className="futbol-section-subtitle">Registro completo de todas las mediciones realizadas</p>
          </div>
          <div className="flex items-center space-x-3">
            <motion.button
              onClick={exportarHistorial}
              className="futbol-btn futbol-btn-success"
              whileHover={{ scale: 1.02 }}
              whileTap={{ scale: 0.98 }}
            >
              <Download className="w-4 h-4" />
              <span>Exportar</span>
            </motion.button>
            <motion.button
              onClick={() => setMostrarDetalles(null)}
              className="futbol-btn futbol-btn-secondary"
              whileHover={{ scale: 1.02 }}
              whileTap={{ scale: 0.98 }}
            >
              {mostrarDetalles ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
              <span>Vista</span>
            </motion.button>
          </div>
        </div>

        {/* Estadísticas */}
        <div className="futbol-stats">
          <div className="futbol-stat-card">
            <div className="futbol-stat-icon">
              <History className="w-6 h-6" />
            </div>
            <div className="futbol-stat-value">{estadisticas.totalMediciones}</div>
            <div className="futbol-stat-label">Total Mediciones</div>
          </div>

          <div className="futbol-stat-card">
            <div className="futbol-stat-icon">
              <BarChart3 className="w-6 h-6" />
            </div>
            <div className="futbol-stat-value">{estadisticas.promedioCumplimiento.toFixed(1)}%</div>
            <div className="futbol-stat-label">Promedio FIFA</div>
          </div>

          <div className="futbol-stat-card">
            <div className="futbol-stat-icon">
              <MapPin className="w-6 h-6" />
            </div>
            <div className="futbol-stat-value">{estadisticas.totalDistancia}m</div>
            <div className="futbol-stat-label">Distancia Total</div>
          </div>

          <div className="futbol-stat-card">
            <div className="futbol-stat-icon">
              <Calendar className="w-6 h-6" />
            </div>
            <div className="futbol-stat-value">{estadisticas.totalArea}m²</div>
            <div className="futbol-stat-label">Área Total</div>
          </div>
        </div>

        {/* Filtros */}
        <div className="futbol-grid futbol-grid-3">
          <div>
            <label className="block text-sm font-medium futbol-text-secondary mb-2">Estado</label>
            <select
              value={filtroEstado}
              onChange={(e) => setFiltroEstado(e.target.value)}
              className="futbol-select"
            >
              <option value="todos">Todos los estados</option>
              <option value="completada">Completada</option>
              <option value="en_progreso">En Progreso</option>
              <option value="cancelada">Cancelada</option>
            </select>
          </div>

          <div>
            <label className="block text-sm font-medium futbol-text-secondary mb-2">Fecha</label>
            <input
              type="date"
              value={filtroFecha}
              onChange={(e) => setFiltroFecha(e.target.value)}
              className="futbol-input"
            />
          </div>

          <div>
            <label className="block text-sm font-medium futbol-text-secondary mb-2">Buscar</label>
            <div className="relative">
              <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 w-4 h-4 futbol-text-muted" />
              <input
                type="text"
                placeholder="Buscar en observaciones..."
                value={busqueda}
                onChange={(e) => setBusqueda(e.target.value)}
                className="futbol-input pl-10"
              />
            </div>
          </div>
        </div>
      </motion.div>

      {/* Lista de mediciones */}
      <motion.div className="space-y-4" initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }}>
        {historialFiltrado.map((medicion) => (
          <motion.div
            key={medicion.id}
            className="futbol-card"
            whileHover={{ scale: 1.01 }}
            initial={{ opacity: 0, x: -20 }}
            animate={{ opacity: 1, x: 0 }}
          >
            <div className="flex items-center justify-between mb-4">
              <div className="flex items-center space-x-4">
                {obtenerIconoEstado(medicion.estado)}
                <div>
                  <h3 className="text-lg font-semibold futbol-text-primary">
                    Medición #{medicion.id} - {medicion.fecha}
                  </h3>
                  <p className="futbol-text-secondary">{medicion.hora} • {medicion.elementos.length} elementos</p>
                </div>
              </div>

              <div className="flex items-center space-x-3">
                <div className="text-right">
                  <div className="text-sm futbol-text-secondary">Progreso</div>
                  <div className="text-lg font-bold futbol-text-primary">{medicion.progresoTotal}%</div>
                </div>
                <div className="text-right">
                  <div className="text-sm futbol-text-secondary">FIFA</div>
                  <div className="text-lg font-bold futbol-text-primary">{medicion.cumplimientoFIFA}%</div>
                </div>
                <motion.button
                  onClick={() => setMostrarDetalles(mostrarDetalles === medicion.id ? null : medicion.id)}
                  className="futbol-btn futbol-btn-secondary p-2"
                  whileHover={{ scale: 1.1 }}
                  whileTap={{ scale: 0.9 }}
                >
                  {mostrarDetalles === medicion.id ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
                </motion.button>
              </div>
            </div>

            {/* Información del clima */}
            <div className="flex items-center space-x-4 mb-4 p-3 bg-white/10 rounded-lg">
              {obtenerIconoClima(medicion.condicionesClima.icono)}
              <div className="flex-1">
                <div className="futbol-text-primary font-medium">{medicion.condicionesClima.descripcion}</div>
                <div className="futbol-text-secondary text-sm">
                  {medicion.condicionesClima.temperatura}°C • {medicion.condicionesClima.humedad}% humedad
                </div>
              </div>
              <div className="text-right">
                <div className="text-sm futbol-text-secondary">Precipitación</div>
                <div className="futbol-text-primary font-medium">{medicion.condicionesClima.precipitacion}mm</div>
              </div>
            </div>

            {/* Detalles expandibles */}
            <AnimatePresence>
              {mostrarDetalles === medicion.id && (
                <motion.div
                  initial={{ opacity: 0, height: 0 }}
                  animate={{ opacity: 1, height: 'auto' }}
                  exit={{ opacity: 0, height: 0 }}
                  className="overflow-hidden"
                >
                  <div className="border-t border-white/20 pt-4 space-y-4">
                    {/* Elementos medidos */}
                    <div>
                      <h4 className="futbol-text-primary font-semibold mb-2">Elementos Medidos</h4>
                      <div className="futbol-grid futbol-grid-2">
                        {medicion.elementos.map((elemento) => (
                          <div key={elemento.id} className="flex items-center space-x-2 p-2 bg-white/10 rounded">
                            <div
                              className="w-3 h-3 rounded-full"
                              style={{ backgroundColor: elemento.color }}
                            ></div>
                            <span className="futbol-text-primary text-sm">{elemento.nombre}</span>
                          </div>
                        ))}
                      </div>
                    </div>

                    {/* Estadísticas detalladas */}
                    <div className="futbol-grid futbol-grid-4">
                      <div className="text-center p-3 bg-white/10 rounded">
                        <div className="text-2xl font-bold futbol-text-primary">{medicion.distanciaTotal}m</div>
                        <div className="text-sm futbol-text-secondary">Distancia</div>
                      </div>
                      <div className="text-center p-3 bg-white/10 rounded">
                        <div className="text-2xl font-bold futbol-text-primary">{medicion.areaTotal}m²</div>
                        <div className="text-sm futbol-text-secondary">Área</div>
                      </div>
                      <div className="text-center p-3 bg-white/10 rounded">
                        <div className="text-2xl font-bold futbol-text-primary">{medicion.elementos.length}</div>
                        <div className="text-sm futbol-text-secondary">Elementos</div>
                      </div>
                      <div className="text-center p-3 bg-white/10 rounded">
                        <div className="text-2xl font-bold futbol-text-primary">{medicion.cumplimientoFIFA}%</div>
                        <div className="text-sm futbol-text-secondary">FIFA</div>
                      </div>
                    </div>

                    {/* Observaciones */}
                    <div>
                      <h4 className="futbol-text-primary font-semibold mb-2">Observaciones</h4>
                      <p className="futbol-text-secondary bg-white/10 p-3 rounded">{medicion.observaciones}</p>
                    </div>

                    {/* Acciones */}
                    <div className="flex items-center space-x-2">
                      <motion.button className="futbol-btn futbol-btn-secondary text-sm px-3 py-1" whileHover={{ scale: 1.05 }} whileTap={{ scale: 0.95 }}>
                        <Edit className="w-4 h-4" />
                      </motion.button>
                      <motion.button className="futbol-btn futbol-btn-warning text-sm px-3 py-1" whileHover={{ scale: 1.05 }} whileTap={{ scale: 0.95 }}>
                        <Share2 className="w-4 h-4" />
                      </motion.button>
                      <motion.button className="futbol-btn futbol-btn-danger text-sm px-3 py-1" whileHover={{ scale: 1.05 }} whileTap={{ scale: 0.95 }}>
                        <Trash2 className="w-4 h-4" />
                      </motion.button>
                    </div>
                  </div>
                </motion.div>
              )}
            </AnimatePresence>
          </motion.div>
        ))}
      </motion.div>

      {/* Mensaje si no hay resultados */}
      {historialFiltrado.length === 0 && (
        <motion.div
          className="futbol-card p-8 text-center"
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
        >
          <History className="w-16 h-16 futbol-text-muted mx-auto mb-4" />
          <h3 className="text-xl font-bold futbol-text-primary mb-2">No se encontraron mediciones</h3>
          <p className="futbol-text-secondary">Intenta ajustar los filtros de búsqueda</p>
        </motion.div>
      )}
    </div>
  )
}
