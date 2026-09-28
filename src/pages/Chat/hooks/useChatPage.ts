import { useCallback, useEffect, useReducer } from 'react'
import { loadChats, loadMessages, saveChats, saveMessages } from '@/lib/chatStorage'
import { greenApiService } from '@/services/greenApi'
import {
  formatPhoneDisplay,
  normalizePhoneDigits,
  phoneToWhatsappChatId,
} from '@/services/greenApi/phone'
import type { Credentials } from '@/types/chat'
import { chatPageReducer, createInitialState } from '../model'
import { useIncomingMessages } from './useIncomingMessages'

export const useChatPage = (credentials: Credentials) => {
  const [state, dispatch] = useReducer(chatPageReducer, undefined, createInitialState)

  useEffect(() => {
    dispatch({
      type: 'hydrate',
      chats: loadChats(credentials.idInstance),
      messagesByChat: loadMessages(credentials.idInstance),
    })
  }, [credentials.idInstance])

  useEffect(() => {
    let cancelled = false
    const setup = async () => {
      try {
        const changed = await greenApiService.ensureIncomingHttpApi(credentials)
        if (!cancelled && changed) {
          dispatch({
            type: 'showToast',
            message: 'Включены входящие уведомления. Подождите ~1 мин и попросите ответить снова.',
            tone: 'info',
          })
        }
      } catch {
        // ignore
      }
    }
    void setup()
    return () => {
      cancelled = true
    }
  }, [credentials])

  useEffect(() => {
    if (!state.isHydrated) {
      return
    }
    saveChats(credentials.idInstance, state.chats)
    saveMessages(credentials.idInstance, state.messagesByChat)
  }, [credentials.idInstance, state.isHydrated, state.chats, state.messagesByChat])

  useIncomingMessages({
    credentials,
    enabled: state.isHydrated,
    dispatch,
  })

  const selectChat = useCallback((chatId: string) => {
    dispatch({ type: 'selectChat', chatId })
  }, [])

  const openNewChat = useCallback(() => {
    dispatch({ type: 'openNewChat' })
  }, [])

  const closeNewChat = useCallback(() => {
    dispatch({ type: 'closeNewChat' })
  }, [])

  const clearToast = useCallback(() => {
    dispatch({ type: 'clearToast' })
  }, [])

  const createChat = useCallback(
    async (phoneInput: string) => {
      const digits = normalizePhoneDigits(phoneInput)
      if (!digits) {
        dispatch({
          type: 'createChatError',
          message: 'Введите номер РФ (7…) или РБ (375…)',
        })
        return
      }

      dispatch({ type: 'createChatStart' })

      try {
        const result = await greenApiService.checkWhatsapp(credentials, Number(digits))
        const chatId = phoneToWhatsappChatId(digits)

        if (result.existsWhatsapp !== true) {
          dispatch({
            type: 'createChatError',
            message: 'WhatsApp на этом номере не найден',
          })
          return
        }

        dispatch({
          type: 'createChatSuccess',
          chat: {
            chatId,
            title: formatPhoneDisplay(digits),
            phoneNumber: digits,
            updatedAt: Date.now(),
          },
        })
      } catch (error) {
        const message = error instanceof Error ? error.message : 'Не удалось создать чат'
        dispatch({ type: 'createChatError', message })
      }
    },
    [credentials],
  )

  const sendText = useCallback(
    async (text: string) => {
      const chatId = state.activeChatId
      if (!chatId) {
        return
      }

      const trimmed = text.trim()
      if (!trimmed) {
        return
      }

      const tempId = `local-${Date.now()}`
      const timestamp = Date.now()

      dispatch({
        type: 'sendStart',
        message: {
          id: tempId,
          chatId,
          text: trimmed,
          direction: 'outgoing',
          timestamp,
          status: 'pending',
        },
      })

      try {
        const result = await greenApiService.sendMessage(credentials, chatId, trimmed)
        dispatch({
          type: 'sendSuccess',
          chatId,
          tempId,
          idMessage: result.idMessage,
        })
      } catch (error) {
        const message = error instanceof Error ? error.message : 'Не удалось отправить'
        dispatch({ type: 'sendError', chatId, tempId, message })
      }
    },
    [credentials, state.activeChatId],
  )

  const activeChat = state.chats.find((chat) => chat.chatId === state.activeChatId) ?? null
  const activeMessages = state.activeChatId ? (state.messagesByChat[state.activeChatId] ?? []) : []

  return {
    state,
    activeChat,
    activeMessages,
    selectChat,
    openNewChat,
    closeNewChat,
    createChat,
    sendText,
    clearToast,
  }
}
