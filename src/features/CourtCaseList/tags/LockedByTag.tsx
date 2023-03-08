import ConditionalRender from "components/ConditionalRender"
import { Tag } from "govuk-react"
import Image from "next/image"
import { useState } from "react"
import { createUseStyles } from "react-jss"
import { tagBlue, textBlue } from "utils/colours"
import { useCustomStyles } from "../../../../styles/customStyles"

const useStyles = createUseStyles({
  LockedByTag: {
    display: "inline-flex",
    flexDirection: "row",
    flexWrap: "nowrap",
    alignItems: "center",
    gap: 5
  },
  LockedIcon: {
    // Change colour from black to GDS text-blue (#144e81) with CSS filters
    filter: "invert(12%) sepia(70%) saturate(4629%) hue-rotate(197deg) brightness(97%) contrast(84%)"
  },
  LockedByText: {
    marginTop: 4,
    marginBottom: 2,
    fontWeight: "normal",
    color: "black",
    letterSpacing: "0.5px",
    textTransform: "none"
  },
  LockedByURL: {
    textDecoration: "underline",
    marginTop: 4,
    marginBottom: 2,
    fontWeight: "normal",
    border: "none",
    outline: "none",
    background: "none",
    cursor: "pointer",
    fontFamily: "inherit",
    fontSize: "inherit",
    color: "inherit",
    letterSpacing: "0.5px",
    textTransform: "none"
  }
})

interface UnlockConfirmationProps {
  onCancel: () => void
  unlockPath?: string
}

const UnlockConfirmation = ({ onCancel, unlockPath }: UnlockConfirmationProps) => {
  return (
    <>
      <p>{"Click the button to unlock the case"}</p>
      <div className="govuk-button-group">
        <form method="POST" action={unlockPath}>
          <button className="govuk-button" data-module="govuk-button" id="unlock">
            {"Unlock"}
          </button>
        </form>
        <a
          className="govuk-link"
          href="/"
          onClick={(event) => {
            event.preventDefault()
            onCancel()
          }}
        >
          {"Cancel"}
        </a>
      </div>
    </>
  )
}

interface LockedByButtonProps {
  lockedBy?: string | null
  unlockPath?: string
  showUnlockConfirmation: boolean
  setShowUnlockConfirmation: (value: boolean) => void
}

const LockedByButton = ({
  lockedBy,
  unlockPath,
  showUnlockConfirmation,
  setShowUnlockConfirmation
}: LockedByButtonProps) => {
  const classes = useStyles()
  const lockedByButtonClasses = useCustomStyles()
  return (
    <>
      <button
        className={lockedByButtonClasses["button--tag"]}
        onClick={() => {
          setShowUnlockConfirmation(true)
        }}
      >
        <Image
          src={"/bichard/assets/images/lock.svg"}
          width={18}
          height={18}
          className={unlockPath ? classes.LockedIcon : undefined}
          alt="Lock icon"
        />
        {lockedBy}
      </button>
      {showUnlockConfirmation && (
        <UnlockConfirmation
          onCancel={() => {
            setShowUnlockConfirmation(false)
          }}
          unlockPath={unlockPath}
        />
      )}
    </>
  )
}

interface LockedByTextProps {
  lockedBy?: string | null
  unlockPath?: string
}

const LockedByText = ({ lockedBy, unlockPath }: LockedByTextProps) => {
  const classes = useStyles()
  return (
    <Tag backgroundColor={tagBlue} color={textBlue} className={`locked-by-tag ${classes.LockedByTag}`}>
      <div className={classes.LockedByTag}>
        <Image
          src={"/bichard/assets/images/lock.svg"}
          width={18}
          height={18}
          className={unlockPath ? classes.LockedIcon : undefined}
          alt="Lock icon"
        />
        <span className={classes.LockedByText}>{lockedBy}</span>
      </div>
    </Tag>
  )
}

interface LockedByTagProps {
  lockedBy?: string | null
  unlockPath?: string
}

const LockedByTag = ({ lockedBy, unlockPath }: LockedByTagProps) => {
  const [showUnlockConfirmation, setShowUnlockConfirmation] = useState(false)

  return (
    <ConditionalRender isRendered={!!lockedBy}>
      {unlockPath ? (
        <LockedByButton
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
