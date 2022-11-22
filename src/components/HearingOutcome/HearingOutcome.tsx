import { AnnotatedHearingOutcome } from "@moj-bichard7-developers/bichard7-next-core/build/src/types/AnnotatedHearingOutcome"
import { Button } from "govuk-react"
import HearingTable from "./HearingTable"
import OffencesTable from "./OffencesTable"
import CaseTable from "./CaseTable"
import DefendantTable from "./DefendantTable"
import isObject from "lodash.isobject"
import { useRouter } from "next/router"
import { useState } from "react"
import {
  AmendmentArrValues,
  AmendmentValues,
  IndividualAmendmentArrValues,
  IndividualAmendmentValues
} from "types/Amendments"

interface Props {
  aho: AnnotatedHearingOutcome
  courtCaseId: number
}

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
    const doesUpdateExist = (amendmentsArr: AmendmentArrValues, value: IndividualAmendmentArrValues): number =>
      amendmentsArr.findIndex((update: IndividualAmendmentArrValues) => {
        let status = false

        if (update.offenceIndex === value.offenceIndex) {
          status = true
        }

        if ("resultIndex" in value) {
          if ("resultIndex" in update) {
            if (update.resultIndex === value?.resultIndex) {
              status = true
            } else {
              status = false
            }
          } else {
            status = false
          }
        }

        return status
      })

    const isAmendmentArrValue = (value: AmendmentValues, indexToUpdate: number): value is AmendmentArrValues =>
      (value as AmendmentArrValues)[indexToUpdate].updatedValue !== undefined

    const isAmendmentArr = (value: AmendmentValues): value is AmendmentArrValues => typeof value !== "string"

    const appendNewValue = (indexToUpdate: number) => {
      if (indexToUpdate > -1 && isAmendmentArrValue(amendments[keyToAmend], indexToUpdate)) {
        ;(amendments[keyToAmend] as AmendmentArrValues)[indexToUpdate].updatedValue = newValue.updatedValue
        return
      }
      return [...amendments[keyToAmend].slice(), newValue]
    }

    const updatedIdx =
      Array.isArray(amendments[keyToAmend]) && isAmendmentArr(amendments[keyToAmend]) && isObject(newValue)
        ? doesUpdateExist(amendments[keyToAmend] as AmendmentArrValues, newValue)
        : -1

    const updatedArr =
      Array.isArray(amendments[keyToAmend]) && isObject(newValue) ? appendNewValue(updatedIdx) : [newValue]
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
