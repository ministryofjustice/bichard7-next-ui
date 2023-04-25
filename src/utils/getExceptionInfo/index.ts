import exceptions from "./exceptions.json"

type ExceptionInfo = {
  title: string
  description: string
  cause: string
  correctingThisError: string
  avoidingThisError: string
}

const getExceptionInfo = (exceptionCode: string): ExceptionInfo =>
  Object.entries(exceptions).find(([key]) => key == exceptionCode)?.[1] as ExceptionInfo

export default getExceptionInfo
