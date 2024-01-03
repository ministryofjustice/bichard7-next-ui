import { Dispatch, SetStateAction } from "react"

const Preview = (props: { label: string }) => {
  return (
    <>
      <span className="govuk-accordion-nav__chevron govuk-accordion-nav__chevron--down"></span>
      <span className="govuk-accordion__show-all-text">{props.label}</span>
    </>
  )
}

const Hide = () => {
  return (
    <>
      <span className="govuk-accordion-nav__chevron"></span>
      <span className="govuk-accordion__show-all-text">{"Hide"}</span>
    </>
  )
}

interface PreviewButtonProps {
  showPreview: boolean
  onClick: Dispatch<SetStateAction<boolean>>
  previewLabel: string
  className?: string
}

const PreviewButton = ({ showPreview, onClick, previewLabel, className }: PreviewButtonProps) => {
  return (
    <button
      type="button"
      className={"preview-button govuk-accordion__show-all" + (className ? ` ${className}` : "")}
      onClick={() => {
        onClick(!showPreview)
      }}
    >
      {showPreview ? <Preview label={previewLabel} /> : <Hide />}
    </button>
  )
}

export default PreviewButton
