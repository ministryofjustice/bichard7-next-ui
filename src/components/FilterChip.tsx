import type { Dispatch } from "react"
import { createUseStyles } from "react-jss"
import type { FilterAction, FilterState } from "types/CourtCaseFilter"
import { darkGray } from "utils/colours"

interface Props {
  chipLabel: string
  dispatch: Dispatch<FilterAction>
  removeAction: () => FilterAction
  state: FilterState
}

const useStyles = createUseStyles({
  appliedFilter: {
    backgroundColor: darkGray,
    color: "#ffffff",
    "&:hover": {
      backgroundColor: darkGray,
      color: "#ffffff"
    },
    "&:after": {
      backgroundImage: "url(/bichard/moj_assets/images/icon-tag-remove-cross-white.svg)"
    }
  }
})

const FilterChip: React.FC<Props> = ({ chipLabel, dispatch, removeAction, state }: Props) => {
  const classes = useStyles()
  const buttonClass = "moj-filter__tag " + (state === "Applied" ? classes.appliedFilter : "")
  return (
    <li>
      <button className={buttonClass} onClick={() => dispatch(removeAction())}>
        <span className="govuk-visually-hidden">{"Remove this filter"}</span>
        {chipLabel}
      </button>
    </li>
  )
}

export default FilterChip
