import { format } from "date-fns"
import { DataSource, SelectQueryBuilder } from "typeorm"
import { CountOfCasesByCaseAgeResult } from "types/CountOfCasesByCaseAgeResult"
import PromiseResult from "types/PromiseResult"
import { isError } from "types/Result"
import { NamedDateRangeOptions } from "utils/namedDateRange"
import CourtCase from "./entities/CourtCase"
import courtCasesByVisibleForcesQuery from "./queries/courtCasesByVisibleForcesQuery"

const getCountOfCasesByCaseAge = async (
  connection: DataSource,
  forces: string[]
): PromiseResult<CountOfCasesByCaseAgeResult> => {
  const repository = connection.getRepository(CourtCase)
  let query = repository.createQueryBuilder()
  query = courtCasesByVisibleForcesQuery(query, forces) as SelectQueryBuilder<CourtCase>

  Object.keys(NamedDateRangeOptions).forEach((slaDateRangeOption, i) => {
    const key = slaDateRangeOption.toLowerCase().replace(" ", "")
    const slaDateFrom = format(NamedDateRangeOptions[slaDateRangeOption]().from, "yyyy-MM-dd")

    const subQuery = repository
      .createQueryBuilder(key)
      .select("COUNT(*)", key)
      .where(`${key}.courtDate = '${slaDateFrom}'`)
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
    : {
        Today: response?.today ?? "0",
        Yesterday: response?.yesterday ?? "0",
        "Day 2": response?.day2 ?? "0",
        "Day 3": response?.day3 ?? "0"
      }
}

export default getCountOfCasesByCaseAge
