import getLongTriggerCode from "./getLongTriggerCode"

describe("getLongTriggerCode", () => {
  it("Should return the short version of the trigger code", () => {
    const result = getLongTriggerCode("PR01")

    expect(result).toBe("TRPR0001")
  })

  it("should return passed value when it is not a short trigger code", () => {
    const result = getLongTriggerCode("H0100302")

    expect(result).toBe("H0100302")
  })

  it("Should return the passed value code when trigger code is not a number", () => {
    const result = getLongTriggerCode("INVALID")

    expect(result).toBe("INVALID")
  })

  it("Should return null when value code is null", () => {
    const result = getLongTriggerCode(null)

    expect(result).toBe(null)
  })
})
