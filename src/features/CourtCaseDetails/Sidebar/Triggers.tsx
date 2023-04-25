import { GridCol, GridRow, Link } from "govuk-react"
import CourtCase from "../../../services/entities/CourtCase"
import { createUseStyles } from "react-jss"
import Checkbox from "components/Checkbox"
import ActionLink from "components/ActionLink"
import { ChangeEvent, useState } from "react"
import getTriggerInfo from "utils/getTriggerInfo"

interface Props {
  courtCase: CourtCase
}

const useStyles = createUseStyles({
  selectAllRow: {
    textAlign: "right",
    "& .moj-action-link": {
      cursor: "pointer",
      fontSize: "16px",
      marginRight: "10px",
      marginBottom: "16px"
    }
  },
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

const Triggers = ({ courtCase }: Props) => {
  const classes = useStyles()
  const [selectedTriggerIds, setSelectedTriggerIds] = useState<number[]>([])
  const unresolvedTriggers = courtCase.triggers.filter((trigger) => !trigger.resolvedBy)

  const setTriggerSelection = ({ target: checkbox }: ChangeEvent<HTMLInputElement>) => {
    const triggerId = parseInt(checkbox.value, 10)
    const isSelected = checkbox.checked
    if (isSelected) {
      setSelectedTriggerIds([...selectedTriggerIds, triggerId])
    } else {
      setSelectedTriggerIds(selectedTriggerIds.filter((id) => id !== triggerId))
    }
  }

  const selectAll = () => {
    setSelectedTriggerIds(courtCase.triggers.map((trigger) => trigger.triggerId))
  }

  return (
    <>
      {unresolvedTriggers.length === 0 && courtCase.triggers.length > 0 && "All triggers have been resolved."}
      {unresolvedTriggers.length === 0 && courtCase.triggers.length === 0 && "There is no trigger for this case."}
      {unresolvedTriggers.length > 0 && (
        <GridRow className={classes.selectAllRow}>
          <GridCol>
            <ActionLink onClick={selectAll}>{"Select all"}</ActionLink>
          </GridCol>
        </GridRow>
      )}
      {unresolvedTriggers.map((trigger) => {
        const triggerInfo = getTriggerInfo(trigger.triggerCode)
        const checkBoxId = `trigger_${trigger.triggerId}`

        return (
          <GridRow key={trigger.triggerId} className={classes.triggerRow}>
            <GridCol className="trigger-details-column">
              <label className="trigger-code" htmlFor={checkBoxId}>
                {trigger.shortTriggerCode}
              </label>
              {trigger.triggerItemIdentity !== undefined && (
                <>
                  {" / "}
                  <Link href="#">
                    {"Offence "}
                    {trigger.triggerItemIdentity + 1}
                  </Link>
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
        )
      })}
    </>
  )
}

export default Triggers
