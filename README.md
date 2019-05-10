# ReXR

React SSR boilerplate using Typescript/ES6, Fastify, RHL, Emotion, Webpack.
For those who love freedom to configure their own project.
Yarn for package management.
dotENV support for environment configuration.

## Requirements

- node `^10.14.1`
- yarn `^1.12.3`

1. **Install Node.js**: Our app is powered by [Node.js](https://nodejs.org/en/), duh.
2. **Install Yarn**: We use [yarn](https://yarnpkg.com) to handle our JavaScript dependencies. See [the yarn documentation](https://yarnpkg.com/en/docs/install) for instructions on installing it.

## Workflow

1. Fork & Clone the repo to your local
2. Create new branch based on develop branch
3. Commit on your feature branch and push to your fork
4. Submit a PR then I will review your changes

NOTE: Be sure to pull latest update from "upstream" to develop branch and rebase to your feature branch before making a pull request!

### Development

- Run `yarn setup`, it will prepare all stuff to run the app on your local

- Open `./client` folder and add your feature folder inside `./clients/route/*`.

- Follow this folder structure

```sh
    ./client/routes/[featurex]/
    ├── __test__                       # Test cases for our components view
    ├── locales                        # Locale dictionary
    ├── components                     # View components, can .tsx file / folder for complex components
    ├── mutation                       # GQL mutation
    ├── queries                        # GQL query
    ├── style.ts                       # Custom style related for our components
    └── index.ts                       # Entry point of the feature, lazy load (split chunk)
```

- Add your feature on root of route which lies on `./client/routes/index.ts`

- Run `yarn dev:client` to see if CSR works perfectly or just `yarn dev` for a shortcut. Application will be run on port `3001` by default and can be customized by change this env value `CLIENT.PORT`.

- If need to support SSR then after you have done development please run `yarn dev:server` to check if SSR working properly. Server will be using port `3000` by default and can be customized by change this `PORT` value.


## Deployment

Use command `yarn build` to build all the assets that will be needed for our apps to running in production environment.

For now in production we will run our SSR server but turn off its SSR capability. So please use `PORT` env variable to customize where the server will be up.

## Scripts

| `yarn <script>`         | Description                                                    |
| ----------------------- | -------------------------------------------------------------- |
| `analyze:client`        | To analyze bundle of client                                    |
| `analyze:server`        | To analyze bundle of server                                    |
| `build:client`          | To build the frontend and web UI                               |
| `build:server`          | To build the server-side rendering                             |
| `dev`                   | Shortcut to use command `dev:client`                           |
| `dev:client`            | To develop the frontend and web UI using client-side rendering |
| `dev:server`            | To boot up the server-side rendering (require client to be up) |
| `setup`                 | To setup project for the first time                            |
| `test`                  | To test all client application code                            |
| `test:components`       | To test all client component unit test                         |
| `test:types`            | To check all typescript type is passed                         |

------
