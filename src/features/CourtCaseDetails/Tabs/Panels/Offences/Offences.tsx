import type { Offence } from "@moj-bichard7-developers/bichard7-next-core/core/types/AnnotatedHearingOutcome"
import { AmendmentKeys, AmendmentRecords, IndividualAmendmentValues } from "../../../../../types/Amendments"
import { Exception } from "../../../../../types/exceptions"
import { OffenceDetails } from "./Offence/OffenceDetails"
import { OffencesList } from "./OffencesList/OffencesList"

interface OffencesProps {
  className: string
  offences: Offence[]
  onOffenceSelected: (offenceIndex?: number) => void
  selectedOffenceIndex?: number
  exceptions: Exception[]
  amendments: AmendmentRecords
  amendFn: (keyToAmend: AmendmentKeys) => (newValue: IndividualAmendmentValues) => void
}

export const Offences = ({
  className,
  offences,
  onOffenceSelected,
  selectedOffenceIndex,
  exceptions,
  amendments,
  amendFn
}: OffencesProps) => {
  return selectedOffenceIndex !== undefined && offences[selectedOffenceIndex - 1] !== undefined ? (
    <>
      <OffenceDetails
        className={className}
        offence={offences[selectedOffenceIndex - 1]}
        offencesCount={offences.length}
        onBackToAllOffences={() => onOffenceSelected(undefined)}
        onNextClick={() => onOffenceSelected(selectedOffenceIndex + 1)}
        onPreviousClick={() => onOffenceSelected(selectedOffenceIndex - 1)}
        selectedOffenceIndex={selectedOffenceIndex}
        exceptions={exceptions}
        amendments={amendments}
        amendFn={amendFn}
      />
    </>
  ) : (
    <OffencesList className={className} offences={offences} setDetailedOffenceIndex={onOffenceSelected} />
  )
}
