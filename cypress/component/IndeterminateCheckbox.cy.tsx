import IndeterminateCheckbox from "components/IndeterminateCheckbox"
import { CurrentUserContext } from "context/CurrentUserContext"
import { FilterAction } from "types/CourtCaseFilter"
import { DisplayFullUser } from "types/display/Users"

describe("IndeterminateCheckbox", () => {
  const currentUser = {
    featureFlags: { exceptionsEnabled: true }
  } as unknown as DisplayFullUser

  const handleDispatch = (action: FilterAction) => {
    const { method, type, value } = action
    console.log("Action", method, type, value)
  }

  it("renders with the unchecked state", () => {
    cy.mount(
      <CurrentUserContext.Provider value={{ currentUser }}>
        <IndeterminateCheckbox
          id={"bails"}
          labelText={"Bails"}
          value={"bails"}
          checkedValue={""}
          indeterminate={false}
          dispatch={handleDispatch}
        />
      </CurrentUserContext.Provider>
    )

    cy.get("input#bails").should("not.be.checked")
  })

  it("renders with the checked state", () => {
    cy.mount(
      <CurrentUserContext.Provider value={{ currentUser }}>
        <IndeterminateCheckbox
          id={"bails"}
          labelText={"Bails"}
          value={"bails"}
          checkedValue={"bails"}
          indeterminate={false}
          dispatch={handleDispatch}
        />
      </CurrentUserContext.Provider>
    )

    cy.get("input#bails").should("be.checked")
  })

  it("renders with the indeterminate state with the checkedValue not matching the value", () => {
    cy.mount(
      <CurrentUserContext.Provider value={{ currentUser }}>
        <IndeterminateCheckbox
          id={"bails"}
          labelText={"Bails"}
          value={"bails"}
          checkedValue={""}
          indeterminate={true}
          dispatch={handleDispatch}
        />
      </CurrentUserContext.Provider>
    )

    cy.get("input#bails").should("not.be.checked")
    cy.get("input#bails:indeterminate").should("exist")
  })

  it("renders with the indeterminate state with the checkedValue matching the value", () => {
    cy.mount(
      <CurrentUserContext.Provider value={{ currentUser }}>
        <IndeterminateCheckbox
          id={"bails"}
          labelText={"Bails"}
          value={"bails"}
          checkedValue={"bails"}
          indeterminate={true}
          dispatch={handleDispatch}
        />
      </CurrentUserContext.Provider>
    )

    cy.get("input#bails").should("not.be.checked")
    cy.get("input#bails:indeterminate").should("exist")
  })

  it("responds to being checked", () => {
    const handleDispatchForChecked = (action: FilterAction) => {
      const { method, type, value } = action
      expect(method).to.equals("add")
      expect(type).to.equals("triggerIndeterminate")
      expect(value).to.equals("bails")
    }

    cy.mount(
      <CurrentUserContext.Provider value={{ currentUser }}>
        <IndeterminateCheckbox
          id={"bails"}
          labelText={"Bails"}
          value={"bails"}
          checkedValue={""}
          indeterminate={false}
          dispatch={handleDispatchForChecked}
        />
      </CurrentUserContext.Provider>
    )

    cy.get("input#bails").click()
  })

  it("responds to being unchecked", () => {
    const handleDispatchForUnchecked = (action: FilterAction) => {
      const { method, type, value } = action
      expect(method).to.equals("remove")
      expect(type).to.equals("triggerIndeterminate")
      expect(value).to.equals("bails")
    }

    cy.mount(
      <CurrentUserContext.Provider value={{ currentUser }}>
        <IndeterminateCheckbox
          id={"bails"}
          labelText={"Bails"}
          value={"bails"}
          checkedValue={"bails"}
          indeterminate={false}
          dispatch={handleDispatchForUnchecked}
        />
      </CurrentUserContext.Provider>
    )

    cy.get("input#bails").click()
  })

  it("responds to being clicked in indeterminate set", () => {
    const handleDispatchForIndeterminate = (action: FilterAction) => {
      const { method, type, value } = action
      expect(method).to.equals("remove")
      expect(type).to.equals("triggerIndeterminate")
      expect(value).to.equals("bails")
    }

    cy.mount(
      <CurrentUserContext.Provider value={{ currentUser }}>
        <IndeterminateCheckbox
          id={"bails"}
          labelText={"Bails"}
          value={"bails"}
          checkedValue={"bails"}
          indeterminate={true}
          dispatch={handleDispatchForIndeterminate}
        />
      </CurrentUserContext.Provider>
    )

    cy.get("input#bails").click()
  })
})
