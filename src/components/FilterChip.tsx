/* eslint-disable jsx-a11y/anchor-is-valid */
/* eslint-disable jsx-a11y/no-static-element-interactions */

import { useRouter } from "next/router"
import { deleteQueryParam } from "utils/deleteQueryParam"

/* eslint-disable jsx-a11y/click-events-have-key-events */
interface Props {
  tag: string
  chipLabel: string
  paramName: string
}

const FilterChip: React.FC<Props> = ({ tag, chipLabel, paramName }: Props) => {
  const { query, basePath } = useRouter()

  const removeFilterParams = deleteQueryParam({ [paramName]: chipLabel }, query)
  const removeFilterUrl = `${basePath}/?${removeFilterParams}`

  return (
    <a className={tag} href={removeFilterUrl}>
      <span className="govuk-visually-hidden">{"Remove this filter"}</span>
      {chipLabel}
    </a>
  )
}

export default FilterChip
