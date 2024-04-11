import { ReactiveLinkButton } from "components/LinkButton"
import { Input } from "govuk-react"
import styled from "styled-components"

const DefendantDetailTable = styled.div`
  & td {
    width: 50%;
  }
`

const AnsInput = styled(Input)`
  width: 15rem;
`

const SaveButton = styled(ReactiveLinkButton)`
  margin-top: 0.94rem;
  margin-bottom: 0;
`

export { AnsInput, DefendantDetailTable, SaveButton }
