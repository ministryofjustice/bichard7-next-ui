import UserGroup from "types/GroupName"

interface GetUserManagementAccessResult {
  hasAccessToUserManagement: boolean
}

export interface AuthenticationTokenPayload {
  username: string
  exclusionList: string[]
  inclusionList: string[]
  emailAddress: string
  groups: UserGroup[]
  id: string
}

export default ({ groups }: AuthenticationTokenPayload): GetUserManagementAccessResult => {
  const hasAccessToUserManagement = groups.includes("UserManager" as UserGroup)
  return {
    hasAccessToUserManagement
  }
}
