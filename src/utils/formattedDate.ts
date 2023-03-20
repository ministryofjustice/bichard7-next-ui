import { format, isValid, parse } from "date-fns"

export const displayedDateFormat = "dd/MM/yyyy"

export const formInputDateFormat = "yyyy-MM-dd"

export const formatDisplayedDate = (date: Date): string => (isValid(date) ? format(date, displayedDateFormat) : "")

export const formatFormInputDateString = (date: Date): string =>
  isValid(date) ? format(date, formInputDateFormat) : ""

export const formatStringDateAsDisplayedDate = (dateString?: string | null): string => {
  const dateStringAsDate = !!dateString && parse(dateString, formInputDateFormat, new Date())
  return dateStringAsDate && isValid(dateStringAsDate) ? formatDisplayedDate(dateStringAsDate) : ""
}
