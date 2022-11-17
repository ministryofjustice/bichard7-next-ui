interface Props {
  name: string
  id: string
  key?: string
  dataAriaControls?: string
  defaultChecked: boolean
  value?: string
  label: string
}

const RadioButton: React.FC<Props> = ({ name, id, key, dataAriaControls, defaultChecked, value, label }: Props) => {
  return (
    <div className="govuk-radios__item" key={key}>
      <input
        className="govuk-radios__input"
        name={name}
        id={id}
        type="radio"
        data-aria-controls={dataAriaControls}
        value={value}
        defaultChecked={defaultChecked}
      />
      <label className="govuk-label govuk-radios__label" htmlFor={id}>
        {label}
      </label>
    </div>
  )
}

export default RadioButton
