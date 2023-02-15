import If from "components/If"
import { Tag } from "govuk-react"
import { textGrey } from "utils/colours"
import { useCustomStyles } from "../../../../styles/customStyles"

const ResolvedTag: React.FC<{ isResolved: boolean }> = (props: { isResolved: boolean }) => {
  const classes = useCustomStyles()
  return (
    <If condition={props.isResolved}>
      <Tag
        backgroundColor="white"
        color={textGrey}
        className={`${classes["border-grey"]} ${classes["margin-top-bottom"]}`}
      >
        {"Resolved"}
      </Tag>
    </If>
  )
}

export default ResolvedTag
