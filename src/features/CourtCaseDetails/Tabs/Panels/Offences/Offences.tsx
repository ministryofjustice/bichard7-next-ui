import { Offence } from "@moj-bichard7-developers/bichard7-next-core/build/src/types/AnnotatedHearingOutcome"
import { OffenceDetails } from "./Offence/OffenceDetails"
import { OffencesList } from "./OffencesList/OffencesList"

interface OffencesProps {
  offences: Offence[]
  onOffenceSelected: (offenceIndex?: number) => void
  selectedOffenceIndex?: number
}

export const Offences = ({ offences, onOffenceSelected, selectedOffenceIndex }: OffencesProps) => {
  return selectedOffenceIndex !== undefined ? (
    <>
      <OffenceDetails
        offence={offences[selectedOffenceIndex]}
        offencesCount={offences.length}
        onBackToAllOffences={() => onOffenceSelected(undefined)}
      />
    </>
  ) : (
    <OffencesList offences={offences} setDetailedOffenceIndex={onOffenceSelected} />
  )
}
