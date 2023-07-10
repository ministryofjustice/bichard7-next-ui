import { DataSource, IsNull, SelectQueryBuilder } from "typeorm"
import type KeyValuePair from "@moj-bichard7-developers/bichard7-next-core/dist/types/KeyValuePair"
import PromiseResult from "types/PromiseResult"
import { isError } from "types/Result"
import { CaseAgeOptions } from "utils/caseAgeOptions"
import { formatFormInputDateString } from "utils/formattedDate"
import CourtCase from "./entities/CourtCase"
import User from "./entities/User"
import courtCasesByOrganisationUnitQuery from "./queries/courtCasesByOrganisationUnitQuery"

const asKey = (caseAgeOption: string) => caseAgeOption.toLowerCase().replace(/ /g, "")

const getCountOfCasesByCaseAge = async (
  connection: DataSource,
  user: User
): PromiseResult<KeyValuePair<string, number>> => {
  const repository = connection.getRepository(CourtCase)
  let query = repository.createQueryBuilder()
  query = courtCasesByOrganisationUnitQuery(query, user) as SelectQueryBuilder<CourtCase>

  Object.keys(CaseAgeOptions).forEach((slaCaseAgeOption, i) => {
    const key = asKey(slaCaseAgeOption)
    const slaDateFrom = formatFormInputDateString(CaseAgeOptions[slaCaseAgeOption]().from)
    const slaDateTo = formatFormInputDateString(CaseAgeOptions[slaCaseAgeOption]().to)

    const subQuery = repository
      .createQueryBuilder(key)
      .select("COUNT(*)", key)
      .where(`${key}.courtDate >= '${slaDateFrom}' AND ${key}.courtDate <= '${slaDateTo}'`)
      .andWhere({
        resolutionTimestamp: IsNull()
      })
      .getQuery()

    if (i === 0) {
      query.select(`counts${i}.${key}`)
    } else {
      query.addSelect(`counts${i}.${key}`)
    }
    query.from("(" + subQuery + ")", `counts${i}`)
  })

  const response = await query.getRawOne().catch((error: Error) => error)

  return isError(response)
    ? response
    : (Object.keys(CaseAgeOptions).reduce(
        (result: KeyValuePair<string, number>, caseAge: string) => (
          (result[caseAge] = response ? response[asKey(caseAge)] : "0"), result
        ),
        {}
      ) as KeyValuePair<string, number>)
}

export default getCountOfCasesByCaseAge
