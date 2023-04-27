import { GridCol, GridRow } from "govuk-react"
import CourtCase from "../../../services/entities/CourtCase"
import { createUseStyles } from "react-jss"
import ActionLink from "components/ActionLink"
import { ChangeEvent, useState } from "react"
import type NavigationHandler from "types/NavigationHandler"
import Trigger from "./Trigger"

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
  }
})

const TriggersList = ({ courtCase, onNavigate }: Props) => {
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
      {unresolvedTriggers.map((trigger, index) => (
        <Trigger
          key={index}
          trigger={trigger}
          onClick={() => handleClick(trigger.triggerItemIdentity)}
          selectedTriggerIds={selectedTriggerIds}
          setTriggerSelection={setTriggerSelection}
        />
      ))}
    </>
  )
}

export default TriggersList
