import getTriggerWithDescription from "./getTriggerWithDescription"

describe("getTriggerWithDescription", () => {
  it("add short description to a trigger", () => {
    expect(getTriggerWithDescription("TRPR0012")).toStrictEqual("TRPR0012 - Warrant withdrawn")
    expect(getTriggerWithDescription("TRPR0015")).toStrictEqual("TRPR0015 - Personal details changed")
  })
})
