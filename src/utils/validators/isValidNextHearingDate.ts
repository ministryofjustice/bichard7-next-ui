import { DATE_FNS } from "config"
import { compareAsc } from "date-fns"

const isValidNextHearingDate = (
  amendedNextHearingDate: string | undefined,
  resultHearingDate: Date | string | undefined
): boolean => {
  if (!amendedNextHearingDate) {
    return false
  }

  const parsedDate = amendedNextHearingDate.match(/(\d{4})-(\d{2})-(\d{2})/)

  if (!parsedDate) {
    return false
  }

  const formattedNextHearingDate = new Date()
  formattedNextHearingDate.setFullYear(
    parseInt(parsedDate[1], 10),
    // Month is 0 index. Go figure.
    parseInt(parsedDate[2], 10) - 1,
    parseInt(parsedDate[3], 10)
  )
  formattedNextHearingDate.setHours(0, 0, 0, 0)

  if (resultHearingDate) {
    return compareAsc(formattedNextHearingDate, new Date(resultHearingDate)) === DATE_FNS.dateInFuture
  } else {
    return false
  }
}

export default isValidNextHearingDate
