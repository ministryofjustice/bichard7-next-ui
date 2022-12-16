import type { MouseEvent } from "react"

interface Props {
  name: string
  id: string
  dataAriaControls?: string
  defaultChecked: boolean
  value?: string
  label: string
  onClick?: (option: string) => void
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
        onClick={(event: MouseEvent<HTMLInputElement>) => {
          if (onClick) {
            onClick(event.currentTarget.value)
          }
        }}
      />
      <label className="govuk-label govuk-radios__label" htmlFor={id}>
        {label}
      </label>
    </div>
  )
}

export default RadioButton
