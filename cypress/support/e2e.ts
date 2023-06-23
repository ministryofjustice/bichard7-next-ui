// ***********************************************************
// This example support/e2e.ts is processed and
// loaded automatically before your test files.
//
// This is a great place to put global configuration and
// behavior that modifies Cypress.
//
// You can change the location of this file or turn off
// automatically serving support files with the
// 'supportFile' configuration option.
//
// You can read more here:
// https://on.cypress.io/configuration
// ***********************************************************

// Import commands.js using ES2015 syntax:
import "./commands"

// eslint-disable-next-line import/no-extraneous-dependencies
import "cypress-axe"
// eslint-disable-next-line import/no-extraneous-dependencies
import "@testing-library/cypress/add-commands"
import http from "http"

let server: http.Server<typeof http.IncomingMessage, typeof http.ServerResponse>

before(() => {
  server = http.createServer(async (_, res) => {
    res.writeHead(200, { "Content-Type": "application/json" })
    res.end()
  })
  server.listen(3010)
})

after(() => {
  server.close()
})
