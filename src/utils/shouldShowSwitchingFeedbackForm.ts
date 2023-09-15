import { SWITCHING_FEEDBACK_FORM_FREQUENCY_IN_HOURS } from "../config"

const shouldShowSwitchingFeedbackForm = (lastFeedbackFormSubmission?: Date) => {
  const date = new Date()
  const hoursBehindInMs = Date.UTC(
    date.getUTCFullYear(),
    date.getUTCMonth(),
    date.getUTCDate(),
    date.getUTCHours() - SWITCHING_FEEDBACK_FORM_FREQUENCY_IN_HOURS,
    date.getUTCMinutes(),
    date.getUTCSeconds(),
    date.getUTCMilliseconds()
  )

  return !lastFeedbackFormSubmission || lastFeedbackFormSubmission.getTime() < hoursBehindInMs
}

export default shouldShowSwitchingFeedbackForm
