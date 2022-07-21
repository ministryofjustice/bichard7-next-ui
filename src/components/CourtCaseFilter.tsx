import { Filter } from "types/CaseListQueryParams"
import DefendantNameFilter from "./CourtCaseFilters/DefendantNameFilter"
import { ResultFilter } from "./CourtCaseFilters/ResultFilter"

interface Props {
  defendantName?: string
  resultFilter: Filter
}

const CourtCaseFilter = (props: Props) => {
  return (
    <div>
      <DefendantNameFilter defendantName={props.defendantName} />
      <ResultFilter initialSelection={props.resultFilter} />
    </div>
  )
}

export default CourtCaseFilter
