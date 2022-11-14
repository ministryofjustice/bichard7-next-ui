import {
  AnnotatedHearingOutcome,
  Offence
} from "@moj-bichard7-developers/bichard7-next-core/build/src/types/AnnotatedHearingOutcome"
import EditableField from "components/EditableField"
import { Button, Table } from "govuk-react"
import isObject from "lodash.isobject"
import { useRouter } from "next/router"
import { useState } from "react"
import { AmendmentValues, IndividualAmendmentValues } from "types/Amendments"

interface Props {
  aho: AnnotatedHearingOutcome
  courtCaseId: number
}

const getOffenceCode = (offence: Offence): string => {
  if (offence.CriminalProsecutionReference.OffenceReason?.__type === "LocalOffenceReason") {
    return offence.CriminalProsecutionReference.OffenceReason.LocalOffenceCode.OffenceCode
  }
  if (offence.CriminalProsecutionReference.OffenceReason?.__type === "NationalOffenceReason") {
    return offence.CriminalProsecutionReference.OffenceReason?.OffenceCode.FullCode
  }
  return ""
}

const HearingTable: React.FC<{ aho: AnnotatedHearingOutcome }> = ({ aho }) => (
  <Table
    head={
      <Table.Row>
        <Table.CellHeader>{"Name"}</Table.CellHeader>
        <Table.CellHeader>{"Value"}</Table.CellHeader>
      </Table.Row>
    }
    caption="Hearing"
  >
    <Table.Row>
      <Table.Cell>{"Court location"}</Table.Cell>
      <Table.Cell>
        {aho.AnnotatedHearingOutcome.HearingOutcome.Hearing.CourtHearingLocation.OrganisationUnitCode}
      </Table.Cell>
    </Table.Row>
    <Table.Row>
      <Table.Cell>{"Date of hearing"}</Table.Cell>
      <Table.Cell>
        {aho.AnnotatedHearingOutcome.HearingOutcome.Hearing.DateOfHearing instanceof Date
          ? aho.AnnotatedHearingOutcome.HearingOutcome.Hearing.DateOfHearing.toString()
          : aho.AnnotatedHearingOutcome.HearingOutcome.Hearing?.DateOfHearing ?? ""}
      </Table.Cell>
    </Table.Row>
    <Table.Row>
      <Table.Cell>{"Time of hearing"}</Table.Cell>
      <Table.Cell>{aho.AnnotatedHearingOutcome.HearingOutcome.Hearing.TimeOfHearing}</Table.Cell>
    </Table.Row>
    <Table.Row>
      <Table.Cell>{"Defendant present"}</Table.Cell>
      <Table.Cell>{aho.AnnotatedHearingOutcome.HearingOutcome.Hearing.DefendantPresentAtHearing}</Table.Cell>
    </Table.Row>
    <Table.Row>
      <Table.Cell>{"Source reference doc name"}</Table.Cell>
      <Table.Cell>{aho.AnnotatedHearingOutcome.HearingOutcome.Hearing.SourceReference.DocumentName}</Table.Cell>
    </Table.Row>
    <Table.Row>
      <Table.Cell>{"Source reference Id"}</Table.Cell>
      <Table.Cell>{aho.AnnotatedHearingOutcome.HearingOutcome.Hearing.SourceReference.UniqueID}</Table.Cell>
    </Table.Row>
    <Table.Row>
      <Table.Cell>{"Source reference doc type"}</Table.Cell>
      <Table.Cell>{aho.AnnotatedHearingOutcome.HearingOutcome.Hearing.SourceReference.DocumentType}</Table.Cell>
    </Table.Row>
    <Table.Row>
      <Table.Cell>{"Court type"}</Table.Cell>
      <Table.Cell>{aho.AnnotatedHearingOutcome.HearingOutcome.Hearing.CourtType}</Table.Cell>
    </Table.Row>
    <Table.Row>
      <Table.Cell>{"Court house (LJA) code"}</Table.Cell>
      <Table.Cell>{aho.AnnotatedHearingOutcome.HearingOutcome.Hearing.CourtHouseCode}</Table.Cell>
    </Table.Row>
    <Table.Row>
      <Table.Cell>{"Court name"}</Table.Cell>
      <Table.Cell>{aho.AnnotatedHearingOutcome.HearingOutcome.Hearing.CourtHouseName}</Table.Cell>
    </Table.Row>
    <Table.Row>
      <Table.Cell>{"Hearing language"}</Table.Cell>
      <Table.Cell>{aho.AnnotatedHearingOutcome.HearingOutcome.Hearing.HearingLanguage}</Table.Cell>
    </Table.Row>
    <Table.Row>
      <Table.Cell>{"Documentation language"}</Table.Cell>
      <Table.Cell>{aho.AnnotatedHearingOutcome.HearingOutcome.Hearing.HearingDocumentationLanguage}</Table.Cell>
    </Table.Row>
  </Table>
)

const CaseTable: React.FC<{
  aho: AnnotatedHearingOutcome
  amendFn: (keyToAmend: string) => (newValue: IndividualAmendmentValues) => void
}> = ({ aho, amendFn }) => (
  <Table
    head={
      <Table.Row>
        <Table.CellHeader>{"Name"}</Table.CellHeader>
        <Table.CellHeader>{"Value"}</Table.CellHeader>
      </Table.Row>
    }
    caption="Case"
  >
    <Table.Row>
      <Table.Cell>{"PTIURN"}</Table.Cell>
      <Table.Cell>{aho.AnnotatedHearingOutcome.HearingOutcome.Case.PTIURN}</Table.Cell>
    </Table.Row>
    <Table.Row>
      <Table.Cell>{"Force owner"}</Table.Cell>
      <Table.Cell>
        <EditableField
          aho={aho}
          objPath="AnnotatedHearingOutcome.HearingOutcome.Case.ForceOwner.OrganisationUnitCode"
          amendFn={amendFn("forceOwner")}
        />
      </Table.Cell>
    </Table.Row>
    <Table.Row>
      <Table.Cell>{"Court reference"}</Table.Cell>
      <Table.Cell>
        <EditableField
          aho={aho}
          objPath="AnnotatedHearingOutcome.HearingOutcome.Case.CourtReference.MagistratesCourtReference"
          amendFn={amendFn("courtReference")}
        />
      </Table.Cell>
    </Table.Row>
    <Table.Row>
      <Table.Cell>{"Notifiable to PNC"}</Table.Cell>
      <Table.Cell>{aho.AnnotatedHearingOutcome.HearingOutcome.Case.RecordableOnPNCindicator}</Table.Cell>
    </Table.Row>
    <Table.Row>
      <Table.Cell>{"Pre Decision Indicator"}</Table.Cell>
      <Table.Cell>{aho.AnnotatedHearingOutcome.HearingOutcome.Case.PreChargeDecisionIndicator}</Table.Cell>
    </Table.Row>
  </Table>
)

const DefendantTable: React.FC<{
  aho: AnnotatedHearingOutcome
  amendFn: (keyToAmend: string) => (newValue: IndividualAmendmentValues) => void
}> = ({ aho, amendFn }) => (
  <Table
    head={
      <Table.Row>
        <Table.CellHeader>{"Name"}</Table.CellHeader>
        <Table.CellHeader>{"Value"}</Table.CellHeader>
      </Table.Row>
    }
    caption="Defendant"
  >
    <Table.Row>
      <Table.Cell>{"ASN"}</Table.Cell>
      <Table.Cell>
        <EditableField
          aho={aho}
          objPath="AnnotatedHearingOutcome.HearingOutcome.Case.HearingDefendant.ArrestSummonsNumber"
          amendFn={amendFn("asn")}
        />
      </Table.Cell>
    </Table.Row>
    <Table.Row>
      <Table.Cell>{"Court PNCID"}</Table.Cell>
      <Table.Cell>
        <EditableField
          aho={aho}
          objPath="AnnotatedHearingOutcome.HearingOutcome.Case.HearingDefendant.CourtPNCIdentifier"
          amendFn={amendFn("courtPNCIdentifier")}
        />
      </Table.Cell>
    </Table.Row>
    <Table.Row>
      <Table.Cell>{"Title"}</Table.Cell>
      <Table.Cell>
        {aho.AnnotatedHearingOutcome.HearingOutcome.Case.HearingDefendant.DefendantDetail?.PersonName.Title}
      </Table.Cell>
    </Table.Row>
    <Table.Row>
      <Table.Cell>{"Given name"}</Table.Cell>
      <Table.Cell>
        {aho.AnnotatedHearingOutcome.HearingOutcome.Case.HearingDefendant.DefendantDetail?.PersonName.GivenName}
      </Table.Cell>
    </Table.Row>
    <Table.Row>
      <Table.Cell>{"Family name"}</Table.Cell>
      <Table.Cell>
        {aho.AnnotatedHearingOutcome.HearingOutcome.Case.HearingDefendant.DefendantDetail?.PersonName.FamilyName}
      </Table.Cell>
    </Table.Row>
    <Table.Row>
      <Table.Cell>{"PNC filename"}</Table.Cell>
      <Table.Cell>
        {aho.AnnotatedHearingOutcome.HearingOutcome.Case.HearingDefendant.DefendantDetail?.GeneratedPNCFilename}
      </Table.Cell>
    </Table.Row>
    <Table.Row>
      <Table.Cell>{"Birthdate"}</Table.Cell>
      <Table.Cell>
        {aho.AnnotatedHearingOutcome.HearingOutcome.Case.HearingDefendant.DefendantDetail?.BirthDate instanceof Date
          ? aho.AnnotatedHearingOutcome.HearingOutcome.Case.HearingDefendant.DefendantDetail?.BirthDate.toString()
          : aho.AnnotatedHearingOutcome.HearingOutcome.Case.HearingDefendant.DefendantDetail?.BirthDate ?? ""}
      </Table.Cell>
    </Table.Row>
    <Table.Row>
      <Table.Cell>{"Gender"}</Table.Cell>
      <Table.Cell>
        {aho.AnnotatedHearingOutcome.HearingOutcome.Case.HearingDefendant.DefendantDetail?.Gender}
      </Table.Cell>
    </Table.Row>
    <Table.Row>
      <Table.Cell>{"Address line 1"}</Table.Cell>
      <Table.Cell>{aho.AnnotatedHearingOutcome.HearingOutcome.Case.HearingDefendant.Address.AddressLine1}</Table.Cell>
    </Table.Row>
    <Table.Row>
      <Table.Cell>{"Address line 2"}</Table.Cell>
      <Table.Cell>{aho.AnnotatedHearingOutcome.HearingOutcome.Case.HearingDefendant.Address.AddressLine2}</Table.Cell>
    </Table.Row>
    <Table.Row>
      <Table.Cell>{"Remand status"}</Table.Cell>
      <Table.Cell>{aho.AnnotatedHearingOutcome.HearingOutcome.Case.HearingDefendant.RemandStatus}</Table.Cell>
    </Table.Row>
    <Table.Row>
      <Table.Cell>{"Bail condition"}</Table.Cell>
      <Table.Cell>{aho.AnnotatedHearingOutcome.HearingOutcome.Case.HearingDefendant.BailConditions}</Table.Cell>
    </Table.Row>
    <Table.Row>
      <Table.Cell>{"Bail reason"}</Table.Cell>
      <Table.Cell>
        {aho.AnnotatedHearingOutcome.HearingOutcome.Case.HearingDefendant.ReasonForBailConditions}
      </Table.Cell>
    </Table.Row>
  </Table>
)

const OffenceDetails: React.FC<{
  aho: AnnotatedHearingOutcome
  index: number
  amendFn: (keyToAmend: string) => (newValue: IndividualAmendmentValues) => void
}> = ({ aho, index, amendFn }) =>
  aho.AnnotatedHearingOutcome.HearingOutcome.Case.HearingDefendant.Offence[index] && (
    <Table
      key={`offence-details-${index}`}
      head={
        <Table.Row>
          <Table.CellHeader>{"Name"}</Table.CellHeader>
          <Table.CellHeader>{"Value"}</Table.CellHeader>
        </Table.Row>
      }
      caption="Offence Details"
    >
      <Table.Row>
        <Table.Cell>{"Offence Code"}</Table.Cell>
        <Table.Cell>
          {getOffenceCode(aho.AnnotatedHearingOutcome.HearingOutcome.Case.HearingDefendant.Offence[index])}
        </Table.Cell>
      </Table.Row>
      <Table.Row>
        <Table.Cell>{"Title"}</Table.Cell>
        <Table.Cell>
          {aho.AnnotatedHearingOutcome.HearingOutcome.Case.HearingDefendant.Offence[index].OffenceTitle}
        </Table.Cell>
      </Table.Row>
      <Table.Row>
        <Table.Cell>{"Category"}</Table.Cell>
        <Table.Cell>
          {aho.AnnotatedHearingOutcome.HearingOutcome.Case.HearingDefendant.Offence[index].OffenceCategory}
        </Table.Cell>
      </Table.Row>
      <Table.Row>
        <Table.Cell>{"Arrest Date"}</Table.Cell>
        <Table.Cell>
          {aho.AnnotatedHearingOutcome.HearingOutcome.Case.HearingDefendant.Offence[index].ArrestDate?.toString()}
        </Table.Cell>
      </Table.Row>
      <Table.Row>
        <Table.Cell>{"Charge Date"}</Table.Cell>
        <Table.Cell>
          {aho.AnnotatedHearingOutcome.HearingOutcome.Case.HearingDefendant.Offence[index].ChargeDate?.toString()}
        </Table.Cell>
      </Table.Row>
      <Table.Row>
        <Table.Cell>{"Date Code"}</Table.Cell>
        <Table.Cell>
          {aho.AnnotatedHearingOutcome.HearingOutcome.Case.HearingDefendant.Offence[index].ActualOffenceDateCode}
        </Table.Cell>
      </Table.Row>
      <Table.Row>
        <Table.Cell>{"Start Date"}</Table.Cell>
        <Table.Cell>
          {aho.AnnotatedHearingOutcome.HearingOutcome.Case.HearingDefendant.Offence[
            index
          ].ActualOffenceStartDate?.StartDate.toString()}
        </Table.Cell>
      </Table.Row>
      <Table.Row>
        <Table.Cell>{"Location"}</Table.Cell>
        <Table.Cell>
          {aho.AnnotatedHearingOutcome.HearingOutcome.Case.HearingDefendant.Offence[index].LocationOfOffence}
        </Table.Cell>
      </Table.Row>
      <Table.Row>
        <Table.Cell>{"Wording"}</Table.Cell>
        <Table.Cell>
          {aho.AnnotatedHearingOutcome.HearingOutcome.Case.HearingDefendant.Offence[index].ActualOffenceWording}
        </Table.Cell>
      </Table.Row>
      <Table.Row>
        <Table.Cell>{"Recordable on PNC"}</Table.Cell>
        <Table.Cell>
          {aho.AnnotatedHearingOutcome.HearingOutcome.Case.HearingDefendant.Offence[index].RecordableOnPNCindicator}
        </Table.Cell>
      </Table.Row>
      <Table.Row>
        <Table.Cell>{"Notifiable to Home Office"}</Table.Cell>
        <Table.Cell>
          {aho.AnnotatedHearingOutcome.HearingOutcome.Case.HearingDefendant.Offence[index].NotifiableToHOindicator}
        </Table.Cell>
      </Table.Row>
      <Table.Row>
        <Table.Cell>{"Home Office Classification"}</Table.Cell>
        <Table.Cell>
          {aho.AnnotatedHearingOutcome.HearingOutcome.Case.HearingDefendant.Offence[index].HomeOfficeClassification}
        </Table.Cell>
      </Table.Row>
      <Table.Row>
        <Table.Cell>{"Conviction Date"}</Table.Cell>
        <Table.Cell>
          {aho.AnnotatedHearingOutcome.HearingOutcome.Case.HearingDefendant.Offence[index].ConvictionDate?.toString()}
        </Table.Cell>
      </Table.Row>
      <Table.Row>
        <Table.Cell>{"Court Offence Sequence Number"}</Table.Cell>
        <Table.Cell>
          <EditableField
            aho={aho}
            objPath={`AnnotatedHearingOutcome.HearingOutcome.Case.HearingDefendant.Offence[${index}].CourtOffenceSequenceNumber`}
            amendFn={amendFn("courtOffenceSequenceNumber")}
            relevantIndexes={{ offenceIndex: index }}
          />
        </Table.Cell>
      </Table.Row>
      <Table.Row>
        <Table.Cell>{"Committed on Bail"}</Table.Cell>
        <Table.Cell>
          {aho.AnnotatedHearingOutcome.HearingOutcome.Case.HearingDefendant.Offence[index].CommittedOnBail}
        </Table.Cell>
      </Table.Row>
      <Table.Row>
        <Table.Cell>{"Added by the Court"}</Table.Cell>
        <Table.Cell>
          {aho.AnnotatedHearingOutcome.HearingOutcome.Case.HearingDefendant.Offence[index].AddedByTheCourt}
        </Table.Cell>
      </Table.Row>
    </Table>
  )

const ResultsTable: React.FC<{
  aho: AnnotatedHearingOutcome
  offenceIndex: number
  amendFn: (keyToAmend: string) => (newValue: IndividualAmendmentValues) => void
}> = ({ aho, offenceIndex, amendFn }) => (
  <>
    {aho.AnnotatedHearingOutcome.HearingOutcome.Case.HearingDefendant.Offence[offenceIndex].Result.map(
      (_, resultIndex: number) => {
        return (
          <Table
            key={`results-${offenceIndex}`}
            head={
              <Table.Row>
                <Table.CellHeader>{"Name"}</Table.CellHeader>
                <Table.CellHeader>{"Value"}</Table.CellHeader>
              </Table.Row>
            }
            caption="Results"
          >
            <Table.Row>
              <Table.Cell>{"CJS Code"}</Table.Cell>
              <Table.Cell>
                {
                  aho.AnnotatedHearingOutcome.HearingOutcome.Case.HearingDefendant.Offence[offenceIndex].Result[
                    resultIndex
                  ].CJSresultCode
                }
              </Table.Cell>
            </Table.Row>
            <Table.Row>
              <Table.Cell>{"Offence Remand Status"}</Table.Cell>
              <Table.Cell>
                {
                  aho.AnnotatedHearingOutcome.HearingOutcome.Case.HearingDefendant.Offence[offenceIndex].Result[
                    resultIndex
                  ].OffenceRemandStatus
                }
              </Table.Cell>
            </Table.Row>
            <Table.Row>
              <Table.Cell>{"Convicting Court"}</Table.Cell>
              <Table.Cell>
                {
                  aho.AnnotatedHearingOutcome.HearingOutcome.Case.HearingDefendant.Offence[offenceIndex].Result[
                    resultIndex
                  ]?.ConvictingCourt
                }
              </Table.Cell>
            </Table.Row>
            <Table.Row>
              <Table.Cell>{"Result Hearing Type"}</Table.Cell>
              <Table.Cell>
                {
                  aho.AnnotatedHearingOutcome.HearingOutcome.Case.HearingDefendant.Offence[offenceIndex].Result[
                    resultIndex
                  ].ResultHearingType
                }
              </Table.Cell>
            </Table.Row>
            <Table.Row>
              <Table.Cell>{"Result Hearing Date"}</Table.Cell>
              <Table.Cell>
                {aho.AnnotatedHearingOutcome.HearingOutcome.Case.HearingDefendant.Offence[offenceIndex].Result[
                  resultIndex
                ].ResultHearingDate?.toString()}
              </Table.Cell>
            </Table.Row>
            <Table.Row>
              <Table.Cell>{"Next Hearing Location"}</Table.Cell>
              <Table.Cell>{"There is no Next Hearing Location in Results aho"}</Table.Cell>
            </Table.Row>
            <Table.Row>
              <Table.Cell>{"Next Court Type"}</Table.Cell>
              <Table.Cell>
                {
                  aho.AnnotatedHearingOutcome.HearingOutcome.Case.HearingDefendant.Offence[offenceIndex].Result[
                    resultIndex
                  ].NextCourtType
                }
              </Table.Cell>
            </Table.Row>
            <Table.Row>
              <Table.Cell>{"Next Hearing Time"}</Table.Cell>
              <Table.Cell>
                {
                  aho.AnnotatedHearingOutcome.HearingOutcome.Case.HearingDefendant.Offence[offenceIndex].Result[
                    resultIndex
                  ].NextHearingTime
                }
              </Table.Cell>
            </Table.Row>
            <Table.Row>
              <Table.Cell>{"Next Hearing Date"}</Table.Cell>
              <Table.Cell>
                <EditableField
                  aho={aho}
                  objPath={`AnnotatedHearingOutcome.HearingOutcome.Case.HearingDefendant.Offence[${offenceIndex}].Result[${resultIndex}].NextHearingDate`}
                  amendFn={amendFn("nextHearingDate")}
                  relevantIndexes={{ offenceIndex, resultIndex }}
                />
              </Table.Cell>
            </Table.Row>
            <Table.Row>
              <Table.Cell>{"Plea"}</Table.Cell>
              <Table.Cell>
                {
                  aho.AnnotatedHearingOutcome.HearingOutcome.Case.HearingDefendant.Offence[offenceIndex].Result[
                    resultIndex
                  ].PleaStatus
                }
              </Table.Cell>
            </Table.Row>
            <Table.Row>
              <Table.Cell>{"Verdict"}</Table.Cell>
              <Table.Cell>
                {
                  aho.AnnotatedHearingOutcome.HearingOutcome.Case.HearingDefendant.Offence[offenceIndex].Result[
                    resultIndex
                  ].Verdict
                }
              </Table.Cell>
            </Table.Row>
            <Table.Row>
              <Table.Cell>{"Mode of Trail Reason"}</Table.Cell>
              <Table.Cell>
                {
                  aho.AnnotatedHearingOutcome.HearingOutcome.Case.HearingDefendant.Offence[offenceIndex].Result[
                    resultIndex
                  ].ModeOfTrialReason
                }
              </Table.Cell>
            </Table.Row>
            <Table.Row>
              <Table.Cell>{"Text"}</Table.Cell>
              <Table.Cell>
                <EditableField
                  aho={aho}
                  objPath={`AnnotatedHearingOutcome.HearingOutcome.Case.HearingDefendant.Offence[${offenceIndex}].Result[${resultIndex}].ResultVariableText`}
                  amendFn={amendFn("resultVariableText")}
                  relevantIndexes={{ offenceIndex, resultIndex }}
                />
              </Table.Cell>
            </Table.Row>
            <Table.Row>
              <Table.Cell>{"PNC Disposal Type"}</Table.Cell>
              <Table.Cell>
                {
                  aho.AnnotatedHearingOutcome.HearingOutcome.Case.HearingDefendant.Offence[offenceIndex].Result[
                    resultIndex
                  ].PNCDisposalType
                }
              </Table.Cell>
            </Table.Row>
            <Table.Row>
              <Table.Cell>{"Result Class"}</Table.Cell>
              <Table.Cell>
                {
                  aho.AnnotatedHearingOutcome.HearingOutcome.Case.HearingDefendant.Offence[offenceIndex].Result[
                    resultIndex
                  ].ResultClass
                }
              </Table.Cell>
            </Table.Row>
            <Table.Row>
              <Table.Cell>{"Reason for Offence Bail Condition"}</Table.Cell>
              <Table.Cell>
                {
                  aho.AnnotatedHearingOutcome.HearingOutcome.Case.HearingDefendant.Offence[offenceIndex].Result[
                    resultIndex
                  ].ReasonForOffenceBailConditions
                }
              </Table.Cell>
            </Table.Row>
          </Table>
        )
      }
    )}
  </>
)

const OffencesTable: React.FC<{
  aho: AnnotatedHearingOutcome
  amendFn: (keyToAmend: string) => (newValue: IndividualAmendmentValues) => void
}> = ({ aho, amendFn }) => (
  <Table
    head={
      <Table.Row>
        <Table.CellHeader>{"#"}</Table.CellHeader>
        <Table.CellHeader>{"Date"}</Table.CellHeader>
        <Table.CellHeader>{"Code"}</Table.CellHeader>
        <Table.CellHeader>{"Title"}</Table.CellHeader>
        <Table.CellHeader>{"Details"}</Table.CellHeader>
        <Table.CellHeader>{"Results"}</Table.CellHeader>
      </Table.Row>
    }
    caption="Offences"
  >
    {aho.AnnotatedHearingOutcome.HearingOutcome.Case?.HearingDefendant?.Offence?.length > 0 &&
      aho.AnnotatedHearingOutcome.HearingOutcome.Case.HearingDefendant.Offence.map((offence, index) => {
        return (
          <Table.Row key={`offence-${index}`}>
            <Table.Cell>{index + 1}</Table.Cell>
            {/* TODO: check if this is the correct date for offence */}
            <Table.Cell>{offence.ActualOffenceStartDate.StartDate.toString()}</Table.Cell>
            <Table.Cell>{getOffenceCode(offence)}</Table.Cell>
            <Table.Cell>{offence.OffenceTitle}</Table.Cell>

            <Table.Cell>
              <OffenceDetails aho={aho} index={index} amendFn={amendFn} />
            </Table.Cell>
            <Table.Cell>
              <ResultsTable aho={aho} offenceIndex={index} amendFn={amendFn} />
            </Table.Cell>
          </Table.Row>
        )
      })}
  </Table>
)

const isAmendmentValue = (value: unknown): value is AmendmentValues => {
  if (typeof value === "string") {
    return true
  }

  // if it's an array with these specific keys on then it's also an AmendmentValues
  return Array.isArray(value) ? value.every((v) => "offenceIndex" in v && "updatedValue" in v) : false
}

const HearingOutcome: React.FC<Props> = ({ aho, courtCaseId }) => {
  const { basePath, query } = useRouter()
  const [amendments, setAmendements] = useState<Record<string, AmendmentValues>>({})

  const amendFn = (keyToAmend: string) => (newValue: IndividualAmendmentValues) => {
    const doesUpdateExist = (
      amendmentsArr: { offenceIndex: number; resultIndex: number }[],
      value: { offenceIndex: number; resultIndex: number }
    ): number =>
      amendmentsArr.findIndex((update: { offenceIndex: number; resultIndex: number }) => {
        let status = false

        if (update.offenceIndex === value.offenceIndex) {
          status = true
        }

        if (value.resultIndex) {
          if (update.resultIndex === value?.resultIndex) {
            status = true
          } else {
            status = false
          }
        }

        return status
      })

    // @ts-ignore
    const updateIdx = Array.isArray(amendments[keyToAmend]) && doesUpdateExist(amendments[keyToAmend], newValue)

    const updatedArr = Array.isArray(amendments[keyToAmend])
      ? // @ts-ignore
        updateIdx > -1
        ? (amendments[keyToAmend][updateIdx].updatedValue = newValue)
        : [...amendments[keyToAmend].slice(), newValue]
      : [newValue]
    const updatedValue = isObject(newValue) ? updatedArr : newValue

    setAmendements({
      ...amendments,
      ...(isAmendmentValue(updatedValue) && { [keyToAmend]: updatedValue })
    })
  }

  const resubmitCasePath = `${basePath}/court-cases/${courtCaseId}?${new URLSearchParams({
    ...query,
    resubmitCase: "true"
  })}`

  return (
    <>
      <HearingTable aho={aho} />
      <CaseTable aho={aho} amendFn={amendFn} />
      <DefendantTable aho={aho} amendFn={amendFn} />
      <OffencesTable aho={aho} amendFn={amendFn} />
      <form method="post" action={resubmitCasePath}>
        <input type="hidden" name="amendments" value={JSON.stringify(amendments)} />
        <Button id="resubmit" type="submit">
          {"Resubmit"}
        </Button>
      </form>
    </>
  )
}

export default HearingOutcome
