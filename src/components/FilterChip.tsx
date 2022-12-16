/* eslint-disable jsx-a11y/anchor-is-valid */
/* eslint-disable jsx-a11y/no-static-element-interactions */
/* eslint-disable jsx-a11y/click-events-have-key-events */

import { MouseEvent } from "react"
interface Props {
  tag: string
  chipLabel: string
  paramName: string
  onClick: (option: string) => void
}

const FilterChip: React.FC<Props> = ({ tag, chipLabel, onClick }: Props) => {
  return (
    <a className={tag} onClick={(event: MouseEvent<HTMLInputElement>) => onClick(event.currentTarget.value)}>
      <span className="govuk-visually-hidden">{"Remove this filter"}</span>
      {chipLabel}
    </a>
  )
}

export default FilterChip
