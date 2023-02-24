import ConditionalRender from "components/ConditionalRender"
import { Tag } from "govuk-react"

const UrgentTag: React.FC<{ isUrgent: boolean }> = (props: { isUrgent: boolean }) => (
  <ConditionalRender isRendered={props.isUrgent}>
    <Tag tint="RED">{"Urgent"}</Tag>
  </ConditionalRender>
)

export default UrgentTag
