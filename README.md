# ReXR

React SSR boilerplate using ES6, Fastify, RHL, Emotion, Webpack.
For those who love freedom to configure their own project.
Yarn for package management.
dotENV support for environment configuration.

 ## Requirements

- node `^10.14.1`
- yarn `^1.12.3`

1. **Install Node.js**: Our app is powered by [Node.js](https://nodejs.org/en/), duh.
3. **Install Yarn**: We use [yarn](https://yarnpkg.com) to handle our JavaScript dependencies. See [the yarn documentation](https://yarnpkg.com/en/docs/install) for instructions on installing it.

## Installation

1. Make sure you have fulfilled all the **requirements** above.
2. Run `yarn setup` to install all required dependencies
3. It's basically done! You can modify the .env files in each service folder, or just start the workflow.

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
| `test:client`           | To all client application code                                 |
| `type-check`            | To all typescript type is passed                               |

------
