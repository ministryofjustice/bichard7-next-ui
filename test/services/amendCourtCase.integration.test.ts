import parseAhoXml from "@moj-bichard7-developers/bichard7-next-core/build/src/parse/parseAhoXml/parseAhoXml"
import fs from "fs"
import amendCourtCase from "services/amendCourtCase"
import CourtCase from "services/entities/CourtCase"
import Note from "services/entities/Note"
import User from "services/entities/User"
import getDataSource from "services/getDataSource"
import updateCourtCaseAho from "services/updateCourtCaseAho"
import { DataSource } from "typeorm"
import createForceOwner from "utils/createForceOwner"
import getCourtCase from "../../src/services/getCourtCase"
import deleteFromEntity from "../utils/deleteFromEntity"
import { getDummyCourtCase, insertCourtCases } from "../utils/insertCourtCases"

jest.mock("services/getCourtCase")
jest.mock("services/updateCourtCaseAho")
jest.mock("@moj-bichard7-developers/bichard7-next-core/build/src/parse/parseAhoXml/parseAhoXml")
jest.mock("utils/createForceOwner")

jest.setTimeout(60 * 60 * 1000)

describe("amend court case", () => {
  const userName = "Bichard01"
  let dataSource: DataSource

  beforeAll(async () => {
    dataSource = await getDataSource()
  })

  beforeEach(async () => {
    await deleteFromEntity(Note)
    await deleteFromEntity(CourtCase)
    jest.resetAllMocks()
    jest.clearAllMocks()
    ;(getCourtCase as jest.Mock).mockImplementation(jest.requireActual("services/getCourtCase").default)
    ;(parseAhoXml as jest.Mock).mockImplementation(
      jest.requireActual("@moj-bichard7-developers/bichard7-next-core/build/src/parse/parseAhoXml/parseAhoXml").default
    )
    ;(updateCourtCaseAho as jest.Mock).mockImplementation(jest.requireActual("services/updateCourtCaseAho").default)
    ;(createForceOwner as jest.Mock).mockImplementation(jest.requireActual("utils/createForceOwner").default)
  })

  afterAll(async () => {
    await dataSource.destroy()
  })

  it("should amend the court case", async () => {
    const inputCourtCase = await getDummyCourtCase({
      errorLockedByUsername: null,
      triggerLockedByUsername: null,
      errorCount: 1,
      errorStatus: "Unresolved",
      triggerCount: 1,
      phase: 1
    })

    await insertCourtCases(inputCourtCase)

    expect(inputCourtCase.hearingOutcome).toMatchSnapshot()

    const result = await amendCourtCase(dataSource, {}, inputCourtCase.errorId, { username: userName } as User)

    expect(result).not.toBeInstanceOf(Error)
    expect(result).toMatchSnapshot()

    const retrievedCase = await dataSource
      .getRepository(CourtCase)
      .findOne({ where: { errorId: inputCourtCase.errorId } })

    expect(retrievedCase?.hearingOutcome).toMatchSnapshot()
  })

  it("should amend the court case when the lock is held by the current user", async () => {
    const inputCourtCase = await getDummyCourtCase({
      errorLockedByUsername: "Bichard01",
      triggerLockedByUsername: null,
      errorCount: 1,
      errorStatus: "Unresolved",
      triggerCount: 1,
      phase: 1
    })

    await insertCourtCases(inputCourtCase)

    expect(inputCourtCase.hearingOutcome).toMatchSnapshot()

    const result = await amendCourtCase(dataSource, {}, inputCourtCase.errorId, { username: userName } as User)

    expect(result).not.toBeInstanceOf(Error)
    expect(result).toMatchSnapshot()

    const retrievedCase = await dataSource
      .getRepository(CourtCase)
      .findOne({ where: { errorId: inputCourtCase.errorId } })

    expect(retrievedCase?.hearingOutcome).toMatchSnapshot()
  })

  it("should generates system notes for each each amendments", async () => {
    const inputCourtCase = await getDummyCourtCase({
      errorLockedByUsername: null,
      triggerLockedByUsername: null,
      errorCount: 1,
      errorStatus: "Unresolved",
      triggerCount: 1,
      phase: 1
    })

    await insertCourtCases(inputCourtCase)

    const result = await amendCourtCase(
      dataSource,
      {
        forceOwner: "03",
        courtOffenceSequenceNumber: [
          {
            offenceIndex: 0,
            updatedValue: 3333
          },
          {
            offenceIndex: 1,
            updatedValue: 1111
          }
        ]
      },
      inputCourtCase.errorId,
      { username: userName } as User
    )

    expect(result).not.toBeInstanceOf(Error)

    const retrievedCase = await dataSource
      .getRepository(CourtCase)
      .findOne({ where: { errorId: inputCourtCase.errorId } })

    expect(retrievedCase?.notes).toHaveLength(3)
    expect(retrievedCase?.notes[0].userId).toEqual("System")
    expect(retrievedCase?.notes[0].noteText).toEqual(
      `${userName}: Portal Action: Update Applied. Element: forceOwner. New Value: 03`
    )
    expect(retrievedCase?.notes[1].userId).toEqual("System")
    expect(retrievedCase?.notes[1].noteText).toEqual(
      `${userName}: Portal Action: Update Applied. Element: courtOffenceSequenceNumber. New Value: 3333`
    )
    expect(retrievedCase?.notes[2].userId).toEqual("System")
    expect(retrievedCase?.notes[2].noteText).toEqual(
      `${userName}: Portal Action: Update Applied. Element: courtOffenceSequenceNumber. New Value: 1111`
    )
  })

  it("should not generate system note when its a no update resubmit amendment", async () => {
    const inputCourtCase = await getDummyCourtCase({
      errorLockedByUsername: null,
      triggerLockedByUsername: null,
      errorCount: 1,
      errorStatus: "Unresolved",
      triggerCount: 1,
      phase: 1
    })

    await insertCourtCases(inputCourtCase)

    const result = await amendCourtCase(dataSource, { noUpdatesResubmit: true }, inputCourtCase.errorId, {
      username: userName
    } as User)

    expect(result).not.toBeInstanceOf(Error)

    const retrievedCase = await dataSource
      .getRepository(CourtCase)
      .findOne({ where: { errorId: inputCourtCase.errorId } })

    expect(retrievedCase?.notes).toHaveLength(0)
  })

  it("should not update the db if the case is locked by somebody else", async () => {
    const inputCourtCase = await getDummyCourtCase({
      errorLockedByUsername: "Bichard02",
      triggerLockedByUsername: null,
      errorCount: 1,
      errorStatus: "Unresolved",
      triggerCount: 1,
      phase: 1
    })

    await insertCourtCases(inputCourtCase)

    expect(inputCourtCase.hearingOutcome).toMatchSnapshot()

    const result = await amendCourtCase(dataSource, {}, inputCourtCase.errorId, { username: userName } as User)

    expect(result).not.toBeInstanceOf(Error)
    expect(result).toMatchSnapshot()

    const retrievedCase = await dataSource
      .getRepository(CourtCase)
      .findOne({ where: { errorId: inputCourtCase.errorId } })

    expect(retrievedCase?.hearingOutcome).toEqual(inputCourtCase.hearingOutcome)
  })

  it("should create a force owner if the force owner is not present", async () => {
    const inputXml = fs.readFileSync("test/test-data/AnnotatedHONoForceOwner.xml").toString()

    const inputCourtCase = await getDummyCourtCase({
      errorLockedByUsername: null,
      triggerLockedByUsername: null,
      errorCount: 1,
      errorStatus: "Unresolved",
      triggerCount: 1,
      phase: 1,
      hearingOutcome: inputXml
    })

    await insertCourtCases(inputCourtCase)

    const result = await amendCourtCase(dataSource, {}, inputCourtCase.errorId, { username: userName } as User)

    expect(createForceOwner).toHaveBeenCalledTimes(1)
    expect(updateCourtCaseAho).toHaveBeenCalledTimes(1)
    expect(createForceOwner).toHaveBeenCalledWith(inputCourtCase.orgForPoliceFilter)
    expect(result).not.toBeInstanceOf(Error)
    expect(result).toMatchSnapshot()
  })

  it("should return an error when the court case is not found", async () => {
    const inputCourtCase = await getDummyCourtCase({
      errorLockedByUsername: null,
      triggerLockedByUsername: null,
      errorCount: 1,
      errorStatus: "Unresolved",
      triggerCount: 1,
      phase: 1
    })

    const result = await amendCourtCase(dataSource, { noUpdatesResubmit: true }, inputCourtCase.errorId, {
      username: userName
    } as User)

    expect(result).toEqual(Error(`Failed to get court case`))
  })

  it("should return an error if produce an error getting the court case", async () => {
    ;(getCourtCase as jest.Mock).mockImplementationOnce(() => new Error(`Failed to get court case`))
    const result = await amendCourtCase(
      dataSource,
      { noUpdatesResubmit: true },
      "random" as unknown as number,
      { username: userName } as User
    )
    expect(result).toEqual(Error(`Failed to get court case`))
  })

  it("should return an error if the xml is invalid", async () => {
    ;(parseAhoXml as jest.Mock).mockImplementationOnce(() => new Error(`Failed to parse aho`))

    const inputCourtCase = await getDummyCourtCase({
      errorLockedByUsername: null,
      triggerLockedByUsername: null,
      errorCount: 1,
      errorStatus: "Unresolved",
      triggerCount: 1,
      phase: 1
    })

    await insertCourtCases(inputCourtCase)

    const result = await amendCourtCase(dataSource, { noUpdatesResubmit: true }, inputCourtCase.errorId, {
      username: userName
    } as User)
    expect(result).toEqual(Error(`Failed to parse aho`))
  })

  it("should return an error if it cannot update the db", async () => {
    ;(updateCourtCaseAho as jest.Mock).mockImplementationOnce(() => new Error("Failed to update the database"))

    const inputCourtCase = await getDummyCourtCase({
      errorLockedByUsername: null,
      triggerLockedByUsername: null,
      errorCount: 1,
      errorStatus: "Unresolved",
      triggerCount: 1,
      phase: 1
    })

    await insertCourtCases(inputCourtCase)

    const result = await amendCourtCase(dataSource, {}, inputCourtCase.errorId, { username: userName } as User)

    expect(result).toEqual(Error("Failed to update the database"))
  })

  it("should return an error if the force owner organistaion unit codes are invalid", async () => {
    ;(createForceOwner as jest.Mock).mockImplementationOnce(() => new Error("Failed to create organistaion unit codes"))

    const inputXml = fs.readFileSync("test/test-data/AnnotatedHONoForceOwner.xml").toString()

    const inputCourtCase = await getDummyCourtCase({
      errorLockedByUsername: null,
      triggerLockedByUsername: null,
      errorCount: 1,
      errorStatus: "Unresolved",
      triggerCount: 1,
      phase: 1,
      hearingOutcome: inputXml
    })

    await insertCourtCases(inputCourtCase)

    const result = await amendCourtCase(dataSource, {}, inputCourtCase.errorId, { username: userName } as User)

    expect(createForceOwner).toHaveBeenCalledTimes(1)
    expect(result).toEqual(Error("Failed to create organistaion unit codes"))
  })
})
