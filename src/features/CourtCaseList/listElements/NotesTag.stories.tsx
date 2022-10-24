import { ComponentMeta, ComponentStory } from "@storybook/react"
import { within } from "@storybook/testing-library"
import { expect } from "@storybook/jest"
import NotesTag from "./NotesTag"

export default {
  title: "Features/CourtCase/List/Elements",
  component: NotesTag
} as ComponentMeta<typeof NotesTag>

export const NoNotes: ComponentStory<typeof NotesTag> = () => <NotesTag numNotes={0} />
NoNotes.play = async ({ canvasElement }) => {
  const canvas = within(canvasElement)
  await expect(canvas.getByText("0")).toBeInTheDocument()
}

export const OneNote: ComponentStory<typeof NotesTag> = () => <NotesTag numNotes={1} />
OneNote.play = async ({ canvasElement }) => {
  const canvas = within(canvasElement)
  await expect(canvas.getByText("1")).toBeInTheDocument()
}

export const OneHundredNotes: ComponentStory<typeof NotesTag> = () => <NotesTag numNotes={100} />
OneHundredNotes.play = async ({ canvasElement }) => {
  const canvas = within(canvasElement)
  await expect(canvas.getByText("100")).toBeInTheDocument()
}
