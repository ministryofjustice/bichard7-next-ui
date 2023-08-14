import SurveyFeedback from "services/entities/SurveyFeedback"
import { DataSource } from "typeorm"

const insertSurveyFeedback = async (dataSource: DataSource, feedback: SurveyFeedback) => {
  const surveyRepository = dataSource.getRepository(SurveyFeedback)
  await surveyRepository.createQueryBuilder().insert().into(SurveyFeedback).values(feedback).execute()
}

export default insertSurveyFeedback
