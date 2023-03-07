import ConditionalRender from "components/ConditionalRender"
import { Tag } from "govuk-react"
import Image from "next/image"
import { createUseStyles } from "react-jss"
import { tagBlue, textBlue } from "utils/colours"

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

const UnlockConfirmation = () => {
  return (
    <>
      <p>{"Click the button to unlock the case"}</p>
      <div className="govuk-button-group">
        <button
          className="govuk-button"
          data-module="govuk-button"
          id="unlock"
          onClick={() => {
            console.log("Unlock has been clicked")
          }}
        >
          {"Unlock"}
        </button>
        <a
          className="govuk-link"
          href="/"
          onClick={(event) => {
            event.preventDefault()
            console.log("Cancel has been clicked")
          }}
        >
          {"Cancel"}
        </a>
      </div>
    </>
  )
}

interface LockedByTagProps {
  lockedBy?: string | null
  unlockPath?: string
}

const LockedByTag = ({ lockedBy, unlockPath }: LockedByTagProps) => {
  const classes = useStyles()
  return (
    <ConditionalRender isRendered={!!lockedBy}>
      <Tag backgroundColor={tagBlue} color={textBlue} className={`locked-by-tag ${classes.LockedByTag}`}>
        <div className={classes.LockedByTag}>
          <Image
            src={"/bichard/assets/images/lock.svg"}
            width={18}
            height={18}
            className={unlockPath ? classes.LockedIcon : undefined}
            alt="Lock icon"
          />
          {unlockPath ? (
            <form method="POST" action={unlockPath}>
              <button className={classes.LockedByURL}>{lockedBy}</button>
            </form>
          ) : (
            <span className={classes.LockedByText}>{lockedBy}</span>
          )}
        </div>
      </Tag>
      <UnlockConfirmation />
    </ConditionalRender>
  )
}

export default LockedByTag
