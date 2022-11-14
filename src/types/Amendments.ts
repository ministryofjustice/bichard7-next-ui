export type Amendments = {
  asn: string
  offenceReasonSequence: UpdatedOffenceValue[]
  courtCaseReference: UpdatedOffenceValue[]
  disposalQualifierCode: UpdatedDisposalQualifierCode[]
  nextSourceOrganisation: UpdatedOffenceResult[]
  nextHearingDate: UpdatedNextHearingDate[]
  courtPNCIdentifier: string
  resultVariableText: UpdatedOffenceResult[]
  courtReference: string
  courtOffenceSequenceNumber: UpdatedCourtOffenceSequenceNumber[]
  forceOwner: string
  noUpdatesResubmit?: boolean
}

export type AmendmentValues =
  | string
  | UpdatedOffenceValue[]
  | UpdatedDisposalQualifierCode[]
  | UpdatedOffenceResult[]
  | UpdatedNextHearingDate[]
  | UpdatedCourtOffenceSequenceNumber[]

export type RawCourtCaseForAmend = {
  phase: number
  annotated_msg: string
  org_for_police_filter: string
  updated_msg: string | null
}

export type UpdatedOffenceValue = {
  offenceIndex: number
  updatedValue: string
}

export type UpdatedCourtOffenceSequenceNumber = {
  offenceIndex: number
  updatedValue: number
}

export type UpdatedDisposalQualifierCode = UpdatedOffenceValue & {
  resultIndex?: number
  resultQualifierIndex: number
}

export type UpdatedOffenceResult = UpdatedOffenceValue & {
  resultIndex: number
}

export type UpdatedNextHearingDate = {
  offenceIndex: number
  resultIndex: number
  updatedValue: Date
}

export type UpdatedOffence = {
  offenceIndex: number
  resultIndex: number
}

export enum ValidProperties {
  NextResultSourceOrganisation = "NextResultSourceOrganisation",
  NextHearingDate = "NextHearingDate",
  ResultVariableText = "ResultVariableText"
}
