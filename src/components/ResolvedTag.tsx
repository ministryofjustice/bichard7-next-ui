import styled, { StyledComponentPropsWithRef } from "styled-components"
import { TICK_ICON_URL } from "../utils/icons"
import Image from "next/image"

const ResolvedTagContainer = styled.div`
  display: flex;
  align-items: center;
  margin-left: 15px;

  & > img {
    margin-right: 5px;
    margin-left: 15px;
  }
`

interface ResolvedTagProps extends StyledComponentPropsWithRef<typeof ResolvedTagContainer> {
  itemName: string
}

const ResolvedTag = ({ itemName, ...rest }: ResolvedTagProps) => (
  <ResolvedTagContainer {...rest} id={`${itemName.toLowerCase()}-resolved-tag`}>
    {itemName}
    <Image src={TICK_ICON_URL} width={18} height={18} alt="Check icon" />
    {"Resolved"}
  </ResolvedTagContainer>
)

export default ResolvedTag
