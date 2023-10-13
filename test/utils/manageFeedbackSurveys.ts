import SurveyFeedback from "services/entities/SurveyFeedback"
import getDataSource from "services/getDataSource"
import { InsertResult } from "typeorm"

const deleteFeedback = async () => {
  const dataSource = await getDataSource()
  return dataSource.manager.query(`DELETE FROM br7own.survey_feedback;`)
}

const insertFeedback = async (feedback: Partial<SurveyFeedback>): Promise<InsertResult> => {
  return (await getDataSource()).getRepository(SurveyFeedback).insert({
    userId: 0,
    response: {},
    feedbackType: 0,
    ...feedback
  })
}

const getAllFeedbacksFromDatabase = async (): Promise<SurveyFeedback[]> => {
  const feedbacks = await (await getDataSource()).getRepository(SurveyFeedback).find()

  return feedbacks
}

export { deleteFeedback, getAllFeedbacksFromDatabase, insertFeedback }
