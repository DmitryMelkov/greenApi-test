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

Сборка: `npm run build`  
Превью: `npm run preview`  
Линт: `npm run lint`  
Формат: `npm run format`  
Тесты: `npm test`

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

## Деплой

SPA: после `npm run build` каталог `dist/`.

`vercel.json` — rewrite всех путей на `index.html`, чтобы React Router работал при обновлении страницы на Vercel.

```bash
npx vercel
```

Или подключите репозиторий [DmitryMelkov/greenApi-test](https://github.com/DmitryMelkov/greenApi-test) к Vercel / Netlify / Cloudflare Pages.
