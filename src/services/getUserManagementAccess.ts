import UserGroup from "types/GroupName"

export interface AuthenticationTokenPayload {
  username: string
  exclusionList: string[]
  inclusionList: string[]
  emailAddress: string
  groups: UserGroup[]
  id: string
}
const getUserManagementAccess = ({ groups }: AuthenticationTokenPayload): boolean =>
  groups.includes("UserManager" as UserGroup)

export default getUserManagementAccess
