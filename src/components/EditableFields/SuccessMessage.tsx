import { CheckmarkIcon } from "../../features/CourtCaseDetails/Tabs/CourtCaseDetailsSingleTab.styles"
import { CHECKMARK_ICON_URL } from "../../utils/icons"
import { StyledSuccessMessage } from "./SuccessMessage.style"

interface SuccessMessageProps {
  message: string
}

const SuccessMessage: React.FC<SuccessMessageProps> = ({ message }) => {
  return (
    <StyledSuccessMessage id="success-message">
      <CheckmarkIcon
        className={`checkmark-icon checkmark`}
        src={CHECKMARK_ICON_URL}
        width={30}
        height={30}
        alt="Checkmark icon"
      />
      {message}
    </StyledSuccessMessage>
  )
}

export default SuccessMessage
