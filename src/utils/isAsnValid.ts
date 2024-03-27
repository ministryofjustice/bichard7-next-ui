import { Amendments } from "types/Amendments"
import { Exception } from "types/exceptions"
import isAsnFormatValid from "./isAsnFormatValid"
import isAsnException from "./exceptions/isException/isAsnException"

const isAsnValid = (exceptions: Exception[], asn: Amendments["asn"]) => {
  const hasAsnException = isAsnException(exceptions)
  if (hasAsnException) {
    return !!asn && isAsnFormatValid(asn)
  }

  return !asn || isAsnFormatValid(asn)
}

export default isAsnValid
