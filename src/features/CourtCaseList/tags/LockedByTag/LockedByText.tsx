import { Tag } from "govuk-react"
import Image from "next/image"
import { createUseStyles } from "react-jss"
import { tagBlue, textBlue } from "../../../../utils/colours"

export const LOCKED_ICON_URL = "/bichard/assets/images/lock.svg"

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
  }
})

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
          src={LOCKED_ICON_URL}
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

export default LockedByText
