import Badge from "components/Badge"
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
    <Badge
      isRendered={true}
      label={resolutionStatus}
      colour={resolutionStatus === "Resolved" ? "grey" : "blue"}
      className={`govuk-!-static-margin-left-5 moj-badge-${resolutionStatus.toLowerCase()}`}
    />
  )
}

export default ResolutionStatusBadge
