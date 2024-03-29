import Badge from "components/Badge"
import { ResolutionStatus } from "../../../types/ResolutionStatus"

interface Props {
  resolutionStatus: ResolutionStatus
}

const ResolutionStatusBadge: React.FC<Props> = ({ resolutionStatus }: Props) => (
  <>
    {resolutionStatus !== "Unresolved" && (
      <Badge
        isRendered={true}
        label={resolutionStatus}
        colour={resolutionStatus === "Resolved" ? "grey" : "blue"}
        className={`govuk-!-static-margin-left-5 moj-badge-${resolutionStatus.toLowerCase()}`}
      />
    )}
  </>
)

export default ResolutionStatusBadge
