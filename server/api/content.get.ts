import { defineEventHandler } from 'h3'
import contentData from '../data/content.json'

export default defineEventHandler(() => {
  return contentData
})
