import { faker } from "@faker-js/faker"
import { differenceInDays, subDays } from "date-fns"
import sample from "lodash.sample"
import { DataSource } from "typeorm"
import { v4 as uuidv4 } from "uuid"
import CourtCase from "../../src/services/entities/CourtCase"
import { ResolutionStatus } from "../../src/types/ResolutionStatus"
import createDummyAsn from "./createDummyAsn"
import createDummyCourtCode from "./createDummyCourtCode"
import createDummyPtiurn from "./createDummyPtiurn"

const randomResolutionStatus = (): ResolutionStatus => {
  const choices: ResolutionStatus[] = ["Unresolved", "Resolved", "Submitted"]
  return sample(choices) || "Unresolved"
}

const randomPhase = (): number => sample([1, 2, 3]) || 1

const randomBoolean = (): boolean => sample([true, false]) ?? true

// Generates a random case with no triggers or exceptions
export default (dataSource: DataSource, orgCode: string, dateFrom?: Date, dateTo?: Date): CourtCase => {
  const dateRangeDays = dateFrom && dateTo ? differenceInDays(dateFrom, dateTo) : 12 * 30
  const caseDate = subDays(new Date(dateTo || new Date()), Math.round(Math.random() * dateRangeDays))
  const ptiurn = createDummyPtiurn(caseDate.getFullYear(), orgCode + faker.random.alpha(2).toUpperCase())

  const courtCase = dataSource.getRepository(CourtCase).create({
    messageId: uuidv4(),
    orgForPoliceFilter: orgCode,
    phase: randomPhase(),
    errorStatus: randomResolutionStatus(),
    triggerStatus: randomResolutionStatus(),
    errorQualityChecked: 1,
    triggerQualityChecked: 1,
    triggerCount: 0,
    isUrgent: randomBoolean(),
    asn: createDummyAsn(caseDate.getFullYear(), orgCode + faker.random.alpha(2).toUpperCase()),
    courtCode: createDummyCourtCode(orgCode),
    hearingOutcome: "",
    errorReport: "",
    createdTimestamp: caseDate,
    errorReason: "",
    triggerReason: "",
    errorCount: 0,
    userUpdatedFlag: randomBoolean() ? 1 : 0,
    courtDate: caseDate,
    ptiurn: ptiurn,
    courtName: faker.address.city(),
    messageReceivedTimestamp: caseDate,
    defendantName: faker.name.firstName() + " " + faker.name.lastName(),
    courtRoom: Math.round(Math.random() * 15)
      .toString()
      .padStart(2, "0"),
    courtReference: ptiurn,
    errorInsertedTimestamp: caseDate,
    triggerInsertedTimestamp: caseDate,
    pncUpdateEnabled: "Y",
    notes: [],
    triggers: []
  })

  return courtCase
}
