interface Props {
  dateType: string
}

const DateInput: React.FC<Props> = ({ dateType }: Props) => {
  return (
    <div className="govuk-form-group">
      <label className="govuk-label govuk-label--m" htmlFor={`date-${dateType}`}>
        {`Date ${dateType}:`}
      </label>
      <input className="govuk-input" type="date" id={`date-${dateType}`} name={dateType} />
    </div>
  )
}

export default DateInput
