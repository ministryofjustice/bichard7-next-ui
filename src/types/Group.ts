import KeyValuePair from "@moj-bichard7-developers/bichard7-next-core/build/src/types/KeyValuePair"

const groupNames = [
  "Allocator",
  "Audit",
  "ExceptionHandler",
  "GeneralHandler",
  "Supervisor",
  "TriggerHandler",
  "UserManager",
  "AuditLoggingManager",
  "SuperUserManager",
  "NewUI"
] as const

const parenting: KeyValuePair<Group, Group | undefined> = {
  Allocator: "Supervisor",
  Audit: "UserManager",
  ExceptionHandler: "GeneralHandler",
  GeneralHandler: "Supervisor",
  Supervisor: "UserManager",
  TriggerHandler: "GeneralHandler",
  UserManager: "SuperUserManager",
  AuditLoggingManager: "SuperUserManager",
  SuperUserManager: undefined,
  NewUI: undefined
}

type Group = (typeof groupNames)[number]
export default Group

type GroupRow = {
  name: Group
  id: number
  dbName: string
  parent?: Group
}

const groupRow: KeyValuePair<Group, GroupRow> = Object.assign(
  {},
  ...groupNames.map((groupName, idx) => {
    return {
      [groupName]: {
        name: groupName,
        id: idx,
        dbName: `B7${groupName}`,
        parent: parenting[groupName]
      }
    }
  })
)

export { groupRow }
