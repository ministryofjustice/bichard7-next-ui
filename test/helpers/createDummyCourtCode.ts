import { faker } from "@faker-js/faker"

export default (forceCode: string): string =>
  `B${forceCode}${faker.random.alpha(2).toUpperCase()}${faker.random.numeric(2, { allowLeadingZeros: true })}`
