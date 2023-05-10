import { Preview } from "components/Preview"
import { useState } from "react"
import ConditionalRender from "components/ConditionalRender"
import { BailCodes } from "utils/bailCodes"
import TriggersPreviewButton from "./TriggersPreviewButton"

const TriggersInformationAccordion = () => {
  const [showTriggersInformation, setShowTriggersInformation] = useState(false)

  return (
    <>
      <TriggersPreviewButton onClick={() => setShowTriggersInformation(!showTriggersInformation)} />
      <ConditionalRender isRendered={showTriggersInformation}>
        <Preview className={"govuk-!-margin-top-2 govuk-!-margin-bottom-6"}>
          <p>{"Included triggers:"}</p>
          {Object.entries(BailCodes).map(([bailCode, bailName]) => (
            <li key={bailCode}>{`${bailCode} - ${bailName}`}</li>
          ))}
        </Preview>
      </ConditionalRender>
    </>
  )
}

export default TriggersInformationAccordion
