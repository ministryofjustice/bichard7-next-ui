import { ComponentMeta, ComponentStory } from "@storybook/react"
import CourtCaseFilter from "./CourtCaseFilter"
import { within } from "@storybook/testing-library"
import { expect } from "@storybook/jest"
import { axe } from "jest-axe"

export default {
  title: "Features/CourtCaseFilters/CourtCaseFilter",
  component: CourtCaseFilter
} as ComponentMeta<typeof CourtCaseFilter>

export const ShouldBeAccessible: ComponentStory<typeof CourtCaseFilter> = () => (
  <div data-testid="filters">
    <CourtCaseFilter
      courtCaseTypes={[]}
      dateRange={null}
      urgency={null}
      locked={null}
      caseState={null}
      courtName={null}
      defendantName={null}
      ptiurn={null}
      reasonSearch={null}
      myCases={false}
    />
  </div>
)

ShouldBeAccessible.play = async ({ canvasElement }) => {
  const canvas = within(canvasElement)

  const pagination = canvas.getByTestId("filters")
  expect(await axe(pagination)).toHaveNoViolations()
}

export const WhenThereAreFiltersApplied: ComponentStory<typeof CourtCaseFilter> = () => (
  <CourtCaseFilter
    courtCaseTypes={["Exceptions"]}
    dateRange={"today"}
    urgency={"Urgent"}
    locked={"Locked"}
    caseState={"Resolved"}
    courtName={"City of London Magistrates' Court"}
    defendantName={"Wilma Flintstone"}
    ptiurn={"Case0000"}
    reasonSearch={"HO200212"}
    myCases={true}
  />
)

WhenThereAreFiltersApplied.play = ({ canvasElement }) => {
  const canvas = within(canvasElement)
  expect(canvas.queryByText("Filter")).toBeInTheDocument()
  expect(canvas.queryByText("Applied filters")).toBeInTheDocument()
  expect(canvas.queryByText("Apply filters")).toBeInTheDocument()
}
