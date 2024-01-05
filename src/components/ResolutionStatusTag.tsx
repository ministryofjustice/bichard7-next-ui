import styled, { StyledComponentPropsWithRef } from "styled-components"
import { TICK_ICON_URL } from "../utils/icons"
import Image from "next/image"
import { ResolutionStatus } from "../types/ResolutionStatus"

const ResolutionStatusTagContainer = styled.div`
  display: flex;
  align-items: center;
  margin-left: 15px;

  & > img {
    margin-right: 5px;
    margin-left: 15px;
  }
`

interface StatusTagProps extends StyledComponentPropsWithRef<typeof ResolutionStatusTagContainer> {
  itemName: string
  resolutionStatus: ResolutionStatus
}

const ResolutionStatusTag = ({ itemName, resolutionStatus, ...rest }: StatusTagProps) => (
  <ResolutionStatusTagContainer {...rest} id={`${itemName.toLowerCase()}-${resolutionStatus.toLowerCase()}-tag`}>
    {itemName}
    <Image src={TICK_ICON_URL} width={18} height={18} alt="Check icon" />
    {resolutionStatus}
  </ResolutionStatusTagContainer>
)

export default ResolutionStatusTag
