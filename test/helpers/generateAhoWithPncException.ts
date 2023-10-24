import ExceptionCode from "@moj-bichard7-developers/bichard7-next-data/dist/types/ExceptionCode"
import fs from "fs"

const generateAhoWithPncException = (code: ExceptionCode, message: string) => {
  const ahoXml = fs.readFileSync("test/test-data/PncException.xml").toString()
  return ahoXml.replace(/\{PNC_EXCEPTION_CODE\}/g, code.toString()).replace(/\{PNC_EXCEPTION_MESSAGE\}/g, message)
}

export default generateAhoWithPncException
