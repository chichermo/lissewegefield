'use client'

import { useState, useEffect } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import {
  Trophy,
  Target,
  Star,
  Award,
  Zap,
  MapPin,
  Crown,
  Medal,
  CheckCircle,
  Lock,
  Unlock,
  Flame,
  Calendar,
  X
} from 'lucide-react'
import { useLanguage } from '../contexts/LanguageContext'

interface Achievement {
  id: string
  name: string
  description: string
  icon: any
  category: 'measurement' | 'marking' | 'accuracy' | 'speed' | 'consistency'
  difficulty: 'bronze' | 'silver' | 'gold' | 'platinum'
  progress: number
  target: number
  unlocked: boolean
  unlockedAt?: Date
  points: number
  requirements: string[]
  color: string
}

interface UserStats {
  level: number
  totalPoints: number
  measurementCount: number
  markingCount: number
  accuracy: number
  streakDays: number
  totalDistance: number
  fieldsCompleted: number
  timeSpent: number
  lastActivity: Date
}

interface GamificationSystemProps {
  userStats: UserStats
  onStatsUpdate: (stats: UserStats) => void
  isVisible: boolean
}

export default function GamificationSystem({
  userStats,
  onStatsUpdate: _,
  isVisible
}: GamificationSystemProps) {
  const { t } = useLanguage()
  const [showAchievements, setShowAchievements] = useState(false)
  const [newAchievement, setNewAchievement] = useState<Achievement | null>(null)
  const [selectedCategory, setSelectedCategory] = useState<string>('all')

  const achievements: Achievement[] = [
    {
      id: 'first-measurement',
      name: t('achievement.first.measurement'),
      description: t('achievement.first.measurement.desc'),
      icon: Target,
      category: 'measurement',
      difficulty: 'bronze',
      progress: Math.min(userStats.measurementCount, 1),
      target: 1,
      unlocked: userStats.measurementCount >= 1,
      points: 10,
      requirements: [t('achievement.req.complete.measurement')],
      color: 'from-orange-400 to-red-500'
    },
    {
      id: 'precision-master',
      name: t('achievement.precision.master'),
      description: t('achievement.precision.master.desc'),
      icon: Award,
      category: 'accuracy',
      difficulty: 'gold',
      progress: Math.min(userStats.accuracy, 95),
      target: 95,
      unlocked: userStats.accuracy >= 95,
      points: 100,
      requirements: [t('achievement.req.accuracy.95')],
      color: 'from-yellow-400 to-orange-500'
    },
    {
      id: 'speed-demon',
      name: t('achievement.speed.demon'),
      description: t('achievement.speed.demon.desc'),
      icon: Zap,
      category: 'speed',
      difficulty: 'silver',
      progress: Math.min(userStats.measurementCount, 10),
      target: 10,
      unlocked: userStats.measurementCount >= 10,
      points: 50,
      requirements: [t('achievement.req.ten.measurements')],
      color: 'from-cyan-400 to-blue-500'
    },
    {
      id: 'marathon-walker',
      name: t('achievement.marathon.walker'),
      description: t('achievement.marathon.walker.desc'),
      icon: MapPin,
      category: 'measurement',
      difficulty: 'platinum',
      progress: Math.min(userStats.totalDistance, 42195),
      target: 42195,
      unlocked: userStats.totalDistance >= 42195,
      points: 500,
      requirements: [t('achievement.req.walk.marathon')],
      color: 'from-purple-400 to-pink-500'
    },
    {
      id: 'consistency-king',
      name: t('achievement.consistency.king'),
      description: t('achievement.consistency.king.desc'),
      icon: Calendar,
      category: 'consistency',
      difficulty: 'gold',
      progress: Math.min(userStats.streakDays, 30),
      target: 30,
      unlocked: userStats.streakDays >= 30,
      points: 200,
      requirements: [t('achievement.req.thirty.days')],
      color: 'from-green-400 to-emerald-500'
    },
    {
      id: 'field-master',
      name: t('achievement.field.master'),
      description: t('achievement.field.master.desc'),
      icon: Trophy,
      category: 'marking',
      difficulty: 'platinum',
      progress: Math.min(userStats.fieldsCompleted, 100),
      target: 100,
      unlocked: userStats.fieldsCompleted >= 100,
      points: 1000,
      requirements: [t('achievement.req.hundred.fields')],
      color: 'from-yellow-400 to-orange-500'
    }
  ]

  const categories = [
    { id: 'all', name: t('achievement.category.all'), icon: Trophy },
    { id: 'measurement', name: t('achievement.category.measurement'), icon: Target },
    { id: 'marking', name: t('achievement.category.marking'), icon: MapPin },
    { id: 'accuracy', name: t('achievement.category.accuracy'), icon: Award },
    { id: 'speed', name: t('achievement.category.speed'), icon: Zap },
    { id: 'consistency', name: t('achievement.category.consistency'), icon: Calendar }
  ]

  const calculateLevel = (points: number) => {
    return Math.floor(points / 100) + 1
  }

  const getPointsForNextLevel = (currentPoints: number) => {
    const currentLevel = calculateLevel(currentPoints)
    return currentLevel * 100 - currentPoints
  }

  const getDifficultyColor = (difficulty: string) => {
    switch (difficulty) {
      case 'bronze': return 'text-orange-400'
      case 'silver': return 'text-gray-300'
      case 'gold': return 'text-yellow-400'
      case 'platinum': return 'text-purple-400'
      default: return 'text-gray-400'
    }
  }

  const getDifficultyIcon = (difficulty: string) => {
    switch (difficulty) {
      case 'bronze': return Medal
      case 'silver': return Award
      case 'gold': return Trophy
      case 'platinum': return Crown
      default: return Star
    }
  }

  const filteredAchievements = achievements.filter(achievement => 
    selectedCategory === 'all' || achievement.category === selectedCategory
  )

  const unlockedAchievements = achievements.filter(a => a.unlocked)
  const totalAchievements = achievements.length

  // Simular desbloqueo de logros
  useEffect(() => {
    const checkNewAchievements = () => {
      achievements.forEach(achievement => {
        if (!achievement.unlocked && achievement.progress >= achievement.target) {
          setNewAchievement(achievement)
          setTimeout(() => setNewAchievement(null), 5000)
        }
      })
    }

    checkNewAchievements()
  }, [userStats])

  if (!isVisible) return null

  return (
    <>
      {/* Notificación de nuevo logro */}
      <AnimatePresence>
        {newAchievement && (
          <motion.div
            className="fixed top-4 right-4 z-50 bg-gradient-to-r from-yellow-400 to-orange-500 rounded-2xl p-4 shadow-2xl max-w-sm"
            initial={{ opacity: 0, x: 100, scale: 0.8 }}
            animate={{ opacity: 1, x: 0, scale: 1 }}
            exit={{ opacity: 0, x: 100, scale: 0.8 }}
            transition={{ type: 'spring', stiffness: 300, damping: 30 }}
          >
            <div className="flex items-center space-x-3">
              <div className="w-12 h-12 bg-white/20 rounded-full flex items-center justify-center">
                <newAchievement.icon className="w-6 h-6 text-white" />
              </div>
              <div className="flex-1">
                <div className="text-white font-bold text-sm">
                  {t('achievement.unlocked')}!
                </div>
                <div className="text-white/90 text-xs">
                  {newAchievement.name}
                </div>
                <div className="text-white/70 text-xs">
                  +{newAchievement.points} {t('achievement.points')}
                </div>
              </div>
              <Trophy className="w-6 h-6 text-white animate-bounce" />
            </div>
          </motion.div>
        )}
      </AnimatePresence>

      {/* Panel principal de gamificación */}
      <motion.div
        className="bg-white/10 backdrop-blur-sm rounded-2xl p-4 border border-white/20"
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.3 }}
      >
        {/* Header con nivel y puntos */}
        <div className="flex items-center justify-between mb-4">
          <div className="flex items-center space-x-3">
            <div className="w-12 h-12 bg-gradient-to-r from-blue-400 to-purple-500 rounded-full flex items-center justify-center">
              <Crown className="w-6 h-6 text-white" />
            </div>
            <div>
              <div className="text-white font-semibold">
                {t('gamification.level')} {calculateLevel(userStats.totalPoints)}
              </div>
              <div className="text-white/70 text-sm">
                {userStats.totalPoints} {t('gamification.points')}
              </div>
            </div>
          </div>
          
          <motion.button
            onClick={() => setShowAchievements(!showAchievements)}
            className="px-4 py-2 bg-white/20 rounded-lg text-white hover:bg-white/30 transition-colors flex items-center space-x-2"
            whileHover={{ scale: 1.05 }}
            whileTap={{ scale: 0.95 }}
          >
            <Trophy className="w-4 h-4" />
            <span className="text-sm">{t('gamification.achievements')}</span>
          </motion.button>
        </div>

        {/* Progreso hacia siguiente nivel */}
        <div className="mb-4">
          <div className="flex justify-between text-sm text-white/70 mb-1">
            <span>{t('gamification.next.level')}</span>
            <span>{getPointsForNextLevel(userStats.totalPoints)} {t('gamification.points.remaining')}</span>
          </div>
          <div className="w-full h-2 bg-white/20 rounded-full overflow-hidden">
            <motion.div
              className="h-full bg-gradient-to-r from-blue-400 to-purple-500"
              style={{ 
                width: `${((userStats.totalPoints % 100) / 100) * 100}%` 
              }}
              animate={{ 
                width: `${((userStats.totalPoints % 100) / 100) * 100}%` 
              }}
              transition={{ duration: 0.5 }}
            />
          </div>
        </div>

        {/* Estadísticas rápidas */}
        <div className="grid grid-cols-2 lg:grid-cols-4 gap-3 mb-4">
          <div className="bg-white/5 rounded-lg p-3 text-center">
            <Target className="w-5 h-5 text-blue-400 mx-auto mb-1" />
            <div className="text-white font-medium text-sm">
              {userStats.measurementCount}
            </div>
            <div className="text-white/60 text-xs">
              {t('gamification.measurements')}
            </div>
          </div>
          
          <div className="bg-white/5 rounded-lg p-3 text-center">
            <MapPin className="w-5 h-5 text-green-400 mx-auto mb-1" />
            <div className="text-white font-medium text-sm">
              {userStats.markingCount}
            </div>
            <div className="text-white/60 text-xs">
              {t('gamification.markings')}
            </div>
          </div>
          
          <div className="bg-white/5 rounded-lg p-3 text-center">
            <Award className="w-5 h-5 text-yellow-400 mx-auto mb-1" />
            <div className="text-white font-medium text-sm">
              {userStats.accuracy.toFixed(1)}%
            </div>
            <div className="text-white/60 text-xs">
              {t('gamification.accuracy')}
            </div>
          </div>
          
          <div className="bg-white/5 rounded-lg p-3 text-center">
            <Flame className="w-5 h-5 text-orange-400 mx-auto mb-1" />
            <div className="text-white font-medium text-sm">
              {userStats.streakDays}
            </div>
            <div className="text-white/60 text-xs">
              {t('gamification.streak')}
            </div>
          </div>
        </div>

        {/* Logros recientes */}
        <div className="flex items-center justify-between">
          <div className="text-white/80 text-sm">
            {t('gamification.achievements')}: {unlockedAchievements.length}/{totalAchievements}
          </div>
          <div className="flex space-x-1">
            {unlockedAchievements.slice(-3).map(achievement => {
              const DifficultyIcon = getDifficultyIcon(achievement.difficulty)
              return (
                <motion.div
                  key={achievement.id}
                  className={`w-6 h-6 rounded-full bg-gradient-to-r ${achievement.color} flex items-center justify-center`}
                  whileHover={{ scale: 1.2 }}
                  title={achievement.name}
                >
                  <DifficultyIcon className="w-3 h-3 text-white" />
                </motion.div>
              )
            })}
          </div>
        </div>
      </motion.div>

      {/* Panel expandido de logros */}
      <AnimatePresence>
        {showAchievements && (
          <motion.div
            className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/50 backdrop-blur-sm"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            onClick={() => setShowAchievements(false)}
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
                      {t('gamification.achievements')}
                    </h2>
                    <p className="text-white/60 text-sm">
                      {unlockedAchievements.length}/{totalAchievements} {t('gamification.unlocked')}
                    </p>
                  </div>
                </div>
                <button
                  onClick={() => setShowAchievements(false)}
                  className="p-2 hover:bg-white/10 rounded-lg text-white/60"
                >
                  <X className="w-5 h-5" />
                </button>
              </div>

              <div className="flex h-[calc(90vh-200px)]">
                {/* Categorías */}
                <div className="w-1/4 border-r border-white/10 p-4">
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
                </div>

                {/* Lista de logros */}
                <div className="flex-1 p-6 overflow-y-auto">
                  <div className="grid grid-cols-1 lg:grid-cols-2 gap-4">
                    {filteredAchievements.map(achievement => {
                      const DifficultyIcon = getDifficultyIcon(achievement.difficulty)
                      return (
                        <motion.div
                          key={achievement.id}
                          className={`relative overflow-hidden rounded-xl border transition-all ${
                            achievement.unlocked
                              ? 'border-white/20 bg-white/5'
                              : 'border-white/10 bg-white/[0.02] opacity-60'
                          }`}
                          whileHover={{ scale: achievement.unlocked ? 1.02 : 1 }}
                        >
                          {/* Header */}
                          <div className={`h-16 bg-gradient-to-r ${achievement.color} flex items-center justify-center relative`}>
                            <achievement.icon className="w-6 h-6 text-white" />
                            {!achievement.unlocked && (
                              <div className="absolute inset-0 bg-black/50 flex items-center justify-center">
                                <Lock className="w-5 h-5 text-white/70" />
                              </div>
                            )}
                          </div>

                          <div className="p-4">
                            <div className="flex items-center justify-between mb-2">
                              <h4 className="text-white font-medium">
                                {achievement.name}
                              </h4>
                              <div className="flex items-center space-x-1">
                                <DifficultyIcon className={`w-4 h-4 ${getDifficultyColor(achievement.difficulty)}`} />
                                <span className="text-xs text-white/60">
                                  {achievement.points}pt
                                </span>
                              </div>
                            </div>
                            
                            <p className="text-white/70 text-sm mb-3">
                              {achievement.description}
                            </p>

                            {/* Progreso */}
                            <div className="mb-3">
                              <div className="flex justify-between text-xs text-white/60 mb-1">
                                <span>{t('gamification.progress')}</span>
                                <span>{achievement.progress}/{achievement.target}</span>
                              </div>
                              <div className="w-full h-1 bg-white/20 rounded-full overflow-hidden">
                                <motion.div
                                  className={`h-full bg-gradient-to-r ${achievement.color}`}
                                  style={{ width: `${(achievement.progress / achievement.target) * 100}%` }}
                                  animate={{ width: `${(achievement.progress / achievement.target) * 100}%` }}
                                  transition={{ duration: 0.5 }}
                                />
                              </div>
                            </div>

                            {/* Requisitos */}
                            <div className="space-y-1">
                              {achievement.requirements.map(req => (
                                <div key={req} className="flex items-center space-x-2">
                                  {achievement.unlocked ? (
                                    <CheckCircle className="w-3 h-3 text-green-400" />
                                  ) : (
                                    <div className="w-3 h-3 border border-white/30 rounded-full" />
                                  )}
                                  <span className="text-xs text-white/70">{req}</span>
                                </div>
                              ))}
                            </div>

                            {achievement.unlocked && achievement.unlockedAt && (
                              <div className="mt-3 pt-3 border-t border-white/10">
                                <div className="flex items-center space-x-2 text-green-400">
                                  <Unlock className="w-3 h-3" />
                                  <span className="text-xs">
                                    {t('gamification.unlocked.on')} {achievement.unlockedAt.toLocaleDateString()}
                                  </span>
                                </div>
                              </div>
                            )}
                          </div>
                        </motion.div>
                      )
                    })}
                  </div>
                </div>
              </div>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>
    </>
  )
}