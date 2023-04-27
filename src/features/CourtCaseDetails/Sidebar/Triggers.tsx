import { GridCol, GridRow } from "govuk-react"
import CourtCase from "../../../services/entities/CourtCase"
import { createUseStyles } from "react-jss"
import Checkbox from "components/Checkbox"
import ActionLink from "components/ActionLink"
import { ChangeEvent, useState } from "react"
import getTriggerDefinition from "utils/getTriggerDefinition"
import type NavigationHandler from "types/NavigationHandler"

interface Props {
  courtCase: CourtCase
  onNavigate: NavigationHandler
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

const Triggers = ({ courtCase, onNavigate }: Props) => {
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

  const handleClick = (offenceOrderIndex?: number) => {
    onNavigate({ location: "Case Details > Offences", args: { offenceOrderIndex } })
  }

  return (
    <>
      {unresolvedTriggers.length === 0 && courtCase.triggers.length > 0 && "All triggers have been resolved."}
      {unresolvedTriggers.length === 0 && courtCase.triggers.length === 0 && "There are no triggers for this case."}
      {unresolvedTriggers.length > 0 && (
        <GridRow className={classes.selectAllRow}>
          <GridCol>
            <ActionLink onClick={selectAll}>{"Select all"}</ActionLink>
          </GridCol>
        </GridRow>
      )}
      {unresolvedTriggers.map((trigger) => {
        const triggerDefinition = getTriggerDefinition(trigger.triggerCode)
        const checkBoxId = `trigger_${trigger.triggerId}`

        return (
          <GridRow key={trigger.triggerId} className={`${classes.triggerRow} moj-trigger-row`}>
            <GridCol className="trigger-details-column">
              <label className="trigger-code" htmlFor={checkBoxId}>
                {trigger.shortTriggerCode}
              </label>
              {trigger.triggerItemIdentity !== undefined && (
                <>
                  {" / "}
                  <ActionLink onClick={() => handleClick(trigger.triggerItemIdentity)}>
                    {"Offence "}
                    {trigger.triggerItemIdentity + 1}
                  </ActionLink>
                </>
              )}
              <p>{triggerDefinition?.description}</p>
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
