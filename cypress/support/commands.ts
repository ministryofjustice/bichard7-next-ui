/* eslint-disable import/no-extraneous-dependencies */
/* eslint-disable @typescript-eslint/no-namespace */
import jwt from "jsonwebtoken"
import GroupName from "../../src/types/GroupName"

Cypress.Commands.add("setAuthCookie", (username: string) => {
  const groups: GroupName[] = ["ExceptionHandler", "TriggerHandler"]
  const authJwt = jwt.sign(
    {
      username,
      groups
    },
    "anySecret"
  )
  cy.setCookie(".AUTH", authJwt)
})

declare global {
  namespace Cypress {
    interface Chainable {
      setAuthCookie(username: string): Chainable<Element>
      findByText(text: string): Chainable<Element>
    }
  }
}

export {}
