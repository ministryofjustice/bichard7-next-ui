import type { Offence } from "@moj-bichard7-developers/bichard7-next-core/core/types/AnnotatedHearingOutcome"
import { Exception } from "types/exceptions"
import { OffenceDetails } from "./Offence/OffenceDetails"
import { OffencesList } from "./OffencesList/OffencesList"

interface OffencesProps {
  visible: boolean
  offences: Offence[]
  onOffenceSelected: (offenceIndex?: number) => void
  selectedOffenceIndex?: number
  exceptions: Exception[]
  stopLeavingFn: (newValue: boolean) => void
}

export const Offences = ({
  visible,
  offences,
  onOffenceSelected,
  selectedOffenceIndex,
  exceptions,
  stopLeavingFn
}: OffencesProps) => {
  return (
    <div hidden={!visible}>
      {selectedOffenceIndex !== undefined && offences[selectedOffenceIndex - 1] !== undefined ? (
        <OffenceDetails
          offence={offences[selectedOffenceIndex - 1]}
          offencesCount={offences.length}
          onBackToAllOffences={() => onOffenceSelected(undefined)}
          onNextClick={() => onOffenceSelected(selectedOffenceIndex + 1)}
          onPreviousClick={() => onOffenceSelected(selectedOffenceIndex - 1)}
          selectedOffenceIndex={selectedOffenceIndex}
          exceptions={exceptions}
          stopLeavingFn={stopLeavingFn}
        />
      ) : (
        <OffencesList offences={offences} setDetailedOffenceIndex={onOffenceSelected} />
      )}
    </div>
  )
}
