'use client'

import { motion } from 'framer-motion'
import { 
  FileText, 
  Download, 
  Share2, 
  BarChart3, 
  TrendingUp,
  CheckCircle,
  AlertTriangle,
  Award,
  LineChart,
  Activity,
  Target
} from 'lucide-react'
import { useState } from 'react'



interface EstadisticasReporte {
  totalMediciones: number
  promedioPrecision: number
  cumplimientoPromedio: number
  tiempoPromedio: number
  medicionesCertificadas: number
  tendencia: 'mejorando' | 'estable' | 'empeorando'
}

interface ReportesAvanzadosProps {
  onExportarReporte: (formato: 'pdf' | 'excel' | 'json') => void
}

export default function ReportesAvanzados({ 
  onExportarReporte 
}: ReportesAvanzadosProps) {
  const [periodoFiltro, setPeriodoFiltro] = useState<'7d' | '30d' | '90d' | '1a'>('30d')
  const [tipoReporte, setTipoReporte] = useState<'general' | 'fifa' | 'tendencias' | 'certificacion'>('general')
  const [mostrarGraficos, setMostrarGraficos] = useState(true)

  // Simular datos de reporte
  const estadisticas: EstadisticasReporte = {
    totalMediciones: 156,
    promedioPrecision: 98.5,
    cumplimientoPromedio: 95.2,
    tiempoPromedio: 45,
    medicionesCertificadas: 142,
    tendencia: 'mejorando'
  }



  const obtenerIconoTendencia = (tendencia: string) => {
    switch (tendencia) {
      case 'mejorando': return <TrendingUp className="w-4 h-4" />
      case 'estable': return <Activity className="w-4 h-4" />
      case 'empeorando': return <AlertTriangle className="w-4 h-4" />
      default: return <Activity className="w-4 h-4" />
    }
  }

  const generarReportePDF = () => {
    // Simular generación de PDF
    console.log('Generando reporte PDF...')
    onExportarReporte('pdf')
  }

  const generarReporteExcel = () => {
    // Simular generación de Excel
    console.log('Generando reporte Excel...')
    onExportarReporte('excel')
  }

  const generarReporteJSON = () => {
    // Simular generación de JSON
    console.log('Generando reporte JSON...')
    onExportarReporte('json')
  }

  const compartirReporte = () => {
    // Simular compartir reporte
    if (navigator.share) {
      navigator.share({
        title: 'Reporte de Medición FIFA',
        text: 'Reporte detallado de mediciones de cancha',
        url: window.location.href
      })
    } else {
      // Fallback para navegadores que no soportan Web Share API
      navigator.clipboard.writeText(window.location.href)
      alert('Enlace copiado al portapapeles')
    }
  }

  return (
    <div className="space-y-6">
      {/* Header */}
      <motion.div 
        className="futbol-card"
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
      >
        <div className="flex items-center justify-between mb-6">
          <div>
            <h2 className="text-2xl font-bold text-white mb-2">Reportes Avanzados</h2>
            <p className="text-white/70">Análisis detallado y exportación de datos</p>
          </div>
          <div className="flex items-center gap-2">
            <motion.button
              onClick={() => setMostrarGraficos(!mostrarGraficos)}
              className="futbol-btn futbol-btn-secondary p-2"
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
            >
              {mostrarGraficos ? <BarChart3 className="w-4 h-4" /> : <LineChart className="w-4 h-4" />}
            </motion.button>
          </div>
        </div>

        {/* Filtros */}
        <div className="flex flex-wrap gap-4 mb-6">
          <div className="flex gap-2">
            {[
              { id: '7d', nombre: '7 días' },
              { id: '30d', nombre: '30 días' },
              { id: '90d', nombre: '90 días' },
              { id: '1a', nombre: '1 año' }
            ].map(periodo => (
              <motion.button
                key={periodo.id}
                onClick={() => setPeriodoFiltro(periodo.id as any)}
                className={`px-4 py-2 rounded-full text-sm font-medium transition-all ${
                  periodoFiltro === periodo.id 
                    ? 'bg-blue-500 text-white' 
                    : 'bg-white/10 text-white/70 hover:bg-white/20'
                }`}
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
              >
                {periodo.nombre}
              </motion.button>
            ))}
          </div>

          <div className="flex gap-2">
            {[
              { id: 'general', nombre: 'General', icono: <BarChart3 className="w-4 h-4" /> },
              { id: 'fifa', nombre: 'FIFA', icono: <Award className="w-4 h-4" /> },
              { id: 'tendencias', nombre: 'Tendencias', icono: <TrendingUp className="w-4 h-4" /> },
              { id: 'certificacion', nombre: 'Certificación', icono: <CheckCircle className="w-4 h-4" /> }
            ].map(tipo => (
              <motion.button
                key={tipo.id}
                onClick={() => setTipoReporte(tipo.id as any)}
                className={`px-4 py-2 rounded-full text-sm font-medium transition-all flex items-center gap-2 ${
                  tipoReporte === tipo.id 
                    ? 'bg-green-500 text-white' 
                    : 'bg-white/10 text-white/70 hover:bg-white/20'
                }`}
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
              >
                {tipo.icono}
                {tipo.nombre}
              </motion.button>
            ))}
          </div>
        </div>
      </motion.div>

      {/* Métricas Principales */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        <motion.div 
          className="futbol-card"
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.1 }}
        >
          <div className="flex items-center justify-between">
            <div>
              <p className="text-white/70 text-sm">Total Mediciones</p>
              <p className="text-3xl font-bold text-blue-400">{estadisticas.totalMediciones}</p>
            </div>
            <div className="w-12 h-12 bg-blue-500/20 rounded-lg flex items-center justify-center">
              <BarChart3 className="w-6 h-6 text-blue-400" />
            </div>
          </div>
        </motion.div>

        <motion.div 
          className="futbol-card"
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.2 }}
        >
          <div className="flex items-center justify-between">
            <div>
              <p className="text-white/70 text-sm">Precisión Promedio</p>
              <p className="text-3xl font-bold text-green-400">{estadisticas.promedioPrecision}%</p>
            </div>
            <div className="w-12 h-12 bg-green-500/20 rounded-lg flex items-center justify-center">
              <Target className="w-6 h-6 text-green-400" />
            </div>
          </div>
        </motion.div>

        <motion.div 
          className="futbol-card"
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.3 }}
        >
          <div className="flex items-center justify-between">
            <div>
              <p className="text-white/70 text-sm">Cumplimiento FIFA</p>
              <p className="text-3xl font-bold text-purple-400">{estadisticas.cumplimientoPromedio}%</p>
            </div>
            <div className="w-12 h-12 bg-purple-500/20 rounded-lg flex items-center justify-center">
              <Award className="w-6 h-6 text-purple-400" />
            </div>
          </div>
        </motion.div>

        <motion.div 
          className="futbol-card"
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.4 }}
        >
          <div className="flex items-center justify-between">
            <div>
              <p className="text-white/70 text-sm">Tendencia</p>
              <div className="flex items-center gap-2">
                <p className="text-2xl font-bold text-orange-400">Mejorando</p>
                {obtenerIconoTendencia(estadisticas.tendencia)}
              </div>
            </div>
            <div className="w-12 h-12 bg-orange-500/20 rounded-lg flex items-center justify-center">
              <TrendingUp className="w-6 h-6 text-orange-400" />
            </div>
          </div>
        </motion.div>
      </div>

      {/* Gráficos y Análisis */}
      {mostrarGraficos && (
        <motion.div 
          className="futbol-card"
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.5 }}
        >
          <h3 className="text-lg font-bold text-white mb-4">Análisis de Tendencias</h3>
          
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            {/* Gráfico de Precisión */}
            <div className="bg-white/5 rounded-lg p-4">
              <h4 className="text-white font-semibold mb-3 flex items-center gap-2">
                <Target className="w-4 h-4 text-blue-400" />
                Precisión GPS
              </h4>
              <div className="space-y-2">
                <div className="flex justify-between text-sm">
                  <span className="text-white/70">Excelente (&gt;95%)</span>
                  <span className="text-green-400">85%</span>
                </div>
                <div className="w-full bg-white/10 rounded-full h-2">
                  <div className="bg-green-400 h-2 rounded-full" style={{ width: '85%' }}></div>
                </div>
                
                <div className="flex justify-between text-sm">
                  <span className="text-white/70">Buena (90-95%)</span>
                  <span className="text-yellow-400">12%</span>
                </div>
                <div className="w-full bg-white/10 rounded-full h-2">
                  <div className="bg-yellow-400 h-2 rounded-full" style={{ width: '12%' }}></div>
                </div>
                
                <div className="flex justify-between text-sm">
                  <span className="text-white/70">Regular (&lt;90%)</span>
                  <span className="text-red-400">3%</span>
                </div>
                <div className="w-full bg-white/10 rounded-full h-2">
                  <div className="bg-red-400 h-2 rounded-full" style={{ width: '3%' }}></div>
                </div>
              </div>
            </div>

            {/* Gráfico de Cumplimiento FIFA */}
            <div className="bg-white/5 rounded-lg p-4">
              <h4 className="text-white font-semibold mb-3 flex items-center gap-2">
                <Award className="w-4 h-4 text-purple-400" />
                Cumplimiento FIFA
              </h4>
              <div className="space-y-2">
                <div className="flex justify-between text-sm">
                  <span className="text-white/70">Certificado</span>
                  <span className="text-green-400">91%</span>
                </div>
                <div className="w-full bg-white/10 rounded-full h-2">
                  <div className="bg-green-400 h-2 rounded-full" style={{ width: '91%' }}></div>
                </div>
                
                <div className="flex justify-between text-sm">
                  <span className="text-white/70">Aprobado</span>
                  <span className="text-blue-400">7%</span>
                </div>
                <div className="w-full bg-white/10 rounded-full h-2">
                  <div className="bg-blue-400 h-2 rounded-full" style={{ width: '7%' }}></div>
                </div>
                
                <div className="flex justify-between text-sm">
                  <span className="text-white/70">Rechazado</span>
                  <span className="text-red-400">2%</span>
                </div>
                <div className="w-full bg-white/10 rounded-full h-2">
                  <div className="bg-red-400 h-2 rounded-full" style={{ width: '2%' }}></div>
                </div>
              </div>
            </div>
          </div>
        </motion.div>
      )}

      {/* Acciones de Exportación */}
      <motion.div 
        className="futbol-card"
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.6 }}
      >
        <h3 className="text-lg font-bold text-white mb-4">Exportar Reporte</h3>
        
        <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
          <motion.button
            onClick={generarReportePDF}
            className="futbol-btn futbol-btn-primary flex items-center justify-center gap-2"
            whileHover={{ scale: 1.02 }}
            whileTap={{ scale: 0.98 }}
          >
            <FileText className="w-4 h-4" />
            <span>PDF</span>
          </motion.button>
          
          <motion.button
            onClick={generarReporteExcel}
            className="futbol-btn futbol-btn-success flex items-center justify-center gap-2"
            whileHover={{ scale: 1.02 }}
            whileTap={{ scale: 0.98 }}
          >
            <Download className="w-4 h-4" />
            <span>Excel</span>
          </motion.button>
          
          <motion.button
            onClick={generarReporteJSON}
            className="futbol-btn futbol-btn-warning flex items-center justify-center gap-2"
            whileHover={{ scale: 1.02 }}
            whileTap={{ scale: 0.98 }}
          >
            <BarChart3 className="w-4 h-4" />
            <span>JSON</span>
          </motion.button>
          
          <motion.button
            onClick={compartirReporte}
            className="futbol-btn futbol-btn-secondary flex items-center justify-center gap-2"
            whileHover={{ scale: 1.02 }}
            whileTap={{ scale: 0.98 }}
          >
            <Share2 className="w-4 h-4" />
            <span>Compartir</span>
          </motion.button>
        </div>
      </motion.div>
    </div>
  )
} 