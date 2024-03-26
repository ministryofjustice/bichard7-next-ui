import { Amendments } from "types/Amendments"
import isAsnFormatValid from "./isAsnFormatValid"

const isAsnValid = (asn: Amendments["asn"]) => !!asn && isAsnFormatValid(asn)

export default isAsnValid
