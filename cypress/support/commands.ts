/* eslint-disable import/no-extraneous-dependencies */
/* eslint-disable @typescript-eslint/no-namespace */
import GroupName from "../../src/types/GroupName"
import generateBichardJwt from "./generateBichardJwt"
import getUser from "../../src/services/getUser"

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

Cypress.Commands.add("loginAs", (username: string) => {
  cy.visit("/")

  const email = `${username}@example.com`

  cy.get("#email").type(email)
  cy.get("button[type='submit']").click()

  // // TODO: Implement with cypress async behaviour
  const verificationCode = await getUser()

  cy.get("#validationCode").type("012345")
  cy.get("#password").type("password")
  cy.get("button[type='submit']").click()
})

declare global {
  namespace Cypress {
    interface Chainable {
      setAuthCookie(username: string): Chainable<Element>
      findByText(text: string): Chainable<Element>
      loginAs(username: string): Chainable<Element>
    }
  }
}

export {}
