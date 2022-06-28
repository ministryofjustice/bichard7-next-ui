/// <reference types="cypress" />

describe("Home", () => {
  it("should display Welcome title", () => {
    // When
    cy.visit("/")
    // Then
    cy.get(".title").should("have.text", "Welcome to Bichard UI")
  })
})
