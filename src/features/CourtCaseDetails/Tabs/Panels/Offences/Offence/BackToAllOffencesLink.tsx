interface BBackToAllOffencesLinkProps {
  onClick: () => void
}

export const BackToAllOffencesLink = ({ onClick }: BBackToAllOffencesLinkProps) => {
  return (
    <a
      href="/"
      className="govuk-back-link"
      onClick={(e) => {
        e.preventDefault()
        onClick()
      }}
    >
      {"Back to all offences"}
    </a>
  )
}
