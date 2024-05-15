import styled from "styled-components"
import { Input } from "govuk-react"

const AsnInputContainer = styled.div`
  display: flex;
  align-items: center;

  .checkmark {
    margin-left: 0.5rem;
  }
`

const AsnInput = styled(Input)`
  width: 16rem;
`

export { AsnInputContainer, AsnInput }
