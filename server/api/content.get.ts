import { defineEventHandler } from 'h3'
import { readFile } from 'node:fs/promises'
import { resolve } from 'node:path'

export default defineEventHandler(async () => {
  const filePath = resolve(process.cwd(), 'server/data/content.json')
  const content = await readFile(filePath, 'utf-8')
  return JSON.parse(content)
})
