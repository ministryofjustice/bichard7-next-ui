This is a [Next.js](https://nextjs.org/) project bootstrapped with [`create-next-app`](https://github.com/vercel/next.js/tree/canary/packages/create-next-app).

## Getting Started

First, install the requirements:

```shell
npm i --dev
npm run install:assets
```

Then, run the development server:

```shell
npm run dev
# or
yarn dev
```

Open [http://localhost:3000](http://localhost:3000) with your browser to see the result.

You can start editing the page by modifying `pages/index.tsx`. The page auto-updates as you edit the file.

[API routes](https://nextjs.org/docs/api-routes/introduction) can be accessed on [http://localhost:3000/api/hello](http://localhost:3000/api/hello). This endpoint can be edited in `pages/api/hello.ts`.

The `pages/api` directory is mapped to `/api/*`. Files in this directory are treated as [API routes](https://nextjs.org/docs/api-routes/introduction) instead of React pages.

## Development

To run the tests, ensure that you have a local postgres instance running (run `make run-pg` from the `bichard7-next` repo),
then run `npm run test`

## Testing

### Unit Testing

#### Code-based

To run code-based (non-visual, no components get rendered) unit tests, run

```bash
    npm run test:unit
```

#### Visual

We are using [Storybook](https://storybook.js.org/) to develop our  UI components in isolation. 

If you're already running storybook (`npm run storybook`) locally, run in a seperate terminal

```bash
    npm run test:ui:unit:dev
```

or simply

```bash
    npm run test-storybook
```

For CI or otherwise, run (requires `npx playwright install` to be run first sometimes)

```bash
    npm run test:ui:unit:ci
```
We are using [chromatic](https://www.chromatic.com/) to help document visual changes when we merge changes to main branch
If you need to do any local storybook componets to chromatic (from your local branch) run
```bash
    npx chromatic --project-token <your-project-toke>
```
By logging into chromatic using the shared MoJ github account, under bichard-next-ui click on `Manage` tab and select `Configure` to find the project token

### Integration/E2e Testing

#### Integration

Code-based integration tests to be run alongside the bichard7-next `postgres` instance

```bash
    npm run test:integration
```

#### E2E

Browser-based E2E cypress tests to be run alongside the bichard7-next `postgres` instance

```bash
    npm run test:ui:e2e
```
