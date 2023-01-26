import If from "components/If"
import { Tag } from "govuk-react"
import Image from "next/image"
import { createUseStyles } from "react-jss"

const useStyles = createUseStyles({
  LockedByTag: {
    display: "flex",
    flexDirection: "row",
    flexWrap: "nowrap"
  },
  LockedIcon: {
    // Change colour from black to #144e81 (GDS blue-text) with CSS filters
    filter: "invert(12%) sepia(70%) saturate(4629%) hue-rotate(197deg) brightness(97%) contrast(84%)",
    flexGrow: 0,
    verticalAlign: "middle",
    alignSelf: "center"
  },
  LockedByText: {
    textDecoration: "underline"
  }
})

const LockedByTag: React.FC<{ lockedBy?: string | null }> = (props: { lockedBy?: string | null }) => {
  const classes = useStyles()
  return (
    <If condition={!!props.lockedBy}>
      <Tag backgroundColor="#e9f1f8" color="#114e81" className={`locked-by-tag ${classes.LockedByTag}`}>
        <Image
          src={"/bichard/assets/images/lock.svg"}
          width={20}
          height={20}
          className={classes.LockedIcon}
          alt="Lock icon"
        />
        <span className={classes.LockedByText}>{props.lockedBy}</span>
      </Tag>
    </If>
  )
}

export default LockedByTag
