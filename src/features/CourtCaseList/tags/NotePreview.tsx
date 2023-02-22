/* eslint-disable jsx-a11y/no-static-element-interactions */
/* eslint-disable jsx-a11y/click-events-have-key-events */
import { DefaultUpChevron } from "components/icons/NotePreviewChevron"
import If from "components/If"
import { format } from "date-fns"
import { useState } from "react"
import { createUseStyles } from "react-jss"
import Note from "services/entities/Note"
import { displayedDateFormat } from "utils/formattedDate"

interface Props {
  latestNote: string | string[]
  displayDate: string
  switcher: () => void
}
// Modify componenet to use gds accordion and details pattern
// Number of notes(userNotes)
// Accordion button
// Preview 100 lines with elipse ... props.notes.noteText.splice(0,100)
// Preview box needs stylings to have z-index to span 2 columns

const useStyles = createUseStyles({
  wrapper: {
    // maxWidth: "87px"
  },
  buttonContainer: {
    color: "#1d70b8",
    display: "flex"
  },
  notePreviewContainer: {
    backgroundColor: "#F3F2F1"
  },
  notePreview: {}
})

export const PreviewNotes = ({ latestNote, displayDate, switcher }: Props) => {
  const classes = useStyles()

  return (
    <>
      <div className={classes.wrapper}>
        <div className={classes.notePreviewContainer}>
          <p className="govuk-body-s">{`Last note added ${displayDate}`}</p>
          <p className={`${classes.notePreview} ${classes.notePreviewContainer} govuk-body-s`}>{latestNote}</p>
        </div>
      </div>
    </>
  )
}
export const HideNotes = () => {
  const classes = useStyles()

  return (
    <>
      <div className={classes.buttonContainer}>
        <DefaultUpChevron />
        <span style={{ paddingLeft: "4px" }}>{"Preview"}</span>
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
  const classes = useStyles()

  return (
    <>
      <If condition={!!userNotes}>
        {userNotes > 1 ? `${userNotes} notes` : `${userNotes} note`}
        <div className={classes.buttonContainer}>
          <DefaultUpChevron />
          <span style={{ paddingLeft: "4px" }}>{"Hide"}</span>
        </div>
        {/* <div onClick={() => setLabelText(!labelText)}>
          {labelText ? (
            // <PreviewNotes
            //   latestNote={mostRecentNoteText.slice(0, 100)}
            //   displayDate={format(validatedLatestNoteCreatedDate, displayedDateFormat)}
            />
          ) : (
            <HideNotes />
          )}
        </div> */}
      </If>
    </>
  )
}

export default NotePreview
