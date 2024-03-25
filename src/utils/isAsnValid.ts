import { Amendments } from "types/Amendments"
import isAsnFormatValid from "./isAsnFormatValid"

const isAsnValid = (amendments: Amendments) => !!amendments.asn && isAsnFormatValid(amendments.asn)

export default isAsnValid
