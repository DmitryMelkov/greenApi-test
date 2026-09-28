import type { Credentials } from '@/types/chat'

const STORAGE_KEY = 'greenapi-credentials'

export const getCredentials = (): Credentials | null => {
  try {
    const raw = localStorage.getItem(STORAGE_KEY)
    if (!raw) {
      return null
    }

    const parsed = JSON.parse(raw) as Partial<Credentials>
    if (!parsed.apiUrl || !parsed.idInstance || !parsed.apiTokenInstance) {
      return null
    }

    return {
      apiUrl: parsed.apiUrl.replace(/\/$/, ''),
      idInstance: String(parsed.idInstance).trim(),
      apiTokenInstance: String(parsed.apiTokenInstance).trim(),
    }
  } catch {
    return null
  }
}

export const setCredentials = (credentials: Credentials): void => {
  localStorage.setItem(
    STORAGE_KEY,
    JSON.stringify({
      apiUrl: credentials.apiUrl.trim().replace(/\/$/, ''),
      idInstance: credentials.idInstance.trim(),
      apiTokenInstance: credentials.apiTokenInstance.trim(),
    }),
  )
}

export const clearCredentials = (): void => {
  localStorage.removeItem(STORAGE_KEY)
}

export const hasCredentials = (): boolean => getCredentials() !== null
