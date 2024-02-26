import { Heading } from "govuk-react"
import { ReactNode } from "react"

interface CourtCaseDetailsPanelProps {
  className: string
  children: ReactNode
  heading: string
}

export const CourtCaseDetailsPanel = ({ className, children, heading }: CourtCaseDetailsPanelProps) => {
  return (
    <div className={className}>
      <Heading as="h2" size="MEDIUM">
        {heading}
      </Heading>
      {children}
    </div>
  )
}
