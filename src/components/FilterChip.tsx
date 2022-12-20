import type { Dispatch } from "react"
import type { FilterAction } from "types/CourtCaseFilter"

interface Props {
  chipLabel: string
  dispatch: Dispatch<FilterAction>
  removeAction: () => FilterAction
}

const FilterChip: React.FC<Props> = ({ chipLabel, dispatch, removeAction }: Props) => {
  return (
    <li>
      <button className="moj-filter__tag" onClick={() => dispatch(removeAction())}>
        <span className="govuk-visually-hidden">{"Remove this filter"}</span>
        {chipLabel}
      </button>
    </li>
  )
}

export default FilterChip
