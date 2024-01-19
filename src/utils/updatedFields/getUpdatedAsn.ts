import { HearingDefendant } from "@moj-bichard7-developers/bichard7-next-core/core/types/AnnotatedHearingOutcome"
import { AmendmentRecords } from "../../types/Amendments"
import setAmendedField from "../amendments/setAmendedField"
import { hasUpdate } from "./hasUpdate"

const getUpdatedAsn = (
  hearingDefendant: HearingDefendant,
  updatedHearingDefendant: HearingDefendant,
  updatedFields: AmendmentRecords
) => {
  if (hasUpdate(hearingDefendant.ArrestSummonsNumber, updatedHearingDefendant?.ArrestSummonsNumber)) {
    setAmendedField("asn", updatedHearingDefendant.ArrestSummonsNumber, updatedFields)
  }
}

export default getUpdatedAsn
