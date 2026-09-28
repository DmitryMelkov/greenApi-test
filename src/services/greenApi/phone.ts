export const digitsOnly = (value: string): string => value.replace(/\D/g, '')

export const formatRuPhoneMask = (input: string): string => {
  let digits = digitsOnly(input)

  if (digits.startsWith('8')) {
    digits = `7${digits.slice(1)}`
  }
  if (!digits.startsWith('7') && digits.length > 0) {
    digits = `7${digits}`
  }

  digits = digits.slice(0, 11)

  if (digits.length === 0) {
    return ''
  }

  const rest = digits.slice(1)
  if (rest.length === 0) {
    return '+7'
  }
  if (rest.length <= 3) {
    return `+7 (${rest}`
  }
  if (rest.length <= 6) {
    return `+7 (${rest.slice(0, 3)}) ${rest.slice(3)}`
  }
  if (rest.length <= 8) {
    return `+7 (${rest.slice(0, 3)}) ${rest.slice(3, 6)}-${rest.slice(6)}`
  }
  return `+7 (${rest.slice(0, 3)}) ${rest.slice(3, 6)}-${rest.slice(6, 8)}-${rest.slice(8, 10)}`
}

export const normalizePhoneDigits = (input: string): string | null => {
  let digits = digitsOnly(input)

  if (digits.length === 11 && digits.startsWith('8')) {
    digits = `7${digits.slice(1)}`
  }

  if (digits.length === 10 && digits.startsWith('9')) {
    digits = `7${digits}`
  }

  if (digits.length === 11 && digits.startsWith('7')) {
    return digits
  }

  if (digits.length === 12 && digits.startsWith('375')) {
    return digits
  }

  return null
}

export const phoneToWhatsappChatId = (digits: string): string => `${digits}@c.us`

export const formatPhoneDisplay = (digits: string): string => {
  if (digits.length === 11 && digits.startsWith('7')) {
    return `+${digits[0]} (${digits.slice(1, 4)}) ${digits.slice(4, 7)}-${digits.slice(7, 9)}-${digits.slice(9)}`
  }
  if (digits.length === 12 && digits.startsWith('375')) {
    return `+${digits.slice(0, 3)} (${digits.slice(3, 5)}) ${digits.slice(5, 8)}-${digits.slice(8, 10)}-${digits.slice(10)}`
  }
  return `+${digits}`
}
