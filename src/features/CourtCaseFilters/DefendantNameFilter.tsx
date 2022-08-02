// @ts-nocheck
// Typescript type checking breaks when using SearchBox.Input and SearchBox.Button,
// for now we disable type checking for this file as it is a proof of concept

import { SearchBox } from "govuk-react"

interface Props {
  defendantName?: string
}

const DefendantNameFilter = (props: Props) => (
  <>
    <SearchBox>
      <SearchBox.Input placeholder="Search defendants by name" name={"defendant"} defaultValue={props.defendantName} />
      <SearchBox.Button />
    </SearchBox>
  </>
)

export default DefendantNameFilter
