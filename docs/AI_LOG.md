# Логи промптов (Vibe Coding)

1) Промпт: «Инициализируй SvelteKit с TypeScript неинтерактивно и установи зависимости»
- Ответ ИИ: Использовать `npx sv create . --template minimal --types ts --install npm` (новый CLI `sv` вместо `create-svelte`).
- Результат: Проект создан, зависимости установлены.

2) Промпт: «Добавь TailwindCSS без `npx tailwindcss init` (если `npx` недоступен)»
- Ответ ИИ: Создать вручную `tailwind.config.js`, `postcss.config.js`, `src/app.css` и импортировать стили в `+layout.svelte`.
- Результат: Tailwind подключён, глобальные стили работают.

3) Промпт: «Настрой Dexie и схему IndexedDB для задач»
- Ответ ИИ: Создать `src/lib/db.ts` с версией и stores, таблица `todos: '++id, title, status, createdAt, updatedAt'`.
- Результат: База настроена, данные сохраняются локально.

4) Промпт: «Определи типы и CRUD-утилиты»
- Ответ ИИ: Добавить `src/lib/types.ts` (тип `Todo`) и `src/lib/todos.ts` (create, getAll, search, update, delete).
- Результат: Полная типизация операций и удобный API.

5) Промпт: «Собери UI: форма, список, поиск, редактирование и удаление»
- Ответ ИИ: В `+page.svelte` реализовать форму добавления, реактивный поиск, inline-редактирование, удаление, анимации `fade`.
- Результат: Полный CRUD-интерфейс с поиском.

6) Промпт: «Добавь уведомления и отключи SSR»
- Ответ ИИ: Сделать `Toasts.svelte` и `toast`-store, вызывать `notify.success/error` в операциях; `+layout.ts` — `export const ssr = false`.
- Результат: Видимые уведомления и корректная работа IndexedDB.

> Итеративность: минимум 3 итерации (инициализация → стили → данные → UI → уведомления/SSR).


