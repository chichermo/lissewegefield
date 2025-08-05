'use client'

import { useState, useEffect } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import { 
  Trophy, 
  Users, 
  Calendar, 
  Ruler, 
  CheckCircle, 
  Star,
  Target,
  Zap,
  X,
  Download
} from 'lucide-react'
import { useLanguage } from '../contexts/LanguageContext'

interface FIFATemplate {
  id: string
  name: string
  category: 'professional' | 'youth' | 'futsal' | 'training'
  dimensions: {
    length: { min: number; max: number; ideal: number }
    width: { min: number; max: number; ideal: number }
    goalArea: { length: number; width: number }
    penaltyArea: { length: number; width: number }
    centerCircle: { radius: number }
    goalWidth: number
    goalHeight: number
  }
  features: string[]
  description: string
  popularity: number
  official: boolean
  icon: any
  color: string
}

interface FIFATemplateSelectorProps {
  isOpen: boolean
  onClose: () => void
  onTemplateSelect: (template: FIFATemplate) => void
  currentTemplate?: FIFATemplate | null
}

export default function FIFATemplateSelector({
  isOpen,
  onClose,
  onTemplateSelect,
  currentTemplate
}: FIFATemplateSelectorProps) {
  const { t } = useLanguage()
  const [selectedCategory, setSelectedCategory] = useState<string>('professional')
  const [searchTerm, setSearchTerm] = useState('')

  const templates: FIFATemplate[] = [
    {
      id: 'fifa-11v11',
      name: t('fifa.template.11v11'),
      category: 'professional',
      dimensions: {
        length: { min: 90, max: 120, ideal: 105 },
        width: { min: 45, max: 90, ideal: 68 },
        goalArea: { length: 18.32, width: 5.5 },
        penaltyArea: { length: 40.32, width: 16.5 },
        centerCircle: { radius: 9.15 },
        goalWidth: 7.32,
        goalHeight: 2.44
      },
      features: [
        t('fifa.feature.official'),
        t('fifa.feature.professional'),
        t('fifa.feature.worldcup'),
        t('fifa.feature.uefa')
      ],
      description: t('fifa.template.11v11.desc'),
      popularity: 100,
      official: true,
      icon: Trophy,
      color: 'from-yellow-400 to-orange-500'
    },
    {
      id: 'fifa-7v7',
      name: t('fifa.template.7v7'),
      category: 'youth',
      dimensions: {
        length: { min: 50, max: 65, ideal: 60 },
        width: { min: 35, max: 45, ideal: 40 },
        goalArea: { length: 12, width: 4 },
        penaltyArea: { length: 24, width: 10 },
        centerCircle: { radius: 6 },
        goalWidth: 5,
        goalHeight: 2
      },
      features: [
        t('fifa.feature.youth'),
        t('fifa.feature.development'),
        t('fifa.feature.schools'),
        t('fifa.feature.grassroots')
      ],
      description: t('fifa.template.7v7.desc'),
      popularity: 85,
      official: true,
      icon: Users,
      color: 'from-green-400 to-blue-500'
    },
    {
      id: 'futsal-fifa',
      name: t('fifa.template.futsal'),
      category: 'futsal',
      dimensions: {
        length: { min: 25, max: 42, ideal: 40 },
        width: { min: 16, max: 25, ideal: 20 },
        goalArea: { length: 6, width: 3 },
        penaltyArea: { length: 6, width: 3 },
        centerCircle: { radius: 3 },
        goalWidth: 3,
        goalHeight: 2
      },
      features: [
        t('fifa.feature.indoor'),
        t('fifa.feature.smallsided'),
        t('fifa.feature.technique'),
        t('fifa.feature.fast')
      ],
      description: t('fifa.template.futsal.desc'),
      popularity: 70,
      official: true,
      icon: Zap,
      color: 'from-purple-400 to-pink-500'
    },
    {
      id: 'training-field',
      name: t('fifa.template.training'),
      category: 'training',
      dimensions: {
        length: { min: 60, max: 80, ideal: 70 },
        width: { min: 40, max: 60, ideal: 50 },
        goalArea: { length: 15, width: 5 },
        penaltyArea: { length: 30, width: 12 },
        centerCircle: { radius: 7 },
        goalWidth: 6,
        goalHeight: 2.2
      },
      features: [
        t('fifa.feature.training'),
        t('fifa.feature.practice'),
        t('fifa.feature.flexible'),
        t('fifa.feature.multipurpose')
      ],
      description: t('fifa.template.training.desc'),
      popularity: 60,
      official: false,
      icon: Target,
      color: 'from-cyan-400 to-blue-600'
    }
  ]

  const categories = [
    { id: 'professional', name: t('fifa.category.professional'), icon: Trophy },
    { id: 'youth', name: t('fifa.category.youth'), icon: Users },
    { id: 'futsal', name: t('fifa.category.futsal'), icon: Zap },
    { id: 'training', name: t('fifa.category.training'), icon: Target }
  ]

  const filteredTemplates = templates.filter(template => {
    const matchesCategory = selectedCategory === 'all' || template.category === selectedCategory
    const matchesSearch = template.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         template.description.toLowerCase().includes(searchTerm.toLowerCase())
    return matchesCategory && matchesSearch
  })

  const handleTemplateSelect = (template: FIFATemplate) => {
    onTemplateSelect(template)
    onClose()
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
          className="bg-gray-900 rounded-2xl max-w-4xl w-full max-h-[90vh] overflow-hidden"
          initial={{ scale: 0.9, opacity: 0 }}
          animate={{ scale: 1, opacity: 1 }}
          exit={{ scale: 0.9, opacity: 0 }}
          onClick={(e) => e.stopPropagation()}
        >
          {/* Header */}
          <div className="flex items-center justify-between p-6 border-b border-white/10">
            <div className="flex items-center space-x-3">
              <div className="p-2 bg-gradient-to-r from-yellow-400 to-orange-500 rounded-lg">
                <Trophy className="w-6 h-6 text-white" />
              </div>
              <div>
                <h2 className="text-xl font-bold text-white">
                  {t('fifa.templates.title')}
                </h2>
                <p className="text-white/60 text-sm">
                  {t('fifa.templates.subtitle')}
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
            {/* Sidebar de categorías */}
            <div className="w-64 border-r border-white/10 p-4">
              <div className="space-y-2">
                {categories.map(category => (
                  <motion.button
                    key={category.id}
                    onClick={() => setSelectedCategory(category.id)}
                    className={`w-full flex items-center space-x-3 p-3 rounded-lg text-left transition-colors ${
                      selectedCategory === category.id
                        ? 'bg-blue-600 text-white'
                        : 'hover:bg-white/5 text-white/70'
                    }`}
                    whileHover={{ scale: 1.02 }}
                    whileTap={{ scale: 0.98 }}
                  >
                    <category.icon className="w-5 h-5" />
                    <span className="font-medium">{category.name}</span>
                  </motion.button>
                ))}
              </div>

              {/* Búsqueda */}
              <div className="mt-6">
                <input
                  type="text"
                  placeholder={t('fifa.search.placeholder')}
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                  className="w-full px-3 py-2 bg-white/5 border border-white/10 rounded-lg text-white placeholder-white/40 focus:outline-none focus:border-blue-500"
                />
              </div>
            </div>

            {/* Grid de plantillas */}
            <div className="flex-1 p-6 overflow-y-auto">
              <div className="grid grid-cols-1 lg:grid-cols-2 gap-4">
                {filteredTemplates.map(template => (
                  <motion.div
                    key={template.id}
                    className={`relative overflow-hidden rounded-xl border transition-all cursor-pointer ${
                      currentTemplate?.id === template.id
                        ? 'border-blue-500 bg-blue-600/10'
                        : 'border-white/10 hover:border-white/20 bg-white/5 hover:bg-white/10'
                    }`}
                    whileHover={{ scale: 1.02 }}
                    whileTap={{ scale: 0.98 }}
                    onClick={() => handleTemplateSelect(template)}
                  >
                    {/* Badge oficial */}
                    {template.official && (
                      <div className="absolute top-3 right-3 z-10">
                        <div className="flex items-center space-x-1 px-2 py-1 bg-yellow-500 rounded-full">
                          <Star className="w-3 h-3 text-white" />
                          <span className="text-xs font-medium text-white">
                            {t('fifa.official')}
                          </span>
                        </div>
                      </div>
                    )}

                    {/* Header de la tarjeta */}
                    <div className={`h-20 bg-gradient-to-r ${template.color} flex items-center justify-center`}>
                      <template.icon className="w-8 h-8 text-white" />
                    </div>

                    <div className="p-4">
                      <h3 className="text-lg font-semibold text-white mb-2">
                        {template.name}
                      </h3>
                      <p className="text-white/60 text-sm mb-3 line-clamp-2">
                        {template.description}
                      </p>

                      {/* Dimensiones principales */}
                      <div className="space-y-2 mb-3">
                        <div className="flex justify-between text-sm">
                          <span className="text-white/70">{t('fifa.length')}:</span>
                          <span className="text-white font-medium">
                            {template.dimensions.length.ideal}m
                          </span>
                        </div>
                        <div className="flex justify-between text-sm">
                          <span className="text-white/70">{t('fifa.width')}:</span>
                          <span className="text-white font-medium">
                            {template.dimensions.width.ideal}m
                          </span>
                        </div>
                      </div>

                      {/* Características */}
                      <div className="flex flex-wrap gap-1 mb-3">
                        {template.features.slice(0, 2).map(feature => (
                          <span
                            key={feature}
                            className="px-2 py-1 bg-white/10 rounded text-xs text-white/80"
                          >
                            {feature}
                          </span>
                        ))}
                        {template.features.length > 2 && (
                          <span className="px-2 py-1 bg-white/10 rounded text-xs text-white/60">
                            +{template.features.length - 2}
                          </span>
                        )}
                      </div>

                      {/* Popularidad */}
                      <div className="flex items-center justify-between">
                        <div className="flex items-center space-x-1">
                          <div className="w-20 h-1 bg-white/20 rounded-full overflow-hidden">
                            <div
                              className={`h-full bg-gradient-to-r ${template.color} transition-all`}
                              style={{ width: `${template.popularity}%` }}
                            />
                          </div>
                          <span className="text-xs text-white/60">
                            {template.popularity}%
                          </span>
                        </div>

                        {currentTemplate?.id === template.id && (
                          <CheckCircle className="w-5 h-5 text-green-400" />
                        )}
                      </div>
                    </div>
                  </motion.div>
                ))}
              </div>

              {filteredTemplates.length === 0 && (
                <div className="text-center py-12">
                  <div className="text-white/40 mb-2">
                    {t('fifa.no.results')}
                  </div>
                  <button
                    onClick={() => {
                      setSearchTerm('')
                      setSelectedCategory('professional')
                    }}
                    className="text-blue-400 hover:text-blue-300 text-sm"
                  >
                    {t('fifa.clear.filters')}
                  </button>
                </div>
              )}
            </div>
          </div>

          {/* Footer */}
          <div className="flex items-center justify-between p-6 border-t border-white/10">
            <div className="text-sm text-white/60">
              {filteredTemplates.length} {t('fifa.templates.found')}
            </div>
            <div className="flex space-x-3">
              <motion.button
                onClick={onClose}
                className="px-4 py-2 text-white/70 hover:text-white transition-colors"
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
              >
                {t('fifa.cancel')}
              </motion.button>
              {currentTemplate && (
                <motion.button
                  onClick={() => handleTemplateSelect(currentTemplate)}
                  className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors"
                  whileHover={{ scale: 1.05 }}
                  whileTap={{ scale: 0.95 }}
                >
                  {t('fifa.apply.template')}
                </motion.button>
              )}
            </div>
          </div>
        </motion.div>
      </motion.div>
    </AnimatePresence>
  )
}