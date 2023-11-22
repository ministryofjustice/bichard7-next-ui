import styled, { StyledComponentPropsWithRef } from "styled-components"
import { LOCKED_ICON_URL } from "../utils/icons"
import Image from "next/image"

const Lockee = styled.span`
  display: flex;
  align-items: center;
  margin-left: 15px;

  & > img {
    margin-right: 5px;
  }
`

const LockedTagContainer = styled.div`
  display: flex;
  justify-content: end;
`

interface LockedTagProps extends StyledComponentPropsWithRef<typeof LockedTagContainer> {
  lockName: string
  lockedBy: string
}

const LockedTag = ({ lockName, lockedBy, ...rest }: LockedTagProps) => (
  <LockedTagContainer {...rest} id={`${lockName.toLowerCase()}-locked-tag`}>
    {lockName}
    <Lockee id={`${lockName.toLowerCase()}-locked-tag-lockee`}>
      <Image src={LOCKED_ICON_URL} priority width={18} height={18} alt="Lock icon" />
      {lockedBy}
    </Lockee>
  </LockedTagContainer>
)

export default LockedTag
