import { Amendments } from "types/Amendments"
import { Exception } from "types/exceptions"
import isAsnException from "utils/exceptions/isException/isAsnException"
import isAsnFormatValid from "utils/isAsnFormatValid"

const isValidAsn = (exceptions: Exception[], asn: Amendments["asn"]) => {
  const hasAsnException = isAsnException(exceptions)
  if (!hasAsnException) {
    return !!asn && isAsnFormatValid(asn)
  }

  return !asn || isAsnFormatValid(asn)
}

export default isValidAsn
