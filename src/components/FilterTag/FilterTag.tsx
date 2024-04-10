import styled from "styled-components"
import { darkGrey } from "utils/colours"

const StyledA = styled.a`
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
  tag: string
  href: string
}

const FilterTag: React.FC<Props> = ({ tag, href }: Props) => {
  const tagId = `filter-tag-${tag.replace(" ", "-").toLowerCase()}`

  return (
    <StyledA id={tagId} className={`moj-filter__tag dark-grey-filter-tag`} href={href}>
      <span className="govuk-visually-hidden">{`Remove ${tag} filter`}</span>
      {tag}
    </StyledA>
  )
}

export default FilterTag
