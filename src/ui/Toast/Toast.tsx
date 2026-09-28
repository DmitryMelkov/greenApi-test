import { useEffect } from 'react'
import styles from './Toast.module.css'

export type ToastTone = 'error' | 'success' | 'info'

export interface ToastData {
  id: number
  message: string
  tone: ToastTone
}

interface ToastProps {
  toast: ToastData | null
  onClose: () => void
  durationMs?: number
}

export const Toast = ({ toast, onClose, durationMs = 4000 }: ToastProps) => {
  useEffect(() => {
    if (!toast) {
      return
    }

    const timer = window.setTimeout(() => {
      onClose()
    }, durationMs)

    return () => window.clearTimeout(timer)
  }, [toast, durationMs, onClose])

  if (!toast) {
    return null
  }

  return (
    <div className={styles.host} role="status" aria-live="polite">
      <div className={`${styles.toast} ${styles[toast.tone]}`}>
        <p className={styles.message}>{toast.message}</p>
        <button type="button" className={styles.close} onClick={onClose} aria-label="Закрыть">
          <svg
            className={styles.closeIcon}
            viewBox="0 0 24 24"
            width="16"
            height="16"
            aria-hidden="true"
            focusable="false"
          >
            <path
              d="M6.4 6.4a1 1 0 0 1 1.4 0L12 10.6l4.2-4.2a1 1 0 1 1 1.4 1.4L13.4 12l4.2 4.2a1 1 0 0 1-1.4 1.4L12 13.4l-4.2 4.2a1 1 0 0 1-1.4-1.4L10.6 12 6.4 7.8a1 1 0 0 1 0-1.4Z"
              fill="currentColor"
            />
          </svg>
        </button>
      </div>
    </div>
  )
}
