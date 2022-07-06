/* eslint-disable import/no-extraneous-dependencies */
/* eslint-disable @typescript-eslint/no-namespace */
import jwt from "jsonwebtoken"

Cypress.Commands.add("setAuthCookie", (username: string) => {
  const authJwt = jwt.sign(
    {
      username
    },
    "anySecret"
  )
  cy.setCookie(".AUTH", authJwt)
})

declare global {
  namespace Cypress {
    interface Chainable {
      setAuthCookie(username: string): Chainable<Element>
    }
  }
}

export {}
