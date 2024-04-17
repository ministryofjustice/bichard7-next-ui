import { Dispatch } from "react"
import { FilterAction, FilterState } from "types/CourtCaseFilter"
import { ButtonAlt } from "./FilterChip.styles"

interface Props {
  chipLabel: string
  dispatch: Dispatch<FilterAction>
  removeAction: () => FilterAction
  state: FilterState
}

const FilterChip: React.FC<Props> = ({ chipLabel, dispatch, removeAction, state }: Props) => {
  if (state === "Applied") {
    return (
      <li>
        <ButtonAlt
          type="button"
          className={"moj-filter__tag"}
          onClick={() => dispatch(removeAction())}
          style={{ cursor: "pointer" }}
        >
          <span className="govuk-visually-hidden">{"Remove this filter"}</span>
          {chipLabel}
        </ButtonAlt>
      </li>
    )
  }

  return (
    <li>
      <button
        type="button"
        className={"moj-filter__tag"}
        onClick={() => dispatch(removeAction())}
        style={{ cursor: "pointer" }}
      >
        <span className="govuk-visually-hidden">{"Remove this filter"}</span>
        {chipLabel}
      </button>
    </li>
  )
}

export default FilterChip
