import { DataSource } from "typeorm"
import User from "../../src/services/entities/User"

export default async (dataSource: DataSource, username: string) => {
  const [forenames, surname] = username.split(".")
  await dataSource.getRepository(User).save({
    username,
    forenames,
    surname,
    email: `${username}@moj.com`,
    password:
      "$argon2id$v=19$m=256,t=20,p=2$TTFCN3BRcldZVUtGejQ3WE45TGFqPT0$WOE+jDILDnVIAt1dytb+h65uegrMomp2xb0Q6TxbkLA",
    visibleForces: [],
    visibleCourts: [],
    excludedTriggers: [],
    featureFlags: {}
  })
}
