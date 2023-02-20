/* eslint-disable jsx-a11y/no-static-element-interactions */
/* eslint-disable jsx-a11y/click-events-have-key-events */
import If from "components/If"
import { useState } from "react"
import Note from "services/entities/Note"
import { createUseStyles } from "react-jss"
import { DefaultDownChevron, DefaultUpChevron } from "components/icons/NotePreviewChevron"

interface Props {
  sampleText: string | string[]
}
// Modify componenet to use gds accordion and details pattern
// Number of notes(userNotes)
// Accordion button
// Preview 100 lines with elipse ... props.notes.noteText.splice(0,100)
// Preview box needs stylings to have z-index to span 2 columns
const useStyles = createUseStyles({
  expandingButtonContainer: {
    color: "#1d70b8"
  },
  expandingButton: {}
})

export const HideNotes = () => {
  const classes = useStyles()

  return (
    <>
      <div className={classes.expandingButtonContainer}>
        <DefaultDownChevron />
        <span className={classes.expandingButton}>{"Preview"}</span>
      </div>
    </>
  )
}

export const PreviewNotes = ({ sampleText }: Props) => {
  const classes = useStyles()

  return (
    <>
      <div className={classes.expandingButtonContainer}>
        <DefaultUpChevron />
        <span className={classes.expandingButton}>{"Hide"}</span>
      </div>
      <div className="dummy-class">{sampleText}</div>
    </>
  )
}

const NotePreview: React.FC<{ notes: Note[] }> = (props: { notes: Note[] }) => {
  const userNotes = props.notes ? props.notes.filter((note) => note.userId !== "System").length : 0
  const allNotes = props.notes.map((note) => note.createdAt)
  const mostRecentNoteCreatedAtValue = allNotes.sort().slice(-1)[0]
  const mostRecentNote = props.notes.filter((note) => note.createdAt === mostRecentNoteCreatedAtValue)
  const mostRecentNoteText = mostRecentNote[0].noteText

  const [labelText, setLabelText] = useState(false)

  return (
    <>
      <If condition={!!userNotes}>
        {userNotes > 1 ? `${userNotes} notes` : `${userNotes} note`}
        <div className="dummy-class" onClick={() => setLabelText(!labelText)}>
          {labelText ? <PreviewNotes sampleText={mostRecentNoteText} /> : <HideNotes />}
        </div>
      </If>
    </>
  )
}

export default NotePreview
