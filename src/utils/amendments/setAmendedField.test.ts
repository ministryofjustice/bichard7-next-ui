import setAmendedField from "./setAmendedField"

describe("setAmendedField", () => {
  describe("nextHearingDate", () => {
    it("can set the amended value when there are no other amendments", () => {
      const existingAmendments = {}
      const updatedValue = new Date("2024-01-01")

      const result = setAmendedField(
        "nextHearingDate",
        { resultIndex: 0, offenceIndex: 0, updatedValue: updatedValue },
        existingAmendments
      )

      expect(result).toEqual({
        nextHearingDate: [{ resultIndex: 0, offenceIndex: 0, updatedValue: updatedValue }]
      })
    })

    it("can update the an existing amendment value", () => {
      const oldValue = new Date("2001-05-05")
      const existingAmendments = {
        nextHearingDate: [{ resultIndex: 0, offenceIndex: 0, updatedValue: oldValue }]
      }

      const updatedValue = new Date("2024-01-02")

      const result = setAmendedField(
        "nextHearingDate",
        { resultIndex: 0, offenceIndex: 0, updatedValue: updatedValue },
        existingAmendments
      )

      expect(result).toEqual({
        nextHearingDate: [{ resultIndex: 0, offenceIndex: 0, updatedValue: updatedValue }]
      })
    })

    it("can set multiple amended value for the same key", () => {
      const firstResultOfFirstOffenceNextHearingDate = new Date("2024-01-01")
      const secondResultOfFirstOffenceNextHearingDate = new Date("2024-01-02")

      const existingAmendments = {
        nextHearingDate: [{ offenceIndex: 0, resultIndex: 0, updatedValue: firstResultOfFirstOffenceNextHearingDate }]
      }

      const result = setAmendedField(
        "nextHearingDate",
        { offenceIndex: 0, resultIndex: 1, updatedValue: secondResultOfFirstOffenceNextHearingDate },
        existingAmendments
      )

      expect(result).toEqual({
        nextHearingDate: [
          { offenceIndex: 0, resultIndex: 0, updatedValue: firstResultOfFirstOffenceNextHearingDate },
          { offenceIndex: 0, resultIndex: 1, updatedValue: secondResultOfFirstOffenceNextHearingDate }
        ]
      })
    })

    it("can add amendments when there are other amendments", () => {
      const firstResultOfFirstOffenceNextHearingDate = new Date("2024-01-01")
      const secondResultOfFirstOffenceNextHearingDate = new Date("2024-01-02")

      const existingAmendments = {
        forceOwner: "03",
        nextHearingDate: [{ offenceIndex: 0, resultIndex: 0, updatedValue: firstResultOfFirstOffenceNextHearingDate }]
      }

      const result = setAmendedField(
        "nextHearingDate",
        { offenceIndex: 3, resultIndex: 5, updatedValue: secondResultOfFirstOffenceNextHearingDate },
        existingAmendments
      )

      expect(result).toEqual({
        forceOwner: "03",
        nextHearingDate: [
          { offenceIndex: 0, resultIndex: 0, updatedValue: firstResultOfFirstOffenceNextHearingDate },
          { offenceIndex: 3, resultIndex: 5, updatedValue: secondResultOfFirstOffenceNextHearingDate }
        ]
      })
    })
  })

  describe("Where amendment values are primitive strings", () => {
    const updatedValue = "dummy update"

    it("can set the amended value when there are no other amendments", () => {
      const existingAmendments = {}
      const result = setAmendedField("asn", updatedValue, existingAmendments)

      expect(result).toEqual({
        asn: updatedValue
      })
    })

    it("can update the an existing amendment value", () => {
      const existingAmendments = {
        forceOwner: "old value"
      }
      const result = setAmendedField("forceOwner", updatedValue, existingAmendments)

      expect(result).toEqual({
        forceOwner: updatedValue
      })
    })

    it("can add amendments when there are other amendments", () => {
      const existingAmendments = {
        forceOwner: "old value",
        asn: "untouched"
      }
      const result = setAmendedField("forceOwner", updatedValue, existingAmendments)

      expect(result).toEqual({
        forceOwner: updatedValue,
        asn: "untouched"
      })
    })
  })
})
