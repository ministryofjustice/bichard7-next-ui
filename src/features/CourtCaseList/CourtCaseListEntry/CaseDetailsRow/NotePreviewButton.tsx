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

export const NotePreview = ({ latestNote, numberOfNotes }: NotePreviewProps) => {
  const displayDate = validateMostRecentNoteDate(latestNote)
  return (
    <Preview>
      <p className="govuk-body govuk-!-font-weight-bold">
        {numberOfNotes > 1 ? `Most recent note added ${displayDate}` : `Note added ${displayDate}`}
      </p>
      <p>{truncate(latestNote?.noteText, { length: 103 })}</p>
    </Preview>
  )
}

const useStyles = createUseStyles({
  notePreview: {
    "&.govuk-accordion__show-all": {
      fontSize: "16px"
    }
  }
})

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
