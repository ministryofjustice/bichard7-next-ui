import { GridCol, GridRow } from "govuk-react"
import ResolveTrigger from "components/ResolveTrigger"
import CourtCase from "../../../services/entities/CourtCase"
import { createUseStyles } from "react-jss"
import ActionLink from "components/ActionLink"
import { ChangeEvent, useState } from "react"
import type NavigationHandler from "types/NavigationHandler"
import Trigger from "./Trigger"
import { sortBy } from "lodash"
import LinkButton from "components/LinkButton"
import ConditionalRender from "components/ConditionalRender"
import LockedTag from "./LockedTag"

interface Props {
  courtCase: CourtCase
  triggersLockedByCurrentUser: boolean
  triggersLockedByUser: string | null
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
    justifyContent: "end",
    "& #mark-triggers-complete-button": {
      marginBottom: 0
    }
  }
})

const TriggersList = ({ courtCase, triggersLockedByCurrentUser, triggersLockedByUser, onNavigate }: Props) => {
  const classes = useStyles()
  const [selectedTriggerIds, setSelectedTriggerIds] = useState<number[]>([])

  const triggers = sortBy(courtCase.triggers, "triggerItemIdentity")
  const hasTriggers = triggers.length > 0
  const triggersLockedByAnotherUser = !!triggersLockedByUser && !triggersLockedByCurrentUser

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
      <ConditionalRender isRendered={hasTriggers && !triggersLockedByAnotherUser}>
        <GridRow id={"select-all-triggers"} className={classes.selectAllContainer}>
          <GridCol>
            <ActionLink onClick={selectAll} id="select-all-action">
              {"Select all"}
            </ActionLink>
          </GridCol>
        </GridRow>
      </ConditionalRender>
      {triggers.map((trigger, index) => (
        <span key={index}>
          <Trigger
            key={index}
            trigger={trigger}
            disabled={triggersLockedByAnotherUser}
            onClick={() => handleClick(trigger.triggerItemIdentity)}
            selectedTriggerIds={selectedTriggerIds}
            setTriggerSelection={setTriggerSelection}
          />
          <ResolveTrigger trigger={trigger} courtCase={courtCase} />
        </span>
      ))}

      <ConditionalRender isRendered={hasTriggers && !triggersLockedByAnotherUser}>
        <GridRow>
          <GridCol className={classes.markCompleteContainer}>
            <LinkButton href="" disabled={selectedTriggerIds.length === 0} id="mark-triggers-complete-button">
              {"Mark trigger(s) as complete"}
            </LinkButton>
          </GridCol>
        </GridRow>
      </ConditionalRender>
      <ConditionalRender isRendered={hasTriggers && triggersLockedByAnotherUser}>
        <LockedTag lockName="Triggers" lockedBy={triggersLockedByUser ?? "Another user"} />
      </ConditionalRender>
    </>
  )
}

export default TriggersList
