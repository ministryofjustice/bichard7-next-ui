import { Button, GridCol, GridRow } from "govuk-react"
import CourtCase from "../../../services/entities/CourtCase"
import { createUseStyles } from "react-jss"
import ActionLink from "components/ActionLink"
import { ChangeEvent, SyntheticEvent, useState } from "react"
import type NavigationHandler from "types/NavigationHandler"
import Trigger from "./Trigger"
import { sortBy } from "lodash"
import ConditionalRender from "components/ConditionalRender"
import LockedTag from "./LockedTag"
import { useRouter } from "next/router"
import { encode } from "querystring"

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
  const { basePath, query } = useRouter()

  const triggers = sortBy(courtCase.triggers, "triggerItemIdentity")
  const hasTriggers = triggers.length > 0
  const hasUnresolvedTriggers = triggers.filter((t) => t.status === "Unresolved").length > 0
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

  const selectAll = (event: SyntheticEvent) => {
    event.preventDefault()
    setSelectedTriggerIds(courtCase.triggers.map((trigger) => trigger.triggerId))
  }

  const handleClick = (offenceOrderIndex?: number) => {
    onNavigate({ location: "Case Details > Offences", args: { offenceOrderIndex } })
  }

  const resolveTriggerUrl = (triggerIds: number[]) => {
    const resolveQuery = { ...query, resolveTrigger: triggerIds.map((id) => id.toString()), courtCaseId: undefined }

    // Delete the `courtCaseId` param, which comes from the URL dynamic router, not the query string
    const filteredQuery = Object.fromEntries(Object.entries(resolveQuery).filter(([key]) => key !== "courtCaseId"))

    return `${basePath}/court-cases/${courtCase.errorId}?${encode(filteredQuery)}`
  }

  return (
    <form method="post" action={resolveTriggerUrl(selectedTriggerIds)}>
      {triggers.length === 0 && "There are no triggers for this case."}
      <ConditionalRender isRendered={hasUnresolvedTriggers && !triggersLockedByAnotherUser}>
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
        </span>
      ))}

      <ConditionalRender isRendered={hasTriggers && !triggersLockedByAnotherUser}>
        <GridRow>
          <GridCol className={classes.markCompleteContainer}>
            <Button type="submit" disabled={selectedTriggerIds.length === 0} id="mark-triggers-complete-button">
              {"Mark trigger(s) as complete"}
            </Button>
          </GridCol>
        </GridRow>
      </ConditionalRender>
      <ConditionalRender isRendered={hasTriggers && triggersLockedByAnotherUser}>
        <LockedTag lockName="Triggers" lockedBy={triggersLockedByUser ?? "Another user"} />
      </ConditionalRender>
    </form>
  )
}

export default TriggersList
