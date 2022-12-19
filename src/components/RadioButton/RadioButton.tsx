import type { ChangeEvent, MouseEvent } from "react"

interface Props {
  name: string
  id: string
  dataAriaControls?: string
  defaultChecked?: boolean
  checked?: boolean
  value?: string
  label: string
  onClick?: (option: string) => void
  onChange?: (event: ChangeEvent<HTMLInputElement>) => void
}

const RadioButton: React.FC<Props> = ({
  name,
  id,
  dataAriaControls,
  defaultChecked,
  checked,
  value,
  label,
  onClick,
  onChange
}: Props) => {
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
        checked={checked}
        onClick={(event: MouseEvent<HTMLInputElement>) => {
          if (onClick) {
            onClick(event.currentTarget.value)
          }
        }}
        onChange={onChange}
      />
      <label className="govuk-label govuk-radios__label" htmlFor={id}>
        {label}
      </label>
    </div>
  )
}

export default RadioButton
