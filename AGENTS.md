# AI Context - greenApi-test

Тестовое задание GREEN-API: веб-чат для отправки и получения текстовых сообщений (WhatsApp / MAX). React 19, Vite, TypeScript, CSS Modules, native `fetch`. Без MUI, Next, FSD, Redux, React Query, axios. Входящие — HTTP long-poll (`ReceiveNotification` + `DeleteNotification`).

## Команды

- `npm run dev` — Vite dev server.
- `npm run build` — production build; запускать после frontend-изменений.
- `npm test` / `npm run test:watch` — Vitest, если затронуты utils / service или добавлены тесты.
- `npm run lint` — oxlint.
- `npm run format` / `npm run format:check` — Prettier.

## Карта проекта

- `src/pages/Login` — ввод `apiUrl`, `idInstance`, `apiTokenInstance`.
- `src/pages/Chat` — страница чата: `index.tsx`, `model/`, `hooks/`, `components/`.
- `src/services/greenApi` — HTTP-клиент GREEN-API (`checkWhatsapp`, `sendMessage`, `receiveNotification`, `deleteNotification`, `ensureIncomingHttpApi`).
- `src/lib/credentials.ts` — чтение/запись credentials в `localStorage`.
- `src/types` — доменные типы (`Credentials`, `Chat`, `Message`).
- `src/ui` — shared UI: `Button`, `Input`, `Avatar`, `Modal`, `Toast`.
- `src/index.css` — CSS design tokens (тёмная тема в духе web.max.ru).
- `src/routes` — маршруты `/login`, `/` + guard по credentials.

## Project-Specific правила

- Архитектура страницы: `model` → `hooks` → `components` → `ui`. `index.tsx` — сборка экрана.
- Состояние чата — `useReducer`; polling входящих — `useIncomingMessages` (Receive → parse → Delete), один long-poll на инстанс.
- UI не знает про GREEN-API URL/токены напрямую: данные только через `greenApiService` и `lib/credentials`.
- Новый чат по телефону: `checkWhatsapp` → `chatId` вида `номер@c.us`; входящие мержить по телефону/`chatId`.
- Только текстовые сообщения. Медиа, группы, webhook-сервер не добавлять.
- Тема тёмная по умолчанию; цвета — через CSS tokens.
- Credentials и список чатов/сообщений кэшируются в `localStorage` (ключ с `idInstance`).

## Frontend Baseline

- Сначала читать существующую страницу/компонент, `*.module.css`, `model/`, хуки и сервис. Новый стиль — только в духе локального паттерна.
- Компоненты держать небольшими. Экран раскладывать на `components/`, `model`, `hooks`.
- Для React — стрелочные функции. Для `if/else`, `for`, `while`, `switch`, `try/catch` всегда ставить фигурные скобки. Если в компоненте/хуке больше двух `useState` с связанной логикой — переходить на `useReducer`.
- Не использовать default export для новых или изменяемых модулей; предпочитать именованные `export`/`import`. Default export — только если это обязательный контракт фреймворка.
- Стили: CSS Modules + переменные из `src/index.css`.
- API/state: использовать `greenApiService` и page model. Контракт фронта — `camelCase`.
- UI должен иметь loading / empty / error (toast или formError), не ломать mobile/desktop.
- После изменения frontend-кода запускать `npm run build`; `npm run lint` — при изменениях структуры, imports, styling. `npm test` — если затронута логика model/service.
