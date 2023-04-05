import { Heading } from "govuk-react"
import { ReactNode } from "react"

interface CourtCaseDetailsPanelProps {
  children: ReactNode
  heading: string
}

export const CourtCaseDetailsPanel = ({ children, heading }: CourtCaseDetailsPanelProps) => {
  return (
    <>
      <Heading as="h4" size="LARGE">
        {heading}
      </Heading>
      {children}
    </>
  )
}
