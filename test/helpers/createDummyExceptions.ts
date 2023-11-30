import exponential from "@stdlib/random-base-exponential"
import sampleMany from "@stdlib/random-sample"
import { sample as sampleOne } from "lodash"

const possibleExceptions = [
  "HO100101",
  "HO100104",
  "HO100113",
  "HO100206",
  "HO100212",
  "HO100234",
  "HO100301",
  "HO100302",
  "HO100304",
  "HO100306",
  "HO100310",
  "HO100314",
  "HO100321",
  "HO100322",
  "HO100323",
  "HO100324",
  "HO100325",
  "HO100325",
  "HO100402",
  "HO100404"
]
const fields = [
  "ArrestSummonsNumber",
  "OffenceReasonSequence",
  "ActualOffenceWording",
  "ResultClass",
  "Reason",
  "NextHearingDate",
  "OrganisationUnitCode"
]

export default (hasTriggers: boolean): { errorReason: string; errorReport: string; exceptionCount: number } => {
  if (hasTriggers && Math.random() > 0.5) {
    return { errorReason: "", errorReport: "", exceptionCount: 0 }
  }

  const numExceptions = Math.min(Math.round(exponential(2) * 2), 5) + 1
  const exceptions = sampleMany(possibleExceptions, { size: numExceptions })
  return {
    errorReport: exceptions.map((exception) => `${exception}||br7:${sampleOne(fields)}`).join(", "),
    errorReason: exceptions[0],
    exceptionCount: exceptions.length
  }
}
