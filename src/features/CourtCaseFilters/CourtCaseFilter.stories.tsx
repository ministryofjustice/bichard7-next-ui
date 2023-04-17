import { ComponentMeta, ComponentStory } from "@storybook/react"
import CourtCaseFilter from "./CourtCaseFilter"
import { within } from "@storybook/testing-library"
import { expect } from "@storybook/jest"

export default {
  title: "Features/CourtCaseFilters/CourtCaseFilter",
  component: CourtCaseFilter
} as ComponentMeta<typeof CourtCaseFilter>

const dummyCaseAgeCounts = {
  Today: 0,
  Yesterday: 0,
  "Day 2": 0,
  "Day 3": 0
}

export const WhenThereAreFiltersApplied: ComponentStory<typeof CourtCaseFilter> = () => (
  <CourtCaseFilter
    reasons={["Exceptions"]}
    caseAge={["Today"]}
    caseAgeCounts={dummyCaseAgeCounts}
    urgency={"Urgent"}
    locked={"Locked"}
    caseState={"Resolved"}
    courtName={"City of London Magistrates' Court"}
    defendantName={"FLINTSTONE Wilma"}
    ptiurn={"Case0000"}
    reasonCode={"HO200212"}
    dateRange={null}
    myCases={true}
  />
)

WhenThereAreFiltersApplied.play = ({ canvasElement }) => {
  const canvas = within(canvasElement)
  expect(canvas.queryByText("Filter")).toBeInTheDocument()
  expect(canvas.queryByText("Applied filters")).toBeInTheDocument()
  expect(canvas.queryByText("Apply filters")).toBeInTheDocument()
}
