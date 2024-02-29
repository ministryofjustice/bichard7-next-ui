import { useCustomStyles } from "../../../styles/customStyles"

interface Props {
  tag: string
  href: string
}

const FilterTag: React.FC<Props> = ({ tag, href }: Props) => {
  const classes = useCustomStyles()
  const tagId = `filter-tag-${tag.replace(" ", "-").toLowerCase()}`

  return (
    <a id={tagId} className={`moj-filter__tag ${classes["dark-grey-filter-tag"]}`} href={href}>
      <span className="govuk-visually-hidden">{`Remove ${tag} filter`}</span>
      {tag}
    </a>
  )
}

export default FilterTag
