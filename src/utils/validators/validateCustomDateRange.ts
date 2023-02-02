import { CourtDateRange } from "types/CaseListQueryParams"
import { validateQueryParams } from "./validateQueryParams"

export const validateCustomDateRange = (customDate: {
  from: string | string[] | undefined
  to: string | string[] | undefined
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

  const fromTimeStamp = Date.parse(`${customDate.from}`)
  const toTimeStamp = Date.parse(`${customDate.to}`)

  if (isNaN(fromTimeStamp) || isNaN(toTimeStamp)) {
    return undefined
  }

  return { from: new Date(fromTimeStamp), to: new Date(toTimeStamp) }
}
