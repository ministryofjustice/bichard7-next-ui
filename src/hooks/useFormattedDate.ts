import { useState, useEffect } from "react"
import { formatDisplayedDate } from "utils/date/formattedDate"

const useFormattedDate = (date?: string | Date, dateFormat?: string) => {
  const [formattedDate, setFormattedDate] = useState("")

  useEffect(() => setFormattedDate(formatDisplayedDate(date ?? "-", dateFormat)), [date, dateFormat])

  return formattedDate
}

export default useFormattedDate
