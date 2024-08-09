import { useCourtCase } from "context/CourtCaseContext"
import { useCallback, useEffect, useState } from "react"
import { GetOffenceMatchingExceptionResult } from "utils/exceptions/getOffenceMatchingException"
import { PncInput } from "./PncSequenceNumber.styles"

interface PncSequenceNumberProps {
  offenceIndex: number
  exception: GetOffenceMatchingExceptionResult
}

const PncSequenceNumber = ({ offenceIndex, exception }: PncSequenceNumberProps): JSX.Element => {
  const { amend, amendments } = useCourtCase()

  const offenceReasonSequence = useCallback(() => {
    const offenceReasonSequenceValue = amendments.offenceReasonSequence?.find((a) => {
      return a.offenceIndex === offenceIndex
    })?.value

    return offenceReasonSequenceValue === undefined ? "" : `${offenceReasonSequenceValue}`
  }, [amendments.offenceReasonSequence, offenceIndex])

  const [selectedValue, setSelectedValue] = useState<string>(offenceReasonSequence())

  useEffect(() => {
    setSelectedValue(offenceReasonSequence())
  }, [offenceReasonSequence])

  const handleOnChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    const offenceReasonSequenceValue = event.target.value
    const offenceReasonSequenceNumber = Number(offenceReasonSequenceValue)

    if (isNaN(offenceReasonSequenceNumber)) {
      return
    }

    amend("offenceReasonSequence")({
      offenceIndex,
      value: offenceReasonSequenceNumber
    })

    setSelectedValue(offenceReasonSequenceValue)
  }

  const classNames = exception?.code
    ? [`${exception.code}-pnc-sequence-number`]
    : [`unknown-exception-pnc-sequence-number`]

  classNames.push("pnc-sequence-number")

  return (
    <PncInput
      type="text"
      maxLength={3}
      className={classNames.join(" ")}
      value={selectedValue}
      onChange={handleOnChange}
    />
  )
}

export default PncSequenceNumber
