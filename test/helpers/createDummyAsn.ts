import { faker } from "@faker-js/faker"

// see page 48 of https://assets.publishing.service.gov.uk/government/uploads/system/uploads/attachment_data/file/862971/cjs-data-standards-catalogue-6.pdf
export default (year: number, orgCode: string): string => {
  const id = faker.random.numeric(11, { allowLeadingZeros: true })
  const checkCharacter = faker.random.alpha().toUpperCase()
  return `${year - 2000}${orgCode.padEnd(7, "0")}${id}${checkCharacter}`
}
