import { Checkbox as GovUkCheckbox } from "govuk-react"
import { ChangeEventHandler } from "react"
import { createUseStyles } from "react-jss"

type ValueType = string | number | readonly string[] | undefined

interface Props<TValue> {
  id?: string
  children?: React.ReactNode
  className?: string
  value?: TValue
  checked?: boolean
  disabled?: boolean
  onChange?: ChangeEventHandler | undefined
}

const useStyles = createUseStyles({
  Checkbox: {
    "& span:before": {
      width: "30px",
      height: "30px"
    },
    "& span:after": {
      top: "7px",
      left: "6px",
      width: "14px",
      height: "6px"
    },
    padding: 0
  }
})

export default function Checkbox<TValue extends ValueType>({
  id,
  children,
  className,
  value,
  checked,
  disabled,
  onChange
}: Props<TValue>) {
  const classes = useStyles()

  return (
    <GovUkCheckbox
      id={id}
      value={value}
      checked={checked}
      onChange={onChange}
      disabled={disabled}
      className={`${classes.Checkbox} ${className} moj-checkbox govuk-!-display-inline-block`}
    >
      {children}
    </GovUkCheckbox>
  )
}
