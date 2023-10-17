import ConditionalRender from "components/ConditionalRender"
import { useState } from "react"
import LockedByButton from "./LockedByButton"
import LockedByText from "./LockedByText"

interface LockedByTagProps {
  csrfToken: string
  lockedBy?: string | null
  unlockPath?: string
}

const LockedByTag = ({ csrfToken, lockedBy, unlockPath }: LockedByTagProps) => {
  const [showUnlockConfirmation, setShowUnlockConfirmation] = useState(false)

  return (
    <ConditionalRender isRendered={!!lockedBy}>
      {unlockPath ? (
        <LockedByButton
          csrfToken={csrfToken}
          lockedBy={lockedBy}
          unlockPath={unlockPath}
          showUnlockConfirmation={showUnlockConfirmation}
          setShowUnlockConfirmation={setShowUnlockConfirmation}
        />
      ) : (
        <LockedByText lockedBy={lockedBy} unlockPath={unlockPath} />
      )}
    </ConditionalRender>
  )
}

export default LockedByTag
