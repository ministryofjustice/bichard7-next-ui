import If from "components/If"
import { Tag } from "govuk-react"

const NotesTag: React.FC<{ numNotes: number }> = (props: { numNotes: number }) => (
  <If condition={!props.numNotes}>
    <Tag tint="BLUE">{props.numNotes}</Tag>
  </If>
)

export default NotesTag
