import { useState } from 'react'
import { motion } from 'framer-motion'
import {
  Download,
  FileText,
  FileCode,
  Image,
  Settings,
  CheckCircle,
  AlertTriangle,
  Printer,
  Share2,
  Mail,
  Cloud,
  HardDrive
} from 'lucide-react'

interface ExportadorAvanzadoProps {
  datos: any
  onExportacionCompletada: (resultado: any) => void
}

interface FormatoExportacion {
  id: string
  nombre: string
  extension: string
  icono: any
  descripcion: string
  compatible: boolean
}

export default function ExportadorAvanzado({ datos, onExportacionCompletada }: ExportadorAvanzadoProps) {
  const [formatoSeleccionado, setFormatoSeleccionado] = useState<string>('pdf')
  const [configuracion, setConfiguracion] = useState({
    incluirGPS: true,
    incluirImagenes: true,
    incluirEstadisticas: true,
    calidad: 'alta',
    orientacion: 'horizontal',
    escala: '1:100'
  })
  const [progreso, setProgreso] = useState(0)
  const [estado, setEstado] = useState<'idle' | 'exportando' | 'completado' | 'error'>('idle')
  const [mensaje, setMensaje] = useState('')

  const formatosDisponibles: FormatoExportacion[] = [
    {
      id: 'pdf',
      nombre: 'PDF',
      extension: '.pdf',
      icono: FileText,
      descripcion: 'Documento PDF profesional con gráficos vectoriales',
      compatible: true
    },
    {
      id: 'cad',
      nombre: 'CAD (DWG)',
      extension: '.dwg',
      icono: FileCode,
      descripcion: 'Archivo CAD compatible con AutoCAD y otros software',
      compatible: true
    },
    {
      id: 'dxf',
      nombre: 'DXF',
      extension: '.dxf',
      icono: FileCode,
      descripcion: 'Formato de intercambio de datos CAD',
      compatible: true
    },
    {
      id: 'svg',
      nombre: 'SVG',
      extension: '.svg',
      icono: Image,
      descripcion: 'Gráficos vectoriales escalables',
      compatible: true
    },
    {
      id: 'png',
      nombre: 'PNG',
      extension: '.png',
      icono: Image,
      descripcion: 'Imagen de alta calidad',
      compatible: true
    },
    {
      id: 'json',
      nombre: 'JSON',
      extension: '.json',
      icono: FileCode,
      descripcion: 'Datos estructurados para integración',
      compatible: true
    }
  ]

  const escalasDisponibles = [
    '1:50', '1:100', '1:200', '1:500', '1:1000'
  ]

  const calidadesDisponibles = [
    { id: 'baja', nombre: 'Baja', descripcion: 'Archivo pequeño, calidad básica' },
    { id: 'media', nombre: 'Media', descripcion: 'Balance entre calidad y tamaño' },
    { id: 'alta', nombre: 'Alta', descripcion: 'Máxima calidad, archivo grande' }
  ]

  const orientacionesDisponibles = [
    { id: 'vertical', nombre: 'Vertical', descripcion: 'A4 vertical' },
    { id: 'horizontal', nombre: 'Horizontal', descripcion: 'A4 horizontal' }
  ]

  // Simular exportación
  const exportarArchivo = async () => {
    setEstado('exportando')
    setProgreso(0)
    setMensaje('Iniciando exportación...')

    try {
      // Simular proceso de exportación
      for (let i = 0; i <= 100; i += 10) {
        await new Promise(resolve => setTimeout(resolve, 100))
        setProgreso(i)
        
        if (i === 30) setMensaje('Procesando datos GPS...')
        else if (i === 60) setMensaje('Generando gráficos...')
        else if (i === 90) setMensaje('Finalizando archivo...')
      }

      const formato = formatosDisponibles.find(f => f.id === formatoSeleccionado)
      const nombreArchivo = `cancha_medicion_${Date.now()}${formato?.extension}`

      const resultado = {
        nombreArchivo,
        formato: formatoSeleccionado,
        configuracion,
        datos,
        timestamp: Date.now(),
        tamaño: Math.floor(Math.random() * 5000) + 1000 // KB
      }

      setEstado('completado')
      setMensaje(`Archivo exportado: ${nombreArchivo}`)
      onExportacionCompletada(resultado)

    } catch (error) {
      setEstado('error')
      setMensaje('Error durante la exportación')
      console.error('Error exportación:', error)
    }
  }

  // Descargar archivo
  const descargarArchivo = (archivo: any) => {
    const blob = new Blob([JSON.stringify(archivo)], { type: 'application/json' })
    const url = URL.createObjectURL(blob)
    const a = document.createElement('a')
    a.href = url
    a.download = archivo.nombreArchivo
    document.body.appendChild(a)
    a.click()
    document.body.removeChild(a)
    URL.revokeObjectURL(url)
  }

  return (
    <div className="futbol-card">
      <div className="flex items-center justify-between mb-6">
        <h2 className="text-2xl font-bold text-white">Exportador Avanzado</h2>
        <div className="flex gap-2">
          <motion.button
            onClick={exportarArchivo}
            disabled={estado === 'exportando'}
            className="futbol-btn futbol-btn-primary disabled:opacity-50"
            whileHover={{ scale: 1.05 }}
            whileTap={{ scale: 0.95 }}
          >
            <Download className="w-5 h-5" />
            {estado === 'exportando' ? 'Exportando...' : 'Exportar'}
          </motion.button>
        </div>
      </div>

      {/* Selector de formato */}
      <div className="mb-6">
        <h3 className="text-lg font-semibold text-white mb-3">Formato de Exportación</h3>
        <div className="grid grid-cols-2 md:grid-cols-3 gap-3">
          {formatosDisponibles.map(formato => (
            <motion.button
              key={formato.id}
              onClick={() => setFormatoSeleccionado(formato.id)}
              className={`futbol-card p-4 text-left ${
                formatoSeleccionado === formato.id ? 'ring-2 ring-blue-400' : ''
              } ${!formato.compatible ? 'opacity-50' : ''}`}
              whileHover={{ scale: 1.02 }}
              whileTap={{ scale: 0.98 }}
              disabled={!formato.compatible}
            >
              <div className="flex items-center gap-3 mb-2">
                <formato.icono className="w-6 h-6 text-blue-400" />
                <span className="font-semibold text-white">{formato.nombre}</span>
              </div>
              <p className="text-white/70 text-sm">{formato.descripcion}</p>
            </motion.button>
          ))}
        </div>
      </div>

      {/* Configuración avanzada */}
      <div className="mb-6">
        <h3 className="text-lg font-semibold text-white mb-3">Configuración</h3>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          {/* Opciones de contenido */}
          <div className="space-y-3">
            <h4 className="text-white font-medium">Contenido</h4>
            <label className="flex items-center gap-2 text-white">
              <input
                type="checkbox"
                checked={configuracion.incluirGPS}
                onChange={(e) => setConfiguracion(prev => ({ ...prev, incluirGPS: e.target.checked }))}
                className="rounded"
              />
              Incluir datos GPS
            </label>
            <label className="flex items-center gap-2 text-white">
              <input
                type="checkbox"
                checked={configuracion.incluirImagenes}
                onChange={(e) => setConfiguracion(prev => ({ ...prev, incluirImagenes: e.target.checked }))}
                className="rounded"
              />
              Incluir imágenes
            </label>
            <label className="flex items-center gap-2 text-white">
              <input
                type="checkbox"
                checked={configuracion.incluirEstadisticas}
                onChange={(e) => setConfiguracion(prev => ({ ...prev, incluirEstadisticas: e.target.checked }))}
                className="rounded"
              />
              Incluir estadísticas
            </label>
          </div>

          {/* Opciones de calidad */}
          <div className="space-y-3">
            <h4 className="text-white font-medium">Calidad</h4>
            <select
              value={configuracion.calidad}
              onChange={(e) => setConfiguracion(prev => ({ ...prev, calidad: e.target.value }))}
              className="w-full p-2 bg-gray-800 text-white rounded border border-gray-600"
            >
              {calidadesDisponibles.map(calidad => (
                <option key={calidad.id} value={calidad.id}>
                  {calidad.nombre} - {calidad.descripcion}
                </option>
              ))}
            </select>

            <select
              value={configuracion.orientacion}
              onChange={(e) => setConfiguracion(prev => ({ ...prev, orientacion: e.target.value }))}
              className="w-full p-2 bg-gray-800 text-white rounded border border-gray-600"
            >
              {orientacionesDisponibles.map(orientacion => (
                <option key={orientacion.id} value={orientacion.id}>
                  {orientacion.nombre} - {orientacion.descripcion}
                </option>
              ))}
            </select>

            <select
              value={configuracion.escala}
              onChange={(e) => setConfiguracion(prev => ({ ...prev, escala: e.target.value }))}
              className="w-full p-2 bg-gray-800 text-white rounded border border-gray-600"
            >
              {escalasDisponibles.map(escala => (
                <option key={escala} value={escala}>
                  Escala {escala}
                </option>
              ))}
            </select>
          </div>
        </div>
      </div>

      {/* Barra de progreso */}
      {estado === 'exportando' && (
        <div className="mb-6">
          <div className="flex justify-between text-white mb-2">
            <span>Progreso</span>
            <span>{progreso}%</span>
          </div>
          <div className="w-full bg-gray-700 rounded-full h-2">
            <div
              className="bg-blue-500 h-2 rounded-full transition-all duration-300"
              style={{ width: `${progreso}%` }}
            />
          </div>
          <p className="text-white/70 text-sm mt-2">{mensaje}</p>
        </div>
      )}

      {/* Estado de exportación */}
      {estado === 'completado' && (
        <div className="mb-6 p-4 bg-green-900/20 border border-green-500 rounded-lg">
          <div className="flex items-center gap-2 mb-2">
            <CheckCircle className="w-5 h-5 text-green-400" />
            <span className="text-green-400 font-semibold">Exportación Completada</span>
          </div>
          <p className="text-green-300">{mensaje}</p>
        </div>
      )}

      {estado === 'error' && (
        <div className="mb-6 p-4 bg-red-900/20 border border-red-500 rounded-lg">
          <div className="flex items-center gap-2 mb-2">
            <AlertTriangle className="w-5 h-5 text-red-400" />
            <span className="text-red-400 font-semibold">Error de Exportación</span>
          </div>
          <p className="text-red-300">{mensaje}</p>
        </div>
      )}

      {/* Acciones adicionales */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-3">
        <motion.button
          className="futbol-btn futbol-btn-secondary"
          whileHover={{ scale: 1.05 }}
          whileTap={{ scale: 0.95 }}
        >
          <Printer className="w-5 h-5" />
          Imprimir
        </motion.button>

        <motion.button
          className="futbol-btn futbol-btn-secondary"
          whileHover={{ scale: 1.05 }}
          whileTap={{ scale: 0.95 }}
        >
          <Share2 className="w-5 h-5" />
          Compartir
        </motion.button>

        <motion.button
          className="futbol-btn futbol-btn-secondary"
          whileHover={{ scale: 1.05 }}
          whileTap={{ scale: 0.95 }}
        >
          <Mail className="w-5 h-5" />
          Enviar por Email
        </motion.button>

        <motion.button
          className="futbol-btn futbol-btn-secondary"
          whileHover={{ scale: 1.05 }}
          whileTap={{ scale: 0.95 }}
        >
          <Cloud className="w-5 h-5" />
          Subir a la Nube
        </motion.button>
      </div>

      {/* Información del formato */}
      <div className="mt-6 p-4 bg-blue-900/20 rounded-lg">
        <h4 className="text-lg font-semibold text-white mb-2">
          Formato: {formatosDisponibles.find(f => f.id === formatoSeleccionado)?.nombre}
        </h4>
        <p className="text-white/70 text-sm">
          {formatosDisponibles.find(f => f.id === formatoSeleccionado)?.descripcion}
        </p>
        <div className="mt-3 text-sm text-white/60">
          <p>• Compatible con software profesional</p>
          <p>• Mantiene precisión de mediciones</p>
          <p>• Incluye metadatos GPS</p>
          <p>• Optimizado para impresión</p>
        </div>
      </div>
    </div>
  )
} 