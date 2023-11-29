import fs from "fs"

export type GenerateAhoParams = {
  firstName: string
  lastName: string
  ptiurn: string
  courtName: string
}

const generateAho = (params: GenerateAhoParams) => {
  const ahoXml = fs.readFileSync("test/test-data/AnnotatedHOTemplate.xml").toString()
  return ahoXml
    .replaceAll("{FIRSTNAME}", params.firstName)
    .replaceAll("{LASTNAME}", params.lastName)
    .replaceAll("{PTIURN}", params.ptiurn)
    .replaceAll("{COURTNAME}", params.courtName)
}

export default generateAho
