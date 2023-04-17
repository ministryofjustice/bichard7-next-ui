import Group from "types/Group"
import UserGroup from "types/Group"

export interface Props {
  groups: Group[]
}
const hasUserManagementAccess = ({ groups }: Props): boolean => groups.includes("UserManager" as UserGroup)

export default hasUserManagementAccess
