export interface Agreement {
  id: string
  sector: string
  number: string
  expiryDate: string
  expiryFormatted: string
  status: string
}

export interface ZoneItem {
  name: string
  code: string
}

export interface AccreditationItem {
  id: string
  name: string
  badge: string
}

export interface ContentData {
  company: {
    name: string
    subtitle: string
    expert: string
    bio: string
    email: string
    phone: string
    phoneFormatted: string
    address: string
    experienceYears: string
    accreditations: AccreditationItem[]
  }
  agreements: Agreement[]
  zones: {
    primary: ZoneItem[]
    secondary: ZoneItem[]
  }
  alert: {
    enabled: boolean
    type: string
    title: string
    message: string
  }
}

/**
 * Returns true if the given date (default today) falls in the Radon measurement season.
 * Season: September (month index 8) through April (month index 3).
 */
export function isRadonSeason(date: Date = new Date()): boolean {
  const month = date.getMonth()
  return month >= 8 || month <= 3
}

export const useContent = () => {
  const { data: content, refresh, error, pending } = useFetch<ContentData>('/api/content')
  return { content, refresh, error, pending }
}
