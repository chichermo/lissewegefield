/** @type {import('next').NextConfig} */
const nextConfig = {
  // Configuración de imágenes
  images: {
    domains: ['localhost'],
    formats: ['image/webp', 'image/avif'],
    deviceSizes: [640, 750, 828, 1080, 1200, 1920, 2048, 3840],
    imageSizes: [16, 32, 48, 64, 96, 128, 256, 384],
  },

  // Configuración de compilación
  experimental: {
    optimizeCss: true,
    optimizePackageImports: ['lucide-react', 'framer-motion'],
  },

  // Configuración de webpack
  webpack: (config, { isServer }) => {
    // Optimizaciones para el cliente
    if (!isServer) {
      config.resolve.fallback = {
        ...config.resolve.fallback,
        fs: false,
        net: false,
        tls: false,
      }
    }

    return config
  },

  // Configuración de headers
  async headers() {
    return [
      {
        source: '/(.*)',
        headers: [
          {
            key: 'X-Frame-Options',
            value: 'DENY',
          },
          {
            key: 'X-Content-Type-Options',
            value: 'nosniff',
          },
          {
            key: 'Referrer-Policy',
            value: 'origin-when-cross-origin',
          },
        ],
      },
    ]
  },

  // Configuración de redirecciones
  async redirects() {
    return [
      // Eliminar la redirección problemática
      // {
      //   source: '/',
      //   destination: '/app',
      //   permanent: false,
      // },
    ]
  },

  // Configuración de compresión
  compress: true,

  // Configuración de powered by
  poweredByHeader: false,

  // Configuración de trailing slash
  trailingSlash: false,

  // Configuración de base path
  basePath: '',

  // Configuración de asset prefix
  assetPrefix: '',

  // Configuración de output
  output: 'standalone',

  // Configuración de swc minify
  swcMinify: true,
}

module.exports = nextConfig
