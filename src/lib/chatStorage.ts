import type { ChatMessage, ChatThread } from '@/types/chat'

const chatsKey = (idInstance: string) => `greenapi-chats:${idInstance}`
const messagesKey = (idInstance: string) => `greenapi-messages:${idInstance}`

export const loadChats = (idInstance: string): ChatThread[] => {
  try {
    const raw = localStorage.getItem(chatsKey(idInstance))
    if (!raw) {
      return []
    }
    return JSON.parse(raw) as ChatThread[]
  } catch {
    return []
  }
}

export const saveChats = (idInstance: string, chats: ChatThread[]): void => {
  localStorage.setItem(chatsKey(idInstance), JSON.stringify(chats))
}

export const loadMessages = (idInstance: string): Record<string, ChatMessage[]> => {
  try {
    const raw = localStorage.getItem(messagesKey(idInstance))
    if (!raw) {
      return {}
    }
    return JSON.parse(raw) as Record<string, ChatMessage[]>
  } catch {
    return {}
  }
}

export const saveMessages = (
  idInstance: string,
  messagesByChat: Record<string, ChatMessage[]>,
): void => {
  localStorage.setItem(messagesKey(idInstance), JSON.stringify(messagesByChat))
}
