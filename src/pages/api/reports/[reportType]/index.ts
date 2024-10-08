import { json2csv } from "json-2-csv"
import withApiAuthentication from "middleware/withApiAuthentication/withApiAuthentication"
import type { NextApiRequest, NextApiResponse } from "next"
import getDataSource from "services/getDataSource"
import listCourtCases from "services/listCourtCases"
import QueryColumns from "services/QueryColumns"
import { Reason } from "types/CaseListQueryParams"
import { isError } from "types/Result"
import { createResolvedExceptionsReportLines } from "utils/reports/createResolvedExceptionsReportLines"
import { ReportType } from "utils/reports/ReportTypes"
import { extractSearchParamsFromQuery } from "utils/validateQueryParams"

export default async (request: NextApiRequest, response: NextApiResponse) => {
  const allowedMethods = ["GET"]
  const auth = await withApiAuthentication(request, response, allowedMethods)

  if (!auth) {
    return
  }

  const { req, res, currentUser } = auth
  const { reportType } = req.query
  const caseListQueryParams = extractSearchParamsFromQuery(req.query, currentUser)

  switch (reportType) {
    case ReportType.RESOLVED_EXCEPTIONS:
      if (!caseListQueryParams.resolvedDateRange) {
        res.status(400).end()
      }
      caseListQueryParams.caseState = "Resolved"
      caseListQueryParams.reason = Reason.Exceptions
      break
    default:
      res.status(404).end()
  }

  const dataSource = await getDataSource()

  const courtCases = await listCourtCases(
    dataSource,
    caseListQueryParams,
    currentUser,
    QueryColumns.ResolvedExceptionsReport
  )

  if (isError(courtCases)) {
    const { message } = courtCases
    return res.status(500).json({ error: message })
  }

  // TODO: handle different report types when we start adding them
  const reportLines = createResolvedExceptionsReportLines(courtCases.result)
  const report = json2csv(reportLines.report, {
    keys: [
      { field: "ASN" },
      { field: "PTIURN" },
      { field: "defendantName", title: "Defendant Name" },
      { field: "courtName", title: "Court Name" },
      { field: "hearingDate", title: "Hearing Date" },
      { field: "caseReference", title: "Case Reference" },
      { field: "dateTimeRecievedByCJSE", title: "Date/Time Received By CJSE" },
      { field: "dateTimeResolved", title: "Date/Time Resolved" },
      { field: "notes", title: "Notes" },
      { field: "resolutionAction", title: "Resolution Action" }
    ]
  })

  res.status(200).json({ report })
}
