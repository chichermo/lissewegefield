'use client'

import { motion } from 'framer-motion'
import {
    BarChart3,
    Bell,
    Calendar,
    CalendarDays,
    CheckCircle,
    ChevronLeft,
    ChevronRight,
    Clock,
    Clock4,
    Cloud,
    Cloudy,
    Download,
    Edit,
    Plus,
    Shield,
    SortAsc,
    Sun,
    Trash2,
    TrendingUp,
    UserCheck,
    Zap
} from 'lucide-react'
import { useEffect, useState } from 'react'
import { EventoMarcado } from '../../types'

export default function CalendarioMarcado() {
  const [eventos, setEventos] = useState<EventoMarcado[]>([
    {
      id: '1',
      titulo: 'Marcado de líneas FIFA',
      descripcion: 'Renovar líneas de la cancha principal con pintura profesional según estándares FIFA',
      fecha: new Date(Date.now() + 7 * 24 * 60 * 60 * 1000).toISOString().split('T')[0] || '',
      hora: '09:00',
      tipo: 'marcado',
      estado: 'pendiente',
      responsable: 'Juan Pérez'
    },
    {
      id: '2',
      titulo: 'Fertilización avanzada',
      descripcion: 'Aplicar fertilizante NPK de alta calidad para optimizar crecimiento del pasto',
      fecha: new Date(Date.now() + 3 * 24 * 60 * 60 * 1000).toISOString().split('T')[0] || '',
      hora: '14:00',
      tipo: 'mantenimiento',
      estado: 'en_progreso',
      responsable: 'María García'
    },
    {
      id: '3',
      titulo: 'Revisión de porterías FIFA',
      descripcion: 'Verificar estado de redes y postes según estándares FIFA profesionales',
      fecha: new Date(Date.now() + 1 * 24 * 60 * 60 * 1000).toISOString().split('T')[0] || '',
      hora: '16:00',
      tipo: 'revision',
      estado: 'completado',
      responsable: 'Carlos López'
    }
  ])

  const [filtroTipo, setFiltroTipo] = useState('')
  const [filtroEstado, setFiltroEstado] = useState('')
  const [modoAvanzado, setModoAvanzado] = useState(false)
  const [ordenamiento, setOrdenamiento] = useState<'fecha' | 'hora' | 'prioridad'>('fecha')
  const [direccionOrden, setDireccionOrden] = useState<'asc' | 'desc'>('asc')

  // Estados para el calendario visual
  const [mesActual, setMesActual] = useState(new Date())
  const [eventoSeleccionado, setEventoSeleccionado] = useState<EventoMarcado | null>(null)

  // Estados avanzados que cambian según el modo
  const [estadisticasAvanzadas, setEstadisticasAvanzadas] = useState({
    eventosSemana: 0,
    promedioCompletacion: 0,
    tendenciaProductividad: 0,
    responsablesPrincipales: '',
    tiempoPromedio: 0
  })

  const [configuracionFIFA] = useState({
    frecuenciaMarcado: 'Semanal',
    estandaresCalidad: 'Premium',
    responsablesAutorizados: ['Juan Pérez', 'María García', 'Carlos López'],
    tiempoMaximo: 480 // 8 horas
  })

  // Simular datos avanzados cuando el modo avanzado está activo
  useEffect(() => {
    if (modoAvanzado) {
      const interval = setInterval(() => {
        setEstadisticasAvanzadas({
          eventosSemana: Math.floor(Math.random() * 20) + 10,
          promedioCompletacion: Math.random() * 30 + 70,
          tendenciaProductividad: Math.random() * 20 + 80,
          responsablesPrincipales: 'Juan Pérez, María García',
          tiempoPromedio: Math.random() * 4 + 2
        })
      }, 3000)
      return () => clearInterval(interval)
    }
    return undefined
  }, [modoAvanzado])

  const agregarEvento = (nuevoEvento: Omit<EventoMarcado, 'id'>) => {
    const evento: EventoMarcado = {
      ...nuevoEvento,
      id: Date.now().toString()
    }
    setEventos([...eventos, evento])
  }

  const editarEvento = (id: string, datosActualizados: Partial<EventoMarcado>) => {
    setEventos(eventos.map(evento =>
      evento.id === id ? { ...evento, ...datosActualizados } : evento
    ))
  }

  const eliminarEvento = (id: string) => {
    setEventos(eventos.filter(evento => evento.id !== id))
  }

  const completarEvento = (id: string) => {
    setEventos(eventos.map(evento =>
      evento.id === id ? { ...evento, estado: 'completado' as const } : evento
    ))
  }

  const obtenerColorEstado = (estado: string) => {
    switch (estado) {
      case 'pendiente': return 'text-yellow-500'
      case 'en_progreso': return 'text-blue-500'
      case 'completado': return 'text-green-500'
      default: return 'text-gray-500'
    }
  }



  const obtenerIconoTipo = (tipo: string) => {
    switch (tipo) {
      case 'marcado':
        return <CheckCircle className="w-5 h-5 text-green-500" />
      case 'mantenimiento':
        return <Edit className="w-5 h-5 text-blue-500" />
      case 'revision':
        return <Bell className="w-5 h-5 text-orange-500" />
      default:
        return <CheckCircle className="w-5 h-5 text-gray-500" />
    }
  }

  const obtenerIconoEstado = (estado: string) => {
    switch (estado) {
      case 'pendiente':
        return <Cloud className="w-5 h-5 text-yellow-500" />
      case 'en_progreso':
        return <Sun className="w-5 h-5 text-blue-500" />
      case 'completado':
        return <CheckCircle className="w-5 h-5 text-green-500" />
      default:
        return <Cloudy className="w-5 h-5 text-gray-500" />
    }
  }

  const exportarCalendario = () => {
    const datos = {
      eventos,
      fecha: new Date().toISOString()
    }
    const blob = new Blob([JSON.stringify(datos, null, 2)], { type: 'application/json' })
    const url = URL.createObjectURL(blob)
    const a = document.createElement('a')
    a.href = url
    a.download = `calendario-marcado-${new Date().toISOString().split('T')[0]}.json`
    document.body.appendChild(a)
    a.click()
    document.body.removeChild(a)
    URL.revokeObjectURL(url)
  }

  // Funciones para el calendario visual
  const obtenerDiasMes = (fecha: Date) => {
    const año = fecha.getFullYear()
    const mes = fecha.getMonth()
    const primerDia = new Date(año, mes, 1)
    const ultimoDia = new Date(año, mes + 1, 0)
    const diasEnMes = ultimoDia.getDate()
    const primerDiaSemana = primerDia.getDay()

    const dias = []

    // Agregar días del mes anterior para completar la primera semana
    for (let i = primerDiaSemana - 1; i >= 0; i--) {
      const dia = new Date(año, mes, -i)
      dias.push({ fecha: dia, esMesActual: false })
    }

    // Agregar días del mes actual
    for (let i = 1; i <= diasEnMes; i++) {
      const dia = new Date(año, mes, i)
      dias.push({ fecha: dia, esMesActual: true })
    }

    // Agregar días del mes siguiente para completar la última semana
    const diasRestantes = 42 - dias.length // 6 semanas * 7 días
    for (let i = 1; i <= diasRestantes; i++) {
      const dia = new Date(año, mes + 1, i)
      dias.push({ fecha: dia, esMesActual: false })
    }

    return dias
  }

  const obtenerEventosDelDia = (fecha: Date) => {
    const fechaStr = fecha.toISOString().split('T')[0]
    return eventos.filter(evento => evento.fecha === fechaStr)
  }

  const cambiarMes = (direccion: 'anterior' | 'siguiente') => {
    setMesActual(prev => {
      const nuevoMes = new Date(prev)
      if (direccion === 'anterior') {
        nuevoMes.setMonth(nuevoMes.getMonth() - 1)
      } else {
        nuevoMes.setMonth(nuevoMes.getMonth() + 1)
      }
      return nuevoMes
    })
  }

  const proximoSabado = new Date()
  proximoSabado.setDate(proximoSabado.getDate() + (6 - proximoSabado.getDay() + 7) % 7)

  const eventosFiltrados = eventos
    .filter(evento =>
      (!filtroTipo || evento.tipo === filtroTipo) &&
      (!filtroEstado || evento.estado === filtroEstado)
    )
    .sort((a, b) => {
      if (ordenamiento === 'fecha') {
        return direccionOrden === 'asc' ? a.fecha.localeCompare(b.fecha) : b.fecha.localeCompare(a.fecha)
      } else if (ordenamiento === 'hora') {
        return direccionOrden === 'asc' ? a.hora.localeCompare(b.hora) : b.hora.localeCompare(a.hora)
      }
      return 0
    })

  const diasMes = obtenerDiasMes(mesActual)
  const nombresMeses = [
    'Enero', 'Febrero', 'Marzo', 'Abril', 'Mayo', 'Junio',
    'Julio', 'Agosto', 'Septiembre', 'Octubre', 'Noviembre', 'Diciembre'
  ]
  const nombresDias = ['Dom', 'Lun', 'Mar', 'Mié', 'Jue', 'Vie', 'Sáb']

  return (
    <div className="space-y-6">
      {/* Header principal */}
      <motion.div
        className="futbol-card"
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
      >
        <div className="flex items-center justify-between mb-6">
          <div className="flex items-center space-x-4">
            <div className="relative">
              <div className="w-12 h-12 bg-gradient-to-br from-purple-500 to-pink-600 rounded-2xl flex items-center justify-center">
                <Calendar className="w-6 h-6 text-white" />
              </div>
              <div className="absolute -top-1 -right-1 w-4 h-4 bg-green-400 rounded-full animate-pulse"></div>
            </div>
            <div>
              <h2 className="text-2xl font-bold text-gradient">Calendario de Marcado Pro</h2>
              <p className="text-white/70">Sistema profesional de programación y gestión de tareas FIFA</p>
            </div>
          </div>

          <div className="flex items-center space-x-4">
            <div className="futbol-indicator success">
              <CalendarDays className="w-4 h-4" />
              <span>{eventos.length} Eventos</span>
            </div>
            <div className="futbol-indicator info">
              <Clock4 className="w-4 h-4" />
              <span>{eventos.filter(e => e.estado === 'pendiente').length} Pendientes</span>
            </div>
            <div className="futbol-indicator success">
              <UserCheck className="w-4 h-4" />
              <span>{new Set(eventos.map(e => e.responsable)).size} Responsables</span>
            </div>
          </div>
        </div>

        {/* Panel de control avanzado - solo visible en modo avanzado */}
        {modoAvanzado && (
          <motion.div
            className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-6"
            initial={{ opacity: 0, height: 0 }}
            animate={{ opacity: 1, height: 'auto' }}
            exit={{ opacity: 0, height: 0 }}
          >
            <motion.div className="futbol-card" whileHover={{ scale: 1.02 }}>
              <h3 className="text-lg font-bold mb-3 flex items-center gap-2">
                <Shield className="w-5 h-5 text-blue-400" />
                Estándares FIFA
              </h3>
              <div className="space-y-2 text-sm">
                <div className="flex justify-between">
                  <span>Frecuencia:</span>
                  <span className="text-green-400">{configuracionFIFA.frecuenciaMarcado}</span>
                </div>
                <div className="flex justify-between">
                  <span>Calidad:</span>
                  <span className="text-blue-400">{configuracionFIFA.estandaresCalidad}</span>
                </div>
                <div className="flex justify-between">
                  <span>Tiempo Máx:</span>
                  <span className="text-purple-400">{configuracionFIFA.tiempoMaximo / 60}h</span>
                </div>
              </div>
            </motion.div>

            <motion.div className="futbol-card" whileHover={{ scale: 1.02 }}>
              <h3 className="text-lg font-bold mb-3 flex items-center gap-2">
                <Zap className="w-5 h-5 text-yellow-400" />
                Estado del Sistema
              </h3>
              <div className="space-y-2 text-sm">
                <div className="flex justify-between">
                  <span>Eventos Semana:</span>
                  <span className="text-green-400">{estadisticasAvanzadas.eventosSemana}</span>
                </div>
                <div className="flex justify-between">
                  <span>Completación:</span>
                  <span className="text-blue-400">{estadisticasAvanzadas.promedioCompletacion.toFixed(1)}%</span>
                </div>
                <div className="flex justify-between">
                  <span>Productividad:</span>
                  <span className="text-purple-400">{estadisticasAvanzadas.tendenciaProductividad.toFixed(1)}%</span>
                </div>
              </div>
            </motion.div>

            <motion.div className="futbol-card" whileHover={{ scale: 1.02 }}>
              <h3 className="text-lg font-bold mb-3 flex items-center gap-2">
                <BarChart3 className="w-5 h-5 text-purple-400" />
                Estadísticas Avanzadas
              </h3>
              <div className="space-y-2 text-sm">
                <div className="flex justify-between">
                  <span>Tiempo Prom:</span>
                  <span className="text-green-400">{estadisticasAvanzadas.tiempoPromedio.toFixed(1)}h</span>
                </div>
                <div className="flex justify-between">
                  <span>Responsables:</span>
                  <span className="text-blue-400">{estadisticasAvanzadas.responsablesPrincipales}</span>
                </div>
                <div className="flex justify-between">
                  <span>Eficiencia:</span>
                  <span className="text-purple-400">{(estadisticasAvanzadas.promedioCompletacion * 0.8).toFixed(1)}%</span>
                </div>
              </div>
            </motion.div>
          </motion.div>
        )}
      </motion.div>

      {/* Calendario Visual */}
      <motion.div
        className="futbol-card"
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.1 }}
      >
        <div className="flex items-center justify-between mb-6">
          <h3 className="text-xl font-bold text-white">Calendario Visual</h3>
          <div className="flex items-center space-x-4">
            <motion.button
              onClick={() => cambiarMes('anterior')}
              className="p-2 bg-blue-500/20 hover:bg-blue-500/30 rounded-lg transition-colors"
              whileHover={{ scale: 1.1 }}
              whileTap={{ scale: 0.9 }}
            >
              <ChevronLeft className="w-5 h-5 text-blue-400" />
            </motion.button>

            <span className="text-lg font-semibold text-white">
              {nombresMeses[mesActual.getMonth()]} {mesActual.getFullYear()}
            </span>

            <motion.button
              onClick={() => cambiarMes('siguiente')}
              className="p-2 bg-blue-500/20 hover:bg-blue-500/30 rounded-lg transition-colors"
              whileHover={{ scale: 1.1 }}
              whileTap={{ scale: 0.9 }}
            >
              <ChevronRight className="w-5 h-5 text-blue-400" />
            </motion.button>
          </div>
        </div>

        {/* Grid del calendario */}
        <div className="grid grid-cols-7 gap-1 mb-6">
          {/* Headers de días */}
          {nombresDias.map(dia => (
            <div key={dia} className="p-3 text-center font-semibold text-white/80 bg-blue-500/20 rounded-lg">
              {dia}
            </div>
          ))}

          {/* Días del mes */}
          {diasMes.map(({ fecha, esMesActual }, index) => {
            const eventosDelDia = obtenerEventosDelDia(fecha)
            const esHoy = fecha.toDateString() === new Date().toDateString()

            return (
              <motion.div
                key={index}
                className={`p-3 min-h-[80px] border border-white/10 rounded-lg cursor-pointer transition-all ${
                  esMesActual ? 'bg-white/5' : 'bg-white/2'
                } ${esHoy ? 'ring-2 ring-blue-400' : ''}`}
                onClick={() => {
                  if (eventosDelDia.length > 0) {
                    setEventoSeleccionado(eventosDelDia[0] || null)
                  }
                }}
                whileHover={{ scale: 1.02 }}
              >
                <div className="text-sm font-medium text-white/60 mb-2">
                  {fecha.getDate()}
                </div>

                {/* Eventos del día */}
                <div className="space-y-1">
                  {eventosDelDia.slice(0, 2).map(evento => (
                    <div
                      key={evento.id}
                      className={`text-xs p-1 rounded ${
                        evento.tipo === 'marcado' ? 'bg-green-500/20 text-green-400' :
                        evento.tipo === 'mantenimiento' ? 'bg-blue-500/20 text-blue-400' :
                        'bg-orange-500/20 text-orange-400'
                      }`}
                    >
                      {evento.titulo.substring(0, 15)}...
                    </div>
                  ))}
                  {eventosDelDia.length > 2 && (
                    <div className="text-xs text-white/60">
                      +{eventosDelDia.length - 2} más
                    </div>
                  )}
                </div>
              </motion.div>
            )
          })}
        </div>
      </motion.div>

      {/* Controles y filtros */}
      <motion.div
        className="futbol-card"
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.2 }}
      >
        <div className="flex items-center justify-between mb-6">
          <h3 className="text-xl font-bold text-white">Eventos Programados</h3>
          <motion.button
            onClick={() => {
              agregarEvento({
                titulo: 'Nuevo evento',
                descripcion: 'Descripción del nuevo evento',
                fecha: proximoSabado.toISOString().split('T')[0] || '',
                hora: '10:00',
                tipo: 'marcado',
                estado: 'pendiente',
                responsable: 'Usuario'
              })
            }}
            className="futbol-btn futbol-btn-primary flex items-center space-x-2"
            whileHover={{ scale: 1.02 }}
            whileTap={{ scale: 0.98 }}
          >
            <Plus className="w-5 h-5" />
            <span>Agregar Evento</span>
          </motion.button>
        </div>

        {/* Controles y filtros */}
        <div className="flex flex-wrap gap-4 mb-6">
          <motion.button
            onClick={() => setModoAvanzado(!modoAvanzado)}
            className={`futbol-btn flex items-center space-x-2 ${
              modoAvanzado ? 'futbol-btn-warning' : 'futbol-btn-primary'
            }`}
            whileHover={{ scale: 1.02 }}
            whileTap={{ scale: 0.98 }}
          >
            <TrendingUp className="w-5 h-5" />
            <span>{modoAvanzado ? '📊 Modo Básico' : '⚡ Modo Avanzado'}</span>
          </motion.button>

          <motion.button
            onClick={exportarCalendario}
            className="futbol-btn futbol-btn-success flex items-center space-x-2"
            whileHover={{ scale: 1.02 }}
            whileTap={{ scale: 0.98 }}
          >
            <Download className="w-5 h-5" />
            <span>📊 Exportar Calendario</span>
          </motion.button>

          <motion.button
            onClick={() => {
              setOrdenamiento('fecha')
              setDireccionOrden(direccionOrden === 'asc' ? 'desc' : 'asc')
            }}
            className="futbol-btn futbol-btn-secondary flex items-center space-x-2"
            whileHover={{ scale: 1.02 }}
            whileTap={{ scale: 0.98 }}
          >
            <SortAsc className="w-5 h-5" />
            <span>📅 Ordenar por Fecha {direccionOrden === 'asc' ? '↑' : '↓'}</span>
          </motion.button>

          <motion.button
            onClick={() => {
              setOrdenamiento('hora')
              setDireccionOrden(direccionOrden === 'asc' ? 'desc' : 'asc')
            }}
            className="futbol-btn futbol-btn-secondary flex items-center space-x-2"
            whileHover={{ scale: 1.02 }}
            whileTap={{ scale: 0.98 }}
          >
            <Clock className="w-5 h-5" />
            <span>⏰ Ordenar por Hora {direccionOrden === 'asc' ? '↑' : '↓'}</span>
          </motion.button>

          <div className="flex items-center space-x-4">
            <select
              value={filtroTipo}
              onChange={(e) => setFiltroTipo(e.target.value)}
              className="futbol-input"
            >
              <option value="">🎯 Todos los Tipos</option>
              <option value="marcado">🎨 Marcado</option>
              <option value="mantenimiento">🔧 Mantenimiento</option>
              <option value="revision">👁️ Revisión</option>
            </select>

            <select
              value={filtroEstado}
              onChange={(e) => setFiltroEstado(e.target.value)}
              className="futbol-input"
            >
              <option value="">📊 Todos los Estados</option>
              <option value="pendiente">⏳ Pendiente</option>
              <option value="en_progreso">🔄 En Progreso</option>
              <option value="completado">✅ Completado</option>
            </select>
          </div>
        </div>

        {/* Lista de eventos */}
        <div className="space-y-4">
          {eventosFiltrados.map((evento) => (
            <motion.div
              key={evento.id}
              className="futbol-card"
              whileHover={{ scale: 1.02 }}
              initial={{ opacity: 0, x: -20 }}
              animate={{ opacity: 1, x: 0 }}
            >
              <div className="flex items-center justify-between">
                <div className="flex items-center space-x-4">
                  <div className="flex items-center space-x-3">
                    {obtenerIconoTipo(evento.tipo)}
                    <div>
                      <h3 className="text-lg font-semibold text-white">{evento.titulo}</h3>
                      <p className="text-white/70 text-sm">{evento.descripcion}</p>
                      <div className="flex items-center space-x-4 mt-2">
                        <span className="text-sm text-white/60">📅 {evento.fecha}</span>
                        <span className="text-sm text-white/60">⏰ {evento.hora}</span>
                        <span className="text-sm text-white/60">👤 {evento.responsable}</span>
                      </div>
                    </div>
                  </div>
                </div>

                <div className="flex items-center space-x-3">
                  <div className={`px-3 py-1 rounded-full text-sm font-semibold ${obtenerColorEstado(evento.estado)}`}>
                    {obtenerIconoEstado(evento.estado)}
                    <span className="ml-1 capitalize">{evento.estado.replace('_', ' ')}</span>
                  </div>

                  <div className="flex items-center space-x-2">
                    <motion.button
                      onClick={() => completarEvento(evento.id)}
                      className="p-2 bg-green-500/20 hover:bg-green-500/30 rounded-lg transition-colors"
                      whileHover={{ scale: 1.1 }}
                      whileTap={{ scale: 0.9 }}
                    >
                      <CheckCircle className="w-4 h-4 text-green-400" />
                    </motion.button>

                    <motion.button
                      onClick={() => editarEvento(evento.id, { estado: 'en_progreso' as const })}
                      className="p-2 bg-blue-500/20 hover:bg-blue-500/30 rounded-lg transition-colors"
                      whileHover={{ scale: 1.1 }}
                      whileTap={{ scale: 0.9 }}
                    >
                      <Edit className="w-4 h-4 text-blue-400" />
                    </motion.button>

                    <motion.button
                      onClick={() => eliminarEvento(evento.id)}
                      className="p-2 bg-red-500/20 hover:bg-red-500/30 rounded-lg transition-colors"
                      whileHover={{ scale: 1.1 }}
                      whileTap={{ scale: 0.9 }}
                    >
                      <Trash2 className="w-4 h-4 text-red-400" />
                    </motion.button>
                  </div>
                </div>
              </div>
            </motion.div>
          ))}
        </div>
      </motion.div>

      {/* Modal de evento seleccionado */}
      {eventoSeleccionado && (
        <motion.div
          className="fixed inset-0 bg-black/50 flex items-center justify-center z-50"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          onClick={() => setEventoSeleccionado(null)}
        >
          <motion.div
            className="futbol-card max-w-md w-full mx-4"
            initial={{ scale: 0.9, opacity: 0 }}
            animate={{ scale: 1, opacity: 1 }}
            onClick={(e) => e.stopPropagation()}
          >
            <h3 className="text-xl font-bold mb-4">{eventoSeleccionado.titulo}</h3>
            <p className="text-white/70 mb-4">{eventoSeleccionado.descripcion}</p>
            <div className="space-y-2">
              <div className="flex justify-between">
                <span>Fecha:</span>
                <span className="text-blue-400">{eventoSeleccionado.fecha}</span>
              </div>
              <div className="flex justify-between">
                <span>Hora:</span>
                <span className="text-green-400">{eventoSeleccionado.hora}</span>
              </div>
              <div className="flex justify-between">
                <span>Responsable:</span>
                <span className="text-purple-400">{eventoSeleccionado.responsable}</span>
              </div>
              <div className="flex justify-between">
                <span>Estado:</span>
                <span className={`${obtenerColorEstado(eventoSeleccionado.estado)} capitalize`}>
                  {eventoSeleccionado.estado.replace('_', ' ')}
                </span>
              </div>
            </div>
            <div className="flex justify-end mt-6">
              <motion.button
                onClick={() => setEventoSeleccionado(null)}
                className="futbol-btn futbol-btn-secondary"
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
              >
                Cerrar
              </motion.button>
            </div>
          </motion.div>
        </motion.div>
      )}
    </div>
  )
}
