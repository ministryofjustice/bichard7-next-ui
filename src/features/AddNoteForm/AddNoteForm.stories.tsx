import { expect } from "@storybook/jest"
import { ComponentMeta, ComponentStory } from "@storybook/react"
import { within } from "@storybook/testing-library"
import AddNoteForm from "./AddNoteForm"

export default {
  title: "Features/CourtCase/Notes/Add",
  component: AddNoteForm
} as ComponentMeta<typeof AddNoteForm>

export const CaseNotLockedByAnotherUser: ComponentStory<typeof AddNoteForm> = () => (
  <AddNoteForm lockedByAnotherUser={false} />
)

CaseNotLockedByAnotherUser.play = ({ canvasElement }) => {
  expect(canvasElement.querySelector("textarea[name=noteText]")).not.toBeNull()
  const canvas = within(canvasElement)
  expect(canvas.queryByText("Case is locked by another user.")).toBeNull()
}

export const CaseLockedByAnotherUser: ComponentStory<typeof AddNoteForm> = () => (
  <AddNoteForm lockedByAnotherUser={true} />
)

CaseLockedByAnotherUser.play = ({ canvasElement }) => {
  expect(canvasElement.querySelector("textarea[name=noteText]")).toBeNull()
  const canvas = within(canvasElement)
  expect(canvas.queryByText("Add")).toBeNull()
  expect(canvas.getByText("Case is locked by another user.")).toBeInTheDocument()
}

export const ErrorMessage: ComponentStory<typeof AddNoteForm> = () => (
  <AddNoteForm lockedByAnotherUser={false} error={"Example error message"} />
)

ErrorMessage.play = ({ canvasElement }) => {
  expect(canvasElement.querySelector("textarea[name=noteText]")).not.toBeNull()
  const canvas = within(canvasElement)
  expect(canvas.getByText("Add a new note")).toBeInTheDocument()
  expect(canvas.getByText("Example error message")).toBeInTheDocument()
  expect(canvas.getByText("Add")).toBeInTheDocument()
  expect(canvas.queryByText("Case is locked by another user.")).toBeNull()
}

export const LongNoteText: ComponentStory<typeof AddNoteForm> = () => <AddNoteForm lockedByAnotherUser={false} />

LongNoteText.play = ({ canvasElement }) => {
  expect(canvasElement.querySelector("textarea[name=noteText]")).not.toBeNull()
  const longNoteText = "This is a very long note text ".repeat(500)
  canvasElement.getElementsByTagName("textarea").item(0)?.setRangeText(longNoteText)
  const canvas = within(canvasElement)
  expect(canvas.getByText("Add a new note")).toBeInTheDocument()
  expect(canvas.getByText("Add")).toBeInTheDocument()
  expect(canvas.queryByText("Case is locked by another user.")).toBeNull()
}
