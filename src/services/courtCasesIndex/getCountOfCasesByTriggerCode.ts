import GroupedTriggerCodes from "@moj-bichard7-developers/bichard7-next-data/dist/types/GroupedTriggerCodes"
import { flatten } from "lodash"
import { getResolutionStatusCodeByText } from "services/entities/transformers/resolutionStatusTransformer"
import { DataSource } from "typeorm"
import { CaseState } from "types/CaseListQueryParams"
import PromiseResult from "types/PromiseResult"
import { isError } from "types/Result"
import CourtCase from "../entities/CourtCase"
import User from "../entities/User"
import courtCasesByOrganisationUnitQuery from "../queries/courtCasesByOrganisationUnitQuery"

const asKey = (caseAgeOption: string) => "_" + caseAgeOption.toLowerCase().replace(/ /g, "")

const getCountOfCasesByTriggerCode = async (
  connection: DataSource,
  user: User,
  caseState: CaseState = "Unresolved"
): PromiseResult<Record<string, number>> => {
  const repository = connection.getRepository(CourtCase)
  let query = repository.createQueryBuilder("courtCase")
  query = courtCasesByOrganisationUnitQuery(query, user).leftJoin("courtCase.triggers", "trigger")

  const triggerStatus = getResolutionStatusCodeByText(caseState)

  flatten(Object.values(GroupedTriggerCodes)).forEach((triggerCode, i) => {
    const key = asKey(triggerCode)

    if (i === 0) {
      query.select(
        `Count(CASE WHEN trigger.trigger_code = '${triggerCode}' AND trigger.status = '${triggerStatus}' THEN 1 END) as ${key}`
      )
    } else {
      query.addSelect(
        `Count(CASE WHEN trigger.trigger_code = '${triggerCode}' AND trigger.status = '${triggerStatus}' THEN 1 END) as ${key}`
      )
    }
  })

  const response = await query.getRawOne().catch((error: Error) => error)

  return isError(response)
    ? response
    : (flatten(Object.values(GroupedTriggerCodes)).reduce(
        (result: Record<string, number>, triggerCode: string) => (
          (result[triggerCode] = response ? response[asKey(triggerCode)] : "0"), result
        ),
        {}
      ) as Record<string, number>)
}

export default getCountOfCasesByTriggerCode
