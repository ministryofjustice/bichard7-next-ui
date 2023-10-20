import type { AnnotatedHearingOutcome } from "@moj-bichard7-developers/bichard7-next-core/core/types/AnnotatedHearingOutcome"
import type {
  Amendments,
  AmendmentValues,
  UpdatedCourtOffenceSequenceNumber,
  UpdatedDisposalQualifierCode,
  UpdatedNextHearingDate,
  UpdatedOffenceResult,
  UpdatedOffenceValue
} from "types/Amendments"
import amendAsn from "utils/amendments/amendAsn/amendAsn"
import amendCourtCaseReference from "utils/amendments/amendCourtCaseReference/amendCourtCaseReference"
import amendCourtOffenceSequenceNumber from "utils/amendments/amendCourtOffenceSequenceNumber"
import amendCourtPNCIdentifier from "utils/amendments/amendCourtPncIdentifier"
import amendCourtReference from "utils/amendments/amendCourtReference/amendCourtReference"
import amendDisposalQualifierCode from "utils/amendments/amendDisposalQualifierCode"
import amendForceOwner from "utils/amendments/amendForceOwner"
import amendNextHearingDate from "utils/amendments/amendNextHearingDate"
import amendNextResultSourceOrganisation from "utils/amendments/amendNextResultSourceOrganisation"
import amendOffenceReasonSequence from "utils/amendments/amendOffenceReasonSequence"
import amendResultVariableText from "utils/amendments/amendResultVariableText"
import removeEmptyResultQualifierVariable from "utils/removeEmptyResultQualifierVariable"

const selectKey = (aho: AnnotatedHearingOutcome) => (key: string, value: AmendmentValues) => {
  switch (key) {
    case "asn":
      amendAsn(value as string, aho)
      break
    case "offenceReasonSequence":
      amendOffenceReasonSequence(value as UpdatedOffenceValue[], aho)
      break
    case "courtCaseReference":
      amendCourtCaseReference(value as UpdatedOffenceValue[], aho)
      break
    case "disposalQualifierCode":
      amendDisposalQualifierCode(value as UpdatedDisposalQualifierCode[], aho)
      removeEmptyResultQualifierVariable(aho)
      break
    case "nextSourceOrganisation":
      amendNextResultSourceOrganisation(value as UpdatedOffenceResult[], aho)
      break
    case "nextHearingDate":
      amendNextHearingDate(value as UpdatedNextHearingDate[], aho)
      break
    case "courtPNCIdentifier":
      amendCourtPNCIdentifier(value as string, aho)
      break
    case "resultVariableText":
      amendResultVariableText(value as UpdatedOffenceResult[], aho)
      break
    case "courtReference":
      amendCourtReference(value as string, aho)
      break
    case "courtOffenceSequenceNumber":
      amendCourtOffenceSequenceNumber(value as UpdatedCourtOffenceSequenceNumber[], aho)
      break
    case "forceOwner":
      amendForceOwner(value as string, aho)
      break
    default:
      return
  }
}

const applyAmendmentsToAho = (
  amendments: Partial<Amendments>,
  aho: AnnotatedHearingOutcome
): AnnotatedHearingOutcome | Error => {
  const selectKeyWithAho = selectKey(aho)
  for (const [key, value] of Object.entries(amendments)) {
    try {
      selectKeyWithAho(key, value as AmendmentValues)
    } catch (err) {
      return err as Error
    }
  }
  return aho
}

export default applyAmendmentsToAho
