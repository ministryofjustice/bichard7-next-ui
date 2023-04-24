import groupErrorsFromReport from "./groupErrorsFromReport"

describe("groupErrorsFromReport", () => {
  it("can map all exceptions from the error report", () => {
    const errorReport = "HO100322||ds:OrganisationUnitCode, HO100323||ds:NextHearingDate, HO100310||ds:NextHearingDate"
    expect(groupErrorsFromReport(errorReport)).toStrictEqual({
      HO100322: { count: 1, fields: [{ name: "OrganisationUnitCode", displayName: "Organisation unit code" }] },
      HO100323: { count: 1, fields: [{ name: "NextHearingDate", displayName: "Next hearing date" }] },
      HO100310: { count: 1, fields: [{ name: "NextHearingDate", displayName: "Next hearing date" }] }
    })
  })

  it("can group multiple occurrences of a code", () => {
    const errorReport = "HO100322||ds:OrganisationUnitCode, HO100322||ds:NextHearingDate, HO100310||ds:NextHearingDate"
    expect(groupErrorsFromReport(errorReport)).toStrictEqual({
      HO100322: {
        count: 2,
        fields: [
          { name: "OrganisationUnitCode", displayName: "Organisation unit code" },
          {
            name: "NextHearingDate",
            displayName: "Next hearing date"
          }
        ]
      },
      HO100310: { count: 1, fields: [{ name: "NextHearingDate", displayName: "Next hearing date" }] }
    })
  })
})
