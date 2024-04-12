import { Table } from "govuk-react"
import Badge, { BadgeColours } from "./Badge"
import ErrorIcon from "./ErrorIcon"
import { Content, Label } from "./ExceptionFieldTableRow.styles"

export enum ExceptionBadgeType {
  SystemError = "System Error",
  AddedByCourt = "Added by Court",
  Unmatched = "Unmatched"
}

type Props = {
  badgeText?: ExceptionBadgeType
  value?: string | React.ReactNode
  badgeColour?: BadgeColours
  label: string
  children?: React.ReactNode
  displayError?: boolean
}

const ExceptionFieldTableRow = ({ badgeText, badgeColour, value, label, displayError, children }: Props) => {
  return (
    <Table.Row>
      <Label>
        <b>{label}</b>
        {displayError !== false && (
          <>
            <div className="error-icon">
              <ErrorIcon />
            </div>
            {children}
          </>
        )}
      </Label>
      <Content>
        {value && <div className="field-value">{value}</div>}
        {badgeText && displayError !== false && (
          <div className="badge-wrapper">
            <Badge
              className="error-badge moj-badge--large"
              isRendered={true}
              colour={badgeColour ?? BadgeColours.Purple}
              label={badgeText}
            />
          </div>
        )}
      </Content>
    </Table.Row>
  )
}

export default ExceptionFieldTableRow
