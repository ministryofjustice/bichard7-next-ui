import Asn from "services/Asn"

const isAsnFormatValid = (asn: string): boolean => {
  const asnString = asn.replace(/\//g, "")
  const checkDigitRegex = `[A-HJ-NP-RT-Z]{1}`
  const validFormat = new RegExp(`^\\d{2}[A-Z0-9]{6,7}\\d{11}${checkDigitRegex}$`).test(asnString)
  const validCheckDigit = new Asn(asnString).checkCharacter() === asnString?.slice(-1)
  return validFormat && validCheckDigit
}

export default isAsnFormatValid
