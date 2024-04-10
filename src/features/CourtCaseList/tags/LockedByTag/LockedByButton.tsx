import { useCsrfToken } from "context/CsrfTokenContext"
import styled from "styled-components"
import { blue, gdsBlack, tagBlue, textBlue, yellow } from "utils/colours"
import Form from "../../../../components/Form"
import LockedImage from "./LockedImage"

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

const StyledLockedByButton = styled.button`
  display: inline-flex;
  flex-wrap: nowrap;
  align-items: center;
  flex-direction: row;
  padding: 8px 18px 8px 8px;
  border: none;
  gap: 11px;
  background-color: ${tagBlue};
  color: ${textBlue};
  font-size: 1em;
  text-decoration: underline;
  cursor: pointer;
  &:hover {
    color: white;
    background: ${blue};
  }
  &:hover img {
    filter: invert(1);
  }
  &:focus {
    color: ${gdsBlack};
    background: ${yellow};
  }
  &:focus img {
    filter: contrast(1);
  }
`

const LockedByButton = ({
  lockedBy,
  unlockPath,
  showUnlockConfirmation,
  setShowUnlockConfirmation
}: LockedByButtonProps) => {
  return (
    <>
      <StyledLockedByButton
        className={`locked-by-tag button--tag`}
        onClick={() => {
          setShowUnlockConfirmation(true)
        }}
      >
        <LockedImage unlockPath={unlockPath} />
        {lockedBy}
      </StyledLockedByButton>
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
