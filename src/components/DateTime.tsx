import { format } from "date-fns"
import { utcToZonedTime } from "date-fns-tz"

interface Props {
  date?: Date | string
  prefix?: string
}

const DateTime = ({ date, prefix }: Props) => {
  if (!date) {
    return <></>
  }

  const dateObject = new Date(date)
  const zonedDate = utcToZonedTime(dateObject, "Europe/London")

  return (
    <>
      {prefix}
      <time aria-label="time">{format(zonedDate, "dd/MM/yyyy HH:mm:ss")}</time>
    </>
  )
}

export default DateTime
