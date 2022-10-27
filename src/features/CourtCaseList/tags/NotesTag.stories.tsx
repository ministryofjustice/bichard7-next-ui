import { ComponentMeta, ComponentStory } from "@storybook/react"
import { within } from "@storybook/testing-library"
import { expect } from "@storybook/jest"
import NotesTag from "./NotesTag"
import Note from "services/entities/Note"

export default {
  title: "Features/CourtCaseList/NotesTag",
  component: NotesTag
} as ComponentMeta<typeof NotesTag>

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

export const NoNotes: ComponentStory<typeof NotesTag> = () => <NotesTag notes={[]} />
NoNotes.play = ({ canvasElement }) => {
  const canvas = within(canvasElement)
  expect(canvas.queryByText("0")).toBeNull()
}
NoNotes.parameters = {
  design: [
    {
      name: "Notes tag",
      type: "figma",
      url: "https://www.figma.com/file/LHxGJpfSjuTczcqrFzUQNc/06_B7_22-Handover-hifi-case-list-screens?node-id=5%3A5344"
    },
    {
      name: "Entire table",
      type: "figma",
      url: "https://www.figma.com/file/LHxGJpfSjuTczcqrFzUQNc/06_B7_22-Handover-hifi-case-list-screens?node-id=5%3A5282"
    }
  ]
}

export const OneUserNote: ComponentStory<typeof NotesTag> = () => <NotesTag notes={[userNote]} />
OneUserNote.play = ({ canvasElement }) => {
  const canvas = within(canvasElement)
  expect(canvas.getByText("1")).toBeInTheDocument()
}
OneUserNote.parameters = {
  design: [
    {
      name: "Notes tag",
      type: "figma",
      url: "https://www.figma.com/file/LHxGJpfSjuTczcqrFzUQNc/06_B7_22-Handover-hifi-case-list-screens?node-id=5%3A5344"
    },
    {
      name: "Entire table",
      type: "figma",
      url: "https://www.figma.com/file/LHxGJpfSjuTczcqrFzUQNc/06_B7_22-Handover-hifi-case-list-screens?node-id=5%3A5282"
    }
  ]
}

const manyUserNotes: Note[] = new Array(100).fill(userNote)
export const OneHundredUserNotes: ComponentStory<typeof NotesTag> = () => <NotesTag notes={manyUserNotes} />
OneHundredUserNotes.play = ({ canvasElement }) => {
  const canvas = within(canvasElement)
  expect(canvas.getByText("100")).toBeInTheDocument()
}
OneHundredUserNotes.parameters = {
  design: [
    {
      name: "Notes tag",
      type: "figma",
      url: "https://www.figma.com/file/LHxGJpfSjuTczcqrFzUQNc/06_B7_22-Handover-hifi-case-list-screens?node-id=5%3A5344"
    },
    {
      name: "Entire table",
      type: "figma",
      url: "https://www.figma.com/file/LHxGJpfSjuTczcqrFzUQNc/06_B7_22-Handover-hifi-case-list-screens?node-id=5%3A5282"
    }
  ]
}

export const OneSystemNote: ComponentStory<typeof NotesTag> = () => <NotesTag notes={[systemNote]} />
OneSystemNote.play = ({ canvasElement }) => {
  const canvas = within(canvasElement)
  expect(canvas.queryByText("1")).toBeNull()
}
OneSystemNote.parameters = {
  design: [
    {
      name: "Notes tag",
      type: "figma",
      url: "https://www.figma.com/file/LHxGJpfSjuTczcqrFzUQNc/06_B7_22-Handover-hifi-case-list-screens?node-id=5%3A5344"
    },
    {
      name: "Entire table",
      type: "figma",
      url: "https://www.figma.com/file/LHxGJpfSjuTczcqrFzUQNc/06_B7_22-Handover-hifi-case-list-screens?node-id=5%3A5282"
    }
  ]
}

const manySystemNotes: Note[] = new Array(100).fill(systemNote)
export const OneHundredSystemNotes: ComponentStory<typeof NotesTag> = () => <NotesTag notes={manySystemNotes} />
OneHundredSystemNotes.play = ({ canvasElement }) => {
  const canvas = within(canvasElement)
  expect(canvas.queryByText("100")).toBeNull()
}
OneHundredSystemNotes.parameters = {
  design: [
    {
      name: "Notes tag",
      type: "figma",
      url: "https://www.figma.com/file/LHxGJpfSjuTczcqrFzUQNc/06_B7_22-Handover-hifi-case-list-screens?node-id=5%3A5344"
    },
    {
      name: "Entire table",
      type: "figma",
      url: "https://www.figma.com/file/LHxGJpfSjuTczcqrFzUQNc/06_B7_22-Handover-hifi-case-list-screens?node-id=5%3A5282"
    }
  ]
}

export const MixedNotes: ComponentStory<typeof NotesTag> = () => (
  <NotesTag notes={[userNote, systemNote, userNote, systemNote]} />
)
MixedNotes.play = ({ canvasElement }) => {
  const canvas = within(canvasElement)
  expect(canvas.getByText("2")).toBeInTheDocument()
}
MixedNotes.parameters = {
  design: [
    {
      name: "Notes tag",
      type: "figma",
      url: "https://www.figma.com/file/LHxGJpfSjuTczcqrFzUQNc/06_B7_22-Handover-hifi-case-list-screens?node-id=5%3A5344"
    },
    {
      name: "Entire table",
      type: "figma",
      url: "https://www.figma.com/file/LHxGJpfSjuTczcqrFzUQNc/06_B7_22-Handover-hifi-case-list-screens?node-id=5%3A5282"
    }
  ]
}
