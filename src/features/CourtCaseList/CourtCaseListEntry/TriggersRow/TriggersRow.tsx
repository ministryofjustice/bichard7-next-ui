import ConditionalRender from "components/ConditionalRender"
import { Table } from "govuk-react"
import { createUseStyles } from "react-jss"
import Image from "next/image"
import LockedByTag from "features/CourtCaseList/tags/LockedByTag/LockedByTag"
import CaseUnlockedTag from "features/CourtCaseList/tags/CaseUnlockedTag"
import Trigger from "services/entities/Trigger"
import { LOCKED_ICON_URL } from "utils/icons"

interface TriggersRowProps {
  canCurrentUserUnlockCase: string | boolean | null | undefined
  firstColumnClassName: string
  isCaseUnlocked: boolean
  rowClassName: string
  triggerLockedByUsername: string | null | undefined
  triggers: Trigger[]
  unlockPath: string
}

const useStyles = createUseStyles({
  triggersRow: {
    verticalAlign: "top"
  }
})

type TriggerWithCount = Partial<Trigger> & { count: number }

export const TriggersRow = ({
  canCurrentUserUnlockCase,
  firstColumnClassName,
  isCaseUnlocked,
  rowClassName,
  triggerLockedByUsername,
  triggers,
  unlockPath
}: TriggersRowProps) => {
  const classes = useStyles()
  if (!triggers.length) {
    return <></>
  }

  const triggersWithCounts = Object.values(
    triggers.reduce((counts, trigger) => {
      let current = counts[trigger.triggerCode]
      if (!current) {
        current = { ...trigger, count: 1 }
      } else {
        current.count += 1
      }

      counts[trigger.triggerCode] = current
      return counts
    }, {} as { [key: string]: TriggerWithCount })
  )

  return (
    <Table.Row className={`${classes.triggersRow} ${rowClassName}`}>
      <Table.Cell className={firstColumnClassName}>
        <ConditionalRender isRendered={!!triggerLockedByUsername}>
          <Image src={LOCKED_ICON_URL} width={20} height={20} alt="Lock icon" />
        </ConditionalRender>
      </Table.Cell>
      <Table.Cell />
      <Table.Cell />
      <Table.Cell />
      <Table.Cell />
      <Table.Cell />
      <Table.Cell />
      <Table.Cell>
        {triggersWithCounts?.map((trigger, triggerId) => (
          <div key={`trigger_${triggerId}`} className={"trigger-description"}>
            {trigger.description}
            <ConditionalRender isRendered={trigger.count > 1}>
              <b>{` (${trigger.count})`}</b>
            </ConditionalRender>
          </div>
        ))}
      </Table.Cell>
      <Table.Cell>
        {canCurrentUserUnlockCase ? (
          <LockedByTag lockedBy={triggerLockedByUsername} unlockPath={unlockPath} />
        ) : (
          <LockedByTag lockedBy={triggerLockedByUsername} />
        )}

        <CaseUnlockedTag isCaseUnlocked={isCaseUnlocked} />
      </Table.Cell>
    </Table.Row>
  )
}
