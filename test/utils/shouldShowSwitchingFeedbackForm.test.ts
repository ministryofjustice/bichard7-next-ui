import { SWITCHING_FEEDBACK_FORM_FREQUENCY_IN_HOURS } from "../../src/config"
import shouldShowSwitchingFeedbackForm from "../../src/utils/shouldShowSwitchingFeedbackForm"

describe("shouldShowSwitchingFeedbackForm", () => {
  it("should return false when last submission was less than 3 hours ago", () => {
    const date = new Date()
    const lessThan3HoursAgo = new Date(
      Date.UTC(
        date.getUTCFullYear(),
        date.getUTCMonth(),
        date.getUTCDate(),
        date.getUTCHours() - SWITCHING_FEEDBACK_FORM_FREQUENCY_IN_HOURS,
        date.getUTCMinutes(),
        date.getUTCSeconds(),
        date.getUTCMilliseconds() + 1
      )
    )

    const result = shouldShowSwitchingFeedbackForm(lessThan3HoursAgo)

    expect(result).toBe(false)
  })

  it("should return true when last submission was more than 3 hours ago", () => {
    const date = new Date()
    const moreThan3HoursAgo = new Date(
      Date.UTC(
        date.getUTCFullYear(),
        date.getUTCMonth(),
        date.getUTCDate(),
        date.getUTCHours() - SWITCHING_FEEDBACK_FORM_FREQUENCY_IN_HOURS,
        date.getUTCMinutes(),
        date.getUTCSeconds(),
        date.getUTCMilliseconds() - 1
      )
    )

    const result = shouldShowSwitchingFeedbackForm(moreThan3HoursAgo)

    expect(result).toBe(true)
  })
  it("should return true when last submission does not have value", () => {
    const result = shouldShowSwitchingFeedbackForm(undefined)

    expect(result).toBe(true)
  })
})
