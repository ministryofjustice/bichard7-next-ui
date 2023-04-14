import { Offence } from "@moj-bichard7-developers/bichard7-next-core/build/src/types/AnnotatedHearingOutcome"
import { Heading } from "govuk-react"

interface OffenceDetailsProps {
  offence: Offence
  offencesCount: number
}

export const OffenceDetails = ({ offence, offencesCount }: OffenceDetailsProps) => {
  return (
    <>
      <Heading as="h4" size="MEDIUM">
        {`Offence x of ${offencesCount}`}
      </Heading>
    </>
  )
}
