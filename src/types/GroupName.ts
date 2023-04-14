type GroupName =
  | "Allocator"
  | "Audit"
  | "ExceptionHandler"
  | "GeneralHandler"
  | "Supervisor"
  | "TriggerHandler"
  | "UserManager"
  | "AuditLoggingManager"
  | "SuperUserManager"
  | "NewUI"

export default GroupName

const GroupIds = {
  Allocator: 1,
  Audit: 2,
  ExceptionHandler: 3,
  GeneralHandler: 4,
  Supervisor: 5,
  TriggerHandler: 6,
  UserManager: 7,
  AuditLoggingManager: 8,
  SuperUserManager: 9,
  NewUI: 10
}

export { GroupIds }
