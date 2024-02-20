import ActionLink from "components/ActionLink"
import Checkbox from "components/Checkbox"
import ConditionalRender from "components/ConditionalRender"
import { Preview } from "components/Preview"
import PreviewButton from "components/PreviewButton"
import { GridCol, GridRow, Heading, Paragraph } from "govuk-react"
import { ChangeEvent, SyntheticEvent, useState } from "react"
import { createUseStyles } from "react-jss"
import styled from "styled-components"
import { DisplayTrigger } from "types/display/Triggers"
import getTriggerDefinition from "utils/getTriggerDefinition"

interface Props {
  trigger: DisplayTrigger
  onClick: (index: number | undefined) => void
  selectedTriggerIds: number[]
  setTriggerSelection: (event: ChangeEvent<HTMLInputElement>) => void
  disabled?: boolean
}

const useStyles = createUseStyles({
  triggerContainer: {
    "&:first-child": {
      marginTop: "20px"
    },
    "&:not(:last-child)": {
      marginBottom: "30px"
    }
  },
  triggerHeaderRow: {
    maxHeight: "25px"
  },
  triggerCode: {
    fontWeight: "bold"
  },
  triggerCheckbox: {
    position: "absolute",
    right: "22px"
  },
  cjsResultCode: {
    fontSize: "1em",
    lineHeight: "1.25"
  }
})

const TriggerDefinition = styled.div`
  margin-top: 10px;
`

const TriggerStatus = styled.div`
  display: flex;
  flex-direction: row;
  justify-content: end;
`

const TriggerCompleteBadge = () => <span className="moj-badge moj-badge--green">{"Complete"}</span>

const Trigger = ({ trigger, onClick, selectedTriggerIds, setTriggerSelection, disabled }: Props) => {
  const triggerDefinition = getTriggerDefinition(trigger.triggerCode)
  const [showHelpBox, setShowHelpBox] = useState(false)
  const classes = useStyles()

  const checkBoxId = `trigger_${trigger.triggerId}`
  const isResolved = trigger.status === "Resolved"

  return (
    <div key={trigger.triggerId} className={`moj-trigger-row ${classes.triggerContainer}`}>
      <GridRow className={`trigger-header ${classes.triggerHeaderRow}`}>
        <GridCol className="trigger-details-column" setWidth="85%">
          <label className={`trigger-code ${classes.triggerCode}`} htmlFor={checkBoxId}>
            {trigger.shortTriggerCode}
          </label>
          {(trigger.triggerItemIdentity ?? 0) > 0 && (
            <>
              <b>{" / "}</b>
              <ActionLink
                onClick={(event: SyntheticEvent) => {
                  event.preventDefault()
                  onClick(trigger.triggerItemIdentity)
                }}
              >
                {"Offence "} {trigger.triggerItemIdentity}
              </ActionLink>
            </>
          )}
        </GridCol>
        <GridCol setWidth="15%">
          <TriggerStatus>
            <ConditionalRender isRendered={isResolved}>
              <TriggerCompleteBadge />
            </ConditionalRender>
            <ConditionalRender isRendered={!disabled && !isResolved}>
              <Checkbox
                id={checkBoxId}
                value={trigger.triggerId}
                checked={selectedTriggerIds.includes(trigger.triggerId)}
                onChange={setTriggerSelection}
              />
            </ConditionalRender>
          </TriggerStatus>
        </GridCol>
      </GridRow>
      <GridRow>
        <GridCol>
          <TriggerDefinition>{triggerDefinition?.description}</TriggerDefinition>
          <PreviewButton
            className="triggers-help-preview"
            showPreview={!showHelpBox}
            previewLabel="More information"
            onClick={() => setShowHelpBox(!showHelpBox)}
          />
        </GridCol>
      </GridRow>
      <GridRow>
        <GridCol>
          <ConditionalRender isRendered={showHelpBox}>
            <Preview className="triggers-help">
              <Heading as="h3" size="SMALL">
                {"PNC screen to update"}
              </Heading>
              <Paragraph supportingText={true}>{triggerDefinition?.pncScreenToUpdate ?? "Trigger not found"}</Paragraph>
              <Heading as="h3" size="SMALL">
                {"CJS result code"}
              </Heading>
              <div
                className={classes.cjsResultCode}
                dangerouslySetInnerHTML={{ __html: triggerDefinition?.cjsResultCode ?? "" }}
              ></div>
            </Preview>
          </ConditionalRender>
        </GridCol>
      </GridRow>
    </div>
  )
}

export default Trigger
