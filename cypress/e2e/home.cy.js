/// <reference types="cypress" />

describe("Home", () => {
  it("should display Welcome title", () => {
    // When
    cy.visit("/")
    // Then
    cy.get("h1").should("have.text", "Welcome to Bichard UI")
  })
})
