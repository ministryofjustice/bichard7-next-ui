import { format } from "date-fns"
import { utcToZonedTime } from "date-fns-tz"

interface Props {
  date?: Date | string
  prefix?: string
  dateFormat?: string
}

const DateTime = ({ date, prefix, dateFormat = "dd/MM/yyyy HH:mm:ss" }: Props) => {
  if (!date) {
    return <></>
  }

  const dateObject = new Date(date)
  const zonedDate = utcToZonedTime(dateObject, "Europe/London")

  return (
    <>
      {prefix}
      <time aria-label="time">{format(zonedDate, dateFormat)}</time>
    </>
  )
}

export default DateTime
