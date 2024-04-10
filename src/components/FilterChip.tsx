import { Dispatch } from "react"
import styled from "styled-components"
import { FilterAction, FilterState } from "types/CourtCaseFilter"
import { darkGrey } from "utils/colours"

const Button = styled.button``
const ButtonAlt = styled.button`
  background: ${darkGrey};
  color: white;
  &:visited {
    color: white;
  }
  &:after {
    background-image: url(/bichard/moj_assets/images/icon-tag-remove-cross-white.svg);
  }
  &:link {
    color: white;
  }
`

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
      <Button
        type="button"
        className={"moj-filter__tag"}
        onClick={() => dispatch(removeAction())}
        style={{ cursor: "pointer" }}
      >
        <span className="govuk-visually-hidden">{"Remove this filter"}</span>
        {chipLabel}
      </Button>
    </li>
  )
}

export default FilterChip
