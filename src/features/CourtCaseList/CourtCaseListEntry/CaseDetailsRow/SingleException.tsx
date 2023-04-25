interface SingleExceptionProps {
  exception: string
  exceptionCounter: number
}

export const SingleException = ({ exception, exceptionCounter }: SingleExceptionProps) => (
  <span>
    {exception}
    <b>&nbsp;{exceptionCounter > 1 ? `(${exceptionCounter})` : ""}</b>
    <br />
  </span>
)
