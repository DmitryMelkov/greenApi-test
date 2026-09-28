import type { ChatThread } from '@/types/chat'
import { formatPhoneDisplay } from '@/services/greenApi/phone'
import { Avatar } from '@/ui/Avatar'
import { Button } from '@/ui/Button'
import styles from './ChatList.module.css'

interface ChatListProps {
  chats: ChatThread[]
  activeChatId: string | null
  onSelect: (chatId: string) => void
  onNewChat: () => void
  onLogout: () => void
}

const formatTime = (timestamp: number): string => {
  const date = new Date(timestamp)
  return date.toLocaleTimeString('ru-RU', { hour: '2-digit', minute: '2-digit' })
}

const subtitleForChat = (chat: ChatThread): string => {
  if (chat.phoneNumber) {
    return formatPhoneDisplay(chat.phoneNumber)
  }
  return chat.chatId
}

export const ChatList = ({ chats, activeChatId, onSelect, onNewChat, onLogout }: ChatListProps) => (
  <aside className={styles.root}>
    <header className={styles.header}>
      <div>
        <p className={styles.brand}>Chat</p>
        <p className={styles.sub}>GREEN-API</p>
      </div>
      <Button variant="ghost" onClick={onLogout} className={styles.logout}>
        Выйти
      </Button>
    </header>

    <div className={styles.actions}>
      <Button variant="primary" onClick={onNewChat} className={styles.newChat}>
        Новый чат
      </Button>
    </div>

    <div className={styles.list} role="list">
      {chats.length === 0 ? (
        <p className={styles.empty}>Нет чатов. Создайте новый по номеру телефона.</p>
      ) : (
        chats.map((chat) => {
          const isActive = chat.chatId === activeChatId
          return (
            <button
              key={chat.chatId}
              type="button"
              role="listitem"
              className={[styles.item, isActive ? styles.active : ''].filter(Boolean).join(' ')}
              onClick={() => onSelect(chat.chatId)}
            >
              <Avatar name={chat.title} size="sm" />
              <span className={styles.meta}>
                <span className={styles.titleRow}>
                  <span className={styles.title}>{chat.title}</span>
                  <span className={styles.time}>{formatTime(chat.updatedAt)}</span>
                </span>
                <span className={styles.preview}>{subtitleForChat(chat)}</span>
              </span>
            </button>
          )
        })
      )}
    </div>
  </aside>
)
