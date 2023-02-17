/* eslint-disable jsx-a11y/no-static-element-interactions */
/* eslint-disable jsx-a11y/click-events-have-key-events */
import If from "components/If"
import { useState } from "react"
import Note from "services/entities/Note"

const TempDetails: React.FC = () => {
  const [labelText, setLabelText] = useState(true)
  const ShowNotes = () => {
    return (
      <>
        <span className="govuk-accordion-nav__chevron govuk-accordion-nav__chevron--down"></span>
        <span className="govuk-accordion__section-toggle-text">{"Show"}</span>
      </>
    )
  }

  const HideNotes = () => {
    return (
      <>
        <span className="govuk-accordion-nav__chevron govuk-accordion-nav__chevron--up"></span>
        <span className="govuk-accordion__section-toggle-text">{"Hide"}</span>
      </>
    )
  }

  return (
    <>
      <button onClick={() => setLabelText(!labelText)}>{labelText ? <ShowNotes /> : <HideNotes />}</button>
    </>
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
      {userNotes > 1 ? `${userNotes} notes` : `${userNotes} note`}
      <TempDetails />
    </If>
  )
}

export default NotePreview
