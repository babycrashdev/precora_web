import { defineEventHandler, readBody, getCookie, createError } from 'h3'
import { writeFile } from 'node:fs/promises'
import { resolve } from 'node:path'

export default defineEventHandler(async (event) => {
  const session = getCookie(event, 'precora_session')
  if (!session) {
    throw createError({
      statusCode: 401,
      statusMessage: 'Non autorisé. Veuillez vous connecter.'
    })
  }

  const body = await readBody(event)
  if (!body || typeof body !== 'object') {
    throw createError({
      statusCode: 400,
      statusMessage: 'Données invalides'
    })
  }

  const filePath = resolve(process.cwd(), 'server/data/content.json')
  await writeFile(filePath, JSON.stringify(body, null, 2), 'utf-8')

  return { success: true, data: body }
})
