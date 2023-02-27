export function confirmFiltersAppliedContains(filterTag: string) {
  cy.get(".moj-filter-tags a.moj-filter__tag").contains(filterTag)
}

export const exactMatch = (keyword: string): RegExp => {
  return new RegExp("^" + keyword + "$")
}
