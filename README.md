# greenApi-test

Веб-чат для отправки и получения текстовых сообщений через [GREEN-API](https://green-api.com/) (WhatsApp / MAX).

Тестовое задание: Frontend React. UI в духе [web.max.ru](https://web.max.ru/), минимум функций.

## Стек

- React 19 + TypeScript + Vite
- CSS Modules (без UI-kit)
- native `fetch` (без axios / React Query / Redux)
- react-router-dom
- oxlint + Prettier
- Vitest (utils / service)

Входящие сообщения — HTTP long-poll: `ReceiveNotification` + `DeleteNotification`.

## Запуск

```bash
npm install
npm run dev
```

Откройте адрес из терминала (обычно `http://localhost:5173`).

| Команда           | Назначение                  |
| ----------------- | --------------------------- |
| `npm run build`   | production-сборка в `dist/` |
| `npm run preview` | локальный просмотр сборки   |
| `npm run lint`    | oxlint                      |
| `npm run format`  | Prettier                    |
| `npm test`        | Vitest                      |

## Настройка GREEN-API

1. Зарегистрируйтесь в [личном кабинете](https://console.green-api.com/).
2. Создайте инстанс и авторизуйте аккаунт (QR).
3. Скопируйте `apiUrl` инстанса (например `https://XXXX.api.greenapi.com`), `idInstance`, `apiTokenInstance`.
4. Для входящих по HTTP API: `webhookUrl` пустой, `incomingWebhook: yes` (приложение может включить это при входе).
5. На экране входа вставьте credentials.

## Сценарий

1. Ввод credentials → вход.
2. «Новый чат» → номер телефона → `checkWhatsapp` → чат `номер@c.us`.
3. Отправка текста через [SendMessage](https://green-api.com/docs/api/sending/SendMessage/).
4. Ответ собеседника появляется через ReceiveNotification + DeleteNotification.

## Структура

```
src/
  pages/Login/          # credentials
  pages/Chat/           # model / hooks / components
  services/greenApi/    # fetch-клиент API
  ui/                   # Button, Input, Avatar, Modal, Toast
  lib/                  # localStorage credentials и чатов
```
