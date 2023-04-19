import GroupName from "types/GroupName"
import UserGroup from "types/GroupName"

export interface Props {
  groups: GroupName[]
}
const hasUserManagementAccess = ({ groups }: Props): boolean => groups.includes("UserManager" as UserGroup)

export default hasUserManagementAccess
