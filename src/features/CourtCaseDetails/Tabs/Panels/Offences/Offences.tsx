import { Offence } from "@moj-bichard7-developers/bichard7-next-core/core/types/AnnotatedHearingOutcome"
import { OffenceDetails } from "./Offence/OffenceDetails"
import { OffencesList } from "./OffencesList/OffencesList"
import { ExceptionCode } from "@moj-bichard7-developers/bichard7-next-core/core/types/ExceptionCode"

interface OffencesProps {
  className: string
  offences: Offence[]
  onOffenceSelected: (offenceIndex?: number) => void
  selectedOffenceIndex?: number
  exceptions: { code: ExceptionCode; path: (string | number)[] }[]
}

export const Offences = ({
  className,
  offences,
  onOffenceSelected,
  selectedOffenceIndex,
  exceptions
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
      />
    </>
  ) : (
    <OffencesList className={className} offences={offences} setDetailedOffenceIndex={onOffenceSelected} />
  )
}
