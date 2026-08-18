import { ref } from 'vue'

const decryptedGithubToken = ref<string>('')
const isAuthenticated = ref(false)

async function sha256(str: string): Promise<string> {
  const buf = await crypto.subtle.digest('SHA-256', new TextEncoder().encode(str))
  return Array.from(new Uint8Array(buf))
    .map(b => b.toString(16).padStart(2, '0'))
    .join('')
}

async function decryptToken(encryptedPayload: string, passwordStr: string): Promise<string> {
  if (!encryptedPayload) return ''
  try {
    const parts = encryptedPayload.split(':')
    if (parts.length !== 3) return ''
    const [ivHex, tagHex, dataHex] = parts

    const passBuf = new TextEncoder().encode(passwordStr)
    const keyBuf = await crypto.subtle.digest('SHA-256', passBuf)
    const cryptoKey = await crypto.subtle.importKey('raw', keyBuf, { name: 'AES-GCM' }, false, ['decrypt'])

    const iv = new Uint8Array(ivHex.match(/.{1,2}/g)!.map(byte => parseInt(byte, 16)))
    const data = new Uint8Array(dataHex.match(/.{1,2}/g)!.map(byte => parseInt(byte, 16)))
    const tag = new Uint8Array(tagHex.match(/.{1,2}/g)!.map(byte => parseInt(byte, 16)))

    const combined = new Uint8Array(data.length + tag.length)
    combined.set(data)
    combined.set(tag, data.length)

    const decryptedBuf = await crypto.subtle.decrypt(
      { name: 'AES-GCM', iv, tagLength: 128 },
      cryptoKey,
      combined
    )

    return new TextDecoder().decode(decryptedBuf)
  } catch (e) {
    console.error('Erreur de déchiffrement du token GitHub:', e)
    return ''
  }
}

export const useAdminAuth = () => {
  const config = useRuntimeConfig()
  const sessionCookie = useCookie('precora_session')

  const initAuth = () => {
    if (sessionCookie.value === 'authenticated') {
      isAuthenticated.value = true
      if (import.meta.client && !decryptedGithubToken.value) {
        decryptedGithubToken.value = sessionStorage.getItem('precora_active_token') || ''
      }
    }
  }

  const login = async (passwordInput: string): Promise<{ success: boolean; error?: string }> => {
    try {
      const inputHash = await sha256(passwordInput)
      const expectedHash = config.public.adminPasswordHash

      if (expectedHash && inputHash === expectedHash) {
        sessionCookie.value = 'authenticated'
        isAuthenticated.value = true

        // Déchiffrement du token si présent
        const encToken = config.public.encryptedGithubToken as string
        if (encToken) {
          const token = await decryptToken(encToken, passwordInput)
          if (token) {
            decryptedGithubToken.value = token
            if (import.meta.client) {
              sessionStorage.setItem('precora_active_token', token)
            }
          }
        }

        return { success: true }
      }

      return { success: false, error: 'Mot de passe administrateur incorrect.' }
    } catch (err: any) {
      return { success: false, error: 'Erreur lors de la vérification du mot de passe.' }
    }
  }

  const logout = () => {
    sessionCookie.value = null
    isAuthenticated.value = false
    decryptedGithubToken.value = ''
    if (import.meta.client) {
      sessionStorage.removeItem('precora_active_token')
    }
  }

  return {
    isAuthenticated,
    decryptedGithubToken,
    initAuth,
    login,
    logout
  }
}
