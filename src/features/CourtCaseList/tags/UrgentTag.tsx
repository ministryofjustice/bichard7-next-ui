import ConditionalRender from "components/ConditionalRender"

const UrgentTag: React.FC<{ isUrgent: boolean }> = (props: { isUrgent: boolean }) => (
  <ConditionalRender isRendered={props.isUrgent}>
    <span className={`moj-badge moj-badge--red`}>{"Urgent"}</span>
  </ConditionalRender>
)

export default UrgentTag
