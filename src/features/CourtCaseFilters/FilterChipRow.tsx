/* eslint-disable @typescript-eslint/no-non-null-assertion */
import FilterChip from "components/FilterChip"
import If from "components/If"
import { Dispatch } from "react"
import { FilterAction, FilterState } from "types/CourtCaseFilter"

interface Props {
  chipLabel: string
  condition: boolean
  dispatch: Dispatch<FilterAction>
  type: any
  label: string
  state: FilterState
  value: string | boolean
}

const FilterChipRow: React.FC<Props> = ({ chipLabel, condition, dispatch, type, label, state, value }: Props) => {
  return (
    <If condition={condition}>
      <h3 className="govuk-heading-s govuk-!-margin-bottom-0">{label}</h3>
      <ul className="moj-filter-tags govuk-!-margin-bottom-0">
        <FilterChip
          chipLabel={chipLabel}
          dispatch={dispatch}
          removeAction={() => {
            return { method: "remove", type: type, value: value }
          }}
          state={state}
        />
      </ul>
    </If>
  )
}

export default FilterChipRow
