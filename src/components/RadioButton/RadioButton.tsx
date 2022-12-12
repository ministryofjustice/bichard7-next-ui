/* eslint-disable jsx-a11y/no-static-element-interactions */
/* eslint-disable jsx-a11y/click-events-have-key-events */
interface Props {
  name: string
  id: string
  dataAriaControls?: string
  defaultChecked: boolean
  value?: string
  label: string
  onClick: boolean
}

const RadioButton: React.FC<Props> = ({ name, id, dataAriaControls, defaultChecked, value, label, onClick }: Props) => {
  return (
    <div className="govuk-radios__item">
      <input
        className="govuk-radios__input"
        name={name}
        id={id}
        type="radio"
        data-aria-controls={dataAriaControls}
        value={value}
        defaultChecked={defaultChecked}
        onClick={onClick}
      />
      <label className="govuk-label govuk-radios__label" htmlFor={id}>
        {label}
      </label>
    </div>
  )
}

export default RadioButton
