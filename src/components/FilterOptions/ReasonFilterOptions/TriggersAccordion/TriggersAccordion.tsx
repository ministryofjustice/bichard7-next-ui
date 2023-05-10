import { useState } from "react"
import ConditionalRender from "components/ConditionalRender"
import TriggersPreviewButton from "./TriggersPreviewButton"
import TriggersPreview from "./TriggersPreview"

const TriggersAccordion = () => {
  const [showTriggersInformation, setShowTriggersInformation] = useState(false)

  return (
    <>
      <TriggersPreviewButton onClick={() => setShowTriggersInformation(!showTriggersInformation)} />
      <ConditionalRender isRendered={showTriggersInformation}>
        <TriggersPreview />
      </ConditionalRender>
    </>
  )
}

export default TriggersAccordion
