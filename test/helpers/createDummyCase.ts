import { faker } from "@faker-js/faker"
import { differenceInDays, subDays } from "date-fns"
import sample from "lodash.sample"
import { DataSource } from "typeorm"
import { v4 as uuidv4 } from "uuid"
import CourtCase from "../../src/services/entities/CourtCase"
import dummyAHO from "../test-data/AnnotatedHO1.json"
import createDummyAsn from "./createDummyAsn"
import createDummyCourtCode from "./createDummyCourtCode"
import createDummyExceptions from "./createDummyExceptions"
import createDummyNotes from "./createDummyNotes"
import createDummyPtiurn from "./createDummyPtiurn"
import createDummyTriggers from "./createDummyTriggers"
import createResolutionStatus from "./createResolutionStatus"

const randomPhase = (): number => sample([1, 2, 3]) || 1

const randomBoolean = (): boolean => sample([true, false]) ?? true

const randomUsername = (): string => `${faker.name.firstName().toLowerCase()}.${faker.name.lastName().toLowerCase()}`

const randomName = (): string => `${faker.name.firstName()} ${faker.name.lastName()}`

export default async (
  dataSource: DataSource,
  caseId: number,
  orgCode: string,
  dateFrom?: Date,
  dateTo?: Date
): Promise<CourtCase> => {
  const dateRangeDays = dateFrom && dateTo ? differenceInDays(dateFrom, dateTo) : 12 * 30
  const caseDate = subDays(new Date(dateTo || new Date()), Math.round(Math.random() * dateRangeDays))
  const ptiurn = createDummyPtiurn(caseDate.getFullYear(), orgCode + faker.random.alpha(2).toUpperCase())
  const isResolved = randomBoolean()
  const triggers = createDummyTriggers(dataSource, caseId, caseDate)
  const notes = createDummyNotes(dataSource, caseId, triggers, isResolved)

  const courtCase = await dataSource.getRepository(CourtCase).save({
    errorId: caseId,
    messageId: uuidv4(),
    orgForPoliceFilter: orgCode,
    errorLockedByUsername: !isResolved && randomBoolean() ? randomUsername() : null,
    triggerLockedByUsername: !isResolved && randomBoolean() ? randomUsername() : null,
    phase: randomPhase(),
    errorStatus: createResolutionStatus(),
    triggerStatus: createResolutionStatus(),
    errorQualityChecked: 1,
    triggerQualityChecked: 1,
    triggerCount: 0,
    isUrgent: randomBoolean(),
    asn: createDummyAsn(caseDate.getFullYear(), orgCode + faker.random.alpha(2).toUpperCase()),
    courtCode: createDummyCourtCode(orgCode),
    hearingOutcome: dummyAHO.hearingOutcomeXml,
    errorReport: createDummyExceptions(),
    createdTimestamp: caseDate,
    errorReason: "",
    triggerReason: "",
    errorCount: 0,
    userUpdatedFlag: randomBoolean() ? 1 : 0,
    courtDate: caseDate,
    ptiurn: ptiurn,
    courtName: faker.address.city(),
    messageReceivedTimestamp: caseDate,
    defendantName: randomName(),
    courtRoom: Math.round(Math.random() * 15)
      .toString()
      .padStart(2, "0"),
    courtReference: ptiurn,
    errorInsertedTimestamp: caseDate,
    triggerInsertedTimestamp: caseDate,
    pncUpdateEnabled: "Y",
    notes: notes,
    triggers: triggers
  })

  return courtCase
}
