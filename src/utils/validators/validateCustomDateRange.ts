import { CourtDateRange } from "types/CaseListQueryParams"

export const validateCustomDateRange = (customDate: {
  fromDay: string
  fromMonth: string
  fromYear: string
  toDay: string
  toMonth: string
  toYear: string
}): CourtDateRange | undefined => {
  console.log(customDate)
  return { from: new Date(), to: new Date() }
}
