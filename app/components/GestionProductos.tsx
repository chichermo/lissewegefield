'use client'

import { motion } from 'framer-motion'
import {
    AlertTriangle,
    BarChart3,
    Calendar,
    CheckCircle,
    Circle,
    Clock,
    CreditCard,
    Download,
    Edit,
    Package,
    Plus,
    Receipt,
    Shield,
    ShoppingCart,
    SortAsc,
    Trash2,
    TrendingUp,
    Truck,
    XCircle,
    Zap
} from 'lucide-react'
import { useState } from 'react'
import { useLanguage } from '../contexts/LanguageContext'
import { Producto, Tarea } from '../../types'

export default function GestionProductos() {
  const { t } = useLanguage()
  const [productos, setProductos] = useState<Producto[]>([
    {
      id: 1,
      nombre: 'Pintura para Líneas',
      categoria: 'Pintura',
      stock: 15,
      precio: 45.99,
      unidad: 'litros',
      proveedor: 'Pinturas Pro',
      fechaVencimiento: new Date(Date.now() + 365 * 24 * 60 * 60 * 1000),
      estado: 'disponible',
      prioridad: 'alta',
      descripcion: 'Pintura blanca de alta durabilidad para líneas de cancha'
    },
    {
      id: 2,
      nombre: 'Red de Portería',
      categoria: 'Equipamiento',
      stock: 8,
      precio: 89.99,
      unidad: 'unidades',
      proveedor: 'Deportes Max',
      fechaVencimiento: new Date(Date.now() + 730 * 24 * 60 * 60 * 1000),
      estado: 'disponible',
      prioridad: 'media',
      descripcion: 'Red de nylon resistente para porterías reglamentarias'
    },
    {
      id: 3,
      nombre: 'Pelotas Oficiales',
      categoria: 'Pelotas',
      stock: 25,
      precio: 29.99,
      unidad: 'unidades',
      proveedor: 'Fútbol Elite',
      fechaVencimiento: new Date(Date.now() + 180 * 24 * 60 * 60 * 1000),
      estado: 'disponible',
      prioridad: 'alta',
      descripcion: 'Pelotas oficiales FIFA para entrenamiento y partidos'
    },
    {
      id: 4,
      nombre: 'Césped Sintético',
      categoria: 'Superficie',
      stock: 5,
      precio: 299.99,
      unidad: 'm²',
      proveedor: 'Césped Premium',
      fechaVencimiento: new Date(Date.now() + 1095 * 24 * 60 * 60 * 1000),
      estado: 'bajo_stock',
      prioridad: 'alta',
      descripcion: 'Césped sintético de alta calidad para canchas profesionales'
    },
    {
      id: 5,
      nombre: 'Fertilizante NPK',
      categoria: 'Fertilizantes',
      stock: 12,
      precio: 35.50,
      unidad: 'kg',
      proveedor: 'AgroMax',
      fechaVencimiento: new Date(Date.now() + 180 * 24 * 60 * 60 * 1000),
      estado: 'disponible',
      prioridad: 'baja',
      descripcion: 'Fertilizante balanceado para mantenimiento del pasto'
    }
  ])

  const [tareas, setTareas] = useState<Tarea[]>([
    {
      id: 1,
      titulo: 'Marcado de líneas',
      descripcion: 'Renovar líneas de la cancha principal con pintura profesional FIFA',
      fecha: new Date(Date.now() + 7 * 24 * 60 * 60 * 1000),
      prioridad: 'alta',
      estado: 'pendiente',
      responsable: 'Juan Pérez',
      categoria: 'Mantenimiento'
    },
    {
      id: 2,
      titulo: 'Revisión de porterías',
      descripcion: 'Verificar estado y ajustar redes de porterías según estándares FIFA',
      fecha: new Date(Date.now() + 3 * 24 * 60 * 60 * 1000),
      prioridad: 'media',
      estado: 'en_progreso',
      responsable: 'María García',
      categoria: 'Equipamiento'
    },
    {
      id: 3,
      titulo: 'Fertilización del césped',
      descripcion: 'Aplicar fertilizante NPK para optimizar crecimiento del pasto',
      fecha: new Date(Date.now() + 14 * 24 * 60 * 60 * 1000),
      prioridad: 'baja',
      estado: 'pendiente',
      responsable: 'Carlos López',
      categoria: 'Mantenimiento'
    }
  ])

  // Estados adicionales para funcionalidades avanzadas
  const [modoAvanzado, setModoAvanzado] = useState(false)
  const [ordenamiento, setOrdenamiento] = useState<'nombre' | 'precio' | 'stock' | 'fecha'>('nombre')
  const [estadisticasAvanzadas] = useState({
    valorTotalInventario: 0,
    productosBajoStock: 0,
    proximosVencimientos: 0,
    tendenciaCompras: 0,
    proveedoresPrincipales: ''
  })

  // Datos de configuración FIFA avanzados
  const [configuracionFIFA] = useState({
    productosRequeridos: ['Pintura para Líneas', 'Red de Portería', 'Pelotas Oficiales'],
    estandaresCalidad: 'Premium',
    proveedoresAutorizados: ['Pinturas Pro', 'Deportes Max', 'Fútbol Elite'],
    frecuenciaMantenimiento: 'Semanal'
  })

  const [filtroCategoria, setFiltroCategoria] = useState('')
  const [filtroEstado, setFiltroEstado] = useState('')
  const [filtroTareaEstado, setFiltroTareaEstado] = useState('')
  const [filtroTareaPrioridad, setFiltroTareaPrioridad] = useState('')

  const agregarProducto = (nuevoProducto: Omit<Producto, 'id'>) => {
    const producto: Producto = {
      ...nuevoProducto,
      id: Math.max(...productos.map(p => p.id)) + 1
    }
    setProductos([...productos, producto])
  }

  const editarProducto = (id: number, datosActualizados: Partial<Producto>) => {
    setProductos(productos.map(producto =>
      producto.id === id ? { ...producto, ...datosActualizados } : producto
    ))
  }

  const eliminarProducto = (id: number) => {
    setProductos(productos.filter(producto => producto.id !== id))
  }

  const agregarTarea = (nuevaTarea: Omit<Tarea, 'id'>) => {
    const tarea: Tarea = {
      ...nuevaTarea,
      id: Math.max(...tareas.map(t => t.id)) + 1
    }
    setTareas([...tareas, tarea])
  }

  const actualizarTarea = (id: number, datosActualizados: Partial<Tarea>) => {
    setTareas(tareas.map(tarea =>
      tarea.id === id ? { ...tarea, ...datosActualizados } : tarea
    ))
  }

  const completarTarea = (id: number) => {
    setTareas(tareas.map(tarea =>
      tarea.id === id ? { ...tarea, estado: 'completada' as const } : tarea
    ))
  }

  const eliminarTarea = (id: number) => {
    setTareas(tareas.filter(tarea => tarea.id !== id))
  }

  const exportarDatos = () => {
    const datos = {
      productos,
      tareas,
      fecha: new Date().toISOString()
    }
    const blob = new Blob([JSON.stringify(datos, null, 2)], { type: 'application/json' })
    const url = URL.createObjectURL(blob)
    const a = document.createElement('a')
    a.href = url
    a.download = `gestion-productos-${new Date().toISOString().split('T')[0]}.json`
    document.body.appendChild(a)
    a.click()
    document.body.removeChild(a)
    URL.revokeObjectURL(url)
  }

  const obtenerColorPrioridad = (prioridad: string) => {
    switch (prioridad) {
      case 'alta': return 'text-red-500'
      case 'media': return 'text-yellow-500'
      case 'baja': return 'text-green-500'
      default: return 'text-gray-500'
    }
  }

  const obtenerColorEstado = (estado: string) => {
    switch (estado) {
      case 'disponible': return 'text-green-500'
      case 'bajo_stock': return 'text-yellow-500'
      case 'agotado': return 'text-red-500'
      case 'pendiente': return 'text-yellow-500'
      case 'en_progreso': return 'text-blue-500'
      case 'completada': return 'text-green-500'
      default: return 'text-gray-500'
    }
  }

  const obtenerIconoEstado = (estado: string) => {
    switch (estado) {
      case 'disponible':
      case 'completada':
        return <CheckCircle className="w-5 h-5 text-green-500" />
      case 'bajo_stock':
      case 'pendiente':
        return <AlertTriangle className="w-5 h-5 text-yellow-500" />
      case 'agotado':
        return <XCircle className="w-5 h-5 text-red-500" />
      case 'en_progreso':
        return <Clock className="w-5 h-5 text-blue-500" />
      default:
        return <Circle className="w-5 h-5 text-gray-500" />
    }
  }





  const productosFiltrados = productos
    .filter(producto =>
      (!filtroCategoria || producto.categoria === filtroCategoria) &&
      (!filtroEstado || producto.estado === filtroEstado)
    )
    .sort((a, b) => {
      if (ordenamiento === 'nombre') {
        return a.nombre.localeCompare(b.nombre)
      } else if (ordenamiento === 'precio') {
        return a.precio - b.precio
      } else if (ordenamiento === 'stock') {
        return a.stock - b.stock
      } else { // fecha
        return a.fechaVencimiento.getTime() - b.fechaVencimiento.getTime()
      }
    })

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
              <div className="w-12 h-12 bg-gradient-to-br from-blue-500 to-indigo-600 rounded-2xl flex items-center justify-center">
                <Package className="w-6 h-6 text-white" />
              </div>
              <div className="absolute -top-1 -right-1 w-4 h-4 bg-green-400 rounded-full animate-pulse"></div>
            </div>
            <div>
              <h2 className="text-2xl font-bold text-gradient">{t('products.title')}</h2>
              <p className="text-white/70">{t('products.subtitle') || 'Sistema profesional de inventario y gestión de productos FIFA'}</p>
            </div>
          </div>

          <div className="flex items-center space-x-4">
            <div className="futbol-indicator success">
              <ShoppingCart className="w-4 h-4" />
              <span>{productos.length} {t('products.items')}</span>
            </div>
            <div className="futbol-indicator info">
              <Truck className="w-4 h-4" />
              <span>{productos.filter(p => p.stock < 10).length} {t('products.low.stock')}</span>
            </div>
            <div className="futbol-indicator success">
              <CreditCard className="w-4 h-4" />
              <span>${estadisticasAvanzadas.valorTotalInventario.toFixed(2)}</span>
            </div>
          </div>
        </div>

        {/* Panel de control avanzado */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-6">
          <motion.div className="futbol-card" whileHover={{ scale: 1.02 }}>
            <h3 className="text-lg font-bold mb-3 flex items-center gap-2">
              <Shield className="w-5 h-5 text-blue-400" />
              {t('products.fifa.standards')}
            </h3>
            <div className="space-y-2 text-sm">
              <div className="flex justify-between">
                <span>Calidad:</span>
                <span className="text-green-400">{configuracionFIFA.estandaresCalidad}</span>
              </div>
              <div className="flex justify-between">
                <span>Frecuencia:</span>
                <span className="text-blue-400">{configuracionFIFA.frecuenciaMantenimiento}</span>
              </div>
              <div className="flex justify-between">
                <span>Proveedores:</span>
                <span className="text-purple-400">{configuracionFIFA.proveedoresAutorizados.length}</span>
              </div>
            </div>
          </motion.div>

          <motion.div className="futbol-card" whileHover={{ scale: 1.02 }}>
            <h3 className="text-lg font-bold mb-3 flex items-center gap-2">
              <Zap className="w-5 h-5 text-yellow-400" />
              {t('products.inventory.status')}
            </h3>
            <div className="space-y-2 text-sm">
              <div className="flex justify-between">
                <span>{t('products.low.stock')}:</span>
                <span className="text-red-400">{estadisticasAvanzadas.productosBajoStock}</span>
              </div>
              <div className="flex justify-between">
                <span>Próximos Venc:</span>
                <span className="text-orange-400">{estadisticasAvanzadas.proximosVencimientos}</span>
              </div>
              <div className="flex justify-between">
                <span>Tendencia:</span>
                <span className="text-green-400">{estadisticasAvanzadas.tendenciaCompras.toFixed(1)}%</span>
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
                <span>Valor Total:</span>
                <span className="text-green-400">${estadisticasAvanzadas.valorTotalInventario.toFixed(2)}</span>
              </div>
              <div className="flex justify-between">
                <span>Proveedores:</span>
                <span className="text-blue-400">{estadisticasAvanzadas.proveedoresPrincipales}</span>
              </div>
              <div className="flex justify-between">
                <span>Eficiencia:</span>
                <span className="text-purple-400">{(estadisticasAvanzadas.tendenciaCompras * 0.8).toFixed(1)}%</span>
              </div>
            </div>
          </motion.div>
        </div>
      </motion.div>

      {/* Productos */}
      <motion.div
        className="glass-card p-6"
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.1 }}
      >
        <div className="flex items-center justify-between mb-6">
          <h3 className="text-xl font-bold text-white">Productos</h3>
          <motion.button
            onClick={() => {
              agregarProducto({
                nombre: 'Nuevo Producto',
                categoria: 'General',
                stock: 10,
                precio: 25.99,
                unidad: 'unidades',
                proveedor: 'Proveedor',
                fechaVencimiento: new Date(Date.now() + 365 * 24 * 60 * 60 * 1000),
                estado: 'disponible',
                prioridad: 'media',
                descripcion: 'Descripción del nuevo producto'
              })
            }}
            className="btn-primary flex items-center space-x-2"
            whileHover={{ scale: 1.02 }}
            whileTap={{ scale: 0.98 }}
          >
            <Plus className="w-5 h-5" />
            <span>Agregar Producto</span>
          </motion.button>
        </div>

        {/* Controles y filtros */}
        <div className="flex flex-wrap gap-4 mb-6">
          <motion.button
            onClick={() => setModoAvanzado(!modoAvanzado)}
            className="futbol-btn futbol-btn-primary flex items-center space-x-2"
            whileHover={{ scale: 1.02 }}
            whileTap={{ scale: 0.98 }}
          >
            <TrendingUp className="w-5 h-5" />
            <span>{modoAvanzado ? '📊 Modo Básico' : '⚡ Modo Avanzado'}</span>
          </motion.button>

          <motion.button
            onClick={exportarDatos}
            className="futbol-btn futbol-btn-success flex items-center space-x-2"
            whileHover={{ scale: 1.02 }}
            whileTap={{ scale: 0.98 }}
          >
            <Download className="w-5 h-5" />
            <span>📊 Exportar Inventario</span>
          </motion.button>

          <motion.button
            onClick={() => setOrdenamiento('nombre')}
            className="futbol-btn futbol-btn-secondary flex items-center space-x-2"
            whileHover={{ scale: 1.02 }}
            whileTap={{ scale: 0.98 }}
          >
            <SortAsc className="w-5 h-5" />
            <span>📦 Ordenar por Nombre</span>
          </motion.button>

          <motion.button
            onClick={() => setOrdenamiento('precio')}
            className="futbol-btn futbol-btn-secondary flex items-center space-x-2"
            whileHover={{ scale: 1.02 }}
            whileTap={{ scale: 0.98 }}
          >
            <Receipt className="w-5 h-5" />
            <span>💰 Ordenar por Precio</span>
          </motion.button>

          <div className="flex items-center space-x-4">
            <select
              value={filtroCategoria}
              onChange={(e) => setFiltroCategoria(e.target.value)}
              className="futbol-input"
            >
              <option value="">🎯 Todas las Categorías</option>
              <option value="Pintura">🎨 Pintura</option>
              <option value="Equipamiento">⚽ Equipamiento</option>
              <option value="Pelotas">⚽ Pelotas</option>
              <option value="Superficie">🌱 Superficie</option>
              <option value="Fertilizantes">🌿 Fertilizantes</option>
            </select>

            <select
              value={filtroEstado}
              onChange={(e) => setFiltroEstado(e.target.value)}
              className="futbol-input"
            >
              <option value="">📊 Todos los Estados</option>
              <option value="disponible">✅ Disponible</option>
              <option value="bajo_stock">⚠️ Bajo Stock</option>
              <option value="agotado">❌ Agotado</option>
            </select>
          </div>
        </div>

        {/* Lista de productos */}
        <div className="space-y-4">
          {productosFiltrados.map((producto) => (
            <motion.div
              key={producto.id}
              className="futbol-card"
              whileHover={{ scale: 1.02 }}
              initial={{ opacity: 0, x: -20 }}
              animate={{ opacity: 1, x: 0 }}
            >
              <div className="flex items-center justify-between">
                <div className="flex items-center space-x-4">
                  <div className="flex items-center space-x-3">
                    <Package className="w-8 h-8 text-blue-400" />
                    <div>
                      <h3 className="text-lg font-semibold text-white">{producto.nombre}</h3>
                      <p className="text-white/70 text-sm">{producto.descripcion}</p>
                      <div className="flex items-center space-x-4 mt-2">
                        <span className="text-sm text-white/60">🏷️ {producto.categoria}</span>
                        <span className="text-sm text-white/60">📦 {producto.stock} {producto.unidad}</span>
                        <span className="text-sm text-white/60">💰 ${producto.precio}</span>
                        <span className="text-sm text-white/60">🏢 {producto.proveedor}</span>
                      </div>
                    </div>
                  </div>
                </div>

                <div className="flex items-center space-x-3">
                  <div className={`px-3 py-1 rounded-full text-sm font-semibold ${obtenerColorEstado(producto.estado)}`}>
                    {obtenerIconoEstado(producto.estado)}
                    <span className="ml-1 capitalize">{producto.estado.replace('_', ' ')}</span>
                  </div>

                  <div className={`px-3 py-1 rounded-full text-sm font-semibold ${obtenerColorPrioridad(producto.prioridad)}`}>
                    <span className="capitalize">{producto.prioridad}</span>
                  </div>

                  <div className="flex items-center space-x-2">
                    <motion.button
                      onClick={() => editarProducto(producto.id, { stock: producto.stock + 1 })}
                      className="p-2 bg-green-500/20 hover:bg-green-500/30 rounded-lg transition-colors"
                      whileHover={{ scale: 1.1 }}
                      whileTap={{ scale: 0.9 }}
                    >
                      <Plus className="w-4 h-4 text-green-400" />
                    </motion.button>

                    <motion.button
                      onClick={() => editarProducto(producto.id, { stock: Math.max(0, producto.stock - 1) })}
                      className="p-2 bg-red-500/20 hover:bg-red-500/30 rounded-lg transition-colors"
                      whileHover={{ scale: 1.1 }}
                      whileTap={{ scale: 0.9 }}
                    >
                      <Circle className="w-4 h-4 text-red-400" />
                    </motion.button>

                    <motion.button
                      onClick={() => eliminarProducto(producto.id)}
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

      {/* Tareas */}
      <motion.div
        className="glass-card p-6"
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.2 }}
      >
        <div className="flex items-center justify-between mb-6">
          <h3 className="text-xl font-bold text-white">Tareas</h3>
          <motion.button
            onClick={() => {
              agregarTarea({
                titulo: 'Nueva tarea',
                descripcion: 'Descripción de la nueva tarea',
                fecha: new Date(),
                prioridad: 'media',
                estado: 'pendiente',
                responsable: 'Usuario',
                categoria: 'General'
              })
            }}
            className="btn-primary flex items-center space-x-2"
            whileHover={{ scale: 1.02 }}
            whileTap={{ scale: 0.98 }}
          >
            <Plus className="w-5 h-5" />
            <span>Agregar Tarea</span>
          </motion.button>
        </div>

        {/* Filtros de tareas */}
        <div className="flex flex-wrap gap-4 mb-6">
          <select
            value={filtroTareaEstado}
            onChange={(e) => setFiltroTareaEstado(e.target.value)}
            className="futbol-select"
          >
            <option value="">Todos los estados</option>
            <option value="pendiente">Pendiente</option>
            <option value="en_progreso">En Progreso</option>
            <option value="completada">Completada</option>
          </select>

          <select
            value={filtroTareaPrioridad}
            onChange={(e) => setFiltroTareaPrioridad(e.target.value)}
            className="futbol-select"
          >
            <option value="">Todas las prioridades</option>
            <option value="alta">Alta</option>
            <option value="media">Media</option>
            <option value="baja">Baja</option>
          </select>
        </div>

        {/* Lista de tareas */}
        <div className="space-y-4">
          {tareas
            .filter(tarea =>
              (!filtroTareaEstado || tarea.estado === filtroTareaEstado) &&
              (!filtroTareaPrioridad || tarea.prioridad === filtroTareaPrioridad)
            )
            .map((tarea) => (
              <motion.div
                key={tarea.id}
                className="glass-card p-4"
                whileHover={{ scale: 1.01 }}
                initial={{ opacity: 0, x: -20 }}
                animate={{ opacity: 1, x: 0 }}
              >
                <div className="flex items-center justify-between mb-3">
                  <h4 className="font-semibold text-white">{tarea.titulo}</h4>
                  {obtenerIconoEstado(tarea.estado)}
                </div>

                <p className="text-white/70 text-sm mb-3">{tarea.descripcion}</p>

                <div className="flex flex-wrap gap-4 text-sm">
                  <div className="flex items-center space-x-2">
                    <Calendar className="w-4 h-4 text-white/60" />
                    <span className="text-white">{tarea.fecha.toLocaleDateString()}</span>
                  </div>
                  <div className="flex items-center space-x-2">
                    <span className="text-white/60">Responsable:</span>
                    <span className="text-white">{tarea.responsable}</span>
                  </div>
                  <div className="flex items-center space-x-2">
                    <span className="text-white/60">Prioridad:</span>
                    <span className={obtenerColorPrioridad(tarea.prioridad)}>
                      {tarea.prioridad}
                    </span>
                  </div>
                  <div className="flex items-center space-x-2">
                    <span className="text-white/60">Estado:</span>
                    <span className={obtenerColorEstado(tarea.estado)}>
                      {tarea.estado}
                    </span>
                  </div>
                </div>

                <div className="flex space-x-2 mt-4">
                  {tarea.estado !== 'completada' && (
                    <button
                      onClick={() => completarTarea(tarea.id)}
                      className="btn-success text-xs px-2 py-1"
                    >
                      <CheckCircle className="w-4 h-4" />
                    </button>
                  )}
                  <button
                    onClick={() => actualizarTarea(tarea.id, { estado: 'en_progreso' as const })}
                    className="btn-secondary text-xs px-2 py-1"
                  >
                    <Edit className="w-4 h-4" />
                  </button>
                  <button
                    onClick={() => eliminarTarea(tarea.id)}
                    className="btn-danger text-xs px-2 py-1"
                  >
                    <Trash2 className="w-4 h-4" />
                  </button>
                </div>
              </motion.div>
            ))}
        </div>
      </motion.div>
    </div>
  )
}
