import styles from './Avatar.module.css'

interface AvatarProps {
  name: string
  size?: 'sm' | 'md'
}

const digitsOnly = (value: string): string => value.replace(/\D/g, '')

const looksLikePhone = (name: string): boolean => {
  const digits = digitsOnly(name)
  return (
    digits.length >= 10 && (name.includes('+') || name.includes('(') || /^\d/.test(name.trim()))
  )
}

const initialsFromName = (name: string): string => {
  if (looksLikePhone(name)) {
    return digitsOnly(name).slice(-2)
  }

  const parts = name.trim().split(/\s+/).filter(Boolean)
  if (parts.length === 0) {
    return '?'
  }
  if (parts.length === 1) {
    return parts[0].slice(0, 2).toUpperCase()
  }
  return `${parts[0][0] ?? ''}${parts[1][0] ?? ''}`.toUpperCase()
}

export const Avatar = ({ name, size = 'md' }: AvatarProps) => {
  const sizeClass = size === 'sm' ? styles.sm : styles.md

  return (
    <span className={[styles.root, sizeClass].join(' ')} aria-hidden="true">
      {initialsFromName(name)}
    </span>
  )
}
