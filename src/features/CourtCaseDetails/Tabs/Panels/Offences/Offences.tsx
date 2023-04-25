import { Offence } from "@moj-bichard7-developers/bichard7-next-core/build/src/types/AnnotatedHearingOutcome"
import { useState } from "react"
import { OffenceDetails } from "./Offence/OffenceDetails"
import { OffencesList } from "./OffencesList/OffencesList"

interface OffencesProps {
  offences: Offence[]
}

export const Offences = ({ offences }: OffencesProps) => {
  const [detailedOffence, setDetailedOffence] = useState<Offence>()
  return !!detailedOffence ? (
    <>
      <OffenceDetails
        offence={detailedOffence}
        offencesCount={offences.length}
        onBackToAllOffences={() => setDetailedOffence(undefined)}
      />
    </>
  ) : (
    <OffencesList offences={offences} setDetailedOffence={setDetailedOffence} />
  )
}
