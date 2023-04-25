import { ComponentMeta, ComponentStory } from "@storybook/react"
import EditableField from "./EditableField"
import { within } from "@storybook/testing-library"
import createDummyAho from "../../../test/helpers/createDummyAho"
import { expect } from "@storybook/jest"

export default {
  title: "Components/EditableField",
  component: EditableField
} as ComponentMeta<typeof EditableField>

const dummyAho = createDummyAho()

export const EditableFieldShowInput: ComponentStory<typeof EditableField> = () => (
  <EditableField
    aho={dummyAho}
    objPath="AnnotatedHearingOutcome.HearingOutcome.Case.HearingDefendant.ArrestSummonsNumber"
    amendFn={() => console.log("amending")}
  />
)

EditableFieldShowInput.play = async ({ canvasElement }) => {
  const canvas = within(canvasElement)
  expect(canvas.getByText("HO100302")).toBeInTheDocument()
  expect(canvas.getByText("original_value")).toBeInTheDocument()
}

export const EditableFieldShowValue: ComponentStory<typeof EditableField> = () => (
  <EditableField
    aho={dummyAho}
    objPath="AnnotatedHearingOutcome.HearingOutcome.Case.HearingDefendant.RemandStatus"
    amendFn={() => console.log("amending")}
  />
)

EditableFieldShowValue.play = async ({ canvasElement }) => {
  const canvas = within(canvasElement)
  expect(canvas.getByText("some_status")).toBeInTheDocument()
  expect(canvas.queryByText("HO100302")).not.toBeInTheDocument()
}
