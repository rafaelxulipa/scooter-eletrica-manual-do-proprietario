import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'

// URL publica usada nas meta tags (og:image do WhatsApp precisa ser absoluta).
// Ordem: SITE_URL (defina na Vercel para usar dominio proprio) > dominio de producao da Vercel > URL do deploy.
const vercelHost = process.env.VERCEL_PROJECT_PRODUCTION_URL || process.env.VERCEL_URL
const siteUrl = (process.env.SITE_URL || (vercelHost ? `https://${vercelHost}` : '')).replace(/\/$/, '')

export default defineConfig({
  plugins: [
    react(),
    { name: 'site-url', transformIndexHtml: (html) => html.replaceAll('%SITE_URL%', siteUrl) },
  ],
})
