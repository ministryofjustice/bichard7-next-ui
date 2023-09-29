import { Preview } from "components/Preview"
import { truncate } from "lodash"
import { Dispatch, SetStateAction } from "react"
import { DisplayPartialNote } from "types/display/Notes"
import ConditionalRender from "../../../../components/ConditionalRender"
import PreviewButton from "../../../../components/PreviewButton"
import { validateMostRecentNoteDate } from "./CourtCaseListEntryHelperFunction"

interface NotePreviewProps {
  latestNote: DisplayPartialNote | null
  numberOfNotes: number
}

interface NotePreviewButtonProps {
  previewState: boolean
  setShowPreview: Dispatch<SetStateAction<boolean>>
  numberOfNotes: number
}

export const NotePreview = ({ latestNote, numberOfNotes }: NotePreviewProps) => {
  if (!latestNote) {
    return
  }

  const displayDate = validateMostRecentNoteDate(latestNote)
  return (
    <Preview>
      <p className="govuk-body govuk-!-font-weight-bold">
        {numberOfNotes > 1 ? `Most recent note added ${displayDate}` : `Note added ${displayDate}`}
      </p>
      <p>{truncate(latestNote.noteText, { length: 103 })}</p>
    </Preview>
  )
}

export const NotePreviewButton: React.FC<NotePreviewButtonProps> = (props: NotePreviewButtonProps) => {
  return (
    <>
      <ConditionalRender isRendered={props.numberOfNotes > 0}>
        <div>{props.numberOfNotes > 1 ? `${props.numberOfNotes} notes` : `${props.numberOfNotes} note`}</div>
        <PreviewButton showPreview={props.previewState} onClick={props.setShowPreview} previewLabel="Preview" />
      </ConditionalRender>
    </>
  )
}
