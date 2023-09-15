import SurveyFeedback from "services/entities/SurveyFeedback"
import User from "services/entities/User"
import getUser from "services/getUser"
import insertSurveyFeedback from "services/insertSurveyFeedback"
import { DataSource, Repository } from "typeorm"
import { isError } from "types/Result"
import { SurveyFeedbackType, SwitchingFeedbackResponse } from "types/SurveyFeedback"
import getDataSource from "../../src/services/getDataSource"
import getLastSwitchingFormSubmission from "../../src/services/getLastSwitchingFormSubmission"
import deleteFromEntity from "../utils/deleteFromEntity"
describe("getLastSwitchingFormSubmission", () => {
  let dataSource: DataSource, bichard01: User, bichard02: User

  beforeAll(async () => {
    dataSource = await getDataSource()
    bichard01 = (await getUser(dataSource, "Bichard01")) as User
    bichard02 = (await getUser(dataSource, "Bichard02")) as User
  })

  beforeEach(async () => {
    await deleteFromEntity(SurveyFeedback)
  })

  afterAll(async () => {
    if (dataSource) {
      await dataSource.destroy()
    }
  })

  it("Should return null when there is no record submitted", async () => {
    const result = await getLastSwitchingFormSubmission(dataSource, 1)

    expect(result).toBeNull()
  })

  it("Should return last submission date when there's a record for user", async () => {
    await insertSurveyFeedback(dataSource, {
      feedbackType: SurveyFeedbackType.Switching,
      response: { skipped: true } as SwitchingFeedbackResponse,
      userId: bichard01.id
    } as SurveyFeedback)

    const result = await getLastSwitchingFormSubmission(dataSource, bichard01.id)

    expect(isError(result)).toBe(false)
    expect(result).not.toBeNull()
    expect(typeof (result as Date).toISOString).toBe("function")
  })

  it("Should return last submission date when there are multiple records", async () => {
    const dateStrings = ["2023-09-15T10:20:00", "2023-09-14T12:30:00", "2023-09-16T14:45:36"]

    await Promise.all(
      dateStrings.map((dateString) =>
        insertSurveyFeedback(dataSource, {
          feedbackType: SurveyFeedbackType.Switching,
          response: { skipped: true } as SwitchingFeedbackResponse,
          userId: bichard01.id,
          createdAt: new Date(dateString)
        } as SurveyFeedback)
      )
    )

    const result = await getLastSwitchingFormSubmission(dataSource, bichard01.id)

    expect(isError(result)).toBe(false)
    expect(result).not.toBeNull()
    expect((result as Date).toISOString()).toMatch(/2023-09-16T.*/)
  })

  it("Should not return the another user's last submission date", async () => {
    const dateStrings = ["2023-09-15T10:20:00", "2023-09-14T12:30:00", "2023-09-16T14:45:36"]

    await Promise.all(
      dateStrings.map((dateString) =>
        insertSurveyFeedback(dataSource, {
          feedbackType: SurveyFeedbackType.Switching,
          response: { skipped: true } as SwitchingFeedbackResponse,
          userId: bichard01.id,
          createdAt: new Date(dateString)
        } as SurveyFeedback)
      )
    )

    await insertSurveyFeedback(dataSource, {
      feedbackType: SurveyFeedbackType.Switching,
      response: { skipped: true } as SwitchingFeedbackResponse,
      userId: bichard02.id,
      createdAt: new Date("2023-09-20T23:23:23")
    } as SurveyFeedback)

    const result = await getLastSwitchingFormSubmission(dataSource, bichard01.id)

    expect(isError(result)).toBe(false)
    expect(result).not.toBeNull()
    expect((result as Date).toISOString()).toMatch(/2023-09-16T.*/)
  })

  it("Should return error if database operation fails", async () => {
    jest.spyOn(Repository.prototype, "findOne").mockRejectedValue(new Error("dummy error"))

    const result = await getLastSwitchingFormSubmission(dataSource, bichard01.id)

    expect(isError(result)).toBe(true)
    expect((result as Error).message).toBe("dummy error")

    jest.clearAllMocks()
  })
})
