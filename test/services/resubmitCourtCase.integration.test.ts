import parseAhoXml from "@moj-bichard7-developers/bichard7-next-core/build/src/parse/parseAhoXml/parseAhoXml"
import { AnnotatedHearingOutcome } from "@moj-bichard7-developers/bichard7-next-core/build/src/types/AnnotatedHearingOutcome"
import CourtCase from "services/entities/CourtCase"
import User from "services/entities/User"
import getDataSource from "services/getDataSource"
import insertNotes from "services/insertNotes"
import sendToQueue from "services/mq/sendToQueue"
import { resubmitCourtCase } from "services/resubmitCourtCase"
import { DataSource } from "typeorm"
import offenceSequenceException from "../test-data/HO100302_1.json"
import updatedOffenceSequenceException from "../test-data/Ho100302_2.json"
import deleteFromTable from "../utils/deleteFromTable"
import { getDummyCourtCase, insertCourtCases } from "../utils/insertCourtCases"

jest.mock("services/mq/sendToQueue")
jest.mock("services/insertNotes")

jest.setTimeout(60 * 60 * 1000)

describe("resubmit court case", () => {
  const userName = "UserName"
  let dataSource: DataSource

  beforeAll(async () => {
    dataSource = await getDataSource()
  })

  beforeEach(async () => {
    await deleteFromTable(CourtCase)
    jest.resetAllMocks()
    jest.clearAllMocks()
  })

  afterAll(async () => {
    await dataSource.destroy()
  })

  it("should resubmit a court case with no updates", async () => {
    const inputCourtCase = await getDummyCourtCase({
      errorLockedByUsername: null,
      triggerLockedByUsername: null,
      errorCount: 1,
      errorStatus: "Unresolved",
      triggerCount: 1,
      phase: 1,
      hearingOutcome: offenceSequenceException.hearingOutcomeXml,
      updatedHearingOutcome: offenceSequenceException.updatedHearingOutcomeXml
    })

    await insertCourtCases(inputCourtCase)

    expect(inputCourtCase.updatedHearingOutcome).toEqual(offenceSequenceException.updatedHearingOutcomeXml)
    expect(inputCourtCase.hearingOutcome).toEqual(offenceSequenceException.hearingOutcomeXml)
    expect(sendToQueue).toHaveBeenCalledTimes(0)

    const result = await resubmitCourtCase(dataSource, { noUpdatesResubmit: true }, inputCourtCase.errorId, {
      username: userName,
      canLockExceptions: true
    } as User)

    expect(result).not.toBeInstanceOf(Error)
    expect(result).toMatchSnapshot()

    const retrievedCase = await dataSource
      .getRepository(CourtCase)
      .findOne({ where: { errorId: inputCourtCase.errorId } })

    expect(sendToQueue).toHaveBeenCalledTimes(1)
    expect(insertNotes).toHaveBeenCalledTimes(1)
    expect(insertNotes).toHaveBeenCalledWith(expect.anything(), [
      { errorId: inputCourtCase.errorId, noteText: "UserName: Portal Action: Resubmitted Message.", userId: "System" }
    ])
    expect(retrievedCase?.updatedHearingOutcome).toEqual(offenceSequenceException.updatedHearingOutcomeXml)
    expect(retrievedCase?.hearingOutcome).toEqual(offenceSequenceException.hearingOutcomeXml)
    expect(retrievedCase?.errorStatus).toBe("Submitted")
  })

  it("should resubmit a court case with updates to Court Offence Sequence Number", async () => {
    const inputCourtCase = await getDummyCourtCase({
      errorLockedByUsername: null,
      triggerLockedByUsername: null,
      errorCount: 1,
      errorStatus: "Unresolved",
      triggerCount: 1,
      phase: 1,
      hearingOutcome: offenceSequenceException.hearingOutcomeXml,
      updatedHearingOutcome: offenceSequenceException.updatedHearingOutcomeXml
    })

    await insertCourtCases(inputCourtCase)

    expect(inputCourtCase.updatedHearingOutcome).toEqual(offenceSequenceException.updatedHearingOutcomeXml)
    expect(inputCourtCase.hearingOutcome).toEqual(offenceSequenceException.hearingOutcomeXml)
    expect(sendToQueue).toHaveBeenCalledTimes(0)

    const input = parseAhoXml(inputCourtCase.updatedHearingOutcome as string)

    expect(input).not.toBeInstanceOf(Error)

    expect(
      (input as AnnotatedHearingOutcome).AnnotatedHearingOutcome.HearingOutcome.Case.HearingDefendant.Offence[0]
        .CourtOffenceSequenceNumber
    ).not.toEqual(1234)

    const result = await resubmitCourtCase(
      dataSource,
      { courtOffenceSequenceNumber: { offenceIndex: 0, updatedValue: 1234 } },
      inputCourtCase.errorId,
      {
        username: userName,
        canLockExceptions: true
      } as User
    )

    expect(result).not.toBeInstanceOf(Error)
    expect(result).toMatchSnapshot()

    const retrievedCase = await dataSource
      .getRepository(CourtCase)
      .findOne({ where: { errorId: inputCourtCase.errorId } })

    expect(sendToQueue).toHaveBeenCalledTimes(1)
    expect(insertNotes).toHaveBeenCalledTimes(1)
    expect(insertNotes).toHaveBeenCalledWith(expect.anything(), [
      { errorId: inputCourtCase.errorId, noteText: "UserName: Portal Action: Resubmitted Message.", userId: "System" }
    ])

    const parsedCase = parseAhoXml((retrievedCase as CourtCase).updatedHearingOutcome as string)

    expect(parsedCase).not.toBeInstanceOf(Error)

    expect(
      (parsedCase as AnnotatedHearingOutcome).AnnotatedHearingOutcome.HearingOutcome.Case.HearingDefendant.Offence[0]
        .CourtOffenceSequenceNumber
    ).toEqual(1234)
    expect(retrievedCase?.updatedHearingOutcome).toEqual(updatedOffenceSequenceException.updatedHearingOutcomeXml)
    expect(retrievedCase?.hearingOutcome).toEqual(updatedOffenceSequenceException.hearingOutcomeXml)
    expect(retrievedCase?.errorStatus).toBe("Submitted")
  })

  it.only("should resubmit a court case with updates to multiple offences", async () => {
    const inputCourtCase = await getDummyCourtCase({
      errorLockedByUsername: null,
      triggerLockedByUsername: null,
      errorCount: 1,
      errorStatus: "Unresolved",
      triggerCount: 1,
      phase: 1,
      hearingOutcome: offenceSequenceException.hearingOutcomeXml,
      updatedHearingOutcome: offenceSequenceException.updatedHearingOutcomeXml
    })

    await insertCourtCases(inputCourtCase)

    expect(inputCourtCase.updatedHearingOutcome).toEqual(offenceSequenceException.updatedHearingOutcomeXml)
    expect(inputCourtCase.hearingOutcome).toEqual(offenceSequenceException.hearingOutcomeXml)
    expect(sendToQueue).toHaveBeenCalledTimes(0)

    const input = parseAhoXml(inputCourtCase.updatedHearingOutcome as string)

    expect(input).not.toBeInstanceOf(Error)

    expect(
      (input as AnnotatedHearingOutcome).AnnotatedHearingOutcome.HearingOutcome.Case.HearingDefendant.Offence[0]
        .CourtOffenceSequenceNumber
    ).not.toEqual(1234)
    expect(
      (input as AnnotatedHearingOutcome).AnnotatedHearingOutcome.HearingOutcome.Case.HearingDefendant.Offence[1]
        .CourtOffenceSequenceNumber
    ).not.toEqual(1234)
    expect(
      (input as AnnotatedHearingOutcome).AnnotatedHearingOutcome.HearingOutcome.Case.HearingDefendant.Offence[2]
        .CourtOffenceSequenceNumber
    ).not.toEqual(1234)

    const result = await resubmitCourtCase(
      dataSource,
      { courtOffenceSequenceNumber: { offenceIndex: 0, updatedValue: 1234 } },
      inputCourtCase.errorId,
      {
        username: userName,
        canLockExceptions: true
      } as User
    )

    expect(result).not.toBeInstanceOf(Error)
    expect(result).toMatchSnapshot()

    const retrievedCase = await dataSource
      .getRepository(CourtCase)
      .findOne({ where: { errorId: inputCourtCase.errorId } })

    expect(sendToQueue).toHaveBeenCalledTimes(1)
    expect(insertNotes).toHaveBeenCalledTimes(1)
    expect(insertNotes).toHaveBeenCalledWith(expect.anything(), [
      { errorId: inputCourtCase.errorId, noteText: "UserName: Portal Action: Resubmitted Message.", userId: "System" }
    ])

    const parsedCase = parseAhoXml((retrievedCase as CourtCase).updatedHearingOutcome as string)

    expect(parsedCase).not.toBeInstanceOf(Error)

    expect(
      (parsedCase as AnnotatedHearingOutcome).AnnotatedHearingOutcome.HearingOutcome.Case.HearingDefendant.Offence[0]
        .CourtOffenceSequenceNumber
    ).toEqual(1234)
    expect(
      (parsedCase as AnnotatedHearingOutcome).AnnotatedHearingOutcome.HearingOutcome.Case.HearingDefendant.Offence[1]
        .CourtOffenceSequenceNumber
    ).toEqual(1234)
    expect(
      (parsedCase as AnnotatedHearingOutcome).AnnotatedHearingOutcome.HearingOutcome.Case.HearingDefendant.Offence[2]
        .CourtOffenceSequenceNumber
    ).toEqual(1234)
    expect(retrievedCase?.updatedHearingOutcome).toEqual(updatedOffenceSequenceException.updatedHearingOutcomeXml)
    expect(retrievedCase?.hearingOutcome).toEqual(updatedOffenceSequenceException.hearingOutcomeXml)
    expect(retrievedCase?.errorStatus).toBe("Submitted")
  })
})
