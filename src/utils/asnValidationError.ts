import { Exception } from "../types/exceptions"
import { AmendmentRecords } from "../types/Amendments"
import hasAsnException from "./exceptions/hasAsnException"
import { isAsnFormatValid } from "@moj-bichard7-developers/bichard7-next-core/core/phase1/lib/isAsnValid"

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
