/* eslint-disable import/no-extraneous-dependencies */
/* eslint-disable @typescript-eslint/no-namespace */
import GroupName from "../../src/types/GroupName"
import generateBichardJwt from "./generateBichardJwt"

Cypress.Commands.add("setAuthCookie", (username: string) => {
  const groups: GroupName[] = ["ExceptionHandler", "TriggerHandler"]
  const user = {
    username: username,
    inclusionList: ["B01", "B41ME00"],
    exclusionList: [],
    visible_courts: ["B01", "B41ME00"],
    visible_forces: [],
    excluded_triggers: [],
    groups: groups
  }

  const authJwt = generateBichardJwt(user)
  console.log(authJwt)
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
