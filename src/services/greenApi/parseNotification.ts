import type { ChatMessage } from '@/types/chat'

export interface IncomingTextPayload {
  chatId: string
  title: string
  phoneNumber?: string
  message: ChatMessage
}

interface NotificationBody {
  typeWebhook?: string
  idMessage?: string
  timestamp?: number
  senderData?: {
    chatId?: string
    chatName?: string
    senderName?: string
    senderContactName?: string
    senderPhoneNumber?: number | string
  }
  messageData?: {
    typeMessage?: string
    textMessageData?: {
      textMessage?: string
    }
    extendedTextMessageData?: {
      text?: string
    }
  }
}

export interface ReceiveNotificationResponse {
  receiptId: number
  body: NotificationBody
}

const extractText = (body: NotificationBody): string | null => {
  const type = body.messageData?.typeMessage
  if (type === 'textMessage') {
    return body.messageData?.textMessageData?.textMessage ?? null
  }
  if (type === 'extendedTextMessage') {
    return body.messageData?.extendedTextMessageData?.text ?? null
  }
  return null
}

export const parseIncomingTextNotification = (
  notification: ReceiveNotificationResponse | null,
): IncomingTextPayload | null => {
  if (!notification?.body) {
    return null
  }

  const { body } = notification
  if (body.typeWebhook !== 'incomingMessageReceived') {
    return null
  }

  const text = extractText(body)
  const chatId = body.senderData?.chatId
  if (!text || !chatId) {
    return null
  }

  const title =
    body.senderData?.chatName ||
    body.senderData?.senderContactName ||
    body.senderData?.senderName ||
    chatId

  const phoneRaw = body.senderData?.senderPhoneNumber
  let phoneNumber = phoneRaw !== undefined && phoneRaw !== null ? String(phoneRaw) : undefined
  if (!phoneNumber && chatId.includes('@c.us')) {
    phoneNumber = chatId.replace('@c.us', '')
  }

  return {
    chatId,
    title,
    phoneNumber,
    message: {
      id: body.idMessage ?? `${chatId}-${body.timestamp ?? Date.now()}`,
      chatId,
      text,
      direction: 'incoming',
      timestamp: (body.timestamp ?? Math.floor(Date.now() / 1000)) * 1000,
      status: 'sent',
    },
  }
}
