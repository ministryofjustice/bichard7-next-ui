import { format } from "date-fns"

export const displayedDateFormat = "dd/MM/yyyy"

export const formatDisplayedDate = (date: Date) => format(date, displayedDateFormat)
