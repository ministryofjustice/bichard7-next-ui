export type Amendments = {
  asn?: string
  offenceReasonSequence?: OffenceField<number>[]
  courtCaseReference?: OffenceField<string>[]
  disposalQualifierCode?: UpdatedDisposalQualifierCode[]
  nextSourceOrganisation?: ResultField<string>[]
  nextHearingDate?: UpdatedNextHearingDate[]
  courtPNCIdentifier?: string
  resultVariableText?: UpdatedOffenceResult[]
  courtReference?: string
  courtOffenceSequenceNumber?: UpdatedCourtOffenceSequenceNumber[]
  forceOwner?: string
  noUpdatesResubmit?: boolean
}

export type AmendmentKeys = keyof Amendments
export type Amender = <T extends AmendmentKeys>(amendmentKey: T) => (newValue: Amendments[T]) => void

export type RelevantIndexes = {
  offenceIndex: number
  resultIndex?: number
  resultQualifierIndex?: number
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
  updatedValue: string
}

export type UpdatedOffence = {
  offenceIndex: number
  resultIndex: number
}

export type OffenceField<TValue> = {
  offenceIndex: number
  value: TValue
}

export type ResultField<TValue> = OffenceField<TValue> & {
  resultIndex: number
}

export enum ValidProperties {
  NextResultSourceOrganisation = "NextResultSourceOrganisation",
  NextHearingDate = "NextHearingDate",
  ResultVariableText = "ResultVariableText"
}
