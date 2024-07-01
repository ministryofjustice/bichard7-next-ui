import getOffenceCode from "utils/getOffenceCode"
import type {
  HearingOutcome,
  Offence
} from "@moj-bichard7-developers/bichard7-next-core/core/types/AnnotatedHearingOutcome"

import type { PncOffence } from "@moj-bichard7-developers/bichard7-next-core/core/types/PncQueryResult"
const getCandidate = (_aho: HearingOutcome, pncOffence: PncOffence, offence: Offence): boolean => {
  const offenceCode = getOffenceCode(offence)
  return pncOffence.offence.cjsOffenceCode === offenceCode
}

export default getCandidate
