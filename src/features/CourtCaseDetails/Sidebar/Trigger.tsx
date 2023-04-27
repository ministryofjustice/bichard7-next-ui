import { GridCol, GridRow } from "govuk-react"
import { createUseStyles } from "react-jss"
import Checkbox from "components/Checkbox"
import ActionLink from "components/ActionLink"
import getTriggerInfo from "utils/getTriggerInfo"
import PreviewButton from "components/PreviewButton"
import { default as TriggerEntity } from "services/entities/Trigger"
import { ChangeEvent } from "react"

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
  }
})

const Trigger = ({ trigger, onClick, selectedTriggerIds, setTriggerSelection }: Props) => {
  const triggerInfo = getTriggerInfo(trigger.triggerCode)
  const checkBoxId = `trigger_${trigger.triggerId}`
  // const [showHelpBox, setShowHelpBox] = useState(false)

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
          <p>{triggerInfo?.description}</p>
        </GridCol>
        <GridCol setWidth="70px" className="checkbox-column">
          <Checkbox
            id={checkBoxId}
            value={trigger.triggerId}
            checked={selectedTriggerIds.includes(trigger.triggerId)}
            onChange={setTriggerSelection}
          />
        </GridCol>
      </GridRow>
      <GridRow>
        <PreviewButton showPreview={true} previewLabel="More information" onClick={() => {}} />
      </GridRow>
    </div>
  )
}

export default Trigger
