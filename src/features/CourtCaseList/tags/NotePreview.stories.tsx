// import { expect } from "@storybook/jest"
// import { ComponentMeta, ComponentStory } from "@storybook/react"
// import { within } from "@storybook/testing-library"
// import Note from "services/entities/Note"

import NotePreview from "./NotePreview"
console.log(NotePreview)

// import NotePreview from "./NotePreview"
// export default {
//   title: "Features/CourtCaseList/NotePreview",
//   component: NotePreview
// } as ComponentMeta<typeof NotePreview>

// const userNote = {
//   errorId: 79057,
//   userId: "test_user_1",
//   noteText: "Test note"
// } as unknown as Note

// const systemNote = {
//   errorId: 79057,
//   userId: "System",
//   noteText: "Test note"
// } as unknown as Note

// const setShowPreview = () => {
//   return false
// }

// export const NoNotes: ComponentStory<typeof NotePreview> = () => (
//   <NotePreview previewState={false} setShowPreview={setShowPreview} numberOfNotes={0} />
// )
// NoNotes.play = ({ canvasElement }) => {
//   const canvas = within(canvasElement)
//   expect(canvas.queryByText("0")).toBeNull()
// }
// NoNotes.parameters = {
//   design: [
//     {
//       name: "Notes tag",
//       type: "figma",
//       url: "https://www.figma.com/file/LHxGJpfSjuTczcqrFzUQNc/06_B7_22-Handover-hifi-case-list-screens?node-id=5%3A5344"
//     },
//     {
//       name: "Entire table",
//       type: "figma",
//       url: "https://www.figma.com/file/LHxGJpfSjuTczcqrFzUQNc/06_B7_22-Handover-hifi-case-list-screens?node-id=5%3A5282"
//     }
//   ]
// }

// export const OneUserNote: ComponentStory<typeof NotePreview> = () => (
//   <NotePreview previewState={true} setShowPreview={setShowPreview} numberOfNotes={1} />
// )
// OneUserNote.play = ({ canvasElement }) => {
//   const canvas = within(canvasElement)
//   expect(canvas.getByText("1")).toBeInTheDocument()
// }
// OneUserNote.parameters = {
//   design: [
//     {
//       name: "Notes tag",
//       type: "figma",
//       url: "https://www.figma.com/file/LHxGJpfSjuTczcqrFzUQNc/06_B7_22-Handover-hifi-case-list-screens?node-id=5%3A5344"
//     },
//     {
//       name: "Entire table",
//       type: "figma",
//       url: "https://www.figma.com/file/LHxGJpfSjuTczcqrFzUQNc/06_B7_22-Handover-hifi-case-list-screens?node-id=5%3A5282"
//     }
//   ]
// }

// const manyUserNotes: Note[] = new Array(100).fill(userNote)
// export const OneHundredUserNotes: ComponentStory<typeof NotePreview> = () => (
//   <NotePreview previewState={false} setShowPreview={setShowPreview} numberOfNotes={100} />
// )
// OneHundredUserNotes.play = ({ canvasElement }) => {
//   const canvas = within(canvasElement)
//   expect(canvas.getByText("100")).toBeInTheDocument()
// }
// OneHundredUserNotes.parameters = {
//   design: [
//     {
//       name: "Notes tag",
//       type: "figma",
//       url: "https://www.figma.com/file/LHxGJpfSjuTczcqrFzUQNc/06_B7_22-Handover-hifi-case-list-screens?node-id=5%3A5344"
//     },
//     {
//       name: "Entire table",
//       type: "figma",
//       url: "https://www.figma.com/file/LHxGJpfSjuTczcqrFzUQNc/06_B7_22-Handover-hifi-case-list-screens?node-id=5%3A5282"
//     }
//   ]
// }

// export const OneSystemNote: ComponentStory<typeof NotePreview> = () => (
//   <NotePreview previewState={false} setShowPreview={setShowPreview} numberOfNotes={1} />
// )
// OneSystemNote.play = ({ canvasElement }) => {
//   const canvas = within(canvasElement)
//   expect(canvas.queryByText("1")).toBeNull()
// }
// OneSystemNote.parameters = {
//   design: [
//     {
//       name: "Notes tag",
//       type: "figma",
//       url: "https://www.figma.com/file/LHxGJpfSjuTczcqrFzUQNc/06_B7_22-Handover-hifi-case-list-screens?node-id=5%3A5344"
//     },
//     {
//       name: "Entire table",
//       type: "figma",
//       url: "https://www.figma.com/file/LHxGJpfSjuTczcqrFzUQNc/06_B7_22-Handover-hifi-case-list-screens?node-id=5%3A5282"
//     }
//   ]
// }

// const manySystemNotes: Note[] = new Array(100).fill(systemNote)
// export const OneHundredSystemNotes: ComponentStory<typeof NotePreview> = () => (
//   <NotePreview previewState={false} setShowPreview={setShowPreview} numberOfNotes={100} />
// )
// OneHundredSystemNotes.play = ({ canvasElement }) => {
//   const canvas = within(canvasElement)
//   expect(canvas.queryByText("100")).toBeNull()
// }
// OneHundredSystemNotes.parameters = {
//   design: [
//     {
//       name: "Notes tag",
//       type: "figma",
//       url: "https://www.figma.com/file/LHxGJpfSjuTczcqrFzUQNc/06_B7_22-Handover-hifi-case-list-screens?node-id=5%3A5344"
//     },
//     {
//       name: "Entire table",
//       type: "figma",
//       url: "https://www.figma.com/file/LHxGJpfSjuTczcqrFzUQNc/06_B7_22-Handover-hifi-case-list-screens?node-id=5%3A5282"
//     }
//   ]
// }

// export const MixedNotes: ComponentStory<typeof NotePreview> = () => (
//   <NotePreview notes={[userNote, systemNote, userNote, systemNote]} />
// )
// MixedNotes.play = ({ canvasElement }) => {
//   const canvas = within(canvasElement)
//   expect(canvas.getByText("2")).toBeInTheDocument()
// }
// MixedNotes.parameters = {
//   design: [
//     {
//       name: "Notes tag",
//       type: "figma",
//       url: "https://www.figma.com/file/LHxGJpfSjuTczcqrFzUQNc/06_B7_22-Handover-hifi-case-list-screens?node-id=5%3A5344"
//     },
//     {
//       name: "Entire table",
//       type: "figma",
//       url: "https://www.figma.com/file/LHxGJpfSjuTczcqrFzUQNc/06_B7_22-Handover-hifi-case-list-screens?node-id=5%3A5282"
//     }
//   ]
// }
