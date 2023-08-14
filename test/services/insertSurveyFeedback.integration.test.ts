import SurveyFeedback from "services/entities/SurveyFeedback"
import getDataSource from "services/getDataSource"
import insertSurveyFeedback from "services/insertSurveyFeedback"
import { DataSource } from "typeorm"
import { isError } from "types/Result"
import { SurveyFeedbackType } from "types/SurveyFeedback"
import deleteFromEntity from "../utils/deleteFromEntity"

describe("insertSurveyFeedback", () => {
  let dataSource: DataSource

  beforeAll(async () => {
    dataSource = await getDataSource()
  })

  beforeEach(async () => {
    await deleteFromEntity(SurveyFeedback)
  })

  it("should insert a new survey", async () => {
    const dummyResponse = { experience: "very satisfied", comment: "some comment" }
    const feedback = {
      id: 0,
      response: dummyResponse,
      feedbackType: SurveyFeedbackType.General
    }

    const result = await insertSurveyFeedback(dataSource, feedback as SurveyFeedback)

    expect(isError(result)).toBe(false)
    const recordedFeedback = await dataSource.getRepository(SurveyFeedback).findOne({ where: { id: 0 } })
    console.log(recordedFeedback)
    const actualFeedback = recordedFeedback as SurveyFeedback
    expect(actualFeedback.response).toEqual(dummyResponse)
    expect(actualFeedback.feedbackType).toBe(SurveyFeedbackType.General)
  })
})
