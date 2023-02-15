import React from "react"
import ColumnOrderIcons from "../../src/features/CourtCaseFilters/ColumnOrderIcons"

describe("ColumnOrderIcons.cy.tsx", () => {
  it("playground", () => {
    cy.mount(<ColumnOrderIcons columnName={"defendantName"} currentOrder={"defendantName"} orderBy={"asc"} />)
  })
})
