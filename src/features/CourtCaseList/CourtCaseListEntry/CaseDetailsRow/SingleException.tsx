interface SingleExceptionProps {
  exception: string
  exceptionCounter: number
}

export const SingleException = ({ exception, exceptionCounter }: SingleExceptionProps) => (
  <span className="single-exception">
    {exception} <b>{exceptionCounter > 1 ? `(${exceptionCounter})` : ""}</b>
  </span>
)
