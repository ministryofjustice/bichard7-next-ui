import { CourtDateRange } from "types/CaseListQueryParams"
import { validateQueryParams } from "./validateQueryParams"

export const validateCustomDateRange = (customDate: {
  fromDay: string | string[] | undefined
  fromMonth: string | string[] | undefined
  fromYear: string | string[] | undefined
  toDay: string | string[] | undefined
  toMonth: string | string[] | undefined
  toYear: string | string[] | undefined
}): CourtDateRange | undefined => {
  let hasInvalidParam = false
  Object.values(customDate).forEach((param) => {
    if (!validateQueryParams(param)) {
      hasInvalidParam = true
    }
  })

  if (hasInvalidParam) {
    return undefined
  }
  const fromDate = `${customDate.fromYear}-${customDate.fromMonth}-${customDate.fromDay}`
  const toDate = `${customDate.toYear}-${customDate.toMonth}-${customDate.toDay}`
  return { from: new Date(fromDate), to: new Date(toDate) }
}
