import styled from "styled-components"

interface SingleExceptionProps {
  exception: string
  exceptionCounter: number
}

const SingleExceptionWrapper = styled.span`
  white-space: nowrap;
`

export const SingleException = ({ exception, exceptionCounter }: SingleExceptionProps) => (
  <SingleExceptionWrapper className="single-exception">
    {exception} <b>{exceptionCounter > 1 ? `(${exceptionCounter})` : ""}</b>
  </SingleExceptionWrapper>
)
