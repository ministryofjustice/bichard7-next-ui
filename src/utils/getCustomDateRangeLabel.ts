import { displayedDateFormat } from "./formattedDate"
import { format } from "date-fns"

const getCustomDateRangeLabel = (customDateFromValue: Date | undefined, customDateToValue: Date | undefined) => {
  return !!customDateFromValue && !!customDateToValue
    ? `${format(customDateFromValue, displayedDateFormat)} - ${format(customDateToValue, displayedDateFormat)}`
    : ""
}

export default getCustomDateRangeLabel
