import type { Credentials } from '@/types/chat'

export class GreenApiError extends Error {
  status: number

  constructor(message: string, status: number) {
    super(message)
    this.name = 'GreenApiError'
    this.status = status
  }
}

export const formatApiErrorMessage = (raw: string, status?: number): string => {
  const trimmed = raw.trim()
  if (!trimmed) {
    if (status === 429) {
      return 'Слишком много запросов. Подождите немного.'
    }
    if (status === 404) {
      return 'Метод или инстанс не найден (проверьте apiUrl).'
    }
    return status ? `Ошибка запроса (${status})` : 'Ошибка запроса'
  }

  let detail = trimmed
  try {
    const parsed = JSON.parse(trimmed) as {
      message?: string
      error?: string
      reason?: string
      details?: string
    }
    detail = parsed.message || parsed.error || parsed.reason || parsed.details || trimmed
  } catch {
    detail = trimmed
  }

  const lower = detail.toLowerCase()
  if (lower.includes('phonenumber') && lower.includes('correct phone')) {
    return 'Некорректный номер телефона'
  }
  if (lower.includes('not found')) {
    return 'Не найдено (проверьте apiUrl и метод)'
  }
  if (lower.includes('too many requests')) {
    return 'Слишком много запросов. Подождите немного.'
  }
  if (lower.includes('unauthorized') || lower.includes('forbidden')) {
    return 'Нет доступа. Проверьте токен инстанса.'
  }

  const cleaned = detail.replace(/\{[\s\S]*\}/g, '').trim() || detail
  return cleaned.length > 160 ? `${cleaned.slice(0, 157)}…` : cleaned
}

const buildUrl = (
  credentials: Credentials,
  method: string,
  suffix = '',
  query?: Record<string, string | number>,
): string => {
  const base = `${credentials.apiUrl}/waInstance${credentials.idInstance}/${method}/${credentials.apiTokenInstance}${suffix}`
  if (!query) {
    return base
  }

  const params = new URLSearchParams()
  for (const [key, value] of Object.entries(query)) {
    params.set(key, String(value))
  }
  return `${base}?${params.toString()}`
}

export const greenApiRequest = async <T>(
  credentials: Credentials,
  method: string,
  init?: RequestInit & { suffix?: string; query?: Record<string, string | number> },
): Promise<T> => {
  const { suffix = '', query, ...requestInit } = init ?? {}
  const url = buildUrl(credentials, method, suffix, query)

  const response = await fetch(url, {
    ...requestInit,
    headers: {
      'Content-Type': 'application/json',
      ...requestInit.headers,
    },
  })

  const text = await response.text()

  if (!response.ok) {
    throw new GreenApiError(formatApiErrorMessage(text, response.status), response.status)
  }

  if (!text || text === 'null') {
    return null as T
  }

  try {
    return JSON.parse(text) as T
  } catch {
    throw new GreenApiError('Некорректный ответ сервера', response.status)
  }
}
