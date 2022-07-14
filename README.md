This is a [Next.js](https://nextjs.org/) project bootstrapped with [`create-next-app`](https://github.com/vercel/next.js/tree/canary/packages/create-next-app).

## Getting Started

First, install the requirements:

```shell
npm i --dev
npm run install:assets
npm run build
```

Then, run the development server:

```shell
npm run dev
```

Open [http://localhost:4080/bichard](http://localhost:4080/bichard) with your browser to see the Bichard7 UI. Database and a valid auth token is required to be able to browse the service locally.

### Running the database, user-service and nginx-auth-proxy

To spin up a local instance of the database, user-service and auth proxy, you can use the following make targets in the [main bichard repo](https://github.com/ministryofjustice/bichard7-next):

```shell
$ cd /path/to/bichard7-next
$ make run-pg && make run-user-service && make run-nginx-auth-proxy
```
Once the dependencies follow the login instruction from the `bichard7-next` repo:
1. Navigate to the User Service at [https://localhost:4443/users/](https://localhost:4443/users/) and sign in:
   > User: <your-madetech-email>, Pass: password
   **N.B.** You can use the `./scripts/get_2fa_email_link.sh` to quickly grab the one-time email verification link from the user-service container logs.
1. After signing in, you should see the User Service home page. An `.AUTH` cookie is generated for localhost, so now you can access Bichard7 UI on [http://localhost:4080/bichard](http://localhost:4080/bichard)

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

This is a link to our [chromatic](https://www.chromatic.com/builds?appId=62ce99495ed8d3db63b60dab) dashboard

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
