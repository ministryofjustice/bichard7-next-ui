import { OffenceMatcher } from "components/OffenceMatcher"
import { CourtCaseContext } from "context/CourtCaseContext"
import { Amendments } from "types/Amendments"
import { DisplayFullCourtCase } from "types/display/CourtCases"
import HO100310 from "./HO100310.json"

describe("Offence matcher with single court case", () => {
  describe("Without existing amendments", () => {
    const courtCase = HO100310 as unknown as DisplayFullCourtCase
    const [offence] = courtCase.aho.AnnotatedHearingOutcome.HearingOutcome.Case.HearingDefendant.Offence

    beforeEach(() => {
      cy.mount(
        <CourtCaseContext.Provider value={[{ courtCase, amendments: {}, savedAmendments: {} }, () => {}]}>
          <OffenceMatcher offenceIndex={0} offence={offence} state={true} />
        </CourtCaseContext.Provider>
      )
    })

    it("has a default placeholder", () => {
      cy.get("select").should("have.value", null)
      cy.get("select").find(":selected").should("have.text", "Select an offence")
    })

    it("displays CCR as an <optgroup>", () => {
      cy.get("select").children("optgroup").eq(0).should("have.attr", "label", "97/1626/008395Q")
      cy.get("select").children("optgroup").eq(0).contains("option", "TH68006")
    })

    it("displays matchable offences with an <option>", () => {
      cy.get("select").contains("option", "TH68006")
      cy.get("select").contains("option", "TH68151").should("not.exist")
      cy.get("select").contains("option", "RT88191").should("not.exist")
    })

    it("displays offences in the correct format", () => {
      cy.get("option")
        .contains("TH68006")
        .invoke("text")
        .then((text) => {
          expect(text).equals("001 - TH68006")
        })
    })

    it("displays an <option> for 'Added in court' as the last option", () => {
      cy.get("select").last().contains("option", "Added in court").should("have.value", "0")
    })
  })
})

describe("With existing amendments", () => {
  const courtCase = HO100310 as unknown as DisplayFullCourtCase
  const [offence] = courtCase.aho.AnnotatedHearingOutcome.HearingOutcome.Case.HearingDefendant.Offence

  beforeEach(() => {
    const amendments: Amendments = {
      offenceReasonSequence: [
        {
          offenceIndex: 0,
          value: 1
        }
      ]
    }

    cy.mount(
      <CourtCaseContext.Provider value={[{ courtCase, amendments, savedAmendments: {} }, () => {}]}>
        <OffenceMatcher offenceIndex={0} offence={offence} state={true} />
      </CourtCaseContext.Provider>
    )
  })

  it("loads amended value", () => {
    cy.get("select").should("have.value", 1)
  })
})
