import { describe, expect, it } from 'vitest'
import { formatApiErrorMessage } from './client'

describe('formatApiErrorMessage', () => {
  it('maps phone validation JSON to short Russian text', () => {
    const raw = JSON.stringify({
      statusCode: 400,
      timestamp: '2026-09-28T10:08:35.014Z',
      path: '/waInstance710722748969/checkWhatsapp/token',
      message: "Validation failed. Details: 'phoneNumber' must be a correct phone",
    })
    expect(formatApiErrorMessage(raw, 400)).toBe('Некорректный номер телефона')
  })

  it('handles empty 429', () => {
    expect(formatApiErrorMessage('', 429)).toBe('Слишком много запросов. Подождите немного.')
  })

  it('truncates long plain text', () => {
    const long = 'x'.repeat(200)
    expect(formatApiErrorMessage(long).endsWith('…')).toBe(true)
    expect(formatApiErrorMessage(long).length).toBeLessThanOrEqual(160)
  })
})
