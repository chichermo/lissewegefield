'use client'

import { motion } from 'framer-motion'
import { 
  Trophy, 
  MapPin, 
  Ruler, 
  Circle, 
  Square, 
  CheckCircle,
  Download,
  Eye,
  EyeOff
} from 'lucide-react'
import { useState } from 'react'

interface PlantillaFIFA {
  id: string
  nombre: string
  categoria: 'futbol_11' | 'futbol_7' | 'futbol_5' | 'futsal' | 'beach_soccer'
  dimensiones: {
    largo: number
    ancho: number
    areaPenalLargo: number
    areaPenalAncho: number
    areaMetaLargo: number
    areaMetaAncho: number
    radioCirculoCentral: number
    radioArcoPenal: number
    puntoPenal: number
    puntoCorner: number
  }
  tolerancia: number
  color: string
  icono: string
  descripcion: string
  certificacion: boolean
}

const plantillasFIFA: PlantillaFIFA[] = [
  {
    id: 'fifa_11_competition',
    nombre: 'Fútbol 11 - Competencia',
    categoria: 'futbol_11',
    dimensiones: {
      largo: 105,
      ancho: 68,
      areaPenalLargo: 16.5,
      areaPenalAncho: 40.32,
      areaMetaLargo: 5.5,
      areaMetaAncho: 18.32,
      radioCirculoCentral: 9.15,
      radioArcoPenal: 9.15,
      puntoPenal: 11,
      puntoCorner: 1
    },
    tolerancia: 0.5,
    color: '#3B82F6',
    icono: 'Trophy',
    descripcion: 'Dimensiones oficiales para competencias FIFA',
    certificacion: true
  },
  {
    id: 'fifa_11_recreational',
    nombre: 'Fútbol 11 - Recreativo',
    categoria: 'futbol_11',
    dimensiones: {
      largo: 100,
      ancho: 64,
      areaPenalLargo: 16.5,
      areaPenalAncho: 40.32,
      areaMetaLargo: 5.5,
      areaMetaAncho: 18.32,
      radioCirculoCentral: 9.15,
      radioArcoPenal: 9.15,
      puntoPenal: 11,
      puntoCorner: 1
    },
    tolerancia: 1.0,
    color: '#10B981',
    icono: 'MapPin',
    descripcion: 'Dimensiones flexibles para uso recreativo',
    certificacion: false
  },
  {
    id: 'fifa_7_official',
    nombre: 'Fútbol 7 - Oficial',
    categoria: 'futbol_7',
    dimensiones: {
      largo: 65,
      ancho: 45,
      areaPenalLargo: 13,
      areaPenalAncho: 32,
      areaMetaLargo: 5,
      areaMetaAncho: 16,
      radioCirculoCentral: 6,
      radioArcoPenal: 6,
      puntoPenal: 9,
      puntoCorner: 1
    },
    tolerancia: 0.3,
    color: '#F59E0B',
    icono: 'Circle',
    descripcion: 'Dimensiones oficiales para fútbol 7',
    certificacion: true
  },
  {
    id: 'fifa_5_indoor',
    nombre: 'Fútbol 5 - Indoor',
    categoria: 'futbol_5',
    dimensiones: {
      largo: 40,
      ancho: 20,
      areaPenalLargo: 10,
      areaPenalAncho: 20,
      areaMetaLargo: 3,
      areaMetaAncho: 12,
      radioCirculoCentral: 3,
      radioArcoPenal: 3,
      puntoPenal: 6,
      puntoCorner: 1
    },
    tolerancia: 0.2,
    color: '#EF4444',
    icono: 'Square',
    descripcion: 'Dimensiones para fútbol 5 indoor',
    certificacion: true
  },
  {
    id: 'futsal_official',
    nombre: 'Futsal - Oficial',
    categoria: 'futsal',
    dimensiones: {
      largo: 40,
      ancho: 20,
      areaPenalLargo: 6,
      areaPenalAncho: 20,
      areaMetaLargo: 2,
      areaMetaAncho: 16,
      radioCirculoCentral: 3,
      radioArcoPenal: 3,
      puntoPenal: 6,
      puntoCorner: 1
    },
    tolerancia: 0.1,
    color: '#8B5CF6',
    icono: 'Circle',
    descripcion: 'Dimensiones oficiales de futsal',
    certificacion: true
  }
]

interface PlantillasFIFAProps {
  onPlantillaSeleccionada: (plantilla: PlantillaFIFA) => void
  plantillaActual?: PlantillaFIFA
}

export default function PlantillasFIFA({ 
  onPlantillaSeleccionada, 
  plantillaActual 
}: PlantillasFIFAProps) {
  const [categoriaFiltro, setCategoriaFiltro] = useState<string>('todas')
  const [mostrarDetalles, setMostrarDetalles] = useState<string | null>(null)
  const [modoVista, setModoVista] = useState<'grid' | 'list'>('grid')

  const categorias = [
    { id: 'todas', nombre: 'Todas', color: '#6B7280' },
    { id: 'futbol_11', nombre: 'Fútbol 11', color: '#3B82F6' },
    { id: 'futbol_7', nombre: 'Fútbol 7', color: '#F59E0B' },
    { id: 'futbol_5', nombre: 'Fútbol 5', color: '#EF4444' },
    { id: 'futsal', nombre: 'Futsal', color: '#8B5CF6' }
  ]

  const plantillasFiltradas = plantillasFIFA.filter(plantilla => 
    categoriaFiltro === 'todas' || plantilla.categoria === categoriaFiltro
  )

  const obtenerIcono = (icono: string) => {
    switch (icono) {
      case 'Trophy': return <Trophy className="w-5 h-5" />
      case 'MapPin': return <MapPin className="w-5 h-5" />
      case 'Circle': return <Circle className="w-5 h-5" />
      case 'Square': return <Square className="w-5 h-5" />
      default: return <Ruler className="w-5 h-5" />
    }
  }

  const exportarPlantilla = (plantilla: PlantillaFIFA) => {
    const datos = {
      plantilla,
      fecha: new Date().toISOString(),
      version: '1.0'
    }
    const blob = new Blob([JSON.stringify(datos, null, 2)], { type: 'application/json' })
    const url = URL.createObjectURL(blob)
    const a = document.createElement('a')
    a.href = url
    a.download = `plantilla-${plantilla.id}.json`
    document.body.appendChild(a)
    a.click()
    document.body.removeChild(a)
    URL.revokeObjectURL(url)
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
            <h2 className="text-2xl font-bold text-white mb-2">Plantillas FIFA</h2>
            <p className="text-white/70">Plantillas predefinidas según estándares oficiales</p>
          </div>
          <div className="flex items-center gap-2">
            <motion.button
              onClick={() => setModoVista('grid')}
              className={`p-2 rounded ${modoVista === 'grid' ? 'bg-blue-500' : 'bg-white/10'}`}
              whileHover={{ scale: 1.05 }}
            >
              <Square className="w-4 h-4 text-white" />
            </motion.button>
            <motion.button
              onClick={() => setModoVista('list')}
              className={`p-2 rounded ${modoVista === 'list' ? 'bg-blue-500' : 'bg-white/10'}`}
              whileHover={{ scale: 1.05 }}
            >
              <Ruler className="w-4 h-4 text-white" />
            </motion.button>
          </div>
        </div>

        {/* Filtros */}
        <div className="flex flex-wrap gap-2 mb-6">
          {categorias.map(categoria => (
            <motion.button
              key={categoria.id}
              onClick={() => setCategoriaFiltro(categoria.id)}
              className={`px-4 py-2 rounded-full text-sm font-medium transition-all ${
                categoriaFiltro === categoria.id 
                  ? 'bg-blue-500 text-white' 
                  : 'bg-white/10 text-white/70 hover:bg-white/20'
              }`}
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
            >
              {categoria.nombre}
            </motion.button>
          ))}
        </div>
      </motion.div>

      {/* Plantillas */}
      <div className={modoVista === 'grid' ? 'grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6' : 'space-y-4'}>
        {plantillasFiltradas.map((plantilla, index) => (
          <motion.div
            key={plantilla.id}
            className={`futbol-card ${plantillaActual?.id === plantilla.id ? 'ring-2 ring-blue-400' : ''}`}
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: index * 0.1 }}
            whileHover={{ scale: 1.02 }}
          >
            <div className="flex items-start justify-between mb-4">
              <div className="flex items-center gap-3">
                <div 
                  className="w-12 h-12 rounded-lg flex items-center justify-center"
                  style={{ backgroundColor: plantilla.color }}
                >
                  {obtenerIcono(plantilla.icono)}
                </div>
                <div>
                  <h3 className="text-lg font-bold text-white">{plantilla.nombre}</h3>
                  <p className="text-white/70 text-sm">{plantilla.descripcion}</p>
                </div>
              </div>
              {plantilla.certificacion && (
                <div className="flex items-center gap-1 text-green-400">
                  <CheckCircle className="w-4 h-4" />
                  <span className="text-xs">FIFA</span>
                </div>
              )}
            </div>

            {/* Dimensiones principales */}
            <div className="grid grid-cols-2 gap-4 mb-4">
              <div className="text-center">
                <div className="text-xl font-bold text-blue-400">
                  {plantilla.dimensiones.largo}m
                </div>
                <div className="text-xs text-white/70">Largo</div>
              </div>
              <div className="text-center">
                <div className="text-xl font-bold text-green-400">
                  {plantilla.dimensiones.ancho}m
                </div>
                <div className="text-xs text-white/70">Ancho</div>
              </div>
            </div>

            {/* Tolerancia */}
            <div className="mb-4">
              <div className="flex justify-between text-sm">
                <span className="text-white/70">Tolerancia:</span>
                <span className="text-orange-400">±{plantilla.tolerancia}m</span>
              </div>
            </div>

            {/* Acciones */}
            <div className="flex gap-2">
              <motion.button
                onClick={() => onPlantillaSeleccionada(plantilla)}
                className="futbol-btn futbol-btn-primary flex-1 flex items-center justify-center gap-2"
                whileHover={{ scale: 1.02 }}
                whileTap={{ scale: 0.98 }}
              >
                <Ruler className="w-4 h-4" />
                <span>Usar Plantilla</span>
              </motion.button>
              
              <motion.button
                onClick={() => setMostrarDetalles(mostrarDetalles === plantilla.id ? null : plantilla.id)}
                className="futbol-btn futbol-btn-secondary p-2"
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
              >
                {mostrarDetalles === plantilla.id ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
              </motion.button>
              
              <motion.button
                onClick={() => exportarPlantilla(plantilla)}
                className="futbol-btn futbol-btn-success p-2"
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
              >
                <Download className="w-4 h-4" />
              </motion.button>
            </div>

            {/* Detalles expandibles */}
            {mostrarDetalles === plantilla.id && (
              <motion.div
                className="mt-4 p-4 bg-white/5 rounded-lg"
                initial={{ opacity: 0, height: 0 }}
                animate={{ opacity: 1, height: 'auto' }}
                exit={{ opacity: 0, height: 0 }}
              >
                <h4 className="text-sm font-bold text-white mb-3">Dimensiones Detalladas</h4>
                <div className="grid grid-cols-2 gap-2 text-xs">
                  <div className="flex justify-between">
                    <span className="text-white/70">Área Penal:</span>
                    <span className="text-blue-400">{plantilla.dimensiones.areaPenalLargo}m x {plantilla.dimensiones.areaPenalAncho}m</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-white/70">Área Meta:</span>
                    <span className="text-green-400">{plantilla.dimensiones.areaMetaLargo}m x {plantilla.dimensiones.areaMetaAncho}m</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-white/70">Círculo Central:</span>
                    <span className="text-purple-400">{plantilla.dimensiones.radioCirculoCentral}m</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-white/70">Punto Penal:</span>
                    <span className="text-orange-400">{plantilla.dimensiones.puntoPenal}m</span>
                  </div>
                </div>
              </motion.div>
            )}
          </motion.div>
        ))}
      </div>
    </div>
  )
} 