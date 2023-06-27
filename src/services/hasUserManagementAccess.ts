import { UserGroup } from "types/UserGroup"

export interface Props {
  groups: UserGroup[]
}
const hasUserManagementAccess = ({ groups }: Props): boolean => groups.includes("UserManager" as UserGroup)

export default hasUserManagementAccess
