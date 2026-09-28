import type { InputHTMLAttributes } from 'react'
import styles from './Input.module.css'

interface InputProps extends InputHTMLAttributes<HTMLInputElement> {
  label?: string
  error?: string
}

export const Input = ({ label, error, className, id, ...rest }: InputProps) => {
  const inputId = id ?? rest.name

  return (
    <label className={[styles.field, className].filter(Boolean).join(' ')} htmlFor={inputId}>
      {label ? <span className={styles.label}>{label}</span> : null}
      <input id={inputId} className={styles.input} {...rest} />
      {error ? <span className={styles.error}>{error}</span> : null}
    </label>
  )
}
