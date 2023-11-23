import setAmendedFields from "./setAmendedFields"

describe("setAmendedFields", () => {
  it("can set the amended value for nextHearingDate field", () => {
    const amendments = {}
    const updatedValue = new Date("2024-01-01")

    const result = setAmendedFields(
      "nextHearingDate",
      { resultIndex: 0, offenceIndex: 0, updatedValue: updatedValue },
      amendments
    )

    expect(result).toEqual({
      nextHearingDate: [{ resultIndex: 0, offenceIndex: 0, updatedValue: updatedValue }]
    })
  })

  it("can update the amended value", () => {
    const amendments = {
      nextHearingDate: [{ resultIndex: 0, offenceIndex: 0, updatedValue: "something else" }]
    }

    const updatedValue = new Date("2024-01-02")

    const result = setAmendedFields(
      "nextHearingDate",
      { resultIndex: 0, offenceIndex: 0, updatedValue: updatedValue },
      amendments
    )

    expect(result).toEqual({
      nextHearingDate: [{ resultIndex: 0, offenceIndex: 0, updatedValue: updatedValue }]
    })
  })
})
