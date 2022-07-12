import { ComponentMeta, ComponentStory } from "@storybook/react"
import type CourtCase from "entities/CourtCase"
import type Trigger from "entities/Trigger"
import CourtCaseList from "./CourtCaseList"

export default {
  title: "CourtCase/List",
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
  ptiurn: "42CY0300108",
  triggerReason: "TRPR0006",
  triggers: [{ triggerCode: "TRPR0001" } as unknown as Trigger],
  courtDate: new Date("2008-09-26")
} as unknown as CourtCase

export const EmptyList: ComponentStory<typeof CourtCaseList> = () => <CourtCaseList courtCases={[]} />

export const OneRecord: ComponentStory<typeof CourtCaseList> = () => <CourtCaseList courtCases={[courtCase]} />

export const ManyRecords: ComponentStory<typeof CourtCaseList> = () => (
  <CourtCaseList courtCases={new Array(100).fill(courtCase)} />
)
