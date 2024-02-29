import { AmendmentRecords } from "../types/Amendments"
import { Exception } from "../types/exceptions"
import hasAsnException from "./exceptions/hasAsnException"
import isAsnFormatValid from "./isAsnFormatValid"

const asnValidationError = (exceptions: Exception[], amendments: AmendmentRecords): boolean => {
  if (exceptions.length === 0) {
    return false
  }

  if (hasAsnException(exceptions)) {
    return amendments.asn ? !isAsnFormatValid(amendments?.asn as string) : true
  }

  return Boolean(amendments.asn) && !isAsnFormatValid(amendments?.asn as string)
}

export default asnValidationError
