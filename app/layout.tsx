import type { Metadata } from 'next'
import './globals.css'

export const metadata: Metadata = {
  title: 'Cancha Inteligente Pro',
  description: 'Sistema profesional de medición y marcado de canchas FIFA',
  viewport: 'width=device-width, initial-scale=1',
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
        <meta name="description" content="Sistema profesional de medición y marcado de canchas FIFA" />
        <meta name="viewport" content="width=device-width, initial-scale=1" />
      </head>
      <body>{children}</body>
    </html>
  )
}
