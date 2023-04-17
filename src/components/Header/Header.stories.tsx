import { ComponentMeta, ComponentStory } from "@storybook/react"
import { within } from "@storybook/testing-library"
import expect from "../../../test/utils/storybook/expect"
import Header from "./Header"

export default {
  title: "Components/Header",
  component: Header
} as ComponentMeta<typeof Header>

export const DisplaysHeader: ComponentStory<typeof Header> = () => (
  <Header serviceName={"Bichard7"} organisationName={"Ministry of Justice"} userName={"User01"} />
)

DisplaysHeader.play = async ({ canvasElement }) => {
  const canvas = within(canvasElement)
  await expect(canvas.getByText("Ministry of Justice")).toBeInTheDocument()
  await expect(canvas.getByText("Bichard7")).toBeInTheDocument()
  await expect(canvas.getByText("User01")).toBeInTheDocument()
}
