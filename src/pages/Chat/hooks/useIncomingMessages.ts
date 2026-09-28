import { useEffect, useRef, type Dispatch } from 'react'
import { greenApiService } from '@/services/greenApi'
import { parseIncomingTextNotification } from '@/services/greenApi/parseNotification'
import type { Credentials } from '@/types/chat'
import type { ChatPageAction } from '../model'

interface UseIncomingMessagesParams {
  credentials: Credentials
  enabled: boolean
  dispatch: Dispatch<ChatPageAction>
}

const pollControllers = new Map<string, AbortController>()

export const useIncomingMessages = ({
  credentials,
  enabled,
  dispatch,
}: UseIncomingMessagesParams) => {
  const dispatchRef = useRef(dispatch)
  dispatchRef.current = dispatch
  const credentialsRef = useRef(credentials)
  credentialsRef.current = credentials

  useEffect(() => {
    if (!enabled) {
      return
    }

    const instanceKey = credentials.idInstance
    pollControllers.get(instanceKey)?.abort()
    const controller = new AbortController()
    pollControllers.set(instanceKey, controller)

    const loop = async () => {
      while (!controller.signal.aborted) {
        const creds = credentialsRef.current
        try {
          const notification = await greenApiService.receiveNotification(
            creds,
            20,
            controller.signal,
          )
          if (controller.signal.aborted) {
            return
          }
          if (!notification) {
            continue
          }

          const parsed = parseIncomingTextNotification(notification)
          if (parsed) {
            dispatchRef.current({
              type: 'incoming',
              chat: {
                chatId: parsed.chatId,
                title: parsed.title,
                phoneNumber: parsed.phoneNumber,
                updatedAt: parsed.message.timestamp,
              },
              message: parsed.message,
            })
          }

          try {
            await greenApiService.deleteNotification(creds, notification.receiptId)
          } catch {
            // ignore
          }
        } catch (error) {
          if (controller.signal.aborted) {
            return
          }
          const message = error instanceof Error ? error.message : 'Ошибка получения сообщений'
          dispatchRef.current({ type: 'showToast', message, tone: 'error' })
          await new Promise((resolve) => window.setTimeout(resolve, 3000))
        }
      }
    }

    void loop()

    return () => {
      if (pollControllers.get(instanceKey) === controller) {
        pollControllers.delete(instanceKey)
      }
      controller.abort()
    }
  }, [credentials.idInstance, enabled])
}
