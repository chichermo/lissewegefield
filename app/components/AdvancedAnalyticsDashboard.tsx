'use client'

import { useState, useEffect } from 'react'
import { motion } from 'framer-motion'
import {
  BarChart3,
  TrendingUp,
  TrendingDown,
  Target,
  Clock,
  MapPin,
  Users,
  Calendar,
  Award,
  Activity,
  Zap,
  Eye,
  Download,
  RefreshCw,
  Filter,
  ArrowUp,
  ArrowDown
} from 'lucide-react'
import { useLanguage } from '../contexts/LanguageContext'

interface AnalyticsData {
  measurements: {
    total: number
    thisWeek: number
    thisMonth: number
    avgAccuracy: number
    avgDuration: number
    trend: 'up' | 'down' | 'stable'
  }
  markings: {
    total: number
    completed: number
    inProgress: number
    accuracy: number
    trend: 'up' | 'down' | 'stable'
  }
  performance: {
    gpsAccuracy: number
    speedAvg: number
    errorRate: number
    efficiency: number
  }
  usage: {
    totalTime: number
    avgSession: number
    peakHour: number
    activeUsers: number
  }
  compliance: {
    fifa: number
    uefa: number
    local: number
    overall: number
  }
}

interface AdvancedAnalyticsDashboardProps {
  data: AnalyticsData
  timeRange: '7d' | '30d' | '90d' | '1y'
  onTimeRangeChange: (range: '7d' | '30d' | '90d' | '1y') => void
}

export default function AdvancedAnalyticsDashboard({
  data,
  timeRange,
  onTimeRangeChange
}: AdvancedAnalyticsDashboardProps) {
  const { t } = useLanguage()
  const [selectedMetric, setSelectedMetric] = useState<string>('overview')
  const [refreshing, setRefreshing] = useState(false)

  const timeRanges = [
    { id: '7d', label: t('analytics.7days') },
    { id: '30d', label: t('analytics.30days') },
    { id: '90d', label: t('analytics.90days') },
    { id: '1y', label: t('analytics.1year') }
  ]

  const getTrendIcon = (trend: 'up' | 'down' | 'stable') => {
    switch (trend) {
      case 'up': return <ArrowUp className="w-4 h-4 text-green-400" />
      case 'down': return <ArrowDown className="w-4 h-4 text-red-400" />
      default: return <div className="w-4 h-4" />
    }
  }

  const getTrendColor = (trend: 'up' | 'down' | 'stable') => {
    switch (trend) {
      case 'up': return 'text-green-400'
      case 'down': return 'text-red-400'
      default: return 'text-gray-400'
    }
  }

  const handleRefresh = async () => {
    setRefreshing(true)
    // Simular actualización de datos
    await new Promise(resolve => setTimeout(resolve, 1000))
    setRefreshing(false)
  }

  const MetricCard = ({ 
    title, 
    value, 
    subtitle, 
    icon: Icon, 
    trend, 
    color,
    onClick 
  }: {
    title: string
    value: string | number
    subtitle: string
    icon: any
    trend?: 'up' | 'down' | 'stable'
    color: string
    onClick?: () => void
  }) => (
    <motion.div
      className={`bg-white/5 backdrop-blur-sm rounded-xl p-4 border border-white/10 cursor-pointer transition-all hover:bg-white/10 ${
        onClick ? 'hover:scale-105' : ''
      }`}
      whileHover={{ scale: onClick ? 1.02 : 1 }}
      whileTap={{ scale: onClick ? 0.98 : 1 }}
      onClick={onClick}
    >
      <div className="flex items-center justify-between mb-3">
        <div className={`p-2 rounded-lg bg-gradient-to-r ${color}`}>
          <Icon className="w-5 h-5 text-white" />
        </div>
        {trend && getTrendIcon(trend)}
      </div>
      
      <div className="space-y-1">
        <div className="text-2xl font-bold text-white">
          {value}
        </div>
        <div className="text-white/70 text-sm">
          {title}
        </div>
        <div className={`text-xs ${trend ? getTrendColor(trend) : 'text-white/50'}`}>
          {subtitle}
        </div>
      </div>
    </motion.div>
  )

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h2 className="text-2xl font-bold text-white mb-2">
            {t('analytics.dashboard')}
          </h2>
          <p className="text-white/60">
            {t('analytics.subtitle')}
          </p>
        </div>
        
        <div className="flex items-center space-x-3">
          {/* Selector de tiempo */}
          <div className="flex bg-white/10 rounded-lg p-1">
            {timeRanges.map(range => (
              <motion.button
                key={range.id}
                onClick={() => onTimeRangeChange(range.id as any)}
                className={`px-3 py-1 rounded text-sm transition-colors ${
                  timeRange === range.id
                    ? 'bg-blue-600 text-white'
                    : 'text-white/70 hover:text-white'
                }`}
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
              >
                {range.label}
              </motion.button>
            ))}
          </div>

          {/* Botón refrescar */}
          <motion.button
            onClick={handleRefresh}
            disabled={refreshing}
            className="p-2 bg-white/10 rounded-lg text-white hover:bg-white/20 transition-colors"
            whileHover={{ scale: 1.05 }}
            whileTap={{ scale: 0.95 }}
          >
            <RefreshCw className={`w-5 h-5 ${refreshing ? 'animate-spin' : ''}`} />
          </motion.button>

          {/* Botón exportar */}
          <motion.button
            className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors flex items-center space-x-2"
            whileHover={{ scale: 1.05 }}
            whileTap={{ scale: 0.95 }}
          >
            <Download className="w-4 h-4" />
            <span>{t('analytics.export')}</span>
          </motion.button>
        </div>
      </div>

      {/* Métricas principales */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
        <MetricCard
          title={t('analytics.total.measurements')}
          value={data.measurements.total}
          subtitle={`+${data.measurements.thisWeek} ${t('analytics.this.week')}`}
          icon={Target}
          trend={data.measurements.trend}
          color="from-blue-400 to-cyan-500"
          onClick={() => setSelectedMetric('measurements')}
        />
        
        <MetricCard
          title={t('analytics.avg.accuracy')}
          value={`${data.measurements.avgAccuracy}%`}
          subtitle={t('analytics.measurement.accuracy')}
          icon={Award}
          trend={data.measurements.trend}
          color="from-green-400 to-emerald-500"
        />
        
        <MetricCard
          title={t('analytics.total.markings')}
          value={data.markings.total}
          subtitle={`${data.markings.completed} ${t('analytics.completed')}`}
          icon={MapPin}
          trend={data.markings.trend}
          color="from-purple-400 to-pink-500"
          onClick={() => setSelectedMetric('markings')}
        />
        
        <MetricCard
          title={t('analytics.avg.duration')}
          value={`${data.measurements.avgDuration}min`}
          subtitle={t('analytics.per.session')}
          icon={Clock}
          color="from-orange-400 to-red-500"
        />
      </div>

      {/* Gráficos de rendimiento */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Gráfico de precisión */}
        <motion.div
          className="bg-white/5 backdrop-blur-sm rounded-xl p-6 border border-white/10"
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.1 }}
        >
          <div className="flex items-center justify-between mb-4">
            <h3 className="text-lg font-semibold text-white">
              {t('analytics.performance.metrics')}
            </h3>
            <BarChart3 className="w-5 h-5 text-blue-400" />
          </div>
          
          <div className="space-y-4">
            {/* GPS Accuracy */}
            <div>
              <div className="flex justify-between text-sm text-white/70 mb-2">
                <span>{t('analytics.gps.accuracy')}</span>
                <span>{data.performance.gpsAccuracy}%</span>
              </div>
              <div className="w-full h-2 bg-white/20 rounded-full overflow-hidden">
                <motion.div
                  className="h-full bg-gradient-to-r from-green-400 to-emerald-500"
                  initial={{ width: 0 }}
                  animate={{ width: `${data.performance.gpsAccuracy}%` }}
                  transition={{ duration: 0.8, delay: 0.2 }}
                />
              </div>
            </div>

            {/* Speed Average */}
            <div>
              <div className="flex justify-between text-sm text-white/70 mb-2">
                <span>{t('analytics.speed.avg')}</span>
                <span>{data.performance.speedAvg} m/s</span>
              </div>
              <div className="w-full h-2 bg-white/20 rounded-full overflow-hidden">
                <motion.div
                  className="h-full bg-gradient-to-r from-blue-400 to-cyan-500"
                  initial={{ width: 0 }}
                  animate={{ width: `${(data.performance.speedAvg / 5) * 100}%` }}
                  transition={{ duration: 0.8, delay: 0.3 }}
                />
              </div>
            </div>

            {/* Error Rate */}
            <div>
              <div className="flex justify-between text-sm text-white/70 mb-2">
                <span>{t('analytics.error.rate')}</span>
                <span>{data.performance.errorRate}%</span>
              </div>
              <div className="w-full h-2 bg-white/20 rounded-full overflow-hidden">
                <motion.div
                  className="h-full bg-gradient-to-r from-red-400 to-orange-500"
                  initial={{ width: 0 }}
                  animate={{ width: `${data.performance.errorRate}%` }}
                  transition={{ duration: 0.8, delay: 0.4 }}
                />
              </div>
            </div>

            {/* Efficiency */}
            <div>
              <div className="flex justify-between text-sm text-white/70 mb-2">
                <span>{t('analytics.efficiency')}</span>
                <span>{data.performance.efficiency}%</span>
              </div>
              <div className="w-full h-2 bg-white/20 rounded-full overflow-hidden">
                <motion.div
                  className="h-full bg-gradient-to-r from-purple-400 to-pink-500"
                  initial={{ width: 0 }}
                  animate={{ width: `${data.performance.efficiency}%` }}
                  transition={{ duration: 0.8, delay: 0.5 }}
                />
              </div>
            </div>
          </div>
        </motion.div>

        {/* Cumplimiento FIFA */}
        <motion.div
          className="bg-white/5 backdrop-blur-sm rounded-xl p-6 border border-white/10"
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.2 }}
        >
          <div className="flex items-center justify-between mb-4">
            <h3 className="text-lg font-semibold text-white">
              {t('analytics.fifa.compliance')}
            </h3>
            <Award className="w-5 h-5 text-yellow-400" />
          </div>
          
          <div className="space-y-4">
            {/* FIFA */}
            <div className="flex items-center justify-between">
              <div className="flex items-center space-x-3">
                <div className="w-8 h-8 bg-gradient-to-r from-yellow-400 to-orange-500 rounded-full flex items-center justify-center">
                  <Award className="w-4 h-4 text-white" />
                </div>
                <span className="text-white">FIFA</span>
              </div>
              <div className="text-right">
                <div className="text-white font-semibold">
                  {data.compliance.fifa}%
                </div>
                <div className="text-xs text-white/60">
                  {t('analytics.compliant')}
                </div>
              </div>
            </div>

            {/* UEFA */}
            <div className="flex items-center justify-between">
              <div className="flex items-center space-x-3">
                <div className="w-8 h-8 bg-gradient-to-r from-blue-400 to-purple-500 rounded-full flex items-center justify-center">
                  <Target className="w-4 h-4 text-white" />
                </div>
                <span className="text-white">UEFA</span>
              </div>
              <div className="text-right">
                <div className="text-white font-semibold">
                  {data.compliance.uefa}%
                </div>
                <div className="text-xs text-white/60">
                  {t('analytics.compliant')}
                </div>
              </div>
            </div>

            {/* Local */}
            <div className="flex items-center justify-between">
              <div className="flex items-center space-x-3">
                <div className="w-8 h-8 bg-gradient-to-r from-green-400 to-emerald-500 rounded-full flex items-center justify-center">
                  <MapPin className="w-4 h-4 text-white" />
                </div>
                <span className="text-white">{t('analytics.local')}</span>
              </div>
              <div className="text-right">
                <div className="text-white font-semibold">
                  {data.compliance.local}%
                </div>
                <div className="text-xs text-white/60">
                  {t('analytics.compliant')}
                </div>
              </div>
            </div>

            {/* Overall */}
            <div className="pt-3 border-t border-white/10">
              <div className="flex items-center justify-between">
                <span className="text-white font-medium">
                  {t('analytics.overall')}
                </span>
                <div className="text-right">
                  <div className="text-white font-bold text-lg">
                    {data.compliance.overall}%
                  </div>
                  <div className="text-xs text-green-400">
                    {t('analytics.excellent')}
                  </div>
                </div>
              </div>
            </div>
          </div>
        </motion.div>
      </div>

      {/* Estadísticas de uso */}
      <motion.div
        className="bg-white/5 backdrop-blur-sm rounded-xl p-6 border border-white/10"
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.3 }}
      >
        <div className="flex items-center justify-between mb-6">
          <h3 className="text-lg font-semibold text-white">
            {t('analytics.usage.statistics')}
          </h3>
          <Activity className="w-5 h-5 text-cyan-400" />
        </div>

        <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
          <div className="text-center">
            <div className="w-16 h-16 bg-gradient-to-r from-blue-400 to-cyan-500 rounded-full flex items-center justify-center mx-auto mb-3">
              <Clock className="w-8 h-8 text-white" />
            </div>
            <div className="text-2xl font-bold text-white mb-1">
              {Math.round(data.usage.totalTime / 60)}h
            </div>
            <div className="text-white/60 text-sm">
              {t('analytics.total.time')}
            </div>
          </div>

          <div className="text-center">
            <div className="w-16 h-16 bg-gradient-to-r from-green-400 to-emerald-500 rounded-full flex items-center justify-center mx-auto mb-3">
              <TrendingUp className="w-8 h-8 text-white" />
            </div>
            <div className="text-2xl font-bold text-white mb-1">
              {data.usage.avgSession}min
            </div>
            <div className="text-white/60 text-sm">
              {t('analytics.avg.session')}
            </div>
          </div>

          <div className="text-center">
            <div className="w-16 h-16 bg-gradient-to-r from-purple-400 to-pink-500 rounded-full flex items-center justify-center mx-auto mb-3">
              <Zap className="w-8 h-8 text-white" />
            </div>
            <div className="text-2xl font-bold text-white mb-1">
              {data.usage.peakHour}:00
            </div>
            <div className="text-white/60 text-sm">
              {t('analytics.peak.hour')}
            </div>
          </div>

          <div className="text-center">
            <div className="w-16 h-16 bg-gradient-to-r from-orange-400 to-red-500 rounded-full flex items-center justify-center mx-auto mb-3">
              <Users className="w-8 h-8 text-white" />
            </div>
            <div className="text-2xl font-bold text-white mb-1">
              {data.usage.activeUsers}
            </div>
            <div className="text-white/60 text-sm">
              {t('analytics.active.users')}
            </div>
          </div>
        </div>
      </motion.div>

      {/* Insights y recomendaciones */}
      <motion.div
        className="bg-gradient-to-r from-blue-600/20 to-purple-600/20 backdrop-blur-sm rounded-xl p-6 border border-blue-500/30"
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.4 }}
      >
        <div className="flex items-center space-x-3 mb-4">
          <Eye className="w-6 h-6 text-blue-400" />
          <h3 className="text-lg font-semibold text-white">
            {t('analytics.insights')}
          </h3>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div className="bg-white/10 rounded-lg p-4">
            <div className="flex items-center space-x-2 mb-2">
              <TrendingUp className="w-4 h-4 text-green-400" />
              <span className="text-green-400 font-medium text-sm">
                {t('analytics.positive.trend')}
              </span>
            </div>
            <p className="text-white/80 text-sm">
              {t('analytics.insight.accuracy.improving')}
            </p>
          </div>

          <div className="bg-white/10 rounded-lg p-4">
            <div className="flex items-center space-x-2 mb-2">
              <Target className="w-4 h-4 text-blue-400" />
              <span className="text-blue-400 font-medium text-sm">
                {t('analytics.recommendation')}
              </span>
            </div>
            <p className="text-white/80 text-sm">
              {t('analytics.recommendation.calibration')}
            </p>
          </div>
        </div>
      </motion.div>
    </div>
  )
}