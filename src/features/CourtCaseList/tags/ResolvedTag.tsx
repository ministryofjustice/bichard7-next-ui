import If from "components/If"
import { useCustomStyles } from "../../../../styles/customStyles"

const ResolvedTag: React.FC<{ isResolved: boolean }> = (props: { isResolved: boolean }) => {
  const classes = useCustomStyles()

  return (
    <If condition={props.isResolved}>
      <span className={`moj-badge moj-badge--grey ${classes["margin-top-bottom"]}`}>{"Resolved"}</span>
    </If>
  )
}

export default ResolvedTag
