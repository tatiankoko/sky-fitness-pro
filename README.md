# Sky Fitness Pro

Платформа фитнес-курсов — учебный проект. Каталог курсов, личный кабинет, видеотренировки и отслеживание прогресса.

## Демо

[Открыть Sky Fitness Pro](https://sky-fitness-pro.tat-tattend.workers.dev)

## Возможности

- Каталог курсов с добавлением/удалением в «Мои курсы»
- Регистрация и вход через внешнее API, восстановление сессии при перезагрузке
- Личный кабинет: мои курсы и прогресс по каждому
- Страница курса: описание, направления, подходящие вам
- Страница тренировки: видеоплеер, прогресс по упражнениям, сохранение и сброс
- Кнопки прогресса понимают состояние: «Начать тренировки» / «Продолжить» / «Начать заново»
- Модальные окна входа/регистрации через перехватывающие маршруты (`@auth`)
- Адаптивная вёрстка (мобильные breakpoint'ы 495 / 768 / 1190px)

## Стек

- **Next.js 16** (App Router) + **React 19** + **TypeScript**
- **Redux Toolkit** — состояние курсов, тренировок и авторизации
- **CSS Modules** + **Tailwind CSS v4** — стилизация
- **axios** — запросы к API
- **react-player** — видео, **react-toastify** — уведомления, **react-loading-skeleton** — скелетоны, **react-tooltip** — подсказки
- **Jest** + **ts-jest** + **Testing Library** — тесты

## Быстрый старт

Требования: Node.js 20.9+, npm.

```bash
npm install
npm run dev
```

Откройте [http://localhost:3000](http://localhost:3000) — корень редиректит на `/main`.

## Скрипты

| Команда           | Действие                              |
| ----------------- | ------------------------------------- |
| `npm run dev`     | дев-сервер                            |
| `npm run build`   | продакшен-сборка                      |
| `npm run start`   | запуск собранного приложения          |
| `npm run lint`    | ESLint                                |
| `npm run format`  | Prettier по всем файлам               |
| `npm test`        | Jest-тесты                            |

## Структура проекта

```
src/
├── app/            # маршруты App Router
│   ├── main/       # каталог, страница курса, signin/signup + @auth-перехваты
│   └── profile/    # личный кабинет и страница тренировки
├── components/     # UI-компоненты (тесты *.test.tsx рядом)
├── hooks/          # useFetchCourses, useAuthForm, useScrollable и др.
├── store/          # Redux: courseSlice, workoutSlice, authSlice
├── services/       # обёртки API: course, workout, auth
├── sharedTypes/    # общие типы
└── utils/          # хелперы (тесты рядом)
```

## Маршруты

| Путь                                       | Страница                                    |
| ------------------------------------------ | ------------------------------------------- |
| `/`                                        | редирект на `/main`                         |
| `/main`                                    | каталог курсов                              |
| `/main/course/[id]`                        | страница курса                              |
| `/main/signin`, `/main/signup`             | вход / регистрация (также как модалки через `@auth`) |
| `/profile`                                 | мои курсы и прогресс 🔒                     |
| `/profile/[course]/[courseId]/workout/[id]`| тренировка 🔒                               |

🔒 — только для авторизованных: при отсутствии сессии (hard refresh или logout) страницы редиректят на `/main`.

## API

Внешнее API: `https://wedev-api.sky.pro/api/fitness` (константа `BASE_URL` в `src/services/constants.ts`). Запросы выполняются через общий Axios-клиент; interceptor автоматически завершает сессию при ответе `401` на авторизованный запрос. 

## Тесты

```bash
npm test
```

Jest (jsdom) + Testing Library, 88 тестов: утилиты, редьюсеры Redux, Axios-interceptor, константы картинок и компоненты (`Button`, `ProgressItem`, `Modal`, `CourseProgressContent`, `CourseCard`). Конфигурация: `jest.config.js` + `tsconfig.jest.json`, setup — `jest.setup.ts`.

## Стиль кода

- ESLint (`next/core-web-vitals` + TypeScript) и Prettier.
- CSS-модули; `max-width` медиа-запросы пишутся от широкого к узкому (1190 → 768 → 495), чтобы узкие правила побеждали без `!important`.
- Запросы к API — в `src/services`, состояние — в слайсах, переиспользуемая логика — в хуках.
