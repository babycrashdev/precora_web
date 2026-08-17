import { defineEventHandler, readBody, setCookie, createError } from 'h3'

export default defineEventHandler(async (event) => {
  const body = await readBody(event)
  const password = body?.password

  const validPassword = process.env.ADMIN_PASSWORD || 'precora2026'

  if (password === validPassword) {
    setCookie(event, 'precora_session', 'authenticated', {
      httpOnly: true,
      sameSite: 'lax',
      maxAge: 28800,
      path: '/'
    })
    return { success: true }
  }

  throw createError({
    statusCode: 401,
    statusMessage: 'Mot de passe incorrect'
  })
})
