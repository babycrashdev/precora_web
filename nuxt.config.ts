import { createHash, createCipheriv, randomBytes } from 'node:crypto'

const rawPassword = (process.env.ADMIN_PASSWORD || '').trim() || 'precora2026'
const adminPasswordHash = createHash('sha256').update(rawPassword).digest('hex')

// Support GH_PAT / GITHUB_PAT / GITHUB_TOKEN
const ghToken = process.env.GH_PAT || process.env.GITHUB_PAT || process.env.GITHUB_TOKEN || ''
let encryptedGithubToken = ''

if (ghToken) {
  const key = createHash('sha256').update(rawPassword).digest() // 32 bytes key for AES-256
  const iv = randomBytes(12)
  const cipher = createCipheriv('aes-256-gcm', key, iv)
  const encrypted = Buffer.concat([cipher.update(ghToken, 'utf-8'), cipher.final()])
  const tag = cipher.getAuthTag()
  // format iv:tag:data in hex
  encryptedGithubToken = `${iv.toString('hex')}:${tag.toString('hex')}:${encrypted.toString('hex')}`
}

// https://nuxt.com/docs/api/configuration/nuxt-config
export default defineNuxtConfig({
  compatibilityDate: '2025-07-15',
  devtools: { enabled: true },
  srcDir: '.',

  runtimeConfig: {
    public: {
      adminPasswordHash,
      encryptedGithubToken
    }
  },

  appConfig: {
    adminPasswordHash,
    encryptedGithubToken
  },

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
