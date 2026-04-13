DriveAway - About Page Unit Test

1. Що було змінено

- Додано unit test для сторінки About:
  frontend/src/app/about/page.test.tsx

- Додано конфігурацію Jest для Next.js:
  frontend/jest.config.ts

- Додано test setup для Testing Library і mock для next/image:
  frontend/jest.setup.ts

- Оновлено frontend/package.json:
  - додано script "test": "jest --runInBand"
  - додано devDependencies для Jest і Testing Library

2. Навіщо був потрібен параметр --runInBand

У поточному середовищі Jest не може стабільно створювати дочірні процеси, тому паралельний запуск викликав помилку spawn EPERM.
Параметр --runInBand запускає тести в одному процесі, що коректно працює в цьому проєкті.

3. Що перевіряє тест сторінки About

Тест перевіряє:
- наявність основних заголовків сторінки About
- наявність блоку Our Story
- наявність секції DriveAway by the Numbers
- наявність секції Our Core Values
- наявність секції Why Choose DriveAway?
- наявність зображення DriveAway Team
- наявність статистики:
  5,000+
  50+
  100K+
  4.8★
- наявність карток цінностей і переваг

4. Як встановити залежності

Відкрий термінал у корені проєкту:

cd d:\Курси\DriveAway\frontend
npm install

Якщо потрібно встановити лише тестові залежності вручну:

npm install -D jest jest-environment-jsdom @testing-library/react @testing-library/jest-dom @types/jest

5. Як запустити unit test для сторінки About

Перейди в папку frontend:

cd d:\Курси\DriveAway\frontend

Запусти тест сторінки About:

npm test -- --runTestsByPath src/app/about/page.test.tsx

6. Очікуваний результат

Успішний запуск має показати приблизно такий результат:

Test Suites: 1 passed, 1 total
Tests:       2 passed, 2 total

7. Файли, які беруть участь у тестуванні

- frontend/src/app/about/page.tsx
- frontend/src/app/about/page.test.tsx
- frontend/jest.config.ts
- frontend/jest.setup.ts
- frontend/package.json

8. Примітка

Тест є unit test для сторінки About і не потребує відкриття браузера або ручного переходу на http://localhost:3000/about.
Він перевіряє JSX-рендеринг компонента сторінки локально через Jest і Testing Library.
