import { AnnotatedHearingOutcome } from "@moj-bichard7-developers/bichard7-next-core/build/src/types/AnnotatedHearingOutcome"
import DateTime from "components/DateTime"
import ConditionalRender from "components/ConditionalRender"
import HearingOutcome from "components/HearingOutcome"
import ResolveTrigger from "components/ResolveTrigger"
import LinkButton from "components/LinkButton"
import { Heading, Paragraph, Table } from "govuk-react"
import CourtCase from "services/entities/CourtCase"
import { displayedDateFormat } from "utils/formattedDate"
import UrgentBadge from "features/CourtCaseList/tags/UrgentBadge"
import CourtCaseDetailsSummaryBox from "./CourtCaseDetailsSummaryBox"
import { useState } from "react"
import { CourtCaseDetailsTabs, Tabs } from "./Tabs/CourtCaseDetailsTabs"
import { CourtCaseDetailsPanel } from "./Tabs/CourtCaseDetailsPanels"
import { OffencesTable } from "./Tabs/Panels/OffencesTable"
import { HearingTable } from "./Tabs/Panels/HearingTable"

interface Props {
  courtCase: CourtCase
  aho: AnnotatedHearingOutcome
  lockedByAnotherUser: boolean
  triggersVisible: boolean
}

const CourtCaseDetails: React.FC<Props> = ({ courtCase, aho, lockedByAnotherUser, triggersVisible }) => {
  const [activeTab, setActiveTab] = useState<Tabs>("Defendant")

  return (
    <>
      <Heading as="h2" size="LARGE" className="govuk-!-font-weight-regular">
        {"Case details"}
      </Heading>
      <Heading as="h3" size="MEDIUM" className="govuk-!-font-weight-regular">
        {courtCase.defendantName}
        <UrgentBadge
          isUrgent={courtCase.isUrgent}
          className="govuk-!-static-margin-left-5 govuk-!-font-weight-regular"
        />
      </Heading>
      <CourtCaseDetailsSummaryBox
        asn={courtCase.asn}
        courtCode={courtCase.courtCode}
        courtName={courtCase.courtName}
        courtReference={courtCase.courtReference}
        pnci={aho.AnnotatedHearingOutcome.HearingOutcome.Case.HearingDefendant.PNCIdentifier}
        ptiurn={courtCase.ptiurn}
      />
      <CourtCaseDetailsTabs
        activeTab={activeTab}
        onTabClick={setActiveTab}
        tabs={["Defendant", "Hearing", "Case information", "Offences", "Notes", "PNC errors"]}
      />

      <ConditionalRender isRendered={activeTab === "Defendant"}>
        <CourtCaseDetailsPanel heading={"Defendant details"}>{""}</CourtCaseDetailsPanel>
      </ConditionalRender>

      <ConditionalRender isRendered={activeTab === "Hearing"}>
        <CourtCaseDetailsPanel heading={"Hearing details"}>
          <HearingTable hearing={aho.AnnotatedHearingOutcome.HearingOutcome.Hearing} />
        </CourtCaseDetailsPanel>
      </ConditionalRender>

      <ConditionalRender isRendered={activeTab === "Case information"}>
        <CourtCaseDetailsPanel heading={"Case information"}>{""}</CourtCaseDetailsPanel>
      </ConditionalRender>

      <ConditionalRender isRendered={activeTab === "Offences"}>
        <CourtCaseDetailsPanel heading={"Offences"}>
          <OffencesTable offences={aho.AnnotatedHearingOutcome.HearingOutcome.Case?.HearingDefendant?.Offence} />
        </CourtCaseDetailsPanel>
      </ConditionalRender>

      <ConditionalRender isRendered={activeTab === "Notes"}>
        <CourtCaseDetailsPanel heading={"Notes"}>{""}</CourtCaseDetailsPanel>
      </ConditionalRender>

      <ConditionalRender isRendered={activeTab === "PNC errors"}>
        <CourtCaseDetailsPanel heading={"PNC errors"}>{""}</CourtCaseDetailsPanel>
      </ConditionalRender>

      <Table>
        <Table.Row>
          <Table.CellHeader>{"Court date"}</Table.CellHeader>
          <Table.Cell>
            <DateTime date={courtCase.courtDate} dateFormat={displayedDateFormat} />
          </Table.Cell>
        </Table.Row>
        <Table.Row>
          <Table.CellHeader>{"Exception reason"}</Table.CellHeader>
          <Table.Cell>{courtCase.errorReason}</Table.Cell>
        </Table.Row>
        <Table.Row>
          <Table.CellHeader>{"Trigger reason"}</Table.CellHeader>
          <Table.Cell>{courtCase.triggerReason}</Table.Cell>
        </Table.Row>
        <Table.Row>
          <Table.CellHeader>{"Organisation Unit Code"}</Table.CellHeader>
          <Table.Cell>
            {aho.AnnotatedHearingOutcome.HearingOutcome.Hearing.CourtHearingLocation.OrganisationUnitCode}
          </Table.Cell>
        </Table.Row>
        <Table.Row>
          <Table.CellHeader>{"Hearing Outcome"}</Table.CellHeader>
          <Table.Cell>
            <HearingOutcome aho={aho} courtCaseId={courtCase.errorId} />
          </Table.Cell>
        </Table.Row>
      </Table>
      <ConditionalRender isRendered={triggersVisible && (courtCase?.triggers?.length ?? 0) > 0}>
        <Heading as="h3" size="MEDIUM">
          {"Triggers"}
        </Heading>
        <div id="Triggers_table">
          <Table>
            <Table.Row>
              <Table.CellHeader>{"Code"}</Table.CellHeader>
              <Table.CellHeader>{"Item ID"}</Table.CellHeader>
              <Table.CellHeader>{"Resolved by"}</Table.CellHeader>
              <Table.CellHeader>{"Resolved at"}</Table.CellHeader>
              <Table.CellHeader>{"Created at"}</Table.CellHeader>
              <Table.CellHeader>{"Mark as resolved"}</Table.CellHeader>
            </Table.Row>
            {courtCase.triggers.map((trigger, index) => (
              <Table.Row key={index}>
                <Table.Cell>{trigger.triggerCode}</Table.Cell>
                <Table.Cell>{trigger.triggerItemIdentity}</Table.Cell>
                <Table.Cell>{trigger.resolvedBy}</Table.Cell>
                <Table.Cell>{!!trigger.resolvedAt && <DateTime date={trigger.resolvedAt} />}</Table.Cell>
                <Table.Cell>
                  <DateTime date={trigger.createdAt} />
                </Table.Cell>
                <Table.Cell>
                  <ResolveTrigger trigger={trigger} courtCase={courtCase}></ResolveTrigger>
                </Table.Cell>
              </Table.Row>
            ))}
          </Table>
        </div>
      </ConditionalRender>
      <ConditionalRender isRendered={(courtCase?.triggers?.length ?? 0) === 0}>
        <Paragraph>{"Case has no triggers."}</Paragraph>
      </ConditionalRender>
      <Heading as="h3" size="MEDIUM">
        {"Notes"}
      </Heading>
      <ConditionalRender isRendered={(courtCase?.notes?.length ?? 0) > 0}>
        <Table>
          {courtCase.notes.map((note, index) => (
            <Table.Row key={index}>
              <Table.Cell>
                <DateTime date={note.createdAt} />
              </Table.Cell>
              <Table.Cell>{note.noteText}</Table.Cell>
            </Table.Row>
          ))}
        </Table>
      </ConditionalRender>
      <ConditionalRender isRendered={(courtCase?.notes?.length ?? 0) === 0}>
        <Paragraph>{"Case has no notes."}</Paragraph>
      </ConditionalRender>
      <ConditionalRender isRendered={!lockedByAnotherUser}>
        <LinkButton href="notes/add">{"Add Note"}</LinkButton>
      </ConditionalRender>
    </>
  )
}

export default CourtCaseDetails
