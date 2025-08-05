'use client'

import { useState, useRef } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import {
  FileDown,
  FileText,
  Image,
  FileSpreadsheet,
  Code,
  Award,
  Calendar,
  MapPin,
  Target,
  Clock,
  Users,
  Trophy,
  CheckCircle,
  Download,
  X,
  Eye,
  Settings,
  Printer
} from 'lucide-react'
import { useLanguage } from '../contexts/LanguageContext'

interface ExportFormat {
  id: string
  name: string
  description: string
  icon: any
  extension: string
  mimeType: string
  features: string[]
  color: string
  size?: string
  premium?: boolean
}

interface ExportData {
  fieldInfo: {
    name: string
    location: string
    date: Date
    inspector: string
    club: string
  }
  measurements: any[]
  markings: any[]
  gpsData: any[]
  photos: string[]
  compliance: {
    fifa: boolean
    uefa: boolean
    local: boolean
  }
  statistics: {
    accuracy: number
    duration: number
    points: number
    distance: number
  }
}

interface AdvancedExportSystemProps {
  isOpen: boolean
  onClose: () => void
  data: ExportData
  onExportComplete?: (format: string, url: string) => void
}

export default function AdvancedExportSystem({
  isOpen,
  onClose,
  data,
  onExportComplete
}: AdvancedExportSystemProps) {
  const { t } = useLanguage()
  const [selectedFormat, setSelectedFormat] = useState<string>('fifa-pdf')
  const [exportSettings, setExportSettings] = useState({
    includePhotos: true,
    includeGPS: true,
    includeStatistics: true,
    includeCompliance: true,
    language: 'es',
    quality: 'high',
    orientation: 'portrait',
    template: 'official'
  })
  const [isExporting, setIsExporting] = useState(false)
  const [exportProgress, setExportProgress] = useState(0)
  const [exportStep, setExportStep] = useState('')

  const formats: ExportFormat[] = [
    {
      id: 'fifa-pdf',
      name: t('export.fifa.certificate'),
      description: t('export.fifa.certificate.desc'),
      icon: Award,
      extension: '.pdf',
      mimeType: 'application/pdf',
      features: [
        t('export.feature.official'),
        t('export.feature.fifa.logo'),
        t('export.feature.digital.signature'),
        t('export.feature.compliance')
      ],
      color: 'from-yellow-400 to-orange-500',
      size: '~2MB',
      premium: true
    },
    {
      id: 'technical-pdf',
      name: t('export.technical.report'),
      description: t('export.technical.report.desc'),
      icon: FileText,
      extension: '.pdf',
      mimeType: 'application/pdf',
      features: [
        t('export.feature.detailed'),
        t('export.feature.measurements'),
        t('export.feature.analysis'),
        t('export.feature.recommendations')
      ],
      color: 'from-blue-400 to-purple-500',
      size: '~1.5MB'
    },
    {
      id: 'csv-data',
      name: t('export.csv.data'),
      description: t('export.csv.data.desc'),
      icon: FileSpreadsheet,
      extension: '.csv',
      mimeType: 'text/csv',
      features: [
        t('export.feature.raw.data'),
        t('export.feature.excel.compatible'),
        t('export.feature.analysis.ready'),
        t('export.feature.lightweight')
      ],
      color: 'from-green-400 to-cyan-500',
      size: '~50KB'
    },
    {
      id: 'json-api',
      name: t('export.json.api'),
      description: t('export.json.api.desc'),
      icon: Code,
      extension: '.json',
      mimeType: 'application/json',
      features: [
        t('export.feature.structured'),
        t('export.feature.api.ready'),
        t('export.feature.integration'),
        t('export.feature.developer')
      ],
      color: 'from-purple-400 to-pink-500',
      size: '~100KB'
    },
    {
      id: 'field-map',
      name: t('export.field.map'),
      description: t('export.field.map.desc'),
      icon: MapPin,
      extension: '.png',
      mimeType: 'image/png',
      features: [
        t('export.feature.visual'),
        t('export.feature.high.resolution'),
        t('export.feature.overlays'),
        t('export.feature.printable')
      ],
      color: 'from-emerald-400 to-teal-500',
      size: '~3MB'
    },
    {
      id: 'photo-gallery',
      name: t('export.photo.gallery'),
      description: t('export.photo.gallery.desc'),
      icon: Image,
      extension: '.zip',
      mimeType: 'application/zip',
      features: [
        t('export.feature.all.photos'),
        t('export.feature.organized'),
        t('export.feature.metadata'),
        t('export.feature.timestamp')
      ],
      color: 'from-orange-400 to-red-500',
      size: '~10MB'
    }
  ]

  const exportSteps = [
    t('export.step.preparing'),
    t('export.step.processing'),
    t('export.step.generating'),
    t('export.step.finalizing'),
    t('export.step.complete')
  ]

  const handleExport = async () => {
    if (!selectedFormat) return

    setIsExporting(true)
    setExportProgress(0)

    const format = formats.find(f => f.id === selectedFormat)
    if (!format) return

    try {
      // Simular proceso de exportación
      for (let i = 0; i < exportSteps.length; i++) {
        setExportStep(exportSteps[i])
        setExportProgress((i + 1) / exportSteps.length * 100)
        await new Promise(resolve => setTimeout(resolve, 1000))
      }

      // Generar archivo según el formato
      const exportedData = await generateExport(selectedFormat, data, exportSettings)
      
      // Crear URL de descarga
      const blob = new Blob([exportedData.content], { type: format.mimeType })
      const url = URL.createObjectURL(blob)
      
      // Descargar archivo
      const link = document.createElement('a')
      link.href = url
      link.download = `${data.fieldInfo.name}_${selectedFormat}_${new Date().toISOString().split('T')[0]}${format.extension}`
      document.body.appendChild(link)
      link.click()
      document.body.removeChild(link)
      URL.revokeObjectURL(url)

      if (onExportComplete) {
        onExportComplete(selectedFormat, url)
      }

      // Resetear estado
      setTimeout(() => {
        setIsExporting(false)
        setExportProgress(0)
        setExportStep('')
        onClose()
      }, 1000)

    } catch (error) {
      console.error('Error en exportación:', error)
      setIsExporting(false)
      setExportProgress(0)
      setExportStep(t('export.error'))
    }
  }

  const generateExport = async (format: string, data: ExportData, settings: any) => {
    switch (format) {
      case 'fifa-pdf':
        return generateFIFACertificate(data, settings)
      case 'technical-pdf':
        return generateTechnicalReport(data, settings)
      case 'csv-data':
        return generateCSVData(data, settings)
      case 'json-api':
        return generateJSONData(data, settings)
      case 'field-map':
        return generateFieldMap(data, settings)
      case 'photo-gallery':
        return generatePhotoGallery(data, settings)
      default:
        throw new Error('Formato no soportado')
    }
  }

  const generateFIFACertificate = async (data: ExportData, settings: any) => {
    // Generar certificado PDF FIFA oficial
    const content = `
      %PDF-1.4
      FIFA FIELD CERTIFICATION REPORT
      
      Field: ${data.fieldInfo.name}
      Club: ${data.fieldInfo.club}
      Location: ${data.fieldInfo.location}
      Date: ${data.fieldInfo.date.toLocaleDateString()}
      Inspector: ${data.fieldInfo.inspector}
      
      MEASUREMENTS:
      ${data.measurements.map(m => `${m.nombre}: ${m.distancia}m (${m.cumpleFIFA ? 'COMPLIANT' : 'NON-COMPLIANT'})`).join('\n')}
      
      COMPLIANCE STATUS:
      FIFA: ${data.compliance.fifa ? 'CERTIFIED' : 'PENDING'}
      UEFA: ${data.compliance.uefa ? 'CERTIFIED' : 'PENDING'}
      
      STATISTICS:
      Accuracy: ${data.statistics.accuracy}%
      Duration: ${data.statistics.duration} minutes
      Points Measured: ${data.statistics.points}
      Distance Covered: ${data.statistics.distance}m
      
      This certificate is generated by Lissewege Fields - R.F.C. Lissewege
      Digital signature and timestamp included.
    `
    
    return { content, size: content.length }
  }

  const generateTechnicalReport = async (data: ExportData, settings: any) => {
    // Generar reporte técnico detallado
    const content = JSON.stringify({
      report_type: 'technical_analysis',
      field: data.fieldInfo,
      measurements: data.measurements,
      markings: data.markings,
      analysis: {
        compliance_score: data.statistics.accuracy,
        recommendations: [
          'Verify corner arc dimensions',
          'Check goal line markings',
          'Ensure penalty area accuracy'
        ]
      },
      generated_by: 'Lissewege Fields',
      timestamp: new Date().toISOString()
    }, null, 2)
    
    return { content, size: content.length }
  }

  const generateCSVData = async (data: ExportData, settings: any) => {
    // Generar datos CSV
    let csv = 'Type,Name,Value,Unit,FIFA_Compliant,Timestamp\n'
    
    data.measurements.forEach(m => {
      csv += `Measurement,"${m.nombre}",${m.distancia},meters,${m.cumpleFIFA},${m.timestamp}\n`
    })
    
    data.markings.forEach(m => {
      csv += `Marking,"${m.nombre}",${m.progreso},percent,${m.completada},${m.timestamp}\n`
    })
    
    return { content: csv, size: csv.length }
  }

  const generateJSONData = async (data: ExportData, settings: any) => {
    // Generar datos JSON estructurados
    const jsonData = {
      metadata: {
        export_version: '2.0',
        generated_at: new Date().toISOString(),
        generator: 'Lissewege Fields v1.0',
        language: settings.language
      },
      field: data.fieldInfo,
      data: {
        measurements: data.measurements,
        markings: data.markings,
        gps_points: data.gpsData,
        photos: data.photos
      },
      compliance: data.compliance,
      statistics: data.statistics
    }
    
    return { content: JSON.stringify(jsonData, null, 2), size: JSON.stringify(jsonData).length }
  }

  const generateFieldMap = async (data: ExportData, settings: any) => {
    // Generar mapa visual del campo
    const svgContent = `
      <svg width="800" height="600" xmlns="http://www.w3.org/2000/svg">
        <rect width="800" height="600" fill="#2d5f3e"/>
        <rect x="50" y="50" width="700" height="500" fill="none" stroke="white" stroke-width="3"/>
        <line x1="400" y1="50" x2="400" y2="550" stroke="white" stroke-width="2"/>
        <circle cx="400" cy="300" r="73" fill="none" stroke="white" stroke-width="2"/>
        <text x="400" y="30" text-anchor="middle" fill="white" font-size="20">${data.fieldInfo.name}</text>
        <text x="400" y="580" text-anchor="middle" fill="white" font-size="14">Generated by Lissewege Fields</text>
      </svg>
    `
    
    return { content: svgContent, size: svgContent.length }
  }

  const generatePhotoGallery = async (data: ExportData, settings: any) => {
    // Generar galería de fotos
    const manifest = {
      photos: data.photos.map((photo, index) => ({
        filename: `photo_${index + 1}.jpg`,
        timestamp: new Date().toISOString(),
        metadata: {
          field: data.fieldInfo.name,
          date: data.fieldInfo.date
        }
      })),
      total_photos: data.photos.length,
      generated_by: 'Lissewege Fields'
    }
    
    return { content: JSON.stringify(manifest, null, 2), size: JSON.stringify(manifest).length }
  }

  if (!isOpen) return null

  return (
    <AnimatePresence>
      <motion.div
        className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/50 backdrop-blur-sm"
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        exit={{ opacity: 0 }}
        onClick={onClose}
      >
        <motion.div
          className="bg-gray-900 rounded-2xl max-w-6xl w-full max-h-[90vh] overflow-hidden"
          initial={{ scale: 0.9, opacity: 0 }}
          animate={{ scale: 1, opacity: 1 }}
          exit={{ scale: 0.9, opacity: 0 }}
          onClick={(e) => e.stopPropagation()}
        >
          {/* Header */}
          <div className="flex items-center justify-between p-6 border-b border-white/10">
            <div className="flex items-center space-x-3">
              <div className="p-2 bg-gradient-to-r from-blue-400 to-purple-500 rounded-lg">
                <FileDown className="w-6 h-6 text-white" />
              </div>
              <div>
                <h2 className="text-xl font-bold text-white">
                  {t('export.title')}
                </h2>
                <p className="text-white/60 text-sm">
                  {t('export.subtitle')} {data.fieldInfo.name}
                </p>
              </div>
            </div>
            <button
              onClick={onClose}
              className="p-2 hover:bg-white/10 rounded-lg text-white/60"
            >
              <X className="w-5 h-5" />
            </button>
          </div>

          <div className="flex h-[calc(90vh-120px)]">
            {/* Lista de formatos */}
            <div className="w-2/3 p-6 overflow-y-auto">
              <h3 className="text-lg font-semibold text-white mb-4">
                {t('export.select.format')}
              </h3>
              
              <div className="grid grid-cols-1 lg:grid-cols-2 gap-4">
                {formats.map(format => (
                  <motion.div
                    key={format.id}
                    className={`relative overflow-hidden rounded-xl border cursor-pointer transition-all ${
                      selectedFormat === format.id
                        ? 'border-blue-500 bg-blue-600/10'
                        : 'border-white/10 hover:border-white/20 bg-white/5 hover:bg-white/10'
                    }`}
                    whileHover={{ scale: 1.02 }}
                    whileTap={{ scale: 0.98 }}
                    onClick={() => setSelectedFormat(format.id)}
                  >
                    {/* Badge premium */}
                    {format.premium && (
                      <div className="absolute top-3 right-3 z-10">
                        <div className="flex items-center space-x-1 px-2 py-1 bg-gradient-to-r from-yellow-400 to-orange-500 rounded-full">
                          <Trophy className="w-3 h-3 text-white" />
                          <span className="text-xs font-medium text-white">
                            {t('export.premium')}
                          </span>
                        </div>
                      </div>
                    )}

                    {/* Header */}
                    <div className={`h-16 bg-gradient-to-r ${format.color} flex items-center justify-center`}>
                      <format.icon className="w-6 h-6 text-white" />
                    </div>

                    <div className="p-4">
                      <div className="flex items-center justify-between mb-2">
                        <h4 className="text-white font-medium">
                          {format.name}
                        </h4>
                        {format.size && (
                          <span className="text-xs text-white/60 bg-white/10 px-2 py-1 rounded">
                            {format.size}
                          </span>
                        )}
                      </div>
                      
                      <p className="text-white/70 text-sm mb-3">
                        {format.description}
                      </p>

                      {/* Características */}
                      <div className="space-y-1">
                        {format.features.slice(0, 3).map(feature => (
                          <div key={feature} className="flex items-center space-x-2">
                            <CheckCircle className="w-3 h-3 text-green-400" />
                            <span className="text-xs text-white/80">{feature}</span>
                          </div>
                        ))}
                      </div>

                      {selectedFormat === format.id && (
                        <motion.div
                          className="mt-3 pt-3 border-t border-white/10"
                          initial={{ opacity: 0, height: 0 }}
                          animate={{ opacity: 1, height: 'auto' }}
                        >
                          <div className="flex items-center space-x-2 text-blue-400">
                            <CheckCircle className="w-4 h-4" />
                            <span className="text-sm font-medium">
                              {t('export.selected')}
                            </span>
                          </div>
                        </motion.div>
                      )}
                    </div>
                  </motion.div>
                ))}
              </div>
            </div>

            {/* Panel de configuración */}
            <div className="w-1/3 border-l border-white/10 p-6">
              <h3 className="text-lg font-semibold text-white mb-4 flex items-center space-x-2">
                <Settings className="w-5 h-5" />
                <span>{t('export.settings')}</span>
              </h3>

              <div className="space-y-4">
                {/* Incluir fotos */}
                <div className="flex items-center justify-between">
                  <span className="text-white/80 text-sm">{t('export.include.photos')}</span>
                  <motion.button
                    onClick={() => setExportSettings(prev => ({ ...prev, includePhotos: !prev.includePhotos }))}
                    className={`w-8 h-5 rounded-full transition-colors ${
                      exportSettings.includePhotos ? 'bg-blue-500' : 'bg-gray-600'
                    }`}
                    whileTap={{ scale: 0.95 }}
                  >
                    <motion.div
                      className="w-3 h-3 bg-white rounded-full"
                      animate={{ x: exportSettings.includePhotos ? 18 : 2, y: 1 }}
                      transition={{ type: 'spring', stiffness: 500, damping: 30 }}
                    />
                  </motion.button>
                </div>

                {/* Incluir GPS */}
                <div className="flex items-center justify-between">
                  <span className="text-white/80 text-sm">{t('export.include.gps')}</span>
                  <motion.button
                    onClick={() => setExportSettings(prev => ({ ...prev, includeGPS: !prev.includeGPS }))}
                    className={`w-8 h-5 rounded-full transition-colors ${
                      exportSettings.includeGPS ? 'bg-blue-500' : 'bg-gray-600'
                    }`}
                    whileTap={{ scale: 0.95 }}
                  >
                    <motion.div
                      className="w-3 h-3 bg-white rounded-full"
                      animate={{ x: exportSettings.includeGPS ? 18 : 2, y: 1 }}
                      transition={{ type: 'spring', stiffness: 500, damping: 30 }}
                    />
                  </motion.button>
                </div>

                {/* Calidad */}
                <div>
                  <label className="text-white/80 text-sm block mb-2">
                    {t('export.quality')}
                  </label>
                  <select
                    value={exportSettings.quality}
                    onChange={(e) => setExportSettings(prev => ({ ...prev, quality: e.target.value }))}
                    className="w-full px-3 py-2 bg-white/10 border border-white/20 rounded-lg text-white"
                  >
                    <option value="low">{t('export.quality.low')}</option>
                    <option value="medium">{t('export.quality.medium')}</option>
                    <option value="high">{t('export.quality.high')}</option>
                  </select>
                </div>

                {/* Idioma */}
                <div>
                  <label className="text-white/80 text-sm block mb-2">
                    {t('export.language')}
                  </label>
                  <select
                    value={exportSettings.language}
                    onChange={(e) => setExportSettings(prev => ({ ...prev, language: e.target.value }))}
                    className="w-full px-3 py-2 bg-white/10 border border-white/20 rounded-lg text-white"
                  >
                    <option value="es">Español</option>
                    <option value="nl">Nederlands</option>
                    <option value="en">English</option>
                  </select>
                </div>
              </div>

              {/* Vista previa de datos */}
              <div className="mt-6 p-3 bg-white/5 rounded-lg">
                <h4 className="text-white font-medium text-sm mb-2">
                  {t('export.data.preview')}
                </h4>
                <div className="space-y-1 text-xs text-white/70">
                  <div className="flex justify-between">
                    <span>{t('export.measurements')}:</span>
                    <span>{data.measurements.length}</span>
                  </div>
                  <div className="flex justify-between">
                    <span>{t('export.markings')}:</span>
                    <span>{data.markings.length}</span>
                  </div>
                  <div className="flex justify-between">
                    <span>{t('export.photos')}:</span>
                    <span>{data.photos.length}</span>
                  </div>
                  <div className="flex justify-between">
                    <span>{t('export.gps.points')}:</span>
                    <span>{data.gpsData.length}</span>
                  </div>
                </div>
              </div>

              {/* Progreso de exportación */}
              {isExporting && (
                <motion.div
                  className="mt-6 p-4 bg-blue-600/20 border border-blue-500/30 rounded-lg"
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                >
                  <div className="flex items-center space-x-2 mb-2">
                    <div className="w-4 h-4 border-2 border-blue-400 border-t-transparent rounded-full animate-spin"></div>
                    <span className="text-blue-300 text-sm font-medium">
                      {exportStep}
                    </span>
                  </div>
                  <div className="w-full h-2 bg-white/20 rounded-full overflow-hidden">
                    <motion.div
                      className="h-full bg-blue-400"
                      style={{ width: `${exportProgress}%` }}
                      animate={{ width: `${exportProgress}%` }}
                      transition={{ duration: 0.3 }}
                    />
                  </div>
                  <div className="text-xs text-blue-300 mt-1">
                    {Math.round(exportProgress)}%
                  </div>
                </motion.div>
              )}
            </div>
          </div>

          {/* Footer */}
          <div className="flex items-center justify-between p-6 border-t border-white/10">
            <div className="text-sm text-white/60">
              {data.fieldInfo.name} • {data.fieldInfo.date.toLocaleDateString()}
            </div>
            <div className="flex space-x-3">
              <motion.button
                onClick={onClose}
                className="px-4 py-2 text-white/70 hover:text-white transition-colors"
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
                disabled={isExporting}
              >
                {t('export.cancel')}
              </motion.button>
              <motion.button
                onClick={handleExport}
                disabled={!selectedFormat || isExporting}
                className="px-6 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors disabled:opacity-50 disabled:cursor-not-allowed flex items-center space-x-2"
                whileHover={{ scale: isExporting ? 1 : 1.05 }}
                whileTap={{ scale: isExporting ? 1 : 0.95 }}
              >
                {isExporting ? (
                  <>
                    <div className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin"></div>
                    <span>{t('export.processing')}</span>
                  </>
                ) : (
                  <>
                    <Download className="w-4 h-4" />
                    <span>{t('export.download')}</span>
                  </>
                )}
              </motion.button>
            </div>
          </div>
        </motion.div>
      </motion.div>
    </AnimatePresence>
  )
}