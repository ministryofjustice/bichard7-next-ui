import type { Dispatch } from "react"
import type { FilterAction, FilterState } from "types/CourtCaseFilter"
import { useCustomStyles } from "../../styles/customStyles"

interface Props {
  chipLabel: string
  dispatch: Dispatch<FilterAction>
  removeAction: () => FilterAction
  state: FilterState
}

const FilterChip: React.FC<Props> = ({ chipLabel, dispatch, removeAction, state }: Props) => {
  const classes = useCustomStyles()
  const buttonClass = "moj-filter__tag " + (state === "Applied" ? classes["dark-grey-filter-tag"] : "")
  return (
    <li>
      <button className={buttonClass} onClick={() => dispatch(removeAction())} style={{ cursor: "pointer" }}>
        <span className="govuk-visually-hidden">{"Remove this filter"}</span>
        {chipLabel}
      </button>
    </li>
  )
}

export default FilterChip
