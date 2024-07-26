import getLongTriggerCode from "./getLongTriggerCode"

describe("getLongTriggerCode", () => {
  it("returns the short version of the trigger code", () => {
    const result = getLongTriggerCode("PR01")

    expect(result).toBe("TRPR0001")
  })

  it("handles 'PS' trigger codes", () => {
    const result = getLongTriggerCode("PS08")

    expect(result).toBe("TRPS0008")
  })

  it("returns passed value when it is not a short trigger code", () => {
    const result = getLongTriggerCode("H0100302")

    expect(result).toBe("H0100302")
  })

  it("returns the passed value when trigger code is not a number", () => {
    const result = getLongTriggerCode("INVALID")

    expect(result).toBe("INVALID")
  })

  it("returns null when value is null", () => {
    const result = getLongTriggerCode(null)

    expect(result).toBe(null)
  })

  it("returns null when value is undefined", () => {
    const result = getLongTriggerCode()

    expect(result).toBe(null)
  })
})
