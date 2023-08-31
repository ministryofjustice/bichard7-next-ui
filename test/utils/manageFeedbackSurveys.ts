import SurveyFeedback from "services/entities/SurveyFeedback"
import getDataSource from "services/getDataSource"

const deleteFeedback = async () => {
  const dataSource = await getDataSource()
  return dataSource.manager.query(`DELETE FROM br7own.survey_feedback;`)
}

const getAllFeedbacksFromDatabase = async (): Promise<SurveyFeedback[]> => {
  const feedbacks = await (await getDataSource()).getRepository(SurveyFeedback).find()

  return feedbacks
}

export { deleteFeedback, getAllFeedbacksFromDatabase }
