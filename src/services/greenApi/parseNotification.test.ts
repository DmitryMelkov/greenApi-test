import { describe, expect, it } from 'vitest'
import { parseIncomingTextNotification } from './parseNotification'

describe('parseIncomingTextNotification', () => {
  it('returns null for empty notification', () => {
    expect(parseIncomingTextNotification(null)).toBeNull()
  })

  it('parses text incoming message', () => {
    const result = parseIncomingTextNotification({
      receiptId: 1,
      body: {
        typeWebhook: 'incomingMessageReceived',
        idMessage: 'msg-1',
        timestamp: 1763115112,
        senderData: {
          chatId: '10000000',
          chatName: 'Test User',
          senderPhoneNumber: 79991234567,
        },
        messageData: {
          typeMessage: 'textMessage',
          textMessageData: {
            textMessage: 'Hello',
          },
        },
      },
    })

    expect(result).toEqual({
      chatId: '10000000',
      title: 'Test User',
      phoneNumber: '79991234567',
      message: {
        id: 'msg-1',
        chatId: '10000000',
        text: 'Hello',
        direction: 'incoming',
        timestamp: 1763115112000,
        status: 'sent',
      },
    })
  })

  it('skips non-text webhooks', () => {
    const result = parseIncomingTextNotification({
      receiptId: 2,
      body: {
        typeWebhook: 'outgoingMessageStatus',
      },
    })
    expect(result).toBeNull()
  })
})
