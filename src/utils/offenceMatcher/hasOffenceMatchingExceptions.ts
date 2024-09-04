import { Exception } from "types/exceptions"
import offenceMatchingExceptions from "./offenceMatchingExceptions"

const filterOffenceMatchingException = (exceptions: Exception[]): Exception[] =>
  exceptions.filter((exception) => offenceMatchingExceptions.offenceNotMatched.includes(exception.code))

const hasOffenceMatchingExceptions = (exceptions: Exception[]) => filterOffenceMatchingException(exceptions).length > 0

export { filterOffenceMatchingException }
export default hasOffenceMatchingExceptions
