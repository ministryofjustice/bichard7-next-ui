import { CjsPlea } from "@moj-bichard7-developers/bichard7-next-core/core/phase1/types/Plea"
import { HearingResult } from "../../src/features/CourtCaseDetails/Tabs/Panels/Offences/Offence/HearingResult"
import verdicts from "@moj-bichard7-developers/bichard7-next-data/dist/data/verdict.json"
import ResultClass from "@moj-bichard7-developers/bichard7-next-core/core/phase1/types/ResultClass"
import { Result } from "@moj-bichard7-developers/bichard7-next-core/core/types/AnnotatedHearingOutcome"
import { ExceptionCode } from "@moj-bichard7-developers/bichard7-next-core/core/types/ExceptionCode"

describe("Hearing Result", () => {
  let result: Result

  beforeEach(() => {
    result = {
      CJSresultCode: 1234,
      ResultHearingType: "hearing type",
      ResultHearingDate: new Date("2022-09-10"),
      NextHearingDate: new Date("2022-09-11"),
      PleaStatus: CjsPlea.Guilty,
      Verdict: verdicts[1].cjsCode,
      ModeOfTrialReason: "reason",
      ResultVariableText: "this is some text",
      PNCDisposalType: 1,
      ResultClass: ResultClass.ADJOURNMENT,
      PNCAdjudicationExists: true
    } as Result
  })

  it("displays all mandatory fields", () => {
    cy.mount(<HearingResult result={result} exceptions={[]} />)

    cy.contains("td", "CJS Code").siblings().should("include.text", "1234")
    cy.contains("td", "Result hearing type").siblings().should("include.text", "Hearing type")
    cy.contains("td", "Result hearing date").siblings().should("include.text", "10/09/2022")
    cy.contains("td", "Next hearing date").siblings().should("include.text", "11/09/2022")
    cy.contains("td", "Plea").siblings().should("include.text", "G (Guilty)")
    cy.contains("td", "Verdict").siblings().should("include.text", "G (Guilty)")
    cy.contains("td", "Mode of trial reason").siblings().should("include.text", "reason")
    cy.contains("td", "Hearing result text").siblings().should("include.text", "this is some text")
    cy.contains("td", "PNC disposal type").siblings().should("include.text", 1)
    cy.contains("td", "Result class").siblings().should("include.text", "Adjournment")
    cy.contains("td", "PNC adjudication exists").siblings().should("include.text", "Y")
  })

  describe("Durations", () => {
    it("displays the duration length and unit", () => {
      result.Duration = [
        {
          DurationLength: 6,
          DurationType: "",
          DurationUnit: "M"
        }
      ]

      cy.mount(<HearingResult result={result} exceptions={[]} />)

      cy.contains("td", "Duration").siblings().should("include.text", "6 months")
    })

    it("does not display the duration row if not present", () => {
      result.Duration = undefined

      cy.mount(<HearingResult result={result} exceptions={[]} />)

      cy.contains("td", "Duration").should("not.exist")
    })

    it("displays multiple durations", () => {
      result.Duration = [
        {
          DurationLength: 3,
          DurationType: "",
          DurationUnit: "Y"
        },
        {
          DurationLength: 28,
          DurationType: "",
          DurationUnit: "D"
        }
      ]
      cy.mount(<HearingResult result={result} exceptions={[]} />)
      cy.contains("td", "Duration").siblings().should("include.text", "3 years")
      cy.contains("td", "Duration").siblings().should("include.text", "28 days")
    })
  })

  describe("Next hearing date", () => {
    it("does not display the next hearing date row if not present", () => {
      result.NextHearingDate = undefined

      cy.mount(<HearingResult result={result} exceptions={[]} />)

      cy.contains("td", "Next hearing date").should("not.exist")
    })

    it("displays the next hearing date with an invalid value", () => {
      result.NextHearingDate = "false"

      cy.mount(<HearingResult result={result} exceptions={[]} />)

      cy.contains("td", "Next hearing date").siblings().should("include.text", "false")
    })

    it("displays the next hearing date field when it has no value but has an error", () => {
      result.NextHearingDate = undefined

      cy.mount(<HearingResult result={result} exceptions={[ExceptionCode.HO100323]} />)

      cy.contains("td", "Next hearing date").siblings().should("include.text", "")
    })
  })
})
