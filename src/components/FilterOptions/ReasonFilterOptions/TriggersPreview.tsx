import { Preview } from "components/Preview"
import { BailCodes } from "utils/bailCodes"

const TriggersPreview = () => {
  return (
    <Preview className={"govuk-!-margin-top-2 govuk-!-margin-bottom-6"}>
      <p>{"Included triggers:"}</p>
      {Object.entries(BailCodes).map(([bailCode, bailName]) => (
        <li key={bailCode}>{`${bailCode} - ${bailName}`}</li>
      ))}
    </Preview>
  )
}

export default TriggersPreview
