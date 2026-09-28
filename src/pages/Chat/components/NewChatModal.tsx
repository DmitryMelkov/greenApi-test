import { useEffect, useState, type FormEvent } from 'react'
import { formatRuPhoneMask, normalizePhoneDigits } from '@/services/greenApi/phone'
import { Button } from '@/ui/Button'
import { Input } from '@/ui/Input'
import { Modal } from '@/ui/Modal'

interface NewChatModalProps {
  isOpen: boolean
  isSubmitting: boolean
  onClose: () => void
  onSubmit: (phone: string) => void
}

export const NewChatModal = ({ isOpen, isSubmitting, onClose, onSubmit }: NewChatModalProps) => {
  const [phone, setPhone] = useState('')
  const [error, setError] = useState('')

  useEffect(() => {
    if (!isOpen) {
      setPhone('')
      setError('')
    }
  }, [isOpen])

  const handleSubmit = (event: FormEvent) => {
    event.preventDefault()
    const digits = normalizePhoneDigits(phone)
    if (!digits) {
      setError('Введите номер в формате +7 (999) 123-45-67')
      return
    }
    setError('')
    onSubmit(digits)
  }

  const handleClose = () => {
    if (isSubmitting) {
      return
    }
    setPhone('')
    setError('')
    onClose()
  }

  const isValid = Boolean(normalizePhoneDigits(phone))

  return (
    <Modal
      isOpen={isOpen}
      title="Новый чат"
      onClose={handleClose}
      closeDisabled={isSubmitting}
      footer={
        <>
          <Button variant="secondary" onClick={handleClose} disabled={isSubmitting}>
            Отмена
          </Button>
          <Button type="submit" form="new-chat-form" disabled={isSubmitting || !isValid}>
            {isSubmitting ? 'Проверка…' : 'Создать'}
          </Button>
        </>
      }
    >
      <form id="new-chat-form" onSubmit={handleSubmit}>
        <Input
          label="Номер телефона"
          name="phone"
          placeholder="+7 (999) 123-45-67"
          inputMode="tel"
          autoComplete="tel"
          value={phone}
          onChange={(event) => {
            setPhone(formatRuPhoneMask(event.target.value))
            setError('')
          }}
          error={error}
          autoFocus
          disabled={isSubmitting}
        />
      </form>
    </Modal>
  )
}
