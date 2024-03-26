import { ExceptionCode } from "@moj-bichard7-developers/bichard7-next-core/core/types/ExceptionCode"
import { Amendments } from "types/Amendments"
import { Exception } from "types/exceptions"
import isAsnFormatValid from "./isAsnFormatValid"

const asnExceptions = [ExceptionCode.HO100206, ExceptionCode.HO100321]

const isAsnValid = (exceptions: Exception[], asn: Amendments["asn"]) => {
  const hasAsnException = exceptions.some((exception) => asnExceptions.includes(exception.code))
  if (hasAsnException) {
    return !!asn && isAsnFormatValid(asn)
  }

  return !asn || isAsnFormatValid(asn)
}

export default isAsnValid
