import Asn from "services/Asn"

const isAsnFormatValid = (asn: string): boolean => {
  const validFormat = /^[0-9]{2}[A-Z0-9]{6,7}[0-9]{11}[A-HJ-NP-RT-Z]{1}$/.test(asn)
  const validCheckDigit = new Asn(asn).checkCharacter() === asn.slice(-1)
  return validFormat && validCheckDigit
}

export default isAsnFormatValid
