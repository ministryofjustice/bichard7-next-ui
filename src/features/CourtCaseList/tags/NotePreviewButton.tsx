import If from "components/If"
import { Dispatch, SetStateAction } from "react"
import { createUseStyles } from "react-jss"

interface NotePreviewProps {
  latestNote: string
  displayDate: string
}

interface NotePreviewButtonProps {
  previewState: boolean
  setShowPreview: Dispatch<SetStateAction<boolean>>
  numberOfNotes: number
}

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

export const NotePreview = ({ latestNote, displayDate }: NotePreviewProps) => {
  const classes = useStyles()
  return (
    <>
      <div className={classes.notePreviewContainer}>
        <p className="govuk-body govuk-!-font-weight-bold">{`Last note added ${displayDate}`}</p>
        <p>{latestNote}</p>
      </div>
    </>
  )
}

const NotePreviewButton: React.FC<NotePreviewButtonProps> = (props: NotePreviewButtonProps) => {
  console.log("passed state in notePreview component: should be false--", props.previewState)
  const classes = useStyles()

  const PreviewButton = () => {
    return (
      <>
        <span className="govuk-accordion-nav__chevron govuk-accordion-nav__chevron--down"></span>
        <span className="govuk-accordion__show-all-text">{"Preview"}</span>
      </>
    )
  }

  const HideButton = () => {
    return (
      <>
        <span className="govuk-accordion-nav__chevron"></span>
        <span className="govuk-accordion__show-all-text">{"Hide"}</span>
      </>
    )
  }

  return (
    <>
      <If condition={props.numberOfNotes > 0}>
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
      </If>
    </>
  )
}

export default NotePreviewButton
