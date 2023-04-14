import User from "../../src/services/entities/User"
import type GroupName from "../../src/types/GroupName"

type UserRow = {
  username: string
  exclusion_list: string
  inclusion_list: string
  org_serves: string
  forenames: string
  surname: string
  email: string
  password: string
  visible_courts: string
  visible_forces: string
  excluded_triggers: string
  groups: GroupName[]
}

interface Groups {
  groups: GroupName[]
}

type DummyUser = Partial<User> & Groups

const userRows: UserRow[] = [
  {
    username: "Bichard01",
    exclusion_list: "",
    inclusion_list: "B01,B41ME00",
    org_serves: "048C600",
    forenames: "Bichard User",
    surname: "01",
    email: "bichard01@example.com",
    password: "$argon2id$v=19$m=15360,t=2,p=1$CK/shCsqcAng1U81FDzAxA$UEPw1XKYaTjPwKtoiNUZGW64skCaXZgHrtNraZxwJPw",
    visible_courts: "",
    visible_forces: "",
    excluded_triggers: "",
    groups: ["Allocator", "Audit", "ExceptionHandler", "Supervisor", "TriggerHandler"]
  },
  {
    username: "Allocator1",
    exclusion_list: "",
    inclusion_list: "B01,B41ME00",
    org_serves: "048C600",
    forenames: "Bichard User",
    surname: "01",
    email: "allocator1@example.com",
    password: "$argon2id$v=19$m=15360,t=2,p=1$CK/shCsqcAng1U81FDzAxA$UEPw1XKYaTjPwKtoiNUZGW64skCaXZgHrtNraZxwJPw",
    visible_courts: "B01,B41ME00",
    visible_forces: "001,002,004,014,045",
    excluded_triggers: "",
    groups: ["Allocator"]
  },
  {
    username: "Audit1",
    exclusion_list: "",
    inclusion_list: "B01,B41ME00",
    org_serves: "048C600",
    forenames: "Bichard User",
    surname: "01",
    email: "audit1@example.com",
    password: "$argon2id$v=19$m=15360,t=2,p=1$CK/shCsqcAng1U81FDzAxA$UEPw1XKYaTjPwKtoiNUZGW64skCaXZgHrtNraZxwJPw",
    visible_courts: "B01,B41ME00",
    visible_forces: "001,002,004,014,045",
    excluded_triggers: "",
    groups: ["Audit"]
  },
  {
    username: "ExceptionHandler1",
    exclusion_list: "",
    inclusion_list: "B01,B41ME00",
    org_serves: "",
    forenames: "",
    surname: "exception",
    email: "exceptionhandler1@example.com",
    password: "$argon2id$v=19$m=15360,t=2,p=1$CK/shCsqcAng1U81FDzAxA$UEPw1XKYaTjPwKtoiNUZGW64skCaXZgHrtNraZxwJPw",
    visible_courts: "B01,B41ME00",
    visible_forces: "001,002,004,014,045",
    excluded_triggers: "",
    groups: ["ExceptionHandler"]
  },
  {
    username: "GeneralHandler1",
    exclusion_list: "",
    inclusion_list: "B01,B41ME00",
    org_serves: "048C600",
    forenames: "Bichard User",
    surname: "01",
    email: "generalhandler1@example.com",
    password: "$argon2id$v=19$m=15360,t=2,p=1$CK/shCsqcAng1U81FDzAxA$UEPw1XKYaTjPwKtoiNUZGW64skCaXZgHrtNraZxwJPw",
    visible_courts: "B01,B41ME00",
    visible_forces: "001,002,004,014,045",
    excluded_triggers: "",
    groups: ["GeneralHandler"]
  },
  {
    username: "Supervisor1",
    exclusion_list: "",
    inclusion_list: "B01,B41ME00",
    org_serves: "048C600",
    forenames: "Bichard User",
    surname: "01",
    email: "supervisor1@example.com",
    password: "$argon2id$v=19$m=15360,t=2,p=1$CK/shCsqcAng1U81FDzAxA$UEPw1XKYaTjPwKtoiNUZGW64skCaXZgHrtNraZxwJPw",
    visible_courts: "B01,B41ME00",
    visible_forces: "001,002,004,014,045",
    excluded_triggers: "",
    groups: ["Supervisor"]
  },
  {
    username: "TriggerHandler1",
    exclusion_list: "",
    inclusion_list: "B01,B41ME00",
    org_serves: "048C600",
    forenames: "Bichard User",
    surname: "01",
    email: "triggerhandler1@example.com",
    password: "$argon2id$v=19$m=15360,t=2,p=1$CK/shCsqcAng1U81FDzAxA$UEPw1XKYaTjPwKtoiNUZGW64skCaXZgHrtNraZxwJPw",
    visible_courts: "B01,B41ME00",
    visible_forces: "001,002,004,014,045",
    excluded_triggers: "",
    groups: ["TriggerHandler"]
  },
  {
    username: "Allocator2",
    exclusion_list: "",
    inclusion_list: "B40ME00",
    org_serves: "048C600",
    forenames: "Bichard User",
    surname: "01",
    email: "allocator2@example.com",
    password: "$argon2id$v=19$m=15360,t=2,p=1$CK/shCsqcAng1U81FDzAxA$UEPw1XKYaTjPwKtoiNUZGW64skCaXZgHrtNraZxwJPw",
    visible_courts: "B40ME00",
    visible_forces: "001,002,004,014,045",
    excluded_triggers: "",
    groups: ["Allocator"]
  },
  {
    username: "Audit2",
    exclusion_list: "",
    inclusion_list: "B40ME00",
    org_serves: "048C600",
    forenames: "Bichard User",
    surname: "01",
    email: "audit2@example.com",
    password: "$argon2id$v=19$m=15360,t=2,p=1$CK/shCsqcAng1U81FDzAxA$UEPw1XKYaTjPwKtoiNUZGW64skCaXZgHrtNraZxwJPw",
    visible_courts: "B40ME00",
    visible_forces: "001,002,004,014,045",
    excluded_triggers: "",
    groups: ["Audit"]
  },
  {
    username: "ExceptionHandler2",
    exclusion_list: "",
    inclusion_list: "B40ME00",
    org_serves: "048C600",
    forenames: "Bichard User",
    surname: "01",
    email: "exceptionhandler2@example.com",
    password: "$argon2id$v=19$m=15360,t=2,p=1$CK/shCsqcAng1U81FDzAxA$UEPw1XKYaTjPwKtoiNUZGW64skCaXZgHrtNraZxwJPw",
    visible_courts: "B40ME00",
    visible_forces: "001,002,004,014,045",
    excluded_triggers: "",
    groups: ["Audit"]
  },
  {
    username: "GeneralHandler2",
    exclusion_list: "",
    inclusion_list: "B40ME00",
    org_serves: "048C600",
    forenames: "Bichard User",
    surname: "01",
    email: "generalhandler2@example.com",
    password: "$argon2id$v=19$m=15360,t=2,p=1$CK/shCsqcAng1U81FDzAxA$UEPw1XKYaTjPwKtoiNUZGW64skCaXZgHrtNraZxwJPw",
    visible_courts: "B40ME00",
    visible_forces: "001,002,004,014,045",
    excluded_triggers: "",
    groups: ["GeneralHandler"]
  },
  {
    username: "Supervisor2",
    exclusion_list: "",
    inclusion_list: "B40ME00",
    org_serves: "048C600",
    forenames: "Bichard User",
    surname: "01",
    email: "supervisor2@example.com",
    password: "$argon2id$v=19$m=15360,t=2,p=1$CK/shCsqcAng1U81FDzAxA$UEPw1XKYaTjPwKtoiNUZGW64skCaXZgHrtNraZxwJPw",
    visible_courts: "B40ME00",
    visible_forces: "001,002,004,014,045",
    excluded_triggers: "",
    groups: ["Supervisor"]
  },
  {
    username: "TriggerHandler2",
    exclusion_list: "",
    inclusion_list: "B40ME00",
    org_serves: "048C600",
    forenames: "Bichard User",
    surname: "01",
    email: "triggerhandler2@example.com",
    password: "$argon2id$v=19$m=15360,t=2,p=1$CK/shCsqcAng1U81FDzAxA$UEPw1XKYaTjPwKtoiNUZGW64skCaXZgHrtNraZxwJPw",
    visible_courts: "B40ME00",
    visible_forces: "001,002,004,014,045",
    excluded_triggers: "",
    groups: ["TriggerHandler"]
  },
  {
    username: "NoGroupsAssigned",
    exclusion_list: "",
    inclusion_list: "B40ME00",
    org_serves: "048C600",
    forenames: "Bichard User",
    surname: "01",
    email: "nogroupsassigned@example.com",
    password: "$argon2id$v=19$m=15360,t=2,p=1$CK/shCsqcAng1U81FDzAxA$UEPw1XKYaTjPwKtoiNUZGW64skCaXZgHrtNraZxwJPw",
    visible_courts: "B40ME00",
    visible_forces: "001,002,004,014,045",
    excluded_triggers: "",
    groups: []
  },
  {
    username: "generalhandler",
    exclusion_list: "",
    inclusion_list: "B01,B41ME00",
    org_serves: "",
    forenames: "",
    surname: "generalhandler",
    email: "generalhandler@example.com",
    password: "$argon2id$v=19$m=15360,t=2,p=1$CK/shCsqcAng1U81FDzAxA$UEPw1XKYaTjPwKtoiNUZGW64skCaXZgHrtNraZxwJPw",
    visible_courts: "B01,B41ME00",
    visible_forces: "",
    excluded_triggers: "",
    groups: ["GeneralHandler"]
  },
  {
    username: "supervisor",
    exclusion_list: "",
    inclusion_list: "B01,B41ME00",
    org_serves: "",
    forenames: "",
    surname: "supervisor",
    email: "supervisor@example.com",
    password: "$argon2id$v=19$m=15360,t=2,p=1$CK/shCsqcAng1U81FDzAxA$UEPw1XKYaTjPwKtoiNUZGW64skCaXZgHrtNraZxwJPw",
    visible_courts: "B01,B41ME00",
    visible_forces: "",
    excluded_triggers: "",
    groups: ["Supervisor"]
  },
  {
    username: "exceptionhandler",
    exclusion_list: "",
    inclusion_list: "B01,B41ME00",
    org_serves: "",
    forenames: "",
    surname: "exceptionhandler",
    email: "exceptionhandler@example.com",
    password: "$argon2id$v=19$m=15360,t=2,p=1$CK/shCsqcAng1U81FDzAxA$UEPw1XKYaTjPwKtoiNUZGW64skCaXZgHrtNraZxwJPw",
    visible_courts: "B01,B41ME00",
    visible_forces: "",
    excluded_triggers: "",
    groups: ["Supervisor"]
  },
  {
    username: "triggerhandler",
    exclusion_list: "",
    inclusion_list: "B01,B41ME00",
    org_serves: "",
    forenames: "",
    surname: "triggerhandler",
    email: "triggerhandler@example.com",
    password: "$argon2id$v=19$m=15360,t=2,p=1$CK/shCsqcAng1U81FDzAxA$UEPw1XKYaTjPwKtoiNUZGW64skCaXZgHrtNraZxwJPw",
    visible_courts: "B01,B41ME00",
    visible_forces: "",
    excluded_triggers: "",
    groups: ["TriggerHandler"]
  },
  {
    username: "auditor",
    exclusion_list: "",
    inclusion_list: "B01,B41ME00",
    org_serves: "",
    forenames: "",
    surname: "auditor",
    email: "auditor@example.com",
    password: "$argon2id$v=19$m=15360,t=2,p=1$CK/shCsqcAng1U81FDzAxA$UEPw1XKYaTjPwKtoiNUZGW64skCaXZgHrtNraZxwJPw",
    visible_courts: "B01,B41ME00",
    visible_forces: "",
    excluded_triggers: "",
    groups: ["Audit"]
  }
]

export default (): DummyUser[] => {
  return userRows.map((user) => {
    return {
      username: user.username,
      password: user.password,
      email: user.email,
      forenames: user.forenames,
      surname: user.surname,
      visibleForces: user.visible_forces.split(","),
      featureFlags: {},
      groups: [...user.groups, "NewUI"],
      visibleCourts: user.visible_courts.split(",")
    }
  })
}
