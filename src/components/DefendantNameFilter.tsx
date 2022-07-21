// @ts-nocheck
// Typescript type checking breaks when using SearchBox.Input and SearchBox.Button,
// for now we disable type checking for this file as it is a proof of concept

import { GridCol, GridRow, SearchBox } from "govuk-react"

const DefendantNameFilter = () => (
  <form method={"get"}>
    <GridRow>
      <GridCol setWidth={"two-thirds"}>
        <SearchBox>
          <SearchBox.Input placeholder="Search defendants by name" name={"defendant"} />
          <SearchBox.Button />
        </SearchBox>
      </GridCol>
    </GridRow>
  </form>
)

export default DefendantNameFilter
