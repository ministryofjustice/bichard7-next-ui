/* eslint-disable jsx-a11y/no-static-element-interactions */
/* eslint-disable jsx-a11y/click-events-have-key-events */
import If from "components/If"
import { useState } from "react"
import Note from "services/entities/Note"
import { createUseStyles } from "react-jss"

const useStyles = createUseStyles({
  expandingButtonContainer: {
    color: "#1d70b8"
  },
  expandingButton: {}
})

const TempDetails: React.FC = () => {
  const classes = useStyles()
  const [labelText, setLabelText] = useState(false)
  const HideNotes = () => {
    return (
      <>
        <div className={classes.expandingButtonContainer}>
          <span className="govuk-accordion-nav__chevron govuk-accordion-nav__chevron--down"></span>
          <span className={classes.expandingButton}>{"Preview"}</span>
        </div>
      </>
    )
  }

  const PreviewNotes = () => {
    return (
      <>
        <div className={classes.expandingButtonContainer}>
          <span className="govuk-accordion-nav__chevron govuk-accordion-nav__chevron--up"></span>
          <span className={classes.expandingButton}>{"Hide"}</span>
        </div>
        <div className="dummy-class">{"Lorem ipsum dolor sit, amet consectetur adipisicing elit."}</div>
      </>
    )
  }

  return (
    <>
      <div className="dummy-class" onClick={() => setLabelText(!labelText)}>
        {labelText ? <HideNotes /> : <PreviewNotes />}
      </div>
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
