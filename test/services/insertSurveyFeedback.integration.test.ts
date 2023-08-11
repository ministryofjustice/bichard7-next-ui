import getDataSource from "services/getDataSource"
import insertSurveyFeedback from "services/insertSurveyFeedback"
import { DataSource } from "typeorm"
import { isError } from "types/Result"

describe("insertSurveyFeedback", () => {
  let dataSource: DataSource

  beforeAll(async () => {
    dataSource = await getDataSource()
  })

  it("should insert a new survey", async () => {
    const dummyResponse = { experience: "very satisfied", comment: "some comment" }
    const feedback = {
      response: dummyResponse,
      feedbackType: 1 // TODO: create an enum for feedback types
    }

    const result = await insertSurveyFeedback(dataSource, feedback)

    expect(isError(result)).toBe(false)
    const recordedFeedback = await dataSource.getRepository(SurveyFeedback).findOne({})

    const actualFeedback = recordedFeedback as SurveyFeedback
    expect(actualFeedback.response).toEqual(dummyResponse)
    expect(actualFeedback.feedbackType).toBe(1)
  })
})
