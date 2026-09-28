import { useState, type FormEvent, type KeyboardEvent } from 'react'
import { Button } from '@/ui/Button'
import styles from './Composer.module.css'

interface ComposerProps {
  disabled?: boolean
  onSend: (text: string) => void
}

export const Composer = ({ disabled = false, onSend }: ComposerProps) => {
  const [text, setText] = useState('')

  const submit = () => {
    const value = text.trim()
    if (!value || disabled) {
      return
    }
    onSend(value)
    setText('')
  }

  const onSubmit = (event: FormEvent) => {
    event.preventDefault()
    submit()
  }

  const onKeyDown = (event: KeyboardEvent<HTMLTextAreaElement>) => {
    if (event.key === 'Enter' && !event.shiftKey) {
      event.preventDefault()
      submit()
    }
  }

  return (
    <form className={styles.root} onSubmit={onSubmit}>
      <textarea
        className={styles.input}
        value={text}
        onChange={(event) => setText(event.target.value)}
        onKeyDown={onKeyDown}
        placeholder="Сообщение"
        rows={1}
        disabled={disabled}
        aria-label="Текст сообщения"
      />
      <Button type="submit" disabled={disabled || !text.trim()}>
        Отправить
      </Button>
    </form>
  )
}
