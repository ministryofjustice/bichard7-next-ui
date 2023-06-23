export enum Groups {
  Allocator = "Allocator",
  Audit = "Audit",
  ExceptionHandler = "ExceptionHandler",
  GeneralHandler = "GeneralHandler",
  Supervisor = "Supervisor",
  TriggerHandler = "TriggerHandler",
  UserManager = "UserManager",
  AuditLoggingManager = "AuditLoggingManager",
  SuperUserManager = "SuperUserManager",
  NewUI = "NewUI"
}

const GroupNames = [...Object.values(Groups)] as const
export type GroupName = (typeof GroupNames)[number]
export default GroupName
