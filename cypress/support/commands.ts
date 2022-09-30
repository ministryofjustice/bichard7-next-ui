Cypress.Commands.add("login", (emailAddress, password) => {
  cy.visit("/users")
  cy.get("input[type=email]").type(emailAddress)
  cy.get("button[type=submit]").click()
  cy.get("input#validationCode").should("exist")
  cy.task("getVerificationCode", emailAddress).then((verificationCode) => {
    cy.get("input#validationCode").type(verificationCode as string)
    cy.get("input#password").type(password)
    cy.get("button[type=submit]").click()
  })
})

declare global {
  namespace Cypress {
    interface Chainable {
      findByText(text: string): Chainable<Element>
      login(emailAddress: string, password: string): Chainable<Element>
    }
  }
}

export {}
