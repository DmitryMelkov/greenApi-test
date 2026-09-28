import type { Credentials } from '@/types/chat'
import { greenApiRequest } from './client'
import type { ReceiveNotificationResponse } from './parseNotification'

export interface CheckWhatsappResponse {
  existsWhatsapp?: boolean
  chatId?: string
  phoneNumber?: string
  fromCache?: boolean
}

export interface SendMessageResponse {
  idMessage: string
}

export interface DeleteNotificationResponse {
  result: boolean
}

export interface InstanceSettings {
  webhookUrl?: string
  incomingWebhook?: string
  outgoingWebhook?: string
  stateWebhook?: string
}

export const checkWhatsapp = (
  credentials: Credentials,
  phoneNumber: number,
): Promise<CheckWhatsappResponse> =>
  greenApiRequest<CheckWhatsappResponse>(credentials, 'checkWhatsapp', {
    method: 'POST',
    body: JSON.stringify({ phoneNumber }),
  })

export const sendMessage = (
  credentials: Credentials,
  chatId: string,
  message: string,
): Promise<SendMessageResponse> =>
  greenApiRequest<SendMessageResponse>(credentials, 'sendMessage', {
    method: 'POST',
    body: JSON.stringify({ chatId, message }),
  })

export const receiveNotification = (
  credentials: Credentials,
  receiveTimeout = 20,
  signal?: AbortSignal,
): Promise<ReceiveNotificationResponse | null> =>
  greenApiRequest<ReceiveNotificationResponse | null>(credentials, 'receiveNotification', {
    method: 'GET',
    query: { receiveTimeout },
    signal,
  })

export const deleteNotification = (
  credentials: Credentials,
  receiptId: number,
): Promise<DeleteNotificationResponse> =>
  greenApiRequest<DeleteNotificationResponse>(credentials, 'deleteNotification', {
    method: 'DELETE',
    suffix: `/${receiptId}`,
  })

export const getSettings = (credentials: Credentials): Promise<InstanceSettings> =>
  greenApiRequest<InstanceSettings>(credentials, 'getSettings', { method: 'GET' })

export const setSettings = (
  credentials: Credentials,
  settings: Record<string, string>,
): Promise<{ saveSettings?: boolean }> =>
  greenApiRequest<{ saveSettings?: boolean }>(credentials, 'setSettings', {
    method: 'POST',
    body: JSON.stringify(settings),
  })

export const ensureIncomingHttpApi = async (credentials: Credentials): Promise<boolean> => {
  const current = await getSettings(credentials)
  const webhookEmpty = !current.webhookUrl
  const incomingOn = current.incomingWebhook === 'yes'
  if (webhookEmpty && incomingOn) {
    return false
  }

  await setSettings(credentials, {
    webhookUrl: '',
    incomingWebhook: 'yes',
    outgoingWebhook: 'yes',
    stateWebhook: 'yes',
  })
  return true
}

export const greenApiService = {
  checkWhatsapp,
  sendMessage,
  receiveNotification,
  deleteNotification,
  getSettings,
  setSettings,
  ensureIncomingHttpApi,
}
