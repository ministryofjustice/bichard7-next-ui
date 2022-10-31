import getUserManagementAccess, { AuthenticationTokenPayload } from "./getUserManagementAccess"

it("should say that user has only access to User Management when user has one of the User Management's user groups", () => {
  const result = getUserManagementAccess({ groups: ["UserManager"] } as AuthenticationTokenPayload)

  const { hasAccessToUserManagement } = result
  expect(hasAccessToUserManagement).toBe(true)
})

it("should say it does not have access to User Management when user does not have one of the User Management's user groups", () => {
  const result = getUserManagementAccess({
    groups: [
      "GeneralHandler",
      "Allocator",
      "Audit",
      "ExceptionHandler",
      "GeneralHandler",
      "Supervisor",
      "TriggerHandler",
      "AuditLoggingManager",
      "SuperUserManager",
      "NewUI"
    ]
  } as AuthenticationTokenPayload)

  const { hasAccessToUserManagement } = result
  expect(hasAccessToUserManagement).toBe(false)
})
