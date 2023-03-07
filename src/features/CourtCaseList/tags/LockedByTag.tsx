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
        <button className="govuk-button" data-module="govuk-button" id="unlock">
          {"Unlock"}
        </button>
        <a className="govuk-link" href="/">
          {"Cancel"}
        </a>
      </div>
    </>
  )
}

const LockedByTag: React.FC<{ lockedBy?: string | null; unlockPath?: string }> = (props: {
  lockedBy?: string | null
  unlockPath?: string
}) => {
  const classes = useStyles()
  return (
    <ConditionalRender isRendered={!!props.lockedBy}>
      <Tag backgroundColor={tagBlue} color={textBlue} className={`locked-by-tag ${classes.LockedByTag}`}>
        <div className={classes.LockedByTag}>
          <Image
            src={"/bichard/assets/images/lock.svg"}
            width={18}
            height={18}
            className={props.unlockPath ? classes.LockedIcon : undefined}
            alt="Lock icon"
          />
          {props.unlockPath ? (
            <form method="POST" action={props.unlockPath}>
              <button className={classes.LockedByURL}>{props.lockedBy}</button>
            </form>
          ) : (
            <span className={classes.LockedByText}>{props.lockedBy}</span>
          )}
        </div>
      </Tag>
      <UnlockConfirmation />
    </ConditionalRender>
  )
}

export default LockedByTag
