Cypress.Commands.add("login", (emailAddress, password) => {
  cy.intercept("GET", "http://bichard7.service.justice.gov.uk/forces.js?forceID=***", {})

  const loginUrl = "https://localhost:4443"
  if (Cypress.config("baseUrl") !== loginUrl) {
    console.log(`Running locally: ${Cypress.config("baseUrl")}`)
    cy.origin(loginUrl, { args: { emailAddress, password } }, login)
  } else {
    console.log(`Running with proxy: ${Cypress.config("baseUrl")}`)
    login({ emailAddress, password })
  }
})

const login = ({ emailAddress, password }: { emailAddress: string; password: string }) => {
  cy.visit("/users")
  cy.get("input[type=email]").type(emailAddress)
  cy.get("button[type=submit]").click()
  cy.get("input#validationCode").should("exist")
  cy.task("getVerificationCode", emailAddress).then((verificationCode) => {
    cy.get("input#validationCode").type(verificationCode as string)
    cy.get("input#password").type(password)
    cy.get("button[type=submit]").click()
  })
}

declare global {
  // eslint-disable-next-line @typescript-eslint/no-namespace
  namespace Cypress {
    interface Chainable {
      findByText(text: string): Chainable<Element>
      login(emailAddress: string, password: string): Chainable<Element>
    }
  }
}

export {}
