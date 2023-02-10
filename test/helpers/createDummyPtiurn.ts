import { faker } from "@faker-js/faker"

// See page 104 of https://assets.publishing.service.gov.uk/government/uploads/system/uploads/attachment_data/file/862971/cjs-data-standards-catalogue-6.pdf
export default (year: number, orgCode: string): string =>
  `${orgCode.padEnd(4, "0")}${faker.random.numeric(5, { allowLeadingZeros: true })}${year - 2000}`
