import { Offence } from "@moj-bichard7-developers/bichard7-next-core/build/src/types/AnnotatedHearingOutcome"
import getOffenceCode from "utils/getOffenceCode"

interface OffenceDetailsProps {
  offence: Offence
}

export const OffenceDetails = ({ offence }: OffenceDetailsProps) => {
  return getOffenceCode(offence)
}
