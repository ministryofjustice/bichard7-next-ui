import { displayedDateFormat } from "./formattedDate"
import { format } from "date-fns"

const getDateRangeLabel = (dateFromValue: Date | undefined, dateToValue: Date | undefined) => {
  return !!dateFromValue && !!dateToValue
    ? `${format(dateFromValue, displayedDateFormat)} - ${format(dateToValue, displayedDateFormat)}`
    : ""
}

export default getDateRangeLabel
