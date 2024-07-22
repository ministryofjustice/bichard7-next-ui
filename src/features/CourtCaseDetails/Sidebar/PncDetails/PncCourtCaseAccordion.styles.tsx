import styled from "styled-components"
import { gdsLightGrey, gdsMidGrey } from "utils/colours"

const CourtCase = styled.div`
  font-family: var(--default-font-family);
  font-size: var(--default-font-size);
`
const CourtCaseHeaderContainer = styled.div`
  display: flex;
  justify-content: space-between;
  cursor: pointer;
  background-color: ${gdsLightGrey};
  border-bottom: solid 1px ${gdsMidGrey};

  &.expanded,
  &:hover {
    background-color: #dfdfe0;

    .chevron {
      color: white;
      background: black;
    }
  }
`
const CourtCaseHeader = styled.div`
  width: 100%;
  margin: 15px 20px;
`

const CCR = styled.h1`
  margin: 0;
  width: 100%;
  padding-bottom: 10px;
`

const CrimeOffenceReference = styled.div`
  display: flex;
  width: 100%;
  flex-direction: row;
  align-items: center;

  .heading {
    font-weight: bold;
  }

  & > * {
    flex: 1;
  }
`

const ChevronContainer = styled.div`
  display: flex;
  justify-content: flex-end;
  flex-grow: inherit;
  align-items: center;
  margin-right: 15px;
`

const Offence = styled.div`
  display: flex;
  flex-direction: column;
  margin: 20px 20px;
  padding-bottom: 12px;
  row-gap: 15px;
  border-bottom: solid 1px ${gdsMidGrey};

  .heading {
    display: flex;
    flex-direction: row;
    margin-bottom: 5px;

    & > span {
      margin-bottom: 0;
    }

    .acpo-code {
      font-weight: normal;
    }

    & > * {
      flex: 1;
    }
  }

  .details {
    display: flex;
    flex-wrap: wrap;
    row-gap: 15px;

    & > * {
      flex-basis: 50%;
    }
  }

  .adjudication {
    margin-bottom: 10px;
  }
`

export { CCR, ChevronContainer, CourtCase, CourtCaseHeader, CourtCaseHeaderContainer, CrimeOffenceReference, Offence }
