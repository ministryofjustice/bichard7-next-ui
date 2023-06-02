import { GridCol, GridRow } from "govuk-react"
import CourtCase from "../../../services/entities/CourtCase"
import { createUseStyles } from "react-jss"
import ActionLink from "components/ActionLink"
import { ChangeEvent, useState } from "react"
import type NavigationHandler from "types/NavigationHandler"
import Trigger from "./Trigger"
import { sortBy } from "lodash"
import LinkButton from "components/LinkButton"
import ConditionalRender from "components/ConditionalRender"

interface Props {
  courtCase: CourtCase
  onNavigate: NavigationHandler
}

const useStyles = createUseStyles({
  selectAllContainer: {
    textAlign: "right",
    paddingBottom: "20px",
    "#select-all-action": {
      cursor: "pointer",
      fontSize: "19px"
    }
  },
  markCompleteContainer: {
    display: "flex",
    justifyContent: "end"
  }
})

const TriggersList = ({ courtCase, onNavigate }: Props) => {
  const classes = useStyles()
  const [selectedTriggerIds, setSelectedTriggerIds] = useState<number[]>([])
  const triggers = sortBy(courtCase.triggers, "triggerItemIdentity")

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
      {triggers.length === 0 && "There are no triggers for this case."}
      {triggers.length > 0 && (
        <GridRow className={classes.selectAllContainer}>
          <GridCol>
            <ActionLink onClick={selectAll} id="select-all-action">
              {"Select all"}
            </ActionLink>
          </GridCol>
        </GridRow>
      )}
      {triggers.map((trigger, index) => (
        <Trigger
          key={index}
          trigger={trigger}
          onClick={() => handleClick(trigger.triggerItemIdentity)}
          selectedTriggerIds={selectedTriggerIds}
          setTriggerSelection={setTriggerSelection}
        />
      ))}

      <ConditionalRender isRendered={triggers.length > 0}>
        <GridRow>
          <GridCol className={classes.markCompleteContainer}>
            <LinkButton href="" disabled={selectedTriggerIds.length === 0} id="mark-triggers-complete-button">
              {"Mark trigger(s) as complete"}
            </LinkButton>
          </GridCol>
        </GridRow>
      </ConditionalRender>
    </>
  )
}

export default TriggersList
