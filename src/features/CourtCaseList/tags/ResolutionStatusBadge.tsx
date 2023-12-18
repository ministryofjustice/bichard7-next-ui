import { useCustomStyles } from "../../../../styles/customStyles"
import { ResolutionStatus } from "../../../types/ResolutionStatus"

interface Props {
  resolutionStatus: ResolutionStatus
}

const ResolutionStatusBadge: React.FC<Props> = ({ resolutionStatus }: Props) => {
  const classes = useCustomStyles()

  if (resolutionStatus === "Unresolved") {
    return <></>
  }

  return (
    <span
      className={`moj-badge moj-badge-${resolutionStatus.toLowerCase()} moj-badge--${
        resolutionStatus === "Resolved" ? "grey" : "blue"
      } ${classes["margin-top-bottom"]}`}
    >{`${resolutionStatus}`}</span>
  )
}

export default ResolutionStatusBadge
