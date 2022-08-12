import { expect } from "@storybook/jest"
import { ComponentMeta, ComponentStory } from "@storybook/react"
import { within } from "@storybook/testing-library"
import AddNoteForm from "./AddNoteForm"

export default {
  title: "Features/CourtCase/Notes/Add",
  component: AddNoteForm
} as ComponentMeta<typeof AddNoteForm>

export const WhenCaseNotLockedByAnotherUser: ComponentStory<typeof AddNoteForm> = () => (
  <AddNoteForm lockedByAnotherUser={false} />
)

WhenCaseNotLockedByAnotherUser.play = async ({ canvasElement }) => {
  expect(canvasElement.querySelector("textarea[name=noteText]")).not.toBeNull()
  const canvas = within(canvasElement)
  await expect(canvas.getByText("Note text")).toBeInTheDocument()
  await expect(canvas.getByText("Add")).toBeInTheDocument()
  await expect(canvas.queryByText("Case is locked by another user.")).toBeNull()
}

export const WhenCaseLockedByAnotherUser: ComponentStory<typeof AddNoteForm> = () => (
  <AddNoteForm lockedByAnotherUser={true} />
)

WhenCaseLockedByAnotherUser.play = async ({ canvasElement }) => {
  expect(canvasElement.querySelector("textarea[name=noteText]")).toBeNull()
  const canvas = within(canvasElement)
  await expect(canvas.queryByText("Note text")).toBeNull()
  await expect(canvas.queryByText("Add")).toBeNull()
  await expect(canvas.getByText("Case is locked by another user.")).toBeInTheDocument()
}
