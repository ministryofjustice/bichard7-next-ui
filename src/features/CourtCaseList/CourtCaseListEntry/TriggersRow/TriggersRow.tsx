import ConditionalRender from "components/ConditionalRender"
import { Table } from "govuk-react"
import { createUseStyles } from "react-jss"
import { gdsLightGrey } from "utils/colours"
import Image from "next/image"
import { SingleTrigger } from "../SingleTrigger"
import LockedByTag from "features/CourtCaseList/tags/LockedByTag/LockedByTag"
import CaseUnlockedTag from "features/CourtCaseList/tags/CaseUnlockedTag"
import Trigger from "services/entities/Trigger"

interface TriggersRowProps {
  canCurrentUserUnlockCase: string | boolean | null | undefined
  isCaseUnlocked: boolean
  triggerLockedByUsername: string | null | undefined
  triggers: Trigger[]
  unlockPath: string
}

const useStyles = createUseStyles({
  triggersRow: {
    verticalAlign: "top",
    backgroundColor: gdsLightGrey
  }
})

export const TriggersRow = ({
  canCurrentUserUnlockCase,
  isCaseUnlocked,
  triggerLockedByUsername,
  triggers,
  unlockPath
}: TriggersRowProps) => {
  const classes = useStyles()
  return triggers.length > 0 ? (
    <Table.Row className={classes.triggersRow}>
      <Table.Cell>
        <ConditionalRender isRendered={!!triggerLockedByUsername}>
          <Image src={"/bichard/assets/images/lock.svg"} width={20} height={20} alt="Lock icon" />
        </ConditionalRender>
      </Table.Cell>
      <Table.Cell />
      <Table.Cell />
      <Table.Cell />
      <Table.Cell />
      <Table.Cell />
      <Table.Cell />
      <Table.Cell>
        {triggers?.map((trigger, triggerId) => (
          <SingleTrigger key={`trigger_${triggerId}`} triggerCode={trigger.triggerCode} />
        ))}
      </Table.Cell>
      <Table.Cell>
        {canCurrentUserUnlockCase ? (
          <LockedByTag lockedBy={triggerLockedByUsername} unlockPath={unlockPath} />
        ) : (
          <LockedByTag lockedBy={triggerLockedByUsername} />
        )}
        {<CaseUnlockedTag isCaseUnlocked={isCaseUnlocked} />}
      </Table.Cell>
    </Table.Row>
  ) : (
    <></>
  )
}
