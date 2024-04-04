import { DATE_FNS } from "config"
import { compareAsc } from "date-fns"

const isValidNextHearingDate = (
  amendedNextHearingDate: string | undefined,
  resultHearingDate: Date | string | undefined
): boolean => {
  let formattedNextHearingDate

  if (amendedNextHearingDate) {
    formattedNextHearingDate = new Date(amendedNextHearingDate)
  } else {
    formattedNextHearingDate = new Date("1970-01-01")
  }

  if (resultHearingDate) {
    return compareAsc(formattedNextHearingDate, new Date(resultHearingDate)) === DATE_FNS.dateInFuture
  } else {
    return false
  }
}

export default isValidNextHearingDate
