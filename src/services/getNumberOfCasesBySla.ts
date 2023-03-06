import { format } from "date-fns"
import { DataSource, SelectQueryBuilder } from "typeorm"
import PromiseResult from "types/PromiseResult"
import { isError } from "types/Result"
import { NamedDateRangeOptions } from "utils/namedDateRange"
import CourtCase from "./entities/CourtCase"
import courtCasesByVisibleForcesQuery from "./queries/courtCasesByVisibleForcesQuery"

const getNumberOfCasesBySla = async (
  connection: DataSource,
  forces: string[]
): PromiseResult<{ countToday: number; countYesterday: number; countDay2: number; countDay3: number }> => {
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
        countToday: response?.today,
        countYesterday: response?.yesterday,
        countDay2: response?.day2,
        countDay3: response?.day3
      }
}

export default getNumberOfCasesBySla
