import { createUseStyles } from "react-jss"
import { EditableFieldBadge, InitialInputValueBadge } from "./Badges"

interface EditableInputFieldProps {
  value?: string | React.ReactNode
  children?: React.ReactNode
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

const InputField: React.FC<EditableInputFieldProps> = ({ value, children }) => {
  const classes = useStyles()

  return (
    <div className={classes["editable-field__content"]}>
      {value}
      <InitialInputValueBadge />
      <br />
      {children}
      <EditableFieldBadge />
    </div>
  )
}

export default InputField
