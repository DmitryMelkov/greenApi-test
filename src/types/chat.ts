export interface Credentials {
  apiUrl: string
  idInstance: string
  apiTokenInstance: string
}

export type MessageDirection = 'incoming' | 'outgoing'

export interface ChatMessage {
  id: string
  chatId: string
  text: string
  direction: MessageDirection
  timestamp: number
  status?: 'pending' | 'sent' | 'failed'
}

export interface ChatThread {
  chatId: string
  title: string
  phoneNumber?: string
  updatedAt: number
}
