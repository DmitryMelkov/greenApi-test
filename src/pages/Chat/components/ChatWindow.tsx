import { useEffect, useRef } from 'react'
import type { ChatMessage, ChatThread } from '@/types/chat'
import { formatPhoneDisplay } from '@/services/greenApi/phone'
import { Avatar } from '@/ui/Avatar'
import { Composer } from './Composer'
import { MessageBubble } from './MessageBubble'
import styles from './ChatWindow.module.css'

interface ChatWindowProps {
  chat: ChatThread | null
  messages: ChatMessage[]
  isSending: boolean
  onSend: (text: string) => void
}

export const ChatWindow = ({ chat, messages, isSending, onSend }: ChatWindowProps) => {
  const bottomRef = useRef<HTMLDivElement>(null)

  useEffect(() => {
    bottomRef.current?.scrollIntoView({ behavior: 'smooth' })
  }, [messages, chat?.chatId])

  if (!chat) {
    return (
      <section className={styles.emptyPane}>
        <p className={styles.emptyTitle}>Выберите чат</p>
        <p className={styles.emptyText}>Или создайте новый по номеру телефона получателя.</p>
      </section>
    )
  }

  const subtitle = chat.phoneNumber
    ? formatPhoneDisplay(chat.phoneNumber)
    : `chatId: ${chat.chatId}`

  return (
    <section className={styles.root}>
      <header className={styles.header}>
        <Avatar name={chat.title} size="sm" />
        <div className={styles.headerMeta}>
          <h2 className={styles.title}>{chat.title}</h2>
          <p className={styles.subtitle}>{subtitle}</p>
        </div>
      </header>

      <div className={styles.messages}>
        {messages.length === 0 ? (
          <p className={styles.hint}>Напишите первое сообщение</p>
        ) : (
          messages.map((message) => <MessageBubble key={message.id} message={message} />)
        )}
        <div ref={bottomRef} />
      </div>

      <Composer disabled={isSending} onSend={onSend} />
    </section>
  )
}
