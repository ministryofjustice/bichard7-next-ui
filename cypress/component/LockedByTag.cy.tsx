import LockedByText from "../../src/features/CourtCaseList/tags/LockedByTag/LockedByText"
import LockedByButton from "../../src/features/CourtCaseList/tags/LockedByTag/LockedByButton"

describe("LockedByText.cy.tx", () => {
  it("shows the icon and the text", () => {
    cy.mount(<LockedByText lockedBy={"Bichard02"} />)
    cy.contains("Bichard02")
    cy.get(".LockedIcon").should("have.attr", "href").and("include", "/bichard/assets/images/lock.svg")
  })
})

describe("LockedByButton.cy.tx", () => {
  it("shows the icon and the text", () => {
    cy.mount(
      <LockedByButton lockedBy={"Bichard02"} showUnlockConfirmation={false} setShowUnlockConfirmation={() => {}} />
    )
    cy.contains("Bichard02")
    cy.get("img.LockedIcon").should("have.attr", "href").and("include", "/bichard/assets/images/lock.svg")
  })
})
