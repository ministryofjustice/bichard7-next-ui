import If from "components/If"
import { Tag } from "govuk-react"

const UrgentTag: React.FC<{ isUrgent: boolean }> = (props: { isUrgent: boolean }) => (
  <If isRendered={props.isUrgent}>
    <Tag tint="RED">{"Urgent"}</Tag>
  </If>
)

export default UrgentTag
