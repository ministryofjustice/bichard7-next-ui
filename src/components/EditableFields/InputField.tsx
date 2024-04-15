import { HintText, Label } from "govuk-react"
import { createUseStyles } from "react-jss"
import { EditableFieldBadge, InitialInputValueBadge } from "./Badges"

interface EditableInputFieldProps {
  value?: string | React.ReactNode
  children?: React.ReactNode
  inputLabel: string
  hintText: string
}

const useStyles = createUseStyles({
  "editable-field__content": {
    "& .badge-wrapper": {
      padding: ".94rem 0 .62rem 0",
      display: "flex",
      gap: ".62rem",
      alignItems: "center"
    }
  }
})

const InputField: React.FC<EditableInputFieldProps> = ({ value, inputLabel, hintText, children }) => {
  const classes = useStyles()

  return (
    <div className={classes["editable-field__content"]}>
      {value}
      <InitialInputValueBadge />
      <br />
      <Label>{inputLabel}</Label>
      {hintText &&
        hintText.split("\n").map((hint, key) => {
          return <HintText key={key}>{hint}</HintText>
        })}
      {children}
      <EditableFieldBadge />
    </div>
  )
}

export default InputField
