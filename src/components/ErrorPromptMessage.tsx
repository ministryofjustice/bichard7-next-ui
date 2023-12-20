import { createUseStyles } from "react-jss"
import { textSecondary } from "../utils/colours"

type Props = {
  message?: string
}

const useStyles = createUseStyles({
  errorPromptMessage: {
    color: textSecondary
  }
})

const ErrorPromptMessage = ({ message }: Props) => {
  const classes = useStyles()

  return <div className={`error-prompt ${classes.errorPromptMessage}`}>{message}</div>
}

export default ErrorPromptMessage
