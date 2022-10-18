import { ExceptionCode } from "@moj-bichard7-developers/bichard7-next-core/build/src/types/ExceptionCode"

import type { AnnotatedHearingOutcome } from "@moj-bichard7-developers/bichard7-next-core/build/src/types/AnnotatedHearingOutcome"

const buildExceptionsPath = (paths: string[]): string =>
  paths
    .reduce((acc, item) => {
      return typeof item === "string" ? acc + "." + item : `${acc}[${item}]`
    }, "")
    .slice(1)

const isException = (aho: AnnotatedHearingOutcome, objPath: string): ExceptionCode | null => {
  const stringExpceptionsPath = aho.Exceptions.map(({ path }: { path: Array<string | number> }) =>
    buildExceptionsPath(path as string[])
  )

  const resultIndex = stringExpceptionsPath.findIndex((path) => path === objPath)

  return resultIndex > -1 ? aho.Exceptions[resultIndex].code : null
}

export default isException
