# Vibe Coding + SvelteKit Challenge — Todo App

Приложение “Список задач” на SvelteKit с локальным хранением в IndexedDB (Dexie), TypeScript и TailwindCSS.

## Стек

- SvelteKit (SSR отключён для работы с IndexedDB на клиенте)
- TypeScript
- Dexie (IndexedDB)
- Tailwind CSS

Почему TailwindCSS:

- Быстрый контроль над адаптивной вёрсткой без тяжёлых UI-библиотек
- Минимальный вес и предсказуемость стилей

## Возможности

- CRUD: добавление, просмотр, редактирование, удаление задач
- Поиск по названию
- Локальное хранение в IndexedDB (таблица `todos`)
- Адаптивный интерфейс (мобильный/десктоп)
- Уведомления об успехе/ошибке операций
- Простые анимации (fade/fly)

## Быстрый старт

```bash
npm install
npm run dev
# откройте http://localhost:5173
```

Сборка:

```bash
npm run build
npm run preview
```

## Структура

- `src/lib/types.ts` — типы (`Todo`, `TodoStatus`)
- `src/lib/db.ts` — инициализация Dexie и схема
- `src/lib/todos.ts` — CRUD-утилиты поверх Dexie
- `src/lib/components/Toasts.svelte` — компонент уведомлений
- `src/lib/stores/toast.ts` — стор уведомлений
- `src/routes/+layout.ts` — `ssr = false`
- `src/routes/+layout.svelte` — глобальные стили и тосты
- `src/routes/+page.svelte` — UI: форма, список, поиск, редактирование/удаление
- `src/app.css`, `tailwind.config.js`, `postcss.config.js` — Tailwind

## Логи промптов

См. `docs/AI_LOG.md`

## Совместимость

- Chrome 120+

## Критерии чек-листа (выполнено)

- Проект запускается `npm run dev`
- CRUD + поиск
- Данные сохраняются в IndexedDB
- Удаление/редактирование записей
- Адаптивный интерфейс
- Типизация основных сущностей
- Отсутствуют `console.log` в финальном коде

## Временные метки (пример)

- Настройка проекта: 20 мин
- База (Dexie) + типы: 25 мин
- UI + CRUD + поиск: 60 мин
- Уведомления + анимации: 20 мин
- Документация: 20 мин
