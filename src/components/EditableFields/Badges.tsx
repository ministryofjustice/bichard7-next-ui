import { BadgeColours } from "components/Badge"
import EditableBadgeWrapper from "./EditableBadgeWrapper"

const InitialInputValueBadge = () => <EditableBadgeWrapper colour={BadgeColours.Grey} label={"Initial Value"} />
const EditableFieldBadge = () => <EditableBadgeWrapper colour={BadgeColours.Purple} label={"Editable Field"} />
const CorrectionBadge = () => <EditableBadgeWrapper colour={BadgeColours.Green} label={"Correction"} />

export { CorrectionBadge, EditableFieldBadge, InitialInputValueBadge }
