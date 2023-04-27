import { truncate } from "lodash"
import ConditionalRender from "../../../../components/ConditionalRender"
import { Dispatch, SetStateAction } from "react"
import { createUseStyles } from "react-jss"
import { gdsLightGrey } from "../../../../utils/colours"
import { validateMostRecentNoteDate } from "./CourtCaseListEntryHelperFunction"
import type Note from "../../../../services/entities/Note"
import { HideButton, PreviewButton } from "../../../../components/PreviewButton"

const useStyles = createUseStyles({
  buttonContainer: {
    width: "97px"
  },
  notePreviewContainer: {
    backgroundColor: gdsLightGrey,
    borderLeft: "5px solid #b1b4b6",
    padding: "15px 20px"
  }
})

interface NotePreviewProps {
  latestNote: Note
  numberOfNotes: number
}

interface NotePreviewButtonProps {
  previewState: boolean
  setShowPreview: Dispatch<SetStateAction<boolean>>
  numberOfNotes: number
}

export const NotePreview = ({ latestNote, numberOfNotes }: NotePreviewProps) => {
  const classes = useStyles()
  const displayDate = validateMostRecentNoteDate(latestNote)
  return (
    <>
      <div className={classes.notePreviewContainer}>
        <p className="govuk-body govuk-!-font-weight-bold">
          {numberOfNotes > 1 ? `Most recent note added ${displayDate}` : `Note added ${displayDate}`}
        </p>
        <p>{truncate(latestNote?.noteText, { length: 103 })}</p>
      </div>
    </>
  )
}


export const NotePreviewButton: React.FC<NotePreviewButtonProps> = (props: NotePreviewButtonProps) => {
  const classes = useStyles()

  return (
    <>
      <ConditionalRender isRendered={props.numberOfNotes > 0}>
        {props.numberOfNotes > 1 ? `${props.numberOfNotes} notes` : `${props.numberOfNotes} note`}
        <div className={classes.buttonContainer}>
          <button
            type="button"
            className="govuk-accordion__show-all"
            style={{ marginBottom: "0px" }}
            onClick={() => props.setShowPreview(!props.previewState)}
          >
            {!props.previewState ? <PreviewButton /> : <HideButton />}
          </button>
        </div>
      </ConditionalRender>
    </>
  )
}
