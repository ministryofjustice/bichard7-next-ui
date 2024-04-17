import Image from "next/image"
import { StyledComponentPropsWithRef } from "styled-components"
import { ResolutionStatus } from "../types/ResolutionStatus"
import { TICK_ICON_URL } from "../utils/icons"
import { ResolutionStatusTagContainer } from "./ResolutionStatusTag.styles"

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
