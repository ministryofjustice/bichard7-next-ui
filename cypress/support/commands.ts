const login = ({ emailAddress, password }: { emailAddress: string; password: string }) => {
  let runningWithProxy: boolean
  if (Cypress.config("baseUrl") !== "https://localhost:4443") {
    console.log(`Running with proxy: ${Cypress.config("baseUrl")}`)
    runningWithProxy = true
  } else {
    console.log(`Running locally: ${Cypress.config("baseUrl")}`)
    runningWithProxy = false
  }

  cy.visit(runningWithProxy ? "https://localhost:4443/users" : "/users")
  cy.get("input[type=email]").type(emailAddress)
  cy.get("button[type=submit]").click()
  cy.get("input#validationCode").should("exist")
  cy.task("getVerificationCode", emailAddress).then((verificationCode) => {
    cy.get("input#validationCode").type(verificationCode as string)
    cy.get("input#password").type(password)
    cy.get("button[type=submit]").click()
  })
}

Cypress.Commands.add("login", (emailAddress, password) => {
  cy.session([emailAddress, password], () => {
    cy.intercept("GET", "http://bichard7.service.justice.gov.uk/forces.js?forceID=***", {})

    login({ emailAddress, password })
  })
})

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
