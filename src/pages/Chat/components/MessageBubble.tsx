import type { ChatMessage } from '@/types/chat'
import styles from './MessageBubble.module.css'

interface MessageBubbleProps {
  message: ChatMessage
}

const formatTime = (timestamp: number): string =>
  new Date(timestamp).toLocaleTimeString('ru-RU', { hour: '2-digit', minute: '2-digit' })

export const MessageBubble = ({ message }: MessageBubbleProps) => {
  const isOut = message.direction === 'outgoing'
  const statusLabel =
    message.status === 'pending' ? '…' : message.status === 'failed' ? 'ошибка' : ''

  return (
    <div className={[styles.row, isOut ? styles.out : styles.in].join(' ')}>
      <div className={[styles.bubble, isOut ? styles.bubbleOut : styles.bubbleIn].join(' ')}>
        <p className={styles.text}>{message.text}</p>
        <span className={styles.meta}>
          {formatTime(message.timestamp)}
          {statusLabel ? ` · ${statusLabel}` : ''}
        </span>
      </div>
    </div>
  )
}
