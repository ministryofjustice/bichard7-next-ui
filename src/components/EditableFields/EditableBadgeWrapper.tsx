import Badge, { BadgeColours } from "components/Badge"

interface EditableBadgeWrapperProps {
  colour: BadgeColours
  label: string
}

const EditableBadgeWrapper: React.FC<EditableBadgeWrapperProps> = ({ colour, label }) => {
  return (
    <div className="badge-wrapper">
      <Badge className={"error-badge"} isRendered={true} colour={colour} label={label} />
    </div>
  )
}

export default EditableBadgeWrapper
