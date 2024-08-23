import { Exception } from "types/exceptions"
import { getOffenceMatchingExceptions } from "./getOffenceMatchingException"
import ExceptionCode from "@moj-bichard7-developers/bichard7-next-data/dist/types/ExceptionCode"

describe("getOffenceMatchingExceptions", () => {
  it("returns an empty array when given no exceptions", () => {
    const result = getOffenceMatchingExceptions([])
    expect(result).toEqual([])
  })

  it("returns an empty array when given exception that is not in array of valid values", () => {
    const exception: Exception = { code: ExceptionCode.HO100304, path: ["test"] }
    const result = getOffenceMatchingExceptions([exception])
    expect(result).toEqual([])
  })

  it("returns exception when given exception that is in array of valid values", () => {
    const exception: Exception = { code: ExceptionCode.HO100310, path: ["test"] }
    const result = getOffenceMatchingExceptions([exception])
    expect(result).toEqual([exception])
  })

  it("returns exception when given multiple exceptions and exception is in array of valid values", () => {
    const exceptions: Exception[] = [
      { code: ExceptionCode.HO100304, path: ["test"] },
      { code: ExceptionCode.HO100310, path: ["test"] }
    ]
    const result = getOffenceMatchingExceptions(exceptions)
    expect(result).toEqual([exceptions[1]])
  })
})
