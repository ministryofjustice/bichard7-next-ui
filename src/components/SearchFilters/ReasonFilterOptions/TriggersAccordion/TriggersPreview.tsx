import { Preview } from "components/Preview"
import { BailCodes } from "utils/bailCodes"

interface BailCodeLineProps {
  bailCode: string
  bailName: string
}

const BailCodeLine = ({ bailCode, bailName }: BailCodeLineProps) => {
  return <li>{`${bailCode} - ${bailName}`}</li>
}

const TriggersPreview = () => {
  return (
    <Preview className={"govuk-!-margin-top-2 govuk-!-margin-bottom-6"}>
      <p>{"Included triggers:"}</p>
      <ul>
        {Object.entries(BailCodes).map(([bailCode, bailName]) => (
          <BailCodeLine key={bailCode} bailCode={bailCode} bailName={bailName} />
        ))}
      </ul>
    </Preview>
  )
}

export default TriggersPreview
