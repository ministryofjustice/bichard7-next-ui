import { Amendments } from "types/Amendments"
import { Exception } from "../types/exceptions"
import hasAsnException from "./exceptions/hasAsnException"
import isAsnFormatValid from "./isAsnFormatValid"

const isAsnValid = (exceptions: Exception[], amendments: Amendments) =>
  !hasAsnException(exceptions) || (!!amendments.asn && isAsnFormatValid(amendments.asn))

export default isAsnValid
