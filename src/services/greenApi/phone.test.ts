import { describe, expect, it } from 'vitest'
import {
  formatPhoneDisplay,
  formatRuPhoneMask,
  normalizePhoneDigits,
  phoneToWhatsappChatId,
} from './phone'

describe('normalizePhoneDigits', () => {
  it('keeps international RU numbers', () => {
    expect(normalizePhoneDigits('+7 (999) 123-45-67')).toBe('79991234567')
  })

  it('converts 8xxxxxxxxxx to 7xxxxxxxxxx', () => {
    expect(normalizePhoneDigits('89991234567')).toBe('79991234567')
  })

  it('prefixes local 9xxxxxxxxx with 7', () => {
    expect(normalizePhoneDigits('9991234567')).toBe('79991234567')
  })

  it('accepts Belarus numbers', () => {
    expect(normalizePhoneDigits('+375 29 123-45-67')).toBe('375291234567')
  })

  it('rejects invalid lengths', () => {
    expect(normalizePhoneDigits('12345')).toBeNull()
  })
})

describe('formatPhoneDisplay', () => {
  it('formats RU phone', () => {
    expect(formatPhoneDisplay('79991234567')).toBe('+7 (999) 123-45-67')
  })
})

describe('formatRuPhoneMask', () => {
  it('masks while typing', () => {
    expect(formatRuPhoneMask('9')).toBe('+7 (9')
    expect(formatRuPhoneMask('9991234567')).toBe('+7 (999) 123-45-67')
    expect(formatRuPhoneMask('89991234567')).toBe('+7 (999) 123-45-67')
  })
})

describe('phoneToWhatsappChatId', () => {
  it('builds WhatsApp chatId', () => {
    expect(phoneToWhatsappChatId('79991234567')).toBe('79991234567@c.us')
  })
})
