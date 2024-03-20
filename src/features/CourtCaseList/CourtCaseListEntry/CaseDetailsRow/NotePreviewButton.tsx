import { Preview } from "components/Preview"
import { truncate } from "lodash"
import { Dispatch, SetStateAction } from "react"
import { DisplayNote } from "types/display/Notes"
import ConditionalRender from "../../../../components/ConditionalRender"
import PreviewButton from "../../../../components/PreviewButton"
import { validateMostRecentNoteDate } from "./CourtCaseListEntryHelperFunction"
import { createUseStyles } from "react-jss"

interface NotePreviewProps {
  latestNote: DisplayNote
  numberOfNotes: number
}

interface NotePreviewButtonProps {
  previewState: boolean
  setShowPreview: Dispatch<SetStateAction<boolean>>
  numberOfNotes: number
}

const useStyles = createUseStyles({
  notePreview: {
    "&.govuk-accordion__show-all": {
      fontSize: "16px"
    }
  },
  notePreviewHeading: {
    fontSize: "14px"
  },
  notePreviewBody: {
    fontSize: "16px"
  }
})
export const NotePreview = ({ latestNote, numberOfNotes }: NotePreviewProps) => {
  const displayDate = validateMostRecentNoteDate(latestNote)
  const classes = useStyles()

  return (
    <Preview>
      <p className={`govuk-body govuk-!-font-weight-bold note-preview-heading ${classes.notePreviewHeading}`}>
        {numberOfNotes > 1 ? `Most recent note added ${displayDate}` : `Note added ${displayDate}`}
      </p>
      <p className={`note-preview-body ${classes.notePreviewBody}`}>
        {truncate(latestNote?.noteText, { length: 100 })}
      </p>
    </Preview>
  )
}

export const NotePreviewButton: React.FC<NotePreviewButtonProps> = (props: NotePreviewButtonProps) => {
  const classes = useStyles()
  const buttonText = props.numberOfNotes > 1 ? `${props.numberOfNotes} notes` : `${props.numberOfNotes} note`
  return (
    <>
      <ConditionalRender isRendered={props.numberOfNotes > 0}>
        <PreviewButton
          showPreview={props.previewState}
          onClick={props.setShowPreview}
          previewLabel={buttonText}
          hideLabel={buttonText}
          className={classes.notePreview}
        />
      </ConditionalRender>
    </>
  )
}
