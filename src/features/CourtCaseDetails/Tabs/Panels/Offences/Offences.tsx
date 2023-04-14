import { Offence } from "@moj-bichard7-developers/bichard7-next-core/build/src/types/AnnotatedHearingOutcome"
import { useState } from "react"
import { OffenceDetails } from "./OffenceDetails"
import { OffencesTable } from "./OffencesTable"

interface OffencesProps {
  offences: Offence[]
}

export const Offences = ({ offences }: OffencesProps) => {
  const [detailedOffence, setDetailedOffence] = useState<Offence>()
  return !!detailedOffence ? (
    <OffenceDetails offence={detailedOffence} offencesCount={offences.length} />
  ) : (
    <OffencesTable offences={offences} setDetailedOffence={setDetailedOffence} />
  )
}
