# REST Client app (PUTMAN)

## Description

The final project of the React Q3 2025 course from RSSchool.
PUTMAN is a universal testing, development, and REST API platform. It provides a clean interface that replaces disparate tools like Postman, Curl, and the command line, bringing together everything you need to work with an API into one powerful yet simple web application.

PUTMAN is positioned as a "Swiss knife" for backend developers, QA engineers and API designers. Unlike heavy desktop applications, PUTMAN works directly in the browser, without requiring installation, and offers a modern, minimalist UI.

The key idea is not just to send requests, but to manage the entire life cycle of interaction with the API: from writing and debugging individual requests to organizing collections, automated testing, documentation and monitoring the health (health check) of your services.

## Purposes

1. **Functional client for sending requests:** Support for all major HTTP methods (GET, POST, PUT, PATCH, DELETE, etc.).
2. **Managing request headers and body:** Simple interface for adding, editing and deleting headers. Support for various body types (JSON, XML, form-data, plain text).
3. **Saving and organizing requests:** Ability to create collections and folders to group requests by projects or functionality.
4. **Saving environment variables:** Ability to set global and local variables (e.g. base_url, api_key) for easy switching between development, staging and production environments.
5. **Convenient response viewing:** Formatted JSON/XML output, syntax highlighting, viewing response headers, status code and execution time.

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

## Mentors

- [Alexei Skutov](https://github.com/KaPuTaH-UluTka)
- [Igor Shaymukhametov](https://github.com/knyazigor)

<a href="https://rs.school/"><img width="50" height="50" src="https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcRTrImqYFcE49SmOYUm5jaqXz4L8UC0QFBrbQ&s" alt="RSSchool" title="RSSchool"/></a>
