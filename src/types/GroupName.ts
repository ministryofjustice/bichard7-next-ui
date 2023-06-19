export type GroupName =
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

export default GroupName
