import { formatName } from "../../../src/helpers/formatName"

describe("formatName", () => {
  it('should replace spaces with "%" and add "%" at the end', () => {
    expect(formatName("John Doe")).toBe("John%Doe%")
  })

  it('should replace "*" with "%" and add "%" at the end', () => {
    expect(formatName("John*Doe")).toBe("John%Doe%")
  })

  it('should not add another "%" if already present at the end', () => {
    expect(formatName("John Doe%")).toBe("John%Doe%")
  })

  it('should add "%" if there are no spaces or special characters', () => {
    expect(formatName("John")).toBe("John%")
  })

  it("should handle empty string", () => {
    expect(formatName("")).toBe("%")
  })
})
