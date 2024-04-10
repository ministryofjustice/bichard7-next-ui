import { Tag } from "govuk-react"
import styled from "styled-components"
import { gdsBlack, tagBlue, textBlue } from "../../../../utils/colours"
import LockedImage from "./LockedImage"

const LockedByTag = styled.div`
  display: inline-flex;
  flex-direction: row;
  flex-wrap: nowrap;
  align-items: center;
  gap: 5;
`
const LockedByTextSpan = styled.span`
  margin-top: 4;
  margin-bottom: 2;
  font-weight: normal;
  color: ${gdsBlack};
  letter-spacing: 0.5px;
  text-transform: none;
`

interface LockedByTextProps {
  lockedBy?: string | null
  unlockPath?: string
}

const LockedByText = ({ lockedBy, unlockPath }: LockedByTextProps) => {
  return (
    <Tag backgroundColor={tagBlue} color={textBlue} className={`locked-by-tag`}>
      <LockedByTag className={`locked-by-tag`}>
        <LockedImage unlockPath={unlockPath} />
        <LockedByTextSpan className={`locked-by-text`}>{lockedBy}</LockedByTextSpan>
      </LockedByTag>
    </Tag>
  )
}

export default LockedByText
