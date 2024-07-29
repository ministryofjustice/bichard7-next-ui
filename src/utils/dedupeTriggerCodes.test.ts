import dedupeTriggerCode from "./dedupeTriggerCodes"

describe("dedupeTriggerCodes", () => {
  it("returns returns the short code when long and short codes present for the same trigger", () => {
    const result = dedupeTriggerCode("TRPR0001 PR01")

    expect(result).toBe("PR01")
  })

  it("does not shorten non-duplicated codes", () => {
    const result = dedupeTriggerCode("TRPR0001 PR01 TRPR0002")

    expect(result).toBe("PR01 TRPR0002")
  })

  it("retains the code order", () => {
    const result = dedupeTriggerCode("TRPR0001 TRPR0002 PR01 TRPR0003 PR03")

    expect(result).toBe("TRPR0002 PR01 PR03")
  })
})
