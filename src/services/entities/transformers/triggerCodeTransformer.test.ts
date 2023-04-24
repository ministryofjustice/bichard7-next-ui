import triggerCodeTransformer from "./triggerCodeTransformer"

describe("triggerCodeTransformer", () => {
  it("should transform to the new trigger code format", () => {
    const result = triggerCodeTransformer.from("TRPR0001")

    expect(result).toBe("PR01")
  })

  it("should return the actual value when trigger code cannot be transformed", () => {
    const result = triggerCodeTransformer.from("INVALID")

    expect(result).toBe("INVALID")
  })
})
