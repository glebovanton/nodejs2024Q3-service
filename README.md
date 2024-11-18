# Home Library Service

## To check this task you need:

1. Rename .env.example to .env
2. Run `npm install`
3. Run `npm start`
4. Check detailed instructions in `README.md`. +10
5. Run Docker-compose `docker compose up --build`
6. Docker check for vulnerabilities.
7. Check Users, Tracks, Albums, Artists, Favorites modules and their endpoints. +50
8. Check well passed tests. Run `npm run test`. +10
9. Check PORT value is stored into `.env` file. +10
10. Open http://localhost:4000/doc/ in your browser to see OpenAPI documentation +20
11. Check for forfeits:
   -670 Changes in tests
   -30% of max task score Commits after deadline (except commits that affect only Readme.md, .gitignore, etc.)
   -20 No separate development branch
   -20 No Pull Request
   -10 Pull Request description is incorrect
   -10 Every lint error after npm run lint using local config (errors, not warnings)
   -20 Less than 3 commits in the development branch, not including commits that make changes only to Readme.md or similar files (tsconfig.json, .gitignore, .prettierrc.json, etc.)

## Installation

```
npm install
```

## Prerequisites

- Git - [Download & Install Git](https://git-scm.com/downloads).
- Node.js - [Download & Install Node.js](https://nodejs.org/en/download/) and the npm package manager.

## Downloading

```
git clone {repository URL}
```

## Installing NPM modules

```
npm install
```

## Running application

```
npm start
```

After starting the app on port (4000 as default) you can open
in your browser OpenAPI documentation by typing http://localhost:4000/doc/.
For more information about OpenAPI/Swagger please visit https://swagger.io/.

## Testing

After application running open new terminal and enter:

To run all tests without authorization

```
npm run test
```

To run only one of all test suites

```
npm run test -- <path to suite>
```

To run all test with authorization

```
npm run test:auth
```

To run only specific test suite with authorization

```
npm run test:auth -- <path to suite>
```

### Auto-fix and format

```
npm run lint
```

```
npm run format
```

### Debugging in VSCode

Press <kbd>F5</kbd> to debug.

For more information, visit: https://code.visualstudio.com/docs/editor/debugging
