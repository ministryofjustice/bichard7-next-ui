import exponential from "@stdlib/random-base-exponential"
import sampleMany from "@stdlib/random-sample"
import { sample as sampleOne } from "lodash"

const possibleExceptions = [
  "HO100321",
  "HO100304",
  "HO100314",
  "HO100301",
  "HO100310",
  "HO100302",
  "HO100402",
  "HO100404",
  "HO100212",
  "HO100324",
  "HO100206",
  "HO100325",
  "HO100104",
  "HO100322",
  "HO100323",
  "HO100306",
  "HO100234",
  "HO100101",
  "HO100325",
  "HO100113"
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

export default (): string => {
  if (Math.random() > 0.5) {
    return ""
  }

  const numExceptions = Math.min(Math.round(exponential(2) * 2), 5) + 1
  const exceptions = sampleMany(possibleExceptions, { size: numExceptions })
  return exceptions.map((exception) => `${exception}||br7:${sampleOne(fields)}`).join(", ")
}
