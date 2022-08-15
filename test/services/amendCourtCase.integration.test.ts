import fs from "fs"
import { expect } from "@jest/globals"
import { DataSource } from "typeorm"
import getDataSource from "services/getDataSource"
import amendCourtCase from "services/amendCourtCase"
import User from "services/entities/User"
import { getDummyCourtCase, insertCourtCases } from "../util/insertCourtCases"
import deleteFromTable from "../util/deleteFromTable"
import CourtCase from "services/entities/CourtCase"
import updateCourtCaseUpdatedHo from "services/updateCourtCaseUpdatedHo"
import getCourtCase from "../../src/services/getCourtCase"
import parseAhoXml from "@moj-bichard7-developers/bichard7-next-core/build/src/parse/parseAhoXml/parseAhoXml"
import createForceOwner from "utils/createForceOwner"

jest.mock("services/getCourtCase")
jest.mock("services/updateCourtCaseUpdatedHo")
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
    await deleteFromTable(CourtCase)
    jest.resetAllMocks()
    jest.clearAllMocks()
  })

  afterAll(async () => {
    await dataSource.destroy()
  })

  it("should amend the court case", async () => {
    ;(getCourtCase as jest.Mock).mockImplementationOnce(jest.requireActual("services/getCourtCase").default)
    ;(parseAhoXml as jest.Mock).mockImplementationOnce(
      jest.requireActual("@moj-bichard7-developers/bichard7-next-core/build/src/parse/parseAhoXml/parseAhoXml").default
    )
    ;(updateCourtCaseUpdatedHo as jest.Mock).mockImplementationOnce(
      jest.requireActual("services/updateCourtCaseUpdatedHo").default
    )
    ;(createForceOwner as jest.Mock).mockImplementationOnce(jest.requireActual("utils/createForceOwner").default)

    const inputCourtCase = await getDummyCourtCase({
      errorLockedByUsername: null,
      triggerLockedByUsername: null,
      errorCount: 1,
      errorStatus: "Unresolved",
      triggerCount: 1,
      phase: 1
    })

    await insertCourtCases(inputCourtCase)

    expect(inputCourtCase.updatedHearingOutcome).toBe(null)

    const result = await amendCourtCase({}, inputCourtCase.errorId, { username: userName } as User, dataSource)

    expect(result).not.toBeInstanceOf(Error)
    expect(result).toMatchSnapshot()

    const retrievedCase = await dataSource
      .getRepository(CourtCase)
      .findOne({ where: { errorId: inputCourtCase.errorId } })

    expect(retrievedCase?.updatedHearingOutcome).not.toBe(null)
  })
  
  it("should amend the court case when the lock is held by the current user", async () => {
    ;(getCourtCase as jest.Mock).mockImplementationOnce(jest.requireActual("services/getCourtCase").default)
    ;(parseAhoXml as jest.Mock).mockImplementationOnce(
      jest.requireActual("@moj-bichard7-developers/bichard7-next-core/build/src/parse/parseAhoXml/parseAhoXml").default
    )
    ;(updateCourtCaseUpdatedHo as jest.Mock).mockImplementationOnce(
      jest.requireActual("services/updateCourtCaseUpdatedHo").default
    )
    ;(createForceOwner as jest.Mock).mockImplementationOnce(jest.requireActual("utils/createForceOwner").default)

    const inputCourtCase = await getDummyCourtCase({
      errorLockedByUsername: "Bichard01",
      triggerLockedByUsername: null,
      errorCount: 1,
      errorStatus: "Unresolved",
      triggerCount: 1,
      phase: 1
    })

    await insertCourtCases(inputCourtCase)

    expect(inputCourtCase.updatedHearingOutcome).toBe(null)

    const result = await amendCourtCase({}, inputCourtCase.errorId, { username: userName } as User, dataSource)

    expect(result).not.toBeInstanceOf(Error)
    expect(result).toMatchSnapshot()

    const retrievedCase = await dataSource
      .getRepository(CourtCase)
      .findOne({ where: { errorId: inputCourtCase.errorId } })

    expect(retrievedCase?.updatedHearingOutcome).not.toBe(null)
  })


  it("should not update the db if the case is locked by somebody else", async () => {
    ;(getCourtCase as jest.Mock).mockImplementationOnce(jest.requireActual("services/getCourtCase").default)
    ;(parseAhoXml as jest.Mock).mockImplementationOnce(
      jest.requireActual("@moj-bichard7-developers/bichard7-next-core/build/src/parse/parseAhoXml/parseAhoXml").default
    )
    ;(updateCourtCaseUpdatedHo as jest.Mock).mockImplementationOnce(
      jest.requireActual("services/updateCourtCaseUpdatedHo").default
    )
    ;(createForceOwner as jest.Mock).mockImplementationOnce(jest.requireActual("utils/createForceOwner").default)

    const inputCourtCase = await getDummyCourtCase({
      errorLockedByUsername: "Bichard02",
      triggerLockedByUsername: null,
      errorCount: 1,
      errorStatus: "Unresolved",
      triggerCount: 1,
      phase: 1
    })

    await insertCourtCases(inputCourtCase)

    expect(inputCourtCase.updatedHearingOutcome).toBe(null)

    const result = await amendCourtCase({}, inputCourtCase.errorId, { username: userName } as User, dataSource)

    expect(result).not.toBeInstanceOf(Error)
    expect(result).toMatchSnapshot()

    const retrievedCase = await dataSource
      .getRepository(CourtCase)
      .findOne({ where: { errorId: inputCourtCase.errorId } })

    expect(retrievedCase?.updatedHearingOutcome).toBe(null)
  })

  it("should create a force owner if the force owner is not present", async () => {
    ;(getCourtCase as jest.Mock).mockImplementationOnce(jest.requireActual("services/getCourtCase").default)
    ;(parseAhoXml as jest.Mock).mockImplementationOnce(
      jest.requireActual("@moj-bichard7-developers/bichard7-next-core/build/src/parse/parseAhoXml/parseAhoXml").default
    )
    ;(updateCourtCaseUpdatedHo as jest.Mock).mockImplementationOnce(
      jest.requireActual("services/updateCourtCaseUpdatedHo").default
    )
    ;(createForceOwner as jest.Mock).mockImplementationOnce(jest.requireActual("utils/createForceOwner").default)

    const inputXml = fs.readFileSync("test/test-data/AnnotatedHONoForceOwner.xml").toString()

    const inputCourtCase = await getDummyCourtCase({
      errorLockedByUsername: null,
      triggerLockedByUsername: null,
      errorCount: 1,
      errorStatus: "Unresolved",
      triggerCount: 1,
      phase: 1,
      updatedHearingOutcome: inputXml
    })

    await insertCourtCases(inputCourtCase)

    const result = await amendCourtCase({}, inputCourtCase.errorId, { username: userName } as User, dataSource)

    expect(createForceOwner).toHaveBeenCalledTimes(1)
    expect(updateCourtCaseUpdatedHo).toHaveBeenCalledTimes(1)
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

    const result = await amendCourtCase(
      { noUpdatesResubmission: true },
      inputCourtCase.errorId,
      { username: userName } as User,
      dataSource
    )

    expect(result).toEqual(Error(`Failed to get court case`))
  })

  it("should return an error if produce an error getting the court case", async () => {
    ;(getCourtCase as jest.Mock).mockImplementationOnce(() => new Error(`Failed to get court case`))
    const result = await amendCourtCase(
      { noUpdatesResubmission: true },
      "random" as unknown as number,
      { username: userName } as User,
      dataSource
    )
    expect(result).toEqual(Error(`Failed to get court case`))
  })

  it("should return an error if the xml is invalid", async () => {
    ;(getCourtCase as jest.Mock).mockImplementationOnce(jest.requireActual("services/getCourtCase").default)
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

    const result = await amendCourtCase(
      { noUpdatesResubmission: true },
      inputCourtCase.errorId,
      { username: userName } as User,
      dataSource
    )
    expect(result).toEqual(Error(`Failed to parse aho`))
  })

  it("should return an error if it cannot update the db", async () => {
    ;(getCourtCase as jest.Mock).mockImplementationOnce(jest.requireActual("services/getCourtCase").default)
    ;(parseAhoXml as jest.Mock).mockImplementationOnce(
      jest.requireActual("@moj-bichard7-developers/bichard7-next-core/build/src/parse/parseAhoXml/parseAhoXml").default
    )
    ;(updateCourtCaseUpdatedHo as jest.Mock).mockImplementationOnce(() => new Error("Failed to update the database"))
    ;(createForceOwner as jest.Mock).mockImplementationOnce(jest.requireActual("utils/createForceOwner").default)

    const inputCourtCase = await getDummyCourtCase({
      errorLockedByUsername: null,
      triggerLockedByUsername: null,
      errorCount: 1,
      errorStatus: "Unresolved",
      triggerCount: 1,
      phase: 1
    })

    await insertCourtCases(inputCourtCase)

    expect(inputCourtCase.updatedHearingOutcome).toBe(null)

    const result = await amendCourtCase({}, inputCourtCase.errorId, { username: userName } as User, dataSource)

    expect(result).toEqual(Error("Failed to update the database"))
  })

  it("should return an error if the force owner organistaion unit codes are invalid", async () => {
    ;(getCourtCase as jest.Mock).mockImplementationOnce(jest.requireActual("services/getCourtCase").default)
    ;(parseAhoXml as jest.Mock).mockImplementationOnce(
      jest.requireActual("@moj-bichard7-developers/bichard7-next-core/build/src/parse/parseAhoXml/parseAhoXml").default
    )
    ;(updateCourtCaseUpdatedHo as jest.Mock).mockImplementationOnce(
      jest.requireActual("services/updateCourtCaseUpdatedHo").default
    )
    ;(createForceOwner as jest.Mock).mockImplementationOnce(() => new Error("Failed to create organistaion unit codes"))

    const inputXml = fs.readFileSync("test/test-data/AnnotatedHONoForceOwner.xml").toString()

    const inputCourtCase = await getDummyCourtCase({
      errorLockedByUsername: null,
      triggerLockedByUsername: null,
      errorCount: 1,
      errorStatus: "Unresolved",
      triggerCount: 1,
      phase: 1,
      updatedHearingOutcome: inputXml
    })

    await insertCourtCases(inputCourtCase)

    const result = await amendCourtCase({}, inputCourtCase.errorId, { username: userName } as User, dataSource)

    expect(createForceOwner).toHaveBeenCalledTimes(1)
    expect(result).toEqual(Error("Failed to create organistaion unit codes"))
  })
})
