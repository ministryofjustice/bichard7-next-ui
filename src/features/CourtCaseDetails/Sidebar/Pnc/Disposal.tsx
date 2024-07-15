import ConditionalRender from "components/ConditionalRender"
import { DisposalDetails, DisposalHeader, DisposalText } from "./Disposal.styles"
// import { formatDisplayedDate } from "utils/date/formattedDate"
import { Details } from "govuk-react"
import { isEmpty } from "lodash"

interface Props {
  qtyDate?: string
  qtyDuration?: string
  type?: number
  qtyUnitsFined?: string
  qtyMonetaryValue?: string
  qualifiers?: string
  text?: string
}

const Disposal = ({ qtyDate, qtyDuration, type, qtyUnitsFined, qtyMonetaryValue, qualifiers, text }: Props) => {
  console.log(qtyDate)

  return (
    <div className="disposal">
      <DisposalHeader className="govuk-heading-s">{`Disposal - ${type}`}</DisposalHeader>
      <DisposalDetails>
        <div id={"disposal-date"}>
          <b>{"Date"}</b>
          {/* <div>{formatDisplayedDate(qtyDate || "-")}</div> */}
          <div>{"14/07/2024"}</div>
        </div>
        <div id={"disposal-qualifiers"}>
          <b>{"Qualifiers"}</b>
          <div>{qualifiers || "-"}</div>
        </div>
        <ConditionalRender isRendered={!!qtyDuration}>
          <div id={"disposal-duration"}>
            <b>{"Duration"}</b>
            <div>{qtyDuration}</div>
          </div>
        </ConditionalRender>
        <ConditionalRender isRendered={!!qtyMonetaryValue}>
          <div id={"disposal-monetary-value"}>
            <b>{"Monetary value"}</b>
            <div>{qtyMonetaryValue}</div>
          </div>
        </ConditionalRender>
        <ConditionalRender isRendered={!!qtyUnitsFined}>
          <div id={"disposal-units-fined"}>
            <b>{"Units fined"}</b>
            <div>{qtyUnitsFined}</div>
          </div>
        </ConditionalRender>
      </DisposalDetails>
      <DisposalText>
        {isEmpty(text) ? (
          <span className="disposal-text-absent">{"No disposal text"}</span>
        ) : (
          <Details className="disposal-text" summary={"Show details"}>
            <p>{text}</p>
          </Details>
        )}
      </DisposalText>
    </div>
  )
}

export default Disposal
