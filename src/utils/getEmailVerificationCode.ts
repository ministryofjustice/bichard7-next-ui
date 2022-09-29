import getDataSource from "services/getDataSource"
import getUser from "services/getUser"
import { isError } from "types/Result"

const getEmailVerificationCode = async (username: string): Promise<string> => {
  console.log("FIRST")
  const dataSource = await getDataSource()
  console.log("SECOND")
  const user = await getUser(dataSource, username)
  console.log("THIRD")
  console.log(JSON.stringify(user))
  if (!isError(user)) {
    return user?.emailVerificationCode ?? ""
  }
  return ""
}

export default getEmailVerificationCode
