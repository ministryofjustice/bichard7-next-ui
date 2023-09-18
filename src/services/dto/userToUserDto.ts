import User from "services/entities/User"

const userToUserDto = (user: User) => {
  const userObj = user.serialize()

  delete userObj.id
  delete userObj.password
  delete userObj.queryStringCookieName

  return userObj
}

export default userToUserDto
