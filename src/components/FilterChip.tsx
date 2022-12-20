/* eslint-disable jsx-a11y/anchor-is-valid */
/* eslint-disable jsx-a11y/no-static-element-interactions */
/* eslint-disable jsx-a11y/click-events-have-key-events */

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
      <a className="moj-filter__tag" onClick={() => dispatch(removeAction())}>
        <span className="govuk-visually-hidden">{"Remove this filter"}</span>
        {chipLabel}
      </a>
    </li>
  )
}

export default FilterChip
