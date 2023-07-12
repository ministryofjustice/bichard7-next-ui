import { Offence } from "@moj-bichard7-developers/bichard7-next-core/dist/types/AnnotatedHearingOutcome"

const getOffenceCode = (offence: Offence): string => {
  if (offence.CriminalProsecutionReference.OffenceReason?.__type === "LocalOffenceReason") {
    return offence.CriminalProsecutionReference.OffenceReason.LocalOffenceCode.OffenceCode
  }
  if (offence.CriminalProsecutionReference.OffenceReason?.__type === "NationalOffenceReason") {
    return offence.CriminalProsecutionReference.OffenceReason?.OffenceCode.FullCode
  }
  return ""
}

export default getOffenceCode
