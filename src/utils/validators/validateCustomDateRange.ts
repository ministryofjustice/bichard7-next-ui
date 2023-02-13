import { CourtDateRange } from "types/CaseListQueryParams"

export const validateCustomDateRange = (customDate: {
  from: string | string[] | undefined
  to: string | string[] | undefined
}): CourtDateRange | undefined => {
  const fromTimeStamp = Date.parse(`${customDate.from}`)
  const toTimeStamp = Date.parse(`${customDate.to}`)

  if (isNaN(fromTimeStamp) || isNaN(toTimeStamp)) {
    return undefined
  }

  return { from: new Date(fromTimeStamp), to: new Date(toTimeStamp) }
}
