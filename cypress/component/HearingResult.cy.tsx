import { CjsPlea } from "@moj-bichard7-developers/bichard7-next-core/core/phase1/types/Plea"
import { HearingResult } from "../../src/features/CourtCaseDetails/Tabs/Panels/Offences/Offence/HearingResult"
import verdicts from "@moj-bichard7-developers/bichard7-next-data/dist/data/verdict.json"
import ResultClass from "@moj-bichard7-developers/bichard7-next-core/core/phase1/types/ResultClass"
import { Result } from "@moj-bichard7-developers/bichard7-next-core/core/types/AnnotatedHearingOutcome"

describe("Hearing Result", () => {
  it("displays all mandatory fields", () => {
    const result = {
      CJSresultCode: 1234,
      ResultHearingType: "hearing type",
      ResultHearingDate: new Date("10/09/2022"),
      NextHearingDate: "false", // TODO: confirm this a literal string in the pnc
      PleaStatus: CjsPlea.Guilty,
      Verdict: verdicts[1].cjsCode,
      ModeOfTrialReason: "reason",
      ResultVariableText: "this is some text",
      PNCDisposalType: 1,
      ResultClass: ResultClass.ADJOURNMENT,
      PNCAdjudicationExists: true
    } as Result

    cy.mount(<HearingResult result={result} />)

    cy.contains("td", "CJS Code").siblings().should("include.text", "1234")
    cy.contains("td", "Result hearing type").siblings().should("include.text", "Hearing type")
    cy.contains("td", "Result hearing date").siblings().should("include.text", "09/10/2022")
    cy.contains("td", "Plea").siblings().should("include.text", "G (Guilty)")
    cy.contains("td", "Verdict").siblings().should("include.text", "G (Guilty)")
    cy.contains("td", "Mode of trial reason").siblings().should("include.text", "reason")
    cy.contains("td", "Text").siblings().should("include.text", "this is some text")
    cy.contains("td", "PNC disposal type").siblings().should("include.text", 1)
    cy.contains("td", "Result class").siblings().should("include.text", "Adjournment")
    cy.contains("td", "PNC adjudication exists").siblings().should("include.text", "Y")
  })

  it("displays the duration length and unit", () => {
    const result = {
      Duration: [
        {
          DurationLength: 6,
          DurationType: "",
          DurationUnit: "M"
        }
      ]
    } as Result

    cy.mount(<HearingResult result={result} />)

    cy.contains("td", "Duration").siblings().should("include.text", "6 months")
  })

  it("does not display the duration row if not present", () => {
    const result = {} as Result

    cy.mount(<HearingResult result={result} />)

    cy.contains("td", "Duration").should("not.exist")
  })

  it("displays multiple durations", () => {
    const result = {
      Duration: [
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
    } as Result

    cy.mount(<HearingResult result={result} />)

    cy.contains("td", "Duration").siblings().should("include.text", "3 years")
    cy.contains("td", "Duration").siblings().should("include.text", "28 days")
  })
})
