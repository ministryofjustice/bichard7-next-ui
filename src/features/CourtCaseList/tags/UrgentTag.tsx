import Badge from "components/Badge"

const UrgentTag: React.FC<{ isUrgent: boolean }> = (props: { isUrgent: boolean }) => (
  <Badge isRendered={props.isUrgent} colour="red" label="Urgent" className="govuk-!-static-margin-left-5" />
)

export default UrgentTag
