import SurveyFeedback from "services/entities/SurveyFeedback"
import User from "services/entities/User"
import insertSurveyFeedback from "services/insertSurveyFeedback"
import { DataSource, Repository } from "typeorm"
import { isError } from "types/Result"
import { SurveyFeedbackType, SwitchingFeedbackResponse } from "types/SurveyFeedback"
import getDataSource from "../../src/services/getDataSource"
import getLastSwitchingFormSubmission from "../../src/services/getLastSwitchingFormSubmission"
import deleteFromEntity from "../utils/deleteFromEntity"
import { insertUsersWithOverrides } from "../utils/manageUsers"

describe("getLastSwitchingFormSubmission", () => {
  let dataSource: DataSource
  const bichardUserId = 0
  const supervisorUserId = 1

  beforeAll(async () => {
    dataSource = await getDataSource()
    await deleteFromEntity(User)

    await insertUsersWithOverrides([
      { id: bichardUserId, username: `bichard01`, email: `bichard01@example.com` },
      { id: supervisorUserId, username: `supervisor1`, email: `supervisor1@example.com` }
    ])

    // bichard01 = (await dataSource
    //   .getRepository(User)
    //   .createQueryBuilder("user")
    //   .where("user.username = :username", { username: "bichard01" })
    //   .getOne()) as User

    // supervisor1 = (await dataSource
    //   .getRepository(User)
    //   .createQueryBuilder("user")
    //   .where("user.username = :username", { username: "supervisor1" })
    //   .getOne()) as User
  })

  beforeEach(async () => {
    await deleteFromEntity(SurveyFeedback)
  })

  afterAll(async () => {
    await deleteFromEntity(User)
    await dataSource.destroy()
  })

  it("Should return null when there is no record submitted", async () => {
    const result = await getLastSwitchingFormSubmission(dataSource, 1)

    expect(result).toBeNull()
  })

  it("Should return last submission date when there's a record for user", async () => {
    await insertSurveyFeedback(dataSource, {
      feedbackType: SurveyFeedbackType.Switching,
      response: { skipped: true } as SwitchingFeedbackResponse,
      userId: bichardUserId
    } as SurveyFeedback)

    const result = await getLastSwitchingFormSubmission(dataSource, bichardUserId)

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
          userId: bichardUserId,
          createdAt: new Date(dateString)
        } as SurveyFeedback)
      )
    )

    const result = await getLastSwitchingFormSubmission(dataSource, bichardUserId)

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
          userId: bichardUserId,
          createdAt: new Date(dateString)
        } as SurveyFeedback)
      )
    )

    await insertSurveyFeedback(dataSource, {
      feedbackType: SurveyFeedbackType.Switching,
      response: { skipped: true } as SwitchingFeedbackResponse,
      userId: supervisorUserId,
      createdAt: new Date("2023-09-20T23:23:23")
    } as SurveyFeedback)

    const result = await getLastSwitchingFormSubmission(dataSource, bichardUserId)

    expect(isError(result)).toBe(false)
    expect(result).not.toBeNull()
    expect((result as Date).toISOString()).toMatch(/2023-09-16T.*/)
  })

  it("Should return error if database operation fails", async () => {
    jest.spyOn(Repository.prototype, "findOne").mockRejectedValue(new Error("dummy error"))

    const result = await getLastSwitchingFormSubmission(dataSource, bichardUserId)

    expect(isError(result)).toBe(true)
    expect((result as Error).message).toBe("dummy error")

    jest.clearAllMocks()
  })
})
