import { ExceptionCode } from "@moj-bichard7-developers/bichard7-next-core/core/types/ExceptionCode"

import type { AnnotatedHearingOutcome } from "@moj-bichard7-developers/bichard7-next-core/core/types/AnnotatedHearingOutcome"

type Paths = (string | number)[]

const buildExceptionsPath = (paths: Paths): string =>
  paths.reduce((acc: string, item) => (typeof item === "string" ? `${acc}.${item}` : `${acc}[${item}]`), "").slice(1)

const isException = (aho: AnnotatedHearingOutcome, objPath: string): ExceptionCode | null => {
  const stringExpceptionsPath = aho.Exceptions.map(({ path }: { path: Paths }) => buildExceptionsPath(path))
  const resultIndex = stringExpceptionsPath.findIndex((path: string) => path === objPath)

  return resultIndex > -1 ? aho.Exceptions[resultIndex].code : null
}

export default isException
