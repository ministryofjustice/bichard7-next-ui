import CaseDetailsTab from "types/CaseDetailsTab"

export function confirmFiltersAppliedContains(filterTag: string) {
  cy.get(".moj-filter-tags a.moj-filter__tag").contains(filterTag)
}

export const exactMatch = (keyword: string): RegExp => {
  return new RegExp("^" + keyword + "$")
}

export const confirmMultipleFieldsDisplayed = (fields: string[]) => {
  fields.forEach((field) => {
    cy.contains(field)
  })
}

export const confirmMultipleFieldsNotDisplayed = (fields: string[]) => {
  fields.forEach((field) => {
    cy.contains(field).should("not.exist")
  })
}

export const removeFilterChip = () => {
  cy.get("li button.moj-filter__tag").trigger("click")
  cy.get(".moj-filter__tag").should("not.exist")
}

export const filterByCaseAge = (caseAgeId: string) => {
  cy.get("#case-age").click()
  cy.get(caseAgeId).click()
}

export const filterByDateRange = (dateFrom: string, dateTo: string) => {
  cy.get("#date-range").click()

  cy.get("#date-from").click()
  cy.get("#date-from").type(dateFrom)

  cy.get("#date-to").click()
  cy.get("#date-to").type(dateTo)
}

export const loginAndGoToUrl = (emailAddress = "bichard01@example.com", url = "/bichard") => {
  cy.login(emailAddress, "password")
  cy.visit(url)
}

export const clickTab = (tab: CaseDetailsTab) => {
  cy.contains(tab).click()
  cy.get("H3").contains(tab)
}
