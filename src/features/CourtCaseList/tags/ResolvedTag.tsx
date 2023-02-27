import ConditionalRender from "components/ConditionalRender"
import { useCustomStyles } from "../../../../styles/customStyles"

const ResolvedTag: React.FC<{ isResolved: boolean }> = (props: { isResolved: boolean }) => {
  const classes = useCustomStyles()

  return (
    <ConditionalRender isRendered={props.isResolved}>
      <span className={`moj-badge moj-badge--grey ${classes["margin-top-bottom"]}`}>{"Resolved"}</span>
    </ConditionalRender>
  )
}

export default ResolvedTag
