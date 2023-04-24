import { Checkbox as GovUkCheckbox } from "govuk-react"
import { ChangeEventHandler, ReactEventHandler } from "react"
import { createUseStyles } from "react-jss"

type ValueType = string | number | readonly string[] | undefined

interface Props<TValue> {
  children?: React.ReactNode
  className?: string
  value?: TValue
  checked?: boolean
  onSelect?: ReactEventHandler
  onChange?: ChangeEventHandler | undefined
}

const useStyles = createUseStyles({
  Checkbox: {
    display: "inline-block",
    "& span:before": {
      width: "30px",
      height: "30px"
    },
    "& span:after": {
      top: "7px",
      left: "6px",
      width: "14px",
      height: "6px"
    }
  }
})

export default function Checkbox<TValue extends ValueType>({
  children,
  className,
  value,
  checked,
  onSelect,
  onChange
}: Props<TValue>) {
  const classes = useStyles()

  return (
    <GovUkCheckbox
      value={value}
      checked={checked}
      onSelect={onSelect}
      onChange={onChange}
      className={[classes.Checkbox, className, "moj-checkbox"].join(" ")}
    >
      {children}
    </GovUkCheckbox>
  )
}
