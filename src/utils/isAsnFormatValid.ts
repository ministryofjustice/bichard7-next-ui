import Asn from "services/Asn"

const isAsnFormatValid = (asn: string): boolean => {
  const checkDigit = /[A-HJ-NP-RT-Z]{1}/
  const validFormat = new RegExp(`^\d{2}[A-Z0-9]{6,7}\d{11}${checkDigit}$`).test(asn)
  const validCheckDigit = new Asn(asn).checkCharacter() === asn.slice(-1)
  return validFormat && validCheckDigit
}

export default isAsnFormatValid
