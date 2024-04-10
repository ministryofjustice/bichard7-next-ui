import styled from "styled-components"
import { textSecondary } from "../utils/colours"

type Props = {
  message?: string
}

const ErrorPrompt = styled.div`
  color: ${textSecondary};
`

const ErrorPromptMessage = ({ message }: Props) => {
  return <ErrorPrompt className={`error-prompt`}>{message}</ErrorPrompt>
}

export default ErrorPromptMessage
