import { SearchBox } from "govuk-react"

interface Props {
  defendantName?: string
}

const DefendantNameFilter = (props: Props) => {
  /* eslint-disable  @typescript-eslint/no-non-null-assertion */
  const Input = SearchBox.Input!
  const Button = SearchBox.Button!
  return (
    <>
      <SearchBox>
        <Input placeholder="Search defendants by name" name={"defendant"} defaultValue={props.defendantName} />
        <Button />
      </SearchBox>
    </>
  )
}

export default DefendantNameFilter
