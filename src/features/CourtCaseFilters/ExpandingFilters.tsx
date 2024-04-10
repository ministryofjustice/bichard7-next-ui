/* eslint-disable jsx-a11y/click-events-have-key-events */
/* eslint-disable jsx-a11y/no-static-element-interactions */
import ConditionalDisplay from "components/ConditionalDisplay"
import { ReactNode, useState } from "react"
import styled from "styled-components"
import { blue, grey } from "../../utils/colours"

const Legend = styled.div`
  color: ${blue};
`

const LegendContainer = styled.div`
  margin-top: 8px;
`

const IconButton = styled.button`
  border: 3px solid transparent;
  background-color: transparent;
  &:active: {
    background-color: ${grey};
  }
`

const Container = styled.div`
  margin-left: -10px;
  width: fit-content;
  padding-right: 10px;
  display: flex;
  background-color: transparent;
  &:hover: {
    background-color: ${grey};
  }
  &:active: {
    background-color: ${grey};
  }
`

const UpArrow: React.FC = () => (
  <svg width={18} height={10} viewBox="0 0 18 10" fill="none" xmlns="http://www.w3.org/2000/svg">
    <path d="M0.999926 9.28432L8.74976 1.56866L16.4996 9.28432" stroke="#0B0C0C" strokeWidth={2} />
  </svg>
)

const DownArrow: React.FC = () => (
  <svg width={18} height={11} viewBox="0 0 18 11" fill="none" xmlns="http://www.w3.org/2000/svg">
    <path d="M16.9994 1.26702L9.26685 9L1.49977 1.30171" stroke="#0B0C0C" strokeWidth={2} />
  </svg>
)

interface Props {
  filterName: string
  children: ReactNode
  classNames?: string
}

const ExpandingFilters: React.FC<Props> = ({ filterName, classNames, children }: Props) => {
  const [caseTypeIsVisible, setCaseTypeVisible] = useState(true)

  return (
    <fieldset className="govuk-fieldset">
      <Container
        className={"container"}
        onClick={() => {
          setCaseTypeVisible(!caseTypeIsVisible)
        }}
      >
        <IconButton type="button" className={`icon-button ${classNames}`} aria-label={`${filterName} filter options`}>
          {caseTypeIsVisible ? <UpArrow /> : <DownArrow />}
        </IconButton>
        <LegendContainer className={"legend-container"}>
          <legend className="govuk-fieldset__legend govuk-fieldset__legend--s">
            <Legend>{filterName}</Legend>
          </legend>
        </LegendContainer>
      </Container>
      <ConditionalDisplay isDisplayed={caseTypeIsVisible}>{children}</ConditionalDisplay>
    </fieldset>
  )
}

export default ExpandingFilters
