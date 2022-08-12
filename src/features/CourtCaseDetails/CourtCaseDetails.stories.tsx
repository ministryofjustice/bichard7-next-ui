import parseAhoXml from "@moj-bichard7-developers/bichard7-next-core/build/src/parse/parseAhoXml/parseAhoXml"
import { AnnotatedHearingOutcome } from "@moj-bichard7-developers/bichard7-next-core/build/src/types/AnnotatedHearingOutcome"
import { expect } from "@storybook/jest"
import { ComponentMeta, ComponentStory } from "@storybook/react"
import { within } from "@storybook/testing-library"
import { format } from "date-fns"
import CourtCase from "services/entities/CourtCase"
import Trigger from "services/entities/Trigger"
import CourtCaseAho from "../../../test/testFixtures/database/data/error_list_aho.json"
import CourtCaseDetails from "./CourtCaseDetails"

export default {
  title: "Features/CourtCase/Details",
  component: CourtCaseDetails
} as ComponentMeta<typeof CourtCaseDetails>

const courtCase = {
  courtName: "Magistrates' Courts Essex Basildon",
  defendantName: "Allocation Trigger",
  errorId: 79057,
  errorReason: "HO100206",
  messageId: "cf60600b-52a0-4bc7-b117-3acfb851a7f5",
  notes: [],
  orgForPoliceFilter: "36FP  ",
  ptiurn: "42CY0300107",
  triggerReason: "TRPR0006",
  triggers: [{ triggerCode: "TRPR0001" } as unknown as Trigger],
  courtDate: new Date("2008-09-26")
} as unknown as CourtCase

const aho = parseAhoXml(CourtCaseAho.hearingOutcomeXml) as AnnotatedHearingOutcome

export const Details: ComponentStory<typeof CourtCaseDetails> = () => (
  <CourtCaseDetails courtCase={courtCase} aho={aho} />
)

Details.play = async ({ canvasElement }) => {
  const canvas = within(canvasElement)
  await expect(canvas.getByText(courtCase.ptiurn!)).toBeInTheDocument()
  await expect(canvas.getByText(courtCase.courtName!)).toBeInTheDocument()
  // eslint-disable-next-line @typescript-eslint/no-non-null-assertion
  await expect(canvas.getByText(format(courtCase.courtDate!, "dd/MM/yyyy"))).toBeInTheDocument()
  await expect(canvas.getByText(courtCase.defendantName!)).toBeInTheDocument()
  await expect(canvas.getByText(courtCase.triggerReason!)).toBeInTheDocument()
  await expect(
    canvas.getByText(aho.AnnotatedHearingOutcome.HearingOutcome.Hearing.CourtHearingLocation.OrganisationUnitCode)
  ).toBeInTheDocument()
}
