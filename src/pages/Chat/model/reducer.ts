import type { ChatMessage, ChatThread } from '@/types/chat'
import type { ToastData } from '@/ui/Toast'

export interface ChatPageState {
  isHydrated: boolean
  chats: ChatThread[]
  messagesByChat: Record<string, ChatMessage[]>
  activeChatId: string | null
  isNewChatOpen: boolean
  isCreatingChat: boolean
  isSending: boolean
  toast: ToastData | null
}

export type ChatPageAction =
  | { type: 'hydrate'; chats: ChatThread[]; messagesByChat: Record<string, ChatMessage[]> }
  | { type: 'selectChat'; chatId: string }
  | { type: 'openNewChat' }
  | { type: 'closeNewChat' }
  | { type: 'createChatStart' }
  | { type: 'createChatSuccess'; chat: ChatThread }
  | { type: 'createChatError'; message: string }
  | { type: 'sendStart'; message: ChatMessage }
  | { type: 'sendSuccess'; chatId: string; tempId: string; idMessage: string }
  | { type: 'sendError'; chatId: string; tempId: string; message: string }
  | { type: 'incoming'; chat: ChatThread; message: ChatMessage }
  | { type: 'clearToast' }
  | { type: 'showToast'; message: string; tone?: ToastData['tone'] }

export const createInitialState = (): ChatPageState => ({
  isHydrated: false,
  chats: [],
  messagesByChat: {},
  activeChatId: null,
  isNewChatOpen: false,
  isCreatingChat: false,
  isSending: false,
  toast: null,
})

let toastSeq = 1

const digitsOnly = (value: string): string => value.replace(/\D/g, '')

const findChatIdAlias = (
  chats: ChatThread[],
  chatId: string,
  phoneNumber?: string,
): string | null => {
  if (chats.some((chat) => chat.chatId === chatId)) {
    return chatId
  }

  const phoneDigits = phoneNumber ? digitsOnly(phoneNumber) : digitsOnly(chatId.split('@')[0] ?? '')
  if (!phoneDigits) {
    return null
  }

  const byPhone = chats.find(
    (chat) =>
      chat.phoneNumber === phoneDigits ||
      digitsOnly(chat.chatId.split('@')[0] ?? '') === phoneDigits ||
      chat.chatId.includes(phoneDigits),
  )
  return byPhone?.chatId ?? null
}

const upsertChat = (chats: ChatThread[], chat: ChatThread): ChatThread[] => {
  const aliasId = findChatIdAlias(chats, chat.chatId, chat.phoneNumber)
  const targetId = aliasId ?? chat.chatId
  const without = chats.filter((item) => item.chatId !== targetId)
  return [{ ...chat, chatId: targetId }, ...without].sort((a, b) => b.updatedAt - a.updatedAt)
}

const appendMessage = (
  messagesByChat: Record<string, ChatMessage[]>,
  message: ChatMessage,
  chats: ChatThread[],
): Record<string, ChatMessage[]> => {
  const aliasId = findChatIdAlias(chats, message.chatId, undefined)
  const targetId = aliasId ?? message.chatId
  const normalized = { ...message, chatId: targetId }
  const list = messagesByChat[targetId] ?? []
  if (list.some((item) => item.id === normalized.id)) {
    return messagesByChat
  }
  return {
    ...messagesByChat,
    [targetId]: [...list, normalized],
  }
}

export const chatPageReducer = (state: ChatPageState, action: ChatPageAction): ChatPageState => {
  switch (action.type) {
    case 'hydrate': {
      return {
        ...state,
        isHydrated: true,
        chats: action.chats,
        messagesByChat: action.messagesByChat,
        activeChatId: action.chats[0]?.chatId ?? null,
      }
    }
    case 'selectChat': {
      return { ...state, activeChatId: action.chatId }
    }
    case 'openNewChat': {
      return { ...state, isNewChatOpen: true }
    }
    case 'closeNewChat': {
      return { ...state, isNewChatOpen: false }
    }
    case 'createChatStart': {
      return { ...state, isCreatingChat: true }
    }
    case 'createChatSuccess': {
      return {
        ...state,
        isCreatingChat: false,
        isNewChatOpen: false,
        chats: upsertChat(state.chats, action.chat),
        activeChatId: action.chat.chatId,
        messagesByChat: {
          ...state.messagesByChat,
          [action.chat.chatId]: state.messagesByChat[action.chat.chatId] ?? [],
        },
      }
    }
    case 'createChatError': {
      return {
        ...state,
        isCreatingChat: false,
        toast: { id: toastSeq++, message: action.message, tone: 'error' },
      }
    }
    case 'sendStart': {
      return {
        ...state,
        isSending: true,
        chats: upsertChat(state.chats, {
          chatId: action.message.chatId,
          title:
            state.chats.find((c) => c.chatId === action.message.chatId)?.title ??
            action.message.chatId,
          phoneNumber: state.chats.find((c) => c.chatId === action.message.chatId)?.phoneNumber,
          updatedAt: action.message.timestamp,
        }),
        messagesByChat: appendMessage(state.messagesByChat, action.message, state.chats),
      }
    }
    case 'sendSuccess': {
      const list = state.messagesByChat[action.chatId] ?? []
      return {
        ...state,
        isSending: false,
        messagesByChat: {
          ...state.messagesByChat,
          [action.chatId]: list.map((item) =>
            item.id === action.tempId
              ? { ...item, id: action.idMessage, status: 'sent' as const }
              : item,
          ),
        },
      }
    }
    case 'sendError': {
      const list = state.messagesByChat[action.chatId] ?? []
      return {
        ...state,
        isSending: false,
        messagesByChat: {
          ...state.messagesByChat,
          [action.chatId]: list.map((item) =>
            item.id === action.tempId ? { ...item, status: 'failed' as const } : item,
          ),
        },
        toast: { id: toastSeq++, message: action.message, tone: 'error' },
      }
    }
    case 'incoming': {
      const nextChats = upsertChat(state.chats, action.chat)
      return {
        ...state,
        chats: nextChats,
        messagesByChat: appendMessage(state.messagesByChat, action.message, nextChats),
      }
    }
    case 'clearToast': {
      return { ...state, toast: null }
    }
    case 'showToast': {
      return {
        ...state,
        toast: { id: toastSeq++, message: action.message, tone: action.tone ?? 'info' },
      }
    }
    default: {
      return state
    }
  }
}
