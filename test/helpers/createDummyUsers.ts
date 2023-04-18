import User from "../../src/services/entities/User"
import type Group from "../../src/types/Group"

type UserRow = {
  username: string
  forenames: string
  surname: string
  email: string
  groups: Group[]
}

interface Groups {
  groups: Group[]
}

type DummyUser = Partial<User> & Groups

const visibleForces = ["01"]
const password = "$argon2id$v=19$m=15360,t=2,p=1$CK/shCsqcAng1U81FDzAxA$UEPw1XKYaTjPwKtoiNUZGW64skCaXZgHrtNraZxwJPw"

const userRows: UserRow[] = [
  {
    username: "Bichard01",
    forenames: "Bichard User",
    surname: "01",
    email: "bichard01@example.com",
    groups: ["Allocator", "Audit", "ExceptionHandler", "Supervisor", "TriggerHandler"]
  },
  {
    username: "Allocator1",

    forenames: "Bichard User",
    surname: "01",
    email: "allocator1@example.com",
    groups: ["Allocator"]
  },
  {
    username: "Audit1",
    forenames: "Bichard User",
    surname: "01",
    email: "audit1@example.com",
    groups: ["Audit"]
  },
  {
    username: "ExceptionHandler1",
    forenames: "",
    surname: "exception",
    email: "exceptionhandler1@example.com",
    groups: ["ExceptionHandler"]
  },
  {
    username: "GeneralHandler1",
    forenames: "Bichard User",
    surname: "01",
    email: "generalhandler1@example.com",
    groups: ["GeneralHandler"]
  },
  {
    username: "Supervisor1",
    forenames: "Bichard User",
    surname: "01",
    email: "supervisor1@example.com",
    groups: ["Supervisor"]
  },
  {
    username: "TriggerHandler1",
    forenames: "Bichard User",
    surname: "01",
    email: "triggerhandler1@example.com",
    groups: ["TriggerHandler"]
  },
  {
    username: "Allocator2",
    forenames: "Bichard User",
    surname: "01",
    email: "allocator2@example.com",
    groups: ["Allocator"]
  },
  {
    username: "Audit2",
    forenames: "Bichard User",
    surname: "01",
    email: "audit2@example.com",
    groups: ["Audit"]
  },
  {
    username: "ExceptionHandler2",
    forenames: "Bichard User",
    surname: "01",
    email: "exceptionhandler2@example.com",
    groups: ["Audit"]
  },
  {
    username: "GeneralHandler2",
    forenames: "Bichard User",
    surname: "01",
    email: "generalhandler2@example.com",
    groups: ["GeneralHandler"]
  },
  {
    username: "Supervisor2",
    forenames: "Bichard User",
    surname: "01",
    email: "supervisor2@example.com",
    groups: ["Supervisor"]
  },
  {
    username: "TriggerHandler2",
    forenames: "Bichard User",
    surname: "01",
    email: "triggerhandler2@example.com",
    groups: ["TriggerHandler"]
  },
  {
    username: "NoGroupsAssigned",
    forenames: "Bichard User",
    surname: "01",
    email: "nogroupsassigned@example.com",
    groups: []
  },
  {
    username: "generalhandler",
    forenames: "",
    surname: "generalhandler",
    email: "generalhandler@example.com",
    groups: ["GeneralHandler"]
  },
  {
    username: "supervisor",
    forenames: "",
    surname: "supervisor",
    email: "supervisor@example.com",
    groups: ["Supervisor"]
  },
  {
    username: "exceptionhandler",
    forenames: "",
    surname: "exceptionhandler",
    email: "exceptionhandler@example.com",
    groups: ["Supervisor"]
  },
  {
    username: "triggerhandler",
    forenames: "",
    surname: "triggerhandler",
    email: "triggerhandler@example.com",
    groups: ["TriggerHandler"]
  },
  {
    username: "auditor",
    forenames: "",
    surname: "auditor",
    email: "auditor@example.com",
    groups: ["Audit"]
  }
]

export default (): DummyUser[] => {
  return userRows.map((user) => {
    return {
      username: user.username,
      password,
      email: user.email,
      forenames: user.forenames,
      surname: user.surname,
      visibleForces,
      featureFlags: {},
      groups: [...user.groups, "NewUI"]
    }
  })
}
