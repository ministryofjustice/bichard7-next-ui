import { blue } from "utils/colours"

interface TriggersPreviewButtonProps {
  onClick: () => void
}

const TriggersPreviewButton = ({ onClick }: TriggersPreviewButtonProps) => {
  const warningIcon = (
    <svg
      fill={blue}
      id="warningIcon"
      role="presentation"
      focusable="true"
      xmlns="http://www.w3.org/2000/svg"
      viewBox="0 0 25 25"
      height="20"
      width="20"
      style={{ position: "relative", top: "10px" }}
    >
      <path
        d="M13.7,18.5h-2.4v-2.4h2.4V18.5z M12.5,13.7c-0.7,0-1.2-0.5-1.2-1.2V7.7c0-0.7,0.5-1.2,1.2-1.2s1.2,0.5,1.2,1.2v4.8
C13.7,13.2,13.2,13.7,12.5,13.7z M12.5,0.5c-6.6,0-12,5.4-12,12s5.4,12,12,12s12-5.4,12-12S19.1,0.5,12.5,0.5z"
      />
    </svg>
  )

  return (
    <a
      aria-label="Read more about triggers"
      className="govuk-link"
      href="/"
      onClick={(event) => {
        event.preventDefault()
        onClick()
      }}
    >
      {warningIcon}
    </a>
  )
}

export default TriggersPreviewButton
