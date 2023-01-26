import If from "components/If"
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
    textDecoration: "underline",
    marginTop: 4,
    marginBottom: 2,
    fontWeight: "normal"
  }
})

const LockedByTag: React.FC<{ lockedBy?: string | null }> = (props: { lockedBy?: string | null }) => {
  const classes = useStyles()
  return (
    <If condition={!!props.lockedBy}>
      <Tag backgroundColor={tagBlue} color={textBlue} className={`locked-by-tag ${classes.LockedByTag}`}>
        <div className={classes.LockedByTag}>
          <Image
            src={"/bichard/assets/images/lock.svg"}
            width={18}
            height={18}
            className={classes.LockedIcon}
            alt="Lock icon"
          />
          <span className={classes.LockedByText}>{props.lockedBy}</span>
        </div>
      </Tag>
    </If>
  )
}

export default LockedByTag
