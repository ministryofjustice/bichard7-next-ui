interface SingleExceptionProps {
  exception: string
  exceptionCounter: number
}

export const SingleException = ({ exception, exceptionCounter }: SingleExceptionProps) => (
  <span className="single-exception">
    <span className="code">{exception}</span>
    <span className="counter">
      <b> {exceptionCounter > 1 ? `(${exceptionCounter})` : ""}</b>
    </span>
  </span>
)
