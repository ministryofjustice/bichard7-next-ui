/* eslint-disable jsx-a11y/click-events-have-key-events */
/* eslint-disable jsx-a11y/no-static-element-interactions */
import convertAsnToLongFormat from "@moj-bichard7-developers/bichard7-next-core/build/src/enrichAho/enrichFunctions/enrichDefendant/convertAsnToLongFormat"
import { ReactNode } from "react"
import { QueryOrder } from "types/CaseListQueryParams"

const UpArrow: React.FC = () => (
  <svg width={15} height={25} viewBox="0 0 15 25" fill="none" xmlns="http://www.w3.org/2000/svg">
    <path d="M2 14L7.5 5L13 14H2Z" fill="#1D70B8" />
  </svg>
)

const DownArrow: React.FC = () => (
  <svg width={15} height={25} viewBox="0 0 15 25" fill="none" xmlns="http://www.w3.org/2000/svg">
    <path d="M13 11L7.5 20L2 11L13 11Z" fill="#1D70B8" />
  </svg>
)

const Unordered: React.FC = () => (
  <svg width={15} height={25} viewBox="0 0 15 25" fill="none" xmlns="http://www.w3.org/2000/svg">
    <path d="M4 11L7.5 3L11 11H4Z" fill="#1D70B8" />
    <path d="M11 13L7.5 21L4 13L11 13Z" fill="#1D70B8" />
  </svg>
)

interface Props {
  // columnName: string
  children: ReactNode
  order?: QueryOrder
}

const ColumnOrderIcon: React.FC<Props> = ({ children, order }) => {
  console.log("order", order)
  return (
    <>
      {children}
      <Unordered />
    </>
    // initialstate/ default icon of column will be unordered icon
    // logic if asc | desc is not in query= show unordered icon
    // if asc in query show up arrow
    // if desc in query show down arrow.
  )
}

export default ColumnOrderIcon
