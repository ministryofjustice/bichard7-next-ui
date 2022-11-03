interface Props {
  tag: string
  href: string
}

const FilterTag: React.FC<Props> = ({ tag, href }: Props) => {
  return (
    <a className="moj-filter__tag" href={href}>
      <span className="govuk-visually-hidden">{`Remove ${tag} filter`}</span>
      {tag}
    </a>
  )
}

export default FilterTag
