import { TableRow } from "features/CourtCaseDetails/Tabs/Panels/TableRow"
import Badge from "./Badge"
import { textSecondary } from "utils/colours"
import { createUseStyles } from "react-jss"

type Props = {
  badge: string
  message: string
  code: string
  colour: string
}

const useStyles = createUseStyles({
  uneditableField: {
    "& .message": {
      color: textSecondary
    },
    "& .qualifier-code": {
      paddingBottom: ".94rem"
    },
    "& .badge": {
      paddingBottom: ".62rem"
    }
  }
})
const UneditableFields = ({ badge, message, code, colour }: Props) => {
  const classes = useStyles()
  const value = (
    <div className={classes.uneditableField}>
      <div className="qualifier-code">{code}</div>
      <div className="badge">
        <Badge isRendered={true} colour={colour} label={badge} />
      </div>
      <div className="message">{message}</div>
    </div>
  )
  return <TableRow label="Code" value={value} />
}

export default UneditableFields
