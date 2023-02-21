import { useCustomStyles } from "../../../styles/customStyles"

interface Props {
  tag: string
  href: string
}

const FilterTag: React.FC<Props> = ({ tag, href }: Props) => {
  const classes = useCustomStyles()
  return (
    <a className={`moj-filter__tag ${classes["dark-grey-filter-tag"]}`} href={href}>
      <span className="govuk-visually-hidden">{`Remove ${tag} filter`}</span>
      {tag}
    </a>
  )
}

export default FilterTag
