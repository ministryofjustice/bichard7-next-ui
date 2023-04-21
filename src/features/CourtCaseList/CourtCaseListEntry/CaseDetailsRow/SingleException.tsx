interface ExceptionProps {
  exception: string
  exceptionCounter: number
}

export const Exception = ({ exception, exceptionCounter }: ExceptionProps) => (
  <span>
    {exception}
    <b>&nbsp;{exceptionCounter > 1 ? `(${exceptionCounter})` : ""}</b>
    <br />
  </span>
)
