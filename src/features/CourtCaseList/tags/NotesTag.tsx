import If from "components/If"
import { Tag } from "govuk-react"
import Note from "services/entities/Note"

const NotesTag: React.FC<{ notes: Note[] }> = (props: { notes: Note[] }) => {
  const userNotes = props.notes ? props.notes.filter((note) => note.userId !== "System").length : 0
  return (
    <If isRendered={!!userNotes}>
      <Tag tint="BLUE">{userNotes}</Tag>
    </If>
  )
}

export default NotesTag
