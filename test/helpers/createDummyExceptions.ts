import { AnnotatedHearingOutcome } from "@moj-bichard7-developers/bichard7-next-core/core/types/AnnotatedHearingOutcome"
import exponential from "@stdlib/random-base-exponential"
import sampleMany from "@stdlib/random-sample"
import { sample as sampleOne } from "lodash"
import { HO100206, HO100212, HO100234, HO100301, HO100302, HO100304 } from "./exceptions"

const possibleExceptions: Record<string, (aho: AnnotatedHearingOutcome) => AnnotatedHearingOutcome> = {
  HO100101: (aho) => aho,
  HO100104: (aho) => aho,
  HO100113: (aho) => aho,
  HO100206: (aho) => HO100206(aho),
  HO100212: (aho) => HO100212(aho),
  HO100234: (aho) => HO100234(aho),
  HO100301: (aho) => HO100301(aho),
  HO100302: (aho) => HO100302(aho),
  HO100304: (aho) => HO100304(aho),
  HO100306: (aho) => aho,
  HO100310: (aho) => aho,
  HO100314: (aho) => aho,
  HO100321: (aho) => aho,
  HO100322: (aho) => aho,
  HO100323: (aho) => aho,
  HO100324: (aho) => aho,
  HO100325: (aho) => aho,
  HO100402: (aho) => aho,
  HO100404: (aho) => aho
}
const fields = [
  "ArrestSummonsNumber",
  "OffenceReasonSequence",
  "ActualOffenceWording",
  "ResultClass",
  "Reason",
  "NextHearingDate",
  "OrganisationUnitCode"
]

export default (
  hasTriggers: boolean,
  aho: AnnotatedHearingOutcome
): {
  errorReason: string
  errorReport: string
  exceptionCount: number
  ahoWithExceptions?: AnnotatedHearingOutcome
} => {
  if (hasTriggers && Math.random() > 0.5) {
    return { errorReason: "", errorReport: "", exceptionCount: 0 }
  }

  const numExceptions = Math.min(Math.round(exponential(2) * 2), 5) + 1
  const exceptions = sampleMany(Object.keys(possibleExceptions), { size: numExceptions })

  exceptions.forEach((exception) => {
    aho = possibleExceptions[exception](aho)
  })

  return {
    errorReport: exceptions.map((exception) => `${exception}||br7:${sampleOne(fields)}`).join(", "),
    errorReason: exceptions[0],
    exceptionCount: exceptions.length,
    ahoWithExceptions: aho
  }
}
