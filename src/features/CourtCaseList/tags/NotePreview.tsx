import If from "components/If"
import { Tag } from "govuk-react"
import { useState } from "react"
import Note from "services/entities/Note"


const TempDetails: React.FC = () => {
  const [labelText, setLabelText] = useState(true)

  return (
    <details className="govuk-details" data-module="govuk-details">
      <summary className="govuk-details__summary">
        <button className="govuk-details__summary-text" onClick={() => setLabelText(!labelText)}>
          {labelText ? "Hide" : "Show"}
        </button>
      </summary>
      <div className="govuk-details__text">{"random details"}</div>
    </details>
  )
}
const NotePreview: React.FC<{ notes: Note[] }> = (props: { notes: Note[] }) => {
  const userNotes = props.notes ? props.notes.filter((note) => note.userId !== "System").length : 0

  return (
    // Modify componenet to use gds accordion and details pattern
    // Number of notes(userNotes)
    // Accordion button
    // Preview 100 lines with elipse ... props.notes.noteText.splice(0,100)
    // Preview box needs stylings to have z-index to span 2 columns
    <If condition={!!userNotes}>
      <TempDetails />
      <Tag tint="BLUE">{userNotes}</Tag>
    </If>
  )
}

export default NotePreview
