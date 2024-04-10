import { Table } from "govuk-react"
import styled from "styled-components"
import Badge, { BadgeColours } from "./Badge"
import ErrorIcon from "./ErrorIcon"

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

const Label = styled(Table.Cell)`
  vertical-align: top;

  & .error-icon: {
    padding: 0.62rem 0 0.62rem 0;
  }
`

const Content = styled(Table.Cell)`
  vertical-align: top;

  & .badge-wrapper: {
    padding-bottom: 0.62rem;
    display: flex;
    gap: 0.62rem;
    align-items: center;
  }

  & .field-value: {
    padding-bottom: 0.62rem;
  }
`

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
              className="error-badge"
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
