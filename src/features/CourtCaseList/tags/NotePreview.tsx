/* eslint-disable jsx-a11y/no-static-element-interactions */
/* eslint-disable jsx-a11y/click-events-have-key-events */
import { DefaultUpChevron } from "components/icons/NotePreviewChevron"
import If from "components/If"
import { Dispatch, SetStateAction } from "react"
// import { format } from "date-fns"
// import { useState } from "react"
import { createUseStyles } from "react-jss"
// import { displayedDateFormat } from "utils/formattedDate"

interface Props {
  latestNote: string | string[]
  displayDate: string
  switcher: Dispatch<SetStateAction<boolean>>
  currentState: boolean
}

interface NotePreviewProps {
  previewState: boolean
  setShowPreview: Dispatch<SetStateAction<boolean>>
  numberOfNotes: number
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
    width: "97px"
  },
  notePreviewContainer: {
    backgroundColor: "#F3F2F1",
    borderLeft: "5px solid #b1b4b6",
    padding: "15px 20px"
  },
  notePreview: {}
})

export const PreviewNotes = ({ latestNote, displayDate, switcher, currentState }: Props) => {
  const classes = useStyles()
  console.log(switcher, currentState)
  return (
    <>
      <div className={classes.wrapper}>
        <div className={classes.notePreviewContainer}>
          <p className="govuk-body govuk-!-font-weight-bold">{`Last note added ${displayDate}`}</p>
          <p className={`${classes.notePreview} "govuk-details__text"`}>{latestNote}</p>
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

const NotePreview: React.FC<NotePreviewProps> = (props: NotePreviewProps) => {
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
            onClick={() => props.setShowPreview(!props.previewState)}
          >
            {!props.previewState ? <PreviewButton /> : <HideButton />}
          </button>
          <span style={{ paddingLeft: "4px" }}></span>
        </div>
      </If>
    </>
  )
}

export default NotePreview
