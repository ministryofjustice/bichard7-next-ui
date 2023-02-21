export function confirmFiltersAppliedContains(filterTag: string) {
  cy.get(".moj-filter-tags a.moj-filter__tag").contains(filterTag)
}
