import React from "react"
import ColumnOrderIcons from "../../src/features/CourtCaseFilters/ColumnOrderIcons"

describe("ColumnOrderIcons.cy.tsx", () => {
  it("up arrow", () => {
    cy.mount(<ColumnOrderIcons columnName={"defendantName"} currentOrder={"asc"} orderBy={"defendantName"} />)
  })
  it("down arrow", () => {
    cy.mount(<ColumnOrderIcons columnName={"defendantName"} currentOrder={"desc"} orderBy={"defendantName"} />)
  })
  it("unordered arrows", () => {
    cy.mount(<ColumnOrderIcons columnName={"defendantName"} currentOrder={"asc"} orderBy={"courtName"} />)
  })
})
