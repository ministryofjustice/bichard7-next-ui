import ConditionalRender from "components/ConditionalRender"

const CaseUnlockedTag: React.FC<{ isCaseUnlocked: boolean }> = (props: { isCaseUnlocked: boolean }) => {
  return (
    <ConditionalRender isRendered={props.isCaseUnlocked}>
      <span className={"moj-badge moj-badge--green"}>{"Case unlocked"}</span>
    </ConditionalRender>
  )
}

export default CaseUnlockedTag
