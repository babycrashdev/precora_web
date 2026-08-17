// https://nuxt.com/docs/api/configuration/nuxt-config
export default defineNuxtConfig({
  compatibilityDate: '2025-07-15',
  devtools: { enabled: true },
  srcDir: '.',

  css: [
    '~/assets/css/main.css'
  ],

  app: {
    head: {
      title: 'PRECORA - Organisme Compétent en Radioprotection',
      meta: [
        { charset: 'utf-8' },
        { name: 'viewport', content: 'width=device-width, initial-scale=1' },
        {
          name: 'description',
          content: 'PRECORA - Conseil, vérifications réglementaires, formation et calculs de blindage (NFC 15-160) en radioprotection.'
        }
      ],
      link: [
        { rel: 'icon', type: 'image/x-icon', href: '/favicon.ico' }
      ]
    }
  }
})
