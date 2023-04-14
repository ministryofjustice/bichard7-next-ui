import { Offence } from "@moj-bichard7-developers/bichard7-next-core/build/src/types/AnnotatedHearingOutcome"
import { useState } from "react"
import { OffencesTable } from "./OffencesTable"

interface OffencesProps {
  offences: Offence[]
}

export const Offences = ({ offences }: OffencesProps) => {
  const [detailedOffence, setDetailedOffence] = useState<Offence>()
  return !!detailedOffence ? "OK" : <OffencesTable offences={offences} setDetailedOffence={setDetailedOffence} />
}
