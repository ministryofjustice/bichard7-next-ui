import { useCsrfToken } from "context/CsrfTokenContext"
import Image from "next/image"
import { createUseStyles } from "react-jss"
import { LOCKED_ICON_URL } from "utils/icons"
import { useCustomStyles } from "../../../../../styles/customStyles"
import Form from "../../../../components/Form"

const useStyles = createUseStyles({
  LockedIcon: {
    // Change colour from black to GDS text-blue (#144e81) with CSS filters
    filter: "invert(12%) sepia(70%) saturate(4629%) hue-rotate(197deg) brightness(97%) contrast(84%)"
  }
})

interface UnlockConfirmationProps {
  onCancel: () => void
  unlockPath?: string
}

const UnlockConfirmation = ({ onCancel, unlockPath }: UnlockConfirmationProps) => {
  const csrfToken = useCsrfToken()

  return (
    <>
      <p>{"Click the button to unlock the case"}</p>
      <div className="govuk-button-group">
        <Form method="post" action={unlockPath} csrfToken={csrfToken}>
          <button className="govuk-button" data-module="govuk-button" id="unlock">
            {"Unlock"}
          </button>
        </Form>
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
        className={`locked-by-tag ${lockedByButtonClasses["button--tag"]}`}
        onClick={() => {
          setShowUnlockConfirmation(true)
        }}
      >
        <Image
          src={LOCKED_ICON_URL}
          priority
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

export default LockedByButton
