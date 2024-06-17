import styled from "styled-components"
import { gdsGreen } from "utils/colours"

const SuccessMessageContainer = styled.div`
  display: flex;
  align-items: center;
  margin-top: 1rem;
`
const Message = styled.span`
  font-family: "GDS Transport", arial, sans-serif;
  font-size: 20px;
  color: ${gdsGreen};
`

export { SuccessMessageContainer, Message }
