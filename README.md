# REST Client app

## Description

The final project of the React Q3 2025 course from RSSchool.
This is a platform for creating, testing, documenting, publishing and maintaining APIs. It allows you to create collections of requests to any API. Thanks to the user-friendly graphical interface, even a beginner can understand the platform.

## Purposes

1. To gain experience in conditions as close as possible to real product development.
2. To learn to resolve controversial issues within the team.
3. To create a full-fledged finished product for use.

## Setup and Running Locally

Follow these steps to set up and run the project locally:

### 1. Clone the Repository

Clone the project to your local machine using Git:

`git clone https://github.com/DmitryStarchenko/REST-Client-app.git`

### 2. Install Dependencies

Navigate to the project directory and install the required dependencies using npm:

```
cd REST-Client-app
npm run init
```

### 3. Run the Development Server

Start the development server:

`npm run dev`

This will start the project on localhost:3000 for development.

### 4. Run the Development Server

Start the development server:

`npm run build`

This will output the bundled files in the dist directory.

### 5. Run Tests

To run the unit tests:

`npm run test`

## Available Scripts

| Script           | Usage                  | Explanation                                                                                                                                                        |
| :--------------- | :--------------------- | :----------------------------------------------------------------------------------------------------------------------------------------------------------------- |
| **init**         | `npm run init`         | Install all necessary dependencies.                                                                                                                                |
| **dev**          | `npm run dev`          | Starts the development server on [localhost:3000](http://localhost:3000). HMR (Hot Module Replacement) is enabled.                                                 |
| **build**        | `npm run build`        | Builds the production version of the app. First compiles TypeScript files (`tsc -b`), then bundles the project using Vite. Output is located in the `dist` folder. |
| **lint**         | `npm run lint`         | Runs [ESLint](https://eslint.org/) on the project files to detect code quality issues.                                                                             |
| **start**        | `npm run start`        | Serves the production build locally to verify the output before deploying.                                                                                         |
| **format**       | `npm run format`       | Formats all files in the `src/` folder using [Prettier](https://prettier.io/), applying the project’s formatting rules.                                            |
| **format:check** | `npm run format:check` | Checks if the code is properly formatted without making any changes. Useful for CI/CD pipelines.                                                                   |
| **stylelint**    | `npm run stylelint`    | Runs [Stylelint](https://stylelint.io/) on `.css` and `.scss` files to automatically fix style issues.                                                             |
| **prepare**      | `npm run prepare`      | Initializes Git hooks using [Husky](https://typicode.github.io/husky/). This script runs automatically after installing dependencies.                              |
| **test**         | `npm run test`         | Executes tests using [Jest](https://jestjs.io/). Looks for test files inside the `src/` folder with `.test.tsx`/`.test.ts` extensions.                             |

## Technology Stack

|   Technology    |                                                                             Version                                                                              |
| :-------------: | :--------------------------------------------------------------------------------------------------------------------------------------------------------------: |
|   **NextJS**    |                       [![NextJS](https://img.shields.io/badge/NextJS-^15.5.2-61DAFB?logo=nextdotjs&logoColor=white)](https://nextjs.org/)                        |
|    **React**    |                           [![React](https://img.shields.io/badge/React-^19.1.0-61DAFB?logo=react&logoColor=white)](https://react.dev/)                           |
| **TypeScript**  |             [![TypeScript](https://img.shields.io/badge/TypeScript-~5.7.2-3178C6?logo=typescript&logoColor=white)](https://www.typescriptlang.org/)              |
| **Material UI** |                      [![Material-UI](https://img.shields.io/badge/Material--UI-v7.3.2-blue.svg?logo=mui&logoColor=white)](https://mui.com/)                      |
|     **CSS**     |                     [![CSS](https://img.shields.io/badge/CSS-v3-639?logo=css&logoColor=fff)](https://www.w3.org/Style/CSS/Overview.en.html)                      |
|   **Vitest**    |                         [![Vitest](https://img.shields.io/badge/Vitest-^3.2.4-C21325?logo=vitest&logoColor=white)](https://vitest.dev/)                          |
|    **Jotai**    |                           [![Jotai](https://img.shields.io/badge/Jotai-^2.13.1-646CFF?logo=jotai&logoColor=white)](https://jotai.org/)                           |
|  **Supabase**   |                     [![Supabase](https://img.shields.io/badge/Supabase-^2.57.1-646CFF?logo=supabase&logoColor=white)](https://supabase.com/)                     |
|   **i18next**   |                     [![i18next](https://img.shields.io/badge/i18next-^2.57.1-646CFF?logo=i18next&logoColor=white)](https://www.i18next.com/)                     |
|   **ESLint**    |                         [![ESLint](https://img.shields.io/badge/ESLint-^9.26.0-4B32C3?logo=eslint&logoColor=white)](https://eslint.org/)                         |
|  **Prettier**   |                      [![Prettier](https://img.shields.io/badge/Prettier-^3.6.2-F7B93E?logo=prettier&logoColor=white)](https://prettier.io/)                      |
| **Commitlint**  |               [![Commitlint](https://img.shields.io/badge/Commitlint-^19.8.1-3F51B5?logo=commitlint&logoColor=white)](https://commitlint.js.org/)                |
| **Lint-staged** | [![Lint-staged](https://img.shields.io/badge/Lint--staged-^16.1.6-DB7093?logo=githubactions&logoColor=white)](https://github.com/lint-staged/lint-staged#readme) |
|    **Husky**    |                    [![Husky](https://img.shields.io/badge/Husky-^9.1.7-5D3A00?logo=husky&logoColor=white)](https://typicode.github.io/husky/)                    |
|   **Node.js**   |                      [![Node.js](https://img.shields.io/badge/Node.js-v22.15.0-339933?logo=node.js&logoColor=white)](https://nodejs.org/en)                      |
|   **GitHub**    |                       [![GitHub](https://img.shields.io/badge/GitHub-Repository-181717?logo=github&logoColor=white)](https://github.com/)                        |

## Authors

- [Dmitry Starchenko](https://github.com/dmitrystarchenko)
- [Bubnov Roma](https://github.com/bubnov-roma)
- [Husan Abdigafurov](https://github.com/husanGuru)
