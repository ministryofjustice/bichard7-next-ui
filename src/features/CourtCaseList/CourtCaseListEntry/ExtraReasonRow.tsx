import ConditionalRender from "components/ConditionalRender"
import { Table } from "govuk-react"
import Image from "next/image"
import styled from "styled-components"
import { LOCKED_ICON_URL } from "utils/icons"

interface ExtraReasonRowProps {
  isLocked: boolean
  reasonCell: JSX.Element
  lockTag: JSX.Element
}

const StyledExtraReasonRow = styled(Table.Row)`
  vertical-align: top;
`

export const ExtraReasonRow = ({ isLocked, reasonCell, lockTag }: ExtraReasonRowProps) => {
  return (
    <StyledExtraReasonRow>
      <Table.Cell>
        <ConditionalRender isRendered={isLocked}>
          <Image src={LOCKED_ICON_URL} priority width={20} height={20} alt="Lock icon" />
        </ConditionalRender>
      </Table.Cell>
      <Table.Cell />
      <Table.Cell />
      <Table.Cell />
      <Table.Cell />
      <Table.Cell />
      <Table.Cell>{reasonCell}</Table.Cell>
      <Table.Cell>{lockTag}</Table.Cell>
    </StyledExtraReasonRow>
  )
}
