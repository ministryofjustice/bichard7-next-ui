import { ComponentMeta, ComponentStory } from "@storybook/react"
import EditableField from "./EditableField"
import { within } from "@storybook/testing-library"
import createDummyAho from "../../../test/helpers/createDummyAho"
import expect from "../../../test/utils/storybook/expect"
import { axe } from "jest-axe"

export default {
  title: "Components/EditableField",
  component: EditableField
} as ComponentMeta<typeof EditableField>

const dummyAho = createDummyAho()

export const EditableFieldShowInput: ComponentStory<typeof EditableField> = () => <EditableField aho={dummyAho} objPath="AnnotatedHearingOutcome.HearingOutcome.Case.HearingDefendant.ArrestSummonsNumber" amendFn={() => console.log("amending")} />

EditableFieldShowInput.story = {
  parameters: {
    nextRouter: {
      basePath: "/bichard"
    }
  }
}

EditableFieldShowInput.play = async ({ canvasElement }) => {
  const canvas = within(canvasElement)
  expect(canvas.getByText("HO100302")).toBeInTheDocument()
  expect(canvas.getByText("original_value")).toBeInTheDocument()
}

export const EditableFieldShowValue: ComponentStory<typeof EditableField> = () => <EditableField aho={dummyAho} objPath="AnnotatedHearingOutcome.HearingOutcome.Case.HearingDefendant.RemandStatus" amendFn={() => console.log("amending")} />

EditableFieldShowInput.story = {
  parameters: {
    nextRouter: {
      basePath: "/bichard"
    }
  }
}

EditableFieldShowValue.play = async ({ canvasElement }) => {
  const canvas = within(canvasElement)
  expect(canvas.getByText("some_status")).toBeInTheDocument()
  expect(canvas.queryByText("HO100302")).not.toBeInTheDocument()
}

export const ShouldBeAccessible: ComponentStory<typeof EditableField> = () => (
  <div data-testid="editable-field">
    <EditableField aho={dummyAho} objPath="AnnotatedHearingOutcome.HearingOutcome.Case.HearingDefendant.ArrestSummonsNumber" amendFn={() => console.log("amending")}/>
  </div>
)

ShouldBeAccessible.play = async ({ canvasElement }) => {
  const canvas = within(canvasElement)

  const editableField = canvas.getByTestId("editable-field")
  expect(await axe(editableField)).toHaveNoViolations()
}

