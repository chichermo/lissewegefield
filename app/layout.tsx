import type { Metadata } from 'next'
import './globals.css'

export const metadata: Metadata = {
  title: 'Cancha Inteligente Pro',
  description: 'Aplicación profesional para medición y marcado de campos deportivos',
  viewport: 'width=device-width, initial-scale=1, maximum-scale=1, user-scalable=no',
  manifest: '/manifest.json',
  themeColor: '#22c55e',
  appleWebApp: {
    capable: true,
    statusBarStyle: 'default',
    title: 'CanchaPro'
  },
  formatDetection: {
    telephone: false
  }
}

export default function RootLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return (
    <html lang="es">
      <head>
        <title>Cancha Inteligente Pro</title>
        <meta name="description" content="Aplicación profesional para medición y marcado de campos deportivos" />
        <meta name="viewport" content="width=device-width, initial-scale=1, maximum-scale=1, user-scalable=no" />
        <meta name="theme-color" content="#22c55e" />
        <meta name="apple-mobile-web-app-capable" content="yes" />
        <meta name="apple-mobile-web-app-status-bar-style" content="default" />
        <meta name="apple-mobile-web-app-title" content="CanchaPro" />
        <meta name="format-detection" content="telephone=no" />
        <link rel="manifest" href="/manifest.json" />
        <link rel="apple-touch-icon" href="/icon-192x192.png" />
        <link rel="icon" type="image/png" sizes="192x192" href="/icon-192x192.png" />
        <link rel="icon" type="image/png" sizes="512x512" href="/icon-512x512.png" />
      </head>
      <body>{children}</body>
    </html>
  )
}
