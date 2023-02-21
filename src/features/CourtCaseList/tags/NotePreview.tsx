/* eslint-disable jsx-a11y/no-static-element-interactions */
/* eslint-disable jsx-a11y/click-events-have-key-events */
import { DefaultDownChevron, DefaultUpChevron } from "components/icons/NotePreviewChevron"
import If from "components/If"
import { format } from "date-fns"
import { useState } from "react"
import { createUseStyles } from "react-jss"
import Note from "services/entities/Note"
import { displayedDateFormat } from "utils/formattedDate"

interface Props {
  latestNote: string | string[]
  displayDate: string
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
  expandingButton: {},
  notePreviewContainer: {
    paddingBottom: "200px",
    backgroundColor: "#F3F2F1"
  },
  notePreview: {
    zIndex: "1",
    maxWidth: "215px",
    position: "absolute"
  }
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

export const PreviewNotes = ({ latestNote, displayDate }: Props) => {
  const classes = useStyles()

  return (
    <>
      <div className={classes.expandingButtonContainer}>
        <DefaultUpChevron />
        <span className={classes.expandingButton}>{"Hide"}</span>
      </div>
      <div className={classes.notePreviewContainer}>
        <p className="govuk-body govuk-!-font-weight-bold">{`Note added ${displayDate}`}</p>
        <p className={classes.notePreview}>{latestNote}</p>
      </div>
    </>
  )
}

const NotePreview: React.FC<{ notes: Note[] }> = (props: { notes: Note[] }) => {
  const userNotes = props.notes ? props.notes.filter((note) => note.userId !== "System").length : 0
  const allNotes = props.notes.map((note) => note.createdAt)
  const latestNoteCreatedDate = allNotes.sort().slice(-1)[0]
  const validatedLatestNoteCreatedDate = new Date(latestNoteCreatedDate.toString().slice(0, 10))
  const mostRecentNote = props.notes.filter((note) => note.createdAt === latestNoteCreatedDate)
  const mostRecentNoteText = mostRecentNote[0].noteText
  const [labelText, setLabelText] = useState(false)

  return (
    <>
      <If condition={!!userNotes}>
        {userNotes > 1 ? `${userNotes} notes` : `${userNotes} note`}
        <div className="dummy-class" onClick={() => setLabelText(!labelText)}>
          {labelText ? (
            <PreviewNotes
              latestNote={mostRecentNoteText.slice(0, 100)}
              displayDate={format(validatedLatestNoteCreatedDate, displayedDateFormat)}
            />
          ) : (
            <HideNotes />
          )}
        </div>
      </If>
    </>
  )
}

export default NotePreview
