import { ComponentMeta, ComponentStory } from "@storybook/react"
import CourtCase from "services/entities/CourtCase"
import type Trigger from "services/entities/Trigger"
import CourtCaseList from "./CourtCaseList"
import { within } from "@storybook/testing-library"
import { expect } from "@storybook/jest"
import Note from "services/entities/Note"
import User from "services/entities/User"

export default {
  title: "Features/CourtCaseList",
  component: CourtCaseList
} as ComponentMeta<typeof CourtCaseList>

const userNote = {
  errorId: 79057,
  userId: "test_user_1",
  noteText: "Test note"
} as unknown as Note

const systemNote = {
  errorId: 79057,
  userId: "System",
  noteText: "Test note"
} as unknown as Note

const courtCase = {
  courtName: "Magistrates' Courts Essex Basildon",
  defendantName: "Allocation Trigger",
  errorId: 79057,
  errorReason: "HO100206",
  errorReport: "HO100206",
  messageId: "cf60600b-52a0-4bc7-b117-3acfb851a7f5",
  notes: [userNote, userNote, systemNote],
  orgForPoliceFilter: "36FP  ",
  ptiurn: "42CY0300107",
  triggerReason: "TRPR0006",
  triggers: [{ triggerCode: "TRPR0001" } as unknown as Trigger],
  courtDate: new Date("2008-09-26"),
  isUrgent: true
} as unknown as CourtCase

const user = {
  username: "Sup User",
  groups: ["NewUI"]
} as User
export const EmptyList: ComponentStory<typeof CourtCaseList> = () => (
  <CourtCaseList courtCases={[]} currentUser={user} />
)

EmptyList.play = async ({ canvasElement }) => {
  const canvas = within(canvasElement)
  await expect(canvas.getByText("There are no court cases to show")).toBeInTheDocument()
}

export const OneRecord: ComponentStory<typeof CourtCaseList> = () => (
  <CourtCaseList courtCases={[courtCase]} currentUser={user} />
)
OneRecord.play = async ({ canvasElement }) => {
  const canvas = within(canvasElement)

  const urgentTags = await canvas.findAllByText("Urgent")
  expect(urgentTags).toHaveLength(2) // The column header also matches this

  expect(canvas.getByText("Notes")).toBeInTheDocument()
  expect(canvas.getByText("2 notes")).toBeInTheDocument()
}
OneRecord.parameters = {
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

const courtCases = new Array(100).fill(courtCase)
export const ManyRecords: ComponentStory<typeof CourtCaseList> = () => (
  <CourtCaseList courtCases={courtCases} currentUser={user} />
)

ManyRecords.play = async ({ canvasElement }) => {
  const canvas = within(canvasElement)

  const urgentTags = await canvas.findAllByText("Urgent")
  expect(urgentTags).toHaveLength(courtCases.length + 1) // The column header also matches this

  expect(canvas.getByText("Notes")).toBeInTheDocument()
  const noteTags = await canvas.findAllByText("2 notes")
  expect(noteTags).toHaveLength(courtCases.length)
}
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

const mixedUrgencies: CourtCase[] = new Array(10).fill(0).map((_, index) => {
  const urgencyCourtCase = Object.assign({}, courtCase)
  if (index % 2 === 0) {
    urgencyCourtCase.isUrgent = false
  }
  return urgencyCourtCase
})
export const MixedUrgencies: ComponentStory<typeof CourtCaseList> = () => (
  <CourtCaseList courtCases={mixedUrgencies} currentUser={user} />
)

MixedUrgencies.play = async ({ canvasElement }) => {
  const canvas = within(canvasElement)

  const urgentTags = await canvas.findAllByText("Urgent")
  expect(urgentTags).toHaveLength(mixedUrgencies.filter((c) => c.isUrgent).length + 1) // The column header also matches this
}
MixedUrgencies.parameters = {
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

const mixedNotes: CourtCase[] = new Array(10).fill(0).map((_, index) => {
  const notesCourtCase = Object.assign({}, courtCase)
  if (index % 2 === 0) {
    notesCourtCase.notes = []
  }
  return notesCourtCase
})
export const MixedNotes: ComponentStory<typeof CourtCaseList> = () => (
  <CourtCaseList courtCases={mixedNotes} currentUser={user} />
)

MixedNotes.play = async ({ canvasElement }) => {
  const canvas = within(canvasElement)

  expect(canvas.getByText("Notes")).toBeInTheDocument()
  const noteTags = await canvas.findAllByText("2 notes")
  expect(noteTags).toHaveLength(mixedNotes.filter((c) => c.notes.length).length)
}
MixedNotes.parameters = {
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

const expectedNameLocks = ["Homer Simpson", "Donald Duck", "Bugs Bunny"]
const casesWithLocks: CourtCase[] = expectedNameLocks.map((lockName) => {
  const cases = Object.assign({}, courtCase)
  cases.errorLockedByUsername = lockName
  cases.triggerLockedByUsername = lockName

  return cases
})
export const CasesWithLocks: ComponentStory<typeof CourtCaseList> = () => (
  <CourtCaseList courtCases={casesWithLocks} currentUser={user} />
)

CasesWithLocks.play = async ({ canvasElement }) => {
  const canvas = within(canvasElement)

  expectedNameLocks.forEach(async (name) => {
    const foundNames = await canvas.findAllByText(name)
    expect(foundNames).toHaveLength(2)
  })
}

const lockHolderUsername = "Bugs Bunny"
const caseLockedToUser = Object.assign({}, courtCase)
caseLockedToUser.errorLockedByUsername = lockHolderUsername
caseLockedToUser.triggerLockedByUsername = lockHolderUsername
const lockHolderUser = {
  username: lockHolderUsername,
  groups: ["NewUI"]
} as User

export const CaseLockedToUser: ComponentStory<typeof CourtCaseList> = () => (
  <CourtCaseList courtCases={[caseLockedToUser]} currentUser={lockHolderUser} />
)

CaseLockedToUser.play = async ({ canvasElement }) => {
  const canvas = within(canvasElement)

  const expectedUnlockButtons = await canvas.findAllByRole("button")
  expect(expectedUnlockButtons).toHaveLength(3)
  expect(expectedUnlockButtons[1]).toHaveTextContent("Bugs Bunny")
  expect(expectedUnlockButtons[2]).toHaveTextContent("Bugs Bunny")
}

const superUser = {
  username: lockHolderUsername,
  groups: ["NewUI", "Supervisor"]
} as User

export const CaseViewedBySupervisor: ComponentStory<typeof CourtCaseList> = () => (
  <CourtCaseList courtCases={[caseLockedToUser]} currentUser={superUser} />
)

CaseViewedBySupervisor.play = async ({ canvasElement }) => {
  const canvas = within(canvasElement)

  const expectedUnlockButtons = await canvas.findAllByRole("button")
  expect(expectedUnlockButtons).toHaveLength(3)
  expect(expectedUnlockButtons[1]).toHaveTextContent("Bugs Bunny")
  expect(expectedUnlockButtons[2]).toHaveTextContent("Bugs Bunny")
}
