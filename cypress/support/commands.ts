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
  cy.session(
    [emailAddress, password],
    () => {
      cy.intercept("GET", "http://bichard7.service.justice.gov.uk/forces.js?forceID=***", {})

      login({ emailAddress, password })
    },
    {
      validate() {
        cy.visit("/bichard")
        cy.get("a.moj-header__navigation-link").eq(1).should("have.text", "Sign out")
      }
    }
  )
})

Cypress.Commands.add("checkCsrf", (url, method) => {
  cy.request({
    failOnStatusCode: false,
    method,
    url,
    headers: {
      cookie: "CSRFToken%2Flogin=JMHZOOog-n0ZMO-UfRCZTCUxiQutsEeLpS8I.CJOHfajQ2zDKOZPaBh5J8VT%2FK4UrG6rB6o33VIvK04g"
    },
    form: true,
    followRedirect: false,
    body: {
      CSRFToken:
        "CSRFToken%2Flogin=1629375460103.JMHZOOog-n0ZMO-UfRCZTCUxiQutsEeLpS8I.7+42/hdHVuddtxLw8IvGvIPVhkFj6kbvYukS1mGm64o"
    }
  }).then((withTokensResponse) => {
    expect(withTokensResponse.status).to.eq(403)
    cy.request({
      failOnStatusCode: false,
      method,
      url,
      form: true,
      followRedirect: false
    }).then((withoutTokensResponse) => {
      expect(withoutTokensResponse.status).to.eq(403)
    })
  })
})

declare global {
  // eslint-disable-next-line @typescript-eslint/no-namespace
  namespace Cypress {
    interface Chainable {
      findByText(text: string): Chainable<Element>
      login(emailAddress: string, password: string): Chainable<Element>
      checkCsrf(url: string, method: string): Chainable<Element>
    }
  }
}

export {}
