import getExceptionPathDetails from "./getExceptionPathDetails"

describe("getExceptionPathDetails", () => {
  it("should return path details for the offence", () => {
    const path = [
      "AnnotatedHearingOutcome",
      "HearingOutcome",
      "Case",
      "HearingDefendant",
      "Offence",
      1,
      "Result",
      2,
      "NextResultSourceOrganisation",
      "OrganisationUnitCode"
    ]
    const result = getExceptionPathDetails(path)

    expect(result).toStrictEqual({
      displayText: "Organisation unit code (Offence 2)",
      field: "OrganisationUnitCode",
      location: "Offence 2",
      offenceOrderIndex: 2,
      tab: "Offences"
    })
  })

  it("should return path details for the case", () => {
    const path = ["AnnotatedHearingOutcome", "HearingOutcome", "Case", "HearingDefendant", "ArrestSummonsNumber"]
    const result = getExceptionPathDetails(path)

    expect(result).toStrictEqual({
      displayText: "Arrest summons number (Case information)",
      field: "ArrestSummonsNumber",
      location: "Case information",
      offenceOrderIndex: undefined,
      tab: "Case information"
    })
  })

  it("should return undefined location and tab when path is not supported", () => {
    const path = ["AnnotatedHearingOutcome"]
    const result = getExceptionPathDetails(path)

    expect(result).toStrictEqual({
      displayText: "Annotated hearing outcome",
      field: "AnnotatedHearingOutcome",
      location: undefined,
      offenceOrderIndex: undefined,
      tab: undefined
    })
  })
})
