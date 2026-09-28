import { useState, type FormEvent } from 'react'
import { useNavigate } from 'react-router-dom'
import { setCredentials } from '@/lib/credentials'
import { Button } from '@/ui/Button'
import { Input } from '@/ui/Input'
import styles from './Login.module.css'

export const LoginPage = () => {
  const navigate = useNavigate()
  const [apiUrl, setApiUrl] = useState('')
  const [idInstance, setIdInstance] = useState('')
  const [apiTokenInstance, setApiTokenInstance] = useState('')
  const [error, setError] = useState('')

  const onSubmit = (event: FormEvent) => {
    event.preventDefault()

    if (!apiUrl.trim() || !idInstance.trim() || !apiTokenInstance.trim()) {
      setError('Заполните apiUrl, idInstance и apiTokenInstance')
      return
    }

    setCredentials({
      apiUrl: apiUrl.trim(),
      idInstance: idInstance.trim(),
      apiTokenInstance: apiTokenInstance.trim(),
    })
    navigate('/', { replace: true })
  }

  return (
    <div className={styles.page}>
      <div className={styles.panel}>
        <header className={styles.header}>
          <p className={styles.brand}>Chat</p>
          <h1 className={styles.title}>Вход через GREEN-API</h1>
          <p className={styles.lead}>
            Укажите параметры инстанса из личного кабинета. Данные сохраняются только в браузере.
          </p>
        </header>

        <form className={styles.form} onSubmit={onSubmit}>
          <Input
            label="apiUrl"
            name="apiUrl"
            value={apiUrl}
            onChange={(event) => setApiUrl(event.target.value)}
            placeholder="https://XXXX.api.greenapi.com"
            autoComplete="off"
            required
          />
          <Input
            label="idInstance"
            name="idInstance"
            value={idInstance}
            onChange={(event) => setIdInstance(event.target.value)}
            placeholder="7100xxxxxxx"
            autoComplete="off"
            required
          />
          <Input
            label="apiTokenInstance"
            name="apiTokenInstance"
            value={apiTokenInstance}
            onChange={(event) => setApiTokenInstance(event.target.value)}
            placeholder="токен инстанса"
            autoComplete="off"
            required
          />

          {error ? <p className={styles.error}>{error}</p> : null}

          <Button type="submit" className={styles.submit}>
            Войти
          </Button>
        </form>
      </div>
    </div>
  )
}
