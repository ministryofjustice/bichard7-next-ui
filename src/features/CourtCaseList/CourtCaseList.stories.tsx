import { ComponentMeta, ComponentStory } from "@storybook/react"
import CourtCase from "services/entities/CourtCase"
import type Trigger from "services/entities/Trigger"
import CourtCaseList from "./CourtCaseList"
import { within } from "@storybook/testing-library"
import { expect } from "@storybook/jest"

export default {
  title: "Features/CourtCase/List",
  component: CourtCaseList
} as ComponentMeta<typeof CourtCaseList>

const courtCase = {
  courtName: "Magistrates' Courts Essex Basildon",
  defendantName: "Allocation Trigger",
  errorId: 79057,
  errorReason: "HO100206",
  messageId: "cf60600b-52a0-4bc7-b117-3acfb851a7f5",
  notes: [],
  orgForPoliceFilter: "36FP  ",
  ptiurn: "42CY0300107",
  triggerReason: "TRPR0006",
  triggers: [{ triggerCode: "TRPR0001" } as unknown as Trigger],
  courtDate: new Date("2008-09-26"),
  isUrgent: true
} as unknown as CourtCase

export const EmptyList: ComponentStory<typeof CourtCaseList> = () => <CourtCaseList courtCases={[]} />

EmptyList.play = async ({ canvasElement }) => {
  const canvas = within(canvasElement)
  await expect(canvas.getByText("There are no court cases to show")).toBeInTheDocument()
}

export const OneRecord: ComponentStory<typeof CourtCaseList> = () => <CourtCaseList courtCases={[courtCase]} />

const courtCases = new Array(100).fill(courtCase)
export const ManyRecords: ComponentStory<typeof CourtCaseList> = () => <CourtCaseList courtCases={courtCases} />

ManyRecords.parameters = {
  design: [
    {
      name: "Table component",
      type: "figma",
      url: "https://www.figma.com/file/HwIQgyZQtsCxxDxitpKvvI/B7?node-id=1%3A1170"
    },
    {
      name: "Entire file",
      type: "figma",
      url: "https://www.figma.com/file/HwIQgyZQtsCxxDxitpKvvI/B7?node-id=0%3A1"
    }
  ]
}

ManyRecords.play = async ({ canvasElement }) => {
  const canvas = within(canvasElement)

  const urgentTags = await canvas.findAllByText("Urgent")
  expect(urgentTags).toHaveLength(courtCases.length)
}

const mixedUrgencies: CourtCase[] = new Array(10).fill(0).map((_, index) => {
  const urgencyCourtCase = Object.assign({}, courtCase)
  if (index % 2 === 0) {
    urgencyCourtCase.isUrgent = false
  }
  return urgencyCourtCase
})
export const MixedUrgencies: ComponentStory<typeof CourtCaseList> = () => <CourtCaseList courtCases={mixedUrgencies} />

MixedUrgencies.play = async ({ canvasElement }) => {
  const canvas = within(canvasElement)

  const urgentTags = await canvas.findAllByText("Urgent")
  expect(urgentTags).toHaveLength(mixedUrgencies.filter((c) => c.isUrgent).length)
}
