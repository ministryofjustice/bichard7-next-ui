/* eslint-disable jsx-a11y/click-events-have-key-events */
/* eslint-disable jsx-a11y/no-static-element-interactions */
import If from "components/If"
import { ReactNode } from "react"
import { createUseStyles } from "react-jss"

const useStyles = createUseStyles({
  container: {
    width: "fit-content",
    display: "flex"
  },
  content: {
    display: "inline-block"
  },
  icon: {
    display: "inline-block",
    paddingLeft: "2px"
  }
})

interface Props {
  orderBy: string | string[] | undefined
  currentOrder: string | string[] | undefined
  columnName: string
  children: ReactNode
}

const UpArrow: React.FC = () => {
  return (
    <div>
      <svg width={15} height={25} viewBox="0 0 15 25" fill="none" xmlns="http://www.w3.org/2000/svg">
        <path d="M2 14L7.5 5L13 14H2Z" fill="#1D70B8" />
      </svg>
    </div>
  )
}

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

const ColumnOrderIcons: React.FC<Props> = ({ orderBy, currentOrder, columnName, children }) => {
  const classes = useStyles()
  return (
    <div>
      <If condition={orderBy === undefined || orderBy !== columnName}>
        <div className={classes.container}>
          <div className={classes.content}>{children}</div>
          <div className={classes.icon}>
            <Unordered />
          </div>
        </div>
      </If>
      <If condition={currentOrder === "asc" && orderBy === columnName}>
        <div className={classes.container}>
          <div className={classes.content}>{children}</div>
          <div className={classes.icon}>
            <UpArrow />
          </div>
        </div>
      </If>
      <If condition={currentOrder === "desc" && orderBy === columnName}>
        <div className={classes.container}>
          <div className={classes.content}>{children}</div>
          <div className={classes.icon}>
            <DownArrow />
          </div>
        </div>
      </If>
    </div>
  )
}

export default ColumnOrderIcons
