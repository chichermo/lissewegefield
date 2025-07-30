'use client'

import { useState, useEffect } from 'react'

import { 
  Plus, 
  Edit, 
  Trash2, 
  MapPin, 
  Target, 
  Calendar, 
  BarChart3,
  CheckCircle,

  Settings,
  Star
} from 'lucide-react'
import { CampoDeportivo } from '@/types'
import { useAppStore } from '@/stores/useAppStore'

const configuracionesFIFA = {
  futbol_11: {
    largoMinimo: 100,
    largoMaximo: 110,
    anchoMinimo: 64,
    anchoMaximo: 75,
    areaPenalLargo: 16.5,
    areaPenalAncho: 40.32,
    areaMetaLargo: 5.5,
    areaMetaAncho: 18.32,
    radioCirculoCentral: 9.15,
    radioArcoPenal: 9.15
  },
  futbol_7: {
    largoMinimo: 50,
    largoMaximo: 70,
    anchoMinimo: 30,
    anchoMaximo: 50,
    areaPenalLargo: 13,
    areaPenalAncho: 30,
    areaMetaLargo: 4,
    areaMetaAncho: 12,
    radioCirculoCentral: 6,
    radioArcoPenal: 6
  },
  futbol_5: {
    largoMinimo: 25,
    largoMaximo: 42,
    anchoMinimo: 15,
    anchoMaximo: 25,
    areaPenalLargo: 6,
    areaPenalAncho: 15,
    areaMetaLargo: 2,
    areaMetaAncho: 6,
    radioCirculoCentral: 3,
    radioArcoPenal: 3
  },
  personalizada: {
    largoMinimo: 0,
    largoMaximo: 0,
    anchoMinimo: 0,
    anchoMaximo: 0,
    areaPenalLargo: 0,
    areaPenalAncho: 0,
    areaMetaLargo: 0,
    areaMetaAncho: 0,
    radioCirculoCentral: 0,
    radioArcoPenal: 0
  }
}

export default function GestorCampos() {
  const { 
    gestorCampos, 
    campoActivo, 
    setCampoActivo, 
    agregarCampo, 
    actualizarCampo, 
    eliminarCampo 
  } = useAppStore()

  const [mostrarFormulario, setMostrarFormulario] = useState(false)
  const [campoEditando, setCampoEditando] = useState<CampoDeportivo | null>(null)
  const [formData, setFormData] = useState({
    nombre: '',
    descripcion: '',
    tipo: 'futbol_11' as "futbol_11" | "futbol_7" | "futbol_5" | "personalizada",
    estado: 'activo' as "mantenimiento" | "activo" | "inactivo"
  })

  useEffect(() => {
    // Si no hay campos, crear los dos campos por defecto
    if (gestorCampos.campos.length === 0) {
      const campoPrincipal: Omit<CampoDeportivo, 'id'> = {
        nombre: 'Campo Principal',
        descripcion: 'Campo de fútbol 11 principal del centro deportivo',
        tipo: 'futbol_11',
        estado: 'activo',
        fechaCreacion: new Date(),
        ultimaActualizacion: new Date(),
        configuracionFIFA: configuracionesFIFA.futbol_11,
        mediciones: [],
        lineasMarcado: [],
        estadisticas: {
          totalMediciones: 0,
          totalMarcados: 0,
          ultimaMedicion: null,
          ultimoMarcado: null
        }
      }

      const campoSecundario: Omit<CampoDeportivo, 'id'> = {
        nombre: 'Campo Secundario',
        descripcion: 'Campo de fútbol 7 secundario del centro deportivo',
        tipo: 'futbol_7',
        estado: 'activo',
        fechaCreacion: new Date(),
        ultimaActualizacion: new Date(),
        configuracionFIFA: configuracionesFIFA.futbol_7,
        mediciones: [],
        lineasMarcado: [],
        estadisticas: {
          totalMediciones: 0,
          totalMarcados: 0,
          ultimaMedicion: null,
          ultimoMarcado: null
        }
      }

      agregarCampo(campoPrincipal)
      agregarCampo(campoSecundario)
    }
  }, [gestorCampos.campos.length, agregarCampo])

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault()
    
    const nuevoCampo: Omit<CampoDeportivo, 'id'> = {
      ...formData,
      fechaCreacion: new Date(),
      ultimaActualizacion: new Date(),
      configuracionFIFA: configuracionesFIFA[formData.tipo],
      mediciones: [],
      lineasMarcado: [],
      estadisticas: {
        totalMediciones: 0,
        totalMarcados: 0,
        ultimaMedicion: null,
        ultimoMarcado: null
      }
    }

    if (campoEditando) {
      actualizarCampo(campoEditando.id, {
        ...nuevoCampo,
        ultimaActualizacion: new Date()
      })
      setCampoEditando(null)
    } else {
      agregarCampo(nuevoCampo)
    }

    setFormData({
      nombre: '',
      descripcion: '',
      tipo: 'futbol_11',
      estado: 'activo'
    })
    setMostrarFormulario(false)
  }

  const handleEditar = (campo: CampoDeportivo) => {
    setCampoEditando(campo)
    setFormData({
      nombre: campo.nombre,
      descripcion: campo.descripcion,
      tipo: campo.tipo as "futbol_11" | "futbol_7" | "futbol_5" | "personalizada",
      estado: campo.estado as "mantenimiento" | "activo" | "inactivo"
    })
    setMostrarFormulario(true)
  }

  const handleEliminar = (id: string) => {
    if (confirm('¿Estás seguro de que quieres eliminar este campo?')) {
      eliminarCampo(id)
    }
  }

  const handleSeleccionarCampo = (campo: CampoDeportivo) => {
    setCampoActivo(campo)
  }

  const getEstadoColor = (estado: string) => {
    switch (estado) {
      case 'activo': return 'text-green-700 bg-green-100 border-green-200'
      case 'inactivo': return 'text-gray-700 bg-gray-100 border-gray-200'
      case 'mantenimiento': return 'text-orange-700 bg-orange-100 border-orange-200'
      default: return 'text-gray-700 bg-gray-100 border-gray-200'
    }
  }

  const getTipoIcono = (tipo: string) => {
    switch (tipo) {
      case 'futbol_11': return <MapPin className="w-5 h-5" />
      case 'futbol_7': return <Target className="w-5 h-5" />
      case 'futbol_5': return <MapPin className="w-5 h-5" />
      default: return <Settings className="w-5 h-5" />
    }
  }

  const getTipoColor = (tipo: string) => {
    switch (tipo) {
      case 'futbol_11': return 'text-blue-600 bg-blue-50 border-blue-200'
      case 'futbol_7': return 'text-purple-600 bg-purple-50 border-purple-200'
      case 'futbol_5': return 'text-green-600 bg-green-50 border-green-200'
      default: return 'text-gray-600 bg-gray-50 border-gray-200'
    }
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 via-white to-green-50 p-6">
      <div className="max-w-7xl mx-auto space-y-8">
        {/* Header Mejorado */}
        <div className="bg-white rounded-2xl shadow-lg p-8 border border-gray-100">
          <div className="flex flex-col lg:flex-row justify-between items-start lg:items-center gap-6">
            <div className="flex-1">
              <div className="flex items-center gap-3 mb-3">
                <div className="p-3 bg-gradient-to-r from-blue-500 to-purple-600 rounded-xl">
                  <MapPin className="w-8 h-8 text-white" />
                </div>
                <div>
                  <h1 className="text-3xl font-bold bg-gradient-to-r from-blue-600 to-purple-600 bg-clip-text text-transparent">
                    Gestión de Campos Deportivos
                  </h1>
                  <p className="text-gray-600 text-lg">Administra y configura los campos de fútbol del centro deportivo</p>
                </div>
              </div>
              <div className="flex items-center gap-4 mt-4">
                <div className="flex items-center gap-2 text-sm text-gray-600">
                  <Star className="w-4 h-4" />
                  <span>{gestorCampos.campos.length} campos registrados</span>
                </div>
                {campoActivo && (
                  <div className="flex items-center gap-2 text-sm text-blue-600">
                    <Star className="w-4 h-4" />
                    <span>Campo activo: {campoActivo.nombre}</span>
                  </div>
                )}
              </div>
            </div>
            <button
              onClick={() => setMostrarFormulario(true)}
              className="bg-gradient-to-r from-blue-600 to-purple-600 hover:from-blue-700 hover:to-purple-700 text-white px-6 py-3 rounded-xl flex items-center gap-3 transition-all duration-300 transform hover:scale-105 shadow-lg"
            >
              <Plus className="w-5 h-5" />
              <span className="font-semibold">Agregar Campo</span>
            </button>
          </div>
        </div>

        {/* Formulario Mejorado */}
        {mostrarFormulario && (
          <div className="bg-white rounded-2xl shadow-lg border border-gray-100 overflow-hidden">
            <div className="bg-gradient-to-r from-blue-500 to-purple-600 p-6">
              <h3 className="text-xl font-bold text-white">
                {campoEditando ? 'Editar Campo Deportivo' : 'Nuevo Campo Deportivo'}
              </h3>
              <p className="text-blue-100 mt-1">
                {campoEditando ? 'Modifica la información del campo seleccionado' : 'Configura un nuevo campo para el centro deportivo'}
              </p>
            </div>
            <div className="p-8">
              <form onSubmit={handleSubmit} className="space-y-6">
                <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
                  <div className="space-y-2">
                    <label className="block text-sm font-semibold text-gray-700">
                      Nombre del Campo
                    </label>
                    <input
                      type="text"
                      value={formData.nombre}
                      onChange={(e) => setFormData({ ...formData, nombre: e.target.value })}
                      className="w-full px-4 py-3 border-2 border-gray-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all"
                      placeholder="Ej: Campo Principal"
                      required
                    />
                  </div>
                  <div className="space-y-2">
                    <label className="block text-sm font-semibold text-gray-700">
                      Tipo de Campo
                    </label>
                    <select
                      value={formData.tipo}
                      onChange={(e) => setFormData({ ...formData, tipo: e.target.value as any })}
                      className="w-full px-4 py-3 border-2 border-gray-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all"
                    >
                      <option value="futbol_11">Fútbol 11 - Campo Completo</option>
                      <option value="futbol_7">Fútbol 7 - Campo Mediano</option>
                      <option value="futbol_5">Fútbol 5 - Campo Pequeño</option>
                      <option value="personalizada">Personalizada</option>
                    </select>
                  </div>
                </div>
                
                <div className="space-y-2">
                  <label className="block text-sm font-semibold text-gray-700">
                    Descripción
                  </label>
                  <textarea
                    value={formData.descripcion}
                    onChange={(e) => setFormData({ ...formData, descripcion: e.target.value })}
                    className="w-full px-4 py-3 border-2 border-gray-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all resize-none"
                    rows={3}
                    placeholder="Describe las características especiales del campo..."
                  />
                </div>
                
                <div className="space-y-2">
                  <label className="block text-sm font-semibold text-gray-700">
                    Estado del Campo
                  </label>
                  <select
                    value={formData.estado}
                    onChange={(e) => setFormData({ ...formData, estado: e.target.value as any })}
                    className="w-full px-4 py-3 border-2 border-gray-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all"
                  >
                    <option value="activo">Activo - Disponible para uso</option>
                    <option value="inactivo">Inactivo - No disponible</option>
                    <option value="mantenimiento">Mantenimiento - En reparación</option>
                  </select>
                </div>
                
                <div className="flex gap-4 pt-4">
                  <button
                    type="submit"
                    className="flex-1 bg-gradient-to-r from-blue-600 to-purple-600 hover:from-blue-700 hover:to-purple-700 text-white px-6 py-3 rounded-xl font-semibold transition-all duration-300 transform hover:scale-105 shadow-lg"
                  >
                    {campoEditando ? 'Actualizar Campo' : 'Crear Campo'}
                  </button>
                  <button
                    type="button"
                    onClick={() => {
                      setMostrarFormulario(false)
                      setCampoEditando(null)
                      setFormData({
                        nombre: '',
                        descripcion: '',
                        tipo: 'futbol_11',
                        estado: 'activo'
                      })
                    }}
                    className="px-6 py-3 border-2 border-gray-300 text-gray-700 rounded-xl font-semibold hover:bg-gray-50 transition-all"
                  >
                    Cancelar
                  </button>
                </div>
              </form>
            </div>
          </div>
        )}

        {/* Lista de Campos Mejorada */}
        <div className="space-y-6">
          <div className="flex items-center justify-between">
            <h2 className="text-2xl font-bold text-gray-900">Campos Disponibles</h2>
            <div className="text-sm text-gray-600">
              Selecciona un campo para activarlo
            </div>
          </div>
          
          <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-6">
            {gestorCampos.campos.map((campo) => (
              <div
                key={campo.id}
                className={`group relative bg-white rounded-2xl shadow-lg border-2 transition-all duration-300 cursor-pointer hover:shadow-xl transform hover:-translate-y-1 ${
                  campoActivo?.id === campo.id 
                    ? 'border-blue-500 bg-gradient-to-br from-blue-50 to-purple-50 shadow-blue-100' 
                    : 'border-gray-200 hover:border-blue-300'
                }`}
                onClick={() => handleSeleccionarCampo(campo)}
              >
                {/* Badge de Estado */}
                <div className="absolute top-4 right-4">
                  <span className={`px-3 py-1 rounded-full text-xs font-semibold border ${getEstadoColor(campo.estado)}`}>
                    {campo.estado}
                  </span>
                </div>

                {/* Header de la Card */}
                <div className="p-6 pb-4">
                  <div className="flex items-start justify-between mb-4">
                    <div className="flex items-center gap-3">
                      <div className={`p-2 rounded-lg ${getTipoColor(campo.tipo)}`}>
                        {getTipoIcono(campo.tipo)}
                      </div>
                      <div>
                        <h3 className="text-xl font-bold text-gray-900 group-hover:text-blue-600 transition-colors">
                          {campo.nombre}
                        </h3>
                        <span className={`inline-block px-2 py-1 rounded-full text-xs font-semibold ${getTipoColor(campo.tipo)}`}>
                          {campo.tipo.replace('_', ' ').toUpperCase()}
                        </span>
                      </div>
                    </div>
                    
                    <div className="flex gap-1 opacity-0 group-hover:opacity-100 transition-opacity">
                      <button
                        onClick={(e) => {
                          e.stopPropagation()
                          handleEditar(campo)
                        }}
                        className="p-2 text-gray-500 hover:text-blue-600 hover:bg-blue-50 rounded-lg transition-all"
                      >
                        <Edit className="w-4 h-4" />
                      </button>
                      <button
                        onClick={(e) => {
                          e.stopPropagation()
                          handleEliminar(campo.id)
                        }}
                        className="p-2 text-gray-500 hover:text-red-600 hover:bg-red-50 rounded-lg transition-all"
                      >
                        <Trash2 className="w-4 h-4" />
                      </button>
                    </div>
                  </div>

                  <p className="text-gray-600 text-sm leading-relaxed mb-6">{campo.descripcion}</p>

                  {/* Estadísticas */}
                  <div className="grid grid-cols-2 gap-4">
                    <div className="text-center p-3 bg-blue-50 rounded-lg">
                      <div className="flex items-center justify-center gap-2 mb-1">
                        <BarChart3 className="w-4 h-4 text-blue-600" />
                        <span className="text-xs font-semibold text-blue-700">Mediciones</span>
                      </div>
                      <div className="text-2xl font-bold text-blue-900">
                        {campo.estadisticas.totalMediciones}
                      </div>
                    </div>
                    
                    <div className="text-center p-3 bg-green-50 rounded-lg">
                      <div className="flex items-center justify-center gap-2 mb-1">
                        <Target className="w-4 h-4 text-green-600" />
                        <span className="text-xs font-semibold text-green-700">Marcados</span>
                      </div>
                      <div className="text-2xl font-bold text-green-900">
                        {campo.estadisticas.totalMarcados}
                      </div>
                    </div>
                  </div>

                  {/* Información Adicional */}
                  <div className="mt-4 space-y-2">
                    {campo.estadisticas.ultimaMedicion && (
                      <div className="flex items-center gap-2 text-xs text-gray-500">
                        <Calendar className="w-3 h-3" />
                        <span>Última medición: {new Date(campo.estadisticas.ultimaMedicion).toLocaleDateString()}</span>
                      </div>
                    )}
                    {campo.estadisticas.ultimoMarcado && (
                      <div className="flex items-center gap-2 text-xs text-gray-500">
                        <Calendar className="w-3 h-3" />
                        <span>Último marcado: {new Date(campo.estadisticas.ultimoMarcado).toLocaleDateString()}</span>
                      </div>
                    )}
                  </div>
                </div>

                {/* Indicador de Campo Activo */}
                {campoActivo?.id === campo.id && (
                  <div className="absolute bottom-0 left-0 right-0 bg-gradient-to-r from-blue-500 to-purple-600 text-white p-3 rounded-b-2xl">
                    <div className="flex items-center justify-center gap-2">
                      <CheckCircle className="w-4 h-4" />
                      <span className="text-sm font-semibold">Campo Activo</span>
                    </div>
                  </div>
                )}
              </div>
            ))}
          </div>
        </div>

        {/* Información del Campo Activo Mejorada */}
        {campoActivo && (
          <div className="bg-white rounded-2xl shadow-lg border border-gray-100 overflow-hidden">
            <div className="bg-gradient-to-r from-blue-500 to-purple-600 p-6">
              <div className="flex items-center gap-4">
                <div className="p-3 bg-white/20 rounded-xl">
                  <Star className="w-8 h-8 text-white" />
                </div>
                <div>
                  <h3 className="text-2xl font-bold text-white">Campo Activo: {campoActivo.nombre}</h3>
                  <p className="text-blue-100">Información detallada y configuración FIFA</p>
                </div>
              </div>
            </div>
            
            <div className="p-8">
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
                <div className="bg-gradient-to-br from-blue-50 to-blue-100 p-6 rounded-xl border border-blue-200">
                  <div className="flex items-center gap-3 mb-4">
                    <div className="p-2 bg-blue-500 rounded-lg">
                      <BarChart3 className="w-6 h-6 text-white" />
                    </div>
                    <div>
                      <h4 className="font-bold text-blue-900">Configuración FIFA</h4>
                      <p className="text-sm text-blue-700">Estándares oficiales</p>
                    </div>
                  </div>
                  <div className="space-y-2 text-sm text-blue-800">
                    <div className="flex justify-between">
                      <span>Largo:</span>
                      <span className="font-semibold">{campoActivo.configuracionFIFA.largoMinimo}-{campoActivo.configuracionFIFA.largoMaximo}m</span>
                    </div>
                    <div className="flex justify-between">
                      <span>Ancho:</span>
                      <span className="font-semibold">{campoActivo.configuracionFIFA.anchoMinimo}-{campoActivo.configuracionFIFA.anchoMaximo}m</span>
                    </div>
                    <div className="flex justify-between">
                      <span>Área Penal:</span>
                      <span className="font-semibold">{campoActivo.configuracionFIFA.areaPenalLargo}x{campoActivo.configuracionFIFA.areaPenalAncho}m</span>
                    </div>
                  </div>
                </div>

                <div className="bg-gradient-to-br from-green-50 to-green-100 p-6 rounded-xl border border-green-200">
                  <div className="flex items-center gap-3 mb-4">
                    <div className="p-2 bg-green-500 rounded-lg">
                      <CheckCircle className="w-6 h-6 text-white" />
                    </div>
                    <div>
                      <h4 className="font-bold text-green-900">Mediciones</h4>
                      <p className="text-sm text-green-700">Datos registrados</p>
                    </div>
                  </div>
                  <div className="space-y-2 text-sm text-green-800">
                    <div className="flex justify-between">
                      <span>Total:</span>
                      <span className="font-bold text-lg">{campoActivo.estadisticas.totalMediciones}</span>
                    </div>
                    <div className="flex justify-between">
                      <span>Última:</span>
                      <span className="font-semibold">
                        {campoActivo.estadisticas.ultimaMedicion 
                          ? new Date(campoActivo.estadisticas.ultimaMedicion).toLocaleDateString() 
                          : 'N/A'}
                      </span>
                    </div>
                  </div>
                </div>

                <div className="bg-gradient-to-br from-orange-50 to-orange-100 p-6 rounded-xl border border-orange-200">
                  <div className="flex items-center gap-3 mb-4">
                    <div className="p-2 bg-orange-500 rounded-lg">
                      <Target className="w-6 h-6 text-white" />
                    </div>
                    <div>
                      <h4 className="font-bold text-orange-900">Marcados</h4>
                      <p className="text-sm text-orange-700">Líneas trazadas</p>
                    </div>
                  </div>
                  <div className="space-y-2 text-sm text-orange-800">
                    <div className="flex justify-between">
                      <span>Total:</span>
                      <span className="font-bold text-lg">{campoActivo.estadisticas.totalMarcados}</span>
                    </div>
                    <div className="flex justify-between">
                      <span>Último:</span>
                      <span className="font-semibold">
                        {campoActivo.estadisticas.ultimoMarcado 
                          ? new Date(campoActivo.estadisticas.ultimoMarcado).toLocaleDateString() 
                          : 'N/A'}
                      </span>
                    </div>
                  </div>
                </div>

                <div className="bg-gradient-to-br from-purple-50 to-purple-100 p-6 rounded-xl border border-purple-200">
                  <div className="flex items-center gap-3 mb-4">
                    <div className="p-2 bg-purple-500 rounded-lg">
                      <Calendar className="w-6 h-6 text-white" />
                    </div>
                    <div>
                      <h4 className="font-bold text-purple-900">Información</h4>
                      <p className="text-sm text-purple-700">Fechas importantes</p>
                    </div>
                  </div>
                  <div className="space-y-2 text-sm text-purple-800">
                    <div className="flex justify-between">
                      <span>Creado:</span>
                      <span className="font-semibold">{new Date(campoActivo.fechaCreacion).toLocaleDateString()}</span>
                    </div>
                    <div className="flex justify-between">
                      <span>Actualizado:</span>
                      <span className="font-semibold">{new Date(campoActivo.ultimaActualizacion).toLocaleDateString()}</span>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  )
} 