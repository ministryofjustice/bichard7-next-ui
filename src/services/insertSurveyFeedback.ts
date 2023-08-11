import { DataSource } from "typeorm"

type Feedback = { response: Object, feedbackType: number} // TODO: create the feedback entity

const insertSurveyFeedback = (dataSource: DataSource, feedback: Feedback) => {}

export default insertSurveyFeedback
