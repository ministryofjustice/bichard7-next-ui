import { BackLink } from "govuk-react"

interface BBackToAllOffencesLinkProps {
  onClick: () => void
}

export const BackToAllOffencesLink = ({ onClick }: BBackToAllOffencesLinkProps) => (
  <BackLink
    href="#"
    onClick={(e) => {
      e.preventDefault()
      onClick()
    }}
  >
    {"Back to all offences"}
  </BackLink>
)