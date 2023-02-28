import ConditionalRender from "../../components/ConditionalRender"
import { Dispatch, SetStateAction } from "react"
import { createUseStyles } from "react-jss"

const useStyles = createUseStyles({
  buttonContainer: {
    color: "#1d70b8",
    width: "97px"
  },
  notePreviewContainer: {
    backgroundColor: "#F3F2F1",
    borderLeft: "5px solid #b1b4b6",
    padding: "15px 20px"
  }
})

interface NotePreviewProps {
  latestNote: string
  displayDate: string
  numberOfNotes: number
}

interface NotePreviewButtonProps {
  previewState: boolean
  setShowPreview: Dispatch<SetStateAction<boolean>>
  numberOfNotes: number
}

export const NotePreview = ({ latestNote, displayDate, numberOfNotes }: NotePreviewProps) => {
  const classes = useStyles()
  return (
    <>
      <div className={classes.notePreviewContainer}>
        <p className="govuk-body govuk-!-font-weight-bold">
          {numberOfNotes > 1 ? `Most recent note added ${displayDate}` : `Note added ${displayDate}`}
        </p>
        <p>{latestNote}</p>
      </div>
    </>
  )
}

export const PreviewButton = () => {
  return (
    <>
      <span className="govuk-accordion-nav__chevron govuk-accordion-nav__chevron--down"></span>
      <span className="govuk-accordion__show-all-text">{"Preview"}</span>
    </>
  )
}
export const HideButton = () => {
  return (
    <>
      <span className="govuk-accordion-nav__chevron"></span>
      <span className="govuk-accordion__show-all-text">{"Hide"}</span>
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
