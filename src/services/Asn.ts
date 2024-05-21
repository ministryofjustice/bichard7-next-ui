const intOrString = (input: string): string => (input.match(/^\d*$/) ? input : "")

class Asn {
  public asn: string

  public year: string | undefined

  public force: string | undefined

  public unit: string | undefined

  public system: string | undefined

  public sequence: number | undefined

  constructor(asn: string) {
    this.asn = asn
    const asnString = asn?.replace(/\//g, "")
    if (asnString) {
      this.year = asnString.slice(0, 2)
      this.force = asnString.slice(2, 4)
      this.unit = asnString.slice(4, 6)
      this.system = asnString.slice(6, 8)
      this.sequence = parseInt(asnString.slice(8), 10)
    }
  }

  checkCharacter(): string | undefined {
    try {
      const sequence = this.sequence?.toString().padStart(11, "0")
      const number = `${intOrString(this.force ?? "")}${intOrString(this.system ?? "")}${this.year}${sequence}`
      const modulus = Number(BigInt(number) % BigInt(23))
      return "ZABCDEFGHJKLMNPQRTUVWXY"[modulus]
    } catch (e) {
      return undefined
    }
  }

  toString() {
    return `${this.year}${this.force}${this.unit}${this.system}${
      this.sequence ?? "".toString().padStart(11, "0")
    }${this.checkCharacter()}`
  }

  static divideAsn = (asn: string): string => {
    if (!asn) {
      return ""
    }

    return asn
      .replace(/\//g, "")
      .split("")
      .map((el, i) => {
        if (i === 1 || i === 5 || i === 7) {
          return `${el}/`
        } else {
          return el
        }
      })
      .join("")
  }

  static deleteAsn = (asn: string): string => {
    switch (asn.length) {
      case 11:
        asn = asn.substring(0, 10)
        break
      case 8:
        asn = asn.substring(0, 7)
        break
      case 3:
        asn = asn.substring(0, 2)
        break
      default:
        break
    }
    return asn
  }
}

export default Asn
