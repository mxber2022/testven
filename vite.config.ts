import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'
import viteTsconfigPaths from 'vite-tsconfig-paths'
import path from 'path'
import { lingui } from '@lingui/vite-plugin'
import { viteStaticCopy } from 'vite-plugin-static-copy'

// https://vitejs.dev/config/
export default defineConfig({
  plugins: [
    react({
      babel: {
        plugins: [
          'macros',
          [
            '@locator/babel-jsx/dist',
            {
              env: 'development',
            },
          ],
        ],
      },
    }),
    lingui(),
    viteTsconfigPaths(),
    viteStaticCopy({
      targets: [
        {
          src: 'node_modules/@reserve-protocol/rtokens/images/*',
          dest: 'svgs',
        },
        {
          src: '_headers',
          dest: '',
        },
        {
          src: 'src/locales/*.js',
          dest: 'locales',
        },
        {
          src: 'public/charting_library/*',
          dest: 'charting_library'
        },
        {
          src: 'public/*.png',
          dest: ''
        }
      ],
    }),
    {
      name: 'configure-response-headers',
      configureServer(server) {
        server.middlewares.use((req, res, next) => {
          res.setHeader('X-Frame-Options', 'SAMEORIGIN')
          res.setHeader(
            'Strict-Transport-Security',
            'max-age=63072000; includeSubDomains; preload'
          )
          res.setHeader(
            'Content-Security-Policy',
            "object-src 'none'; base-uri 'self'; frame-ancestors 'none';"
          )
          next()
        })
      },
    },
  ],
  build: {
    outDir: 'build',
    sourcemap: false,
    chunkSizeWarningLimit: 1600
  },
  resolve: {
    alias: {
      '@': path.resolve(__dirname, './src'),
      'components': path.resolve(__dirname, './src/components'),
      'state': path.resolve(__dirname, './src/state'),
      'utils': path.resolve(__dirname, './src/utils'),
      'views': path.resolve(__dirname, './src/views'),
      'hooks': path.resolve(__dirname, './src/hooks'),
      'assets': path.resolve(__dirname, './src/assets'),
    },
  },
  optimizeDeps: { exclude: ['ts-node'] },
  server: {
    port: 3000,
    host: true,
    fs: {
      strict: false
    }
  },
})
