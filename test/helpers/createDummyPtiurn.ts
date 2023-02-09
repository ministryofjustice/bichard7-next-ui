import { faker } from "@faker-js/faker"

export default (year: number, orgCode: string): string => {
  return `${orgCode.padEnd(4, "0")}${faker.random.numeric(5, { allowLeadingZeros: true })}${year - 2000}`
}
