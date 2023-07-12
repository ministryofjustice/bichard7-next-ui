import { AnnotatedHearingOutcome } from "@moj-bichard7-developers/bichard7-next-core/dist/types/AnnotatedHearingOutcome"
import { Button } from "govuk-react"
import OffencesTable from "./OffencesTable"
import CaseTable from "./CaseTable"
import DefendantTable from "./DefendantTable"
import isObject from "lodash.isobject"
import { useRouter } from "next/router"
import { useState } from "react"
import { isAmendmentValue, doesUpdateExist, isAmendmentArr, appendNewValue } from "./utils"

import type { AmendmentArrValues, AmendmentValues, IndividualAmendmentValues } from "types/Amendments"

interface Props {
  aho: AnnotatedHearingOutcome
  courtCaseId: number
}

const HearingOutcome: React.FC<Props> = ({ aho, courtCaseId }) => {
  const { basePath, query } = useRouter()
  const [amendments, setAmendements] = useState<Record<string, AmendmentValues>>({})

  const amendFn = (keyToAmend: string) => (newValue: IndividualAmendmentValues) => {
    const updatedIdx =
      Array.isArray(amendments[keyToAmend]) && isAmendmentArr(amendments[keyToAmend]) && isObject(newValue)
        ? doesUpdateExist(amendments[keyToAmend] as AmendmentArrValues, newValue)
        : -1

    const updatedArr =
      Array.isArray(amendments[keyToAmend]) && isObject(newValue)
        ? appendNewValue(newValue, keyToAmend, updatedIdx, amendments)
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
