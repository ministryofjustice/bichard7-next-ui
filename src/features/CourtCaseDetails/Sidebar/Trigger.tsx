import { GridCol, GridRow, Heading, Paragraph } from "govuk-react"
import { createUseStyles } from "react-jss"
import Checkbox from "components/Checkbox"
import ActionLink from "components/ActionLink"
import PreviewButton from "components/PreviewButton"
import { default as TriggerEntity } from "services/entities/Trigger"
import { ChangeEvent, useState } from "react"
import ConditionalRender from "components/ConditionalRender"
import { Preview } from "components/Preview"
import getTriggerDefinition from "utils/getTriggerDefinition"

interface Props {
  trigger: TriggerEntity
  onClick: (index: number | undefined) => void
  selectedTriggerIds: number[]
  setTriggerSelection: (event: ChangeEvent<HTMLInputElement>) => void
}

const useStyles = createUseStyles({
  triggerRow: {
    "& .trigger-details-column": {
      "& .trigger-code": {
        fontWeight: "bold"
      }
    },
    "& .checkbox-column": {
      textAlign: "right",
      "& .moj-checkbox": {
        marginRight: "9px"
      }
    }
  },
  cjsResultCode: {
    fontSize: "16px",
    lineHeight: "1.25"
  }
})

const Trigger = ({ trigger, onClick, selectedTriggerIds, setTriggerSelection }: Props) => {
  const triggerDefinition = getTriggerDefinition(trigger.triggerCode)
  const [showHelpBox, setShowHelpBox] = useState(false)

  const checkBoxId = `trigger_${trigger.triggerId}`
  const isResolved = trigger.status === "Resolved"

  const classes = useStyles()

  return (
    <div key={trigger.triggerId}>
      <GridRow className={`${classes.triggerRow} moj-trigger-row`}>
        <GridCol className="trigger-details-column">
          <label className="trigger-code" htmlFor={checkBoxId}>
            {trigger.shortTriggerCode}
          </label>
          {trigger.triggerItemIdentity !== undefined && (
            <>
              {" / "}
              <ActionLink onClick={() => onClick(trigger.triggerItemIdentity)}>
                {"Offence "}
                {trigger.triggerItemIdentity + 1}
              </ActionLink>
            </>
          )}
          <p>{triggerDefinition?.description}</p>
        </GridCol>
        <GridCol setWidth="70px" className="checkbox-column">
          {isResolved ? (
            <span className="moj-badge moj-badge--green">{"Complete"}</span>
          ) : (
            <Checkbox
              id={checkBoxId}
              value={trigger.triggerId}
              checked={selectedTriggerIds.includes(trigger.triggerId)}
              onChange={setTriggerSelection}
            />
          )}
        </GridCol>
      </GridRow>
      <GridRow>
        <GridCol>
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
