import { NextApiRequest, NextApiResponse } from "next"
import withApiAuthentication from "../../../middleware/withAuthentication/withApiAuthentication"
import type User from "services/entities/User"
import getDataSource from "../../../services/getDataSource"
import { isError } from "../../../types/Result"
import listCourtCases from "../../../services/listCourtCases"
import { validateQueryParams } from "../../../utils/validators/validateQueryParams"
import { reasonOptions } from "utils/reasonOptions"
import caseStateFilters from "utils/caseStateFilters"
import { CaseState, QueryOrder, Reason, Urgency } from "types/CaseListQueryParams"
import { mapCaseAges } from "utils/validators/validateCaseAges"
import { validateDateRange } from "utils/validators/validateDateRange"
import { mapLockFilter } from "utils/validators/validateLockFilter"
import Feature from "../../../types/Feature"

const validateOrder = (param: unknown): param is QueryOrder => param === "asc" || param == "desc"

export default withApiAuthentication(async (req: NextApiRequest, res: NextApiResponse, currentUser: User) => {
  const dataSource = await getDataSource()

  switch (req.method) {
    case "GET":
      // const queryParams: CaseListQueryParams = { maxPageItems: "50" }

      // if (req.query.courtName) {
      //   queryParams.courtName = req.query.courtName as unknown as string
      // }
      // const courtCases = await listCourtCases(dataSource, queryParams, currentUser).catch((error) => error)

      // prettier-ignore
      const {
        orderBy, page, type, keywords, courtName, reasonCode, ptiurn, maxPageItems, order,
        urgency, caseAge, from, to, locked, state, myCases
      } = req.query
      const reasons = [type].flat().filter((t) => reasonOptions.includes(String(t) as Reason)) as Reason[]
      // const caseAges = [caseAge]
      //   .flat()
      //   .filter((t) => Object.keys(CaseAgeOptions).includes(String(t) as string)) as string[]
      const validatedMaxPageItems = validateQueryParams(maxPageItems) ? maxPageItems : "25"
      const validatedPageNum = validateQueryParams(page) ? page : "1"
      const validatedOrderBy = validateQueryParams(orderBy) ? orderBy : "courtDate"
      const validatedOrder: QueryOrder = validateOrder(order) ? order : "desc"
      const validatedCaseAges = mapCaseAges(caseAge)
      const validatedDateRange = validateDateRange({
        from,
        to
      })
      const validatedDefendantName = validateQueryParams(keywords) ? keywords : undefined
      const validatedCourtName = validateQueryParams(courtName) ? courtName : undefined
      const validatedreasonCode = validateQueryParams(reasonCode) ? reasonCode : undefined
      const validatedPtiurn = validateQueryParams(ptiurn) ? ptiurn : undefined
      const validatedUrgent = validateQueryParams(urgency) ? (urgency as Urgency) : undefined
      // const validatedLocked = validateQueryParams(locked) ? locked : undefined
      const validatedCaseState = caseStateFilters.includes(String(state)) ? (state as CaseState) : undefined
      const validatedMyCases = validateQueryParams(myCases) ? currentUser.username : undefined
      const lockedFilter = mapLockFilter(locked)

      const resolvedByUsername =
        validatedCaseState === "Resolved" && !currentUser.hasAccessTo[Feature.ListAllCases]
          ? currentUser.username
          : undefined

      const courtCases = await listCourtCases(
        dataSource,
        {
          ...(validatedDefendantName && { defendantName: validatedDefendantName }),
          ...(validatedCourtName && { courtName: validatedCourtName }),
          ...(validatedreasonCode && { reasonCode: validatedreasonCode }),
          ...(validatedPtiurn && { ptiurn: validatedPtiurn }),
          reasons: reasons,
          urgent: validatedUrgent,
          maxPageItems: validatedMaxPageItems,
          pageNum: validatedPageNum,
          orderBy: validatedOrderBy,
          order: validatedOrder,
          courtDateRange: validatedCaseAges || validatedDateRange,
          locked: lockedFilter,
          caseState: validatedCaseState,
          allocatedToUserName: validatedMyCases,
          resolvedByUsername
        },
        currentUser
      ).catch((error) => error)

      if (!isError(courtCases)) {
        return res.status(200).json(courtCases)
      } else {
        return res.status(500).json({ error: courtCases.message })
      }
  }
})
