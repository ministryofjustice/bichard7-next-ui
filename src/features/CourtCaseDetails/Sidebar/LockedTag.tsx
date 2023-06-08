import styled, { StyledComponentPropsWithRef } from "styled-components"
import { LOCKED_ICON_URL } from "../../../utils/icons"
import Image from "next/image"

const Lockee = styled.span`
  margin-left: 15px;
`

const LockedTagContainer = styled.div`
  float: right;
`

interface LockedTagProps extends StyledComponentPropsWithRef<typeof LockedTagContainer> {
  lockName: string
  lockedBy: string
}

const LockedTag = ({ lockName, lockedBy, ...rest }: LockedTagProps) => (
  <LockedTagContainer {...rest} id="triggers-locked-tag">
    {lockName}
    <Lockee id="triggers-locked-tag-lockee">
      <Image src={LOCKED_ICON_URL} width={18} height={18} alt="Lock icon" />
      {lockedBy}
    </Lockee>
  </LockedTagContainer>
)

export default LockedTag
