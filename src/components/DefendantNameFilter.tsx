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
