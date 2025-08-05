'use client'

import { useState } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import { Globe, ChevronDown } from 'lucide-react'
import { useLanguage, Language } from '../contexts/LanguageContext'

const languages = [
  { code: 'nl' as Language, name: 'Nederlands', flag: '🇳🇱' },
  { code: 'en' as Language, name: 'English', flag: '🇬🇧' },
  { code: 'es' as Language, name: 'Español', flag: '🇪🇸' }
]

interface LanguageSelectorProps {
  variant?: 'compact' | 'full'
  position?: 'top-right' | 'top-left' | 'bottom-right' | 'bottom-left'
}

export default function LanguageSelector({ 
  variant = 'compact', 
  position = 'top-right' 
}: LanguageSelectorProps) {
  const { language, setLanguage, t } = useLanguage()
  const [isOpen, setIsOpen] = useState(false)

  const currentLanguage = languages.find(lang => lang.code === language)

  const positionClasses = {
    'top-right': 'absolute top-4 right-4',
    'top-left': 'absolute top-4 left-4',
    'bottom-right': 'absolute bottom-4 right-4',
    'bottom-left': 'absolute bottom-4 left-4'
  }

  const dropdownClasses = {
    'top-right': 'right-0 top-12',
    'top-left': 'left-0 top-12',
    'bottom-right': 'right-0 bottom-12',
    'bottom-left': 'left-0 bottom-12'
  }

  if (variant === 'compact') {
    return (
      <div className={`${positionClasses[position]} z-50`}>
        <div className="relative">
          <button
            onClick={() => setIsOpen(!isOpen)}
            className="flex items-center space-x-2 bg-black/70 backdrop-blur-sm text-white px-3 py-2 rounded-lg border border-white/20 hover:bg-black/80 transition-all"
            title={t('settings.language')}
          >
            <Globe className="w-4 h-4" />
            <span className="text-sm font-medium">{currentLanguage?.flag}</span>
            <ChevronDown className={`w-3 h-3 transition-transform ${isOpen ? 'rotate-180' : ''}`} />
          </button>

          <AnimatePresence>
            {isOpen && (
              <motion.div
                className={`absolute ${dropdownClasses[position]} mt-2 bg-black/90 backdrop-blur-sm rounded-lg border border-white/20 overflow-hidden`}
                initial={{ opacity: 0, scale: 0.95, y: -10 }}
                animate={{ opacity: 1, scale: 1, y: 0 }}
                exit={{ opacity: 0, scale: 0.95, y: -10 }}
                transition={{ duration: 0.2 }}
              >
                {languages.map((lang) => (
                  <button
                    key={lang.code}
                    onClick={() => {
                      setLanguage(lang.code)
                      setIsOpen(false)
                    }}
                    className={`w-full flex items-center space-x-3 px-4 py-3 text-left hover:bg-white/10 transition-colors ${
                      language === lang.code ? 'bg-white/20' : ''
                    }`}
                  >
                    <span className="text-lg">{lang.flag}</span>
                    <span className="text-white text-sm font-medium">{lang.name}</span>
                  </button>
                ))}
              </motion.div>
            )}
          </AnimatePresence>
        </div>
      </div>
    )
  }

  // Variant 'full' para configuraciones
  return (
    <div className="space-y-2">
      <label className="text-white text-sm font-medium block">
        {t('settings.language')}
      </label>
      <div className="grid grid-cols-3 gap-2">
        {languages.map((lang) => (
          <button
            key={lang.code}
            onClick={() => setLanguage(lang.code)}
            className={`flex flex-col items-center p-3 rounded-lg border transition-all ${
              language === lang.code
                ? 'bg-blue-500 border-blue-400 shadow-lg'
                : 'bg-white/10 border-white/20 hover:bg-white/20'
            }`}
          >
            <span className="text-2xl mb-1">{lang.flag}</span>
            <span className="text-white text-xs font-medium">{lang.name}</span>
          </button>
        ))}
      </div>
    </div>
  )
}