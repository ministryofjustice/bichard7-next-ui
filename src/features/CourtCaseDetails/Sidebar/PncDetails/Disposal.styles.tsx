import styled from "styled-components"
import { gdsLightGrey, textSecondary } from "utils/colours"

const DisposalHeader = styled.div`
  background-color: ${gdsLightGrey};
  padding: 5px 0;
`

const DisposalDetails = styled.div`
  display: flex;
  flex-direction: row;
  flex-wrap: wrap;

  & > * {
    flex-basis: 31%;

    :not(:last-child) {
      margin-right: 2%;
    }
  }
`

const DisposalText = styled.div`
  .disposal-text {
    font-size: 16px;
  }

  .disposal-text-absent {
    color: ${textSecondary};
  }
`

export { DisposalHeader, DisposalDetails, DisposalText }
