import If from "components/If"
import { Tag } from "govuk-react"

const LockedByTag: React.FC<{ lockedBy?: string | null }> = (props: { lockedBy?: string | null }) => {
  // TODO: add lock icon
  return (
    <If condition={!!props.lockedBy}>
      <Tag tint="BLUE" className="locked-by-tag">
        {props.lockedBy}
      </Tag>
    </If>
  )
}

export default LockedByTag
