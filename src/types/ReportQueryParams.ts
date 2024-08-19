export enum CaseDetailsReportType {
  Exceptions,
  Triggers,
  ExceptionsAndTriggers
}
export type ReportQueryParams = {
  from?: string
  to?: string
  caseDetailReportType?: CaseDetailsReportType
}
