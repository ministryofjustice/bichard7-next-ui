import { Amendments } from "types/Amendments"
import { Exception } from "types/exceptions"
import isAsnException from "./exceptions/isException/isAsnException"
import isAsnFormatValid from "./isAsnFormatValid"

const isAsnUpdated = (exceptions: Exception[], asn: Amendments["asn"]) => {
  const hasAsnException = isAsnException(exceptions)
  if (!hasAsnException) {
    return true
  }

  return !isAsnFormatValid(asn ?? "")
}

export default isAsnUpdated
