import { Input } from "govuk-react"
import styled from "styled-components"

const DefendantDetailTable = styled.div`
  & td {
    width: 50%;
  }
`

const AsnInput = styled(Input)`
  width: 15rem;
`

export { AsnInput, DefendantDetailTable }
